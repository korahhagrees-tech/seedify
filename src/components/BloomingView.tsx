/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "@/lib/assets";
import RootShapeArea from "@/components/wallet/RootShapeArea";

interface BloomingViewProps {
  backgroundImageUrl: string;
  beneficiary: string;
  seedEmblemUrl: string;
  storyText?: string;
  onExploreGarden?: () => void;
  onStory?: () => void;
  onShare?: () => void;
  onWallet?: () => void;
}

export default function BloomingView({
  backgroundImageUrl,
  beneficiary,
  seedEmblemUrl,
  storyText,
  onExploreGarden,
  onStory,
  onShare,
  onWallet,
}: BloomingViewProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image src={backgroundImageUrl} alt="Background" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-white/10" />

      <div className="relative z-10 px-4 pt-8 pb-8 max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-4">
          <Image src={assets.text} alt="The Way of Flowers" width={280} height={70} className="mx-auto" />
        </div>

        {/* You funded text */}
        <div className="text-center text-[12px] leading-5 text-white/95 mb-4">
          <div>You funded {beneficiary}</div>
          <div>Regenerative Sheep Grazing and here is how the</div>
          <div>plant’s morphology carries this as memory</div>
        </div>

        {/* Large rounded image card (match seed preview sizing) */}
        <div className="relative w-full h-98 rounded-[50px] overflow-hidden bordeer-2 border-dashed border-black/70 bg-white mb-8 mt-4 scale-[1.0]">
          <Image src={seedEmblemUrl} alt="Seed emblem" fill className="object-contain scale-[0.9]" />
        </div>
          {/* Share button bottom-right */}
          <button onClick={onShare} className="absolute top-132 right-4 w-12 h-12 rounded-full bg-white/95 opacity-70 shadow flex items-center justify-center">
            <Image src={assets.share} alt="Share" width={18} height={18} className="opacity-100" />
          </button>

        {/* Root shape area */}
        <div className="relative mt-38 lg:mt-22">
          <RootShapeArea
            onStory={onStory}
            onSubstrate={() => {}}
            onWallet={onWallet}
            onExploreGarden={onExploreGarden}
          />
        </div>
        {/* Story panel is routed, not inline */}
      </div>
    </div>
  );
}


