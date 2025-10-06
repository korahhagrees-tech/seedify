"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { assets } from "@/lib/assets";

interface RootShapeAreaProps {
  onStory?: () => void;
  onSubstrate?: () => void;
  onWallet?: () => void;
  onExploreGarden?: () => void;
  className?: string;
  showGlassEffect?: boolean;
  showStoryButton?: boolean;
}

export default function RootShapeArea({
  onStory,
  onSubstrate,
  onWallet,
  onExploreGarden,
  className = "",
  showGlassEffect = false,
  showStoryButton = true
}: RootShapeAreaProps) {
  const router = useRouter();

  const handleSubstrate = () => {
    if (onSubstrate) {
      onSubstrate();
    } else {
      router.push("/about");
    }
  };

  const handleWallet = () => {
    if (onWallet) {
      onWallet();
    } else {
      router.push("/wallet");
    }
  };

  const handleStory = () => {
    if (onStory) {
      onStory();
    } else {
      router.push("/garden");
    }
  };

  const handleExploreGarden = () => {
    if (onExploreGarden) {
      onExploreGarden();
    } else {
      router.push("/garden");
    }
  };
  return (
    <div className={`relative ${className}`}>
      {/* Translucent glass effect behind root shape */}
      {showGlassEffect && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-t-3xl -top-8 z-0 scale-[0.9] mt-16" />
      )}
      
      <Image src={assets.seedRootWhite} alt="Root shape" width={344} height={250} className="w-full h-auto max-w-sm mx-auto relative z-10" />

      {/* Precisely positioned buttons over root shape */}
      <div className="absolute inset-0 z-20">
        {/* Story - top bridge */}
        {showStoryButton ? (
          <button
            onClick={handleStory}
            className="absolute left-1/2 -translate-x-1/2 top-[18%] px-4 py-1 rounded-full bg-gray-200 shadow peridia-display border-3 border-black/70 border-dotted"
          >
            <span className="text-lg">Story</span>
          </button>
        ) : (
          <div className="absolute left-1/2 -translate-x-1/2 top-[18%]">
            <Image
              src="/dashed-circle.svg"
              alt="Dashed circle"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </div>
        )}
        
        {/* Substrate - mid bridge */}
        <button
          onClick={handleSubstrate}
          className="absolute left-36 -translate-x-1/2 top-[45%] px-6 -py-1 text-xs rounded-full bg-white/75 border-2 border-dotted scale-[1.0] peridia-display border-black/70 shadow leading-relaxed"
        >
          <span className="text-lg">Substrate</span>
        </button>
        
        {/* Wallet - left lobe */}
        <button
          onClick={handleWallet}
          className="absolute left-[12%] bottom-[18%] px-4 py-1 text-xs rounded-full bg-gray-200 border-2 border-dotted scale-[1.3] border-black/70 shadow"
        >
          Wallet
        </button>
        
        {/* Explore - base pod (bigger pill) */}
        <button
          onClick={handleExploreGarden}
          className="absolute right-[8%] bottom-[16%] px-6 w-[35%] py-2 rounded-full bg-white/75 border-1 border-black/70 shadow scale-[1.0] peridia-display"
        >
          <span className="text-lg">Explore the Garden</span>
        </button>
      </div>
    </div>
  );
}
