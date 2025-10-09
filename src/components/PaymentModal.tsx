/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePrivy } from '@privy-io/react-auth';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { prepareDepositToSeed } from "@/lib/api/services/writeService";
import { useWriteTransaction } from "@/lib/api/hooks/useWriteTransaction";
import { useAuth } from "@/components/auth/AuthProvider";
import Image from "next/image";
import { assets } from "@/lib/assets";
import { useBalance } from 'wagmi';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  seedId?: string;
  amount?: number;
  onConfirm?: (amount: string) => void; // Callback for snapshot minting
  isSnapshotMint?: boolean; // Flag to indicate snapshot minting mode
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  seedId = "1", 
  amount = 50,
  onConfirm,
  isSnapshotMint = false
}: PaymentModalProps) {
  const [email, setEmail] = useState("");
  const [amountInput, setAmountInput] = useState("0.011"); // Default ETH amount
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { authenticated, login } = usePrivy();
  const { execute } = useWriteTransaction();
  const { user, walletAddress } = useAuth();
  const router = useRouter();
  
  // Get ETH balance from wagmi
  const { data: balanceData } = useBalance({
    address: walletAddress as `0x${string}`,
  });
  
  const balance = balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0.0000';

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTransaction = async () => {
    // If this is snapshot mint mode, just pass the amount to the callback
    if (isSnapshotMint && onConfirm) {
      onConfirm(amountInput);
      return;
    }

    // For snapshot minting: "Confirm Contribution" button executes mintSnapshot logic
    // This is the NEW flow - the button triggers snapshot minting, not depositForSeed
    console.log('Confirm Contribution clicked - executing snapshot minting logic with amount:', amountInput);
    
    // Pass the user's entered amount to the callback for snapshot minting
    if (onConfirm) {
      onConfirm(amountInput);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 scale-[1.1]"
          >
            {/* State 1: Disconnected Wallet */}
            {!authenticated ? (
              <div className="bg-gray-200 rounded-[40px] p-8 max-w-sm w-full mx-auto relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                >
                  <span className="text-black text-lg font-bold">×</span>
                </button>
                
                {/* Header */}
                <h2 className="text-2xl text-black text-center mb-6 peridia-display-light">
                  Your Contribution
                </h2>

                {/* Informational Banner */}
                <div className="bg-white rounded-[20px] px-6 py-2 mb-6">
                  <p className="text-black text-center text-sm font-medium uppercase favorit-mono text-nowrap scale-[0.8] -ml-8">
                    YOU ARE ABOUT TO SPRING FORTH A NEW GROWTH
                  </p>
                </div>

                {/* Price and Allocation */}
                <div className="flex items-start gap-4 mb-6">
                  {/* Price */}
                  <div className="bg-white rounded-full px-4 py-2 border-1 border-black/40 flex-none scale-[0.8] -ml-4 -mt-6 w-[100px]">
                    <div className="text-black text-[10px] font-medium uppercase mb-1">PRICE</div>
                    <div className="text-black text-2xl font-bold break-all whitespace-normal leading-tight">{amountInput} ETH</div>
                  </div>

                  {/* Allocation Breakdown */}
                  <div className="flex-1 -ml-16 scale-[0.7] -mt-6">
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase mb-2">
                      50% SENT TO YOUR SELECTED ECOSYSTEM
                    </div>
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase mb-2">
                      20% ACCUMULATES AS SEED COMPOST
                    </div>
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase">
                      30% NURTURES THIS FLOURISHING
                    </div>
                  </div>
                </div>

                {/* Email Input with inside label */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white rounded-[20px] px-4 py-5 text-black text-sm border-1 border-black/30 outline-none placeholder:text-black/50"
                      placeholder="user@mail.com"
                    />
                    <span className="absolute left-4 top-2 text-black text-[10px] favorit-mono uppercase">ENTER YOUR EMAIL ADDRESS</span>
                  </div>
                </div>

                {/* Wallet Connect Button - Actually connects wallet */}
                <Button
                  onClick={async () => {
                    try {
                      if (authenticated) {
                        toast.success('Wallet already connected');
                      } else {
                        // Actually trigger wallet connection
                        await login();
                        toast.success('Wallet connected successfully!');
                      }
                    } catch (error) {
                      toast.error('Failed to connect wallet');
                      console.error('Wallet connection error:', error);
                    }
                  }}
                  className="w-full bg-gray-300 text-black text-sm font-medium py-4 rounded-[20px] hover:bg-gray-400 transition-colors"
                >
                  WALLET CONNECT
                </Button>
              </div>
            ) : (
              /* State 2: Connected Wallet */
              <div className="bg-[#D9D9D9] rounded-tl-[120px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[120px] p-6 border-3 border-dotted border-gray-600 shadow-xl max-w-sm w-full mx-auto relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors z-10"
                >
                  <span className="text-black text-lg font-bold">×</span>
                </button>
                
                {/* Header */}
                <h2 className="text-2xl text-black text-center mb-6 peridia-display-light">
                  Your Contribution
                </h2>

                {/* Wallet Details Section */}
                <div className="bg-white rounded-[40px] h-13 p-4 mb-6 border-1 border-black/60">
                  <p className="text-sm scale-[0.7] -ml-13 mb-1 -mt-4 font-light text-black">YOUR WALLET</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 -mt-2">
                      <span className="text-base font-mono text-black">
                        {formatAddress(walletAddress || '')}
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center justify-center transition-colors"
                      >
                        <Image src={assets.copy} alt="Copy" width={12} height={12} className="w-4 h-4" />
                      </button>
                      {copied && <span className="text-xs text-green-600">Copied!</span>}
                    </div>
                    <div className="bg-gray-100 px-3 scale-[0.8] -mt-3 py-1 rounded-lg">
                      <span className="text-base scale-[1.3] font-light text-[#64668B] -mt-4">{balance} ETH</span>
                    </div>
                  </div>
                </div>

                {/* Email and Actions Section */}
                <div className="space-y-4 mb-6 bg-white/60 p-4 rounded-[40px] -mt-14 h-32">
                  <div className="flex items-center gap-2 mt-4">
                    <Image src={assets.email} alt="Email" width={16} height={16} className="w-4 h-4" />
                    <span className="text-sm text-black">{user?.email || 'bilbo.bagz@shire.io'}</span>
                  </div>
                  <button className="w-full px-4 py-1 border border-gray-400 rounded-full text-base text-black hover:bg-gray-50 transition-colors peridia-display-light bg-[#E2E3F0] flex flex-col mt-3">
                    <span className="text-base scale-[1.05] font-light -mt-2">Add</span>
                    <span className="text-base scale-[1.05] font-light -mt-2 -mb-1">Funds</span>
                  </button>
                  <button className="w-full px-4 py-1 border-3 border-dotted border-black rounded-full text-sm text-black bg-[#E2E3F0] hover:bg-gray-50 transition-colors">
                    Wallet Connect
                  </button>
                </div>

                {/* Informational Banner - Different background */}
                <div className="bg-purple-200 rounded-[20px] px-6 py-2 mb-6">
                  <p className="text-black text-center text-sm font-medium uppercase favorit-mono text-nowrap scale-[0.8] -ml-8">
                    YOU ARE ABOUT TO SPRING FORTH A NEW GROWTH
                  </p>
                </div>

                {/* Price Input and Allocation */}
                <div className="flex items-start gap-4 mb-6">
                  {/* Price Input */}
                  <div className="bg-white rounded-full px-4 py-2 border-1 border-black/40 flex-none scale-[0.8] -ml-4 -mt-6 w-[100px]">
                    <div className="text-black text-[10px] font-medium uppercase mb-1">PRICE</div>
                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      className="text-black text-xl font-bold bg-transparent border-none outline-none w-full"
                      placeholder="0.011"
                    />
                    <div className="text-black text-xs font-medium uppercase">ETH</div>
                  </div>

                  {/* Allocation Breakdown */}
                  <div className="flex-1 -ml-16 scale-[0.7] -mt-6">
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase mb-2">
                      50% SENT TO YOUR SELECTED ECOSYSTEM
                    </div>
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase mb-2">
                      20% ACCUMULATES AS SEED COMPOST
                    </div>
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase">
                      30% NURTURES THIS FLOURISHING
                    </div>
                  </div>
                </div>

                {/* Email Input with inside label */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white rounded-[20px] px-4 py-5 text-black text-sm border-1 border-black/30 outline-none placeholder:text-black/50"
                      placeholder="user@mail.com"
                    />
                    <span className="absolute left-4 top-2 text-black text-[10px] favorit-mono uppercase">ENTER YOUR EMAIL ADDRESS</span>
                  </div>
                </div>

                {/* Confirm Contribution Button */}
                <Button
                  onClick={handleTransaction}
                  disabled={isProcessing}
                  className="w-full bg-gray-300 text-black text-sm font-medium py-4 rounded-[20px] hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      PROCESSING...
                    </div>
                  ) : (
                    "CONFIRM CONTRIBUTION"
                  )}
                </Button>

                {/* Mint Your Own Artwork text */}
                <p className="text-center text-xs text-black/70 mt-2">
                  MINT YOUR OWN ARTWORK
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
