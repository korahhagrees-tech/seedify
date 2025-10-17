"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { assets } from "@/lib/assets";

interface WayOfFlowersCardProps {
  backgroundImageUrl: string;
  seedEmblemUrl: string;
  firstText: string;
  secondText: string;
  thirdText: string;
  mainQuote: string;
  author: string;
  onExploreClick?: () => void;
}

export default function WayOfFlowersCard({
  backgroundImageUrl,
  seedEmblemUrl,
  firstText,
  secondText,
  thirdText,
  mainQuote,
  author,
  onExploreClick,
}: WayOfFlowersCardProps) {
  const [showButtons, setShowButtons] = useState(false);

  // Show explore button after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 15000); // 15 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black/50 backdrop-blur-lg">
      {/* Background image with light glass transparency (no heavy blur) */}
      <Image
        src={
          backgroundImageUrl && backgroundImageUrl.length > 0
            ? backgroundImageUrl
            : "/seeds/01__GRG.png"
        }
        alt=""
        fill
        className="object-cover"
        priority
        onError={(e) => {
          console.log(
            "🌸 [IMAGE] Error loading WayOfFlowers background image, using placeholder"
          );
          const target = e.target as HTMLImageElement;
          if (target.src !== `${window.location.origin}/seeds/01__GRG.png`) {
            target.src = "/seeds/01__GRG.png";
          }
        }}
      />

      {/* Transparent glass overlay (subtle tint) */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-lg backdrop-brightness-75" />

      {/* Foreground content */}
      <div className="relative z-10 px-4 pt-8 pb-8">
        <div className="max-w-md mx-auto">
          {/* The Way of Flowers logo */}
          <div className="text-center mb-8">
            <Image
              src={assets.text}
              alt="The Way of Flowers"
              width={300}
              height={80}
              className="mx-auto"
            />
          </div>

          {/* Main card */}
          <motion.div
            className="relative bg-transparent rounded-[40px] shadow-2xl overflow-hidden border-4 border-dotted border-white/70 h-[750px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Blooming SVG frame */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Image
                src="/Blooming.svg"
                alt="Blooming frame"
                fill
                className="object-contain scale-[1.0] lg:mt-0 md:-mt-2 -mt-15"
                priority
              />
            </div>
            {/* Header window + dots (match EcosystemProjectCard layout, white dots) */}
            <div className="relative h-28">
              {/* Four small solid white circles */}
              <div className="absolute top-12 left-6 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
              <div className="absolute top-32 left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
              <div className="absolute top-12 right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
              <div className="absolute -bottom-4 right-0 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-white" />
            </div>

            {/* Content positioned on the card */}
            <div className="relative z-10 p-8">
              {/* Top section with seed emblem and text */}
              <div className="text-center mb-8">
                {/* Seed emblem */}
                <div className="mb-6 flex justify-center lg:-mt-16 md:-mt-16 -mt-18">
                  <Image
                    src={
                      seedEmblemUrl && seedEmblemUrl.length > 0
                        ? seedEmblemUrl
                        : "/seeds/01__GRG.png"
                    }
                    alt=""
                    width={60}
                    height={60}
                    className="lg:w-37 md:w-37 w-30 lg:h-37 md:h-37 h-30 -mt-14 mb-6"
                    onError={(e) => {
                      console.log(
                        "🌸 [IMAGE] Error loading seed emblem, using placeholder"
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
                </div>

                {/* Three text lines */}
                <div className="-space-y-1 lg:mt-1 md:-mt-2 -mt-2 text-black font-medium text-base lg:scale-[0.9] md:scale-[0.9] scale-[0.75]">
                  <div>{firstText}</div>
                  <div>{secondText}</div>
                  <div className="text-nowrap">{thirdText}</div>
                </div>
              </div>

              {/* Main quote section (no background, over SVG shape) */}
              <div className="mb-8 -px-12 lg:scale-[1.05] md:scale-[1.05] scale-[1.1] lg:mt-2 -mt-1 md:mt-4">
                <p className="text-black text-left lg:text-[15px] md:text-[15px] text-[13px] leading-tight peridia-display-light tracking-wider">
                  {`"${mainQuote}"`}{" "}
                  <span className="text-black/70 mt-3 text-xs favorit-mono font-bold text-center">
                    {author}
                  </span>
                </p>
              </div>

              {/* Bottom section with Blooming and Explore */}
              <div className="text-center">
                {/* Blooming text with pulse animation - only show when waiting for image */}
                <motion.div
                  className="text-white font-medium text-2xl lg:mt-6 md:-mt-2 -mt-5"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <p className="mt-26 mb-9 peridia-display">
                    B
                    <span className="mt-3 favorit-mono font-bold text-center">
                      looming
                    </span>
                  </p>
                </motion.div>

                {/* Single Explore button - shows after 15 seconds */}
                <AnimatePresence>
                  {showButtons && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      className="flex flex-col items-center gap-3"
                    >
                      <Button
                        onClick={onExploreClick}
                        className="w-[160px] rounded-full border border-white/70 text-black text-xl scale-[0.85] ml-3 py-2 bg-white hover:bg-white/20 transition-all duration-300"
                      >
                        <span className="peridia-display">
                          E<span className="favorit-mono">xplore</span>
                        </span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}