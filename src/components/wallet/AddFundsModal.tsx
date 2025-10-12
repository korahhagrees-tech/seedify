/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { useFundWallet } from "@privy-io/react-auth";


interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress?: string;
}

export default function AddFundsModal({ 
  isOpen, 
  onClose,
  walletAddress 
}: AddFundsModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('0.01');
  const [currency, setCurrency] = useState<'usd' | 'eur'>('usd');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use Privy's fundWallet hook with callback
  const { fundWallet } = useFundWallet({
    onUserExited: () => {
      console.log('User exited funding flow');
      setLoading(false);
      // You can add custom logic here based on the result
      onClose();
    }
  });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAmount('0.01');
      setCurrency('usd');
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleAddFunds = async () => {
    if (!walletAddress) {
      setError('Wallet address not found');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use Privy's fundWallet with configuration
      await fundWallet({ address: walletAddress });
    } catch (err) {
      console.error('Failed to initiate funding:', err);
      setError('Failed to start funding process. Please try again.');
      setLoading(false);
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
            className="fixed inset-0 bg-black/20 z-50 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-[60] max-w-sm mx-auto"
          >
            <div className="bg-[#D9D9D9] rounded-tl-[40px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[40px] p-6 border-3 border-dotted border-gray-600 shadow-xl">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light peridia-display-light text-black tracking-wider">Add Funds</h2>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-3 rounded-[20px] border-2 border-gray-300 focus:border-black focus:outline-none text-black"
                      placeholder="0.01"
                      step="0.01"
                      min="0"
                      disabled={loading}
                    />
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as 'usd' | 'eur')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent text-black font-medium focus:outline-none"
                      disabled={loading}
                    >
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                    </select>
                  </div>
                </div>

                {/* Network Info */}
                <div className="bg-white/60 rounded-[20px] p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Network</span>
                    <span className="text-base font-medium text-black">Base</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Receive</span>
                    <span className="text-base font-medium text-black">
                      {currency === 'usd' ? 'USDC' : 'ETH'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Wallet</span>
                    <span className="text-sm font-mono text-black">
                      {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not connected'}
                    </span>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gray-200 text-black rounded-[20px] text-sm font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFunds}
                    disabled={loading || !walletAddress}
                    className="flex-1 px-4 py-3 bg-black text-white rounded-[20px] text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Starting...' : 'Add Funds'}
                  </button>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    💡 Privy will handle the payment process and show you funding options including card payments and bank transfers.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}