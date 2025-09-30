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
  onBack: () => void;
  onProfileClick?: () => void;
  onPlantSeed?: () => void;
}

export default function SeedDetailPage({ seed, onBack, onProfileClick, onPlantSeed }: SeedDetailPageProps) {
  return (
    <div className="h-screen w-full bg-white relative overflow-hidden" style={{ height: '100vh', overflowY: 'hidden' }}>
      {/* Seed Label Badge - completely outside motion containers */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[10]">
        <span className="bg-white border-1 border-black text-black px-3 py-1 rounded-full text-sm font-medium shadow">
          {seed.label.toUpperCase()}
        </span>
      </div>

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
          <div className="grid grid-cols-3 gap-3 scale-[0.9]">
            <motion.div 
              className="bg-white border-1 border-black rounded-full -px-3 py-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="text-xs font-medium text-black mb-1">RAISED</div>
              <div className="font-medium text-black text-base scale-[1.1]">
                € {seed.snapshotPrice}
              </div>
            </motion.div>
            <motion.div 
              className="bg-white border-1 border-black rounded-full px-3 py-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              <div className="text-xs font-medium text-black mb-1">STEWARD</div>
              <div className="font-medium text-black text-base scale-[1.1]">
                {formatAddress(seed.owner)}
                </div>
            </motion.div>
            <motion.div 
              className="bg-white border-1 border-black rounded-full px-3 py-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="text-xs font-medium text-black mb-1 scale-[0.95]">EVOLUTIONS</div>
              <div className="font-medium text-black text-base scale-[1.1]">
                {seed.snapshotCount}
                </div>
            </motion.div>
          </div>
        </div>
        
        {/* Expandable seedbed */}
        <div className="scale-[0.95]">
          <SeedbedPullUp selectedSeed={seed} />
        </div>

        {/* Way of Flowers Card Link */}
        <div className="px-6 pb-6 mt-6">
          <Link href={`/way-of-flowers/${seed.id}`}>
            <motion.div
              className="bg-white border-2 border-dashed border-black/30 rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg font-medium text-black mb-2">The Way of Flowers</h3>
              <p className="text-sm text-gray-600">Explore the philosophical journey of this seed</p>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
