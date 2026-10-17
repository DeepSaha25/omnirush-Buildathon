# HustleRadar — Handoff Plan for Next Agent
# Deadline: October 18 2026

## What HustleRadar Is (Read This First)

**HustleRadar is a retail arbitrage scanner for side hustlers / flippers.**

A flipper buys products cheap (Amazon/Flipkart during a sale) and resells on
OLX/Facebook Marketplace at the market median price.

HustleRadar does ONE thing per scan:
1. Scans 8+ retailers live (via SerpApi) for the cheapest buy price
2. Calculates net resale margin after 8% platform fees
3. Runs Gemma 2 (local Ollama) to give an AI verdict: buy / skip / risky

**The project is already built and working. It just needs copy fixes + one UI addition.**

---

## IMPORTANT: The file has CRLF line endings (Windows \r\n)
Use Python `str.replace()` or sed to make changes, NOT direct text editors
that may produce LF-only output. OR use the IDE's built-in edit which
preserves the original line endings.

---

## Task 1 — Fix AppFlow Input Screen Copy
**File:** `apps/web/src/pages/AppFlow.tsx`

### Line 37 — change:
```
>Check a deal</p>
```
to:
```
>Arbitrage scan</p>
```

### Line 38 — change:
```
>Find the right price.</h1>
```
to:
```
>Is it worth the flip?</h1>
```

### Line 39 — change:
```
>Compare the same product across trusted stores, or check the offer you're looking at.</p>
```
to:
```
>Find the cheapest source, calculate net margin after fees, and get a Gemma 2 AI buy signal — in one scan.</p>
```

### Line 52 — change:
```
>Product name or product link</label>
```
to:
```
>Product name or link</label>
```

### Line 55 — change the placeholder attribute value:
```
placeholder="e.g. MacBook M5, or paste a store's product link"
```
to:
```
placeholder="e.g. Sony WH-1000XM5 — find cheapest buy + resale margin"
```

### Line 56 — change:
```
>Know the exact model? Add the size, RAM and storage. Otherwise, we'll help you choose.</p>
```
to:
```
>Be specific — include storage, RAM or colour for the most accurate flip margin.</p>
```

---

## Task 2 — Fix Verdict Labels (consumer → flipper language)
**File:** `apps/web/src/components/DealTools.tsx`

### Lines 9–14 — change the `copy` object:
```
FIND:
    market_overview: { title: 'Here's the price comparison', color: 'text-white' },
    genuine_deal: { title: 'Your price is competitive', color: 'text-green-400' },
    inflated_discount: { title: 'The discount needs a closer look', color: 'text-amber-400' },
    not_actually_cheap: { title: 'You could pay less elsewhere', color: 'text-red-300' },
    insufficient_data: { title: 'Not enough prices to compare yet', color: 'text-zinc-200' },

REPLACE WITH:
    market_overview: { title: 'Live price comparison', color: 'text-white' },
    genuine_deal: { title: 'Worth flipping — good margin', color: 'text-green-400' },
    inflated_discount: { title: 'Tight margin — check carefully', color: 'text-amber-400' },
    not_actually_cheap: { title: 'Skip it — cheaper source exists', color: 'text-red-300' },
    insufficient_data: { title: 'Not enough data to score this flip', color: 'text-zinc-200' },
```

### Line 23 — add a Gemma 2 verdict block AFTER the existing <p> tag (after line 23):
The existing line 23 renders `result.rationale` inline as a paragraph. 
**Leave line 23 as-is.** Instead add a NEW block right after line 24 (`</p>`):

```tsx
      {result.rationale && result.verdict !== 'market_overview' && (
        <div className="mt-4 rounded-xl border-l-2 border-amber-400/50 bg-amber-400/[0.04] pl-4 pr-3 py-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400/70 mb-1.5">AI Analysis · Gemma 2</p>
          <p className="text-sm leading-relaxed text-zinc-300">{result.rationale}</p>
        </div>
      )}
```

Insert this at **line 25** (after the closing `</p>` of the rationale paragraph and before the sellers grid `<div>`).

---

## Task 3 — Fix Stat labels in VerdictHeader for flipper context
**File:** `apps/web/src/components/DealTools.tsx`

### Lines 26–38 (the 3 <Stat> components):

