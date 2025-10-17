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

  return (
    <div className="min-h-screen w-full max-w-sm mx-auto lg:-mt-8 md:-mt-14 -mt-12 relative lg:scale-[1.0] md:scale-[0.95] scale-[1.0] overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* Steward Label - positioned above the main content */}
      <div className="relative pt-4 pb-2 ml-2 lg:ml-4 md:ml-4 scale-[0.8] lg:scale-[1.0] md:scale-[0.95] z-10">
        <motion.div
          className="absolute top-14 lg:top-14 md:top-10 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <div className="bg-white border text-nowrap border-black rounded-full px-4 py-1 text-center">
            <div className="text-sm font-medium text-black">
              STEWARD{" "}
              <span className="ml-2">
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
          <div className="absolute top-2 -left-2 lg:-left-4 md:-left-4 z-10 scale-[0.8] lg:scale-[1.0] md:scale-[0.95]">
            <span className="bg-white border border-black text-black px-3 py-1 rounded-full text-sm font-medium shadow">
              {seed.label.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Seed Image Section */}
        <div className="mt-8 mb-6 px-2 lg:px-0 md:px-0 z-10">
          <motion.div
            className="relative w-full h-[350px] lg:h-[400px] md:h-[400px] rounded-[40px] overflow-hidden mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Seed Image */}
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
              onError={(e) => {
                if (!imageError) {
                  console.log(
                    "🌸 [IMAGE] Error loading seed detail image (403 or network issue), using CloudFront fallback"
                  );
                  setImageError(true);
                }
              }}
            />
          </motion.div>
        </div>

        {/* Metrics pills */}
        <div className="mb-6 px-2 lg:px-0 md:px-0">
          <div className="grid grid-cols-3 gap-1 lg:gap-2 md:gap-2">
            <motion.div
              className="bg-white border border-black rounded-full p-3 text-center h-[40px] flex flex-col justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="text-[8px] font-light text-black mb-2 mt-1">
                RAISED
              </div>
              <div className="text-xl text-nowrap scale-[0.75] lg:scale-[0.65] md:scale-[0.65] -ml-3 lg:-ml-3 md:-ml-2 -mt-3 font-light text-black">
                {parseFloat(seed.depositAmount).toFixed(4)}{" "}
                <span className="text-xl">ETH</span>
              </div>
            </motion.div>
            <motion.div
              className="bg-white border border-black rounded-full p-3 text-center h-[40px] flex flex-col justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              <div className="text-[8px] font-light text-black mb-2 mt-1">
                SNAP PRICE
              </div>
              <div className="text-xl text-nowrap scale-[0.75] lg:scale-[0.65] md:scale-[0.65] -ml-3 lg:-ml-2 md:-ml-2 -mt-3 font-light text-black">
                {parseFloat(seed.snapshotPrice).toFixed(4)}{" "}
                <span className="text-xl">ETH</span>
              </div>
            </motion.div>
            <motion.div
              className="bg-white border border-black rounded-full p-3 text-center h-[40px] flex flex-col justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="text-[10px] font-light text-black mb-2 mt-1">
                EVOLUTIONS
              </div>
              <div className="text-xl text-nowrap scale-[0.9] -ml-2 -mt-3 font-light text-black">
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
