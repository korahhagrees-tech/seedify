"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Seed, weiToEth, formatAddress } from "@/types/seed";
import SeedbedPullUp from "@/components/SeedbedPullUp";

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
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left icon - Seedbed Button (Back) */}
          <button 
            onClick={onBack}
            className="w-10 h-10 flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/Seedbed Button.svg"
              alt="Back to Garden"
              width={40}
              height={40}
              className="w-full h-full"
            />
          </button>
          
          {/* Center logo */}
          <div className="flex-1 flex justify-center">
            <Image
              src="/test-pink.svg"
              alt="THE WAY OF FLOWERS"
              width={200}
              height={48}
              className="w-auto h-auto max-w-[200px]"
            />
          </div>
          
          {/* Right icon - Profile Button */}
          <button 
            onClick={onProfileClick}
            className="w-10 h-10 flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/Profile Button.svg"
              alt="Profile"
              width={40}
              height={40}
              className="w-full h-full"
            />
          </button>
        </div>
        
        {/* Seed Image Section */}
        <div className="px-6 pb-6">
          <motion.div
            className="relative w-full h-80 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Seed Label Badge */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-white border-2 border-black text-black px-3 py-1 rounded-lg text-sm font-medium">
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
              <div className="text-[10px] tracking-wide text-black">RAISED</div>
              <div className="text-lg font-semibold text-black">{weiToEth(seed.snapshotPrice)} ETH</div>
            </motion.div>
            <motion.div 
              className="bg-white border-2 border-black rounded-full px-3 py-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              <div className="text-[10px] tracking-wide text-black">STEWARD</div>
              <div className="text-base font-semibold text-black">{formatAddress(seed.owner)}</div>
            </motion.div>
            <motion.div 
              className="bg-white border-2 border-black rounded-full px-3 py-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="text-[10px] tracking-wide text-black">EVOLUTIONS</div>
              <div className="text-lg font-semibold text-black">{seed.snapshotCount}</div>
            </motion.div>
          </div>
        </div>
        
        {/* Inline expandable seedbed */}
        <div className="px-6 pb-6 mt-6">
          <SeedbedPullUp seedbedImageSrc="/Seedbed.svg" selectedSeed={seed} />
        </div>
      </motion.div>
    </div>
  );
}
