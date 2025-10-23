/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getWalletDisplayName,
  formatWalletAddress,
} from "@/lib/wallet/walletUtils";
import { useWallets } from "@privy-io/react-auth";
import Image from "next/image";
import { assets } from "@/lib/assets";

interface WalletSelectorProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onWalletSelectAction: (wallet: any) => void;
  currentWalletId?: string;
}

export default function WalletSelector({
  isOpen,
  onCloseAction,
  onWalletSelectAction,
  currentWalletId,
}: WalletSelectorProps) {
  const { user, wallets: contextWallets } = useAuth();
  const { wallets: privyWallets, ready } = useWallets(); // Get all connected wallets from Privy
  const [error, setError] = useState<string | null>(null);

  // Use wallets from context (Zustand store) which has the most up-to-date list
  const wallets = contextWallets.length > 0 ? contextWallets : privyWallets;

  console.log(
    "🔍 WalletSelector - Context wallets:",
    contextWallets.length,
    "Privy wallets:",
    privyWallets.length,
    "Ready:",
    ready
  );
  console.log("🔍 WalletSelector - Using wallets:", wallets.length, wallets);

  const handleWalletSelect = (wallet: any) => {
    onWalletSelectAction(wallet);
    onCloseAction();
  };

  const getWalletIcon = (wallet: any) => {
    // Handle Privy wallet structure
    const walletType = wallet.walletClientType || wallet.wallet_client_type;
    switch (walletType) {
      case "metamask":
        return "https://cdn.iconscout.com/icon/free/png-512/free-metamask-logo-icon-svg-download-png-2261817.png?f=webp&w=512";
      case "coinbase":
        return "https://cdn.iconscout.com/icon/free/png-512/free-coinbase-logo-icon-svg-download-png-7651204.png?f=webp&w=512";
      case "privy":
        return assets.email;
      default:
        return assets.email;
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
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-xs"
            onClick={onCloseAction}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="bg-[#D9D9D9] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-tl-[40px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[40px] p-6 border-3 border-dotted border-gray-600 shadow-xl">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-light peridia-display-light text-black tracking-wider">
                  Select Wallet
                </h2>
              </div>

              {/* Content */}
              <div className="space-y-3 max-h-80 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {error && (
                  <div className="text-center py-8">
                    <p className="text-sm text-red-600 mb-4">{error}</p>
                  </div>
                )}

                {!ready && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-600 mb-4">
                      Loading wallets...
                    </p>
                  </div>
                )}

                {ready && wallets.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-600 mb-4">
                      No wallets found
                    </p>
                    <p className="text-xs text-gray-500">
                      Connect a wallet to get started
                    </p>
                  </div>
                )}

                {wallets.map((wallet, index) => {
                  const walletAddress =
                    typeof wallet.address === "string"
                      ? wallet.address
                      : (wallet.address as any)?.toString?.() ||
                        `wallet-${index}`;
                  return (
                    <button
                      key={walletAddress}
                      onClick={() => handleWalletSelect(wallet)}
                      className={`w-full p-4 rounded-[20px] border-2 transition-all hover:scale-[0.98] active:scale-[0.96] ${
                        currentWalletId === walletAddress
                          ? "border-black bg-white"
                          : "border-gray-300 bg-white/60 hover:border-gray-400 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <Image
                            src={getWalletIcon(wallet)}
                            alt="Wallet"
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-black">
                            {getWalletDisplayName(wallet)}
                          </p>
                          <p className="text-xs text-gray-600 font-mono">
                            {formatWalletAddress(walletAddress)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(wallet as any).chainType?.toUpperCase() || "EVM"}
                          </p>
                        </div>
                        {currentWalletId === walletAddress && (
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-300">
                <button
                  onClick={onCloseAction}
                  className="w-full px-4 py-2 bg-none text-black text-sm font-medium hover:bg-transparent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
