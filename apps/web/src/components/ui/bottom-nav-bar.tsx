"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  LineChart,
  CreditCard,
  MessageCircle,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface BottomNavItem {
  label: string;
  icon: LucideIcon;
  targetId?: string;
  onClick?: () => void;
}

const defaultNavItems: BottomNavItem[] = [
  { label: "Home", icon: Home },
  { label: "Traps", icon: LineChart },
  { label: "Workflow", icon: CreditCard },
  { label: "Showcase", icon: Trophy },
  { label: "Data", icon: MessageCircle },
];

const MOBILE_LABEL_WIDTH = 76;

export function HustleRadarLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-5 h-5 shrink-0", className)}
    >
      {/* Outer Radar Scope */}
      <circle
        cx="12"
        cy="12"
        r="9.5"
        stroke="#f59e0b"
        strokeWidth="1.8"
        strokeOpacity="0.85"
      />
      {/* Middle Concentric Ring */}
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke="#fbbf24"
        strokeWidth="1.2"
        strokeOpacity="0.5"
        strokeDasharray="2.5 2"
      />
      {/* Scope Crosshair Lines */}
      <line
        x1="12"
        y1="2.5"
        x2="12"
        y2="21.5"
        stroke="#f59e0b"
        strokeWidth="1"
        strokeOpacity="0.35"
      />
      <line
        x1="2.5"
        y1="12"
        x2="21.5"
        y2="12"
        stroke="#f59e0b"
        strokeWidth="1"
        strokeOpacity="0.35"
      />
      {/* Sweeping Radar Beam (Wedge) */}
      <path
        d="M12 12L19.2 6.5A9.5 9.5 0 0 0 12 2.5Z"
        fill="#f59e0b"
        fillOpacity="0.35"
      />
      {/* Sweeping Ray Edge */}
      <line
        x1="12"
        y1="12"
        x2="19.2"
        y2="6.5"
        stroke="#fef08a"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* Center Radar Beacon Core */}
      <circle cx="12" cy="12" r="2.2" fill="#f59e0b" />
      <circle cx="12" cy="12" r="1" fill="#ffffff" />
      {/* Detected Flip Blip (Neon Emerald Green with Pulse Ring) */}
      <circle cx="16.5" cy="8" r="1.6" fill="#10b981" />
      <circle cx="16.5" cy="8" r="3" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.75" />
    </svg>
  );
}

export type BottomNavBarProps = {
  className?: string;
  defaultIndex?: number;
  activeIndex?: number;
  stickyBottom?: boolean;
  stickyTop?: boolean;
  showBrand?: boolean;
  onBrandClick?: () => void;
  items?: BottomNavItem[];
  onSelect?: (index: number, item: BottomNavItem) => void;
  onFindFlip?: () => void;
  findFlipLabel?: string;
};

export function BottomNavBar({
  className,
  defaultIndex = 0,
  activeIndex: controlledIndex,
  stickyBottom = false,
  stickyTop = false,
  showBrand = true,
  onBrandClick,
  items = defaultNavItems,
  onSelect,
  onFindFlip,
  findFlipLabel = "Find Flip",
}: BottomNavBarProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelect = (idx: number, item: BottomNavItem) => {
    setInternalIndex(idx);
    onSelect?.(idx, item);
    item.onClick?.();
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: stickyTop ? -16 : stickyBottom ? 16 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      role="navigation"
      aria-label="Navigation"
      className={cn(
        "rounded-full flex items-center justify-between select-none transition-all duration-300",
        stickyBottom && "fixed inset-x-0 bottom-4 mx-auto z-40 w-fit p-1.5 sm:p-2",
        stickyTop &&
          "fixed inset-x-0 top-3 sm:top-4 md:top-5 mx-auto z-[999] w-[94vw] sm:w-[86vw] md:w-[82vw] lg:w-[80vw] max-w-6xl px-3 sm:px-4 md:px-5 h-[56px] sm:h-[62px]",
        isScrolled
          ? "bg-neutral-950/70 backdrop-blur-xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(245,158,11,0.08)]"
          : "bg-neutral-950/45 backdrop-blur-md border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {/* ─── Left-most Brand Logo & Hustle Radar Text ─── */}
      {showBrand && (
        <div className="flex items-center shrink-0 z-10">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onBrandClick) {
                onBrandClick();
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2 sm:gap-2.5 py-1 px-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer group select-none"
            aria-label="Hustle Radar Home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-amber-500/25 via-amber-500/10 to-transparent border border-amber-500/40 flex items-center justify-center group-hover:scale-105 group-hover:border-amber-400 transition-all duration-200 shadow-[0_0_16px_rgba(245,158,11,0.35)] shrink-0">
              <HustleRadarLogo className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm sm:text-base tracking-tight text-white flex items-center gap-1 whitespace-nowrap">
              <span className="hidden xs:inline sm:inline">Hustle</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 font-bold">
                Radar
              </span>
            </span>
          </a>
        </div>
      )}

      {/* ─── Center: Navigation Buttons ─── */}
      <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar py-0.5 z-0">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeIndex === idx;

          return (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "flex items-center gap-0 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all duration-200 relative h-9 sm:h-10 min-w-[38px] sm:min-w-[42px] cursor-pointer",
                isActive
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 gap-1.5 sm:gap-2 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                  : "bg-transparent text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent",
                "focus:outline-none focus-visible:ring-0",
              )}
              onClick={() => handleSelect(idx, item)}
              aria-label={item.label}
              type="button"
            >
              <Icon
                size={18}
                strokeWidth={2}
                aria-hidden
                className={cn(
                  "transition-colors duration-200 shrink-0",
                  isActive ? "text-amber-300" : "text-neutral-400",
                )}
              />

              <motion.div
                initial={false}
                animate={{
                  width: isActive ? `${MOBILE_LABEL_WIDTH}px` : "0px",
                  opacity: isActive ? 1 : 0,
                  marginLeft: isActive ? "6px" : "0px",
                }}
                transition={{
                  width: { type: "spring", stiffness: 350, damping: 32 },
                  opacity: { duration: 0.18 },
                  marginLeft: { duration: 0.18 },
                }}
                className="overflow-hidden flex items-center max-w-[80px]"
              >
                <span
                  className={cn(
                    "font-semibold text-xs whitespace-nowrap select-none overflow-hidden text-ellipsis leading-tight",
                    isActive ? "text-amber-200" : "opacity-0",
                  )}
                  title={item.label}
                >
                  {item.label}
                </span>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* ─── Right-most: Find Flip Button (No Sparkles Icon) ─── */}
      <div className="flex items-center shrink-0 z-10">
        <button
          type="button"
          onClick={() => {
            if (onFindFlip) {
              onFindFlip();
            } else {
              window.location.href = "/app";
            }
          }}
          className="relative inline-flex items-center justify-center px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-neutral-950 font-bold text-xs sm:text-sm tracking-tight shadow-[0_0_18px_rgba(245,158,11,0.4)] hover:shadow-[0_0_26px_rgba(245,158,11,0.65)] hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer shrink-0 border border-amber-300/60"
          aria-label={findFlipLabel}
        >
          <span className="whitespace-nowrap font-bold">{findFlipLabel}</span>
        </button>
      </div>
    </motion.nav>
  );
}

export default BottomNavBar;
