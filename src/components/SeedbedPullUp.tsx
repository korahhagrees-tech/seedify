"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Seed } from "@/types/seed";

interface SeedbedPullUpProps {
  seedbedImageSrc: string;
  selectedSeed?: Seed | null;
}

export default function SeedbedPullUp({ seedbedImageSrc, selectedSeed }: SeedbedPullUpProps) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY > 0) setExpanded(true);
    if (e.deltaY < 0) setExpanded(false);
  };

  const handleTouch = (() => {
    let startY = 0;
    return {
      start: (e: React.TouchEvent) => { startY = e.touches[0].clientY; },
      move: (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.touches[0].clientY - startY;
        if (delta < -10) setExpanded(true);
        if (delta > 10) setExpanded(false);
      }
    };
  })();

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouch.start}
      onTouchMove={handleTouch.move}
      className="relative px-4 select-none"
      style={{ touchAction: 'none', overscrollBehavior: 'contain' as any }}
    >
      {/* Preview header with arrow */}
      <div className="flex justify-center mb-2">
        <button onClick={() => setExpanded(!expanded)} aria-label="Toggle seedbed" className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center">
          {expanded ? "↓" : "↑"}
        </button>
      </div>

      <motion.div
        animate={{
          y: expanded ? -200 : 0, // slide up ~40% higher to cover more of seed image
          height: expanded ? 600 : 220,
          borderRadius: expanded ? 24 : 28
        }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className="mx-auto w-full max-w-[calc(100%-0px)] relative z-10"
      >
        {/* Dark shade card */}
        <div className="bg-gray-300 rounded-3xl p-3 border-2 border-black/20 h-full">
          {/* White card */}
          <div className="bg-white rounded-3xl p-4 overflow-hidden border-2 border-black/20 h-full flex flex-col">
            {/* Title when expanded */}
            {expanded && (
              <div className="text-center text-black mb-2 tracking-widest flex-shrink-0">THE SEEDBED</div>
            )}
            {/* Seedbed image */}
            <div className="relative w-full flex-1 min-h-0">
              <Image 
                src={seedbedImageSrc || '/Seedbed.svg'} 
                alt="Seedbed" 
                fill 
                className="object-contain" 
                priority
              />
            </div>
          </div>
        </div>
      </motion.div>
      {/* Helper text */}
      {!expanded && (
        <div className="text-center text-sm text-black/70 mt-2">Pull up to explore the seedbed</div>
      )}
    </div>
  );
}
