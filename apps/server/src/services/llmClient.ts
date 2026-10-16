import axios from "axios";
import {
  ArbitrageOpportunity,
  Confidence,
  HistoricalSignal,
  SellerPrice,
  VerdictType,
} from "../types";

export interface RationaleParams {
  verdict: VerdictType;
  confidence: Confidence;
  claimedPrice?: number;
  claimedOriginalPrice?: number;
  cheapestSeller: SellerPrice | null;
  medianPrice: number | null;
  historicalMentions: HistoricalSignal[];
  productTitle: string;
  reasons?: string[];
  arbitrage?: ArbitrageOpportunity;
}

const formatPrice = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

/**
 * Deterministic evidence-backed rationale generator.
 * Used as primary truth baseline or fallback if local/cloud Gemma is unreachable.
 */
function generateDeterministicRationale(params: RationaleParams): string {
  const {
    verdict,
    claimedPrice,
    claimedOriginalPrice,
    cheapestSeller,
    medianPrice,
    historicalMentions,
    arbitrage,
  } = params;

  let baseText = "";
  if (verdict === "market_overview") {
    if (arbitrage && arbitrage.opportunityScore !== "UNPROFITABLE") {
      return `Market median is ${formatPrice(medianPrice!)}. Sourcing at ${formatPrice(cheapestSeller?.price ?? 0)} from ${cheapestSeller?.name ?? "lowest seller"} leaves ~${formatPrice(arbitrage.netProfit)} net margin (${arbitrage.marginPercent}% after 8% fees).`;
    }
    return medianPrice
      ? `Market median across competing stores is ${formatPrice(medianPrice)}.`
      : "No competing store prices available for comparison.";
  } else if (verdict === "insufficient_data") {
    baseText = `Insufficient verified INR seller evidence to guarantee deal authenticity${claimedPrice ? ` at ${formatPrice(claimedPrice)}` : ""}. Treat this report as preliminary.`;
  } else if (verdict === "genuine_deal") {
    if (cheapestSeller && claimedPrice !== undefined) {
      baseText =
        claimedPrice <= cheapestSeller.price * 1.02
          ? `At ${formatPrice(claimedPrice)}, this offer is at the market floor, matched by ${cheapestSeller.name} at ${formatPrice(cheapestSeller.price)}.`
          : `At ${formatPrice(claimedPrice)}, this offer is competitive against the market median of ${formatPrice(medianPrice!)}. Lowest detected listing is ${cheapestSeller.name} at ${formatPrice(cheapestSeller.price)}.`;
    } else {
      baseText = `Available seller evidence places this offer around the prevailing market range${medianPrice ? ` (median: ${formatPrice(medianPrice)})` : ""}.`;
    }
  } else if (verdict === "inflated_discount") {
    const context = historicalMentions[0];
    baseText = `The advertised reference price of ${claimedOriginalPrice ? formatPrice(claimedOriginalPrice) : "the original MRP"} inflates perceived savings beyond current market truth. ${context ? `${context.source} recorded ${formatPrice(context.mentionedPrice)} on ${context.date}.` : "Compare live competitor prices rather than relying on promotional strike-throughs."}`;
  } else {
    baseText = `The claimed price of ${claimedPrice ? formatPrice(claimedPrice) : "this offer"} is higher than competitive store listings. ${cheapestSeller ? `${cheapestSeller.name} is currently available at ${formatPrice(cheapestSeller.price)}.` : "More seller evidence is needed."}`;
  }

  if (arbitrage && arbitrage.opportunityScore !== "UNPROFITABLE") {
    baseText += ` Arbitrage outlook: ${arbitrage.hustleAdvice}`;
  }

  return baseText;
}

/**
 * Invokes Google Gemma 2 (open-weights) via local Ollama or Open-Inference endpoint.
 * Gemma evaluates the deal strictly within the bounds of verified SerpApi market data,
 * providing both deal authenticity and retail arbitrage advice for side hustlers.
 */
