"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { getUserWallets, getWalletDisplayName, formatWalletAddress, Wallet } from "@/lib/wallet/walletUtils";
import Image from "next/image";
import { assets } from "@/lib/assets";

interface WalletSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletSelect: (wallet: Wallet) => void;
  currentWalletId?: string;
}

export default function WalletSelector({ 
  isOpen, 
  onClose, 
  onWalletSelect,
  currentWalletId 
}: WalletSelectorProps) {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWallets = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userWallets = await getUserWallets(user.id);
      setWallets(userWallets);
    } catch (err) {
      console.error('Failed to load wallets:', err);
      setError('Failed to load wallets. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isOpen && user?.id) {
      loadWallets();
    }
  }, [isOpen, user?.id, loadWallets]);


  const handleWalletSelect = (wallet: Wallet) => {
    onWalletSelect(wallet);
    onClose();
  };

  const getWalletIcon = (wallet: Wallet) => {
    // You can add more wallet icons based on wallet_client_type
    switch (wallet.wallet_client_type) {
      case 'metamask':
        return '/icons/metamask.svg';
      case 'coinbase':
        return '/icons/coinbase.svg';
      default:
        return assets.email || '/icons/email.svg';
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
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
          >
            <div className="bg-[#D9D9D9] rounded-tl-[40px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[40px] p-6 border-3 border-dotted border-gray-600 shadow-xl">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-light peridia-display-light text-black tracking-wider">Select Wallet</h2>
              </div>

              {/* Content */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-gray-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Loading wallets...</p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-8">
                    <p className="text-sm text-red-600 mb-4">{error}</p>
                    <button
                      onClick={loadWallets}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {!loading && !error && wallets.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-600 mb-4">No wallets found</p>
                    <p className="text-xs text-gray-500">Connect a wallet to get started</p>
                  </div>
                )}

                {!loading && !error && wallets.map((wallet) => (
                  <motion.button
                    key={wallet.id}
                    onClick={() => handleWalletSelect(wallet)}
                    className={`w-full p-4 rounded-[20px] border-2 transition-all ${
                      currentWalletId === wallet.id
                        ? 'border-black bg-white'
                        : 'border-gray-300 bg-white/60 hover:border-gray-400 hover:bg-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
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
                          {formatWalletAddress(wallet.address)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {wallet.chain_type.toUpperCase()}
                        </p>
                      </div>
                      {currentWalletId === wallet.id && (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-300">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-gray-200 text-black rounded-[20px] text-sm font-medium hover:bg-gray-300 transition-colors"
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
