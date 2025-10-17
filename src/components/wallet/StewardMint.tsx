/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { assets } from "@/lib/assets";
import { useWaitForTransactionReceipt } from "wagmi";
import { useSearchParams } from "next/navigation";
import { API_CONFIG } from "@/lib/api/config";
import { useSendTransaction } from "@privy-io/react-auth";
import { encodeFunctionData, parseEther } from "viem";
import { toast } from "sonner";

interface StewardMintProps {
  backgroundImageUrl: string;
  onMintClick?: () => void;
  onTryAgainClick?: () => void;
  walletAddress?: string; // optional, for display/checks only
  prepareData?: any | null;
  prepareLoading?: boolean;
  prepareError?: string | null;
  userEvmAddress?: string | undefined;
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
  walletAddress,
  prepareData,
  prepareLoading,
  prepareError,
  userEvmAddress,
}: StewardMintProps) {
  const [showButtons, setShowButtons] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [randomBeneficiaryImage, setRandomBeneficiaryImage] = useState<string>("");
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<Beneficiary[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null); // 1..4 or null
  const [selectedBySlot, setSelectedBySlot] = useState<Record<number, Beneficiary | null>>({ 1: null, 2: null, 3: null, 4: null });
  const searchParams = useSearchParams();
  const { sendTransaction } = useSendTransaction();

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

  const optionsForSlot = (slot: number): Beneficiary[] => {
    if (!Array.isArray(beneficiaries)) return [];
    if (slot === 1) return beneficiaries;
    return beneficiaries.filter((b) => b.index !== 1);
  };

  const labelForSlot = (slot: number): string => {
    const sel = selectedBySlot[slot];
    if (!sel) return `Beneficiary ${String(slot).padStart(2, '0')}`;
    // Prefer project title if available, else name
    return sel.projectData?.title || sel.name || `Beneficiary ${String(slot).padStart(2, '0')}`;
  };

  const handleSelect = (slot: number, b: Beneficiary) => {
    setSelectedBySlot((prev) => ({ ...prev, [slot]: b }));
    setOpenDropdown(null);
  };

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

          {/* Optional wallet address display (render-only, no gating) */}
          {walletAddress && (
            <div className="text-center mb-2">
              {/* <div className="inline-block px-3 py-1 rounded-full bg-white/70 text-black text-xs font-mono">
                {walletAddress}
              </div> */}
            </div>
          )}

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

              {/* Four beneficiary dropdowns section */}
              <div className="-mb-14 lg:-mb-30 md:-mb-16 -px-12 lg:scale-[0.98] md:scale-[0.95] scale-[0.90] lg:mt-1 md:-mt-1 -mt-3">
                <div className="grid grid-cols-2 px-1 gap-6 mt-12 lg:mt-14 md:mt-12 mb-9">
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className={`${slot % 2 === 1 ? '-ml-2 lg:-ml-2 md:-ml-2' : '-ml-2 lg:ml-2 md:ml-2'} relative`}>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === slot ? null : slot)}
                        className="px-8 py-0 w-full rounded-full border-2 border-dotted border-black/70 bg-[#F0ECF3] text-black text-sm font-medium peridia-display-light hover:bg-white/90 transition-colors overflow-hidden"
                      >
                        <span className="block lg:w-33 w-30 md:w-33 lg:-ml-6 md:-ml-6 -ml-8 text-center truncate whitespace-nowrap">
                          {labelForSlot(slot)}
                        </span>
                        {/* <span className="ml-2 align-middle">▾</span> */}
                      </button>
                      {openDropdown === slot && (
                        <div className="absolute z-50 mt-2 w-[220px] max-h-48 overflow-auto rounded-2xl border-2 border-dotted border-black/60 bg-white/95 shadow -ml-8">
                          {optionsForSlot(slot).map((b) => (
                            <button
                              key={`${b.index}-${b.code}`}
                              onClick={() => handleSelect(slot, b)}
                              className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                            >
                              <div className="text-xs text-black truncate">
                                {b.projectData?.title || b.name}
                              </div>
                              <div className="text-[10px] text-gray-500 truncate">{b.code}</div>
                            </button>
                          ))}
                          {optionsForSlot(slot).length === 0 && (
                            <div className="px-3 py-2 text-xs text-gray-500">No options</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
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
                    onClick={async () => {
                      try {
                        if (prepareLoading) {
                          toast.info('Loading mint data...');
                          return;
                        }
                        if (prepareError || !prepareData) {
                          toast.error('Minting data unavailable');
                          return;
                        }
                        if (prepareData.seedCapReached) {
                          toast.error('Seed cap reached.');
                          return;
                        }
                        if (!prepareData.canMint) {
                          toast.error(prepareData.isLocked ? 'Factory locked. You are not authorized to create seeds.' : 'You are not authorized to create seeds.');
                          return;
                        }
                        if (!userEvmAddress) {
                          toast.info('Connect an EVM wallet to continue');
                          return;
                        }
                        // Collect 4 beneficiary indices
                        const indices = [1, 2, 3, 4].map((slot) => selectedBySlot[slot]?.index).filter((v) => typeof v === 'number') as number[];
                        if (indices.length !== 4) {
                          toast.error('Please select four beneficiaries');
                          return;
                        }

                        const contractAddress = prepareData.contractAddress as `0x${string}`;
                        const snapshotPriceEth = prepareData.defaultSnapshotPrice || '0.011';
                        const totalMinimumCostEth = prepareData.totalMinimumCost || snapshotPriceEth;
                        const location = 'berlin'; // default; could be user input later

                        const createSeedABI = [
                          {
                            type: 'function',
                            name: 'createSeed',
                            stateMutability: 'payable',
                            inputs: [
                              { name: 'seedReceiver', type: 'address' },
                              { name: 'snapshotPrice', type: 'uint256' },
                              { name: 'location', type: 'string' },
                              { name: 'beneficiaryIndexList', type: 'uint256[4]' }
                            ],
                            outputs: [{ name: 'seedId', type: 'uint256' }]
                          }
                        ] as const;

                        const data = encodeFunctionData({
                          abi: createSeedABI as any,
                          functionName: 'createSeed',
                          args: [
                            userEvmAddress as `0x${string}`,
                            parseEther(snapshotPriceEth),
                            location,
                            [
                              BigInt(indices[0]),
                              BigInt(indices[1]),
                              BigInt(indices[2]),
                              BigInt(indices[3])
                            ]
                          ]
                        });

                        const tx = await sendTransaction(
                          {
                            to: contractAddress,
                            value: parseEther(totalMinimumCostEth).toString(),
                            data
                          },
                          {
                            sponsor: true,
                            uiOptions: {
                              description: `Create a seed (min cost ${totalMinimumCostEth} ETH)`
                            }
                          }
                        );

                        toast.success('Transaction submitted');

                        // Optionally call seed-created webhook (without seedId until parsed elsewhere)
                        try {
                          const base = API_CONFIG.baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || '';
                          await fetch(`${base}/seed-created`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              creator: userEvmAddress,
                              recipient: userEvmAddress,
                              snapshotPrice: snapshotPriceEth,
                              beneficiaries: indices,
                              txHash: tx.hash,
                              timestamp: Math.floor(Date.now() / 1000)
                            })
                          });
                        } catch { }
                      } catch (e: any) {
                        console.error(e);
                        toast.error(e?.message || 'Failed to create seed');
                      }
                    }}
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
