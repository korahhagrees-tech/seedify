/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Seed } from "@/types/seed";
import SeedbedCard,  { SeedbedCard2 } from "./SeedbedCard";
import { convertBeneficiariesToSeedbedFormat } from "@/lib/api";
import SeedbedCardStats, { SeedbedCardStats2 } from "./SeedbedCardStats";

interface SeedbedPullUpProps {
  selectedSeed?: Seed | null;
}

export default function SeedbedPullUp({ selectedSeed }: SeedbedPullUpProps) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Convert backend beneficiaries to seedbed format
  const seedbedBeneficiaries = useMemo(() => {
    if (selectedSeed?.beneficiaries && selectedSeed.beneficiaries.length > 0) {
      return convertBeneficiariesToSeedbedFormat(selectedSeed.beneficiaries);
    }
    return undefined; // Will use default beneficiaries
  }, [selectedSeed]);

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
            {/* <SeedbedCard2 beneficiaries={seedbedBeneficiaries} /> */}
            <SeedbedCardStats beneficiaries={seedbedBeneficiaries} />
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full -mt-90"
          >
            {/* <SeedbedCard beneficiaries={seedbedBeneficiaries} /> */}
            <SeedbedCardStats beneficiaries={seedbedBeneficiaries} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
