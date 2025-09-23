"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface EcosystemProjectCardProps {
  backgroundImageUrl: string;
  title: string;
  subtitle?: string;
  areaText?: string;
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
  areaText,
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
      <div className="relative z-10 px-4 pt-6 pb-8">
        {/* Top controls mimicking back and pills */}
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button className="w-10 h-10 rounded-full bg-white/90 border-2 border-black flex items-center justify-center">←</button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/60 border-2 border-black" />
            <div className="w-10 h-10 rounded-full bg-white/60 border-2 border-black" />
          </div>
          <div className="w-6 h-6 rounded-full bg-white/70 border-2 border-black" />
        </div>

        {/* Card with cutout header */}
        <motion.div 
          className="max-w-md mx-auto mt-3 bg-white rounded-[28px] shadow-xl border-2 border-black/70 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Cutout header overlay (transparent oval and small circles) */}
          <div className="relative h-28">
            <div className="absolute inset-0 bg-transparent" />
            {/* Large transparent oval cutout */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-20 rounded-[100px] border-2 border-black/70 bg-white/10 backdrop-blur-[1px]" />
            {/* Small circles to accent cutout */}
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/20 border-2 border-black/70" />
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 border-2 border-black/70" />
          </div>

          {/* Text content */}
          <div className="px-5 pb-4">
            <h2 className="text-2xl text-black text-center leading-tight">{title}</h2>
            {(subtitle || areaText) && (
              <div className="text-[10px] text-black/70 text-center mt-1">
                {subtitle && <div>{subtitle}</div>}
                {areaText && <div>{areaText}</div>}
              </div>
            )}

            <div className="mt-4 text-[13px] leading-relaxed text-black/90 max-h-56 overflow-y-auto pr-1">
              {content}
            </div>
          </div>

          {/* Footer with CTA and inverted switch */}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Button variant="ghost" className="flex-1 rounded-full border-2 border-black text-black text-lg py-6">
              {ctaText}
            </Button>
            {/* Inverted: when checked => down (we rotate 180deg visually) */}
            <div className="rotate-180">
              <Switch checked={showExtended} onCheckedChange={setShowExtended} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


