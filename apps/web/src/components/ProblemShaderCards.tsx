"use client";

import React from "react";
import CarouselStacked from "@/components/ui/carousel-07";

export default function ProblemShaderCards({ onCTA }: { onCTA?: () => void }) {
  return (
    <section className="py-16 px-4 sm:px-6 relative z-10" id="why">
      <div className="max-w-6xl mx-auto">
        {/* Section Header: only the Six ways flippers lose money text */}
        <div className="text-center mb-4 sm:mb-8">
          <h2
            className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight"
            style={{
              background: "linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.75))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Six ways flippers{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500">
              lose money.
            </span>
          </h2>
        </div>

        {/* 3D Stacked Swipeable Carousel */}
        <CarouselStacked onCTA={onCTA} />
      </div>
    </section>
  );
}
