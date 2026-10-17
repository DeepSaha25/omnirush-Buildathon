"use client";

import {
  HeroCarouselItem,
} from "@/components/ui/hero-carousel";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";

// Preserved for landing page editorial category carousel
const LOOKS: HeroCarouselItem[] = [
  {
    title: "Flagship\nSmartphones",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80",
    credit: "LIVE CROSS-SCAN",
    meta: ["AMAZON", "FLIPKART", "CROMA"],
    accent: "#f59e0b",
  },
  {
    title: "Studio\nHeadphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    credit: "HISTORICAL LOWS",
    meta: ["RELIANCE", "VIJAY SALES", "AMAZON"],
    accent: "#ef4444",
  },
  {
    title: "Pro\nLaptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    credit: "DISCOUNT VERIFICATION",
    meta: ["FLIPKART", "AMAZON", "CROMA"],
    accent: "#3b82f6",
  },
  {
    title: "Sneakers &\nFootwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    credit: "REAL-TIME PRICING",
    meta: ["MYNTRA", "AJIO", "FLIPKART"],
    accent: "#e11d48",
  },
  {
    title: "Luxury\nTimepieces",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    credit: "MRP TAMPER DETECTION",
    meta: ["TATA CLiQ", "AMAZON", "ETHOS"],
    accent: "#d97706",
  },
  {
    title: "Next-Gen\nConsoles",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
    credit: "STOCK & PRICE TRACKER",
    meta: ["AMAZON", "FLIPKART", "SHOPATSC"],
    accent: "#8b5cf6",
  },
  {
    title: "Mirrorless\nCameras",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    credit: "CROSS-RETAILER AUDIT",
    meta: ["AMAZON", "CROMA", "RELIANCE"],
    accent: "#06b6d4",
  },
  {
    title: "Smart\nWearables",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80",
    credit: "INSTANT VERDICT",
    meta: ["FLIPKART", "AMAZON", "CROMA"],
    accent: "#10b981",
  },
];

export { LOOKS };

// Verified Unsplash retail stock images for retail arbitrage products
const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80",
    alt: "Flagship Smartphones",
  },
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    alt: "Studio Headphones",
  },
  {
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    alt: "Pro Laptops",
  },
  {
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    alt: "Sneakers & Footwear",
  },
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    alt: "Luxury Timepieces",
  },
  {
    src: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
    alt: "Next-Gen Consoles",
  },
  {
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    alt: "Mirrorless Cameras",
  },
  {
    src: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80",
    alt: "Smart Wearables",
  },
  {
    src: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
    alt: "Mechanical Keyboards",
  },
  {
    src: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80",
    alt: "Tech Gadgets",
  },
];

import BottomNavBar from "@/components/ui/bottom-nav-bar";

export function TiltedGridHeroDemo() {
  return (
    <TiltedGridHero
      images={IMAGES}
      className="h-[560px] w-full rounded-2xl border border-white/10 bg-neutral-950"
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-between py-12 text-center">
        <div className="px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest mb-4">
            Market Reality
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Six ways flippers
            <br />
            lose money.
          </h1>
        </div>
        <p className="max-w-md text-balance px-6 text-sm text-neutral-400">
          Most sourcing decisions fail before checkout. HustleRadar surfaces live pricing, resale margin, and AI-driven signals so you buy only when the numbers work.
        </p>
      </div>
    </TiltedGridHero>
  );
}

import CarouselStacked from "@/components/ui/carousel-07";

export default function Default() {
  return (
    <div className="w-full">
      <CarouselStacked />
    </div>
  );
}

export { CarouselStacked };

