/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Seed } from "@/types/seed";
import SeedbedCard,  { SeedbedCard2 } from "./SeedbedCard";  

interface SeedbedPullUpProps {
  selectedSeed?: Seed | null;
}

export default function SeedbedPullUp({ selectedSeed }: SeedbedPullUpProps) {
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
      className="relative select-none"
      style={{ touchAction: 'none', overscrollBehavior: 'contain' as any }}
    >
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <SeedbedCard2 />
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
               className="-mt-70"
          >
            <SeedbedCard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
