"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";

export default function CardFlip() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleCardClick();
    }
  };

  return (
    <div
      className="perspective w-full max-w-sm"
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className="relative w-full h-96 cursor-pointer transition-transform duration-500 ease-out"
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Click to flip card"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <Image
            src="virtual-card/virtual-card.png"
            alt="Virtual card front"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Image
            src="/virtual-card.png"
            alt="Virtual card back"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <p className="text-center text-slate-600 text-sm mt-6 font-sans font-medium">
        {isFlipped ? "Click to see front" : "Click to see back"}
      </p>
    </div>
  );
}
