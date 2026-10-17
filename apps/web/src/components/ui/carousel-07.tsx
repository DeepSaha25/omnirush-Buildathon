"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Slide {
  image: string;
  category: string;
  number: string;
  title: string;
  risk: string;
  description: string;
  auditTag: string;
}

export const defaultSixSlides: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
    category: "Trap 01 · Price Markup",
    number: "01",
    title: 'Inflated "Sale" Buy Price',
    risk: "Artificial 40% discount · Fake markdown",
    description: "Retailers mark up prices weeks before sales to simulate steep discounts, wiping out your resale margin before you even source.",
    auditTag: "Historical price median check",
  },
  {
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    category: "Trap 02 · Hidden Fees",
    number: "02",
    title: "Margin Vanishes After Fees",
    risk: "-8% platform cut + shipping & return risk",
    description: "A deal looks profitable until platform fees (8%), payment gateway, and return risk are calculated — net margin flips negative.",
    auditTag: "Net take-home margin audit",
  },
  {
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    category: "Trap 03 · Price Disparity",
    number: "03",
    title: "Cheaper Source Exists",
    risk: "Buy price higher than retail rivals",
    description: "The same SKU is available lower at an authorized rival retailer. Buying from the wrong source destroys your flip edge instantly.",
    auditTag: "SerpApi 8+ retailer cross-scan",
  },
  {
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    category: "Trap 04 · Spec Trap",
    number: "04",
    title: "Spec Swap, Same Tag",
    risk: "Clearance base spec vs. flagship config",
    description: "The discounted listing is an older generation or base spec. Secondary market buyers want the current config, not the clearance one.",
    auditTag: "Gemma 2 spec match extraction",
  },
  {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    category: "Trap 05 · Oversupply",
    number: "05",
    title: "Market Median is Too Low",
    risk: "Resale floor trading below buy cost",
    description: "Secondary market supply is oversaturated. The median price has dropped below your buy cost, locking up your flip capital.",
    auditTag: "Real-time market floor monitor",
  },
  {
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
    category: "Trap 06 · Guesswork",
    number: "06",
    title: "No AI Price Insight",
    risk: "Unverified emotional sourcing intuition",
    description: "Without open-source AI grounding the deal in live retailer evidence, you are guessing — and sourcing guesses cost real money.",
    auditTag: "AI conviction verdict score",
  },
];

interface CarouselConfig {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
}

const getCarouselConfig = (width: number): CarouselConfig => {
  if (width < 640) {
    return {
      distanceDivisor: 120,
      velocityDivisor: 500,
      sensitivity: 180,
      xMultiplier: 85,
      yMultiplier: 16,
      rotationMultiplier: 7,
      scaleReduction: 0.07,
    };
  }
  if (width < 1024) {
    return {
      distanceDivisor: 160,
      velocityDivisor: 650,
      sensitivity: 220,
      xMultiplier: 135,
      yMultiplier: 24,
      rotationMultiplier: 9,
      scaleReduction: 0.09,
    };
  }
  return {
    distanceDivisor: 200,
    velocityDivisor: 800,
    sensitivity: 250,
    xMultiplier: 185,
    yMultiplier: 30,
    rotationMultiplier: 10,
    scaleReduction: 0.11,
  };
};

export interface CarouselStackedProps {
  slides?: Slide[];
  onCTA?: () => void;
  className?: string;
}

