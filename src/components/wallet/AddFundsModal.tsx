/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  initiateOnramp, 
  createTOSAgreement, 
  OnrampRequest,
  OnrampResponse,
  formatCurrencyAmount,
  getPaymentRailDisplayName,
  getChainDisplayName,
  isTOSAccepted
} from "@/lib/wallet/fiatRampUtils";
import Image from "next/image";
import { assets } from "@/lib/assets";

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
  const [step, setStep] = useState<'tos' | 'amount' | 'payment' | 'instructions'>('tos');
  const [amount, setAmount] = useState('100.00');
  const [currency, setCurrency] = useState<'usd' | 'eur'>('usd');
  const [paymentRail, setPaymentRail] = useState<'ach_push' | 'sepa' | 'wire'>('ach_push');
  const [chain, setChain] = useState<'ethereum' | 'base' | 'arbitrum' | 'polygon' | 'optimism'>('base');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onrampResult, setOnrampResult] = useState<OnrampResponse | null>(null);
  const [tosUrl, setTosUrl] = useState<string | null>(null);

  const checkTOS = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const tosResponse = await createTOSAgreement(user.id, 'bridge-sandbox');
      
      if (isTOSAccepted(tosResponse)) {
        setStep('amount');
      } else if (tosResponse.url) {
        setTosUrl(tosResponse.url);
        setStep('tos');
      }
    } catch (err) {
      console.error('Failed to check TOS:', err);
      setError('Failed to initialize. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check TOS on mount
  useEffect(() => {
    if (isOpen && user?.id) {
      checkTOS();
    }
  }, [isOpen, user?.id, checkTOS]);


  const handleAcceptTOS = () => {
    if (tosUrl) {
      window.open(tosUrl, '_blank');
    }
    // Move to next step after opening TOS
    setTimeout(() => {
      setStep('amount');
    }, 1000);
  };

  const handleContinueToPayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setStep('payment');
  };

  const handleInitiateOnramp = async () => {
    if (!user?.id || !walletAddress) {
      setError('User or wallet not found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: OnrampRequest = {
        amount: amount,
        provider: 'bridge-sandbox',
        source: {
          payment_rail: paymentRail,
          currency: currency
        },
        destination: {
          chain: chain,
          currency: 'usdc',
          to_address: walletAddress
        }
      };

      const result = await initiateOnramp(user.id, request);
      setOnrampResult(result);
      setStep('instructions');
    } catch (err) {
      console.error('Failed to initiate onramp:', err);
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTOSStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-black mb-2">Terms of Service</h3>
        <p className="text-sm text-gray-600 mb-6">
          Before adding funds, please review and accept the terms of service.
        </p>
      </div>
      <button
        onClick={handleAcceptTOS}
        disabled={loading}
        className="w-full px-4 py-3 bg-black text-white rounded-[20px] text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Review Terms of Service'}
      </button>
    </div>
  );

  const renderAmountStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-black mb-2">Amount</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-[20px] border-2 border-gray-300 focus:border-black focus:outline-none text-black"
            placeholder="100.00"
            step="0.01"
            min="0"
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'usd' | 'eur')}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent text-black font-medium focus:outline-none"
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-2">Payment Method</label>
        <select
          value={paymentRail}
          onChange={(e) => setPaymentRail(e.target.value as any)}
          className="w-full px-4 py-3 rounded-[20px] border-2 border-gray-300 focus:border-black focus:outline-none text-black"
        >
          <option value="ach_push">ACH (US Bank Transfer)</option>
          <option value="sepa">SEPA (European Transfer)</option>
          <option value="wire">Wire Transfer</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-2">Network</label>
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value as any)}
          className="w-full px-4 py-3 rounded-[20px] border-2 border-gray-300 focus:border-black focus:outline-none text-black"
        >
          <option value="base">Base</option>
          <option value="ethereum">Ethereum</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="polygon">Polygon</option>
          <option value="optimism">Optimism</option>
        </select>
      </div>

      <button
        onClick={handleContinueToPayment}
        className="w-[70%] px-4 py-2 ml-12 bg-white border-2 border-black border-dotted text-black rounded-[20px] text-2xl font-light hover:bg-gray-200 transition-colors mt-6 peridia-display-light"
      >
        C<span className="favorit-mono font-light">ontinue</span>
      </button>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <div className="bg-white/60 rounded-[20px] p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Amount</span>
          <span className="text-base font-medium text-black">
            {formatCurrencyAmount(amount, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Payment Method</span>
          <span className="text-base font-medium text-black">
            {getPaymentRailDisplayName(paymentRail)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Network</span>
          <span className="text-base font-medium text-black">
            {getChainDisplayName(chain)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Receive</span>
          <span className="text-base font-medium text-black">USDC</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep('amount')}
          className="flex-1 px-4 py-3 bg-gray-200 text-black rounded-[20px] text-sm font-medium hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleInitiateOnramp}
          disabled={loading}
          className="flex-1 px-4 py-3 bg-black text-white rounded-[20px] text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Get Deposit Instructions'}
        </button>
      </div>
    </div>
  );

  const renderInstructionsStep = () => {
    if (!onrampResult) return null;

    const instructions = onrampResult.deposit_instructions;

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-black mb-2">Deposit Instructions</h3>
          <p className="text-sm text-gray-600">
            Transfer funds to the following account
          </p>
        </div>

        <div className="bg-white/60 rounded-[20px] p-4 space-y-3 max-h-96 overflow-y-auto">
          {instructions.bank_name && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Bank Name</div>
              <div className="text-sm font-medium text-black">{instructions.bank_name}</div>
            </div>
          )}
          {instructions.bank_account_number && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Account Number</div>
              <div className="text-sm font-mono font-medium text-black">{instructions.bank_account_number}</div>
            </div>
          )}
          {instructions.bank_routing_number && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Routing Number</div>
              <div className="text-sm font-mono font-medium text-black">{instructions.bank_routing_number}</div>
            </div>
          )}
          {instructions.iban && (
            <div>
              <div className="text-xs text-gray-500 mb-1">IBAN</div>
              <div className="text-sm font-mono font-medium text-black">{instructions.iban}</div>
            </div>
          )}
          {instructions.bic && (
            <div>
              <div className="text-xs text-gray-500 mb-1">BIC/SWIFT</div>
              <div className="text-sm font-mono font-medium text-black">{instructions.bic}</div>
            </div>
          )}
          {instructions.deposit_message && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3">
              <div className="text-xs text-yellow-800 font-medium mb-1">⚠️ Important: Include this reference</div>
              <div className="text-sm font-mono font-bold text-yellow-900">{instructions.deposit_message}</div>
            </div>
          )}
          <div>
            <div className="text-xs text-gray-500 mb-1">Amount to Send</div>
            <div className="text-base font-bold text-black">
              {formatCurrencyAmount(instructions.amount, instructions.currency)}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            💡 <strong>Status:</strong> {onrampResult.status.replace(/_/g, ' ').toUpperCase()}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Your funds will be converted to USDC and sent to your wallet once the transfer is complete.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-black text-white rounded-[20px] text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Done
        </button>
      </div>
    );
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
            <div className="bg-[#D9D9D9] rounded-tl-[40px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[40px] p-6 border-3 border-dotted border-gray-600 shadow-xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-light peridia-display-light text-black tracking-wider">Add Funds</h2>
                {error && (
                  <p className="text-sm text-red-600 mt-2">{error}</p>
                )}
              </div>

              {/* Content based on step */}
              {step === 'tos' && renderTOSStep()}
              {step === 'amount' && renderAmountStep()}
              {step === 'payment' && renderPaymentStep()}
              {step === 'instructions' && renderInstructionsStep()}

              {/* Footer */}
              {step !== 'instructions' && (
                <div className="-mt-4 pt-4 border-t border-gray-300">
                  <button
                    onClick={onClose}
                    className="w-full px-4 py-2 text-black text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
