/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWalletConnection } from "@/lib/wallet/walletUtils";
import Image from "next/image";
import { assets } from "@/lib/assets";
import WalletConnectButton from "../auth/WalletConnectButton";

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function WalletConnectionModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: WalletConnectionModalProps) {
  const { handleConnect, isReady, isAuthenticated, canConnect } = useWalletConnection(onSuccess);

  const handleConnectClick = () => {
    handleConnect();
    // Close modal after initiating connection
    setTimeout(() => {
      onClose();
    }, 1000);
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
            <div className="bg-[#D9D9D9] rounded-tl-[40px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[40px] p-6 border-3 border-dotted border-gray-600 shadow-xl h-[600px]">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-light peridia-display-light text-black tracking-wider">Connect Wallet</h2>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                    <Image
                      src={assets.email || '/icons/email.svg'}
                      alt="Wallet"
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Connect your wallet to access all features
                  </p>
                </div>

                {/* Connection Methods */}
                <div className="space-y-3">
                  <button
                    onClick={handleConnectClick}
                    className="w-full p-4 rounded-[20px] border-2 border-black bg-white hover:bg-gray-50 transition-all relative"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Image
                          src="https://cdn.iconscout.com/icon/free/png-512/free-metamask-logo-icon-svg-download-png-2261817.png?f=webp&w=512"
                          alt="MetaMask"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-black">MetaMask</p>
                        <p className="text-xs text-gray-600">Connect using MetaMask</p>
                      </div>
                      {isAuthenticated && (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={handleConnectClick}
                    className="w-full p-4 rounded-[20px] border-2 border-gray-300 bg-white/60 hover:bg-white hover:border-gray-400 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Image
                          src="https://cdn.iconscout.com/icon/free/png-512/free-coinbase-logo-icon-svg-download-png-7651204.png?f=webp&w=512"
                          alt="Coinbase"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-black">Coinbase Wallet</p>
                        <p className="text-xs text-gray-600">Connect using Coinbase Wallet</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleConnectClick}
                    className="w-full p-4 rounded-[20px] border-2 border-gray-300 bg-white/60 hover:bg-white hover:border-gray-400 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Image
                          src="https://1000logos.net/wp-content/uploads/2022/05/WalletConnect-Logo-768x432.png"
                          alt="WalletConnect"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-black">WalletConnect</p>
                        <p className="text-xs text-gray-600">Connect using WalletConnect</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-300">.
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
