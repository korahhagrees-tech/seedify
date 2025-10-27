/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import GardenHeader from "@/components/GardenHeader";
import RootShapeArea from "@/components/wallet/RootShapeArea";
import { Seed } from "@/types/seed";
import { useState } from "react";
import Link from "next/link";
import { usePrivy } from '@privy-io/react-auth';
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from 'sonner';

type Beneficiary = {
  name: string;
  code: string;
  index: number;
  address: string;
  benefitShare: string; // e.g. "12.45%"
  snapshotsGain: string; // e.g. "0.112 ETH"
  garden: string; // e.g. "1.911 ETH"
  yieldShare: string; // e.g. "0.211 ETH"
  unclaimed: string; // e.g. "0.162 ETH"
  claimed: string; // e.g. "0.222 ETH"
  snapshotCount: number;
  totalValue: string;
};

export interface SeedStewardStatsProps {
  seed: Seed;
  links?: { openseaUrl?: string };
  onAmplifyClick?: () => void;
  onHarvestClick?: () => void;
  stats: {
    seedId: number;
    seedNumber: string;
    totalSnapshots: number;
    snapshotPrice: string;
    snapshotShare: string;
    mintedOn: string;
    lastSnapshotMintDate: string;
    maturationDate: string;
    nutrientReserveTotal: string;
    absoluteNutrientYield: string;
    harvestable: string;
    earlyHarvestFee: {
      percentage: number;
      amount: string;
      canWithdrawWithoutFee: boolean;
    };
    twentyPercentShareValue: string;
    highestSeedDeposit: string;
    immediateImpact: string;
    immediateImpactDate: string;
    longtermImpact: string;
    longtermImpactDate: string | null;
    overallAccumulatedYield: string;
    beneficiaries?: Beneficiary[];
  };
}

