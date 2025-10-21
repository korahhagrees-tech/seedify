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

export default function StewardSeedCard({
  seed,
  onTendSeed,
  onExplore,
  index = 0,
}: StewardSeedCardProps) {
  const [tendedEcosystems] = useState(mockTendedEcosystems);
  const [currentImageSrc, setCurrentImageSrc] = useState(
    seed.seedImageUrl && seed.seedImageUrl.length > 0
      ? seed.seedImageUrl
      : `https://d17wy07434ngk.cloudfront.net/seed${seed.id}/seed.png`
  );
  const [imageErrorCount, setImageErrorCount] = useState(0);

  const FALLBACK_IMAGES = [
    seed.seedImageUrl && seed.seedImageUrl.length > 0 ? seed.seedImageUrl : null,
    `https://d17wy07434ngk.cloudfront.net/seed${seed.id}/seed.png`, // CloudFront with seedId
    "https://d17wy07434ngk.cloudfront.net/seed1/seed.png", // Final fallback
  ].filter(Boolean) as string[];

  const handleImageError = () => {
    const nextIndex = imageErrorCount + 1;
    
    if (nextIndex < FALLBACK_IMAGES.length) {
      console.log(
        `🌸 [IMAGE] Error loading steward seed image (attempt ${nextIndex}/${FALLBACK_IMAGES.length}), trying fallback:`,
        FALLBACK_IMAGES[nextIndex]
      );
      setCurrentImageSrc(FALLBACK_IMAGES[nextIndex]);
      setImageErrorCount(nextIndex);
    } else {
      console.log("🌸 [IMAGE] All fallbacks exhausted for steward seed, showing final fallback");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-6"
    >
      {/* Gradient bar with emblem and steward message */}
      <div className="relative mb-6 -mt-12 lg:-mt-8 md:-mt-8 overflow-hidden scale-[1.1] lg:scale-[1.0] pt-6 pb-2 md:scale-[1.0]">
        <div className="w-[490px] lg:w-[480px] md:w-[480px] rounded-full py-1 pl-16 pr-14 -ml-8 lg:-ml-1 md:ml-0 mt-2 bg-gradient-to-r from-gray-200 via-white to-gray-200 border-1 border-black scale-[0.75] lg:scale-[0.8] md:scale-[0.8]">
          <span className="text-sm text-center text-nowrap text-gray-800 ml-2 lg:ml-1 md:-ml-1">
            {`Thank You for Being the Steward of ${seed.label?.toUpperCase()}`}
          </span>
        </div>
        <div className="absolute left-4 lg:left-8 md:left-8 top-11 lg:top-12 md:top-12 -translate-y-1/2 w-14 h-14 lg:w-12 md:w-12 lg:h-12 md:h-12 z-10 rounded-full border-3 border-dotted border-black bg-gray-200 flex items-center justify-center shadow">
          <Image
            src={tendedEcosystems[index].seedEmblemUrl}
            alt="Steward emblem"
            width={22}
            height={22}
            className="w-8 h-8 lg:w-8 md:w-8 lg:h-8 md:h-8"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="px-6">
        <div className="flex gap-8 items-start -ml-1 scale-[1.05] lg:scale-[0.95] md:scale-[0.95] -mt-2 lg:-mt-6 md:-mt-6">
          {/* Large image on the left */}
          <div className="relative w-[230px] h-[230px] rounded-[60px] overflow-hidden flex-shrink-0">
            <Image
              src={currentImageSrc}
              alt=""
              fill
              className="object-cover"
              onError={handleImageError}
            />
          </div>

          {/* Metrics and actions on the right */}
          <div className="flex-1 space-y-1 pt-4 -ml-4">
            <div className="grid grid-cols-1 gap-3 max-w-xs">
              <div className="text-center">
                <div className="text-xs text-gray-600 tracking-wide">
                  TOTAL RAISED
                </div>
                <div className="text-xl text-gray-900">
                  {seed.depositAmount} ETH
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 tracking-wide">
                  EVOLUTIONS
                </div>
                <div className="text-xl text-gray-900">
                  {seed.snapshotCount}
                </div>
              </div>
            </div>

            <div className="space-y-3 max-w-sm scale-[0.7] -ml-6">
              <button
                onClick={onTendSeed}
                className="w-full px-10 py-1 text-2xl border-1 border-black rounded-full hover:bg-gray-50 transition-colors peridia-display leading-relaxed text-nowrap"
              >
                T<span className="text-nowrap favorit-mono">end </span>S
                <span className="text-nowrap favorit-mono">eed</span>
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
