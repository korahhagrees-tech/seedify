/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Seed, weiToEth, formatAddress } from "@/types/seed";
import SeedbedPullUp from "./SeedbedPullUp";
import GardenHeader from "../GardenHeader";
import { useState } from "react";

interface SeedDetailPageProps {
  seed: Seed;
  onBack?: () => void;
  onProfileClick?: () => void;
  onPlantSeed?: () => void;
}

export default function SeedDetailPage({
  seed,
  onBack,
  onProfileClick,
  onPlantSeed,
}: SeedDetailPageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageErrorCount, setImageErrorCount] = useState(0);

  // Three-tier fallback system for seed images
  const getCurrentImageSrc = () => {
    // Tier 1: Original backend URL
    if (
      imageErrorCount === 0 &&
      seed.seedImageUrl &&
      seed.seedImageUrl.length > 0
    ) {
      return seed.seedImageUrl;
    }

    // Tier 2: CloudFront URL with seed ID
    if (imageErrorCount === 1) {
      return `https://d17wy07434ngk.cloudfront.net/seed${seed.id}/seed.png`;
    }

    // Tier 3: Universal fallback
    return "https://d17wy07434ngk.cloudfront.net/seed1/seed.png";
  };

  const handleImageError = () => {
    if (imageErrorCount < 2) {
      console.log(
        `🌸 [IMAGE] Error loading seed detail image (tier ${
          imageErrorCount + 1
        }), trying next fallback`
      );
      setImageErrorCount((prev) => prev + 1);
    } else {
      console.log("🌸 [IMAGE] All fallbacks exhausted, using final fallback");
      setImageError(true);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-sm mx-auto lg:-mt-8 md:-mt-14 -mt-12 relative lg:scale-[1.0] md:scale-[0.95] scale-[1.0] overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mb-40 lg:-mb-40 md:-mb-40 seed-detail-container">
      {/* Steward Label - positioned above the main content */}
      <div className="relative pt-4 pb-2 ml-2 lg:ml-4 md:ml-4 scale-[0.8] lg:scale-[0.8] md:scale-[0.8] z-10">
        <motion.div
          className="absolute top-14 lg:top-14 md:top-10 left-1/2 -translate-x-1/2 z-10 max-w-[90vw]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <div className="bg-white border border-black rounded-full px-4 py-0 lg:py-1 md:py-1 text-center seed-detail-steward-label">
            <div className="text-sm font-medium text-black seed-detail-steward-label-small">
              STEWARD{" "}
              <span className="ml-2 break-all">
                {seed?.owner ? formatAddress(seed.owner) : "Unknown"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Container */}
      <motion.div
        className="px-2 lg:px-4 md:px-4 -pb-[2px] -mb-88"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Seed Label Badge */}
        <div className="relative mb-4">
          <div className="absolute top-2 -left-2 lg:-left-4 md:-left-4 z-10 scale-[0.8] lg:scale-[0.9] md:scale-[0.8]">
            <span className="bg-white border border-black text-black px-3 py-1 rounded-full text-sm font-medium shadow seed-detail-badge">
              {seed.label.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Seed Image Section */}
        <div className="mt-8 mb-6 px-2 lg:px-0 md:px-0 z-10">
          <motion.div
            className="relative w-full h-[350px] lg:h-[400px] md:h-[400px] rounded-[40px] overflow-hidden mx-auto seed-detail-image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Seed Image */}
            <Image
              src={getCurrentImageSrc()}
              alt=""
              fill
              className="object-cover"
              onError={handleImageError}
            />
          </motion.div>
        </div>

        {/* Metrics pills */}
        <div className="mb-12 lg:mb-6 md:mb-6 px-2 lg:px-0 md:px-0 seed-detail-stats">
          <div className="grid grid-cols-3 gap-1 lg:gap-2 md:gap-2">
            <motion.div
              className="bg-white border border-black rounded-full p-3 text-center h-[40px] flex flex-col justify-center seed-detail-stat-item overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="text-[8px] font-light text-black mb-2 mt-1 seed-detail-stat-label">
                RAISED
              </div>
              <div className="text-base lg:text-xl md:text-lg font-light text-black seed-detail-stat-value truncate px-1">
                {parseFloat(seed.depositAmount).toFixed(4)}{" "}
                <span className="text-sm lg:text-base md:text-base">ETH</span>
              </div>
            </motion.div>
            <motion.div
              className="bg-white border border-black rounded-full p-3 text-center h-[40px] flex flex-col justify-center seed-detail-stat-item overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              <div className="text-[8px] font-light text-black -mb-2 lg:mb-2 md:mb-2 mt-1 seed-detail-stat-label">
                SNAP PRICE
              </div>
              <div className="text-base lg:text-xl md:text-lg font-light text-black seed-detail-stat-value truncate px-1">
                {parseFloat(seed.snapshotPrice).toFixed(4)}{" "}
                <span className="text-sm lg:text-base md:text-base">ETH</span>
              </div>
            </motion.div>
            <motion.div
              className="bg-white border border-black rounded-full p-3 text-center h-[40px] flex flex-col justify-center seed-detail-stat-item overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="text-[9px] font-light text-black mb-2 mt-0 lg:mt-0 md:mt-1 seed-detail-stat-label">
                EVOLUTIONS
              </div>
              <div className="text-lg lg:text-xl md:text-xl font-light text-black seed-detail-stat-value seed-detail-stat-value-small">
                {seed.snapshotCount}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Expandable seedbed */}
        <div className="px-2 lg:px-0 md:px-0 -mb-30">
          <SeedbedPullUp selectedSeed={seed} />
        </div>
      </motion.div>
    </div>
  );
}
