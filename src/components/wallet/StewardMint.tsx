/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { assets } from "@/lib/assets";
import { useWaitForTransactionReceipt } from "wagmi";
import { useSearchParams, useRouter } from "next/navigation";
import { API_CONFIG } from "@/lib/api/config";
import { useSendTransaction } from "@privy-io/react-auth";
import { encodeFunctionData, parseEther } from "viem";
import { toast } from "sonner";
import SeedCreationConfirmModal from "./SeedCreationConfirmModal";

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
  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<number | null>(null);
  const [selectedBySlot, setSelectedBySlot] = useState<Record<number, Beneficiary | null>>({
    1: null,
    2: null,
    3: null,
    4: null
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { sendTransaction } = useSendTransaction();

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.beneficiary-modal')) {
        setShowBeneficiaryModal(false);
        setCurrentSlot(null);
      }
    };

    if (showBeneficiaryModal) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showBeneficiaryModal]);

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
    // console.log(`[STEWARD-MINT] Selecting beneficiary ${b.name} for slot ${slot}`);
    setSelectedBySlot((prev) => {
      const newState = { ...prev, [slot]: b };
      // console.log(`[STEWARD-MINT] New selectedBySlot state:`, newState);
      return newState;
    });
    setOpenDropdown(null);
    setShowBeneficiaryModal(false);
    setCurrentSlot(null);
  };

  const handleBeneficiaryClick = (slot: number) => {
    setCurrentSlot(slot);
    setShowBeneficiaryModal(true);
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

  // Handle confirmation from modal with editable snapshot price and payable amount
  const handleConfirmMint = async (snapshotPrice: string, payableAmount: string) => {
    try {
      setShowConfirmModal(false);
      
      // console.log('[MINT] Confirming mint with values:', {
      //   snapshotPrice,
      //   payableAmount,
      //   snapshotPriceType: typeof snapshotPrice,
      //   payableAmountType: typeof payableAmount
      // });
      
      if (!userEvmAddress || !prepareData) {
        // toast.error('Missing required data');
        return;
      }

      // Collect 4 beneficiary indices
      const indices = [1, 2, 3, 4]
        .map((slot) => selectedBySlot[slot]?.index)
        .filter((v) => typeof v === 'number') as number[];
      
      if (indices.length !== 4) {
        // toast.error('Please select four beneficiaries');
        return;
      }

      const contractAddress = prepareData.contractAddress as `0x${string}`;
      const location = 'berlin';

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

      //  CRITICAL: Convert snapshot price from ETH to wei
      const snapshotPriceWei = parseEther(snapshotPrice);
      
      // console.log(' [MINT] Snapshot price conversion:', {
      //   inputEth: snapshotPrice,
      //   outputWei: snapshotPriceWei.toString(),
      //   exampleCheck: `${snapshotPrice} ETH = ${snapshotPriceWei.toString()} wei`
      // });

      const data = encodeFunctionData({
        abi: createSeedABI as any,
        functionName: 'createSeed',
        args: [
          userEvmAddress as `0x${string}`,
          snapshotPriceWei, //  Now using user's editable value in wei
          location,
          [
            BigInt(indices[0]),
            BigInt(indices[1]),
            BigInt(indices[2]),
            BigInt(indices[3])
          ]
        ]
      });

      //  CRITICAL: Use the user's payable amount directly as a string
      // No conversion, no parseEther, just pass the value as the user entered it
      // console.log(' [MINT] Using payable amount directly:', {
      //   payableAmount,
      //   payableAmountType: typeof payableAmount
      // });
      
      // Pass the payable amount directly as a string - no conversion needed
      const valueToSend = parseEther(payableAmount);
      
      // console.log(' [MINT] Transaction details:', {
      //   to: contractAddress,
      //   value: valueToSend,
      //   payableAmountEth: payableAmount,
      //   breakdown: {
      //     snapshotPriceEth: snapshotPrice,
      //     seedPriceEth: prepareData.seedPrice,
      //     userPayableEth: payableAmount
      //   },
      //   snapshotPriceWei: snapshotPriceWei.toString(),
      //   beneficiaries: indices
      // });
      
      // toast.info('Please confirm transaction in your wallet...');
      
      // console.log(' [MINT] About to send transaction:', {
      //   to: contractAddress,
      //   value: valueToSend,
      //   valueLength: valueToSend,
      //   dataLength: data.length
      // });

      const tx = await sendTransaction(
        {
          to: contractAddress,
          value: valueToSend,
          data
        },
        {
          sponsor: false,
          uiOptions: {
            description: `Create a seed (cost ${payableAmount} ETH)`,
            buttonText: 'Create Seed',
            transactionInfo: {
              title: 'Seed Creation',
              action: 'Create New Seed',
              contractInfo: {
                name: 'Way of Flowers Seed Factory',
                url: 'https://wayofflowers.com'
              }
            },
            successHeader: 'Seed Created!',
            successDescription: 'Your seed has been successfully created on the blockchain.'
          },
          address: userEvmAddress
        }
      );

          // console.log(' [MINT] Transaction hash:', tx.hash);
          // toast.success('Seed creation transaction submitted!');
          setTxHash(tx.hash);
          
          // Step 4: Verify transaction status before proceeding
          // console.log(' [MINT] Verifying transaction status for hash:', tx.hash);
          // toast.info('Verifying transaction... Please wait.');

          // Poll transaction status with retries
          let transactionStatus = null;
          const maxAttempts = 20; // 20 attempts = ~2 minutes max wait
          let attempts = 0;
          const apiBaseUrl = API_CONFIG.baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

          while (attempts < maxAttempts && !transactionStatus) {
            try {
              await new Promise(resolve => setTimeout(resolve, 6000)); // Wait 6 seconds between attempts
              
              const statusResponse = await fetch(`${apiBaseUrl}/transactions/${tx.hash}/status`);
              
              if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                // console.log(' [MINT] Transaction status response:', statusData);

                if (statusData.success && statusData.transaction) {
                  const status = statusData.transaction.status;
                  
                  if (status === 'success') {
                    // console.log(' [MINT] Transaction confirmed as successful');
                    transactionStatus = statusData.transaction;
                    break;
                  } else if (status === 'reverted') {
                    console.error('[MINT] Transaction reverted:', statusData.transaction.revertReason);
                    // toast.error('Transaction failed and reverted. Please try again.');
                    setTransactionStatus("failed");
                    return; // Exit early - do not proceed with routing
                  } else {
                    // console.log('[MINT] Transaction status pending, continuing to poll...');
                  }
                }
              }
              
              attempts++;
            } catch (error) {
              console.warn(` [MINT] Status check attempt ${attempts + 1} failed:`, error);
              attempts++;
            }
          }

          // Check if we timed out without getting a success status
          if (!transactionStatus) {
            console.error('[MINT] Transaction verification timed out');
            // toast.error('Transaction verification timed out. Please check your wallet.');
            setTransactionStatus("failed");
            return; // Exit early - do not proceed
          }

          // Transaction verified as successful, call webhook
          try {
            const base = API_CONFIG.baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || '';
            await fetch(`${base}/seed-created`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                creator: userEvmAddress,
                recipient: userEvmAddress,
                snapshotPrice: snapshotPrice,
                beneficiaries: indices,
                txHash: tx.hash,
                timestamp: Math.floor(Date.now() / 1000),
                // Add verified transaction data
                transactionStatus: transactionStatus.status,
                gasUsed: transactionStatus.gasUsed || '0',
                effectiveGasPrice: transactionStatus.effectiveGasPrice || '0',
                blockNumber: transactionStatus.blockNumber || '0'
              })
            });
            // console.log(' [MINT] Webhook called successfully');
          } catch (webhookError) {
            console.warn(' [MINT] Webhook call failed:', webhookError);
          }

          // Transaction completed successfully - route to wallet page
          // console.log('[MINT] Seed creation completed successfully!');
          // toast.success('Seed created successfully! Redirecting to wallet...');
          
          // Route to wallet page
          setTimeout(() => {
            router.push('/wallet');
          }, 2000); // Give user time to see success message
      
    } catch (error: any) {
      console.error('[MINT] Transaction failed:', error);
      if (error?.message?.includes('User rejected')) {
        // toast.error('Transaction rejected');
      } else {
        // toast.error(error?.message || 'Transaction failed. Please try again.');
      }
    }
  };

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
          // console.log(
          //   " [IMAGE] Error loading WayOfFlowers background image, using placeholder"
          // );
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
            className="relative bg-transparent rounded-[40px] shadow-2xl overflow-hidden border-4 border-dotted border-white/70 h-[590px] lg:h-[750px] md:h-[750px]"
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
                className="object-contain lg:scale-[1.0] md:scale-[1.0] scale-[1.1] lg:-mt-2 md:-mt-2 mt-6"
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
                        // console.log(
                        //   " [IMAGE] Error loading beneficiary image, using placeholder"
                        // );
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
                <div className="-mt-6 lg:-mt-8 md:-mt-8 text-black font-bold text-base lg:scale-[0.55] md:scale-[0.55] scale-[0.55]">
                  <Image
                    src={assets.chooseBeneficiary}
                    alt="Choose four beneficiaries"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Four individual beneficiary dropdowns section */}
              <div className="-mb-16 lg:-mb-30 md:-mb-16 -px-12 lg:scale-[0.98] md:scale-[0.95] scale-[0.90] lg:mt-1 md:-mt-1 -mt-1">
                <div className="grid grid-cols-2 gap-4 mt-12 lg:mt-14 md:mt-12 mb-9">
                  {/* Beneficiary 01 */}
                  <div className="relative">
                    <button
                      onClick={() => handleBeneficiaryClick(1)}
                      className="w-full px-8 py-0 rounded-full border-2 border-dotted border-black/70 bg-[#F0ECF3] text-black text-sm font-medium peridia-display-light hover:bg-white/90 transition-colors overflow-hidden -ml-4"
                    >
                      <span className="block text-center truncate whitespace-nowrap scale-[0.8] lg:scale-[1.0] md:scale-[1.0] -ml-8 lg:-ml-4 md:-ml-4">
                        {labelForSlot(1)}
                      </span>
                    </button>
                  </div>

                  {/* Beneficiary 02 */}
                  <div className="relative">
                    <button
                      onClick={() => handleBeneficiaryClick(2)}
                      className="w-full px-8 py-0 rounded-full border-2 border-dotted border-black/70 bg-[#F0ECF3] text-black text-sm font-medium peridia-display-light hover:bg-white/90 transition-colors overflow-hidden ml-4"
                    >
                      <span className="block text-center truncate whitespace-nowrap scale-[0.8] lg:scale-[1.0] md:scale-[1.0] -ml-8 lg:-ml-4 md:-ml-4">
                        {labelForSlot(2)}
                      </span>
                    </button>
                  </div>

                  {/* Beneficiary 03 */}
                  <div className="relative">
                    <button
                      onClick={() => handleBeneficiaryClick(3)}
                      className="w-full px-8 py-0 rounded-full border-2 border-dotted border-black/70 bg-[#F0ECF3] text-black text-sm font-medium peridia-display-light hover:bg-white/90 transition-colors overflow-hidden -ml-4"
                    >
                      <span className="block text-center truncate whitespace-nowrap scale-[0.8] lg:scale-[1.0] md:scale-[1.0] -ml-8 lg:-ml-4 md:-ml-4">
                        {labelForSlot(3)}
                      </span>
                    </button>
                  </div>

                  {/* Beneficiary 04 */}
                  <div className="relative">
                    <button
                      onClick={() => handleBeneficiaryClick(4)}
                      className="w-full px-8 py-0 rounded-full border-2 border-dotted border-black/70 bg-[#F0ECF3] text-black text-sm font-medium peridia-display-light hover:bg-white/90 transition-colors overflow-hidden ml-4"
                    >
                      <span className="block text-center truncate whitespace-nowrap scale-[0.8] lg:scale-[1.0] md:scale-[1.0] -ml-8 lg:-ml-4 md:-ml-4">
                        {labelForSlot(4)}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-black text-sm -mt-4 mb-4">
                    <p className="text-black text-nowrap text-sm">Thank you for becoming a <span className="peridia-display-light">Seed Steward.</span></p>
                  </div>
                  <div className="text-black lg:text-[13px] md:text-[13px] text-[11px] scale-[1.1] lg:scale-[1.0] md:scale-[1.0] -mt-2 lg:-mt-1 md:-mt-1">
                    <p className="">
                      Your support weaves verified conservation with synthetic botanical intelligence, creating digital flora that blooms <p>through authentic environmental care.</p>
                      </p>
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
                    onClick={() => {
                      // Pre-flight checks before showing modal
                      // console.log('[MINT] Mint button clicked');

                      if (prepareLoading) {
                        // toast.info('Loading mint data...');
                        return;
                      }
                      if (prepareError || !prepareData) {
                        // toast.error('Minting data unavailable');
                        return;
                      }
                      if (prepareData.seedCapReached) {
                        // toast.error('Seed cap reached.');
                        return;
                      }
                      if (!prepareData.canMint) {
                        // toast.error(prepareData.isLocked ? 'Factory locked. You are not authorized to create seeds.' : 'You are not authorized to create seeds.');
                        return;
                      }
                      if (!userEvmAddress) {
                        // toast.info('Connect an EVM wallet to continue');
                        return;
                      }
                      
                      // Check 4 beneficiaries selected
                      const indices = [1, 2, 3, 4]
                        .map((slot) => selectedBySlot[slot]?.index)
                        .filter((v) => typeof v === 'number') as number[];
                      
                      if (indices.length !== 4) {
                        // toast.error('Please select four beneficiaries');
                        return;
                      }

                      // All checks passed - open confirmation modal
                      setShowConfirmModal(true);
                    }}
                    className="mt-48 lg:mt-44 md:mt-44 mb-9 px-8 py-3 rounded-full border-2 border-dotted border-white/70 text-white text-xl font-medium bg-transparent hover:bg-white/20 transition-all duration-300 peridia-display scale-[0.7] lg:scale-[1.0] md:scale-[1.0]"
                  >
                    <p className="text-white text-2xl scale-[1.1] lg:scale-[1.2] md:scale-[0.9] font-medium">MINT</p>
                  </button>
                </motion.div>

                {/* Confirmation Modal */}
                <div className="-mt-10 lg:-mt-10 md:-mt-25">
                  <SeedCreationConfirmModal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={handleConfirmMint}
                    selectedBeneficiaries={[1, 2, 3, 4]
                      .map((slot) => selectedBySlot[slot])
                      .filter((b): b is Beneficiary => b !== null)}
                    recipientAddress={userEvmAddress || ''}
                    seedPrice={prepareData?.seedPrice || '0'}
                    seedFee={prepareData?.seedFee || '0'}
                    totalCost={prepareData?.totalMinimumCost || '0'}
                    defaultSnapshotPrice={prepareData?.defaultSnapshotPrice || '0.011'}
                  />
                </div>

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

      {/* Beneficiary Selection Modal */}
      <AnimatePresence>
        {showBeneficiaryModal && currentSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg"
            onClick={() => {
              setShowBeneficiaryModal(false);
              setCurrentSlot(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="beneficiary-modal relative w-full max-w-2xl mx-4 max-h-[80vh] bg-white/95 backdrop-blur-lg scale-[0.8] lg:scale-[0.8] md:scale-[0.8] rounded-3xl border-4 border-dotted border-black/60 shadow-2xl overflow-hidden -mt-24 lg:-mt-24 md:-mt-44"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200/50">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-black peridia-display">
                    Select Beneficiary {String(currentSlot).padStart(2, '0')}
                  </h2>
                  <p className="text-gray-600 text-sm mt-2">
                    Choose from the available beneficiaries
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-3">
                  {optionsForSlot(currentSlot).map((b) => (
                    <button
                      key={`${b.index}-${b.code}`}
                      onClick={() => handleSelect(currentSlot, b)}
                      className="w-full text-left p-4 rounded-2xl border-2 border-dotted border-gray-300 hover:border-black/60 hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Beneficiary Image */}
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                          <Image
                            src={b.projectData?.backgroundImage || "/project_images/01__GRG.png"}
                            alt=""
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/project_images/01__GRG.png";
                            }}
                          />
                        </div>

                        {/* Beneficiary Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-semibold text-black truncate group-hover:text-gray-800">
                            {b.projectData?.title || b.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {b.code}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Index: {b.index}
                          </div>
                        </div>

                        {/* Selection Indicator */}
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0 group-hover:border-black/60 transition-colors">
                          {selectedBySlot[currentSlot]?.index === b.index && (
                            <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}

                  {optionsForSlot(currentSlot).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No beneficiaries available
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200/50 -mt-14">
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setShowBeneficiaryModal(false);
                      setCurrentSlot(null);
                    }}
                    className="px-8 py-3 rounded-full border-2 border-dotted border-black/60 bg-transparent text-black hover:bg-black/10 transition-colors peridia-display-light"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