export default function SeedStewardStats({
  seed,
  links,
  onAmplifyClick,
  onHarvestClick,
  stats,
}: SeedStewardStatsProps) {
  const { scrollYProgress } = useScroll();
  const [imageError, setImageError] = useState(false);
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);
  
  // Three-tier image fallback system (from SeedCard)
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

  // Wallet-related hooks for defensive checks
  const { ready, authenticated } = usePrivy();
  const { activeWallet, wallets } = useAuth();

  // Morph large rounded-square image to smaller circle on scroll
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.4]);
  const radius = useTransform(scrollYProgress, [0, 0.2], [60, 999]);
  const width = useTransform(scrollYProgress, [0, 0.2], [900, 120]);
  const height = useTransform(scrollYProgress, [0, 0.2], [380, 120]);
  const translateX = useTransform(scrollYProgress, [0, 0.2], [0, -150]);

  // Button animations - start at top-right of image, drop down to right side
  const buttonScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const buttonTranslateX = useTransform(scrollYProgress, [0, 0.2], [0, 10]);
  const buttonTranslateY = useTransform(scrollYProgress, [0, 0.2], [0, -10]);
  const buttonRight = useTransform(scrollYProgress, [0, 0.2], [0, 12]);
  const buttonOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.15, 0.2],
    [1, 1, 1, 1]
  );

  const handleImageLoad = () => {
    console.log(" [IMAGE] Successfully loaded:", currentImageSrc);
  };

  const handleImageError = () => {
    const nextIndex = imageErrorCount + 1;
    
    if (nextIndex < FALLBACK_IMAGES.length) {
      console.log(
        ` [IMAGE] Error loading image (attempt ${nextIndex}/${FALLBACK_IMAGES.length}), trying fallback:`,
        FALLBACK_IMAGES[nextIndex]
      );
      setCurrentImageSrc(FALLBACK_IMAGES[nextIndex]);
      setImageErrorCount(nextIndex);
    } else {
      console.log(" [IMAGE] All fallbacks exhausted, showing final fallback");
    }
  };

  // Helper function to convert wei to ETH
  const weiToEth = (wei: string) => {
    const eth = parseFloat(wei) / 1e18;
    return eth.toFixed(6);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Helper function to format percentage
  const formatPercentage = (value: string) => {
    const num = parseFloat(value);
    return `${num.toFixed(1)}%`;
  };

  // Toggle info dropdown
  const toggleInfoDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('INFO button clicked - BEFORE:', isInfoDropdownOpen);
    console.log('Event details:', e);
    console.log('Button element:', e.currentTarget);
    setIsInfoDropdownOpen(!isInfoDropdownOpen);
    console.log('INFO button clicked - AFTER:', !isInfoDropdownOpen);
    // Force a re-render to test
    setTimeout(() => {
      console.log('State after timeout:', isInfoDropdownOpen);
    }, 100);
  };

  // Open Amplify Modal
  const handleAmplifyClick = () => {
    console.log('🌱 Amplify button clicked');

    // Defensive checks for wallet functionality
    if (!ready) {
      // toast.info('Setting up wallet... Please wait.');
      return;
    }
    if (!authenticated) {
      // toast.info('Please connect your wallet to continue.');
      return;
    }
    if (!activeWallet) {
      // toast.error("No active wallet found. Please connect your wallet.");
      return;
    }

    if (onAmplifyClick) {
      onAmplifyClick();
    }
  };

  // Open Harvest Modal
  const handleHarvestClick = () => {
    console.log('🌾 Harvest button clicked');

    // Defensive checks for wallet functionality
    if (!ready) {
      // toast.info('Setting up wallet... Please wait.');
      return;
    }
    if (!authenticated) {
      // toast.info('Please connect your wallet to continue.');
      return;
    }
    if (!activeWallet) {
      // toast.error("No active wallet found. Please connect your wallet.");
      return;
    }

    if (onHarvestClick) {
      onHarvestClick();
    }
  };

  // Debug logging
  console.log('SeedStewardStats state:', {
    isInfoDropdownOpen
  });

  return (
    <>
      {/* Fixed background image - positioned to match mobile container */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-screen bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: 'url("/steward-stats.png")',
        }}
      />

      <div className="relative min-h-screen w-full max-w-4xl mx-auto overflow-hidden bg-transparent">
        {/* Foreground content */}
        <div className="relative z-10 px-4 pt-2 pb-6">
          {/* Header */}
          <GardenHeader />

          {/* Hero with image and actions - moved above stats content */}
          <div className="pt-4 pb-6 relative">
            <div className="text-white text-center text-[10px] lg:text-[12px] md:text-[12px] tracking-wide -mt-6 lg:-mt-6 md:-mt-6 mb-4 lg:mb-5 md:mb-4">SEED NURSERY</div>
            <div className="flex items-start justify-center gap-4 relative max-w-4xl mx-auto -mt-2">
              {/* Single morphing image - starts large, transforms to small circle on scroll */}
              <motion.div
                style={{
                  scale,
                  borderRadius: radius,
                  width: width,
                  height: height,
                  translateX: translateX
                }}
                className="relative overflow-hidden shadow-xl bg-white mx-auto"
              >
                <Image
                  src={currentImageSrc}
                  alt={""}
                  fill
                  className="object-cover"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </motion.div>

              {/* Animated Buttons - positioned absolutely to animate from top-right to right side */}
              <motion.div
                style={{
                  scale: buttonScale,
                  translateX: buttonTranslateX,
                  translateY: buttonTranslateY,
                  opacity: buttonOpacity,
                  right: buttonRight,
                }}
                className="absolute top-2 flex flex-col gap-3 z-20"
              >
                {links?.openseaUrl && (
                  <Link
                    href={links.openseaUrl}
                    className="px-4 py-0 text-nowrap rounded-full border-3 border-dotted border-gray-700 bg-gradient-to-r from-gray-200/90 to-white/90 text-gray-900 peridia-display text-sm text-center shadow-lg hover:from-gray-300/90 hover:to-white/90 transition-colors cursor-pointer z-30"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Opensea
                  </Link>
                )}
                <button 
                  className="px-6 py-2 rounded-full border-3 border-dashed border-white/80 bg-purple-200/90 text-gray-900 peridia-display text-sm shadow-lg hover:bg-purple-300/90 transition-colors cursor-pointer z-30"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Customise Display clicked');
                  }}
                >
                  Customise Display
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main dotted container */}
        <div className="relative mx-4 mb-48 rounded-[60px] lg:scale-[1.0] md:scale-[1.0] scale-[1.0] -mt-22 lg:-mt-22 md:-mt-22 border-3 border-dotted border-black/70 bg-black/10 backdrop-blur-md">
          {/* Section: Core Seed Metrics - Full width with 3x2 grid */}
          <div className="flex z-50 items-center w-full justify-between mb-6 bg-[#E2E3F0B2] rounded-full scale-[1.0] lg:scale-[1.0] md:scale-[1.0] mt-12 relative top-8 lg:top-10 md:top-10" style={{ pointerEvents: 'auto' }}>
            <div className="flex-1">
              <div className="text-lg font-light scale-[0.6] lg:scale-[0.7] md:scale-[0.7] tracking-wide text-gray-900">
                <p className="-ml-18">CORE SEED METRICS</p>
              </div>
            </div>
          </div>
          
          {/* INFO Button - moved outside flex container */}
          <div
            onClick={toggleInfoDropdown}
            onMouseDown={() => console.log('INFO div mouse down')}
            onMouseUp={() => console.log('INFO div mouse up')}
            onTouchStart={() => console.log('INFO div touch start')}
            onTouchEnd={() => console.log('INFO div touch end')}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#D3C9DE] text-black text-sm hover:bg-[#D3C9DE]/80 transition-colors cursor-pointer absolute -right-2 lg:-right-2 md:-right-2 top-19 lg:top-21 md:top-21 z-50 scale-[0.8] lg:scale-[0.8] md:scale-[0.8]"
            style={{ pointerEvents: 'auto', minWidth: '60px', minHeight: '32px' }}
          >
            INFO
            <motion.span
              animate={{ rotate: isInfoDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="ml-2"
            >
              ▼
            </motion.span>
          </div>

          {/* Info Dropdown Modal - positioned as overlay over stats section */}
          <AnimatePresence>
            {isInfoDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute top-18 lg:top-12 md:top-12 -left-15 lg:-left-26 md:-left-26 right-0 z-20 overflow-hidden"
              >
                <div className="mx-4 mb-4 rounded-tl-[68px] rounded-tr-[28px] rounded-bl-[28px] rounded-br-[28px] bg-[#F0ECF3] opacity-90 backdrop-blur-sm p-6 shadow-lg scale-[0.8] lg:scale-[0.7] md:scale-[0.7] w-[440px] lg:w-[590px] md:w-[590px]">
                  <div className="text-[9px] lg:text-[13px] md:text-[13px] text-gray-900 mb-4 lg:mb-6 md:mb-6">We hope you are enjoying your seed!</div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="text-[9px] lg:text-[13px] md:text-[13px] text-gray-900">
                        <span className="font-bold">Nutrient Reserve</span> ~ current value of your seed. Compounding sum of your contributions and snapshot share distributions
                      </div>
                      <div className="text-[9px] lg:text-[13px] md:text-[13px] text-gray-900">
                        <span className="font-bold">Absolute Nutrient Yield</span> ~ total value you created for the benefit of your selection of biodiversity projects
                      </div>
                      <div className="text-[9px] lg:text-[13px] md:text-[13px] text-gray-900">
                        <span className="font-bold">Immediate Impact</span> ~ total value of snapshot sales (50% of Mint) for regenerating our habitats 100% Distributed Monthly
                      </div>
                      <div className="text-[9px] lg:text-[13px] md:text-[13px] text-gray-900">
                        <span className="font-bold">Longterm Impact</span> ~ total value generated for biodiversity by farming the Nutrient Reserve 100% Distributed Quarterly
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="text-[9px] lg:text-[13px] md:text-[13px] text-gray-900">
                        <span className="font-bold">Snapshot Share</span> ~ dynamic % your seed receives from each snapshot calculated relative to Lowest(10%) & Highest(20%) Nutrient Reserve value across available seeds
                      </div>
                      <div className="text-[9px] lg:text-[13px] md:text-[13px] text-gray-900">
                        <span className="font-bold">Harvestable</span> ~ current amount you will receive if choosing to withdraw funds
                      </div>
                      <div className="text-[9px] lg:text-[13px] md:text-[13px] text-gray-900">
                        <span className="font-bold">Maturation Date</span> ~ earliest time the Nutrient Reserve can be withdrawn in full. Sale of NFT is permitted regardless
                      </div>
                      <div className="text-[9px] lg:text-[13px] md:text-[13px] text-gray-900">
                        <span className="font-bold">Early Harvest Fee</span> ~ the value you forfeit if you choose to withdraw prematurely
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="rounded-[28px] bg-[#E2E3F0B2] m-4 p-6 py-0 mt-14 lg:mt-14 md:mt-14">
            {/* Full width header with INFO button */}

            {/* Core metrics 3x2 grid - single background */}
            <div className="grid grid-cols-3 gap-4 mb-6 scale-[1.0] lg:scale-[1.1] md:scale-[1.1]">
              {/* SEED NUMBER */}
              <div className="text-center scale-[0.9] lg:scale-[1.0] md:scale-[1.0] relative left-0 right-auto">
                <div className="text-[9px] lg:text-[10px] md:text-[10px] text-nowrap tracking-wide text-black/90 mb-2 mt-2 lg:mt-2 md:mt-2">
                  SEED NUMBER
                </div>
                <div className="bg-white/70 border-3 border-dotted border-gray-700 rounded-full px-2 py-2 text-[11px] text-gray-900 text-center scale-[0.7] lg:scale-[0.9] md:scale-[0.8]">
                  <div className="text-nowrap scale-[1.2] lg:scale-[1.6] md:scale-[1.6]">
                    {stats.seedNumber}
                  </div>
                </div>
              </div>


              {/* SNAPSHOTS */}
              <div className="text-center scale-[0.9] lg:scale-[1.0] md:scale-[1.0] relative left-0 right-auto">
                <div className="text-[9px] lg:text-[10px] md:text-[10px] text-nowrap tracking-wide text-black/90 mb-2 mt-2 lg:mt-2 md:mt-2">
                  SNAPSHOTS
                </div>
                <div className="bg-white/70 border-3 border-dotted border-gray-700 rounded-full px-2 py-2 text-[11px] text-gray-900 text-center scale-[0.7] lg:scale-[0.9] md:scale-[0.8]">
                  <div className="text-nowrap scale-[1.2] lg:scale-[1.6] md:scale-[1.6]">
                    {stats.totalSnapshots}
                  </div>
                </div>
              </div>

              {/* SNAPSHOT SHARE */}
              <div className="text-center relative left-0 right-auto">
                <div className="text-[9px] lg:text-[10px] md:text-[10px] text-nowrap tracking-wide text-black/90 mb-2 mt-2 lg:mt-2 md:mt-2">
                  SNAPSHOT SHARE
                </div>
                <div className="bg-white/70 border-3 border-dotted border-black/70 rounded-full px-2 py-2 text-[11px] text-gray-900 text-center scale-[0.7] lg:scale-[0.9] md:scale-[0.8]">
                  <div className="text-nowrap scale-[1.2] lg:scale-[1.6] md:scale-[1.6]">
                    {formatPercentage(stats.snapshotShare)}
                  </div>
                </div>
              </div>

              {/* MINTED ON */}
              <div className="text-center scale-[0.9] lg:scale-[1.0] md:scale-[1.0] -mt-2 lg:-mt-2 md:-mt-2 mb-4 lg:mb-4 md:mb-4 relative left-0 right-auto">
                <div className="text-[9px] lg:text-[10px] md:text-[10px] text-nowrap tracking-wide text-black/90 mb-2">
                  MINTED ON
                </div>
                <div className="bg-white/70 rounded-full px-1 py-2 text-[10px] lg:text-[11px] md:text-[11px] text-gray-900 text-center">
                  <div className="text-nowrap scale-[0.9] lg:scale-[1.2] md:scale-[1.2]">
                    {formatDate(stats.mintedOn)}
                  </div>
                </div>
              </div>

              {/* SNAPSHOT PRICE */}
              <div className="text-center -mt-2 lg:-mt-2 md:-mt-2 mb-4 lg:mb-4 md:mb-4 relative left-0 right-auto">
                <div className="text-[9px] lg:text-[10px] md:text-[10px] text-nowrap tracking-wide text-black/90 mb-2">
                  SNAPSHOT PRICE
                </div>
                <div className="bg-white/70 border-2 rounded-full px-1 py-2 text-[10px] text-gray-900 text-center text-nowrap">
                  <div className="text-nowrap scale-[0.9] lg:scale-[1.2] md:scale-[1.2]">
                    {parseFloat(stats.snapshotPrice).toFixed(5)} ETH
                  </div>
                </div>
              </div>


              {/* 20% SHARE VALUE */}
              <div className="text-center -mt-2 lg:-mt-2 md:-mt-2 mb-4 lg:mb-4 md:mb-4 relative left-0 right-auto">
                <div className="text-[9px] lg:text-[10px] md:text-[10px] text-nowrap tracking-wide text-black/90 mb-2">
                  20% SHARE VALUE
                </div>
                <div className="bg-white/70 border-2 rounded-full px-1 py-2 text-[10px] text-gray-900 text-center">
                  <div className="text-nowrap scale-[0.9] lg:scale-[1.2] md:scale-[1.2]">
                    {parseFloat(stats.twentyPercentShareValue).toFixed(3)} ETH
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two separate sections below - always side by side */}
          <div className="grid grid-cols-2 gap-2 mx-4 mb-6 scale-[0.95] lg:scale-[1.05] md:scale-[1.05] ml-[4%] lg:ml-[4%] md:ml-[8%]">
            {/* Left Card: NUTRIENT RESERVE - Single background with individual value containers */}
            <div className="rounded-[28px] bg-[#E2E3F0B2] p-4 -ml-6 lg:-ml-1 md:-ml-4 w-52 scale-[0.85] lg:scale-[1.0] md:scale-[1.0]">
              <div className="space-y-4">
                {/* NUTRIENT RESERVE TOTAL */}
                <div className="text-center">
                  <div className="text-[10px] text-nowrap tracking-wide text-black/90 mb-2">
                    NUTRIENT RESERVE TOTAL
                  </div>
                  <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-2 py-2 text-[11px] text-gray-900 text-center">
                    {weiToEth(stats.nutrientReserveTotal)} ETH
                  </div>
                </div>

                {/* YOUR CONTRIBUTIONS */}
                <div className="text-center">
                  <div className="text-[10px] text-nowrap tracking-wide text-black/90 mb-2">
                    YOUR CONTRIBUTIONS
                  </div>
                  <div className="bg-gray-200/80 rounded-full px-2 py-2 text-[11px] text-gray-900 text-center">
                    {weiToEth(stats.highestSeedDeposit)} ETH
                  </div>
                </div>

                {/* ABSOLUTE NUTRIENT YIELD */}
                <div className="text-center">
                  <div className="text-[10px] text-nowrap tracking-wide text-black/90 mb-2">
                    ABSOLUTE NUTRIENT YIELD
                  </div>
                  <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-1 py-2 text-[10px] text-gray-900 text-center">
                    {parseFloat(stats.absoluteNutrientYield).toFixed(6)} ETH
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: HARVESTABLE - Single background with individual value containers */}
            <div className="rounded-[28px] bg-[#E2E3F0B2] p-4 w-40 ml-2 lg:ml-6 md:ml-4 scale-[0.85] lg:scale-[1.0] md:scale-[1.0]">
              <div className="space-y-4">
                {/* HARVESTABLE */}
                <div className="text-center">
                  <div className="text-[10px] tracking-wide text-black/90 mb-2">
                    HARVESTABLE
                  </div>
                  <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-2 py-2 text-[11px] text-gray-900 text-center">
                    {parseFloat(stats.harvestable).toFixed(6)} ETH
                  </div>
                </div>

                {/* MATURATION DATE */}
                <div className="text-center">
                  <div className="text-[10px] tracking-wide text-black/90 mb-2">
                    MATURATION DATE
                  </div>
                  <div className="bg-gray-200/80 rounded-full px-2 py-2 text-[11px] text-gray-900 text-center">
                    {formatDate(stats.maturationDate)}
                  </div>
                </div>

                {/* EARLY HARVEST FEE */}
                <div className="text-center">
                  <div className="text-[10px] tracking-wide text-black/90 mb-2">
                    EARLY HARVEST FEE
                  </div>
                  <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-1 py-2 text-[10px] text-gray-900 text-center">
                    {parseFloat(stats.earlyHarvestFee.amount).toFixed(6)} ETH
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mx-4 mb-6 relative z-30">
            <div className="flex gap-4 relative z-30">
              {/* Amplify Impact Section */}
              <div className="flex-1">
                {/* Button with scalloped edges and border */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Amplify button clicked directly');
                    handleAmplifyClick();
                  }}
                  onMouseDown={() => console.log('Amplify button mouse down')}
                  onMouseUp={() => console.log('Amplify button mouse up')}
                  onTouchStart={() => console.log('Amplify button touch start')}
                  onTouchEnd={() => console.log('Amplify button touch end')}
                  className="relative w-full px-4 py-2 bg-purple-200/80 text-gray-900 peridia-display text-base mb-1 rounded-full border-2 border-dotted border-black/60 hover:bg-purple-200/90 text-nowrap transition-colors cursor-pointer z-50"
                  style={{ pointerEvents: 'auto', zIndex: 50 }}
                >
                  Amplify Impact
                </button>
                {/* Description container - narrower and touching button */}
                <div className="bg-purple-200/40 rounded-xl p-2 mx-2 -mt-5 relative left-0 right-auto scale-[1.15] lg:scale-[1.0] md:scale-[1.0] top-2 lg:top-0 md:top-0">
                  <div className="text-[9px] text-center text-black/70 leading-tight relative left-0 right-auto scale-[0.95] lg:scale-[1.0] md:scale-[1.0] top-2 lg:top-0 md:top-0">
                    <span className="">Add more funds to your seed to amplify its</span> <span className="peridia-display-light">longterm impact & </span>
                    <span className="">increase your <span className="peridia-display-light">snapshot share</span></span>
                  </div>
                </div>
              </div>

              {/* Harvest Section */}
              <div className="flex-1">
                {/* Button with scalloped edges and border */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Harvest button clicked directly');
                    handleHarvestClick();
                  }}
                  onMouseDown={() => console.log('Harvest button mouse down')}
                  onMouseUp={() => console.log('Harvest button mouse up')}
                  onTouchStart={() => console.log('Harvest button touch start')}
                  onTouchEnd={() => console.log('Harvest button touch end')}
                  className="relative w-full px-4 py-2 bg-white/80 text-gray-900 peridia-display text-base mb-1 rounded-full border-2 border-dotted border-black/60 hover:bg-white/90 transition-colors cursor-pointer z-50"
                  style={{ pointerEvents: 'auto', zIndex: 50 }}
                >
                  Harvest
                </button>
                {/* Description container - narrower and touching button */}
                <div className="bg-white/40 rounded-xl p-2 mx-5 -mt-3 relative left-0 right-auto scale-[1.45] lg:scale-[1.0] md:scale-[1.0] top-2 lg:top-0 md:top-0">
                  <div className="text-[8px] text-black/70 text-center leading-tight relative left-0 right-auto top-1 lg:top-0 md:top-0">
                    Harvest the nutrient reserve to <span className="peridia-display-light">withdraw</span> available funds
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Your Regenerative Impact - Two separate cards side by side */}
          <div className="mb-3">
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-300/80 to-white/60 rounded-full px-4 py-0">
              <span className="tracking-wide text-gray-900 favorit-mono text-sm">
                YOUR REGENERATIVE IMPACT
              </span>
              <span className="text-gray-900">▼</span>
            </div>
          </div>
          <div className="rounded-[28px] m-4 p-6">

            <div className="grid grid-cols-2 gap-4 scale-[0.9] lg:scale-[1.05] md:scale-[1.05] -ml-3 lg:-ml-1 md:-ml-1 -mt-10 lg:-mt-6 md:-mt-6">
              {/* Left Card: Impact Details */}
              <div className="rounded-[28px] bg-[#E2E3F0B2] p-4 h-45 w-45 lg:w-45 md:w-45 scale-[1.0] lg:scale-[1.0] md:scale-[1.0] -ml-10 lg:-ml-4 md:-ml-4">
                <div className="space-y-4">
                  {/* IMMEDIATE IMPACT */}
                  <div className="">
                    <div className="text-[12px] text-black/80 mb-0 text-nowrap">
                      IMMEDIATE IMPACT
                    </div>
                    <div className="bg-white/80 rounded-full border-2 border-dashed border-black px-3 py-1 text-sm text-center text-gray-900 text-nowrap">
                      <p className="text-nowrap scale-[0.7] lg:scale-[0.9] md:scale-[0.7]">{parseFloat(stats.immediateImpact).toFixed(6)} ETH</p>
                    </div>
                    {stats.immediateImpactDate && (
                      <div className="text-[7px] text-right text-black/70 mt-2">
                        DISTRIBUTED: {formatDate(stats.immediateImpactDate)}
                      </div>
                    )}
                  </div>

                  {/* LONGTERM IMPACT */}
                  <div className="">
                    <div className="text-[12px] text-black/80 mb-0 text-nowrap">
                      LONGTERM IMPACT
                    </div>
                    <div className="bg-white/80 rounded-full border-2 border-dashed border-black px-3 py-1 text-sm text-center text-gray-900 text-nowrap">
                      <p className="text-nowrap scale-[0.7] lg:scale-[0.9] md:scale-[0.7]">{parseFloat(stats.longtermImpact).toFixed(6)} ETH</p>
                    </div>
                    {stats.longtermImpactDate && (
                      <div className="text-[7px] text-right text-black/70 mt-2">
                        DISTRIBUTED: {formatDate(stats.longtermImpactDate)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Card: Actions & Yield */}
              <div className="rounded-[28px] p-4">
                <div className="flex flex-col justify-between h-full scale-[1.05] lg:scale-[1.1] md:scale-[1.1] mt-2 lg:mt-2 md:mt-2">
                  {/* Action Buttons */}
                  <div className="space-y-3 mb-4 -mt-4">
                    <button 
                      className="px-3 w-38 py-1 text-nowrap rounded-full bg-white/70 text-gray-900 peridia-display text-sm hover:bg-white/80 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open("https://app.regen.network/profiles/daa2cbf0-6a5a-11f0-ae30-0afffa81c869/projects", "_blank");
                      }}
                      style={{ pointerEvents: 'auto' }}
                    >
                      View Certificates
                    </button>
                    <button 
                      className="w-38 px-3 py-1 rounded-full bg-white/70 text-gray-900 peridia-display text-sm hover:bg-white/80 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open("https://basescan.org/address/0x9142A61188e829BF924CeffF27e8ed8111700C9B", "_blank");
                      }}
                      style={{ pointerEvents: 'auto' }}
                    >
                      Scan Blockchain
                    </button>
                  </div>

                  {/* OVERALL ACCUMULATED YIELD */}
                  <div className="text-[10px] text-white text-nowrap mb-1 -mt-2 lg:-mt-2 md:-mt-2">
                    OVERALL ACCUMULATED YIELD
                  </div>
                  <div className="w-38 h-15 bg-[#E2E3F0B2] rounded-xl p-2">
                    <div className="rounded-full px-2 -mt-4 py-2 text-[16px] text-center text-gray-900">
                      {parseFloat(stats.overallAccumulatedYield).toFixed(6)} ETH
                    </div>

                    {/* Distribute Yield Button */}
                    <div className="-mt-5">
                      <button 
                        className="w-38 -ml-2 px-6 py-1 rounded-full border-4 border-dotted border-gray-300 text-nowrap bg-white/80 text-gray-900 peridia-display text-sm mt-4 hover:bg-white/90 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Distribute Yield clicked');
                        }}
                        style={{ pointerEvents: 'auto' }}
                      >
                        <p className="text-nowrap scale-[0.8] lg:scale-[1.0] md:scale-[0.8]">
                          <span className="peridia-display">D</span>istribute <span className="peridia-display">Y</span>ield
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Detailed Data of Your Stewarded Ecosystems - Full width with background */}
          <div className="-mb-2">
            <div className="flex items-center bg-gradient-to-r from-gray-300/80 to-white/70 text-center justify-center rounded-full px-4 py-0">
              <span className="text-nowrap tracking-wide text-gray-900 favorit-mono text-[12px] lg:text-[14px] md:text-[14px] scale-[0.9] lg:scale-[0.9] md:scale-[0.9] -ml-8 lg:-ml-2 md:-ml-2">
                DETAILED DATA OF YOUR STEWARDED ECOSYSTEMS
              </span>
              <span className="text-gray-900 -ml-2">▼</span>
            </div>
          </div>
          <div className="rounded-[28px] bg-[#e2e3f081] m-4 p-6">

            <div className="space-y-4">
              {stats.beneficiaries && stats.beneficiaries.length > 0 ? (
                stats.beneficiaries.map((beneficiary, index) => (
                  <div
                    key={`${beneficiary.index}-${beneficiary.code}`}
                    className="-mb-20 lg:-mb-20 md:-mb-16"
                  >
                    {/* Title bar */}
                    <div className="flex items-center gap-3 mb-3 scale-[1.3] lg:scale-[1.25] md:scale-[1.25] relative top-0 bottom-auto">
                      <div className="w-10 h-10 rounded-full border-3 border-dotted border-black bg-white overflow-hidden flex-shrink-0 relative top-0 bottom-auto z-50">
                        <Image
                          src={`/seeds/0${beneficiary.index + 1}__${beneficiary.code.split('-')[1]}.png`}
                          alt={beneficiary.name}
                          fill
                          className="object-contain p-1"
                          onLoad={handleImageLoad}
                          onError={() => setImageError(true)}
                        />
                      </div>
                      <div className="flex-1 border text-nowrap border-black rounded-full bg-white/80 text-center text-gray-900 text-sm w-45 py-1 -ml-12 lg:w-45 md:w-48 relative top-0 bottom-auto">
                        <p className="text-nowrap text-[8px] lg:text-[10px] md:text-[8px] scale-[0.8] lg:scale-[0.85] md:scale-[1.0] ml-4 lg:ml-4 md:ml-8 -left-4">{beneficiary.name}</p>
                      </div>
                    </div>

                    {/* Row of stats - responsive grid */}
                    <div className="grid grid-cols-1 gap-2">
                      {/* First row: BENEFIT SHARE, SNAPSHOTS GAIN, UNCLAIMED (4 items) */}
                      <div className="grid grid-cols-4 gap-2">
                        {/* BENEFIT SHARE */}
                        <div className="rounded-[20px] p-2 flex flex-col -ml-4 lg:-ml-4 md:-ml-4 relative top-0 bottom-auto">
                          <div className="text-[9px] text-black/80 mb-1 tracking-wide uppercase text-left relative top-0 bottom-auto">
                            BENEFIT
                          </div>
                          <div className="flex items-center justify-between relative top-0 bottom-auto">
                            <div className="text-[9px] text-black/80 tracking-wide uppercase text-right -mt-3 lg:-mt-3 md:-mt-3 ml-2 lg:ml-2 md:ml-3 relative top-0 bottom-auto">
                              SHARE
                            </div>
                            <div className="bg-white/70 rounded-full rounded-tl-[40px] rounded-tr-[20px] rounded-bl-[5px] rounded-br-[20px] px-3 py-1 text-gray-900 text-[10px] text-center -mt-5 lg:-mt-5 md:-mt-5 relative top-0 bottom-auto">
                            <div className="mt-1 relative top-0 bottom-auto">
                              {beneficiary.benefitShare}%
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* #SNAPSHOTS */}
                        <div className="bg-white/70 border-2 border-dotted border-black rounded-[20px] rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-2 h-[75%] lg:h-[60%] md:h-[55%] flex flex-col w-[180px] lg:w-[150px] md:w-[150px] scale-[0.6] lg:scale-[0.8] md:scale-[0.7] -ml-2 lg:ml-2 md:ml-2 relative top-0 bottom-auto z-50">
                            <div className="text-[14px] lg:text-[12px] md:text-[12px] text-black/80 mb-1 tracking-wide uppercase text-left -mt-2 lg:-mt-2 md:-mt-2 -ml-2 lg:-ml-2 md:-ml-2 relative top-0 bottom-auto">
                              #SNAPSHOTS
                            </div>
                          <div className="flex items-center justify-between relative top-0 bottom-auto">
                            <div className="text-[14px] lg:text-[12px] md:text-[12px] text-black/80 tracking-wide uppercase text-right -mt-3 lg:-mt-3 md:-mt-2 ml-9 lg:ml-8 md:ml-8 relative top-0 bottom-auto">
                              GAIN
                            </div>
                            <div className=" px-2 py-1 text-gray-900 text-[18px] lg:text-[10px] md:text-[10px] text-center -mt-5 lg:-mt-5 md:-mt-5 text-nowrap scale-[0.8] lg:scale-[1.1] md:scale-[1.05] -ml-1 lg:-ml-1 md:-ml-1 relative top-0 bottom-auto">
                              {parseFloat(beneficiary.snapshotsGain).toFixed(6)} 
                              </div>
                                <span className="text-[8px] lg:text-[6px] md:text-[6px] -mt-8 lg:-mt-2 md:-mt-6 -ml-6 lg:-ml-4 md:-ml-2 relative -top-2 lg:-top-4 md:top-0 bottom-auto">ETH</span>
                            </div>
                          </div>
                          <div className="bg-white/70 rounded-tl-[30px] rounded-br-[30px] rounded-bl-[4px] rounded-tr-[4px] px-1 w-[90%] lg:w-[70%] md:w-[70%] py-1 text-gray-900 text-[20px] text-center -mt-1 lg:-mt-1 md:-mt-1 scale-[0.5] lg:scale-[0.6] md:scale-[0.7] -ml-16 lg:-ml-22 md:-ml-18 relative top-0 bottom-auto">
                            <div className="scale-[0.8] lg:scale-[0.8] md:scale-[0.8] mt-6 lg:mt-6 md:mt-10 -ml-1 lg:-ml-1 md:-ml-4 relative top-2 bottom-auto">
                              {beneficiary.snapshotCount}
                              </div>
                          </div>

                        {/* UNCLAIMED */}
                        <div className="rounded-[20px] p-2 bg-[#B7B7B799] rounded-tl-[20px] rounded-tr-[5px] rounded-bl-[20px] rounded-br-[20px] h-[32%] mt-4 lg:mt-4 md:mt-4 relative top-0 bottom-auto scale-[0.95] lg:scale-[1.15] md:scale-[1.1]">
                          <div className="text-[9px] text-black/80 mb-1 tracking-wide uppercase text-right -mt-6 lg:-mt-6 md:-mt-4 ml-2 lg:ml-2 md:ml-3 relative top-2 lg:top-2 md:-top-1 bottom-auto">
                            UNCLAIMED
                          </div>
                          <div className="text-gray-900 text-[10px] text-right scale-[0.8] lg:scale-[0.8] md:scale-[0.95] relative top-1 lg:top-1 md:-top-1 bottom-auto">
                            {parseFloat(beneficiary.unclaimed).toFixed(6)} 
                            <span className="text-[8px] lg:text-[7px] md:text-[7px] -mt-2 lg:mt-2 md:-mt-8 ml-0 lg:ml-0 md:ml-0 relative -top-1 lg:-top-1 md:-top-1 bottom-auto">ETH</span>
                          </div>
                        </div>

                        {/* Empty 4th column for spacing */}
                        <div className="rounded-[20px] p-2">
                        </div>
                      </div>

                      {/* Second row: GARDEN and YIELD SHARE */}
                      <div className="grid grid-cols-2 gap-2 relative top-0 bottom-auto">
                        {/* GARDEN */}
                        <div className="rounded-[20px] p-2 relative -top-10 lg:-top-10 md:top-0 bottom-auto -left-3 lg:-left-3 md:-left-3">
                          <div className="text-[9px] text-black/80 mb-1 tracking-wide uppercase text-left -mt-6 lg:-mt-6 md:-mt-20 -ml-2 lg:-ml-2 md:-ml-2 relative top-0 lg:top-0 md:top-0 bottom-auto">
                            GARDEN
                          </div>
                          <div className="bg-white/70 rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] px-2 py-1 text-gray-900 text-[10px] text-center w-[75%] lg:w-[60%] md:w-[60%] text-nowrap relative top-0 bottom-auto">
                          <div className="bg-white/50 rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] px-4 py-1 text-gray-900 text-[10px] text-center w-[84px] lg:w-[84px] md:w-[84px] h-[20px] border-1 border-dotted border-black -ml-1 lg:-ml-1.5 md:-ml-2 relative top-1 lg:top-1 md:top-1 bottom-auto">
                            <span className="text-[12px] lg:text-[10px] md:text-[10px] -mt-4 lg:-mt-2 md:-mt-12 -ml-3 lg:-ml-1 md:-ml-2 scale-[0.8] lg:scale-[0.8] md:scale-[0.8] relative -top-1 lg:-top-1 md:-top-1 bottom-auto">{parseFloat(beneficiary.garden).toFixed(6)} 
                              <span className="text-[6px] lg:text-[7px] md:text-[7px] -mt-4 lg:-mt-2 md:-mt-12 ml-0 lg:ml-0 md:ml-0 scale-[0.8] lg:scale-[0.8] md:scale-[0.8] relative -top-1 lg:-top-1 md:-top-1 bottom-auto">ETH</span></span>
                          </div>
                          </div>
                        </div>

                        {/* YIELD SHARE */}
                        <div className="p-2 flex flex-col relative -top-8 lg:-top-8 md:top-0 bottom-auto left-2 lg:left-3 md:-left-2">
                          <div className="bg-white/70 border-2 border-dotted border-black rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[5px] rounded-br-[20px] rounded-full px-2 py-0 text-gray-900 text-[10px] text-center h-[80%] lg:h-[90%] md:h-[90%] w-[90%] lg:w-[70%] md:w-[70%] -ml-14 lg:-ml-16 md:-ml-8 -mt-6 lg:-mt-6 md:-mt-18 scale-[0.8] lg:scale-[1.05] md:scale-[0.85] relative top-0 bottom-auto">
                            <div className="text-[10px] lg:text-[11px] md:text-[9px] text-black/80 mb-1 tracking-wide uppercase text-left -ml-2 lg:-ml-2 md:-ml-1 relative top-0 bottom-auto">
                              YIELD
                            </div>
                            <div className="flex items-center justify-between relative top-0 bottom-auto">
                              <div className="text-[10px] lg:text-[11px] md:text-[9px] text-black/80 tracking-wide uppercase text-left -mt-2 lg:-mt-2 md:-mt-2 -ml-2 lg:-ml-2 md:-ml-1 relative top-0 bottom-auto">
                                SHARE
                              </div>
                              <div className="-mt-5 lg:-mt-5 md:-mt-5 scale-[0.95] lg:scale-[0.95] md:scale-[1.05] relative top-0 bottom-auto left-1 lg:left-1 md:left-1 text-[12px] lg:text-[10px] md:text-[10px]">
                                {parseFloat(beneficiary.yieldShare).toFixed(6)} 
                                <span className="text-[7px] lg:text-[6px] md:text-[6px] -mt-12 lg:-mt-2 md:mt-2 ml-0 lg:ml-0 md:ml-0 relative -top-1 lg:-top-1 md:-top-1 bottom-auto">ETH</span>
                              </div>
                            </div>
                          </div>
                          {/* Third row: CLAIMED */}
                          <div className="grid grid-cols-1 gap-2 relative top-0 bottom-auto">
                            <div className="rounded-[20px] p-2 scale-[0.8] lg:scale-[0.8] md:scale-[0.8] ml-4 lg:ml-4 md:ml-2 -mt-2 lg:-mt-2 md:mt-2 relative -top-10 lg:-top-10 md:-top-14 left-6 lg:left-6 md:left-12 bottom-auto">
                              <div className="bg-[#D3C9DE66] border-2 border-dotted border-black rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[5px] px-2 py-1 text-gray-900 text-[9px] lg:text-[10px] md:text-[10px] text-center mt-1 relative top-2 bottom-auto">
                                {parseFloat(beneficiary.claimed).toFixed(6)} 
                                <span className="text-[7px] lg:text-[6px] md:text-[9px] -mt-12 lg:-mt-2 md:mt-2 ml-0 lg:-ml-1 md:ml-0 relative -top-1 lg:-top-1 md:-top-1 bottom-auto">ETH</span>
                              </div>
                              <div className="bg-[#D3C9DE66] rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] px-2 py-1 text-gray-900 text-[9px] lg:text-[10px] md:text-[10px] text-center mt-1 lg:mt-1 md:mt-2 relative top-0 bottom-auto">
                                CLAIMED
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600 py-8">
                  No beneficiaries data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer root shape */}
        <div className="fixed -bottom-4 lg:-bottom-2 md:-bottom-2 left-0 right-0 z-30 pt-4 scale-[0.99] lg:scale-[1.08] md:scale-[1.08]">
          <div className="max-w-md mx-auto px-4">
            <RootShapeArea
              onWallet={() => { }}
              showGlassEffect={false}
              showStoryButton={false}
            />
          </div>
        </div>
      </div>
    </> //
  );
}