async function queryGemmaModel(params: RationaleParams): Promise<string | null> {
  if (/^(?:0|false|off|no)$/i.test(process.env.ENABLE_LLM?.trim() ?? "")) {
    return null;
  }

  const gemmaUrl =
    process.env.GEMMA_API_URL ||
    (process.env.OLLAMA_BASE_URL
      ? `${process.env.OLLAMA_BASE_URL}/api/generate`
      : "http://127.0.0.1:11434/api/generate");

  const groqApiKey = process.env.GROQ_API_KEY;
  const googleApiKey = process.env.GEMMA_API_KEY || process.env.GOOGLE_AI_KEY || process.env.GEMINI_API_KEY;

  const prompt = `You are HustleRadar's open-source deal auditor and retail arbitrage advisor powered by Google Gemma 2.
Evaluate this product deal strictly using the verified market evidence below. Do NOT hallucinate prices or retailers.

Product: ${params.productTitle}
Verdict: ${params.verdict} (Confidence: ${params.confidence})
Claimed Price: ${params.claimedPrice ? formatPrice(params.claimedPrice) : "None"}
Reference/MRP: ${params.claimedOriginalPrice ? formatPrice(params.claimedOriginalPrice) : "None"}
Market Median Price: ${params.medianPrice ? formatPrice(params.medianPrice) : "Unknown"}
Lowest Listing: ${params.cheapestSeller ? `${params.cheapestSeller.name} at ${formatPrice(params.cheapestSeller.price)}` : "None"}
Arbitrage Net Profit Potential: ${params.arbitrage ? formatPrice(params.arbitrage.netProfit) : "N/A"} (${params.arbitrage?.marginPercent ?? 0}% margin)

Provide a concise, 2-3 sentence verdict for side-hustlers and buyers:
1. Is the advertised discount genuine or an inflated marketing trick?
2. Is there viable retail arbitrage / resale margin after 8% marketplace fees?
Keep tone objective, analytical, and direct.`;

  // 1. Try local Ollama if configured as primary provider or if no cloud keys
  const preferOllama = process.env.OPEN_MODEL_PROVIDER === "ollama" || (!groqApiKey && !googleApiKey);
  if (preferOllama) {
    try {
      const model = process.env.GEMMA_MODEL_NAME || process.env.OPEN_MODEL_NAME || "gemma2:9b";
      const timeout = Number(process.env.OPEN_MODEL_TIMEOUT_MS) || 20000;
      const resp = await axios.post(
        gemmaUrl,
        {
          model,
          prompt,
          stream: false,
          options: { temperature: 0.2, num_predict: 120 },
        },
        { timeout },
      );
      const text = resp.data?.response?.trim();
      if (text) return text;
    } catch {
      // Fall through to cloud fallbacks
    }
  }

  // 2. Try Groq with open-weight Gemma 2 9B if key exists
  if (groqApiKey) {
    try {
      const resp = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "gemma2-9b-it",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150,
          temperature: 0.2,
        },
        {
          headers: { Authorization: `Bearer ${groqApiKey}` },
          timeout: 3500,
        },
      );
      const text = resp.data?.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch {
      // Fall through to next provider
    }
  }

  // 3. Try Google AI Studio with open-weight Gemma 2 if key exists
  if (googleApiKey) {
    try {
      const resp = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemma-2-9b-it:generateContent?key=${googleApiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 150, temperature: 0.2 },
        },
        { timeout: 3500 },
      );
      const text = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) return text;
    } catch {
      // Fall through to local Ollama if not already tried
    }
  }

  // 4. Fallback to local Ollama if not preferred initially
  if (!preferOllama) {
    try {
      const model = process.env.GEMMA_MODEL_NAME || process.env.OPEN_MODEL_NAME || "gemma2:9b";
      const timeout = Number(process.env.OPEN_MODEL_TIMEOUT_MS) || 20000;
      const resp = await axios.post(
        gemmaUrl,
        {
          model,
          prompt,
          stream: false,
          options: { temperature: 0.2, num_predict: 120 },
        },
        { timeout },
      );
      const text = resp.data?.response?.trim();
      if (text) return text;
    } catch {
      // Local Ollama not active; return null to trigger deterministic baseline
    }
  }

  return null;
}

export async function generateRationale(
  params: RationaleParams,
): Promise<string> {
  const gemmaRationale = await queryGemmaModel(params);
  if (gemmaRationale) {
    return gemmaRationale;
  }
  return generateDeterministicRationale(params);
}
