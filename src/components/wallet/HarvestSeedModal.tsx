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
  const { authenticated, login, logout } = usePrivy();
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
      // Use activeWallet from context (Zustand store), fallback to first wallet
      const currentActiveWallet = activeWallet || wallets[0];
      if (!currentActiveWallet) {
        toast.error("No active wallet found. Please connect your wallet.");
        setIsProcessing(false);
        return;
      }

      // Show withdrawal modal
      setShowWithdrawalModal(true);
      setIsProcessing(false);

    } catch (error) {
      console.error('Harvest failed:', error);
      toast.error('Harvest failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    setIsProcessing(true);

    try {
      // TODO: Implement actual withdrawal logic here
      console.log('Withdrawing:', withdrawalAmount);

      // For now, just show success
      toast.success('Withdrawal processed successfully!');
      setShowWithdrawalModal(false);
      onClose();

    } catch (error) {
      console.error('Withdrawal failed:', error);
      toast.error('Withdrawal failed. Please try again.');
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
            key="payment-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="payment-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:scale-[0.7] md:scale-[0.7] scale-[0.5]"
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
                  Harvest Seed Nutrients
                </h2>

                {/* Wallet Connect Button */}
                <Button
                  onClick={async () => {
                    try {
                      if (authenticated) {
                        toast.success('Wallet already connected');
                      } else {
                        await login();
                        toast.success('Wallet connected successfully!');
                      }
                    } catch (error) {
                      toast.error('Failed to connect wallet');
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
              <div className="bg-white rounded-[40px] border-2 border-black border-dotted p-8 max-w-lg w-full mx-auto relative shadow-xl">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-10"
                >
                  <span className="text-black text-xl font-bold">×</span>
                </button>

                {/* Header */}
                <h2 className="text-2xl text-black text-center mb-6 peridia-display-light">
                  Harvest Seed Nutrients
                </h2>

                {/* Wallet Details Section */}
                <div className="bg-gray-100 rounded-[20px] p-4 mb-6">
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
                    <div className="bg-white px-3 py-1 rounded-lg">
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
                      onClick={async () => {
                        onClose();
                        await logout();
                        setTimeout(() => {
                          window.location.href = "/";
                        }, 100);
                      }}
                      className="flex items-center gap-2 px-4 py-1 text-sm text-black hover:text-gray-800 transition-colors"
                    >
                      <Image src={assets.logout} alt="Logout" width={16} height={16} className="w-4 h-4" />
                      Log out
                    </button>
                    <button
                      onClick={handleWalletConnect}
                      className="px-4 py-1 border border-dotted border-black rounded-full text-sm text-black bg-white hover:bg-gray-50 transition-colors"
                    >
                      Connect Account
                    </button>
                  </div>
                </div>

                {/* SeedId Current Maturation Overview Bar */}
                <div className="bg-gray-100 rounded-full px-6 py-3 mb-6 border border-dotted border-gray-400">
                  <p className="text-black text-center text-sm font-medium">
                    Seed {seedId} current maturation overview.
                  </p>
                </div>

                {/* Six Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {/* Row 1 */}
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-2">NUTRIENT RESERVE</p>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <span className="text-sm font-medium text-black">{stats.nutrientReserve}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-2">MINTING DATE</p>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <span className="text-sm font-medium text-black">{stats.mintingDate}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-2">TOTAL COMMITTED</p>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <span className="text-sm font-medium text-black">{stats.totalCommitted}</span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-2">CURRENT CLAIMABLE</p>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <span className="text-sm font-medium text-black">{stats.currentClaimable}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-2">MATURATION DATE</p>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <span className="text-sm font-medium text-black">{stats.maturationDate}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-2">PREMATURE PENALTY</p>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <span className="text-sm font-medium text-black">{stats.prematurePenalty}</span>
                    </div>
                  </div>
                </div>

                {/* Thank You Message */}
                <div className="text-center mb-6">
                  <p className="text-sm text-black leading-relaxed">
                    We Thank You & Appreciate You for nurturing<br />
                    The Way of Flowers<br />
                    & many precious<br />
                    ecosystems with us!
                  </p>
                </div>

                {/* Harvest Button */}
                <div className="text-center mb-4">
                  <Button
                    onClick={handleHarvest}
                    disabled={isProcessing}
                    className="bg-white border-2 border-dotted border-black text-black text-sm font-medium py-3 px-8 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        PROCESSING...
                      </div>
                    ) : (
                      "Harvest Nutrients"
                    )}
                  </Button>
                  <p className="text-xs text-gray-600 mt-2">WITHDRAW CLAIMABLE NUTRIENTS</p>
                </div>

                {/* Warning and Redirection */}
                <div className="text-center">
                  <p className="text-xs text-purple-600 mb-2">
                    PLEASE NOTE THE ACTION IS IRREVOCABLE & YOUR STEWARDED SEED WILL BECOME DORMANT. NO FURTHER EVOLUTIONS WILL BE POSSIBLE
                  </p>
                  <p className="text-xs text-gray-600">
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