export const CarouselStacked = ({
  slides = defaultSixSlides,
  onCTA,
  className,
}: CarouselStackedProps) => {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const isDragging = React.useRef(false);
  const [windowWidth, setWindowWidth] = React.useState(0);
  const [activeCardIndex, setActiveCardIndex] = React.useState(0);

  const total = slides.length;

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync active card index with scrollProgress
  React.useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (latest) => {
      const normalized = ((Math.round(latest) % total) + total) % total;
      setActiveCardIndex(normalized);
    });
    return () => unsubscribe();
  }, [scrollProgress, total]);

  const config = React.useMemo(
    () => getCarouselConfig(windowWidth),
    [windowWidth],
  );

  // Bring any clicked card smoothly to the front
  const bringCardToFront = React.useCallback(
    (targetIndex: number) => {
      const current = scrollProgress.get();
      // Find shortest rotation distance
      const diff =
        ((((targetIndex - Math.round(current)) % total) + total + total / 2) %
          total) -
        total / 2;
      const target = Math.round(current) + diff;

      animate(scrollProgress, target, {
        type: "spring",
        stiffness: 240,
        damping: 26,
        mass: 0.8,
      });
    },
    [scrollProgress, total],
  );

  const handleDragStart = () => {
    isDragging.current = true;
    startProgress.current = scrollProgress.get();
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setTimeout(() => {
      isDragging.current = false;
    }, 120);

    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;

    const distanceShift = -dragDistance / config.distanceDivisor;
    const velocityShift = -velocity / config.velocityDivisor;

    let totalShift = Math.round(distanceShift + velocityShift);
    totalShift = Math.max(-3, Math.min(3, totalShift));

    const target = Math.round(startProgress.current) + totalShift;

    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 220,
      damping: 28,
      mass: 0.9,
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full py-2 sm:py-3 bg-transparent select-none relative",
        className,
      )}
    >
      {/* 3D Stacked Carousel Deck */}
      <div className="relative w-full max-w-6xl h-[370px] sm:h-[420px] lg:h-[440px] flex items-center justify-center">
        {/* The 6 Stacked Cards (Directly draggable & clickable) */}
        {slides.map((slide, i) => (
          <Card
            key={i}
            slide={slide}
            index={i}
            total={total}
            progress={scrollProgress}
            config={config}
            onSelect={() => {
              bringCardToFront(i);
            }}
            onDragStart={handleDragStart}
            onDrag={(_, info) => {
              const delta = -info.delta.x / config.sensitivity;
              scrollProgress.set(scrollProgress.get() + delta);
            }}
            onDragEnd={handleDragEnd}
            onCTA={onCTA}
          />
        ))}

        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => bringCardToFront((activeCardIndex - 1 + total) % total)}
          className="absolute left-2 sm:left-4 lg:left-8 z-40 w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 hover:border-amber-500/40 text-neutral-300 hover:text-white flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-lg cursor-pointer"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => bringCardToFront((activeCardIndex + 1) % total)}
          className="absolute right-2 sm:right-4 lg:right-8 z-40 w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 hover:border-amber-500/40 text-neutral-300 hover:text-white flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-lg cursor-pointer"
          aria-label="Next card"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination Dot Indicators & Hint */}
      <div className="mt-4 flex flex-col items-center gap-2.5 z-40">
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => bringCardToFront(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                activeCardIndex === idx
                  ? "w-8 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  : "w-2 bg-neutral-700 hover:bg-neutral-500",
              )}
              aria-label={`Jump to trap ${idx + 1}`}
            />
          ))}
        </div>
        <p className="text-[11px] font-mono tracking-wider text-neutral-500 uppercase">
          Click any card or drag to rotate
        </p>
      </div>
    </div>
  );
};

interface CardProps {
  slide: Slide;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: CarouselConfig;
  onSelect: () => void;
  onDragStart: () => void;
  onDrag: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onCTA?: () => void;
}

const Card = ({
  slide,
  index,
  total,
  progress,
  config,
  onSelect,
  onDragStart,
  onDrag,
  onDragEnd,
  onCTA,
}: CardProps) => {
  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  const x = useTransform(offset, (o) => o * config.xMultiplier);
  const rotate = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return o * config.rotationMultiplier;
  });
  const y = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return absO * config.yMultiplier;
  });
  const scale = useTransform(
    offset,
    (o) => 1 - Math.abs(o) * config.scaleReduction,
  );
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
  );
  const zIndex = useTransform(offset, (o) =>
    Math.round(20 - Math.abs(o) * 2),
  );

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      style={{
        x,
        rotate,
        y,
        scale,
        opacity,
        zIndex,
      }}
      onClick={onSelect}
      className={cn(
        "absolute rounded-2xl sm:rounded-3xl overflow-hidden border border-white/12 bg-neutral-950 shadow-[0_24px_50px_rgba(0,0,0,0.92),0_0_1px_rgba(255,255,255,0.15)] group transition-colors duration-200 cursor-pointer pointer-events-auto",
        "w-[270px] h-[340px] sm:w-[310px] sm:h-[390px] lg:w-[330px] lg:h-[410px]",
        "hover:border-amber-400/50 hover:shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_24px_rgba(245,158,11,0.15)]",
      )}
    >
      {/* Full-bleed Background Photograph */}
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-55 pointer-events-none"
      />

      {/* Dark gradient overlay pushing contrast to the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Text Pushed Firmly Downward to the Bottom of the Card */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex flex-col justify-end z-10 pointer-events-none">
        {/* Card Title */}
        <h3 className="text-base sm:text-lg lg:text-[19px] font-bold tracking-tight text-white leading-snug mb-1.5 drop-shadow-md">
          {slide.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-[13px] text-neutral-200/90 leading-relaxed font-normal drop-shadow">
          {slide.description}
        </p>
      </div>
    </motion.div>
  );
};

export default CarouselStacked;
