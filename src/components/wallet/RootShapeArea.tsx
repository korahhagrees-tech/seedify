"use client";

import Image from "next/image";
import { assets } from "@/lib/assets";

interface RootShapeAreaProps {
  onStory?: () => void;
  onSubstrate?: () => void;
  onWallet?: () => void;
  onExploreGarden?: () => void;
  className?: string;
}

export default function RootShapeArea({
  onStory,
  onSubstrate,
  onWallet,
  onExploreGarden,
  className = ""
}: RootShapeAreaProps) {
  return (
    <div className={`relative ${className}`}>
      <Image src={assets.seedRoot} alt="Root shape" width={344} height={250} className="w-full h-auto max-w-sm mx-auto" />

      {/* Precisely positioned buttons over root shape */}
      <div className="absolute inset-0">
        {/* Story - top bridge */}
        {onStory && (
          <button
            onClick={onStory}
            className="absolute left-1/2 -translate-x-1/2 top-[18%] px-4 py-1 text-xs rounded-full bg-white/95 shadow"
          >
            Story
          </button>
        )}
        
        {/* Substrate - mid bridge */}
        {onSubstrate && (
          <button
            onClick={onSubstrate}
            className="absolute left-1/2 -translate-x-1/2 top-[35%] px-4 py-1 text-xs rounded-full bg-white/75 border-2 border-dashed border-black/70 shadow"
          >
            Substrate
          </button>
        )}
        
        {/* Wallet - left lobe */}
        {onWallet && (
          <button
            onClick={onWallet}
            className="absolute left-[12%] bottom-[45%] px-4 py-1 text-xs rounded-full bg-white/75 border-2 border-dashed border-black/70 shadow"
          >
            Wallet
          </button>
        )}
        
        {/* Explore - base pod (bigger pill) */}
        {onExploreGarden && (
          <button
            onClick={onExploreGarden}
            className="absolute right-[8%] bottom-[38%] px-6 w-[35%] py-2 text-sm rounded-full bg-white/75 border-2 border-dashed border-black/70 shadow scale-[0.8]"
          >
            Explore the Garden
          </button>
        )}
      </div>
    </div>
  );
}
