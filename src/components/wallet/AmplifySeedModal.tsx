/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthProvider";
import { assets } from "@/lib/assets";
import WalletSelector from "./WalletSelector";
import AddFundsModal from "./AddFundsModal";
import { useWalletUtils, formatWalletAddress } from "@/lib/wallet/walletUtils";
import {
  useFundWallet,
  useWallets,
  useConnectWallet,
  useLogin,
  usePrivy,
  useLogout,
} from "@privy-io/react-auth";
import { useBalance, useWriteContract, usePublicClient } from "wagmi";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { base } from "viem/chains";
import { toast } from 'sonner';
import { clearAppStorage } from "@/lib/auth/logoutUtils";
import { encodeFunctionData, parseEther } from "viem";
import { useSendTransaction } from "@privy-io/react-auth";

// SeedFactory ABI for deposit
const SEED_FACTORY_ABI = [
  {
    "inputs": [{"internalType": "uint256","name": "seedId","type": "uint256"}],
    "name": "depositForSeed",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

const SEED_FACTORY_ADDRESS = "0x7e75F9eC72dd70Eb4E6C701Be225cDBd77e51463";

interface AmplifySeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  seedId?: string;
  stats?: {
    totalValue: string;
    fundsCommitted: string;
    snapRewards: string;
    numSnaps: string;
    totalFundings: string;
    yearlyFunding: string;
    allSeedsTotal: string;
    snapsPercentage: string;
    currentClaimable: string;
    maturationDate: string;
    prematurePenalty: string;
  };
}

export default function AmplifySeedModal({
  isOpen,
  onClose,
  seedId = "1",
  stats = {
    totalValue: "1.633 ETH",
    fundsCommitted: "1.100 ETH",
    snapRewards: "0.533 ETH",
    numSnaps: "445",
    totalFundings: "0.939 ETH",
    yearlyFunding: "0.139 ETH",
    allSeedsTotal: "22.338 ETH",
    snapsPercentage: "12.5%",
    currentClaimable: "0.753 ETH",
    maturationDate: "02/09/2029",
    prematurePenalty: "2.067 ETH"
  }
}: AmplifySeedModalProps) {
  const { user, walletAddress, wallets: contextWallets, activeWallet, linkedAccounts, setActiveWallet: contextSetActiveWallet } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [currentState, setCurrentState] = useState<'communication' | 'payment'>('communication');
  const [contributionAmount, setContributionAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Use Privy hooks for wallet management
  const { wallets: privyWallets, ready } = useWallets(); // Get all connected wallets from Privy
  const { setActiveWallet: setWagmiActiveWallet } = useSetActiveWallet(); // Set active wallet for wagmi
  const { fundWallet } = useFundWallet();
  const { sendTransaction } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const privy = usePrivy();
  const { logout } = useLogout();
  const { connectWallet } = useConnectWallet({
    onSuccess: ({ wallet }) => {
      // console.log(" Wallet connected successfully:", wallet);
      // The newly connected wallet will automatically be available in the wallets array
      // User can switch to it via the wallet selector if needed
    },
    onError: async (error) => {
      // console.error("Wallet connection failed:", error);
      try {
        await login();
      } catch (error) {
        console.error("Login failed:", error);
      }
      return;
    },
  });

  // Use wallets from context (which comes from Zustand store)
  const wallets = contextWallets.length > 0 ? contextWallets : privyWallets;

  // Get Privy instance for linking social accounts
  const {
    linkGoogle,
    linkTwitter,
    linkDiscord,
    linkGithub,
    linkApple,
    linkEmail,
    linkPasskey,
  } = usePrivy();
  const { data: balanceData } = useBalance({
    address: walletAddress as `0x${string}`,
  });

  const { login } = useLogin({
    onComplete: ({
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      loginAccount,
    }) => {
      // console.log("User logged in successfully", user);
      // console.log("Is new user:", isNewUser);
      // console.log("Was already authenticated:", wasAlreadyAuthenticated);
      // console.log("Login method:", loginMethod);
      // console.log("Login account:", loginAccount);
    },
    onError: (error) => {
      // console.error("Login failed", error);
    },
  });

  const balance = balanceData
    ? parseFloat(balanceData.formatted).toFixed(4)
    : "0.0000";

  // console.log(
  //   "WalletModal - Context wallets:",
  //   contextWallets.length,
  //   "Privy wallets:",
  //   privyWallets.length,
  //   "Using:",
  //   wallets.length,
  //   ready ? "(ready)" : "(loading)"
  // );
  // console.log("WalletModal - Wallets detail:", wallets);

  const copyToClipboard = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinue = () => {
    setCurrentState('payment');
  };

  const handleExtendCultivation = async () => {
    setIsProcessing(true);

    try {
      // Defensive checks for wallet functionality
      if (!ready) {
        // toast.info('Setting up wallet... Please wait.');
        setIsProcessing(false);
        return;
      }
      if (!user) {
        // toast.info('Please connect your wallet to continue.');
        setIsProcessing(false);
        return;
      }
      if (!activeWallet) {
        // toast.error("No active wallet found. Please connect your wallet.");
        setIsProcessing(false);
        return;
      }

      // Validate contribution amount
      if (!contributionAmount || contributionAmount.trim() === "" || isNaN(parseFloat(contributionAmount))) {
        // toast.error('Please enter a valid contribution amount.');
        setIsProcessing(false);
        return;
      }

      const seedIdNum = parseInt(seedId || "1");
      const contributionAmountNum = parseFloat(contributionAmount);

      if (isNaN(contributionAmountNum) || contributionAmountNum <= 0) {
        // toast.error('Contribution amount must be greater than 0.');
        setIsProcessing(false);
        return;
      }

      // console.log('Executing deposit for seed:', seedIdNum, 'with amount:', contributionAmountNum, 'ETH');

      // Convert ETH to wei
      const contributionAmountWei = parseEther(contributionAmountNum.toString());

      // Use writeContractAsync instead of sendTransaction for better wallet compatibility
      const txHash = await writeContractAsync({
        address: SEED_FACTORY_ADDRESS as `0x${string}`,
        abi: SEED_FACTORY_ABI,
        functionName: 'depositForSeed',
        args: [BigInt(seedIdNum)],
        value: contributionAmountWei,
      });

      // console.log('Deposit transaction submitted:', txHash);

      // Wait for transaction receipt and verify status
      if (txHash) {
        // console.log('Deposit transaction submitted with hash:', txHash);
        
        // Poll transaction status
        let transactionStatus = null;
        const maxAttempts = 20;
        let attempts = 0;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

        while (attempts < maxAttempts && !transactionStatus) {
          try {
            await new Promise(resolve => setTimeout(resolve, 6000));
            
            const statusResponse = await fetch(`${apiBaseUrl}/transactions/${txHash}/status`);
            
            if (statusResponse.ok) {
              const statusData = await statusResponse.json();
              // console.log('Transaction status response:', statusData);

              if (statusData.success && statusData.transaction) {
                const status = statusData.transaction.status;
                
                if (status === 'success') {
                  // console.log('Transaction confirmed as successful');
                  transactionStatus = statusData.transaction;
                  break;
                } else if (status === 'reverted') {
                  console.error('Transaction reverted:', statusData.transaction.revertReason);
                  // toast.error('Transaction failed and reverted. Please try again.');
                  setIsProcessing(false);
                  return;
                } else {
                  // console.log('Transaction status pending, continuing to poll...');
                }
              }
            }
            
            attempts++;
          } catch (error) {
            console.warn(`Status check attempt ${attempts + 1} failed:`, error);
            attempts++;
          }
        }

        if (!transactionStatus) {
          console.error('Transaction verification timed out');
          // toast.error('Transaction verification timed out. Please check your wallet.');
          setIsProcessing(false);
          return;
        }

        // Success - close modal and show notification
        // toast.success('Deposit successful! Your seed cultivation has been extended.');
        onClose();
      }

    } catch (error: any) {
      console.error('Deposit failed:', error);
      //  toast.error(error?.message || 'Deposit failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSwitchWallet = () => {
    // If user has multiple wallets, show selector
    if (wallets.length > 1) {
      setShowWalletSelector(true);
    } else {
      // If user only has one wallet, help them connect additional wallets
      connectWallet({
        walletChainType: "ethereum-and-solana", // Show both Ethereum and Solana wallets
      });
    }
  };

  const handleConnectAccount = () => {
    // Unified connection flow for both wallets and social accounts
    connectWallet({
      walletChainType: "ethereum-and-solana",
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      // console.log('Logging out user');
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleWalletSelect = (wallet: any) => {
    // Use context's setActiveWallet which syncs with Zustand store and wagmi
    contextSetActiveWallet(wallet);
    setShowWalletSelector(false);
    // console.log("Selected wallet:", wallet);
  };

  const handleAddFunds = async () => {
    if (walletAddress) {
      try {
        // Use Privy's fundWallet with Base chain
        await fundWallet({
          address: walletAddress,
          options: {
            chain: base,
          },
        });
      } catch (error) {
        console.error("Failed to fund wallet:", error);
        // Fallback to modal if needed
        setShowAddFunds(true);
      }
    }
  };


  const formatAddress = (address: string) => {
    return formatWalletAddress(address);
  };

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

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="amplify-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 z-40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="amplify-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto"
          >
            {/* Modal with animated border transition and scaling */}
            <motion.div
              className="bg-[#D9D9D9] p-6 border-3 border-dotted border-gray-600 shadow-xl scale-[0.75] lg:scale-[0.7] md:scale-[0.7] -ml-16 lg:-ml-8 md:-ml-8 -mt-12 lg:-mt-0 md:-mt-0 w-[480px] lg:w-[580px] md:w-[580px]"
              animate={{
                borderRadius: currentState === 'communication'
                  ? '80px 80px 40px 120px' // asymmetric: top-left large, others small
                  : '80px 80px 80px 80px'   // uniform: all corners same
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute -top-12 right-8 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-10"
              >
                <span className="text-black text-2xl font-bold">×</span>
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-light peridia-display-light text-black tracking-wider scale-[1.2] lg:scale-[1.4] md:scale-[1.1]">
                  Amplify Seed Impact
                </h2>
              </div>

              {/* State 1: Communication */}
              {currentState === 'communication' && (
                <>
                  {/* Introductory Text */}
                  <div className="mb-6 relative left-0 right-auto scale-[1.1] lg:scale-[0.8] md:scale-[1.1] -top-3 lg:-top-3 md:-top-3">
                    <p className="text-[14px] lg:text-[23px] md:text-[16px] text-black leading-relaxed text-center peridia-display-light relative left-0 right-auto">
                      abundant nutrient reserves bloom into longterm nurture 
                      <p className="text-nowrap">of our shared habitats & the humans who tend to them for us</p>
                    </p>
                  </div>

                  {/* SeedId Current Cultivation Overview Bar */}
                  <div className="bg-[#E2E3F0CC] rounded-tl-[30px] rounded-tr-[30px] rounded-bl-[20px] rounded-br-[20px] px-6 py-2 mb-6 border-3 border-dotted border-gray-500 relative left-0 right-auto -top-6 lg:-top-6 md:-top-6">
                    <p className="text-black text-center text-sm font-medium relative left-0 right-auto scale-[1.3] lg:scale-[1.6] md:scale-[1.1]">
                      Seed{seedId} <span className="peridia-display">current cultivation overview. Thank You!</span>
                    </p>
                  </div>

                  {/* Stats Grid (8 Metrics) */}
                  <div className="grid grid-cols-4 gap-4 mb-6 -top-6 lg:-top-10 md:-top-6 relative left-0 right-auto">
                    {/* Row 1 */}
                    <div className="text-center relative left-0 right-auto">
                      <p className="text-[8px] lg:text-[12px] md:text-[12px] text-black mb-2 relative left-0 right-auto">TOTAL VALUE</p>
                      <div className="bg-white rounded-full px-3 py-0 lg:px-1 md:px-1 border border-dotted border-gray-400 relative left-0 right-auto text-nowrap -top-2 lg:-top-2 md:-top-2">
                        <div className="text-center relative left-0 right-auto scale-[0.9] lg:scale-[1.1] md:scale-[1.2]">
                          <span className="text-[8px] lg:text-[12px] md:text-[11px] font-medium text-black text-nowrap relative top-0 lg:top-0 md:-top-0 -left-4 lg:left-0 md:left-0 right-auto">{parseEthValue(stats.totalValue)} ETH</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center relative left-0 right-auto">
                      <p className="text-[8px] lg:text-[12px] md:text-[12px] text-nowrap text-black mb-2 relative left-0 right-auto">FUNDS COMMITTED</p>
                      <div className="bg-white rounded-full px-3 py-0 lg:px-1 md:px-1 border border-dotted border-gray-400 relative left-0 right-auto -top-2 lg:-top-2 md:-top-2">
                        <div className="text-center relative left-0 right-auto scale-[0.8] lg:scale-[1.1] md:scale-[1.1]">
                          <span className="text-[12px] lg:text-[12px] md:text-[12px] font-medium text-black text-nowrap relative top-0 lg:top-0 md:-top-0 -left-2 lg:left-0 md:left-0 right-auto">{stats.fundsCommitted}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center relative left-0 right-auto">
                      <p className="text-[8px] lg:text-[12px] md:text-[12px] text-nowrap text-black mb-2 relative left-0 right-auto">SNAP REWARDS</p>
                      <div className="bg-white rounded-full px-3 py-0 lg:py-1 md:py-1 border border-dotted border-gray-400 relative left-0 right-auto -top-2 lg:-top-2 md:-top-2">
                        <div className="text-center relative left-0 right-auto scale-[0.8] lg:scale-[1.1] md:scale-[1.1]">
                          <span className="text-[12px] lg:text-[12px] md:text-[12px] font-medium text-black text-nowrap relative top-0 lg:top-0 md:-top-0 -left-2 lg:left-0 md:left-0 right-auto">{stats.snapRewards}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center relative left-0 right-auto">
                      <p className="text-[10px] lg:text-[12px] md:text-[12px] text-black mb-2 relative left-0 right-auto">#SNAPS</p>
                      <div className="bg-white rounded-full px-3 py-0 lg:py-1 md:py-1 border border-dotted border-gray-400 relative left-0 right-auto -top-3 lg:-top-2 md:-top-2">
                        <div className="text-center relative left-0 right-auto scale-[1.0] lg:scale-[1.1] md:scale-[1.1]">
                          <span className="text-[12px] lg:text-[12px] md:text-[12px] font-medium text-black text-nowrap relative top-0 lg:top-0 md:-top-0 left-0 right-auto">{stats.numSnaps}</span>
                        </div>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="text-center relative left-0 right-auto -top-6 lg:-top-4 md:-top-3">
                      <p className="text-[8px] lg:text-[12px] md:text-[12px] text-black mb-2 relative left-0 right-auto">TOTAL FUNDINGS</p>
                      <div className="bg-white rounded-full px-3 py-0 lg:py-1 md:py-1 border border-dotted border-gray-400 relative left-0 right-auto -top-2 lg:-top-2 md:-top-2">
                        <div className="text-center relative left-0 right-auto scale-[0.9] lg:scale-[1.1] md:scale-[1.1]">
                          <span className="text-[7px] lg:text-[12px] md:text-[12px] font-medium text-black text-nowrap relative top-0 lg:top-0 md:-top-0 -left-4 lg:left-0 md:left-0 right-auto">{parseEthValue(stats.totalFundings)} ETH</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center relative left-0 right-auto -top-6 lg:-top-4 md:-top-3">
                      <p className="text-[8px] lg:text-[12px] md:text-[12px] text-black mb-2 relative left-0 right-auto">YEARLY FUNDING</p>
                      <div className="bg-white rounded-full px-3 py-0 lg:py-1 md:py-1 border border-dotted border-gray-400 relative left-0 right-auto -top-2 lg:-top-2 md:-top-2">
                        <div className="text-center relative left-0 right-auto scale-[0.9] lg:scale-[1.1] md:scale-[1.1]">
                          <span className="text-[12px] lg:text-[12px] md:text-[12px] font-medium text-black text-nowrap relative top-0 lg:top-0 md:-top-0 -left-2 lg:left-0 md:left-0 right-auto">{stats.yearlyFunding}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center relative left-0 right-auto -top-6 lg:-top-4 md:-top-3">
                      <p className="text-[8px] lg:text-[12px] md:text-[12px] text-black mb-2 relative left-0 right-auto">ALL SEEDS TOTAL</p>
                      <div className="bg-white rounded-full px-3 py-0 lg:py-1 md:py-1 border border-dotted border-gray-400 relative left-0 right-auto -top-2 lg:-top-2 md:-top-2">
                        <div className="text-center relative left-0 right-auto scale-[0.9] lg:scale-[1.1] md:scale-[1.1]">
                          <span className="text-[7px] lg:text-[12px] md:text-[12px] font-medium text-black text-nowrap relative top-0 lg:top-0 md:-top-0 -left-4 lg:left-0 md:left-0 right-auto">{parseEthValue(stats.allSeedsTotal)} ETH</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center relative left-0 right-auto -top-6 lg:-top-4 md:-top-3">
                      <p className="text-[8px] lg:text-[12px] md:text-[12px] text-black mb-2 relative left-0 right-auto">SNAPS%</p>
                      <div className="bg-white rounded-full px-3 py-0 lg:py-1 md:py-1 border border-dotted border-gray-400 relative left-0 right-auto -top-2 lg:-top-2 md:-top-2">
                        <div className="text-center relative left-0 right-auto scale-[0.8] lg:scale-[1.1] md:scale-[1.1]">
                          <span className="text-[14px] lg:text-[12px] md:text-[12px] font-medium text-black text-nowrap relative top-0 lg:top-0 md:-top-0 left-0 lg:left-0 md:left-0 right-auto">{stats.snapsPercentage}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informational Card */}
                  <div className="bg-white rounded-[20px] px-4 py-8 mb-6 relative left-30 lg:left-35 md:left-30 -mt-6 lg:-mt-16 md:-mt-6 right-auto w-[300px] lg:w-[350px] md:w-[350px]">
                    <p className="text-[14px] lg:text-[16px] md:text-[16px] text-black leading-relaxed peridia-display-light text-center relative left-0 right-auto -top-6 lg:-top-6 md:-top-6 px-8">
                      abundant nutrient reserves bloom into longterm nurture
                      <p className="text-nowrap">of our shared habitats & the humans who</p>
                      <p className="text-nowrap">tend to them for us</p>
                    </p>
                  </div>

                  {/* Continue Button */}
                  <div className="text-center ml-12 lg:ml-16 md:ml-26 relative left-22 right-auto">
                    <p className="text-xs text-black mb-2 relative left-0 right-auto">ADD NUTRIENTS TO YOUR SEED</p>
                    <button
                      onClick={handleContinue}
                      className="bg-white border-2 border-dotted border-black text-black text-sm font-medium py-1 lg:py-2 md:py-2 px-8 w-[200px] lg:w-[240px] md:w-[240px] rounded-full hover:bg-gray-100 transition-colors relative left-0 right-auto inline-flex items-center gap-2 text-nowrap text-[14px] lg:text-[14px] md:text-[14px]"
                    >
                      <div className="scale-[1.2] lg:scale-[1.5] md:scale-[1.5] text-[18px] lg:text-[20px] md:text-[20px] ml-5 lg:ml-9 md:ml-8 relative left-0 right-auto">
                        <span className="peridia-display relative left-0 right-auto">C</span>ontinue
                      </div>
                        <Image src={assets.arrowRight} alt="Arrow Right" width={16} height={16} className="w-8 h-8 ml-2 lg:ml-5 md:ml-6 relative left-0 right-auto" />
                    </button>
                  </div>
                </>
              )}

              {/* State 2: Payment */}
              {currentState === 'payment' && (
                <>
                  {/* Wallet Section */}
                  <div className="bg-white rounded-full p-4 mb-4 border border-black relative left-0 right-auto z-50">
                    <p className="text-[11px] text-black font-medium mb-2 relative left-0 right-auto">YOUR WALLET</p>
                    <div className="flex items-center justify-between relative left-0 right-auto">
                      <div className="flex items-center gap-3 relative left-0 right-auto -top-4 lg:-top-4 md:-top-4">
                        <span className="text-lg font-mono text-black relative left-0 right-auto">
                          {formatAddress(walletAddress || '')}
                        </span>
                        <button
                          onClick={copyToClipboard}
                          className="flex items-center justify-center transition-colors relative left-0 right-auto"
                        >
                          <Image src={assets.copy} alt="Copy" width={12} height={12} className="w-4 h-4 relative left-0 right-auto" />
                        </button>
                        {copied && <span className="text-xs text-green-600 relative left-0 right-auto">Copied!</span>}
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-lg relative left-0 right-auto -top-4 lg:-top-4 md:-top-4">
                        <span className="text-lg font-light text-gray-700 relative left-0 right-auto">{balance} ETH</span>
                      </div>
                    </div>
                  </div>

                  {/* Email and Actions - Side by side */}
                  <div className="bg-[#cdc9c9] rounded-[40px] p-2 w-[420px] lg:w-[520px] md:w-[500px] mb-2 -ml-8 -mt-8 py-4 relative left-8 lg:left-8 md:left-10 right-auto">
                    <div className="flex items-center gap-2 mt-2 lg:mt-4 md:mt-4 relative left-4 lg:left-4 md:left-3 right-auto">
                      <Image src={assets.email} alt="Email" width={16} height={16} className="w-4 h-4 relative left-0 right-auto" />
                      <span className="text-lg text-black relative left-0 right-auto">{user?.email || formatAddress(walletAddress || '')}</span>
                    </div>

                    <div className="flex gap-2 mt-1 relative left-0 right-auto">
                      <button
                        onClick={async () => {
                          onClose();
                          clearAppStorage();
                          await handleLogout();
                          setTimeout(() => {
                            window.location.href = "/";
                          }, 100);
                        }}
                        className="flex items-center gap-2 px-4 py-0 h-8 text-lg text-black hover:text-gray-800 transition-colors text-nowrap relative left-0 right-auto"
                      >
                        <Image src={assets.logout} alt="Logout" width={16} height={16} className="w-4 h-4 relative left-0 right-auto" />
                        <span className="text-nowrap text-[8px] lg:text-[12px] md:text-[12px]">Log out</span>
                      </button>
                      <button
                        onClick={handleAddFunds}
                        className="px-8 py-0 lg:py-0 md:py-0 h-8 border-2 border-dotted border-gray-500 rounded-full text-[8px] lg:text-[12px] md:text-[12px] text-black bg-gray-300 hover:bg-gray-100 transition-colors text-nowrap relative left-32 lg:left-44 md:left-40 -top-16 lg:-top-12 md:-top-14 right-auto z-50"
                      >
                        <div className="scale-[0.8] lg:scale-[1.2] md:scale-[1.1] relative left-0 right-auto">
                          <span className="peridia-display relative left-0 right-auto">A</span>dd <span className="peridia-display relative left-0 right-auto">F</span>unds
                        </div>
                      </button>
                      <button
                        onClick={handleConnectAccount}
                        className="px-4 py-1 border-2 border-dotted border-black rounded-full text-[8px] lg:text-[12px] md:text-[12px] h-8 lg:h-8 md:h-8 text-black bg-white hover:bg-gray-50 transition-colors relative -left-12 lg:left-0 md:-left-3 right-auto text-nowrap scale-[1.1] lg:scale-[1.3] md:scale-[1.25]"
                      >
                        <div className="scale-[1.1] lg:scale-[1.2] md:scale-[1.1] relative left-0 right-auto">
                          <span className="peridia-display relative left-0 right-auto">W</span>allet <span className="peridia-display relative left-0 right-auto">C</span>onnect
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Introductory Text */}
                  <div className="mb-4 mt-6 relative left-0 right-auto scale-[1.1] lg:scale-[1.4] md:scale-[1.6]">
                    <p className="text-sm text-black leading-relaxed relative left-0 right-auto peridia-display-light text-center">
                      abundant nutrient reserves bloom into longterm nurture of
                      <p className="text-nowrap">our shared habitats & the humans tending them generously</p>
                    </p>
                  </div>

                  {/* Contribution Section */}
                  <div className="mb-4 relative -left-14 lg:left-4 md:left-12 right-auto scale-[0.7] lg:scale-[1.0] md:scale-[1.1] top-22 lg:top-28 md:top-28 -mt-16 lg:-mt-16 md:-mt-6">
                    <label className="block text-[14px] lg:text-[14px] md:text-[12px] text-black mb-2 relative left-6 lg:left-4 md:left-3 right-auto">CONTRIBUTION AMOUNT</label>
                    <div className="bg-white rounded-full px-4 py-2 lg:py-2 md:py-2 border-3 border-dotted border-black relative left-0 right-auto -top-2 lg:-top-2 md:-top-2 inline-flex items-center min-w-[120px]">
                      <div className="flex items-center w-full">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            step="any"
                            value={contributionAmount}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow empty string, numbers, and decimal points
                              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                setContributionAmount(value);
                              }
                            }}
                            className="bg-transparent text-black text-[8px] lg:text-[12px] md:text-[12px] scale-[1.8] lg:scale-[1.6] md:scale-[1.5] border-none outline-none relative left-8 lg:left-14 md:left-12 right-auto w-full min-w-[60px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0.000"
                            style={
                              { width: contributionAmount ? `${Math.max(60, contributionAmount.length * 14)}px` : '120px',
                                marginLeft: contributionAmount ? `-34px` : '-5px'
                               }
                            }
                          />
                          {/* Custom underline that skips decimal point */}
                          {contributionAmount && (
                            <div className="absolute bottom-2 lg:bottom-4 md:bottom-4 left-0 right-0 h-[1px] pointer-events-none">
                              {contributionAmount.split('').map((char, index) => {
                                if (char === '.') {
                                  return <span key={index} className="inline-block w-[0.5em] h-[1px]"></span>;
                                }
                                return <span key={index} className="inline-block w-[0.5em] h-[1px] bg-black"></span>;
                              })}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-black ml-2 scale-[1.85] lg:scale-[1.7] md:scale-[1.5] flex-shrink-0">ETH</span>
                      </div>
                    </div>
                  </div>  

                  {/* Extend Cultivation Button */}
                  <div className="mb-4 relative left-50 lg:left-60 md:left-85 right-auto scale-[1.1] lg:scale-[1.0] md:scale-[1.4] -top-6 lg:-top-2 md:-top-8">
                    <div className="flex items-center gap-4 relative left-0 right-auto">
                      <div className="text-left relative left-0 right-auto">
                        <button
                          onClick={handleExtendCultivation}
                          disabled={isProcessing}
                          className="bg-white border-3 border-dotted border-black text-black text-sm font-medium py-2 px-6 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 relative left-0 right-auto w-[230px] lg:w-[250px] md:w-[200px]"
                        >
                          {isProcessing ? (
                            <div className="scale-[1.85] lg:scale-[1.85] md:scale-[1.65] relative left-0 right-auto top-2 lg:top-2 md:top-2 flex items-center gap-2">
                              <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin relative left-0 right-auto"></div>
                              <span className="relative left-0 right-auto">PROCESSING...</span>
                            </div>
                          ) : (
                            <div className="scale-[1.85] lg:scale-[1.85] md:scale-[1.65] relative left-0 right-auto top-2 lg:top-2 md:top-2">
                             <p className="peridia-display relative left-0 right-auto">E<span className="favorit-mono relative left-0 right-auto">xtend</span></p>
                             <p className="peridia-display relative left-0 right-auto -top-2 lg:-top-2 md:-top-2">C<span className="favorit-mono relative left-0 right-auto">ultivation</span></p>
                            </div>
                          )}
                        </button>
                        <p className="text-[12px] lg:text-[12px] md:text-[10px] text-black mt-1 relative left-6 lg:left-8 md:left-4 right-auto">INCREASE SEED VESTING VALUE</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Row (3 Metrics) - fully rounded */}
                  <div className="grid grid-cols-3 gap-2 mb-4 relative left-0 right-auto">
                    <div className="text-center relative left-0 right-auto">
                      <p className="text-[10px] lg:text-[12px] md:text-[12px] text-black mb-2 relative left-0 right-auto top-2 lg:top-2 md:top-2">CURRENT CLAIMABLE</p>
                      <div className="bg-white rounded-full px-3 py-2 border border-dotted border-gray-400 relative left-0 right-auto">
                        <div className="scale-[1.4] lg:scale-[1.3] md:scale-[1.85] relative left-0 right-auto">
                        <span className="text-xs lg:text-[12px] md:text-[12px] font-medium text-black text-nowrap relative left-0 right-auto">{stats.currentClaimable}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center relative left-0 right-auto">
                      <p className="text-[10px] lg:text-[12px] md:text-[12px] text-black mb-2 relative left-0 right-auto top-2 lg:top-2 md:top-2">MATURATION DATE</p>
                      <div className="bg-white rounded-full px-3 py-2 border border-dotted border-gray-400 relative left-0 right-auto">
                        <div className="scale-[1.4] lg:scale-[1.3] md:scale-[1.85] relative left-0 right-auto">
                        <span className="text-xs lg:text-[12px] md:text-[12px] font-medium text-black text-nowrap relative left-0 right-auto">{stats.maturationDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center relative left-0 right-auto">
                      <p className="text-[10px] lg:text-[12px] md:text-[12px] text-black mb-2 relative left-0 right-auto top-2 lg:top-2 md:top-2">PREMATURE PENALTY</p>
                      <div className="bg-white rounded-full px-3 py-2 border border-dotted border-gray-400 relative left-0 right-auto">
                        <div className="scale-[1.4] lg:scale-[1.3] md:scale-[1.85] relative left-0 right-auto">
                        <span className="text-xs lg:text-[12px] md:text-[12px] font-medium text-black text-nowrap relative left-0 right-auto">{stats.prematurePenalty}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Text */}
                  <div className="text-center relative left-0 right-auto">
                    <p className="text-xs text-black relative left-0 right-auto">
                      YOU WILL BE REDIRECTED TO CONFIRM TRANSACTION
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}

      {/* Wallet Selector Modal */}
      <WalletSelector
        isOpen={showWalletSelector}
        onClose={() => setShowWalletSelector(false)}
        onWalletSelect={handleWalletSelect}
        currentWalletId={walletAddress || ""}
      />

      {/* Add Funds Modal */}
      <AddFundsModal
        isOpen={showAddFunds}
        onCloseAction={() => setShowAddFunds(false)}
        walletAddress={walletAddress || undefined}
      />
    </AnimatePresence>
  );
}
