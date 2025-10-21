/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { assets } from "@/lib/assets";

interface Beneficiary {
  index: number;
  name: string;
  code: string;
  projectData: {
    title: string;
    backgroundImage: string;
  };
}

interface SeedCreationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (snapshotPrice: string, payableAmount: string) => void;
  selectedBeneficiaries: Beneficiary[];
  recipientAddress: string;
  seedPrice: string;
  seedFee: string;
  totalCost: string;
  defaultSnapshotPrice: string;
}

export default function SeedCreationConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  selectedBeneficiaries,
  recipientAddress,
  seedPrice,
  seedFee,
  totalCost,
  defaultSnapshotPrice
}: SeedCreationConfirmModalProps) {
  // Calculate fee amount dynamically based on seedPrice and seedFee
  const calculateFeeAmount = () => {
    try {
      const price = parseFloat(seedPrice);
      const fee = parseFloat(seedFee);
      if (isNaN(price) || isNaN(fee)) return '0.000000';
      // Fee is in basis points (e.g., 500 = 5%)
      // Formula: (seedPrice * seedFee) / 10000
      const feeAmount = (price * fee) / 10000;
      return feeAmount.toFixed(6);
    } catch {
      return '0.000000';
    }
  };

  // Calculate fee percentage for display
  const calculateFeePercentage = () => {
    try {
      const fee = parseFloat(seedFee);
      if (isNaN(fee)) return '0.0';
      // Convert basis points to percentage (500 basis points = 5%)
      return (fee / 100).toFixed(1);
    } catch {
      return '0.0';
    }
  };

  // No calculation needed - user enters payable amount directly

  const [snapshotPrice, setSnapshotPrice] = useState(defaultSnapshotPrice);
  const [payableAmount, setPayableAmount] = useState('0.0000099'); // Initialize with a reasonable default

  // Debug: Log the initial values
  console.log('🔍 [MODAL] Initial values:', {
    defaultSnapshotPrice,
    seedPrice,
    seedFee,
    userPayableAmount: payableAmount
  });

  const handleConfirm = () => {
    console.log('🔍 [MODAL] Confirming with values:', {
      snapshotPrice,
      payableAmount,
      snapshotPriceType: typeof snapshotPrice,
      payableAmountType: typeof payableAmount
    });
    onConfirm(snapshotPrice, payableAmount);
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format total cost to clean decimal places
  const formatTotalCost = () => {
    try {
      const cost = parseFloat(totalCost);
      if (isNaN(cost)) return '0.000000';
      // Show up to 6 decimal places, but remove trailing zeros
      return cost.toFixed(6).replace(/\.?0+$/, '') || '0';
    } catch {
      return '0.000000';
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="seed-confirm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="seed-confirm-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-x-6 -top-29 lg:-top-14 md:-top-18 -translate-y-1/2 z-50 max-w-lg mx-auto h-6"
          >
            {/* Modal Card */}
            <div className="bg-[#D9D9D9] rounded-tl-[120px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[120px] p-6 border-3 border-dotted border-gray-600 shadow-xl scale-[0.7] lg:scale-[0.85] md:scale-[0.8]">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors z-10"
              >
                <span className="text-black text-xl font-bold">×</span>
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-light peridia-display-light text-black tracking-wider">
                  Confirm Seed Creation
                </h2>
              </div>

              {/* Recipient Section */}
              <div className="bg-white/80 rounded-[20px] px-4 py-3 mb-4 border border-dotted border-gray-400">
                <p className="text-xs text-gray-600 mb-1 uppercase">RECIPIENT</p>
                <p className="text-sm text-black font-mono">{formatAddress(recipientAddress)}</p>
              </div>

              {/* Snapshot Price Input */}
              <div className="bg-white/80 rounded-[20px] px-4 py-3 mb-4 border border-dotted border-gray-400">
                <p className="text-xs text-gray-600 mb-2 uppercase">SNAPSHOT PRICE (ETH)</p>
                <input
                  type="number"
                  step="0.001"
                  min={defaultSnapshotPrice}
                  value={snapshotPrice}
                  onChange={(e) => setSnapshotPrice(e.target.value)}
                  className="w-full bg-transparent text-lg font-medium text-black outline-none border-none"
                  placeholder="0.011"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Price for future snapshots from this seed. Minimum: {defaultSnapshotPrice} ETH
                </p>
              </div>

              {/* Payable Amount Input */}
              <div className="bg-white/80 rounded-[20px] px-4 py-3 mb-4 border border-dotted border-gray-400">
                <p className="text-xs text-gray-600 mb-2 uppercase">PAYABLE AMOUNT (ETH)</p>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={payableAmount}
                  onChange={(e) => {
                    console.log('🔍 [MODAL] Payable amount changed:', e.target.value);
                    setPayableAmount(e.target.value);
                  }}
                  className="w-full bg-transparent text-lg font-medium text-black outline-none border-none"
                  placeholder="0.050"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Total ETH to send with transaction (covers snapshot price + seed price + fee)
                </p>
              </div>

              {/* Selected Beneficiaries */}
              <div className="bg-white/80 rounded-[20px] px-4 py-3 mb-4 border border-dotted border-gray-400">
                <p className="text-xs text-gray-600 mb-2 uppercase">SELECTED BENEFICIARIES (4)</p>
                <div className="space-y-2">
                  {selectedBeneficiaries.map((ben, idx) => (
                    <div key={ben.index} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-black truncate scale-[0.6] lg:scale-[0.9] md:scale-[0.8]">
                          {ben.projectData?.title || ben.name}
                        </p>
                        <p className="text-xs text-gray-500">{ben.code}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-purple-200/60 rounded-[20px] px-4 py-3 mb-6 border border-dotted border-gray-400">
                <p className="text-xs text-gray-700 mb-2 uppercase font-bold">TRANSACTION SUMMARY</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Snapshot Price:</span>
                    <span className="text-black font-medium">{snapshotPrice} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Seed Price:</span>
                    <span className="text-black font-medium">{seedPrice} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Fee ({calculateFeePercentage()}%):</span>
                    <span className="text-black font-medium">
                      {calculateFeeAmount()} ETH
                    </span>
                  </div>
                  <div className="border-t border-gray-400 pt-2 mt-2"></div>
                  <div className="flex justify-between text-base scale-[0.8] lg:scale-[1.15] md:scale-[1.1]">
                    <span className="text-black font-bold text-nowrap scale-[0.6] lg:scale-[0.8] md:scale-[0.8]">YOU'RE PAYING:</span>
                    <span className="text-black font-bold text-nowrap scale-[0.6] lg:scale-[0.8] md:scale-[0.8] -ml-4 lg:-ml-4 md:-ml-5">{payableAmount} ETH</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <p><strong>Seed Price:</strong> Base cost to create the seed NFT</p>
                  <p><strong>Snapshot Price:</strong> Price others pay to mint snapshots from your seed</p>
                  <p><strong>You're Paying:</strong> Total ETH you're sending with this transaction</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-300 text-black rounded-full text-sm font-medium hover:bg-gray-400 transition-colors peridia-display"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors peridia-display"
                >
                  Approve Transaction
                </button>
              </div>

              {/* Info Text */}
              <p className="text-center text-xs text-gray-600 mt-4">
                Your wallet will open to confirm this transaction
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

