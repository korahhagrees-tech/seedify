/* eslint-disable @typescript-eslint/no-unused-vars */
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
      {/* Main Seed Image Card - with external label */}
      <div className="relative -bottom-10 z-10">
          <motion.div 
            className="bg-white border-1 border-black rounded-full p-3 text-center scale-[0.5] bottom-14"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.25 }}
          >
            <div className="font-medium text-black text-lg scale-[1.3]">
              <span className="">STEWARD</span> {formatAddress(seed.owner)}
            </div>
          </motion.div>
      </div>
      <div className="relative">
        {/* Seed Label Badge - placed outside to avoid clipping */}
        <div className="absolute top-3 left-8 -translate-x-1/2 z-[5]">
          <span className="bg-white border-1 border-black text-black px-3 py-1 rounded-full text-sm font-medium shadow">
            {seed.label.toUpperCase()}
          </span>
        </div>

        <motion.div
          className="relative w-full h-[380px] rounded-[60px] overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
          onClick={onClick}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
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
      </div>
      
      {/* Info Buttons - Separate from the image card */}
      <div className="grid grid-cols-3 gap-3 mb-6 scale-[0.9]">
        {/* Price Button */}
        <motion.div 
          className="bg-white border-1 border-black rounded-full p-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        >
          <div className="text-xs font-medium text-black mb-1">RAISED</div>
          <div className="font-medium text-black text-sm lg:text-base scale-[1.1]">
            {parseFloat(seed.depositAmount).toFixed(4)} ETH
          </div>
        </motion.div>
        
        {/* Seeder Button - Owner's wallet address */}
        <motion.div 
          className="bg-white border-1 border-black rounded-full p-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.25 }}
        >
          <div className="text-xs font-medium text-black mb-1">SNAP PRICE</div>
          <div className="font-medium text-black text-sm lg:text-base scale-[1.2] text-nowrap lg:scale-[1.1]">
            {parseFloat(seed.snapshotPrice).toFixed(4)} ETH
          </div>
        </motion.div>
        
        {/* Flowers Count Button */}
        <motion.div 
          className="bg-white border-1 border-black rounded-full p-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
        >
          <div className="text-xs font-medium text-black mb-1 scale-[0.95]">EVOLUTIONS</div>
          <div className="font-medium text-black text-sm lg:text-base scale-[1.4]">
            {seed.snapshotCount}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
