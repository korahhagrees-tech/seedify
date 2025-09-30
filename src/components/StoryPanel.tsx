"use client";

import { motion } from "framer-motion";

interface StoryPanelProps {
  text: string;
  onBack: () => void;
  title?: string;
  author?: string;
}

export default function StoryPanel({ text, onBack, title, author }: StoryPanelProps) {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="relative rounded-[50px] border-2 border-dotted border-black bg-white p-5">
        {/* Back arrow inside circle */}
        <button
          onClick={onBack}
          className="absolute left-4 top-4 w-10 h-10 rounded-full border border-black flex items-center justify-center"
        >
          <span className="text-xl">←</span>
        </button>

        {/* Title block */}
        <div className="text-center mt-6 mb-4">
          <div className="text-2xl">{title || "We are the Soil"}</div>
          <div className="text-2xl -mt-1">{title ? "" : "for What Comes Next"}</div>
          <div className="text-xs text-black/70 mt-2">{author ? `by ${author}` : "by Stanley Qiufan Chen"}</div>
        </div>

        {/* Body content */}
        <div className="max-h-[520px] overflow-y-auto pr-1 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden leading-relaxed text-black/90">
          <p className="whitespace-pre-line">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}


