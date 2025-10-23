/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { assets } from "@/lib/assets";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface TendedEcosystemProps {
  date: string;
  seedEmblemUrl: string;
  beneficiaryName: string;
  seedImageUrl: string;
  userContribution: string;
  ecosystemCompost: string;
  onReadMoreAction: () => void;
  onTendAgainAction: () => void;
  onShare?: (data: {
    imageUrl: string;
    beneficiaryName: string;
    beneficiaryCode?: string;
  }) => void;
  index?: number;
  beneficiarySlug?: string;
  seedId?: string;
  seedSlug?: string;
  beneficiaryCode?: string; // Add beneficiary code for sharing
}

export default function TendedEcosystem({
  date,
  seedEmblemUrl,
  beneficiaryName,
  seedImageUrl,
  userContribution,
  ecosystemCompost,
  onReadMoreAction,
  onTendAgainAction,
  onShare,
  index = 0,
  beneficiarySlug,
  seedId,
  seedSlug,
  beneficiaryCode,
}: TendedEcosystemProps) {
  const router = useRouter();
  const [imageErrorCount, setImageErrorCount] = useState(0);
  const [currentImageSrc, setCurrentImageSrc] = useState(
    seedImageUrl || "/seeds/01__GRG.png"
  );

  // Reset image state when seedImageUrl prop changes
  useEffect(() => {
    setCurrentImageSrc(seedImageUrl || "/seeds/01__GRG.png");
    setImageErrorCount(0);
  }, [seedImageUrl]);

  // Handle Tend Again button click - routes to ecosystem page
  const handleTendAgain = () => {
    if (seedId && seedSlug && beneficiarySlug) {
      const url = `/seed/${seedId}/${seedSlug}/ecosystem/${beneficiarySlug}`;
      console.log("Routing to:", url); // Debug log
      router.push(url);
    } else {
      console.error("Missing routing data:", {
        seedId,
        seedSlug,
        beneficiarySlug,
      });
      onTendAgainAction(); // Fallback to original handler
    }
  };

  // Handle Share button click - trigger page-level share modal
  const handleShare = () => {
    if (onShare) {
      onShare({
        imageUrl: currentImageSrc,
        beneficiaryName: beneficiaryName,
        beneficiaryCode: beneficiaryCode,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-6"
    >
      {/* Date */}
      <div className="text-sm text-gray-600 -mb-4 ml-14">{date}</div>

      {/* Emblem + Gradient Bar (conjoined) */}
      <div className="relative mb-4 overflow-hidden pt-4 pb-3">
        {/* Gradient bar */}
        <div className="lg:w-[450px] md:w-[450px] w-[370px] rounded-full py-1 pl-16 pr-4 -ml-4 bg-gradient-to-r from-gray-200 via-white to-gray-200 border-1 border-black scale-[0.85]">
          <span className="text-[10px] lg:text-[12px] md:text-[12px] text-gray-700 text-nowrap block -ml-4 lg:-ml-4 md:-ml-5">
            {beneficiaryName}
          </span>
        </div>
        {/* Emblem overlapping on the bar */}
        <div className="absolute left-0 top-6 -translate-y-1/2 w-12 h-12 rounded-full border-3 border-dotted border-gray-500 bg-white flex items-center justify-center shadow">
          <Image
            src={seedEmblemUrl}
            alt="Seed emblem"
            width={22}
            height={22}
            className="w-12 h-12"
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="p-6">
        <div className="flex gap-6 lg:ml-0 -ml-6 md:ml-0">
          {/* Left Side - Large Image */}
          <div className="relative lg:w-54 md:w-54 w-48 lg:h-54 md:h-54 h-48 rounded-[50px] overflow-hidden flex-shrink-0 -mt-8">
            <Image
              src={currentImageSrc}
              alt=""
              fill
              className="object-cover"
              onError={(e) => {
                console.log(
                  `🌸 [IMAGE] Error loading image (attempt ${
                    imageErrorCount + 1
                  }), trying fallback`
                );

                const newErrorCount = imageErrorCount + 1;
                setImageErrorCount(newErrorCount);

                // Prevent infinite retry loops
                if (newErrorCount > 3) {
                  console.log(
                    "🌸 [IMAGE] Max retries reached, using final fallback"
                  );
                  setCurrentImageSrc(
                    "https://d17wy07434ngk.cloudfront.net/seed1/seed.png"
                  );
                  return;
                }

                // Try fallback images in sequence
                const fallbackImages = [
                  "https://d17wy07434ngk.cloudfront.net/seed1/seed.png",
                  "https://d17wy07434ngk.cloudfront.net/seed2/seed.png",
                  "https://d17wy07434ngk.cloudfront.net/seed3/seed.png",
                ];

                if (newErrorCount <= fallbackImages.length) {
                  const fallbackSrc = fallbackImages[newErrorCount - 1];
                  console.log(`🌸 [IMAGE] Trying fallback: ${fallbackSrc}`);
                  setCurrentImageSrc(fallbackSrc);
                } else {
                  // Use a simple placeholder
                  setCurrentImageSrc(
                    "https://d17wy07434ngk.cloudfront.net/seed1/seed.png"
                  );
                }
              }}
            />
            {/* Share Icon */}
            <button
              onClick={handleShare}
              className="absolute bottom-2 -left-2 w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm opacity-80 z-50"
            >
              <Image
                src={assets.share}
                alt="Share"
                width={14}
                height={14}
                className="w-6 h-6"
              />
            </button>
          </div>

          {/* Right Side - Details and Buttons */}
          <div className="flex-1 space-y-2 -mt-7">
            {/* Contribution Details */}
            <div className="space-y-1">
              <div className="text-[9px] text-nowrap font-bold text-center text-gray-500 uppercase">
                YOUR CONTRIBUTION
              </div>
              <div className="text-lg text-nowrap text-center text-gray-900 scale-[0.8] lg:scale-[1.0] md:scale-[0.8]">
                {userContribution}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[9px] text-nowrap font-bold text-center text-gray-500 uppercase">
                ECOSYSTEM COMPOST
              </div>
              <div className="text-lg text-nowrap text-center text-gray-900 scale-[0.8] lg:scale-[1.0] md:scale-[0.8]">
                {ecosystemCompost}
              </div>
            </div>

            {/* Action Buttons - Stacked vertically */}
            <div className="space-y-3 pt-2">
              <button
                onClick={onReadMoreAction}
                className="w-full px-4 py-1 text-base border-1 border-black rounded-full hover:bg-gray-50 transition-colors peridia-display leading-relaxed"
              >
                Read More
              </button>
              <button
                onClick={handleTendAgain}
                className="w-full px-4 py-1 text-base border-3 border-gray-400 rounded-full hover:bg-gray-50 transition-colors border-dotted peridia-display leading-relaxed text-nowrap"
              >
                Tend Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
