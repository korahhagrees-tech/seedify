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
            : "/project_images/01__GRG.png"
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
          if (target.src !== `${window.location.origin}/project_images/01__GRG.png`) {
            target.src = "/project_images/01__GRG.png";
          }
        }}
      />

      {/* Transparent glass overlay (subtle tint) */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-lg backdrop-brightness-75" />

      {/* Foreground content */}
      <div className="relative z-10 px-4 pt-8 pb-8">
        <div className="max-w-md mx-auto">
          {/* The Way of Flowers logo */}
          <div className="text-center mb-8 scale-[0.8] lg:scale-[0.7] md:scale-[0.7]">
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
            className="relative bg-transparent rounded-[40px] shadow-2xl overflow-hidden border-4 border-dotted border-white/70 h-[580px] lg:h-[750px] md:h-[750px]"
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
                className="object-contain lg:scale-[1.0] md:scale-[1.0] scale-[1.05] lg:-mt-2 md:-mt-2 mt-4"
                priority
              />
            </div>
            {/* Header window + dots (match EcosystemProjectCard layout, white dots) */}
            <div className="relative h-28">
              {/* Four small solid white circles */}
              <div className="absolute lg:top-12 md:top-12 top-8 lg:left-6 md:left-6 left-7 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
              <div className="absolute lg:top-32 md:top-32 top-26 lg:left-3 md:left-3 left-4 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
              <div className="absolute lg:top-12 md:top-12 top-9 lg:right-3 md:right-3 right-4 -translate-y-1/2 w-6 h-6 rounded-full bg-white" />
              <div className="absolute lg:-bottom-4 md:-bottom-4 bottom-2 lg:right-0 md:right-0 right-1 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-white" />
            </div>

            {/* Content positioned on the card */}
            <div className="relative z-10 p-8">
              {/* Top section with welcome message and beneficiary image */}
              <div className="text-center mb-8">
                {/* Welcome text */}
                <div className="mb-6 -mt-30 lg:-mt-32 md:-mt-30 peridia-display-light">
                  <div className="text-black text-2xl -mb-1">WELCOME</div>
                  <div className="text-black/70 text-sm">to the flourishing</div>
                </div>

                {/* Random beneficiary image in circle */}
                <div className="mb-20 lg:mb-26 md:mb-30 -mt-4 lg:-mt-2 md:-mt-6 flex justify-center">
                  <div className="w-16 lg:w-20 md:w-20 h-16 lg:h-20 md:h-20 rounded-full overflow-hidden border-2 border-black/20">
                    <Image
                      src={
                        randomBeneficiaryImage && randomBeneficiaryImage.length > 0
                          ? randomBeneficiaryImage
                          : "/project_images/01__GRG.png"
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
                          `${window.location.origin}/project_images/01__GRG.png`
                        ) {
                          target.src = "/project_images/01__GRG.png";
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Choose four beneficiaries text */}
                <div className="-mt-8 text-black font-bold text-base lg:scale-[0.55] md:scale-[0.55] scale-[0.6]">
                  <Image
                    src={assets.chooseBeneficiary}
                    alt="Choose four beneficiaries"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Four beneficiary buttons section */}
              <div className="-mb-14 lg:-mb-30 md:-mb-16 -px-12 lg:scale-[0.98] md:scale-[0.95] scale-[0.90] lg:mt-1 md:-mt-1 -mt-3">
                <div className="grid grid-cols-2 px-1 gap-6 mt-12 lg:mt-14 md:mt-12 mb-9">
                  {/* {selectedBeneficiaries.map((beneficiary, index) => (
                    <button
                      key={beneficiary.index}
                      className="px-4 py-1 rounded-full border-2 border-dotted border-black/70 bg-[#F0ECF3] text-black text-sm font-medium peridia-display-light hover:bg-white/90 transition-colors"
                    >
                      Beneficiary {String(index + 1).padStart(2, '0')}
                    </button>
                  ))} */}
                  <div className="-ml-6 lg:-ml-2 md:-ml-2">
                    <button
                      className="px-8 py-0 text-nowrap rounded-full border-2 border-dotted border-black/70 bg-[#F0ECF3] text-black text-sm font-medium peridia-display-light hover:bg-white/90 transition-colors"
                    >
                      Beneficiary 01
                    </button>
                  </div>
                  <div className="ml-2 lg:ml-2 md:ml-2">
                    <button
                      className="px-8 py-0 rounded-full border-2 border-dotted border-black/70 bg-[#F0ECF3] text-black text-nowrap text-sm font-medium peridia-display-light hover:bg-white/90 transition-colors"
                    >
                      Beneficiary 02
                    </button>
                  </div>
                  <div className="-ml-6 lg:-ml-2 md:-ml-2">
                    <button
                      className="px-8 py-0 text-nowrap rounded-full border-2 border-dotted border-black/70 bg-[#F0ECF3] text-black text-sm font-medium peridia-display-light hover:bg-white/90 transition-colors"
                    >
                      Beneficiary 03
                    </button>
                  </div>
                  <div className="ml-2 lg:ml-2 md:ml-2">
                    <button
                      className="px-8 py-0 rounded-full border-2 border-dotted border-black/70 bg-[#F0ECF3] text-black text-nowrap text-sm font-medium peridia-display-light hover:bg-white/90 transition-colors"
                    >
                      Beneficiary 04
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-black text-sm -mt-4 mb-4">
                    <p className="text-black text-nowrap text-sm">Thank you for becoming a <span className="peridia-display-light">Seed Steward.</span></p>
                  </div>
                  <div className="text-black lg:text-[13px] md:text-[13px] text-[11px] scale-[1.1] lg:scale-[1.0] md:scale-[1.0] -mt-2 lg:-mt-1 md:-mt-1">
                    <p className="">Your support weaves verified conservation with synthetic botanical intelligence, creating digital flora that blooms <p>through authentic environmental care.</p></p>
                  </div>
                </div>
              </div>

              {/* Bottom section with MINT button */}
              <div className="text-center">
                {/* MINT button with pulse animation */}
                <motion.div
                  className="lg:mt-6 md:-mt-2 -mt-30"
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
                    className="mt-46 mb-9 px-8 py-3 rounded-full border-2 border-dotted border-white/70 text-white text-xl font-medium bg-transparent hover:bg-white/20 transition-all duration-300 peridia-display"
                  >
                    <p className="text-white text-2xl scale-[0.8] lg:scale-[1.2] md:scale-[0.9] font-medium">MINT</p>
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
                      {/* {transactionStatus === "success" && (
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
                      )} */}

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
            <div className="text-white text-2xl peridia-display-light">by CROSSLUCID</div>
          </div>
        </div>
      </div>
    </div>
  );
}
