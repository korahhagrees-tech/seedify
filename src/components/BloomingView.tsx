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
import { clearAppStorage } from "@/lib/auth/logoutUtils";
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
  onShare?: (clickPosition: { x: number; y: number }) => void;
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
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  // Get the final image URL (snapshot or seed as fallback)
  const initialImageUrl = snapshotImageUrl || seedImageUrl || "https://d17wy07434ngk.cloudfront.net/seed1/seed.png";
  const [currentImageSrc, setCurrentImageSrc] = useState(initialImageUrl);
  const [imageErrorCount, setImageErrorCount] = useState(0);
  const [isPinging, setIsPinging] = useState(false);
  const [isSnapshotReady, setIsSnapshotReady] = useState(false);

  // Legacy final image URL (for logging/debugging)
  const finalImageUrl = snapshotImageUrl || seedImageUrl || assets.testPink;

  // Reset image state when props change
  useEffect(() => {
    const newImageUrl = snapshotImageUrl || seedImageUrl || "https://d17wy07434ngk.cloudfront.net/seed1/seed.png";
    setCurrentImageSrc(newImageUrl);
    setImageErrorCount(0);
    setIsSnapshotReady(false);

    console.log("🔍 [BloomingView] Image URLs:", {
      snapshotImageUrl,
      seedImageUrl,
      currentImageSrc: newImageUrl,
      finalImageUrl,
    });
  }, [snapshotImageUrl, seedImageUrl, finalImageUrl]);

  // Attempt to check the constructed snapshot image URL before switching
  const pingSnapshotImage = async () => {
    if (!snapshotImageUrl) return;
    setIsPinging(true);
    const attempts = 4;
    for (let i = 0; i < attempts; i++) {
      try {
        const res = await fetch(snapshotImageUrl, { method: 'HEAD', cache: 'no-store' });
        if (res.ok && res.status !== 403) {
          setCurrentImageSrc(snapshotImageUrl);
          setIsSnapshotReady(true);
          break;
        }
      } catch (_) {
        // ignore and retry
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
    setIsPinging(false);
  };

  useEffect(() => {
    if (snapshotImageUrl) {
      void pingSnapshotImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshotImageUrl]);

  // Handle wallet modal
  const handleWallet = () => {
    if (onWallet) {
      onWallet();
    } else {
      setIsWalletModalOpen(true);
    }
  };

  const handleWalletModalClose = () => {
    setIsWalletModalOpen(false);
  };

  const handleLogout = async () => {
    setIsWalletModalOpen(false);
    clearAppStorage();
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

  const handleSubstrate = () => {
    // Substrate logic here
    console.log("Substrate clicked");
    router.push("/about");
  };

  useEffect(() => {
    // After 3 seconds, trigger the reveal animation (reduced from 40 seconds for better UX)
    const timer = setTimeout(() => {
      setShowReveal(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Also trigger reveal when snapshot image is available
  useEffect(() => {
    if (snapshotImageUrl && snapshotImageUrl.length > 0) {
      // Small delay to ensure image is loaded, then trigger reveal
      const timer = setTimeout(() => {
        setShowReveal(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [snapshotImageUrl]);

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
        <div className="relative w-full h-98 rounded-[50px] overflow-hidden border-2 border-dashed border-black/70 bg-[#F0ECF3] mb-8 mt-4 scale-[1.0]">
          {/* Base seed emblem - always visible initially */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={seedEmblemUrl}
              alt="Seed emblem"
              width={220}
              height={220}
              className="opacity-90 scale-[0.8] lg:scale-[1.1] md:scale-[0.8]"
            />
          </div>

          {/* Overlay text with pulsing animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center px-8"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [0.98, 1.02, 0.98]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="lg:text-[14px] md:text-[12x] text-[12px] leading-4 text-[#5F5F5F]">
                <div>your stewardship is becoming visible form</div>
                <div>a morphological evolution accelerating beyond the</div>
                <div>limits of Earth...</div>
              </div>
            </motion.div>
          </div>

          {/* Animated snapshot reveal */}
          <AnimatePresence>
            {showReveal && (
              <motion.div
                initial={{ y: -1000, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 1000, opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 100,
                  duration: 2
                }}
                className="absolute inset-0"
              >
                <Image
                  src={currentImageSrc}
                  alt=""
                  fill
                  className="object-cover scale-[1.05] lg:scale-[1.05] md:scale-[1.05] mt-2 lg:-mt-2 md:-mt-2"
                  onError={(e) => {
                    console.log(
                      `🌸 [BloomingView IMAGE] Error loading image (attempt ${imageErrorCount + 1}), trying fallback`
                    );

                    const newErrorCount = imageErrorCount + 1;
                    setImageErrorCount(newErrorCount);

                    // Prevent infinite retry loops
                    if (newErrorCount > 3) {
                      console.log("🌸 [BloomingView IMAGE] Max retries reached, using final fallback");
                      setCurrentImageSrc("https://d17wy07434ngk.cloudfront.net/seed1/seed.png");
                      return;
                    }

                    // Try fallback images in sequence
                    const fallbackImages = [
                      "https://d17wy07434ngk.cloudfront.net/seed1/seed.png",
                      "https://d17wy07434ngk.cloudfront.net/seed2/seed.png",
                      "https://d17wy07434ngk.cloudfront.net/seed3/seed.png"
                    ];

                    if (newErrorCount <= fallbackImages.length) {
                      const fallbackSrc = fallbackImages[newErrorCount - 1];
                      console.log(`🌸 [BloomingView IMAGE] Trying fallback: ${fallbackSrc}`);
                      setCurrentImageSrc(fallbackSrc);
                    } else {
                      // Use a simple placeholder
                      setCurrentImageSrc("https://d17wy07434ngk.cloudfront.net/seed1/seed.png");
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Share button bottom-right */}
        <button
          onClick={(e) => {
            if (onShare) {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPosition = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              };
              onShare(clickPosition);
            }
          }}
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

        {/* Try Again (reload image) */}
        {snapshotImageUrl && !isSnapshotReady && (
          <div className="text-center -mt-4 mb-2">
            <button
              onClick={() => {
                setImageErrorCount(0);
                void pingSnapshotImage();
              }}
              className="text-sm underline text-black/70 hover:text-black transition-colors"
              disabled={isPinging}
            >
              {isPinging ? 'Checking image…' : 'Reload'}
            </button>
          </div>
        )}

        {/* You funded text - moved below the image */}
        <div className="text-center lg:text-[22px] md:text-[21px] text-[18px] scale-[0.8] lg:scale-[0.7] md:scale-[0.7] leading-4 lg:leading-8 md:leading-8 text-black mb-4">
          <div className="">
            You funded <span className="peridia-display">{beneficiary}</span><span className="text-wrap"> and here is how the </span>
          </div><p className="text-nowrap -ml-10 lg:-ml-8 md:-ml-7">{`plant's`} morphology carries this as memory</p>
        </div>

        {/* Root shape area */}
        <div className="relative mt-18 lg:mt-12">
          <RootShapeArea
            onStory={onStory}
            onSubstrate={handleSubstrate}
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
