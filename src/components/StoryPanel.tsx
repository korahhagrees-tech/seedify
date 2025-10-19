/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import { assets } from "@/lib/assets";
import Image from "next/image";


interface StoryPanelProps {
  text: string;
  onBack: () => void;
  title?: string;
  author?: string;
  audioUrl?: string;
  onAudioClick?: () => void;
}

export default function StoryPanel({ text, onBack, title, author, audioUrl, onAudioClick }: StoryPanelProps) {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="relative rounded-[50px] border-3 border-dotted border-black bg-white p-5">
        {/* Back arrow inside circle */}
        <button
          onClick={onBack}
          className="absolute left-4 top-4 w-10 h-10 rounded-full border-3 border-dotted border-black flex items-center justify-center"
        >
          <Image src={assets.arrowLeft} alt="Back" width={20} height={20} />
        </button>

        {/* Title block */}
        <div className="text-center mt-6 mb-6">
          <div className="lg:text-[38px] md:text-[28px] text-[30px] text-center tracking-wider leading-[0.95] scale-[0.7] -mt-8 peridia-display-light">{title || "We are the Soil for What Comes Next"}</div>
          <div className="text-2xl -mt-1">{title ? "" : "for What Comes Next"}</div>
          <div className="text-xs text-black/70 mt-2">{author ? `by ${author}` : "by Stanley Qiufan Chen"}</div>
        </div>

        <div className="mx-auto my-2 w-10 h-10 rounded-full border border-black flex items-center justify-center">
          <button onClick={onAudioClick} aria-label="Play audio">
            <Image src="/audio-play.svg" alt="Audio" width={20} height={20} />
          </button>
        </div>

        {/* Body content */}
        <div className="max-h-[520px] overflow-y-auto pr-1 text-xs tracking-tight [scrollbar-width:none] [&::-webkit-scrollbar]:hidden leading-relaxed text-black/90">
          <p className="whitespace-pre-line">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}


