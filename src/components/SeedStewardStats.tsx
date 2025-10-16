"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import GardenHeader from "@/components/GardenHeader";
import RootShapeArea from "@/components/wallet/RootShapeArea";
import { Seed } from "@/types/seed";
import { useState } from "react";
import Link from "next/link";

type Beneficiary = {
  id: string;
  name: string;
  emblemUrl: string;
  benefitShare: string; // e.g. "12.45%"
  snapshots: number;
  gain: string; // e.g. "0.112 ETH"
  garden: string; // e.g. "1.911 ETH"
  yieldShare: string; // e.g. "0.211 ETH"
  unclaimed: string; // e.g. "0.162 ETH"
  claimed: string; // e.g. "0.222 ETH"
};

export interface SeedStewardStatsProps {
  seed: Seed;
  links: { openseaUrl: string };
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
  stats,
}: SeedStewardStatsProps) {
  const { scrollYProgress } = useScroll();
  const [imageError, setImageError] = useState(false);

  // Morph large rounded-square image to smaller circle on scroll
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);
  const radius = useTransform(scrollYProgress, [0, 0.2], [60, 999]);

  // Button animations - start at top-right of image, drop down to right side
  const buttonScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const buttonTranslateX = useTransform(scrollYProgress, [0, 0.2], [0, 40]);
  const buttonTranslateY = useTransform(scrollYProgress, [0, 0.2], [0, 80]);
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

  return (
    <>
      {/* Fixed background image - positioned to match mobile container */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-screen bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: 'url("/steward-stats.png")',
        }}
      />

      <div className="relative min-h-screen w-full max-w-md mx-auto overflow-hidden bg-transparent">
        {/* Foreground content */}
        <div className="relative z-10 px-4 pt-2 pb-6">
          {/* Header */}
          <GardenHeader />

          {/* Hero with image and actions */}
          <div className="pt-4 pb-6">
            <div className="flex items-start justify-between gap-4 relative max-w-md mx-auto mt-2">
              {/* Morphing image */}
              <motion.div
                style={{ scale, borderRadius: radius }}
                className="relative lg:w-[370px] md:w-[370px] w-[320px] h-[370px] rounded-full overflow-hidden shadow-xl bg-white mx-auto scale-[0.6] -ml-20 -mt-22 -mb-34"
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
                }}
                className="absolute top-2 right-12 flex flex-col gap-3"
              >
                <Link
                  href={links.openseaUrl}
                  className="px-4 py-0 text-nowrap rounded-full border-3 border-dotted border-gray-700 bg-gradient-to-r from-gray-200/90 to-white/90 text-gray-900 peridia-display text-sm text-center shadow-lg"
                >
                  View Opensea
                </Link>
                <button className="px-6 py-2 rounded-full border-3 border-dashed border-white/80 bg-purple-200/90 text-gray-900 peridia-display text-sm shadow-lg">
                  Customise Display
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main dotted container */}
        <div className="relative z-0 mx-4 mb-36 rounded-[60px] scale-[0.9] -mt-30 border-3 border-dotted border-black/70 bg-black/10 backdrop-blur-md">
          {/* Section: Core Seed Metrics - Full width with 3x2 grid */}
          <div className="rounded-[28px] bg-gray-400/40 m-4 p-6">
            {/* Full width header with INFO button */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="text-lg font-bold tracking-wide text-gray-900 peridia-display">
                  CORE SEED METRICS
                </div>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 border-2 border-dashed border-gray-700 text-gray-900 text-sm">
                INFO ▼
              </div>
            </div>

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
                <button className="relative w-full px-4 py-2 bg-purple-200/80 text-gray-900 peridia-display text-base mb-1 rounded-full border-2 border-dotted border-black/60 hover:bg-purple-200/90 transition-colors">
                  Amplify Impact
                </button>
                {/* Description container - narrower and touching button */}
                <div className="bg-purple-200/40 rounded-xl p-2 mx-5 -mt-3">
                  <div className="text-[9px] text-black/70 text-center leading-tight">
                    Add more funds to your seed to amplify its longterm impact &
                    increase your snapshot share
                  </div>
                </div>
              </div>

              {/* Harvest Section */}
              <div className="flex-1">
                {/* Button with scalloped edges and border */}
                <button className="relative w-full px-4 py-2 bg-white/80 text-gray-900 peridia-display text-base mb-1 rounded-full border-2 border-dotted border-black/60 hover:bg-white/90 transition-colors">
                  Harvest
                </button>
                {/* Description container - narrower and touching button */}
                <div className="bg-white/40 rounded-xl p-2 mx-5 -mt-3">
                  <div className="text-[9px] text-black/70 text-center leading-tight">
                    Harvest the nutrient reserve to withdraw available funds
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Your Regenerative Impact - Two separate cards side by side */}
          <div className="rounded-[28px] bg-gray-400/40 m-4 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between bg-gradient-to-r from-gray-300/80 to-white/60 border-1 border-black rounded-full px-4 py-2">
                <span className="tracking-wide text-gray-900 favorit-mono text-sm">
                  YOUR REGENERATIVE IMPACT
                </span>
                <span className="text-gray-900">▼</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Card: Impact Details */}
              <div className="rounded-[28px] bg-gray-400/40 p-4">
                <div className="space-y-4">
                  {/* IMMEDIATE IMPACT */}
                  <div>
                    <div className="text-[10px] text-black/80 mb-2">
                      IMMEDIATE IMPACT
                    </div>
                    <div className="bg-white/80 rounded-full border-2 border-dashed border-black px-3 py-2 text-sm text-center text-gray-900">
                      {parseFloat(stats.immediateImpact).toFixed(6)} ETH
                    </div>
                    {stats.immediateImpactDate && (
                      <div className="text-[9px] text-black/70 mt-2">
                        DISTRIBUTED: {formatDate(stats.immediateImpactDate)}
                      </div>
                    )}
                  </div>

                  {/* LONGTERM IMPACT */}
                  <div>
                    <div className="text-[10px] text-black/80 mb-2">
                      LONGTERM IMPACT
                    </div>
                    <div className="bg-white/80 rounded-full border-2 border-dashed border-black px-3 py-2 text-sm text-center text-gray-900">
                      {parseFloat(stats.longtermImpact).toFixed(6)} ETH
                    </div>
                    {stats.longtermImpactDate && (
                      <div className="text-[9px] text-black/70 mt-2">
                        DISTRIBUTED: {formatDate(stats.longtermImpactDate)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Card: Actions & Yield */}
              <div className="rounded-[28px] bg-gray-400/40 p-4">
                <div className="flex flex-col justify-between h-full">
                  {/* Action Buttons */}
                  <div className="space-y-3 mb-4">
                    <button className="w-full px-3 py-2 rounded-full border-1 border-black bg-white/90 text-gray-900 peridia-display text-sm">
                      View Certificates
                    </button>
                    <button className="w-full px-3 py-2 rounded-full border-1 border-black bg-white/90 text-gray-900 peridia-display text-sm">
                      Scan Blockchain
                    </button>
                  </div>

                  {/* OVERALL ACCUMULATED YIELD */}
                  <div>
                    <div className="text-[10px] text-black/80 mb-2">
                      OVERALL ACCUMULATED YIELD
                    </div>
                    <div className="bg-white/80 rounded-full border-2 border-dashed border-black px-2 py-2 text-[11px] text-center text-gray-900">
                      {parseFloat(stats.overallAccumulatedYield).toFixed(6)} ETH
                    </div>
                  </div>

                  {/* Distribute Yield Button */}
                  <div className="mt-4">
                    <button className="w-full px-3 py-2 rounded-full border-3 border-dotted border-black bg-purple-200/80 text-gray-900 peridia-display text-sm">
                      Distribute Yield
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Detailed Data of Your Stewarded Ecosystems - Full width with background */}
          <div className="rounded-[28px] bg-gray-400/40 m-4 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between bg-gradient-to-r from-gray-300/80 to-white/60 border-1 border-black rounded-full px-4 py-2">
                <span className="tracking-wide text-gray-900 favorit-mono text-sm">
                  DETAILED DATA OF YOUR STEWARDED ECOSYSTEMS
                </span>
                <span className="text-gray-900">▼</span>
              </div>
            </div>

            <div className="space-y-4">
              {stats.beneficiaries && stats.beneficiaries.length > 0 ? (
                stats.beneficiaries.map((beneficiary) => (
                  <div
                    key={beneficiary.id}
                    className="rounded-[24px] bg-gradient-to-r from-white/60 to-white/30 backdrop-blur p-3 border-1 border-black"
                  >
                    {/* Title bar */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full border-3 border-dotted border-black bg-white overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={beneficiary.emblemUrl}
                          alt={beneficiary.name}
                          fill
                          className="object-contain p-1"
                          onLoad={handleImageLoad}
                          onError={() => setImageError(true)}
                        />
                      </div>
                      <div className="flex-1 text-center text-gray-900 peridia-display text-sm">
                        {beneficiary.name}
                      </div>
                    </div>

                    {/* Row of stats - responsive grid */}
                    <div className="grid grid-cols-1 gap-2">
                      {/* First row: BENEFIT SHARE and #SNAPSHOTS with GARDEN */}
                      <div className="grid grid-cols-3 gap-2">
                        <Pill
                          label="BENEFIT SHARE"
                          value={beneficiary.benefitShare}
                        />
                        <Pill
                          label="#SNAPSHOTS"
                          value={`${beneficiary.snapshots}`}
                          trailing={`GAIN ${beneficiary.gain}`}
                        />
                        <Pill label="GARDEN" value={beneficiary.garden} />
                      </div>

                      {/* Second row: YIELD SHARE and UNCLAIMED */}
                      <div className="grid grid-cols-2 gap-2">
                        <Pill
                          label="YIELD SHARE"
                          value={beneficiary.yieldShare}
                        />
                        <Pill
                          label="UNCLAIMED"
                          value={beneficiary.unclaimed}
                          trailing={`${beneficiary.claimed} CLAIMED`}
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
