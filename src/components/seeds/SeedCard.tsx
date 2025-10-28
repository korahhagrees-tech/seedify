/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Seed, weiToEth, formatAddress } from "@/types/seed";
import { useState } from "react";

interface SeedCardProps {
  seed: Seed;
  onClick?: () => void;
  index?: number;
}

export default function SeedCard({ seed, onClick, index = 0 }: SeedCardProps) {
  const [currentImageSrc, setCurrentImageSrc] = useState(
    seed.seedImageUrl && seed.seedImageUrl.length > 0
      ? seed.seedImageUrl
      : `https://d17wy07434ngk.cloudfront.net/seed${seed.id}/seed.png`
  );
  const [imageErrorCount, setImageErrorCount] = useState(0);

  const FALLBACK_IMAGES = [
    seed.seedImageUrl && seed.seedImageUrl.length > 0 ? seed.seedImageUrl : null,
    `https://d17wy07434ngk.cloudfront.net/seed${seed.id}/seed.png`, // CloudFront with seedId
    "https://d17wy07434ngk.cloudfront.net/seed1/seed.png", // Final fallback
  ].filter(Boolean) as string[];

  const handleImageLoad = () => {
    // console.log("[IMAGE] Successfully loaded:", currentImageSrc);
  };

  const handleImageError = () => {
    const nextIndex = imageErrorCount + 1;
    
    if (nextIndex < FALLBACK_IMAGES.length) {
      // console.log(
      //   ` [IMAGE] Error loading image (attempt ${nextIndex}/${FALLBACK_IMAGES.length}), trying fallback:`,
      //   FALLBACK_IMAGES[nextIndex]
      // );
      setCurrentImageSrc(FALLBACK_IMAGES[nextIndex]);
      setImageErrorCount(nextIndex);
    } else {
      // console.log("[IMAGE] All fallbacks exhausted, showing final fallback");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full space-y-6 seed-card-container"
    >
      {/* Main Seed Image Card - with external label */}
      <div className="relative mb-6">
        {/* Steward Label - positioned above the card */}
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.25 }}
        >
          <div className="bg-white border mt-5 text-nowrap border-black rounded-full px-4 py-0 text-center w-42 seed-card-steward-label">
            <div className="text-sm text-nowrap font-medium text-black scale-[0.68] lg:scale-[0.8] md:scale-[0.8] seed-card-steward-label-small">
              <span className="-ml-10 lg:-ml-5 md:-ml-6 text-nowrap">STEWARD</span> <span className="ml-8 lg:ml-2 md:ml-2 text-nowrap">{formatAddress(seed.owner)}</span>
            </div>
          </div>
        </motion.div>

        {/* Seed Label Badge - positioned on the card */}
        <div className="absolute top-1 -left-4 z-[5] scale-[0.8] lg:scale-[1.0] md:scale-[0.9]">
          <span className="bg-white border border-black text-black px-3 py-1 rounded-full text-sm font-medium shadow seed-card-badge">
            {seed.label.toUpperCase()}
          </span>
        </div>

        {/* Main Image Card */}
        <motion.div
          className="relative w-full h-[353px] rounded-[57px] overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow seed-card-image"
          onClick={onClick}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Seed Image - fills the entire rounded container */}
          <Image
            src={currentImageSrc}
            alt=""
            fill
            className="object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={index < 2}
          />
        </motion.div>
      </div>

      {/* Info Buttons - Responsive grid */}
      <div className="grid grid-cols-3 gap-2 mt-6 mb-8 seed-card-stats">
        {/* Raised Button */}
        <motion.div
          className="bg-white border border-black rounded-full p-3 text-center h-[40px] flex flex-col justify-center seed-card-stat-item"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        >
          <div className="text-[10px] font-light text-black mb-2 mt-1 seed-card-stat-label">
            RAISED
          </div>
          <div className="text-2xl text-nowrap scale-[0.6] lg:scale-[0.8] md:scale-[0.7] -ml-5 lg:-ml-2 md:-ml-2 -mt-4 font-light favorit-mono text-black/80 seed-card-stat-value">
            {parseFloat(seed.depositAmount).toFixed(4)}{" "}
            <span className="text-xl">ETH</span>
          </div>
        </motion.div>

        {/* Snap Price Button */}
        <motion.div
          className="bg-white border border-black rounded-full p-3 text-center h-[40px] flex flex-col justify-center seed-card-stat-item"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.25 }}
        >
          <div className="text-[10px] font-light text-black mb-2 mt-1 seed-card-stat-label">
            SNAP PRICE
          </div>
          <div className="text-2xl text-nowrap scale-[0.6] lg:scale-[0.8] md:scale-[0.7] -ml-5 lg:-ml- md:-ml-3 -mt-4 font-light text-black/80 seed-card-stat-value">
            {parseFloat(seed.snapshotPrice).toFixed(4)}{" "}
            <span className="text-xl">ETH</span>
          </div>
        </motion.div>

        {/* Evolutions Button */}
        <motion.div
          className="bg-white border border-black rounded-full p-3 text-center h-[40px] flex flex-col justify-center seed-card-stat-item"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
        >
          <div className="text-[10px] font-light text-black mb-2 mt-1 seed-card-stat-label">
            EVOLUTIONS
          </div>
          <div className="text-2xl text-nowrap scale-[0.7] -mt-4 font-light text-black seed-card-stat-value">
            {seed.snapshotCount}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
