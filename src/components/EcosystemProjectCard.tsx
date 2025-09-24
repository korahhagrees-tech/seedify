"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import GardenHeader from "@/components/GardenHeader";
import { Switch } from "@/components/ui/switch";

interface EcosystemProjectCardProps {
  backgroundImageUrl: string;
  title: string;
  subtitle?: string;
  shortText: string;
  extendedText: string;
  ctaText?: string;
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
}: EcosystemProjectCardProps) {
  // Inverted switch: up = off (short), down = on (extended)
  const [showExtended, setShowExtended] = useState(false);

  const content = showExtended ? extendedText : shortText;

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
          <GardenHeader />
        </div>

        {/* Card with cutout header */}
        <motion.div 
          className="relative max-w-md mx-auto mt-3 bg-white rounded-[28px] shadow-xl border-2 border-black overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Corner bolt cutouts */}
          <div className="pointer-events-none absolute -top-3 left-3 w-6 h-6 rounded-full border-2 border-black bg-white" />
          <div className="pointer-events-none absolute -top-3 right-3 w-6 h-6 rounded-full border-2 border-black bg-white" />

          {/* Header oval window that reveals background image */}
          <div className="relative h-28">
            {/* Oval mask container */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[86%] h-20 rounded-[100px] overflow-hidden border-2 border-black">
              {/* Duplicate background image inside the oval to simulate window */}
              <Image
                src={backgroundImageUrl}
                alt="Header window"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Lavender pips on the oval */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-black" style={{ backgroundColor: '#c6b1d9' }} />
            <div className="absolute top-4 left-[calc(50%+36px)] -translate-y-1/2 w-6 h-6 rounded-full border-2 border-black" style={{ backgroundColor: '#c6b1d9' }} />
            {/* Back button overlapping the oval */}
            <button className="absolute left-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center">←</button>
          </div>

          {/* Text content - fixed-height card body */}
          <div className="px-5 pb-4">
            <h2 className="text-2xl text-black text-center leading-tight font-serif">{title}</h2>
            {subtitle && (
              <div className="text-[10px] text-black/70 text-center mt-1">{subtitle}</div>
            )}

            {/* Fixed content viewport with hidden scrollbars */}
            <div className="relative mt-4 text-[13px] leading-relaxed text-black/90 h-56 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={showExtended ? 'extended' : 'short'}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {content}
                </motion.div>
              </AnimatePresence>
              {/* Bottom blur fade */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
            </div>
          </div>

          {/* Footer with centered CTA and inverted switch next to it */}
          <div className="relative px-4 py-4 flex items-center justify-center gap-4">
            <Button variant="ghost" className="w-[70%] rounded-full border-2 border-black text-black text-lg py-6">
              {ctaText}
            </Button>
            {/* Inverted switch: up = off (short), down = on (extended) */}
            <div className="rotate-180">
              <Switch checked={showExtended} onCheckedChange={setShowExtended} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


