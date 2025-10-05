"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { assets } from "@/lib/assets";
import { useWaitForTransactionReceipt } from "wagmi";
import { useSearchParams } from "next/navigation";

interface WayOfFlowersCardProps {
  backgroundImageUrl: string;
  seedEmblemUrl: string;
  firstText: string;
  secondText: string;
  thirdText: string;
  mainQuote: string;
  author: string;
  onExploreClick?: () => void;
  onTryAgainClick?: () => void;
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
  onTryAgainClick,
}: WayOfFlowersCardProps) {
  const [showButtons, setShowButtons] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [txHash, setTxHash] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Get transaction hash from URL params
  useEffect(() => {
    const hash = searchParams.get('txHash');
    if (hash) {
      setTxHash(hash);
    }
  }, [searchParams]);

  // Use wagmi to wait for transaction
  const { data: receipt, isLoading, isError } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
    query: {
      enabled: !!txHash,
      retry: 10,
      retryDelay: 4000, // 4 seconds between retries
    }
  });

  // Handle transaction status changes
  useEffect(() => {
    if (receipt) {
      setTransactionStatus('success');
      setShowButtons(true);
    } else if (isError) {
      setTransactionStatus('failed');
      setShowButtons(true);
    } else if (!isLoading && txHash) {
      // If we have a hash but no receipt and not loading, wait for timeout
      const timer = setTimeout(() => {
        setTransactionStatus('failed');
        setShowButtons(true);
      }, 40000);

      return () => clearTimeout(timer);
    }
  }, [receipt, isError, isLoading, txHash]);

  // Fallback: if no transaction hash, show explore after 40 seconds (original behavior)
  useEffect(() => {
    if (!txHash) {
      const timer = setTimeout(() => {
        setShowButtons(true);
        setTransactionStatus('success');
      }, 40000);

      return () => clearTimeout(timer);
    }
  }, [txHash]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black/50 backdrop-blur-lg">
      {/* Background image with light glass transparency (no heavy blur) */}
      <Image
        src={backgroundImageUrl}
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      
      {/* Transparent glass overlay (subtle tint) */}
      <div className="absolute inset-0 bg-white/70" />

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
                className="object-contain scale-[1.0] lg:mt-4 md:-mt-1 -mt-1"
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
                <div className="mb-6 flex justify-center -mt-12">
                  <Image
                    src={seedEmblemUrl}
                    alt="Seed emblem"
                    width={60}
                    height={60}
                    className="w-37 h-37 -mt-14 mb-6"
                  />
                </div>

                {/* Three text lines */}
                <div className="-space-y-1 -mt-3 text-black font-medium text-base scale-[0.85]">
                  <div>{firstText}</div>
                  <div>{secondText}</div>
                  <div>{thirdText}</div>
                </div>
              </div>

              {/* Main quote section (no background, over SVG shape) */}
              <div className="mb-8 -px-12 lg:scale-[0.98] md:scale-[0.95] scale-[0.98] lg:mt-1 -mt-2">
                <p className="text-black text-left lg:text-[17px] md:text-[17px] text-[16px] leading-tight peridia-display-light">
                  {`"${mainQuote}"`} <span className="text-black/70 mt-3 text-xs favorit-mono font-bold text-center">{author}</span>
                </p>
              </div>

              {/* Bottom section with Blooming and Explore */}
              <div className="text-center">
                {/* Blooming text with pulse animation */}
                <motion.div
                  className="text-white font-medium mb-4 text-2xl"
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
                  <p className="mt-26 mb-9 peridia-display">B<span className="mt-3 favorit-mono font-bold text-center">looming</span></p>
                </motion.div>

                {/* Buttons based on transaction status */}
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
                      {transactionStatus === 'success' && (
                        <>
                          <Button
                            onClick={onExploreClick}
                            className="w-[160px] rounded-full border border-white/70 text-black text-xl scale-[0.85] ml-4 py-2 bg-white hover:bg-white/20 transition-all duration-300"
                          >
                            <span className="peridia-display">E<span className="favorit-mono">xplore</span></span>
                          </Button>
                        </>
                      )}
                      
                      {transactionStatus === 'failed' && (
                        <Button
                        onClick={onTryAgainClick}
                        className="w-[160px] rounded-full border border-white/70 text-black text-base py-2 bg-white hover:bg-white/20 transition-all duration-300"
                        >
                          Try Again
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
            {txHash && (
              <Button
                variant="ghost"
                onClick={() => window.open(`https://basescan.org/tx/${txHash}`, '_blank')}
                className="text-white justify-center items-center mt-2 ml-24 underline hover:text-white/80 transition-colors text-sm"
              >
                View on Explorer
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
