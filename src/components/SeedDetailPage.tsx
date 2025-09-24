"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Seed, weiToEth, formatAddress } from "@/types/seed";
import SeedbedPullUp from "@/components/SeedbedPullUp";
import GardenHeader from "./GardenHeader";

interface SeedDetailPageProps {
  seed: Seed;
  onBack: () => void;
  onProfileClick?: () => void;
  onPlantSeed?: () => void;
}

export default function SeedDetailPage({ seed, onBack, onProfileClick, onPlantSeed }: SeedDetailPageProps) {
  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Main White Card Container */}
      <motion.div 
        className="mx-4 mt-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Section - Same as listing page */}
        <GardenHeader />
        
        {/* Seed Image Section */}
        <div className="px-6 pb-6">
          <motion.div
            className="relative w-full h-80 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Seed Label Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-white border-1 border-black text-black px-3 py-1 rounded-full text-sm font-medium">
                {seed.label.toUpperCase()}
              </span>
            </div>
            
            {/* Seed Image */}
            <Image
              src={seed.seedImageUrl}
              alt={seed.name}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
        
        {/* Metrics pills */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-3">
            <motion.div 
              className="bg-white border-2 border-black rounded-full px-3 py-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="text-xs font-medium text-black mb-1">RAISED</div>
              <div className="font-medium text-black text-base scale-[1.2]">
                € {seed.snapshotPrice}
              </div>
            </motion.div>
            <motion.div 
              className="bg-white border-2 border-black rounded-full px-3 py-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              <div className="text-xs font-medium text-black mb-1">STEWARD</div>
              <div className="font-medium text-black text-base scale-[1.3]">
                {formatAddress(seed.owner)}
                </div>
            </motion.div>
            <motion.div 
              className="bg-white border-2 border-black rounded-full px-3 py-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="text-xs font-medium text-black mb-1 scale-[0.95]">EVOLUTIONS</div>
              <div className="font-medium text-black text-base scale-[1.4]">
                {seed.snapshotCount}
                </div>
            </motion.div>
          </div>
        </div>
        
        {/* Inline expandable seedbed */}
        <div className="px-6 pb-6 mt-6">
          <SeedbedPullUp seedbedImageSrc="/Subtract.svg" selectedSeed={seed} />
        </div>
      </motion.div>
    </div>
  );
}
