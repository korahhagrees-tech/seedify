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
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    console.log("🌸 [IMAGE] Successfully loaded:", seed.seedImageUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full space-y-6"
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
          <div className="bg-white border mt-4 text-nowrap border-black rounded-full px-4 py-1 text-center">
            <div className="text-sm font-medium text-black">
              STEWARD <span className="ml-2">{formatAddress(seed.owner)}</span>
            </div>
          </div>
        </motion.div>

        {/* Seed Label Badge - positioned on the card */}
        <div className="absolute top-3 -left-4 z-[5]">
          <span className="bg-white border border-black text-black px-3 py-1 rounded-full text-sm font-medium shadow">
            {seed.label.toUpperCase()}
          </span>
        </div>

        {/* Main Image Card */}
        <motion.div
          className="relative w-full h-[420px] rounded-[40px] overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
          onClick={onClick}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Seed Image - fills the entire rounded container */}
          <Image
            src={
              imageError
                ? "https://d17wy07434ngk.cloudfront.net/seed1/seed.png"
                : seed.seedImageUrl && seed.seedImageUrl.length > 0
                  ? seed.seedImageUrl
                  : "https://d17wy07434ngk.cloudfront.net/seed1/seed.png"
            }
            alt=""
            fill
            className="object-cover"
            onLoad={handleImageLoad}
            onError={(e) => {
              if (!imageError) {
                console.log(
                  "🌸 [IMAGE] Error loading seed image (403 or network issue), using CloudFront fallback"
                );
                setImageError(true);
              }
            }}
            priority={index < 2}
          />
        </motion.div>
      </div>

      {/* Info Buttons - Responsive grid */}
      <div className="grid grid-cols-3 gap-2 mt-6 mb-6">
        {/* Raised Button */}
        <motion.div
          className="bg-white border border-black rounded-full p-3 text-center h-[40px] flex flex-col justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        >
          <div className="text-[10px] font-light text-black mb-2 mt-1">
            RAISED
          </div>
          <div className="text-2xl text-nowrap scale-[0.7] lg:scale-[0.8] md:scale-[0.7] -ml-5 lg:-ml-2 md:-ml-2 -mt-4 font-light favorit-mono text-black/70">
            {parseFloat(seed.depositAmount).toFixed(4)}{" "}
            <span className="text-xl">ETH</span>
          </div>
        </motion.div>

        {/* Snap Price Button */}
        <motion.div
          className="bg-white border border-black rounded-full p-3 text-center h-[40px] flex flex-col justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.25 }}
        >
          <div className="text-[10px] font-light text-black mb-2 mt-1">
            SNAP PRICE
          </div>
          <div className="text-2xl text-nowrap scale-[0.7] lg:scale-[0.8] md:scale-[0.7] -ml-5 lg:-ml- md:-ml-3 -mt-4 font-light text-black/80">
            {parseFloat(seed.snapshotPrice).toFixed(4)}{" "}
            <span className="text-xl">ETH</span>
          </div>
        </motion.div>

        {/* Evolutions Button */}
        <motion.div
          className="bg-white border border-black rounded-full p-3 text-center h-[40px] flex flex-col justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
        >
          <div className="text-[10px] font-light text-black mb-2 mt-1">
            EVOLUTIONS
          </div>
          <div className="text-2xl text-nowrap scale-[0.7] -mt-4 font-light text-black">
            {seed.snapshotCount}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
