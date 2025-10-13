/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const [touchStart, setTouchStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Convert backend beneficiaries to seedbed format
  const seedbedBeneficiaries = useMemo(() => {
    if (selectedSeed?.beneficiaries && selectedSeed.beneficiaries.length > 0) {
      return convertBeneficiariesToSeedbedFormat(selectedSeed.beneficiaries);
    }
    return undefined; // Will use default beneficiaries
  }, [selectedSeed]);

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    // Only handle wheel when on the seedbed area itself
    const target = e.target as HTMLElement;
    const isSeedbedArea = target.closest('[data-seedbed-area]');
    
    if (!isSeedbedArea) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Use a threshold to prevent accidental toggles
    if (e.deltaY > 20) setExpanded(true);
    if (e.deltaY < -20) setExpanded(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const target = e.target as HTMLElement;
    const isSeedbedArea = target.closest('[data-seedbed-area]');
    
    if (!isSeedbedArea) return;
    
    const delta = e.touches[0].clientY - touchStart;
    
    // Larger threshold for more deliberate gesture
    if (delta < -50) {
      setExpanded(true);
      setIsDragging(false);
    }
    if (delta > 50) {
      setExpanded(false);
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative select-none"
      style={{ touchAction: 'pan-y', overscrollBehavior: 'contain' as any }}
      data-seedbed-area
    >
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            data-seedbed-area
          >
            <SeedbedCard2 beneficiaries={seedbedBeneficiaries} />
            {/* Swipe Up Indicator */}
            <div className="text-center mt-4 opacity-50">
              <p className="text-xs text-gray-600">Swipe up or scroll to expand</p>
              <div className="flex justify-center mt-1">
                <svg className="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full -mt-90 scale-[0.98] lg:scale-[0.95] md:scale-[0.95]"
            data-seedbed-area
          >
            <SeedbedCard beneficiaries={seedbedBeneficiaries} />
            {/* Swipe Down Indicator */}
            <div className="text-center mt-4 opacity-50">
              <p className="text-xs text-gray-600">Swipe down or scroll to collapse</p>
              <div className="flex justify-center mt-1">
                <svg className="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
