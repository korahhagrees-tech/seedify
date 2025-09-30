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
  const [showExplore, setShowExplore] = useState(false);

  useEffect(() => {
    // Show explore button after 40 seconds
    const timer = setTimeout(() => {
      setShowExplore(true);
    }, 40000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image with light glass transparency (no heavy blur) */}
      <Image
        src={backgroundImageUrl}
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      
      {/* Transparent glass overlay (subtle tint) */}
      <div className="absolute inset-0 bg-white/10" />

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
            className="relative bg-transparent rounded-[40px] shadow-2xl overflow-hidden border-2 border-dotted border-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header window + dots (match EcosystemProjectCard layout, white dots) */}
            <div className="relative h-28">
              {/* Four small solid white circles */}
              <div className="absolute top-8 left-6 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
              <div className="absolute top-24 left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
              <div className="absolute top-8 right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
              <div className="absolute bottom-4 right-0 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-white" />

              {/* Oval white header shape */}
              <div className="absolute left-1/2 top-16 -translate-x-1/2 -translate-y-1/2 w-[80%] h-34 rounded-[100px] bg-white" />
            </div>

            {/* Content positioned on the card */}
            <div className="relative z-10 p-8">
              {/* Top section with seed emblem and text */}
              <div className="text-center mb-8">
                {/* Seed emblem */}
                <div className="mb-6 flex justify-center">
                  <Image
                    src={seedEmblemUrl}
                    alt="Seed emblem"
                    width={60}
                    height={60}
                    className="w-15 h-15"
                  />
                </div>

                {/* Three text lines */}
                <div className="space-y-0 mt-4 text-black font-medium text-base">
                  <div>{firstText}</div>
                  <div>{secondText}</div>
                  <div>{thirdText}</div>
                </div>
              </div>

              {/* Main quote section */}
              <div className="mb-8">
                <div className="bg-white/92 rounded-2xl p-6 shadow-lg">
                  <p className="text-black text-sm leading-relaxed font-serif italic">
                    {`"${mainQuote}"`}
                  </p>
                  <p className="text-black/70 text-xs mt-3 font-medium">
                    — {author}
                  </p>
                </div>
              </div>

              {/* Bottom section with Blooming and Explore */}
              <div className="text-center">
                {/* Blooming text with pulse animation */}
                <motion.div
                  className="text-white font-medium text-lg mb-4"
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
                  <p className="mt-2">Blooming</p>
                </motion.div>

                {/* Explore button with ease-in animation */}
                <AnimatePresence>
                  {showExplore && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                    >
                      <Button
                        onClick={onExploreClick}
                        className="mx-auto w-[160px] rounded-full border border-white/70 text-white text-base py-2 bg-transparent hover:bg-white/20 transition-all duration-300"
                      >
                        Explore
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
