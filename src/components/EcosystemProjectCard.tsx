"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import GardenHeader from "@/components/GardenHeader";
import { Switch } from "@/components/ui/switch";
import { assets } from "@/lib/assets";

interface EcosystemProjectCardProps {
  backgroundImageUrl: string;
  title: string;
  subtitle?: string;
  shortText: string;
  extendedText: string;
  ctaText?: string;
  seedEmblemUrl?: string;
}

/**
 * A mobile-first card with a decorative cutout header and translucent insets,
 * matching the provided reference UI. Includes an inverted switch for
 * toggling short vs extended content and a rounded CTA button.
 */
export default function EcosystemProjectCard({
  backgroundImageUrl,
  title,
  subtitle,
  shortText,
  extendedText,
  ctaText = "Tend Ecosystem",
  seedEmblemUrl,
}: EcosystemProjectCardProps) {
  // Inverted switch: up = off (short), down = on (extended)
  const [showShort, setShowShort] = useState(true);

  const content = showShort ? shortText : extendedText;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <Image
        src={backgroundImageUrl}
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Foreground content */}
      <div className="relative z-10 px-4 pt-2 pb-8">
        {/* Reuse the garden header */}
        <div className="max-w-md mx-auto">
          <GardenHeader logo={assets.text} />
        </div>

        {/* Card with cutout header */}
        <motion.div 
          className="relative max-w-md mx-auto mt-8 bg-white rounded-[60px] shadow-xl border-none border-black overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Top navigation circles */}
          <div className="absolute -top-3 left-38 w-10 h-10 rounded-full border-1 border-black bg-white flex items-center justify-center z-10">
            <Image
              src="/arrow-left.svg"
              alt="Back"
              width={12}
              height={12}
              className="w-6 h-6"
            />
          </div>
          <div className="absolute -top-3 right-38 w-12 h-12 rounded-full border-1 border-black bg-white flex items-center justify-center z-10">
            {seedEmblemUrl && (
              <Image
                src={seedEmblemUrl || assets.globe}
                alt="Seed emblem"
                width={24}
                height={16}
                className="w-8 h-8"
              />
            )}
          </div>

          {/* Division bar with background image */}
          <div className="relative h-4 -bottom-18 bg-white">
            <Image
              src={backgroundImageUrl}
              alt="Division bar"
              fill
              className="object-cover"
            />
          </div>

          {/* Header oval window that reveals background image */}
          <div className="relative h-28">
            {/* Four small circles around the oval */}
            <div className="absolute top-8 left-6 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={backgroundImageUrl}
                alt="Circle 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute top-24 left-3 -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={backgroundImageUrl}
                alt="Circle 2"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute top-8 right-3 -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={backgroundImageUrl}
                alt="Circle 3"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-4 right-0 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={backgroundImageUrl}
                alt="Circle 4"
                fill
                className="object-cover"
              />
            </div>

            {/* Oval mask container */}
            <div className="absolute left-1/2 top-16 -translate-x-1/2 -translate-y-1/2 w-[80%] h-34 rounded-[100px] overflow-hidden">
              {/* Duplicate background image inside the oval to simulate window */}
              <Image
                src={backgroundImageUrl}
                alt="Header window"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Text content - fixed-height card body */}
          <div className="px-5 pb-4 mt-10">
            <h2 className="text-2xl text-black text-center leading-tight peridia-display-light">{title}</h2>
            {subtitle && (
              <div className="text-[10px] text-black/70 text-center mt-1">{subtitle}</div>
            )}

            {/* Fixed content viewport with hidden scrollbars */}
            <div className="relative mt-4 text-[13px] leading-relaxed text-black/90 h-56 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={showShort ? 'short' : 'extended'}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mb-8"
                >
                  {content}
                </motion.div>
              </AnimatePresence>
            </div>
              {/* Bottom blur fade */}
              <div className="pointer-events-none absolute -bottom-8 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent" />
          </div>

          {/* Footer with centered CTA and inverted switch next to it */}
          <div className="relative px-4 py-4 flex items-center justify-center gap-4">
            <Button variant="ghost" className="w-[70%] rounded-full border-1 border-black/40 text-black text-lg py-8 peridia-display flex flex-col">
              {/* {ctaText} */}
              <span className="text-2xl -mt-1">Tend </span>
              <span className="text-2xl -mt-4">Ecosystem</span>
            </Button>
            {/* Inverted switch: up = off (short), down = on (extended) */}
            <div className="-rotate-90 scale-[1.8]">
              <Switch 
                checked={showShort} 
                onCheckedChange={setShowShort} 
                className="border-1 border-black/40 data-[state=checked]:bg-white data-[state=unchecked]:bg-gray-400 [&>span]:border-1 [&>span]:scale-[0.9] [&>span]:data-[state=checked]:bg-gray-400 [&>span]:data-[state=unchecked]:bg-white" 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


