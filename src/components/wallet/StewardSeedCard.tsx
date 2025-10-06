"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Seed } from "@/types/seed";
import { mockTendedEcosystems } from "@/lib/api/mocks/userMocks";
import { useState } from "react";

interface StewardSeedCardProps {
  seed: Seed;
  onTendSeed: () => void;
  onExplore: () => void;
  index?: number;
}

export default function StewardSeedCard({ seed, onTendSeed, onExplore, index = 0 }: StewardSeedCardProps) {
  const [tendedEcosystems] = useState(mockTendedEcosystems);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-6"
    >
      {/* Gradient bar with emblem and steward message */}
        <div className="text-xs text-gray-800 text-center -mb-1 -mt-2">YOUR TENDED ECOSYSTEM</div>
      <div className="relative mb-4">
        <div className="w-[640px] rounded-full py-3 pl-20 pr-6 -ml-26 bg-gradient-to-r from-gray-200 via-white to-gray-200 border-1 border-black scale-[0.6]">
          <span className="text-lg text-center text-gray-800 text-nowrap">
            {`Thank You for Being the Steward of ${seed.label?.toUpperCase()}`}
          </span>
        </div>
        <div className="absolute left-4 top-6 -translate-y-1/2 w-12 h-12 rounded-full border-3 border-dotted border-black bg-gray-200 flex items-center justify-center shadow">
          <Image src={tendedEcosystems[index].seedEmblemUrl} alt="Steward emblem" width={22} height={22} className="w-8 h-8" />
        </div>
      </div>

      {/* Main content */}
      <div className="px-6">
        <div className="flex gap-8 items-start -ml-4">
          {/* Large image on the left */}
          <div className="relative w-[230px] h-[230px] rounded-[60px] overflow-hidden flex-shrink-0">
            <Image src={seed.seedImageUrl} alt={seed.name} fill className="object-cover" />
          </div>

          {/* Metrics and actions on the right */}
          <div className="flex-1 space-y-1 pt-4 -ml-4">
            <div className="grid grid-cols-1 gap-3 max-w-xs">
              <div className="text-center">
                <div className="text-xs text-gray-600 tracking-wide">TOTAL RAISED</div>
                <div className="text-xl text-gray-900">{seed.depositAmount} ETH</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 tracking-wide">EVOLUTIONS</div>
                <div className="text-xl text-gray-900">{seed.snapshotCount}</div>
              </div>
            </div>

            <div className="space-y-3 max-w-sm scale-[0.7] -ml-6">
              <button
                onClick={onTendSeed}
                className="w-full px-10 py-1 text-2xl border-1 border-black rounded-full hover:bg-gray-50 transition-colors peridia-display leading-relaxed text-nowrap"
              >
                T<span className="text-nowrap favorit-mono">end </span>S<span className="text-nowrap favorit-mono">eed</span>
              </button>
              <button
                onClick={onExplore}
                className="w-full px-6 py-1 text-2xl border-4 border-black rounded-full border-dotted hover:bg-gray-50 bg-gray-200 transition-colors peridia-display leading-relaxed"
              >
                E<span className="text-nowrap favorit-mono">xplore</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

 
