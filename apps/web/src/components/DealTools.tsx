import { useMemo, useState } from "react";
import type { CheckDealResult } from "../lib/types";

const fmt = (n: number | null | undefined) =>
  n == null ? "—" : "₹" + Math.round(n).toLocaleString("en-IN");

export function VerdictHeader({ result, onAddPrice }: { result: CheckDealResult; onAddPrice?: () => void }) {
  const copy = {
    market_overview: { title: 'Live Price Comparison', color: 'text-white' },
    genuine_deal: { title: 'Worth Flipping — High Margin', color: 'text-emerald-400' },
    inflated_discount: { title: 'Tight Margin — Check Carefully', color: 'text-amber-400' },
    not_actually_cheap: { title: 'Skip It — Cheaper Source Exists', color: 'text-red-400' },
    insufficient_data: { title: 'Not Enough Data to Score', color: 'text-zinc-300' },
  }[result.verdict];
  const hasComparison = result.sellers.length >= 2;

  const cleanRationale = result.rationale
    ? result.rationale.replace(/\[HustleRadar Arbitrage:\s*/g, '').replace(/\]/g, '').trim()
    : null;

  return (
    <section className="deal-surface p-4 sm:p-5" aria-label="Price summary">
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <h2 className={`text-base font-semibold sm:text-lg ${copy.color}`}>{copy.title}</h2>
        <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-zinc-400 border border-white/[0.08]">
          {result.sellers.length} {result.sellers.length === 1 ? 'retailer' : 'retailers'}
        </span>
      </div>

      {cleanRationale && (
        <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.04] px-3.5 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse" />
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">AI Analysis · Gemma 2</p>
          </div>
          <p className="text-xs leading-relaxed text-zinc-300">{cleanRationale}</p>
        </div>
      )}

      {result.sellers.length > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <Stat
            label="Cheapest Source"
            value={fmt(result.cheapestSeller?.price)}
            hint={result.cheapestSeller?.name ?? 'Best offer'}
            accent="green"
          />
          <Stat
            label="Market Median"
            value={hasComparison ? fmt(result.medianPrice) : '—'}
            hint="Resale floor"
          />
          <Stat
            label={result.product.claimedPrice ? 'Your Offer' : 'Stores Matched'}
            value={
              result.product.claimedPrice ? fmt(result.product.claimedPrice) : `${result.sellers.length} stores`
            }
            hint={
              result.product.claimedPrice && result.marketDiscountPercent != null
                ? `${Math.abs(result.marketDiscountPercent)}% ${result.marketDiscountPercent >= 0 ? 'below' : 'above'} median`
                : 'Live verified'
            }
          />
        </div>
      )}

      <div className="mt-3.5 flex flex-col gap-2 sm:flex-row sm:items-center">
        {result.cheapestSeller && (
          <a
            href={result.cheapestSeller.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-center text-xs font-semibold text-black transition hover:bg-amber-300 sm:w-auto"
          >
            <span>View lowest at {result.cheapestSeller.name}</span>
            <span>↗</span>
          </a>
        )}
        {!result.product.claimedPrice && hasComparison && onAddPrice && (
          <button
            type="button"
            onClick={onAddPrice}
            className="rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-white transition hover:border-amber-400 hover:text-amber-300 sm:w-auto"
          >
            Calculate flip margin
          </button>
        )}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
  accent = "white",
}: {
  label: string;
  value: string;
  hint: string;
  accent?: "white" | "green" | "amber";
}) {
  const color =
    accent === "green" ? "#34d399" : accent === "amber" ? "#fbbf24" : "#ffffff";
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 transition hover:border-white/15">
      <div className="text-[11px] font-medium text-zinc-400">
        {label}
      </div>
      <div className="mt-1 text-base font-bold tracking-tight" style={{ color }}>
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-zinc-400">{hint}</div>
    </div>
  );
}

