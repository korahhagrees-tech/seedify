/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePrivy } from '@privy-io/react-auth';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { prepareDepositToSeed } from "@/lib/api/services/writeService";
import { useWriteTransaction } from "@/lib/api/hooks/useWriteTransaction";
import { useAuth } from "@/components/auth/AuthProvider";
import { clearAppStorage } from "@/lib/auth/logoutUtils";
import Image from "next/image";
import { assets } from "@/lib/assets";
import { useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useSendTransaction, useWallets, useFundWallet } from "@privy-io/react-auth";
import { encodeFunctionData } from "viem";
import { SNAPSHOT_NFT_ABI, SNAP_FACTORY_ABI } from "@/lib/contracts";
import { base } from "viem/chains";
import WalletConnectionModal from "@/components/wallet/WalletConnectionModal";

// Contract addresses for conditional ABI logic
const SNAP_FACTORY_ADDRESS = "0x038cC19fF06F823B2037C7EFF239bE99aD99A01D"; // Uses mintSnapshot with royaltyRecipient
const SNAPSHOT_NFT_ADDRESS = "0x5203D3C460ba2d0156c97D8766cCE70b69eDd3A6"; // Uses mintSnapshot with projectCode

interface HarvestSeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  seedId?: string;
  stats?: {
    nutrientReserve: string;
    mintingDate: string;
    totalCommitted: string;
    currentClaimable: string;
    maturationDate: string;
    prematurePenalty: string;
  };
}

