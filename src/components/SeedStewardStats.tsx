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

export default function SeedStewardStats({ seed, links, metrics }: SeedStewardStatsProps) {
  const { scrollYProgress } = useScroll();
  const [imageError, setImageError] = useState(false);
  
  // Morph large rounded-square image to smaller circle on scroll
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);
  const radius = useTransform(scrollYProgress, [0, 0.2], [60, 999]);
  
  // Button animations - start at top-right of image, drop down to right side
  const buttonScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const buttonTranslateX = useTransform(scrollYProgress, [0, 0.2], [0, 40]);
  const buttonTranslateY = useTransform(scrollYProgress, [0, 0.2], [0, 80]);
  const buttonOpacity = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.2], [1, 1, 1, 1]);

  const handleImageLoad = () => {
    console.log("🌸 [IMAGE] Successfully loaded:", seed.seedImageUrl);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-100">
      <Image
        src="/steward-stats.png"
        alt=""
        fill
        className="object-cover"
        priority
      />

      {/* Foreground content */}
      <div className="relative z-10 px-4 pt-2 pb-6">
        {/* Header */}
        <GardenHeader />

        {/* Hero with image and actions */}
        <div className="pt-4 pb-6">
          <div className="flex items-start justify-between gap-4 relative max-w-md mx-auto">
            {/* Morphing image */}
            <motion.div
              style={{ scale, borderRadius: radius }}
              className="relative lg:w-[370px] md:w-[370px] w-[320px] h-[340px] rounded-[60px] overflow-hidden -mb-16 shadow-xl bg-white mx-auto"
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
                opacity: buttonOpacity
              }}
              className="absolute top-2 right-2 flex flex-col gap-3"
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
      <div className="relative z-0 mx-4 mb-36 rounded-[60px] border-3 border-dotted border-black/70 bg-black/10 backdrop-blur-md">
        {/* Section: Core Seed Metrics (open by default) */}
        <SectionHeader title="CORE SEED METRICS" />
        <div className="px-4 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics.core.map((m, idx) => (
              <div key={idx} className="rounded-[28px] bg-gray-400/40 p-4">
                <div className="text-xs tracking-wide text-black/90 mb-2">{m.label}</div>
                <div className="bg-white/70 border-2 border-dashed border-gray-700 rounded-full px-4 py-2 text-xl text-gray-900 text-center">
                  {m.value}
                </div>
                {m.sublabel && (
                  <div className="mt-2 text-xs text-black/70">{m.sublabel}</div>
                )}
              </div>
            ))}
          </div>

          {/* Action buttons under core stats */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 px-6 py-3 rounded-full bg-purple-200/80 border-3 border-dotted border-black text-gray-900 peridia-display text-xl">Amplify Impact</button>
            <button className="px-6 py-3 rounded-full bg-white/80 border-1 border-black text-gray-900 peridia-display text-xl">Harvest</button>
          </div>
        </div>

        {/* Section: Your Regenerative Impact */}
        <SectionHeader title="YOUR REGENERATIVE IMPACT" />
        <div className="px-4 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-[28px] bg-gray-400/40 p-4">
              <div className="text-sm text-black/80 mb-2">IMMEDIATE IMPACT</div>
              <div className="bg-white/80 rounded-full border-2 border-dashed border-black px-6 py-3 text-2xl text-center text-gray-900">
                {metrics.regenerativeImpact.immediateImpactEth} ETH
              </div>
              {metrics.regenerativeImpact.immediateDistributedDate && (
                <div className="text-xs text-black/70 mt-2">DISTRIBUTED: {metrics.regenerativeImpact.immediateDistributedDate}</div>
              )}
            </div>
            <div className="rounded-[28px] bg-gray-400/40 p-4">
              <div className="text-sm text-black/80 mb-2">OVERALL ACCUMULATED YIELD</div>
              <div className="bg-white/80 rounded-full border-2 border-dashed border-black px-6 py-3 text-2xl text-center text-gray-900">
                {metrics.regenerativeImpact.overallAccumulatedEth} ETH
              </div>
            </div>
            <div className="rounded-[28px] bg-gray-400/40 p-4">
              <div className="text-sm text-black/80 mb-2">LONGTERM IMPACT</div>
              <div className="bg-white/80 rounded-full border-2 border-dashed border-black px-6 py-3 text-2xl text-center text-gray-900">
                {metrics.regenerativeImpact.longtermImpactEth} ETH
              </div>
              {metrics.regenerativeImpact.longtermDistributedDate && (
                <div className="text-xs text-black/70 mt-2">DISTRIBUTED: {metrics.regenerativeImpact.longtermDistributedDate}</div>
              )}
            </div>
            <div className="flex flex-col justify-end gap-3">
              <button className="w-full px-6 py-3 rounded-full border-1 border-black bg-white/90 text-gray-900 peridia-display text-xl">View Certificates</button>
              <button className="w-full px-6 py-3 rounded-full border-1 border-black bg-white/90 text-gray-900 peridia-display text-xl">Scan Blockchain</button>
              <button className="w-full px-6 py-3 rounded-full border-3 border-dotted border-black bg-purple-200/80 text-gray-900 peridia-display text-xl">Distribute Yield</button>
            </div>
          </div>
        </div>

        {/* Section: Detailed Data of Your Stewarded Ecosystems */}
        <SectionHeader title="DETAILED DATA OF YOUR STEWARDED ECOSYSTEMS" />
        <div className="px-2 pb-6">
          <div className="space-y-4">
            {metrics.beneficiaries.map((b) => (
              <div key={b.id} className="rounded-[24px] bg-gradient-to-r from-white/60 to-white/30 backdrop-blur p-3 border-1 border-black">
                {/* Title bar */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full border-3 border-dotted border-black bg-white overflow-hidden flex-shrink-0 relative">
                    <Image src={b.emblemUrl} alt={b.name} fill className="object-contain p-1" onLoad={handleImageLoad} onError={() => setImageError(true)} />
                  </div>
                  <div className="flex-1 text-center text-gray-900 peridia-display">{b.name}</div>
                </div>

                {/* Row of stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <Pill label="BENEFIT SHARE" value={b.benefitShare} />
                  <Pill label="#SNAPSHOTS" value={`${b.snapshots}`} trailing={`GAIN ${b.gainEth}ETH`} />
                  <Pill label="GARDEN" value={`${b.gardenEth}ETH`} />
                  <Pill label="YIELD SHARE" value={`${b.yieldShareEth}ETH`} />
                  <Pill label="UNCLAIMED" value={`${b.unclaimedEth}ETH`} trailing={`${b.claimedEth}ETH CLAIMED`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer root shape */}
      <div className="fixed -bottom-1 left-0 right-0 z-30 pt-4 scale-[1.1]">
        <div className="max-w-md mx-auto px-4">
          <RootShapeArea onWallet={() => {}} showGlassEffect={false} showStoryButton={false} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 mt-6">
      <div className="flex-1">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-300/80 to-white/60 border-1 border-black rounded-full px-4 py-2">
          <span className="tracking-wide text-gray-900 favorit-mono">{title}</span>
        </div>
      </div>
      <div className="pr-2">▼</div>
    </div>
  );
}

function Pill({ label, value, trailing }: { label: string; value: string; trailing?: string }) {
  return (
    <div className="bg-gray-400/40 rounded-[20px] p-2">
      <div className="text-[11px] text-black/80 mb-1 tracking-wide">{label}</div>
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


