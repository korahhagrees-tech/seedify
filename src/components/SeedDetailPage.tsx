"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Seed, weiToEth, formatAddress } from "@/types/seed";

interface SeedDetailPageProps {
  seed: Seed;
  onBack: () => void;
  onProfileClick?: () => void;
  onPlantSeed?: () => void;
}

export default function SeedDetailPage({ seed, onBack, onProfileClick, onPlantSeed }: SeedDetailPageProps) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Main White Card Container */}
      <motion.div 
        className="mx-4 mt-4 mb-6 bg-white rounded-2xl shadow-lg"
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
        
        {/* Page Title */}
        <div className="px-6 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center">SEED OVERVIEW</h1>
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
        
        {/* Information Buttons */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-3">
            {/* Raised Button */}
            <motion.div 
              className="bg-white border-2 border-black rounded-lg p-3 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="text-xs font-medium text-black mb-1">RAISED</div>
              <div className="font-bold text-black">
                {weiToEth(seed.snapshotPrice)} ETH
              </div>
            </motion.div>
            
            {/* Seeder Button */}
            <motion.div 
              className="bg-white border-2 border-black rounded-lg p-3 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              <div className="text-xs font-medium text-black mb-1">SEEDER</div>
              <div className="font-bold text-black text-xs">
                {formatAddress(seed.owner)}
              </div>
            </motion.div>
            
            {/* Evolution Button */}
            <motion.div 
              className="bg-white border-2 border-black rounded-lg p-3 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="text-xs font-medium text-black mb-1">EVOLUTION</div>
              <div className="font-bold text-black">
                #{seed.snapshotCount}
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Call to Action */}
        <motion.button 
          className="px-6 pb-6 text-center space-y-2 w-full hover:bg-gray-50 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          onClick={onPlantSeed}
        >
          <p className="text-sm text-black">
            PLANT YOUR SEED IN A PROJECT SEEDBED
          </p>
          <p className="text-base text-black underline">
            Walkers Reserve
          </p>
        </motion.button>
      </motion.div>
    </div>
  );
}
