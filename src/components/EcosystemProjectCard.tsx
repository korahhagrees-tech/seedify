/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import GardenHeader from "@/components/GardenHeader";
import { Switch } from "@/components/ui/switch";
import { assets } from "@/lib/assets";
import { useRouter } from "next/navigation";
import { formatArea } from "@/lib/utils";
import PaymentModal from "@/components/PaymentModal";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import {
  SnapshotMintResponse,
  WebhookData,
  retryWebhook,
  checkPendingRetries,
} from "@/lib/utils/snapshotMinting";
import { useSendTransaction } from "@privy-io/react-auth";
import { encodeFunctionData } from "viem";

interface EcosystemProjectCardProps {
  backgroundImageUrl: string;
  title: string;
  subtitle?: string;
  location?: string; // New: location from backend
  area?: string; // New: area from backend
  shortText: string;
  extendedText: string;
  ctaText?: string;
  seedEmblemUrl?: string;
  seedId?: string;
  beneficiaryCode?: string; // Add beneficiary code for snapshot minting
  beneficiaryIndex?: number; // Add beneficiary index for contract call
  snapshotPrice?: string; // Add snapshot price for dynamic payment modal
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
  location,
  area,
  shortText,
  extendedText,
  ctaText = "Tend Ecosystem",
  seedEmblemUrl,
  seedId,
  beneficiaryCode,
  beneficiaryIndex,
  snapshotPrice,
}: EcosystemProjectCardProps) {
  // Switch controls whether to show extended text (additive to short text)
  const [showExtended, setShowExtended] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>(""); // Amount user entered in modal
  const router = useRouter();
  const { walletAddress } = useAuth();
  const { sendTransaction } = useSendTransaction();

  // Create display subtitle with location and area
  const displaySubtitle =
    location && area
      ? `${location}\n${formatArea(area)}`
      : location || subtitle;

  // Check for pending webhook retries on component mount
  useState(() => {
    checkPendingRetries();
  });

  // Handle payment confirmation from modal
  const handlePaymentConfirm = async (amount: string) => {
    setPaymentAmount(amount);
    setShowPaymentModal(false);
    
    // PaymentModal now handles the transaction, so we just show success
    toast.success('Snapshot minted successfully!', { description: 'Your ecosystem has been tended.' });
  };

  // Handle snapshot minting
  const handleMintSnapshot = async (amountInEth: string) => {
    if (!seedId || beneficiaryIndex === undefined || !walletAddress) {
      toast.error("Cannot mint snapshot", {
        description: "Missing required data. Please try again.",
      });
      return;
    }

    setIsMinting(true);

    try {
      // Step 1: Get transaction data from backend with beneficiary index
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";
      const response = await fetch(
        `${apiBaseUrl}/write/snapshots/mint/${seedId}?beneficiaryIndex=${beneficiaryIndex}`
      );
      const mintData: SnapshotMintResponse = await response.json();

      if (!mintData.success) {
        toast.error("Failed to prepare snapshot", {
          description: "Please try again.",
        });
        setIsMinting(false);
        return;
      }

      toast.success("Transaction prepared", {
        description: "Confirm the transaction in your wallet...",
      });

      // Convert user's ETH amount to wei
      const amountInWei = (parseFloat(amountInEth) * 1e18).toString();

      // Step 2: Execute contract transaction using Privy's sendTransaction with gas sponsorship
      const txResult = await sendTransaction(
        {
          to: mintData.data.contractAddress,
          value: amountInWei, // USE USER'S AMOUNT, NOT BACKEND VALUE
          data: encodeFunctionData({
            abi: [
              {
                type: "function",
                name: "mintSnapshot",
                stateMutability: "payable",
                inputs: [
                  { name: "seedId", type: "uint256" },
                  { name: "beneficiaryIndex", type: "uint256" },
                  { name: "process", type: "string" },
                  { name: "to", type: "address" },
                  { name: "royaltyRecipient", type: "address" },
                ],
                outputs: [{ name: "", type: "uint256" }],
              },
            ],
            functionName: "mintSnapshot",
            args: [
              BigInt(mintData.data.args.seedId),
              BigInt(beneficiaryIndex),
              mintData.data.processId,
              walletAddress as `0x${string}`,
              mintData.data.args.royaltyRecipient as `0x${string}`,
            ],
          })
        },
        {
          sponsor: false // Enable gas sponsorship
        }
      );

      const txHash = txResult.hash;

      // Step 4: Prepare webhook data using backend-provided data
      const webhookData: WebhookData = {
        contractAddress: mintData.data.contractAddress,
        seedId: mintData.data.args.seedId,
        snapshotId: mintData.data.snapshotId,
        beneficiaryCode: mintData.data.beneficiaryCode || beneficiaryCode || "",
        beneficiaryDistribution: mintData.data.beneficiaryDistribution || 0,
        creator: walletAddress,
        txHash: txHash,
        timestamp: Math.floor(Date.now() / 1000),
        blockNumber: mintData.data.blockNumber,
        processId: mintData.data.processId,
      };

      toast.success("Transaction submitted", {
        description: "Processing snapshot...",
      });

      // Step 5: Call webhook with retry logic
      retryWebhook(
        webhookData,
        0,
        () => {
          setIsMinting(false);
          toast.success("Snapshot minted successfully!", {
            description: "Your ecosystem has been tended.",
          });
        },
        () => {
          setIsMinting(false);
          toast.error("Snapshot processing failed", {
            description: "Please try again.",
          });
        }
      );
    } catch (error) {
      setIsMinting(false);
      toast.error("Snapshot minting failed", {
        description: "Please try again.",
      });
      console.error("Minting error:", error);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
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
            "🌸 [IMAGE] Error loading background image, using placeholder"
          );
          const target = e.target as HTMLImageElement;
          if (target.src !== `${window.location.origin}/seeds/01__GRG.png`) {
            target.src = "/seeds/01__GRG.png";
          }
        }}
      />

      {/* Foreground content */}
      <div className="relative z-10 px-4 pt-2 pb-8">
        {/* Reuse the garden header */}
        <div className="max-w-md mx-auto">
          <GardenHeader logo={assets.text} />
        </div>

        {/* Card with cutout header */}
        <motion.div
          className="relative max-w-md mx-auto lg:-mt-12 md:-mt-14 mt-4 bg-white rounded-[60px] shadow-xl border-none border-black overflow-hidden h-[540px] lg:h-[660px] md:h-[660px] lg:scale-[0.8] md:scale-[0.8] scale-[1.0]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Division bar with background image */}
          <div className="relative h-4 -bottom-18 bg-white">
            <Image
              src={
                backgroundImageUrl && backgroundImageUrl.length > 0
                  ? backgroundImageUrl
                  : "/seeds/01__GRG.png"
              }
              alt=""
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (
                  target.src !== `${window.location.origin}/seeds/01__GRG.png`
                ) {
                  target.src = "/seeds/01__GRG.png";
                }
              }}
            />
          </div>

          {/* Header oval window that reveals background image */}
          <div className="relative h-28">
            {/* Four small circles around the oval */}
            <div className="absolute top-8 left-6 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={
                  backgroundImageUrl && backgroundImageUrl.length > 0
                    ? backgroundImageUrl
                    : "/seeds/01__GRG.png"
                }
                alt=""
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (
                    target.src !== `${window.location.origin}/seeds/01__GRG.png`
                  ) {
                    target.src = "/seeds/01__GRG.png";
                  }
                }}
              />
            </div>
            <div className="absolute top-24 left-3 -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={
                  backgroundImageUrl && backgroundImageUrl.length > 0
                    ? backgroundImageUrl
                    : "/seeds/01__GRG.png"
                }
                alt=""
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (
                    target.src !== `${window.location.origin}/seeds/01__GRG.png`
                  ) {
                    target.src = "/seeds/01__GRG.png";
                  }
                }}
              />
            </div>
            <div className="absolute top-8 right-3 -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={
                  backgroundImageUrl && backgroundImageUrl.length > 0
                    ? backgroundImageUrl
                    : "/seeds/01__GRG.png"
                }
                alt=""
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (
                    target.src !== `${window.location.origin}/seeds/01__GRG.png`
                  ) {
                    target.src = "/seeds/01__GRG.png";
                  }
                }}
              />
            </div>
            <div className="absolute bottom-4 right-0 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={
                  backgroundImageUrl && backgroundImageUrl.length > 0
                    ? backgroundImageUrl
                    : "/seeds/01__GRG.png"
                }
                alt=""
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (
                    target.src !== `${window.location.origin}/seeds/01__GRG.png`
                  ) {
                    target.src = "/seeds/01__GRG.png";
                  }
                }}
              />
            </div>

            {/* Oval mask container */}
            <div className="absolute left-1/2 top-16 -translate-x-1/2 -translate-y-1/2 w-[80%] h-34 rounded-[100px] overflow-hidden">
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
                  const target = e.target as HTMLImageElement;
                  if (
                    target.src !== `${window.location.origin}/seeds/01__GRG.png`
                  ) {
                    target.src = "/seeds/01__GRG.png";
                  }
                }}
              />
            </div>
          </div>

          {/* Text content - fixed-height card body */}
          <div className="px-5 mt-10">
            <h2 className="text-xl text-black text-center leading-tight peridia-display-light">
              {title}
            </h2>
            {displaySubtitle && (
              <div className="text-[10px] text-black/70 text-center mt-1 whitespace-pre-line">
                {displaySubtitle}
              </div>
            )}

            <div
              className="relative mt-4 text-[13px] leading-relaxed text-black/90 h-86 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              data-main-content
            >
              {/* Short text - always visible */}
              <div className="mb-34 whitespace-pre-line">{shortText}</div>

              {/* Extended text - completely hidden/shown like old code */}
              {showExtended && (
                <div
                  className="overflow-hidden whitespace-pre-line -mt-24 mb-34"
                  data-expanded-content
                >
                  {extendedText}
                </div>
              )}
            </div>
            {/* Bottom blur fade */}
            <div className="pointer-events-none absolute bottom-20 left-0 right-0 h-12 bg-white/40 backdrop-blur-xs opacity-70" />
          </div>

          {/* Footer with centered CTA and inverted switch next to it */}
          <div className="relative -px-6 py-4 flex items-center bg-white justify-center gap-4 lg:-mt-12 md:-mt-12 -mt-42">
            <Button
              variant="ghost"
              className="w-[70%] rounded-full border-1 border-black/40 text-black text-lg py-8 peridia-display flex flex-col disabled:opacity-50"
              onClick={() => setShowPaymentModal(true)}
              disabled={isMinting}
            >
              {isMinting ? (
                <>
                  <span className="text-2xl -mt-1">Minting</span>
                  <span className="text-2xl -mt-4">Snapshot...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl -mt-1">Tend </span>
                  <span className="text-2xl -mt-4">Ecosystem</span>
                </>
              )}
            </Button>
            {/* Inverted switch - toggles extended text visibility */}
            <div className="-rotate-90 scale-[1.8]">
              <Switch
                checked={!showExtended}
                onCheckedChange={(checked) => {
                  setShowExtended(!checked);
                  // Smooth scroll animation within the text container
                  setTimeout(() => {
                    const textContainer = document.querySelector("[data-main-content]");
                    if (textContainer) {
                      textContainer.scrollTo({
                        top: !checked ? textContainer.scrollHeight : 0,
                        behavior: "smooth"
                      });
                    }
                  }, 100);
                }}
                className="border-1 border-black/40 data-[state=checked]:bg-white data-[state=unchecked]:bg-[#D3C9DE] [&>span]:border-1 [&>span]:scale-[0.9] [&>span]:data-[state=checked]:bg-[#D3C9DE] [&>span]:data-[state=unchecked]:bg-white"
              />
            </div>
          </div>
        </motion.div>

        {/* Navigation circles - positioned on the card border */}
        <div className="relative max-w-md mx-auto -mt-[560px] md:-mt-[620px] lg:-mt-[620px] z-20 flex justify-center items-center gap-8">
          {/* Back Arrow - left side */}
          <button onClick={() => router.back()}>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
              <Image src="/arrow-left.svg" alt="Back" width={24} height={24} />
            </div>
          </button>

          {/* Seed emblem - right side */}
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md">
            {seedEmblemUrl && (
              <Image
                src={
                  seedEmblemUrl && seedEmblemUrl.length > 0
                    ? seedEmblemUrl
                    : assets.glowers
                }
                alt=""
                width={60}
                height={60}
                className="rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = assets.glowers;
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal - Now used for snapshot minting */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        seedId={seedId}
        amount={snapshotPrice ? parseFloat(snapshotPrice) : 0.011}
        onConfirm={handlePaymentConfirm}
        isSnapshotMint={true}
        beneficiaryIndex={beneficiaryIndex}
      />
    </div>
  );
}