export default function HarvestSeedModal({
  isOpen,
  onClose,
  seedId = "1",
  stats = {
    nutrientReserve: "2.826 ETH",
    mintingDate: "02/09/2025",
    totalCommitted: "1.100 ETH",
    currentClaimable: "0.753 ETH",
    maturationDate: "02/09/2029",
    prematurePenalty: "2.067 ETH"
  }
}: HarvestSeedModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showWalletConnection, setShowWalletConnection] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(stats.currentClaimable);
  const { ready, authenticated, login, logout } = usePrivy();
  const { execute } = useWriteTransaction();
  const { user, walletAddress, wallets: contextWallets, activeWallet, linkedAccounts } = useAuth();
  const router = useRouter();
  const { sendTransaction } = useSendTransaction();

  // Update withdrawal amount when stats change
  useEffect(() => {
    if (stats.currentClaimable) {
      setWithdrawalAmount(stats.currentClaimable);
    }
  }, [stats.currentClaimable]);

  const { wallets: privyWallets } = useWallets();
  const { writeContractAsync } = useWriteContract();
  const { fundWallet } = useFundWallet();

  // Use wallets from context (Zustand store) or fallback to Privy wallets
  const wallets = contextWallets.length > 0 ? contextWallets : privyWallets;

  // Get ETH balance from wagmi
  const { data: balanceData } = useBalance({
    address: walletAddress as `0x${string}`,
  });

  const balance = balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0.0000';

  // Helper function to convert wei to ETH
  const weiToEth = (value: string) => {
    const wei = parseFloat(value);
    const eth = wei / 1e18;
    return eth.toFixed(6);
  };

  // Parse ETH values that might be in wei format
  const parseEthValue = (value: string) => {
    // Remove "ETH" suffix if present and parse as number
    const numStr = value.replace(' ETH', '');
    const num = parseFloat(numStr);
    // If the number is very large (> 1000), it's likely in wei
    if (num > 1000) {
      return weiToEth(num.toString());
    }
    return numStr; // Return as is if already in ETH
  };

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

  const handleWalletConnect = () => {
    setShowWalletConnection(true);
  };

  const handleAddFunds = async () => {
    if (walletAddress) {
      try {
        // Use Privy's fundWallet with Base chain (same logic as WalletModal)
        await fundWallet({
          address: walletAddress,
          options: {
            chain: base,
          }
        });
      } catch (error) {
        console.error('Failed to fund wallet:', error);
        toast.error('Failed to open funding flow');
      }
    }
  };

  const handleHarvest = async () => {
    setIsProcessing(true);

    try {
      if (!ready) {
        // toast.info('Setting up wallet... Please wait.');
        setIsProcessing(false);
        return;
      }
      if (!authenticated) {
        // toast.info('Please connect your wallet to continue.');
        setIsProcessing(false);
        setShowWalletConnection(true);
        return;
      }
      // Use activeWallet from context (Zustand store), fallback to first wallet
      const currentActiveWallet = activeWallet || wallets[0];
      if (!currentActiveWallet) {
        // toast.error("No active wallet found. Please connect your wallet.");
        setIsProcessing(false);
        return;
      }

      // Show withdrawal modal
      setShowWithdrawalModal(true);
      setIsProcessing(false);

    } catch (error) {
      console.error('Harvest failed:', error);
      // toast.error('Harvest failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    setIsProcessing(true);

    try {
      // Defensive checks for wallet functionality
      if (!ready) {
        // toast.info('Setting up wallet... Please wait.');
        setIsProcessing(false);
        return;
      }
      if (!authenticated) {
        // toast.info('Please connect your wallet to continue.');
        setIsProcessing(false);
        return;
      }
      if (!activeWallet) {
        // toast.error("No active wallet found. Please connect your wallet.");
        setIsProcessing(false);
        return;
      }

      // TODO: Implement actual withdrawal logic here
      console.log('Withdrawing:', withdrawalAmount);

      // For now, just show success
      // toast.success('Withdrawal processed successfully!');
      setShowWithdrawalModal(false);
      onClose();

    } catch (error) {
      console.error('Withdrawal failed:', error);
      // toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="harvest-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="harvest-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:scale-[0.75] md:scale-[0.75] scale-[0.8] h-10 w-[460px] lg:w-full md:w-full -ml-8 lg:-ml-0 md:-ml-0 mt-94 lg:mt-88 md:mt-80"
          >
            {/* State 1: Disconnected Wallet */}
            {!authenticated ? (
              <div className="bg-[#D9D9D9] rounded-[60px] border-2 border-black border-dotted p-8 max-w-sm w-full mx-auto relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute -top-12 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                >
                  <span className="text-black text-lg font-bold">×</span>
                </button>

                {/* Header */}
                <h2 className="text-2xl text-black text-center -mt-6 peridia-display-light scale-[0.9] lg:scale-[1.1] md:scale-[1.1]">
                  <span className="peridia-display-light">H</span>arvest <span className="peridia-display-light">S</span>eed <span className="peridia-display-light">N</span>utrients
                </h2>

                {/* Wallet Connect Button */}
                <Button
                  onClick={async () => {
                    try {
                      if (authenticated) {
                        // toast.success('Wallet already connected');
                      } else {
                        await login();
                        // toast.success('Wallet connected successfully!');
                      }
                    } catch (error) {
                      // toast.error('Failed to connect wallet');
                      console.error('Wallet connection error:', error);
                    }
                  }}
                  className="w-full bg-gray-300 text-white text-xl font-medium py-8 rounded-[20px] hover:bg-gray-400 transition-colors mt-8"
                >
                  WALLET CONNECT
                </Button>
              </div>
            ) : (
              /* State 2: Connected Wallet - Harvest Modal */
              <div className="bg-[#D9D9D9] rounded-[60px] border-2 border-black border-dotted p-8 max-w-lg w-full mx-auto relative shadow-xl h-[670px] overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-8 right-8 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-10"
                >
                  <span className="text-black text-xl font-bold">×</span>
                </button>

                {/* Header */}
                <h2 className="text-2xl text-black text-center mb-3 scale-[0.8] lg:scale-[1.0] md:scale-[0.9]">
                  <span className="peridia-display-light">H</span>arvest <span className="peridia-display-light">S</span>eed <span className="peridia-display-light">N</span>utrients
                </h2>

                {/* Wallet Details Section */}
                <div className="bg-none rounded-[20px] p-4 mb-1 relative left-0 right-auto">
                  <div className="bg-white border border-black/70 rounded-full p-2 w-[350px] lg:w-[450px] md:w-[450px] mb-3 -ml-8 z-20 py-3 lg:py-4 md:py-4 relative left-0 right-auto">
                    <p className="text-[11px] lg:text-[11px] md:text-[11px] text-nowrap text-black font-medium -mb-2 ml-4 relative left-0 right-auto -top-2 lg:-top-2 md:-top-2">YOUR WALLET</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 relative left-4 lg:left-8 md:left-6 right-auto scale-[0.9] lg:scale-[1.5] md:scale-[1.3]">
                        <span className="text-base font-mono text-black ml-4">
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
                      <div className="bg-[#F1F2F9] px-3 py-1 rounded-lg ">
                        <span className="text-base font-light text-gray-700">{balance} ETH</span>
                      </div>
                    </div>
                  </div>

                  {/* Email and Actions */}
                  <div className="bg-[#cdc9c9] rounded-[40px] p-2 w-[350px] lg:w-[450px] md:w-[450px] mb-2 -ml-8 -mt-8 py-4 relative left-4 lg:left-2 md:left-2 right-auto">
                    <div className="flex items-center gap-2 mt-2 lg:mt-4 md:mt-4 relative left-2 lg:left-4 md:left-3 right-auto">
                      <Image src={assets.email} alt="Email" width={16} height={16} className="w-4 h-4 relative left-0 right-auto" />
                      <span className="text-lg text-black relative left-0 right-auto">{user?.email || formatAddress(walletAddress || '')}</span>
                    </div>

                    <div className="flex gap-2 mt-1 relative left-0 right-auto">
                      <button
                        onClick={async () => {
                          onClose();
                          clearAppStorage();
                          await logout();
                          setTimeout(() => {
                            window.location.href = "/";
                          }, 100);
                        }}
                        className="flex items-center gap-2 px-4 py-0 h-8 text-lg text-black hover:text-gray-800 transition-colors text-nowrap relative left-0 right-auto"
                      >
                        <Image src={assets.logout} alt="Logout" width={16} height={16} className="w-4 h-4 relative left-0 right-auto" />
                        Log out
                      </button>
                      <button
                        onClick={handleAddFunds}
                        className="px-8 py-0 lg:py-0 md:py-0 h-8 border-2 border-dotted border-gray-500 rounded-full text-base text-black bg-gray-300 hover:bg-gray-100 transition-colors text-nowrap relative left-18 lg:left-44 md:left-40 -top-16 lg:-top-12 md:-top-14 right-auto z-50"
                      >
                        <div className="scale-[0.6] lg:scale-[1.2] md:scale-[0.8] relative left-0 right-auto">
                          <span className="peridia-display relative left-0 right-auto">A</span>dd <span className="peridia-display relative left-0 right-auto">F</span>unds
                        </div>
                      </button>
                      <button
                        onClick={handleWalletConnect}
                        className="px-4 py-1 border-2 border-dotted border-black rounded-full text-sm h-6 lg:h-8 md:h-8 text-black bg-white hover:bg-gray-50 transition-colors relative left-0 lg:left-0 md:-left-3 right-auto text-nowrap"
                      >
                        <div className="scale-[0.6] lg:scale-[1.1] md:scale-[0.8] relative left-0 right-auto">
                          <span className="peridia-display relative left-0 right-auto">W</span>allet <span className="peridia-display relative left-0 right-auto">C</span>onnect
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* SeedId Current Maturation Overview Bar */}
                <div className="bg-gray-100 rounded-tl-[30px] rounded-tr-[30px] rounded-bl-[20px] rounded-br-[20px] px-6 py-1 mb-2 border-3 border-dotted border-black relative left-0 right-auto">
                  <p className="text-black text-nowrap text-center text-[13px] lg:text-[13px] md:text-[13px] scale-[0.8] lg:scale-[1.6] md:scale-[1.5] font-medium relative left-0 right-auto">
                    Seed {seedId} <span className="peridia-display relative left-0 right-auto">current maturation overview.</span>
                  </p>
                </div>

                {/* Six Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {/* Row 1 */}
                  <div className="text-center relative left-0 right-auto">
                    <p className="text-[10px] text-gray-600 mb-1 relative left-0 right-auto">NUTRIENT RESERVE</p>
                    <div className="bg-gray-100 rounded-full px-2 py-1 relative left-0 right-auto">
                      <span className="text-xs font-medium text-black relative left-0 right-auto">{parseEthValue(stats.nutrientReserve)} ETH</span>
                    </div>
                  </div>
                  <div className="text-center relative left-0 right-auto">
                    <p className="text-[10px] text-gray-600 mb-1 relative left-0 right-auto">MINTING DATE</p>
                    <div className="bg-gray-100 rounded-full px-2 py-1 relative left-0 right-auto">
                      <span className="text-xs font-medium text-black relative left-0 right-auto">{stats.mintingDate}</span>
                    </div>
                  </div>
                  <div className="text-center relative left-0 right-auto">
                    <p className="text-[10px] text-gray-600 mb-1 relative left-0 right-auto">TOTAL COMMITTED</p>
                    <div className="bg-gray-100 rounded-full px-2 py-1 relative left-0 right-auto">
                      <span className="text-xs font-medium text-black relative left-0 right-auto">{stats.totalCommitted}</span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="text-center relative left-0 right-auto">
                    <p className="text-[10px] text-gray-600 mb-1 relative left-0 right-auto">CURRENT CLAIMABLE</p>
                    <div className="bg-gray-100 rounded-full px-2 py-1 relative left-0 right-auto">
                      <span className="text-xs font-medium text-black relative left-0 right-auto">{stats.currentClaimable}</span>
                    </div>
                  </div>
                  <div className="text-center relative left-0 right-auto">
                    <p className="text-[10px] text-gray-600 mb-1 relative left-0 right-auto">MATURATION DATE</p>
                    <div className="bg-gray-100 rounded-full px-2 py-1 relative left-0 right-auto">
                      <span className="text-xs font-medium text-black relative left-0 right-auto">{stats.maturationDate}</span>
                    </div>
                  </div>
                  <div className="text-center relative left-0 right-auto">
                    <p className="text-[10px] text-gray-600 mb-1 relative left-0 right-auto">PREMATURE PENALTY</p>
                    <div className="bg-gray-100 rounded-full px-2 py-1 relative left-0 right-auto">
                      <span className="text-xs font-medium text-black relative left-0 right-auto">{stats.prematurePenalty}</span>
                    </div>
                  </div>
                </div>

                {/* Thank You Message with Harvest Button */}
                <div className="mb-2 relative left-0 right-auto">
                  <div className="flex items-start justify-between gap-4">
                      <p className="text-lg lg:text-[18px] md:text-[18px] text-black leading-tight relative left-0 right-auto peridia-display-light">
                        We Thank You & Appreciate You for nurturing
                      </p>
                    </div>
                  <div className="flex items-start justify-between gap-4">
                    {/* Left side - three lines */}
                    <div className="flex flex-col text-left relative left-0 right-auto">
                      <p className="text-lg lg:text-[18px] md:text-[18px] text-black leading-tight relative left-0 right-auto peridia-display-light">The Way of Flowers</p>
                      <p className="text-lg lg:text-[18px] md:text-[18px] text-black leading-tight relative left-0 right-auto peridia-display-light">& many precious</p>
                      <p className="text-lg lg:text-[18px] md:text-[18px] text-black leading-tight relative left-0 right-auto peridia-display-light">ecosystems with us!</p>
                    </div>
                    
                    {/* Right side - long thank you text */}
                    <div className="text-right relative left-0 right-auto">
                      {/* Harvest Button */}
                      <div className="mt-2 relative left-0 right-auto scale-[0.9] lg:scale-[1.3] md:scale-[1.3] top-4 lg:top-4 md:top-4">
                        <Button
                          onClick={handleHarvest}
                          disabled={isProcessing}
                          className="bg-white border-2 border-dotted border-black text-black text-xs font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 relative left-0 lg:-left-6 md:-left-4 right-auto"
                        >
                          {isProcessing ? (
                            <div className="flex items-center justify-center gap-2 relative left-0 right-auto">
                              <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin relative left-0 right-auto"></div>
                              PROCESSING...
                            </div>
                          ) : (
                            <div className="scale-[0.7] lg:scale-[1.3] md:scale-[1.3] relative left-0 right-auto">
                              <p className="peridia-display relative left-0 right-auto top-1 lg:top-1 md:top-1">H<span className="favorit-mono relative left-0 right-auto">arvest</span></p>
                              <p className="peridia-display relative left-0 right-auto -top-1 lg:-top-1 md:-top-1">N<span className="favorit-mono relative left-0 right-auto">utrients</span></p>
                            </div>
                          )}
                        </Button>
                        <div className="relative left-0 right-auto scale-[0.6] lg:scale-[0.7] md:scale-[0.7] -top-1 lg:-top-1 md:-top-1">
                        <p className="text-[9px] lg:text-[11px] md:text-[11px] text-gray-600 mt-1 relative left-0 right-auto">WITHDRAW CLAIMABLE NUTRIENTS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning and Redirection */}
                <div className="text-center relative left-0 right-auto scale-[0.9] lg:scale-[1.45] md:scale-[1.45] mt-10 lg:mt-10 md:mt-10 mb-2 lg:mb-2 md:mb-2">
                  <p className="text-[9px] text-[#7E3EA8] mb-1 relative left-0 right-auto">
                    PLEASE NOTE THE ACTION IS IRREVOCABLE & YOUR STEWARDED SEED 
                    <p className="text-[9px] text-[#7E3EA8] mb-1 relative left-0 right-auto">WILL BECOME DORMANT. NO FURTHER EVOLUTIONS WILL BE POSSIBLE</p>
                  </p>
                  <p className="text-[9px] lg:text-[11px] md:text-[11 px] text-black relative left-0 right-auto">
                    YOU WILL BE REDIRECTED TO CONFIRM TRANSACTION
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={showWalletConnection}
        onClose={() => setShowWalletConnection(false)}
        onSuccess={() => {
          console.log('Wallet connected successfully from HarvestModal');
        }}
      />

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showWithdrawalModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-60"
              onClick={() => setShowWithdrawalModal(false)}
            />

            {/* Withdrawal Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-0 z-60 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-[40px] border-2 border-dotted border-black p-6 max-w-md w-full mx-auto relative shadow-2xl">
                {/* Close Button */}
                <button
                  onClick={() => setShowWithdrawalModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-10"
                >
                  <span className="text-black text-xl font-bold">×</span>
                </button>

                {/* Header */}
                <h2 className="text-xl text-black text-center mb-6 peridia-display-light">
                  Withdraw Nutrients
                </h2>

                {/* Recipient Account */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">RECIPIENT ACCOUNT</label>
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <span className="text-sm font-mono text-black">
                      {formatAddress(walletAddress || '')}
                    </span>
                  </div>
                </div>

                {/* Claimable Amount */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-2">CLAIMABLE AMOUNT</label>
                  <input
                    type="text"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="w-full bg-gray-100 rounded-lg px-4 py-3 text-black text-sm border-none outline-none"
                    placeholder="0.753 ETH"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum: {stats.currentClaimable}</p>
                </div>

                {/* Withdraw Button */}
                <Button
                  onClick={handleWithdraw}
                  disabled={isProcessing}
                  className="w-full bg-white border-2 border-dotted border-black text-black text-sm font-medium py-3 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      WITHDRAWING...
                    </div>
                  ) : (
                    "WITHDRAW"
                  )}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}

