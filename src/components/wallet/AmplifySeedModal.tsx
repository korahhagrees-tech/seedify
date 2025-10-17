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
} from "@privy-io/react-auth";
import { useBalance } from "wagmi";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { base } from "viem/chains";
import { toast } from 'sonner';

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
  const [contributionAmount, setContributionAmount] = useState("0.011");

  // Use Privy hooks for wallet management
  const { wallets: privyWallets, ready } = useWallets(); // Get all connected wallets from Privy
  const { setActiveWallet: setWagmiActiveWallet } = useSetActiveWallet(); // Set active wallet for wagmi
  const { fundWallet } = useFundWallet();
  const privy = usePrivy(); // Get Privy instance for export functionality
  const { connectWallet } = useConnectWallet({
    onSuccess: ({ wallet }) => {
      console.log("✅ Wallet connected successfully:", wallet);
      // The newly connected wallet will automatically be available in the wallets array
      // User can switch to it via the wallet selector if needed
    },
    onError: (error) => {
      console.error("❌ Wallet connection failed:", error);
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
      console.log("User logged in successfully", user);
      console.log("Is new user:", isNewUser);
      console.log("Was already authenticated:", wasAlreadyAuthenticated);
      console.log("Login method:", loginMethod);
      console.log("Login account:", loginAccount);
    },
    onError: (error) => {
      console.error("Login failed", error);
    },
  });

  const balance = balanceData
    ? parseFloat(balanceData.formatted).toFixed(4)
    : "0.0000";

  console.log(
    "🔍 WalletModal - Context wallets:",
    contextWallets.length,
    "Privy wallets:",
    privyWallets.length,
    "Using:",
    wallets.length,
    ready ? "(ready)" : "(loading)"
  );
  console.log("🔍 WalletModal - Wallets detail:", wallets);

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

  const handleExtendCultivation = () => {
    // Defensive checks for wallet functionality
    if (!ready) {
      toast.info('Setting up wallet... Please wait.');
      return;
    }
    if (!user) {
      toast.info('Please connect your wallet to continue.');
      return;
    }
    if (!activeWallet) {
      toast.error("No active wallet found. Please connect your wallet.");
      return;
    }

    // TODO: Implement extend cultivation logic
    console.log('Extending cultivation with amount:', contributionAmount);
    onClose();
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
      // TODO: Implement logout logic
      console.log('Logging out user');
      onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleWalletSelect = (wallet: any) => {
    // Use context's setActiveWallet which syncs with Zustand store and wagmi
    contextSetActiveWallet(wallet);
    setShowWalletSelector(false);
    console.log("Selected wallet:", wallet);
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
              className="bg-[#D9D9D9] p-6 border-3 border-dotted border-gray-600 shadow-xl scale-[0.5] lg:scale-[0.7] md:scale-[0.7]"
              animate={{
                borderRadius: currentState === 'communication'
                  ? '120px 40px 40px 120px' // asymmetric: top-left large, others small
                  : '40px 40px 40px 40px'   // uniform: all corners same
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-10"
              >
                <span className="text-black text-xl font-bold">×</span>
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-light peridia-display-light text-black tracking-wider">
                  Amplify Seed Impact
                </h2>
              </div>

              {/* State 1: Communication */}
              {currentState === 'communication' && (
                <>
                  {/* Introductory Text */}
                  <div className="mb-6">
                    <p className="text-sm text-black leading-relaxed text-center">
                      abundant nutrient reserves bloom into longterm nurture of our shared habitats & the humans who tend to them for us
                    </p>
                  </div>

                  {/* SeedId Current Cultivation Overview Bar */}
                  <div className="bg-white rounded-full px-6 py-3 mb-6 border border-dotted border-gray-400">
                    <p className="text-black text-center text-sm font-medium">
                      Seed {seedId} current cultivation overview. Thank You!
                    </p>
                  </div>

                  {/* Stats Grid (8 Metrics) */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {/* Row 1 */}
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">TOTAL VALUE</p>
                      <div className="bg-white rounded-lg px-3 py-2 border border-dotted border-gray-400">
                        <span className="text-sm font-medium text-black">{stats.totalValue}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">FUNDS COMMITTED</p>
                      <div className="bg-white rounded-lg px-3 py-2 border border-dotted border-gray-400">
                        <span className="text-sm font-medium text-black">{stats.fundsCommitted}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">SNAP REWARDS</p>
                      <div className="bg-white rounded-lg px-3 py-2 border border-dotted border-gray-400">
                        <span className="text-sm font-medium text-black">{stats.snapRewards}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">#SNAPS</p>
                      <div className="bg-white rounded-lg px-3 py-2 border border-dotted border-gray-400">
                        <span className="text-sm font-medium text-black">{stats.numSnaps}</span>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">TOTAL FUNDINGS</p>
                      <div className="bg-white rounded-lg px-3 py-2 border border-dotted border-gray-400">
                        <span className="text-sm font-medium text-black">{stats.totalFundings}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">YEARLY FUNDING</p>
                      <div className="bg-white rounded-lg px-3 py-2 border border-dotted border-gray-400">
                        <span className="text-sm font-medium text-black">{stats.yearlyFunding}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">ALL SEEDS TOTAL</p>
                      <div className="bg-white rounded-lg px-3 py-2 border border-dotted border-gray-400">
                        <span className="text-sm font-medium text-black">{stats.allSeedsTotal}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">SNAPS%</p>
                      <div className="bg-white rounded-lg px-3 py-2 border border-dotted border-gray-400">
                        <span className="text-sm font-medium text-black">{stats.snapsPercentage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Informational Card */}
                  <div className="bg-white rounded-[20px] px-6 py-4 mb-6 border border-dotted border-gray-400">
                    <p className="text-sm text-black leading-relaxed text-center">
                      abundant nutrient reserves bloom into longterm nurture of our shared habitats & the humans who tend to them for us
                    </p>
                  </div>

                  {/* Continue Button */}
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-2">ADD NUTRIENTS TO YOUR SEED</p>
                    <button
                      onClick={handleContinue}
                      className="bg-white border-2 border-dotted border-black text-black text-sm font-medium py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Continue →
                    </button>
                  </div>
                </>
              )}

              {/* State 2: Payment */}
              {currentState === 'payment' && (
                <>
                  {/* Wallet Section */}
                  <div className="bg-white rounded-[20px] p-4 mb-6 border border-dotted border-gray-400">
                    <p className="text-sm text-black font-medium mb-2">YOUR WALLET</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
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
                      <div className="bg-gray-100 px-3 py-1 rounded-lg">
                        <span className="text-base font-light text-gray-700">{balance} ETH</span>
                      </div>
                    </div>

                    {/* Email and Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <Image src={assets.email} alt="Email" width={16} height={16} className="w-4 h-4" />
                      <span className="text-sm text-black">{user?.email || formatAddress(walletAddress || '')}</span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleAddFunds}
                        className="px-4 py-1 border border-dotted border-gray-500 rounded-full text-sm text-black bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        Add Funds
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-1 text-sm text-black hover:text-gray-800 transition-colors"
                      >
                        <Image src={assets.logout} alt="Logout" width={16} height={16} className="w-4 h-4" />
                        Log out
                      </button>
                      <button
                        onClick={handleConnectAccount}
                        className="px-4 py-1 border border-dotted border-black rounded-full text-sm text-black bg-white hover:bg-gray-50 transition-colors"
                      >
                        Wallet Connect
                      </button>
                    </div>
                  </div>

                  {/* Introductory Text */}
                  <div className="mb-6">
                    <p className="text-sm text-black leading-relaxed">
                      abundant nutrient reserves bloom into longterm nurture of our shared habitats & the humans tending them generously
                    </p>
                  </div>

                  {/* Contribution Section */}
                  <div className="mb-6">
                    <label className="block text-sm text-gray-600 mb-2">CONTRIBUTION AMOUNT</label>
                    <input
                      type="text"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="w-full bg-gray-100 rounded-lg px-4 py-3 text-black text-sm border-none outline-none"
                      placeholder="0.011 ETH"
                    />
                  </div>

                  {/* Extend Cultivation Button */}
                  <div className="text-center mb-6">
                    <button
                      onClick={handleExtendCultivation}
                      className="bg-white border-2 border-dotted border-black text-black text-sm font-medium py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Extend Cultivation
                    </button>
                    <p className="text-xs text-gray-600 mt-2">INCREASE SEED VESTING VALUE</p>
                  </div>

                  {/* Stats Row (3 Metrics) */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">CURRENT CLAIMABLE</p>
                      <div className="bg-white rounded-lg px-3 py-2 border border-dotted border-gray-400">
                        <span className="text-sm font-medium text-black">{stats.currentClaimable}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">MATURATION DATE</p>
                      <div className="bg-white rounded-lg px-3 py-2 border border-dotted border-gray-400">
                        <span className="text-sm font-medium text-black">{stats.maturationDate}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-2">PREMATURE PENALTY</p>
                      <div className="bg-white rounded-lg px-3 py-2 border border-dotted border-gray-400">
                        <span className="text-sm font-medium text-black">{stats.prematurePenalty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Text */}
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
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
