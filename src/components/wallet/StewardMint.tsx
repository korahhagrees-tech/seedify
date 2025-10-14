/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { assets } from "@/lib/assets";
import { useWaitForTransactionReceipt } from "wagmi";
import { useSearchParams } from "next/navigation";
import { API_CONFIG } from "@/lib/api/config";

interface StewardMintProps {
  backgroundImageUrl: string;
  onMintClick?: () => void;
  onTryAgainClick?: () => void;
}

interface Beneficiary {
  index: number;
  name: string;
  code: string;
  projectData: {
    title: string;
    backgroundImage: string;
  };
}

export default function StewardMint({
  backgroundImageUrl,
  onMintClick,
  onTryAgainClick,
}: StewardMintProps) {
  const [showButtons, setShowButtons] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [randomBeneficiaryImage, setRandomBeneficiaryImage] = useState<string>("");
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<Beneficiary[]>([]);
  const searchParams = useSearchParams();

  // Fetch beneficiaries on component mount
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/beneficiaries/`);
        const data = await response.json();
        
        if (data.success && data.beneficiaries) {
          setBeneficiaries(data.beneficiaries);
          
          // Select random beneficiary for the circle image
          const randomIndex = Math.floor(Math.random() * data.beneficiaries.length);
          const randomBeneficiary = data.beneficiaries[randomIndex];
          setRandomBeneficiaryImage(randomBeneficiary.projectData.backgroundImage);
          
          // Select 4 random beneficiaries for the buttons
          const shuffled = [...data.beneficiaries].sort(() => 0.5 - Math.random());
          setSelectedBeneficiaries(shuffled.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to fetch beneficiaries:', error);
      }
    };

    fetchBeneficiaries();
  }, []);

  // Get transaction hash from URL params
  useEffect(() => {
    const hash = searchParams.get("txHash");
    if (hash) {
      setTxHash(hash);
    }
  }, [searchParams]);

  // Use wagmi to wait for transaction
  const {
    data: receipt,
    isLoading,
    isError,
  } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
    query: {
      enabled: !!txHash,
      retry: 10,
      retryDelay: 4000, // 4 seconds between retries
    },
  });

  // Handle transaction status changes
  useEffect(() => {
    if (receipt) {
      setTransactionStatus("success");
      setShowButtons(true);
    } else if (isError) {
      setTransactionStatus("failed");
      setShowButtons(true);
    } else if (!isLoading && txHash) {
      // If we have a hash but no receipt and not loading, wait for timeout
      const timer = setTimeout(() => {
        setTransactionStatus("failed");
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
        setTransactionStatus("success");
      }, 40000);

      return () => clearTimeout(timer);
    }
  }, [txHash]);

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
                className="object-contain scale-[1.0] lg:mt-0 md:-mt-2 -mt-2"
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
              {/* Top section with welcome message and beneficiary image */}
              <div className="text-center mb-8">
                {/* Welcome text */}
                <div className="mb-6 -mt-12">
                  <div className="text-black font-bold text-2xl mb-2">WELCOME</div>
                  <div className="text-black/70 text-sm">to the flourishing</div>
                </div>

                {/* Random beneficiary image in circle */}
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-black/20">
                    <Image
                      src={
                        randomBeneficiaryImage && randomBeneficiaryImage.length > 0
                          ? randomBeneficiaryImage
                          : "/seeds/01__GRG.png"
                      }
                      alt=""
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log(
                          "🌸 [IMAGE] Error loading beneficiary image, using placeholder"
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
                </div>

                {/* Choose four beneficiaries text */}
                <div className="-mt-8 text-black font-bold text-base lg:scale-[0.85] md:scale-[0.80] scale-[0.75]">
                  <div className="text-nowrap">CHOOSE FOUR BENEFICIARIES</div>
                </div>
              </div>

              {/* Four beneficiary buttons section */}
              <div className="mb-8 -px-12 lg:scale-[0.98] md:scale-[0.95] scale-[0.98] lg:mt-1 -mt-2">
                <div className="grid grid-cols-2 gap-3">
                  {selectedBeneficiaries.map((beneficiary, index) => (
                    <button
                      key={beneficiary.index}
                      className="px-4 py-3 rounded-full border-2 border-dotted border-black/70 bg-white/80 text-black text-sm font-medium hover:bg-white transition-colors"
                    >
                      Beneficiary {String(index + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom section with MINT button */}
              <div className="text-center">
                {/* MINT button with pulse animation */}
                <motion.div
                  className="lg:mt-6 md:-mt-2 -mt-5"
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
                  <button
                    onClick={onMintClick}
                    className="mt-26 mb-9 px-8 py-3 rounded-full border-2 border-dotted border-white/70 text-black text-xl font-medium bg-white hover:bg-white/20 transition-all duration-300 peridia-display"
                  >
                    MINT
                  </button>
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
                      {transactionStatus === "success" && (
                        <>
                          <Button
                            onClick={onMintClick}
                            className="w-[160px] rounded-full border border-white/70 text-black text-xl scale-[0.85] ml-3 py-2 bg-white hover:bg-white/20 transition-all duration-300"
                          >
                            <span className="peridia-display">
                              M<span className="favorit-mono">int</span>
                            </span>
                          </Button>
                        </>
                      )}

                      {transactionStatus === "failed" && (
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
              onClick={() =>
                window.open(`https://basescan.org/tx/${txHash}`, "_blank")
              }
              className="text-white justify-center items-center mt-2 ml-24 underline hover:text-white/80 transition-colors text-sm"
            >
              View on Explorer
            </Button>
          )}
          
          {/* by CROSSLUCID */}
          <div className="text-center mt-4">
            <div className="text-white/80 text-sm">by CROSSLUCID</div>
          </div>
        </div>
      </div>
    </div>
  );
}
