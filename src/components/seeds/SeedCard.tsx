"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Seed, weiToEth, formatAddress } from "@/types/seed";

interface SeedCardProps {
  seed: Seed;
  onClick?: () => void;
  index?: number;
}

export default function SeedCard({ seed, onClick, index = 0 }: SeedCardProps) {
  const handleImageLoad = () => {
    console.log('🌸 [IMAGE] Successfully loaded:', seed.seedImageUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="space-y-4"
    >
      {/* Main Seed Image Card - The whole card is just the rounded image */}
      <motion.div
        className="relative w-full h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-600"
        onClick={onClick}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Seed Label Badge - overlaps to sit on the border */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-[5]">
          <span className="bg-white border-2 border-black text-black px-3 py-1 rounded-full text-sm font-medium shadow">
            {seed.label.toUpperCase()}
          </span>
        </div>
        
        {/* Seed Image - fills the entire rounded container */}
        <Image
          src={seed.seedImageUrl}
          alt={seed.name}
          fill
          className="object-cover"
          onLoad={handleImageLoad}
          priority={index < 2}
        />
      </motion.div>
      
      {/* Info Buttons - Separate from the image card */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* Price Button */}
        <motion.div 
          className="bg-white border-2 border-black rounded-full p-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        >
          <div className="text-xs font-medium text-black mb-1">PRICE</div>
          <div className="font-bold text-black">
            {weiToEth(seed.snapshotPrice)} ETH
          </div>
        </motion.div>
        
        {/* Seeder Button - Owner's wallet address */}
        <motion.div 
          className="bg-white border-2 border-black rounded-full p-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.25 }}
        >
          <div className="text-xs font-medium text-black mb-1">SEEDER</div>
          <div className="font-bold text-black text-xs">
            {formatAddress(seed.owner)}
          </div>
        </motion.div>
        
        {/* Flowers Count Button */}
        <motion.div 
          className="bg-white border-2 border-black rounded-full p-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
        >
          <div className="text-xs font-medium text-black mb-1">FLOWERS</div>
          <div className="font-bold text-black">
            {seed.snapshotCount}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
