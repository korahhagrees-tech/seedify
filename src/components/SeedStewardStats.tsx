"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import GardenHeader from "@/components/GardenHeader";
import RootShapeArea from "@/components/wallet/RootShapeArea";
import { Seed } from "@/types/seed";
import { useState } from "react";
import Link from "next/link";

type BeneficiaryStat = {
  id: string;
  name: string;
  emblemUrl: string;
  benefitShare: string; // e.g. "12.45%"
  snapshots: number;
  gainEth: string; // e.g. "0.112"
  gardenEth: string; // e.g. "1.911"
  yieldShareEth: string; // e.g. "0.211"
  unclaimedEth: string; // e.g. "0.162"
  claimedEth: string; // e.g. "0.222"
};

type CoreMetric = {
  label: string;
  value: string;
  sublabel?: string;
};

export interface SeedStewardStatsProps {
  seed: Seed;
  links: { openseaUrl: string };
  metrics: {
    core: CoreMetric[]; // sequence shown in the grid
    regenerativeImpact: {
      immediateImpactEth: string;
      immediateDistributedDate?: string;
      longtermImpactEth: string;
      longtermDistributedDate?: string;
      overallAccumulatedEth: string;
    };
    beneficiaries: BeneficiaryStat[];
  };
}

export default function SeedStewardStats({
  seed,
  links,
  metrics,
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
          {/* Section: Core Seed Metrics - Single section with 3x2 grid */}
          <div className="rounded-[28px] bg-gray-400/40 m-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-300/80 to-white/60 border-1 border-black rounded-full px-4 py-2">
                  <span className="tracking-wide text-gray-900 favorit-mono">
                    CORE SEED METRICS
                  </span>
                </div>
              </div>
              <div className="pr-2">INFO ▼</div>
            </div>
            
            {/* Core metrics 3x2 grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {metrics.core.map((m, idx) => (
                <div key={idx} className="rounded-[28px] bg-gray-400/40 p-3">
                  <div className="text-xs tracking-wide text-black/90 mb-2 text-center">
                    {m.label}
                  </div>
                  <div className={`rounded-full px-3 py-2 text-lg text-gray-900 text-center ${
                    idx < 3 ? 'bg-white/70 border-2 border-dashed border-gray-700' : 'bg-gray-200/80'
                  }`}>
                    {m.value}
                  </div>
                  {m.sublabel && (
                    <div className="mt-1 text-xs text-black/70 text-center">
                      {m.sublabel}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Two separate sections below */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-4 mb-6">
            {/* Left Card: NUTRIENT RESERVE TOTAL */}
            <div className="rounded-[28px] bg-gray-400/40 p-6">
              <div className="space-y-4">
                <div className="rounded-[28px] bg-gray-400/40 p-4">
                  <div className="text-xs tracking-wide text-black/90 mb-2 text-center">
                    NUTRIENT RESERVE TOTAL
                  </div>
                  <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-4 py-2 text-xl text-gray-900 text-center">
                    1.826 ETH
                  </div>
                </div>
                <div className="rounded-[28px] bg-gray-400/40 p-4">
                  <div className="text-xs tracking-wide text-black/90 mb-2 text-center">
                    YOUR CONTRIBUTIONS
                  </div>
                  <div className="bg-gray-200/80 rounded-full px-4 py-2 text-xl text-gray-900 text-center">
                    1.100 ETH
                  </div>
                </div>
                <div className="rounded-[28px] bg-gray-400/40 p-4">
                  <div className="text-xs tracking-wide text-black/90 mb-2 text-center">
                    ABSOLUTE NUTRIENT YIELD
                  </div>
                  <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-4 py-2 text-xl text-gray-900 text-center">
                    0.176 ETH
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: HARVESTABLE */}
            <div className="rounded-[28px] bg-gray-400/40 p-6">
              <div className="space-y-4">
                <div className="rounded-[28px] bg-gray-400/40 p-4">
                  <div className="text-xs tracking-wide text-black/90 mb-2 text-center">
                    HARVESTABLE
                  </div>
                  <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-4 py-2 text-xl text-gray-900 text-center">
                    0.126 ETH
                  </div>
                </div>
                <div className="rounded-[28px] bg-gray-400/40 p-4">
                  <div className="text-xs tracking-wide text-black/90 mb-2 text-center">
                    MATURATION DATE
                  </div>
                  <div className="bg-gray-200/80 rounded-full px-4 py-2 text-xl text-gray-900 text-center">
                    02/09/2029
                  </div>
                </div>
                <div className="rounded-[28px] bg-gray-400/40 p-4">
                  <div className="text-xs tracking-wide text-black/90 mb-2 text-center">
                    EARLY HARVEST FEE
                  </div>
                  <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-4 py-2 text-xl text-gray-900 text-center">
                    0.126 ETH
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mx-4 mb-6">
            <div className="flex gap-3">
              <button className="flex-1 px-6 py-3 rounded-full bg-purple-200/80 border-3 border-dotted border-black text-gray-900 peridia-display text-xl">
                Amplify Impact
              </button>
              <button className="px-6 py-3 rounded-full bg-white/80 border-1 border-black text-gray-900 peridia-display text-xl">
                Harvest
              </button>
            </div>
            <div className="flex gap-3 mt-2 text-xs text-black/70">
              <div className="flex-1 text-center">
                Add more funds to your seed to amplify its longterm impact & increase your snapshot share
              </div>
              <div className="w-24 text-center">
                Harvest the nutrient reserve to withdraw available funds
              </div>
            </div>
          </div>

          {/* Section: Your Regenerative Impact - Full width with background */}
          <div className="rounded-[28px] bg-gray-400/40 m-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-300/80 to-white/60 border-1 border-black rounded-full px-4 py-2">
                  <span className="tracking-wide text-gray-900 favorit-mono">
                    YOUR REGENERATIVE IMPACT
                  </span>
                </div>
              </div>
              <div className="pr-2">▼</div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-[28px] bg-gray-400/40 p-4">
                <div className="text-sm text-black/80 mb-2">
                  IMMEDIATE IMPACT
                </div>
                <div className="bg-white/80 rounded-full border-2 border-dashed border-black px-6 py-3 text-2xl text-center text-gray-900">
                  {metrics.regenerativeImpact.immediateImpactEth} ETH
                </div>
                {metrics.regenerativeImpact.immediateDistributedDate && (
                  <div className="text-xs text-black/70 mt-2">
                    DISTRIBUTED:{" "}
                    {metrics.regenerativeImpact.immediateDistributedDate}
                  </div>
                )}
              </div>
              <div className="rounded-[28px] bg-gray-400/40 p-4">
                <div className="text-sm text-black/80 mb-2">
                  OVERALL ACCUMULATED YIELD
                </div>
                <div className="bg-white/80 rounded-full border-2 border-dashed border-black px-6 py-3 text-2xl text-center text-gray-900">
                  {metrics.regenerativeImpact.overallAccumulatedEth} ETH
                </div>
              </div>
              <div className="rounded-[28px] bg-gray-400/40 p-4">
                <div className="text-sm text-black/80 mb-2">
                  LONGTERM IMPACT
                </div>
                <div className="bg-white/80 rounded-full border-2 border-dashed border-black px-6 py-3 text-2xl text-center text-gray-900">
                  {metrics.regenerativeImpact.longtermImpactEth} ETH
                </div>
                {metrics.regenerativeImpact.longtermDistributedDate && (
                  <div className="text-xs text-black/70 mt-2">
                    DISTRIBUTED:{" "}
                    {metrics.regenerativeImpact.longtermDistributedDate}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-end gap-3">
                <button className="w-full px-6 py-3 rounded-full border-1 border-black bg-white/90 text-gray-900 peridia-display text-xl">
                  View Certificates
                </button>
                <button className="w-full px-6 py-3 rounded-full border-1 border-black bg-white/90 text-gray-900 peridia-display text-xl">
                  Scan Blockchain
                </button>
                <button className="w-full px-6 py-3 rounded-full border-3 border-dotted border-black bg-purple-200/80 text-gray-900 peridia-display text-xl">
                  Distribute Yield
                </button>
              </div>
            </div>
          </div>

          {/* Section: Detailed Data of Your Stewarded Ecosystems - Full width with background */}
          <div className="rounded-[28px] bg-gray-400/40 m-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-300/80 to-white/60 border-1 border-black rounded-full px-4 py-2">
                  <span className="tracking-wide text-gray-900 favorit-mono">
                    DETAILED DATA OF YOUR STEWARDED ECOSYSTEMS
                  </span>
                </div>
              </div>
              <div className="pr-2">▼</div>
            </div>
            
            <div className="space-y-4">
              {metrics.beneficiaries.map((b) => (
                <div
                  key={b.id}
                  className="rounded-[24px] bg-gradient-to-r from-white/60 to-white/30 backdrop-blur p-3 border-1 border-black"
                >
                  {/* Title bar */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full border-3 border-dotted border-black bg-white overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={b.emblemUrl}
                        alt={b.name}
                        fill
                        className="object-contain p-1"
                        onLoad={handleImageLoad}
                        onError={() => setImageError(true)}
                      />
                    </div>
                    <div className="flex-1 text-center text-gray-900 peridia-display">
                      {b.name}
                    </div>
                  </div>

                  {/* Row of stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <Pill label="BENEFIT SHARE" value={b.benefitShare} />
                    <Pill
                      label="#SNAPSHOTS"
                      value={`${b.snapshots}`}
                      trailing={`GAIN ${b.gainEth}ETH`}
                    />
                    <Pill label="GARDEN" value={`${b.gardenEth}ETH`} />
                    <Pill label="YIELD SHARE" value={`${b.yieldShareEth}ETH`} />
                    <Pill
                      label="UNCLAIMED"
                      value={`${b.unclaimedEth}ETH`}
                      trailing={`${b.claimedEth}ETH CLAIMED`}
                    />
                  </div>
                </div>
              ))}
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
      <div className="text-[11px] text-black/80 mb-1 tracking-wide">
        {label}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 bg-white/80 border-2 border-dashed border-black rounded-full px-3 py-2 text-gray-900 text-sm text-center">
          {value}
        </div>
        {trailing && (
          <div className="bg-white/60 border-1 border-black rounded-full px-3 py-2 text-[11px] text-gray-900 whitespace-nowrap">
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}
