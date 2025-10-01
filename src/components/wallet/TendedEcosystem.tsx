"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { assets } from "@/lib/assets";

interface TendedEcosystemProps {
  date: string;
  seedEmblemUrl: string;
  beneficiaryName: string;
  seedImageUrl: string;
  userContribution: string;
  ecosystemCompost: string;
  onReadMore: () => void;
  onTendAgain: () => void;
  onShare: () => void;
  index?: number;
}

export default function TendedEcosystem({
  date,
  seedEmblemUrl,
  beneficiaryName,
  seedImageUrl,
  userContribution,
  ecosystemCompost,
  onReadMore,
  onTendAgain,
  onShare,
  index = 0
}: TendedEcosystemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-6"
      >
      {/* Date and Seed Emblem */}
      <span className="text-sm text-gray-600">{date}</span>
      {/* Emblem + Gradient Bar (conjoined) */}
      <div className="relative mb-4">
        {/* Gradient bar */}
        <div className="w-[460px] rounded-full py-2 pl-16 pr-4 -ml-8 bg-gradient-to-r from-gray-200 via-white to-gray-200 border-1 border-black scale-[0.8]">
          <span className="text-sm text-gray-700 text-nowrap -ml-4">{beneficiaryName}</span>
        </div>
        {/* Emblem overlapping on the bar */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-dashed border-gray-500 bg-white flex items-center justify-center shadow">
          <Image
            src={seedEmblemUrl}
            alt="Seed emblem"
            width={22}
            height={22}
            className="w-6 h-6"
          />
        </div>
      </div>


      {/* Main Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex gap-6">
          {/* Left Side - Large Image */}
          <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={seedImageUrl}
              alt="Seed image"
              fill
              className="object-cover"
            />
            {/* Share Icon */}
            <button
              onClick={onShare}
              className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm"
            >
              <Image
                src={assets.share}
                alt="Share"
                width={14}
                height={14}
                className="w-3.5 h-3.5"
              />
            </button>
          </div>

          {/* Right Side - Details and Buttons */}
          <div className="flex-1 space-y-4">
            {/* Contribution Details */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500 uppercase">YOUR CONTRIBUTION</div>
              <div className="text-lg font-semibold text-gray-900">{userContribution}</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-gray-500 uppercase">ECOSYSTEM COMPOST</div>
              <div className="text-lg font-semibold text-gray-900">{ecosystemCompost}</div>
            </div>

            {/* Action Buttons - Stacked vertically */}
            <div className="space-y-3 pt-2">
              <button
                onClick={onReadMore}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
                Read More
              </button>
              <button
                onClick={onTendAgain}
                className="w-full px-4 py-2 text-sm border-2 border-dashed border-gray-400 rounded-full hover:bg-gray-50 transition-colors"
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
