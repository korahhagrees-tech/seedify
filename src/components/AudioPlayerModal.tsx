/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AudioPlayerModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  audioUrl: string;
  title?: string;
}

type PlayerState = "modal" | "orb" | "closed";

export default function AudioPlayerModal({
  isOpen,
  onCloseAction,
  audioUrl,
  title = "Audio Player",
}: AudioPlayerModalProps) {
  const [playerState, setPlayerState] = useState<PlayerState>("modal");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioRef = useRef<HTMLIFrameElement>(null);
  const hiddenAudioRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPlayerState("modal");
      setIsPlaying(true);
      setAudioInitialized(true);
    } else {
      setPlayerState("closed");
      setIsPlaying(false);
      setAudioInitialized(false);
    }
  }, [isOpen]);

  const handleModalDismiss = () => {
    setShowConfirmDialog(true);
  };

  const handleContinuePlaying = () => {
    setShowConfirmDialog(false);
    setPlayerState("orb");
    setIsPlaying(true);
    // Don't reset audioInitialized - keep the audio state
    console.log("🎵 Transitioning to orb state - audio should continue");
  };

  const handleStopPlaying = () => {
    setShowConfirmDialog(false);
    setPlayerState("closed");
    setIsPlaying(false);
    onCloseAction();
  };

  const handleOrbClick = () => {
    setPlayerState("modal");
  };

  if (!isOpen && playerState === "closed") return null;

  return (
    <>
      {/* Hidden iframe for background audio - always present when audio is initialized */}
      {audioInitialized && (
        <div className="invisible absolute">
          <iframe
            ref={hiddenAudioRef}
            width="0"
            height="0"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
              audioUrl
            )}&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
            className="invisible absolute"
          />
        </div>
      )}

      {/* Modal State */}
      <AnimatePresence>
        {playerState === "modal" && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-50 backdrop-blur-xs"
              onClick={handleModalDismiss}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-[60] max-w-sm mx-auto"
            >
              <div className="bg-[#D9D9D9] rounded-tr-[40px] rounded-tl-[120px] rounded-br-[120px] rounded-bl-[40px] p-6 border-3 border-dotted border-gray-600 shadow-xl h-80 scale-[0.8] lg:scale-[0.9] md:scale-[0.9]">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-light ml-18 peridia-display-light text-black tracking-wider">
                    {title}
                  </h2>
                  <button
                    onClick={handleModalDismiss}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* SoundCloud Embed - Only show when modal is open */}
                <div className="w-full bg-white rounded-[20px] overflow-hidden mt-8 scale-[0.9] lg:scale-[0.9] md:scale-[0.9]">
                  <iframe
                    ref={audioRef}
                    width="100%"
                    height="180"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                      audioUrl
                    )}&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-[70] backdrop-blur-sm"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-[80] max-w-sm mx-auto"
            >
              <div className="bg-white rounded-[30px] p-6 border-2 border-black shadow-xl scale-[0.9] lg:scale-[0.9] md:scale-[0.9]">
                <h3 className="text-lg font-medium text-black mb-4 text-center peridia-display-light">
                  Continue Playing Audio?
                </h3>
                <p className="text-sm text-gray-600 mb-6 text-center">
                  Would you like to keep the audio playing in the background?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleStopPlaying}
                    className="flex-1 px-4 py-3 bg-gray-200 text-black rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    No
                  </button>
                  <button
                    onClick={handleContinuePlaying}
                    className="flex-1 px-4 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Orb State */}
      <AnimatePresence>
        {playerState === "orb" && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={handleOrbClick}
            className="fixed bottom-24 right-6 z-40 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            {/* Audio wave animation */}
            <div className="relative w-8 h-8">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-white/30"
              />
              <svg
                className="w-8 h-8 text-white relative z-10"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 3v18m-4-13v8m8-8v8m-12-5v2m16-2v2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
