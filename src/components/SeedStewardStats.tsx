"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import GardenHeader from "@/components/GardenHeader";
import RootShapeArea from "@/components/wallet/RootShapeArea";
import { Seed } from "@/types/seed";
import { useState } from "react";
import Link from "next/link";
// Modals moved to page level - no imports needed

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

  // Morph large rounded-square image to smaller circle on scroll
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.4]);
  const radius = useTransform(scrollYProgress, [0, 0.2], [60, 999]);
  const width = useTransform(scrollYProgress, [0, 0.2], [980, 170]);
  const height = useTransform(scrollYProgress, [0, 0.2], [550, 170]);

  // Button animations - start at top-right of image, drop down to right side
  const buttonScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const buttonTranslateX = useTransform(scrollYProgress, [0, 0.2], [0, -60]);
  const buttonTranslateY = useTransform(scrollYProgress, [0, 0.2], [0, -80]);
  const buttonRight = useTransform(scrollYProgress, [0, 0.2], [0, 12]);
  const buttonOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.15, 0.2],
    [1, 1, 1, 1]
  );

  const handleImageLoad = () => {
    console.log("🌸 [IMAGE] Successfully loaded:", seed.seedImageUrl);
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
    console.log('🔄 Toggle info dropdown clicked - BEFORE:', isInfoDropdownOpen);
    setIsInfoDropdownOpen(!isInfoDropdownOpen);
    console.log('🔄 Toggle info dropdown clicked - AFTER:', !isInfoDropdownOpen);
  };

  // Open Amplify Modal
  const handleAmplifyClick = () => {
    console.log('🌱 Amplify button clicked');
    if (onAmplifyClick) {
      onAmplifyClick();
    }
  };

  // Open Harvest Modal
  const handleHarvestClick = () => {
    console.log('🌾 Harvest button clicked');
    if (onHarvestClick) {
      onHarvestClick();
    }
  };

  // Debug logging
  console.log('🔍 SeedStewardStats state:', {
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

          {/* Hero with image and actions */}
          <div className="pt-4 pb-6">
            <div className="flex items-start justify-center gap-4 relative max-w-4xl mx-auto -mt-2">
              {/* Morphing image */}
              <motion.div
                style={{ 
                  scale, 
                  borderRadius: radius,
                  width: width,
                  height: height
                }}
                className="relative overflow-hidden shadow-xl bg-white mx-auto scale-[0.6] -ml-20 -mt-28 mb-2"
              >
                <Image
                  src={
                    imageError
                      ? "https://d17wy07434ngk.cloudfront.net/seed1/seed.png"
                      : seed.seedImageUrl && seed.seedImageUrl.length > 0
                      ? seed.seedImageUrl
                      : "https://d17wy07434ngk.cloudfront.net/seed1/seed.png"
                  }
                  alt={""}
                  fill
                  className="object-cover"
                  onLoad={handleImageLoad}
                  onError={() => setImageError(true)}
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
                className="absolute top-2 flex flex-col gap-3"
              >
                {links?.openseaUrl && (
                  <Link
                    href={links.openseaUrl}
                    className="px-4 py-0 text-nowrap rounded-full border-3 border-dotted border-gray-700 bg-gradient-to-r from-gray-200/90 to-white/90 text-gray-900 peridia-display text-sm text-center shadow-lg"
                  >
                    View Opensea
                  </Link>
                )}
                <button className="px-6 py-2 rounded-full border-3 border-dashed border-white/80 bg-purple-200/90 text-gray-900 peridia-display text-sm shadow-lg">
                  Customise Display
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main dotted container */}
        <div className="relative z-10 mx-4 mb-36 rounded-[60px] scale-[0.9] -mt-75 border-3 border-dotted border-black/70 bg-black/10 backdrop-blur-md">
          {/* Section: Core Seed Metrics - Full width with 3x2 grid */}
            <div className="flex items-center w-full justify-between mb-6 bg-gray-400 rounded-full scale-[0.8] lg:scale-[1.0] md:scale-[0.8] mt-6" style={{ pointerEvents: 'auto' }}>
              <div className="flex-1">
                <div className="text-lg font-light scale-[0.6] lg:scale-[0.7] md:scale-[0.6] tracking-wide text-gray-900">
                  <p className="-ml-18">CORE SEED METRICS</p>
                </div>
              </div>
              <button
                onClick={toggleInfoDropdown}
                onMouseDown={() => console.log('🖱️ INFO button mouse down')}
                onMouseUp={() => console.log('🖱️ INFO button mouse up')}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 text-gray-900 text-sm -ml-16 left-8 hover:bg-white/90 transition-colors cursor-pointer relative z-50 w-22 border-2 border-red-500"
                style={{ pointerEvents: 'auto', position: 'relative' }}
              >
                INFO 
                <motion.span
                  animate={{ rotate: isInfoDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                  ▼
                </motion.span>
              </button>
            </div>

            {/* Info Dropdown Modal */}
            <AnimatePresence>
              {isInfoDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="mx-4 mb-4 rounded-[28px] bg-gray-400/40 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="text-sm text-gray-900">
                          <span className="font-bold">Nutrient Reserve</span> ~ current value of your seed. Compounding sum of your contributions and snapshot share distributions
                        </div>
                        <div className="text-sm text-gray-900">
                          <span className="font-bold">Absolute Nutrient Yield</span> ~ total value you created for the benefit of your selection of biodiversity projects
                        </div>
                        <div className="text-sm text-gray-900">
                          <span className="font-bold">Immediate Impact</span> ~ total value of snapshot sales (50% of Mint) for regenerating our habitats 100% Distributed Monthly
                        </div>
                        <div className="text-sm text-gray-900">
                          <span className="font-bold">Longterm Impact</span> ~ total value generated for biodiversity by farming the Nutrient Reserve 100% Distributed Quarterly
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        <div className="text-sm text-gray-900">
                          <span className="font-bold">Snapshot Share</span> ~ dynamic % your seed receives from each snapshot calculated relative to Lowest(10%) & Highest(20%) Nutrient Reserve value across available seeds
                        </div>
                        <div className="text-sm text-gray-900">
                          <span className="font-bold">Harvestable</span> ~ current amount you will receive if choosing to withdraw funds
                        </div>
                        <div className="text-sm text-gray-900">
                          <span className="font-bold">Maturation Date</span> ~ earliest time the Nutrient Reserve can be withdrawn in full. Sale of NFT is permitted regardless
                        </div>
                        <div className="text-sm text-gray-900">
                          <span className="font-bold">Early Harvest Fee</span> ~ the value you forfeit if you choose to withdraw prematurely
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          <div className="rounded-[28px] bg-gray-400/40 m-4 p-6">
            {/* Full width header with INFO button */}

            {/* Core metrics 3x2 grid - single background */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* SEED NUMBER */}
              <div className="text-center">
                <div className="text-[10px] tracking-wide text-black/90 mb-2">
                  SEED NUMBER
                </div>
                <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-2 py-2 text-[11px] text-gray-900 text-center">
                  {stats.seedNumber}
                </div>
              </div>

              {/* MINTED ON */}
              <div className="text-center">
                <div className="text-[10px] tracking-wide text-black/90 mb-2">
                  MINTED ON
                </div>
                <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-2 py-2 text-[11px] text-gray-900 text-center">
                  {formatDate(stats.mintedOn)}
                </div>
              </div>

              {/* SNAPSHOTS */}
              <div className="text-center">
                <div className="text-[10px] tracking-wide text-black/90 mb-2">
                  SNAPSHOTS
                </div>
                <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-2 py-2 text-[11px] text-gray-900 text-center">
                  {stats.totalSnapshots}
                </div>
              </div>

              {/* SNAPSHOT PRICE */}
              <div className="text-center">
                <div className="text-[10px] tracking-wide text-black/90 mb-2">
                  SNAPSHOT PRICE
                </div>
                <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-1 py-2 text-[10px] text-gray-900 text-center">
                  {parseFloat(stats.snapshotPrice).toFixed(5)} ETH
                </div>
              </div>

              {/* SNAPSHOT SHARE */}
              <div className="text-center">
                <div className="text-[10px] tracking-wide text-black/90 mb-2">
                  SNAPSHOT SHARE
                </div>
                <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-2 py-2 text-[11px] text-gray-900 text-center">
                  {formatPercentage(stats.snapshotShare)}
                </div>
              </div>

              {/* 20% SHARE VALUE */}
              <div className="text-center">
                <div className="text-[10px] tracking-wide text-black/90 mb-2">
                  20% SHARE VALUE
                </div>
                <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-1 py-2 text-[10px] text-gray-900 text-center">
                  {parseFloat(stats.twentyPercentShareValue).toFixed(3)} ETH
                </div>
              </div>
            </div>
          </div>

          {/* Two separate sections below */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-4 mb-6">
            {/* Left Card: NUTRIENT RESERVE - Single background with individual value containers */}
            <div className="rounded-[28px] bg-gray-400/40 p-6">
              <div className="space-y-4">
                {/* NUTRIENT RESERVE TOTAL */}
                <div className="text-center">
                  <div className="text-[10px] tracking-wide text-black/90 mb-2">
                    NUTRIENT RESERVE TOTAL
                  </div>
                  <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-2 py-2 text-[11px] text-gray-900 text-center">
                    {weiToEth(stats.nutrientReserveTotal)} ETH
                  </div>
                </div>

                {/* YOUR CONTRIBUTIONS */}
                <div className="text-center">
                  <div className="text-[10px] tracking-wide text-black/90 mb-2">
                    YOUR CONTRIBUTIONS
                  </div>
                  <div className="bg-gray-200/80 rounded-full px-2 py-2 text-[11px] text-gray-900 text-center">
                    {weiToEth(stats.highestSeedDeposit)} ETH
                  </div>
                </div>

                {/* ABSOLUTE NUTRIENT YIELD */}
                <div className="text-center">
                  <div className="text-[10px] tracking-wide text-black/90 mb-2">
                    ABSOLUTE NUTRIENT YIELD
                  </div>
                  <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-1 py-2 text-[10px] text-gray-900 text-center">
                    {parseFloat(stats.absoluteNutrientYield).toFixed(6)} ETH
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: HARVESTABLE - Single background with individual value containers */}
            <div className="rounded-[28px] bg-gray-400/40 p-6">
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
          <div className="mx-4 mb-6">
            <div className="flex gap-4">
              {/* Amplify Impact Section */}
              <div className="flex-1">
                {/* Button with scalloped edges and border */}
                <button 
                  onClick={handleAmplifyClick}
                  className="relative w-full px-4 py-2 bg-purple-200/80 text-gray-900 peridia-display text-base mb-1 rounded-full border-2 border-dotted border-black/60 hover:bg-purple-200/90 transition-colors cursor-pointer z-20"
                >
                  Amplify Impact
                </button>
                {/* Description container - narrower and touching button */}
                <div className="bg-purple-200/40 rounded-xl p-2 mx-2 -mt-3">
                  <div className="text-[9px] text-center text-black/70 leading-tight">
                    <span className="">Add more funds to your seed to amplify its</span> <span className="peridia-display-light">longterm impact & </span>
                    <span className="">increase your <span className="peridia-display-light">snapshot share</span></span>
                  </div>
                </div>
              </div>

              {/* Harvest Section */}
              <div className="flex-1">
                {/* Button with scalloped edges and border */}
                <button 
                  onClick={handleHarvestClick}
                  className="relative w-full px-4 py-2 bg-white/80 text-gray-900 peridia-display text-base mb-1 rounded-full border-2 border-dotted border-black/60 hover:bg-white/90 transition-colors cursor-pointer z-20"
                >
                  Harvest
                </button>
                {/* Description container - narrower and touching button */}
                <div className="bg-white/40 rounded-xl p-2 mx-5 -mt-3">
                  <div className="text-[9px] text-black/70 text-center leading-tight">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 scale-[0.9] lg:scale-[1.1] md:scale-[0.9]">
              {/* Left Card: Impact Details */}
              <div className="rounded-[28px] bg-gray-400/40 p-4 h-45">
                <div className="space-y-4">
                  {/* IMMEDIATE IMPACT */}
                  <div className="">
                    <div className="text-[12px] text-black/80 mb-0">
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
                    <div className="text-[12px] text-black/80 mb-0">
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
                <div className="flex flex-col justify-between h-full">
                  {/* Action Buttons */}
                  <div className="space-y-3 mb-4 -mt-4">
                    <button className="px-3 w-38 py-1 text-nowrap rounded-full bg-white/70 text-gray-900 peridia-display text-sm">
                      <Link href="https://app.regen.network/profiles/daa2cbf0-6a5a-11f0-ae30-0afffa81c869/projects">
                        View Certificates
                      </Link>
                    </button>
                    <button className="w-38 px-3 py-1 rounded-full bg-white/70 text-gray-900 peridia-display text-sm">
                      <Link href="https://basescan.org/address/0x9142A61188e829BF924CeffF27e8ed8111700C9B">
                        Scan Blockchain
                      </Link>
                    </button>
                  </div>

                  {/* OVERALL ACCUMULATED YIELD */}
                    <div className="text-[10px] text-white text-nowrap mb-1">
                      OVERALL ACCUMULATED YIELD
                    </div>
                  <div className="w-38 h-15 bg-gray-400/40 rounded-lg p-2">
                    <div className="rounded-full px-2 -mt-4 py-2 text-[16px] text-center text-gray-900">
                      {parseFloat(stats.overallAccumulatedYield).toFixed(6)} ETH
                    </div>

                    {/* Distribute Yield Button */}
                    <div className="-mt-5">
                      <button className="w-38 -ml-2 px-6 py-1 rounded-full border-4 border-dotted border-gray-300 text-nowrap bg-white/80 text-gray-900 peridia-display text-sm mt-4">
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
                <span className="text-nowrap tracking-wide text-gray-900 favorit-mono text-[14px] -ml-3 scale-[0.9] lg:scale-[0.9] md:scale-[0.9]">
                  DETAILED DATA OF YOUR STEWARDED ECOSYSTEMS
                </span>
                <span className="text-gray-900 -ml-2">▼</span>
              </div>
            </div>
          <div className="rounded-[28px] bg-gray-400/40 m-4 p-6">

            <div className="space-y-4">
              {stats.beneficiaries && stats.beneficiaries.length > 0 ? (
                stats.beneficiaries.map((beneficiary, index) => (
                  <div
                    key={`${beneficiary.index}-${beneficiary.code}`}
                    className=""
                  >
                    {/* Title bar */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full border-3 border-dotted border-black bg-white overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={`/seeds/0${beneficiary.index + 1}__${beneficiary.code.split('-')[1]}.png`}
                          alt={beneficiary.name}
                          fill
                          className="object-contain p-1"
                          onLoad={handleImageLoad}
                          onError={() => setImageError(true)}
                        />
                      </div>
                      <div className="flex-1 border text-nowrap border-black rounded-full bg-white/80 text-center text-gray-900 text-sm w-45 py-1 -ml-12">
                        <p className="text-nowrap scale-[0.8] lg:scale-[0.5] md:scale-[0.8]-ml-4 left-4">{beneficiary.name}</p>
                      </div>
                    </div>

                    {/* Row of stats - responsive grid */}
                    <div className="grid grid-cols-1 gap-2">
                      {/* First row: BENEFIT SHARE and #SNAPSHOTS with GARDEN */}
                      <div className="grid grid-cols-3 gap-2">
                        <Pill
                          label="BENEFIT SHARE"
                          value={`${beneficiary.benefitShare}%`}
                        />
                        <Pill
                          label="#SNAPSHOTS"
                          value={`${beneficiary.snapshotCount}`}
                          trailing={`GAIN ${parseFloat(beneficiary.snapshotsGain).toFixed(6)} ETH`}
                        />
                        <Pill label="GARDEN" value={`${parseFloat(beneficiary.garden).toFixed(6)} ETH`} />
                      </div>

                      {/* Second row: YIELD SHARE and UNCLAIMED */}
                      <div className="grid grid-cols-2 gap-2">
                        <Pill
                          label="YIELD SHARE"
                          value={`${parseFloat(beneficiary.yieldShare).toFixed(6)} ETH`}
                        />
                        <Pill
                          label="UNCLAIMED"
                          value={`${parseFloat(beneficiary.unclaimed).toFixed(6)} ETH`}
                          trailing={`${parseFloat(beneficiary.claimed).toFixed(6)} ETH CLAIMED`}
                        />
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
        <div className="fixed -bottom-1 left-0 right-0 z-30 pt-4 scale-[1.1]">
          <div className="max-w-md mx-auto px-4">
            <RootShapeArea
              onWallet={() => {}}
              showGlassEffect={false}
              showStoryButton={false}
            />
          </div>
        </div>
      </div>

      {/* Modals moved to page level for proper centering */}
    </>
  );
}

function Pill({
  label,
  value,
  trailing,
}: {
  label: string;
  value: string;
  trailing?: string;
}) {
  return (
    <div className="bg-gray-400/40 rounded-[20px] p-2">
      <div className="text-[9px] text-black/80 mb-1 tracking-wide uppercase">
        {label}
      </div>
      <div className="flex flex-col gap-1">
        <div className="bg-white/80 border-2 border-dashed border-black rounded-full px-2 py-1.5 text-gray-900 text-[10px] text-center">
          {value}
        </div>
        {trailing && (
          <div className="bg-white/60 border-1 border-black rounded-full px-2 py-1 text-[9px] text-gray-900 text-center">
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}
