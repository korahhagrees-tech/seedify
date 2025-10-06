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
            {/* Outer rounded card with dotted border style */}
            <div className="bg-gray-100 rounded-[36px] p-5 border-3 border-dotted border-gray-400 shadow-xl">
              {/* Inner panel with asymmetric rounding (top-left/bottom-right more rounded) */}
              <div className="bg-white rounded-[28px] p-4 md:p-6 border-1 border-gray-200 shadow-sm">
                {/* Header */}
                <div className="text-left mb-4">
                  <h2 className="text-sm tracking-wide text-gray-700">YOUR WALLET</h2>
                </div>

                {/* Wallet Address Row */}
                <div className="bg-white rounded-[20px] border-1 border-gray-200 p-3 mb-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-mono text-gray-900">
                        {formatAddress(walletAddress || '')}
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Image src="/file.svg" alt="Copy" width={12} height={12} className="w-3 h-3" />
                      </button>
                      {copied && <span className="text-xs text-green-600">Copied!</span>}
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-gray-700">{balance || '0.000'} ETH</span>
                    </div>
                  </div>
                </div>

                {/* Email and action buttons */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Image src="/file.svg" alt="Email" width={16} height={16} className="w-4 h-4" />
                    <span className="text-sm text-gray-800">{user?.email || 'bilbo.bagz@shire.io'}</span>
                  </div>
                  <button
                    onClick={onSwitchWallet}
                    className="px-4 py-2 border-1 border-gray-300 rounded-full text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    Change Address
                  </button>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Image src="/file.svg" alt="Key" width={16} height={16} className="w-4 h-4" />
                    <button onClick={onExportKey} className="text-sm text-gray-800">Export private key</button>
                  </div>
                  <button
                    onClick={onPrivyHome}
                    className="px-4 py-2 border-3 border-dotted border-gray-400 rounded-full text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    Wallet Connect
                  </button>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between">
                  <button onClick={onLogout} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
                    <span>↪</span>
                    <span>Log out</span>
                  </button>
                  <button
                    onClick={onAddFunds}
                    className="px-8 py-3 border-3 border-dotted border-gray-500 rounded-full text-base text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Add Funds
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
