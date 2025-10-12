/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Seed, weiToEth, formatAddress } from "@/types/seed";
import SeedbedPullUp from "./SeedbedPullUp";
import GardenHeader from "../GardenHeader";

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
  return (
    <div className="min-h-screen w-full max-w-md mx-auto lg:-mt-30 md:-mt-30 -mt-2 relative lg:scale-[0.8] md:scale-[0.8] scale-[0.95]">
      {/* Steward Label - positioned above the main content */}
      <div className="relative pt-4 pb-2 ml-4">
        <motion.div
          className="absolute top-38 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <div className="bg-white border text-nowrap border-black rounded-full px-4 py-1 text-center">
            <div className="text-sm font-medium text-black">
              STEWARD <span className="ml-2">{formatAddress(seed.owner)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Container */}
      <motion.div
        className="px-4 pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Section */}
        <div className="pt-4 pb-2">
          <GardenHeader />
        </div>

        {/* Seed Label Badge */}
        <div className="relative mb-4">
          <div className="absolute top-10 -left-4 z-10">
            <span className="bg-white border border-black text-black px-3 py-1 rounded-full text-sm font-medium shadow">
              {seed.label.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Seed Image Section */}
        <div className="mt-8 mb-6">
          <motion.div
            className="relative w-full h-[400px] rounded-[40px] overflow-hidden mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Seed Image */}
            <Image
              src={
                seed.seedImageUrl && seed.seedImageUrl.length > 0
                  ? seed.seedImageUrl
                  : "/seeds/01__GRG.png"
              }
              alt=""
              fill
              className="object-cover"
              onError={(e) => {
                console.log(
                  "🌸 [IMAGE] Error loading seed detail image, using placeholder"
                );
                const target = e.target as HTMLImageElement;
                if (
                  target.src !== `${window.location.origin}/seeds/01__GRG.png`
                ) {
                  target.src = "/seeds/01__GRG.png";
                }
              }}
            />
          </motion.div>
        </div>

        {/* Metrics pills */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-2">
            <motion.div
              className="bg-white border border-black rounded-full p-3 text-center h-[40px] flex flex-col justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="text-[10px] font-light text-black mb-2 mt-1">
                RAISED
              </div>
              <div className="text-xl text-nowrap scale-[0.75] lg:scale-[0.9] md:scale-[0.8] -ml-3 lg:-ml-2 md:-ml-2 -mt-3 font-light text-black">
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
              <div className="text-[10px] font-light text-black mb-2 mt-1">
                SNAP PRICE
              </div>
              <div className="text-xl text-nowrap scale-[0.75] lg:scale-[0.9] md:scale-[0.8] -ml-3 lg:-ml-2 md:-ml-2 -mt-3 font-light text-black">
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
        <div>
          <SeedbedPullUp selectedSeed={seed} />
        </div>
      </motion.div>
    </div>
  );
}