export function SourceCoverage({ result }: { result: CheckDealResult }) {
  if (!result.sources?.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-zinc-500">
      <span className="mr-1 uppercase tracking-widest text-zinc-600">
        Evidence coverage
      </span>
      {result.sources.map((source) => (
        <span
          key={source.id}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${source.status === "error" ? "bg-red-400" : source.status === "demo" ? "bg-amber-400" : source.status === "empty" ? "bg-zinc-600" : "bg-green-400"}`}
          />
          {source.label} · {source.count}
        </span>
      ))}
    </div>
  );
}

const priceSourceLabel = (seller: CheckDealResult['sellers'][number]) =>
  seller.priceSource === 'retailer_page' ? 'Read from the store page' : seller.priceSource === 'google_shopping' ? 'Found on Google Shopping' : seller.priceSource === 'demo' ? 'Demo price' : 'Found in Google search · confirm at checkout';

export function RetailerComparison({ result, onSelect }: { result: CheckDealResult; onSelect: (query: string) => void }) {
  const choosing = result.comparison?.status === 'needs_selection';
  const [family, setFamily] = useState('All models');
  const variants = result.comparison?.variants ?? [];
  const families = [...new Set(variants.map((variant) => variant.title.split(' · ')[0]))];
  if (choosing) return (
    <section className="deal-surface p-5 sm:p-6" aria-label="Choose a product model">
      <p className="text-xs font-medium uppercase tracking-wider text-amber-400">One quick choice</p>
      <h2 className="mt-2 text-xl font-semibold text-white">Which model do you want?</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">“{result.product.title}” matches a few different versions. Choose yours so we compare the same product across stores.</p>
      {families.length > 1 && <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter models">
        {['All models', ...families].map((name) => <button key={name} type="button" aria-pressed={family === name} onClick={() => setFamily(name)} className={`rounded-lg border px-3 py-2 text-xs ${family === name ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-white/15 text-zinc-300 hover:border-white/40'}`}>{name}</button>)}
      </div>}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {variants.filter((variant) => family === 'All models' || variant.title.split(' · ')[0] === family).map((variant) => {
          const [name, ...specs] = variant.title.split(' · ');
          return <button key={variant.id} type="button" onClick={() => onSelect(variant.query)} className="flex flex-col rounded-xl border border-white/15 bg-white/[0.025] p-4 text-left transition-colors hover:border-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">
            <span className="text-base font-semibold text-white">{name}</span>
            {!!specs.length && <span className="mt-2 text-sm text-zinc-300">{specs.join(' · ')}</span>}
            <span className="mt-3 text-xs text-zinc-400">{variant.sellerCount} store{variant.sellerCount === 1 ? '' : 's'} found · prices from {fmt(variant.lowestPrice)}</span>
            <span className="mt-4 text-sm font-medium text-amber-400">Compare this model →</span>
          </button>;
        })}
      </div>
      <p className="mt-4 text-xs text-zinc-400">Not sure? Find the model, memory and storage on the product page, then use “Edit search” above.</p>
    </section>
  );
  const sorted = [...result.sellers].sort((a, b) => a.price - b.price);
  return (
    <section className="deal-surface p-5 sm:p-6" aria-label="Retailer price comparison">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">Prices by store</h2>
        <span className="text-xs text-zinc-400">Lowest price first</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-400">Same model and specifications. Delivery and conditional discounts may change the checkout total.</p>
      {result.sellers.length > 0 && (
        <div className="mt-4 divide-y divide-white/10">
          {sorted.map((seller, index) => (
            <div key={seller.name} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-white">{seller.name}</span>
                  {seller.price === sorted[0]?.price && <span className="rounded bg-green-500/10 px-2 py-0.5 text-xs text-green-400">Lowest price</span>}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">{priceSourceLabel(seller)}</p>
                <details className="mt-2 text-xs text-zinc-400"><summary className="cursor-pointer hover:text-white">Listing details</summary><p className="mt-2 leading-relaxed">{seller.title}</p><p className="mt-1">{seller.availability === 'in_stock' ? 'Listed in stock' : 'Confirm stock at checkout'}{seller.delivery ? ` · ${seller.delivery}` : ''}</p></details>
              </div>
              <div className="flex w-full shrink-0 items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-4">
                <strong className="text-lg text-white">{fmt(seller.price)}</strong>
                <a href={seller.link} target="_blank" rel="noopener noreferrer" aria-label={`View product at ${seller.name}`} className="rounded-lg border border-white/15 px-4 py-2.5 text-sm text-amber-400 hover:border-amber-400">Visit store ↗</a>
              </div>
            </div>
          ))}
        </div>
      )}
      {!choosing && !result.sellers.length && <p className="mt-4 text-sm text-zinc-300">No matching product prices were found. Include the exact model and specifications, or use a product-page link.</p>}
      <p className="mt-4 border-t border-white/10 pt-4 text-xs text-zinc-400">{result.mode === 'demo' ? 'Offline demo prices.' : `Checked ${new Date(result.evidenceObservedAt ?? result.checkedAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}${result.fromCache ? ' · recently saved search' : ''}.`} Confirm the final price at checkout.</p>
    </section>
  );
}

export function SearchDetails({ result }: { result: CheckDealResult }) {
  return <details className="deal-surface p-5 text-sm text-zinc-300">
    <summary className="cursor-pointer font-medium text-white">Sources & search details</summary>
    <div className="mt-4 space-y-4">
      <p>Comparison confidence: <strong>{result.confidence}</strong>. {result.excludedCount} unsuitable or duplicate listings were excluded.</p>
      <SourceCoverage result={result} />
      <div className="grid gap-2 sm:grid-cols-2">{result.retailers?.map((store) => <a key={store.id} href={store.searchUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 p-3 text-xs hover:border-amber-400/50"><span className="font-medium text-white">{store.name} ↗</span><span className="mt-1 block text-zinc-400">{store.count ? 'Matching price found' : store.status === 'error' ? 'Search unavailable' : 'No matching price found'}</span></a>)}</div>
      {!!result.warnings.length && <ul className="list-disc space-y-2 pl-4 text-xs leading-relaxed text-zinc-400">{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}
      <p className="text-xs text-zinc-400">Sources checked {new Date(result.evidenceObservedAt ?? result.checkedAt).toLocaleString('en-IN')}. {result.fromCache ? 'Evidence is cached for up to 10 minutes. Refresh prices to check again.' : ''}</p>
    </div>
  </details>;
}

export function ReportActions({ result }: { result: CheckDealResult }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const text = result.comparison?.status === 'needs_selection' ? `HustleRadar found multiple models for ${result.product.title}. Choose a model to compare its prices.` : `HustleRadar for ${result.product.title}: ${result.cheapestSeller ? `Lowest found ${fmt(result.cheapestSeller.price)} at ${result.cheapestSeller.name}.` : 'Not enough matching prices found.'}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard permissions are optional */
    }
  };
  const download = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `hustleradar-${result.product.title.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={copy}
        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300 transition hover:border-amber-500/40 hover:text-white"
      >
        {copied ? "✓ Copied" : "Copy summary"}
      </button>
      <button
        type="button"
        onClick={download}
        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300 transition hover:border-amber-500/40 hover:text-white"
      >
        ↓ Download JSON
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300 transition hover:border-amber-500/40 hover:text-white"
      >
        Print report
      </button>
    </div>
  );
}

export function PriceScenario({ result }: { result: CheckDealResult }) {
  const [price, setPrice] = useState(
    result.product.claimedPrice ? String(result.product.claimedPrice) : "",
  );
  const [delivery, setDelivery] = useState("0");
  const [coupon, setCoupon] = useState("0");
  const effective =
    Number(price || 0) + Number(delivery || 0) - Number(coupon || 0);
  const median = result.medianPrice ?? 0;
  const marketDelta =
    median > 0 && effective > 0
      ? Math.round(((median - effective) / median) * 100)
      : null;
  const saved =
    result.cheapestSeller?.price && effective > 0
      ? Math.max(0, Math.round(effective - result.cheapestSeller.price))
      : null;
  const label = useMemo(
    () =>
      marketDelta == null
        ? "Enter a price to test it"
        : marketDelta >= 0
          ? `${marketDelta}% below market median`
          : `${Math.abs(marketDelta)}% above market median`,
    [marketDelta],
  );
  if (result.comparison?.status === 'needs_selection' || result.sellers.length < 2) return null;
  return (
    <section className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
            Price calculator
          </div>
          <h3 className="mt-1 text-lg font-semibold text-white">
            Include delivery or a coupon
          </h3>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-zinc-500">
          Test delivery fees or a coupon without changing the live evidence
          above.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500">
          Offer price
          <input
            aria-label="Scenario offer price"
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="₹ price"
            className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
          />
        </label>
        <label className="text-[10px] uppercase tracking-widest text-zinc-500">
          Delivery
          <input
            aria-label="Scenario delivery fee"
            type="number"
            min="0"
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
          />
        </label>
        <label className="text-[10px] uppercase tracking-widest text-zinc-500">
          Coupon
          <input
            aria-label="Scenario coupon amount"
            type="number"
            min="0"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
        <div>
          <span className="text-xs text-zinc-500">
            Effective checkout price
          </span>
          <strong className="ml-3 text-lg text-white">
            {effective > 0 ? fmt(effective) : "—"}
          </strong>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span
            className={
              marketDelta != null && marketDelta >= 0
                ? "text-green-400"
                : "text-amber-400"
            }
          >
            {label}
          </span>
          {saved != null && saved > 0 && (
            <span className="text-zinc-500">
              ₹{saved.toLocaleString("en-IN")} over lowest
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

export function SideHustleArbitrageRadar({ result }: { result: CheckDealResult }) {
  const arb = result.arbitrage;
  if (!arb || result.comparison?.status === "needs_selection") return null;

  const scoreBadge = {
    HIGH: { label: "High margin", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    MODERATE: { label: "Moderate margin", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    LOW: { label: "Thin margin", bg: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20" },
    UNPROFITABLE: { label: "No resale margin", bg: "bg-zinc-800 text-zinc-400 border-white/5" },
  }[arb.opportunityScore];

  const buyPrice = result.product.claimedPrice ?? result.cheapestSeller?.price ?? 0;
  const isProfitable = arb.netProfit > 0;
  const costPct = arb.resaleMedianPrice > 0 ? Math.min(92, Math.max(10, Math.round((buyPrice / arb.resaleMedianPrice) * 100))) : 0;
  const feePct = 8;
  const netPct = isProfitable && arb.resaleMedianPrice > 0 ? Math.min(80, Math.round((arb.netProfit / arb.resaleMedianPrice) * 100)) : 0;

  return (
    <details
      className="deal-surface group p-5 transition-all"
      open
    >
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5">
          <span className="inline-block text-xs text-zinc-500 transition-transform duration-200 group-open:rotate-90">
            ▸
          </span>
          <span className="text-sm font-medium text-white">Resale & Arbitrage Margin</span>
        </div>
        <div className="flex items-center gap-2.5">
          {isProfitable && (
            <span className="font-mono text-xs font-semibold text-emerald-400">
              +{fmt(arb.netProfit)} ({arb.marginPercent}%)
            </span>
          )}
          <span className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${scoreBadge.bg}`}>
            {scoreBadge.label}
          </span>
        </div>
      </summary>

      <div className="mt-4 border-t border-white/5 pt-4">
        {/* Cashflow visual split bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Capital breakdown</span>
            <span className={isProfitable ? "text-emerald-400" : "text-zinc-500"}>
              {arb.marginPercent >= 0 ? `+${arb.marginPercent}% Net ROI` : `${arb.marginPercent}%`}
            </span>
          </div>
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div style={{ width: `${costPct}%` }} className="h-full bg-zinc-500" title="Buy Cost" />
            <div style={{ width: `${feePct}%` }} className="h-full bg-amber-500/80" title="Resale Fee (8%)" />
            {isProfitable && (
              <div style={{ width: `${netPct}%` }} className="h-full bg-emerald-400" title="Net Gain" />
            )}
          </div>
          <div className="flex justify-between font-mono text-[10px] text-zinc-500">
            <span>Buy: {fmt(buyPrice)}</span>
            <span>Fee (8%): {fmt(arb.platformFeeEst)}</span>
            <span className={isProfitable ? "text-emerald-400 font-medium" : "text-zinc-500"}>
              Net: {fmt(arb.netProfit)}
            </span>
          </div>
        </div>

        {/* 4 Clean metrics */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Stat
            label="Buy price"
            value={fmt(buyPrice)}
            hint={result.cheapestSeller ? `At ${result.cheapestSeller.name}` : "Offer price"}
          />
          <Stat
            label="Market median"
            value={fmt(arb.resaleMedianPrice)}
            hint="Prevailing floor"
          />
          <Stat
            label="Platform fee (8%)"
            value={`-${fmt(arb.platformFeeEst)}`}
            hint="Resale cut"
          />
          <Stat
            label="Projected net"
            value={fmt(arb.netProfit)}
            hint={`${arb.marginPercent >= 0 ? "+" : ""}${arb.marginPercent}% margin`}
            accent={isProfitable ? "green" : "amber"}
          />
        </div>

        {arb.hustleAdvice && (
          <p className="mt-3 text-xs leading-relaxed text-zinc-400">
            <strong className="text-zinc-300">Analysis: </strong>
            {arb.hustleAdvice}
          </p>
        )}
      </div>
    </details>
  );
}