**Stat 1 (line 26)** — change label:
```
FIND:    label="Lowest price found"
REPLACE: label="Cheapest source price"
```

**Stat 2 (line 28)** — change label:
```
FIND:    label="Typical retailer price"
REPLACE: label="Market median (resale floor)"
```

**Stat 2 hint (line 29)** — change hint:
```
FIND:    hint="Middle price across matching retailers"
REPLACE: hint="Median across all matching retailers"
```

**Stat 3 CTA button (line 42)** — change button text:
```
FIND:    >Check my offer price</button>
REPLACE: >Calculate flip margin</button>
```

---

## Task 4 — Update Landing Page CTA Buttons
**File:** `apps/web/src/pages/Landing.tsx`

### Line 75 — change hero CTA label:
```
FIND:    label="CHECK DEAL"
REPLACE: label="SCAN A FLIP"
```

### Line 268 — change footer CTA label:
```
FIND:    label="GET STARTED"
REPLACE: label="SCAN A FLIP"
```

---

## Task 5 — Verify Gemma 2 fires on every scan (not just price-check mode)
**File:** `apps/server/src/routes/checkDeal.ts`

Search for where `generateRationale` or `queryGemmaModel` is called.
If it's inside an `if (claimedPrice)` block, move it OUTSIDE so it runs
for every scan. The rationale should always be populated.

---

## Task 6 — Run TypeScript check + confirm build is clean
```bash
cd /Users/deepsaha/Documents/projects/HustleRadar
npx tsc --project apps/web/tsconfig.json --noEmit
npx tsc --project apps/server/tsconfig.json --noEmit
```
Both must show 0 errors.

---

## Task 7 — Hard refresh the browser
After all edits, go to http://localhost:5173 and press Cmd+Shift+R.

**What you should see:**
- `/` Landing: Hero says "Find the flip — before anyone else does."
  CTA button says "SCAN A FLIP"
- `/app` Input screen: "Arbitrage scan" label, "Is it worth the flip?" headline
  Toggles: "Find cheapest source" | "Flip margin check"
  Placeholder: "e.g. Sony WH-1000XM5..."
- `/app` (after a search): Verdict says "Worth flipping" or "Skip it"
  A new amber-bordered block shows the Gemma 2 AI analysis text

---

## What Is Already Done (Do NOT redo)

| Feature | Status |
|---|---|
| HustleRadar branding everywhere | DONE |
| Arbitrage Radar cashflow bar component | DONE |
| Gemma 2 / Ollama integration in backend | DONE |
| SerpApi live price scanning | DONE (core feature) |
| render.yaml for Render deploy | DONE |
| Problem cards — flipper language | DONE |
| How It Works — "Three Steps to Your Next Flip" | DONE |
| Hero headline — "Find the flip" | DONE |
| Toggle labels — "Find cheapest source" / "Flip margin check" | DONE |
| CTA footer hint — "Live data · 8+ retailers · Gemma 2 AI" | DONE |
| "Popular flips to try" + "Scan another flip" | DONE |

---

## Project Structure (for context)

```
HustleRadar/                        ← root (git repo name, ignore it)
├── apps/
│   ├── web/src/
│   │   ├── pages/
│   │   │   ├── AppFlow.tsx         ← input + results screen
│   │   │   └── Landing.tsx         ← landing page
│   │   └── components/
│   │       ├── DealTools.tsx       ← VerdictHeader, RetailerComparison, ArbitrageRadar
│   │       ├── ProblemShaderCards.tsx  ← "6 ways flippers lose money"
│   │       ├── HowItWorksBooksShowcase.tsx  ← "Three Steps to Your Next Flip"
│   │       └── AnimatedTopDockNavbar.tsx    ← top nav (already HustleRadar)
│   └── server/src/
│       ├── routes/checkDeal.ts     ← main API route
│       └── services/llmClient.ts   ← Gemma 2 + Ollama integration
├── .env                            ← GEMMA_MODEL_NAME=gemma2:9b
└── render.yaml                     ← Render deploy config
```

---

## One-Sentence Pitch (for DEV.to post)

> HustleRadar is an open-source retail arbitrage agent that scans live Indian
> retailer prices, calculates your net resale margin after platform fees, and
> uses Google Gemma 2 running locally to tell you whether a deal is worth
> flipping — in under 60 seconds.
