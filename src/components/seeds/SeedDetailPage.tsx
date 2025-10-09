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
            <div className="relative -bottom-34 z-10">
          <motion.div 
            className="bg-white border-1 border-black rounded-full p-3 text-center scale-[0.5] bottom-14"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <div className="font-light text-black text-lg scale-[1.3]">
              <span className="-ml-2">STEWARD</span> <span className="ml-10">{formatAddress(seed.owner)}</span>
            </div>
          </motion.div>
      </div>
      {/* Seed Label Badge - completely outside motion containers */}
      <div className="fixed top-39 md:left-64 lg:left-145 left-14 -translate-x-1/2 z-[10]">
        <span className="bg-white border-1 border-black text-black px-3 py-1 rounded-full text-sm font-light shadow">
          {seed.label.toUpperCase()}
        </span>
      </div>

      {/* Main White Card Container */}
      <motion.div 
        className="mx-4 -mt-5 lg:-mt-8 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Section - Same as listing page */}
        <GardenHeader />
        
        {/* Seed Image Section */}
        <div className="px-6 pb-6 mt-10 lg:mt-12">
          <motion.div
            className="relative w-96 h-96 mx-auto -ml-4 rounded-[60px] overflow-hidden"
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
          <div className="grid grid-cols-3 gap-3 scale-[1.05]">
            <motion.div 
              className="bg-white border-1 border-black h-10 rounded-full -px-3 py-1 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="text-[10px] font-light text-black -mt-1 mb-2">RAISED</div>
              <div className="font-light text-black -mt-1 -mb-4 text-xs text-nowrap lg:text-xs scale-[1.25]">
                {parseFloat(seed.depositAmount).toFixed(4)} <span className="text-xs">ETH</span>
              </div>
            </motion.div>
            <motion.div 
              className="bg-white border-1 border-black h-10 rounded-full px-3 py-1 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              <div className="text-[10px] font-light text-black -mt-1 -mb-4"> SNAP PRICE</div>
              <div className="font-light text-black mt-5 -mb-4 text-xs text-nowrap lg:text-xs scale-[1.25]">
                {parseFloat(seed.snapshotPrice).toFixed(4)} <span className="text-xs">ETH</span>
                </div>
            </motion.div>
            <motion.div 
              className="bg-white border-1 border-black h-10 rounded-full px-3 py-1 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="text-[10px] font-light text-black -mt-1 -mb-4">EVOLUTIONS</div>
              <div className="font-light text-black mt-5 -mb-4 text-xs text-nowrap lg:text-xs scale-[1.3]">
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
        {/* <div className="px-6 pb-6 mt-6">
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
        </div> */}
      </motion.div>
    </div>
  );
}
