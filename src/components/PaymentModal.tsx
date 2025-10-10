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
  const { authenticated, login, logout } = usePrivy();
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
              <div className="bg-gray-200 rounded-[40px] border-2 border-black border-dotted p-8 max-w-sm w-full mx-auto relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute -top-12 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                >
                  <span className="text-black text-lg font-bold">×</span>
                </button>
                
                {/* Header */}
                <h2 className="text-2xl text-black text-center -mt-6 peridia-display-light">
                  Your Contribution
                </h2>

                {/* Informational Banner */}
                <div className="bg-white rounded-[20px] px-6 py-0 border-1 border-black/40 mb-6 mt-4">
                  <p className="text-black text-center text-sm font-medium uppercase favorit-mono text-nowrap scale-[0.7] -ml-8">
                    YOU ARE ABOUT TO SPRING FORTH A NEW GROWTH
                  </p>
                </div>

                {/* Price and Allocation */}
                <div className="flex items-start gap-4 mb-6">
                  {/* Price */}
                  <div className="bg-white rounded-full px-4 py-4 border-1 border-black/40 flex-none scale-[0.6] -ml-8 -mt-8 w-[165px]">
                    <div className="text-black text-[12px] font-light text-center items-center uppercase -mt-4 mb-1">PRICE</div>
                    <div className="text-black text-2xl font-light break-all whitespace-normal leading-tight">{amountInput} ETH</div>
                  </div>

                  {/* Allocation Breakdown */}
                  <div className="flex-1 -ml-22 scale-[0.6] -mt-6">
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase -mt-1">
                      50% SENT TO SELECTED ECOSYSTEM
                    </div>
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase -mt-1">
                      20% ACCUMULATES AS SEED COMPOST
                    </div>
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase -mt-1">
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
                      className="w-full bg-white rounded-full px-4 py-3 text-black text-sm border-1 border-black/30 outline-none placeholder:text-black/50"
                      placeholder="user@mail.com"
                    />
                    <span className="absolute left-4 top-0 text-black text-[10px] favorit-mono uppercase">STAY IN TOUCH</span>
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
                  className="w-full bg-gray-300 text-white text-xl font-medium py-8 rounded-[20px] hover:bg-gray-400 transition-colors"
                >
                  WALLET CONNECT
                </Button>
              </div>
            ) : (
              /* State 2: Connected Wallet */
              <div className="bg-[#f4e9e9] rounded-tl-[120px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[120px] p-6 border-3 border-dotted border-gray-600 shadow-xl max-w-sm w-full mx-auto relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors z-10"
                >
                  <span className="text-black text-xl font-bold">×</span>
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
                <div className="space-y-4 mb-6 bg-white/60 p-4 rounded-[40px] -mt-14 h-26">
                  <div className="flex items-center gap-2 mt-4">
                    <Image src={assets.email} alt="Email" width={16} height={16} className="w-4 h-4" />
                    <span className="text-sm text-black">{user?.email || 'bilbo.bagz@shire.io'}</span>
                  <button
                    onClick={() => {
                      router.push('/wallet');
                    }}
                    className="w-48 px-8 py-0 -ml-4 mb-6 -mt-4 border-3 border-dotted border-gray-500 rounded-full text-xl text-black peridia-display-light bg-[#E2E3F0] hover:bg-gray-50 transition-colors scale-[0.7] text-nowrap"
                  >
                    A<span className="favorit-mono font-light text-nowrap">dd</span> F<span className="favorit-mono font-light text-nowrap">unds</span>
                  </button>
                  </div>
                    <button onClick={() => {
                      logout();
                      onClose();
                    }} className="flex items-center gap-2 text-sm text-black hover:text-gray-800 transition-colors -mt-6 -mb-3">
                      <Image src={assets.logout} alt="Logout" width={16} height={16} className="w-4 h-4" />
                      <span className="text-sm font-light text-nowrap">Log out</span>
                    </button>
                  <button className="w-[50%] px-4 py-1 text-nowrap border-2 border-dotted border-black rounded-full text-sm ml-40 -mt-34 text-black bg-white hover:bg-gray-50 transition-colors scale-[0.8]">
                    W<span className="favorit-mono font-light text-nowrap">allet</span> C<span className="favorit-mono font-light text-nowrap">onnect</span>
                  </button>
                </div>

                {/* Informational Banner - Different background */}
                <div className="bg-purple-200 rounded-[20px] px-6 py-0 mb-6 border-1 border-black/40">
                  <p className="text-black text-center text-sm font-medium uppercase favorit-mono text-nowrap scale-[0.7] -ml-8">
                    YOU ARE ABOUT TO SPRING FORTH A NEW GROWTH
                  </p>
                </div>

                {/* Price Input and Allocation */}
                <div className="flex items-start gap-4 mb-6">
                  {/* Price Input */}
                  <div className="bg-white rounded-full px-4 py-2 border-1 border-black/40 flex-none scale-[0.7] -ml-4 -mt-6 w-[165px]">
                    <div className="text-black text-[12px] font-medium uppercase mb-1 text-center">PRICE</div>
                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      className="text-black text-2xl font-light bg-transparent border-none outline-none w-full"
                      placeholder="0.011"
                    />
                    <div className="text-black text-2xl mr-2 text-right -mt-8 font-light uppercase">ETH</div>
                  </div>

                  {/* Allocation Breakdown */}
                  <div className="flex-1 -ml-20 scale-[0.65] -mt-4">
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase mb-2 -mt-2">
                      50% SENT TO SELECTED ECOSYSTEM
                    </div>
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase mb-2 -mt-2">
                      20% ACCUMULATES AS SEED COMPOST
                    </div>
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase -mt-2">
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
                      className="w-full bg-white rounded-full px-4 py-3 text-black text-sm border-1 border-black/30 outline-none mt-2 placeholder:text-black/50"
                      placeholder="user@mail.com"
                    />
                    <span className="absolute left-4 top-2 text-black text-[10px] favorit-mono uppercase">STAY IN TOUCH</span>
                  </div>
                </div>

                {/* Confirm Contribution Button */}
                <Button
                  onClick={handleTransaction}
                  disabled={isProcessing}
                  className="w-2/3 text-wrap bg-white border-2 border-dotted border-black ml-10 text-black text-sm font-medium py-6 rounded-full hover:bg-gray-100 transition-colors peridia-display-light disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      PROCESSING...
                    </div>
                  ) : (
                    <span className="text-nowrap text-base -mt-1 -mb-2">C<span className="favorit-mono font-light text-nowrap">onfrim</span><br /> C<span className="favorit-mono font-light text-nowrap -mt-2">ontribution</span></span>
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
