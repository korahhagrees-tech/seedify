/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { assets } from "@/lib/assets";
import RootShapeArea from "@/components/wallet/RootShapeArea";
import GardenHeader from "./GardenHeader";
import WalletModal from "@/components/wallet/WalletModal";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

interface BloomingViewProps {
  backgroundImageUrl: string;
  beneficiary: string;
  seedEmblemUrl: string;
  snapshotImageUrl?: string;
  seedImageUrl?: string;
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
  snapshotImageUrl,
  seedImageUrl,
  storyText,
  onExploreGarden,
  onStory,
  onShare,
  onWallet,
}: BloomingViewProps) {
  const [showReveal, setShowReveal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  // Get the final image URL (snapshot or seed as fallback)
  const finalImageUrl = snapshotImageUrl || seedImageUrl || assets.testPink;

  // Handle wallet modal
  const handleWallet = () => {
    setIsWalletModalOpen(true);
  };

  const handleWalletModalClose = () => {
    setIsWalletModalOpen(false);
  };

  const handleLogout = async () => {
    setIsWalletModalOpen(false);
    await logout();
    // Force refresh to clear all state
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  const handleAddFunds = () => {
    // Add funds logic here
    console.log("Add funds clicked");
  };

  const handleExportKey = () => {
    // Export key logic here
    console.log("Export key clicked");
  };

  const handleSwitchWallet = () => {
    // Switch wallet logic here
    console.log("Switch wallet clicked");
  };

  const handlePrivyHome = () => {
    // Privy home logic here
    router.push("https://home.privy.io/login");
  };

  useEffect(() => {
    // After 30 seconds, trigger the reveal animation
    const timer = setTimeout(() => {
      setShowReveal(true);
      setIsLoading(false);
    }, 40000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* <Image src={backgroundImageUrl} alt="Background" fill className="object-cover" priority /> */}
      {/* <div className="absolute inset-0 bg-black/10" /> */}

      <div className="relative z-10 px-4 pt-8 pb-8 max-w-md mx-auto">
        {/* Logo */}
        <GardenHeader />
        {/* <div className="text-center mb-4">
          <Image src={assets.text} alt="The Way of Flowers" width={280} height={70} className="mx-auto" />
        </div> */}

        {/* Your Artwork text */}
        <div className="text-center text-[12px] leading-5 text-black/95 mb-8">
          <div>YOUR ARTWORK</div>
        </div>

        {/* Large rounded image card with loading state and reveal animation */}
        <div className="relative w-full h-98 rounded-[50px] overflow-hidden border-2 border-dashed border-black/70 bg-white mb-8 mt-4 scale-[1.0]">
          {/* Base image - always visible */}
          <Image
            src={
              finalImageUrl && finalImageUrl.length > 0
                ? finalImageUrl
                : "/seeds/01__GRG.png"
            }
            alt=""
            fill
            className="object-contain scale-[0.9]"
            onError={(e) => {
              console.log(
                "🌸 [IMAGE] Error loading blooming image, using placeholder"
              );
              const target = e.target as HTMLImageElement;
              if (
                target.src !== `${window.location.origin}/seeds/01__GRG.png`
              ) {
                target.src = "/seeds/01__GRG.png";
              }
            }}
          />

          {/* Loading overlay with text - pulls down to reveal */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: showReveal ? "100%" : 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 bg-gray-200 flex flex-col items-center justify-center p-8"
              >
                <Image
                  src={
                    seedEmblemUrl && seedEmblemUrl.length > 0
                      ? seedEmblemUrl
                      : "/seeds/01__GRG.png"
                  }
                  alt=""
                  width={300}
                  height={300}
                  className="mb-12 -mt-18 opacity-20 scale-[1.1] backdrop-blur-sm"
                  onError={(e) => {
                    console.log(
                      "🌸 [IMAGE] Error loading blooming emblem, using placeholder"
                    );
                    const target = e.target as HTMLImageElement;
                    if (
                      target.src !==
                      `${window.location.origin}/seeds/01__GRG.png`
                    ) {
                      target.src = "/seeds/01__GRG.png";
                    }
                  }}
                />
                <div className="text-center text-gray-600 text-sm text-nowrap scale-[0.95] font-medium -mt-62 leading-relaxed">
                  <div>your stewardship is becoming visible form</div>
                  <div>a morphological evolution accelerating beyond the</div>
                  <div>limits of Earth...</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Share button bottom-right */}
        <button
          onClick={onShare}
          className="absolute top-132 right-4 w-12 h-12 rounded-full bg-white/95 opacity-70 shadow flex items-center justify-center"
        >
          <Image
            src={assets.share}
            alt="Share"
            width={18}
            height={18}
            className="opacity-100"
          />
        </button>

        {/* You funded text - moved below the image */}
        <div className="text-center text-[12px] leading-5 text-black/95 mb-4">
          <div>
            You funded <span className="peridia-display">{beneficiary}</span>
          </div>
          <div>Regenerative Sheep Grazing and here is how the</div>
          <div>{`plant's morphology carries this as memory`}</div>
        </div>

        {/* Root shape area */}
        <div className="relative mt-18 lg:mt-12">
          <RootShapeArea
            onStory={onStory}
            onSubstrate={() => {}}
            onWallet={handleWallet}
            onExploreGarden={onExploreGarden}
          />
        </div>
        {/* Story panel is routed, not inline */}
      </div>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={handleWalletModalClose}
        onLogout={handleLogout}
        onAddFunds={handleAddFunds}
        onExportKey={handleExportKey}
        onSwitchWallet={handleSwitchWallet}
        onPrivyHome={handlePrivyHome}
      />
    </div>
  );
}
