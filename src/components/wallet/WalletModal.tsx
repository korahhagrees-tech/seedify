/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthProvider";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onAddFunds: () => void;
  onExportKey: () => void;
  onSwitchWallet: () => void;
  onPrivyHome: () => void;
}

export default function WalletModal({
  isOpen,
  onClose,
  onLogout,
  onAddFunds,
  onExportKey,
  onSwitchWallet,
  onPrivyHome
}: WalletModalProps) {
  const { user, walletAddress, balance } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-gray-300 shadow-xl">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">YOUR WALLET</h2>
              </div>

              {/* Wallet Address Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-700">
                      {formatAddress(walletAddress || '')}
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Image
                        src="/file.svg"
                        alt="Copy"
                        width={12}
                        height={12}
                        className="w-3 h-3"
                      />
                    </button>
                    {copied && (
                      <span className="text-xs text-green-600">Copied!</span>
                    )}
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-gray-700">
                      {balance || '0.000'} ETH
                    </span>
                  </div>
                </div>
              </div>

              {/* Email and Privy Section */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/file.svg"
                    alt="Email"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">
                    {user?.email || 'bilbo.bagz@shire.io'}
                  </span>
                </div>
                <button
                  onClick={onPrivyHome}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Privy Home
                </button>
              </div>

              {/* Key Management Section */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Image
                    src="/file.svg"
                    alt="Key"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Export key</span>
                </div>
                <button
                  onClick={onSwitchWallet}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-400 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Switch Wallet
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <span>Log out</span>
                  <span>→</span>
                </button>
                <button
                  onClick={onAddFunds}
                  className="px-6 py-2 border-2 border-dashed border-gray-400 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Add Funds
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
