"use client"
import React from "react"
import { MeshGradient } from "@paper-design/shaders-react"
import { motion } from "framer-motion"
import { GetStartedButton } from "@/components/GetStartedButton"

export interface ShaderShowcaseProps {
  onCTA?: () => void;
  showNav?: boolean;
}

export default function ShaderShowcase({ onCTA }: ShaderShowcaseProps) {
  return (
    <div className="relative w-full min-h-[85vh] sm:min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6">
      <svg className="absolute inset-0 w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Background Animated Shaders (MeshGradient) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <MeshGradient
          className="w-full h-full"
          colors={["#000000", "#06b6d4", "#0891b2", "#164e63", "#f97316"]}
          speed={0.3}
        />
        <MeshGradient
          className="w-full h-full opacity-60 absolute inset-0"
          colors={["#000000", "#ffffff", "#06b6d4", "#f97316"]}
          speed={0.2}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black pointer-events-none" />
      </div>

      {/* Main Centered Hero Content */}
      <main className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center text-center">


        {/* Centered Main Headline */}
        <motion.h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.04] tracking-tight text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <motion.span
            className="block font-light text-white/90 text-3xl sm:text-5xl md:text-6xl mb-2 tracking-wider"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #06b6d4 30%, #f97316 70%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "url(#text-glow)",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            Find The Flip
          </motion.span>
          <span className="block font-black text-white drop-shadow-2xl">
            Before Anyone
          </span>
          <span className="block font-light text-white/80 italic">
            Else Does.
          </span>
        </motion.h1>

        {/* Centered Subtitle */}
        <motion.p
          className="text-sm sm:text-base md:text-lg font-light text-white/80 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          HustleRadar gives you an evidence-backed decision workspace: SerpApi gathers comparable retailer prices, deterministic rules calculate the fee-adjusted margin, and Google Gemma 2 explains the result while you make the final call.
        </motion.p>

        {/* Earlier Button: GetStartedButton "FIND A FLIP" */}
        <motion.div
          className="flex flex-col items-center justify-center gap-3 mx-auto w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <GetStartedButton
            id="hero-cta-btn"
            label="FIND A FLIP"
            size="lg"
            onClick={onCTA}
          />
          <div className="flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-mono uppercase tracking-wider text-neutral-400 sm:text-xs mt-2">
            <span>Instant</span>
            <span className="text-neutral-600">·</span>
            <span>100% Free</span>
            <span className="text-neutral-600">·</span>
            <span>No Extension Needed</span>
          </div>
        </motion.div>


      </main>
    </div>
  )
}
