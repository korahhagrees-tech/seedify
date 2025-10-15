/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWalletConnection, getWalletDisplayName, formatWalletAddress } from "@/lib/wallet/walletUtils";
import Image from "next/image";
import { assets } from "@/lib/assets";
import { useAuth } from "@/components/auth/AuthProvider";
import { useConnectWallet } from "@privy-io/react-auth";

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
  const { wallets, activeWallet, setActiveWallet } = useAuth();
  
  // Debug logging
  useEffect(() => {
    console.log('🔍 [WalletConnectionModal] Wallets updated:', wallets);
    console.log('🔍 [WalletConnectionModal] Wallet count:', wallets?.length || 0);
    if (wallets?.length > 0) {
      wallets.forEach((wallet, index) => {
        console.log(`🔍 [WalletConnectionModal] Wallet ${index}:`, {
          address: wallet.address,
          walletClientType: wallet.walletClientType,
          connectorType: wallet.connectorType,
          meta: wallet.meta
        });
      });
    }
  }, [wallets]);
  const { connectWallet } = useConnectWallet({
    onSuccess: ({ wallet }) => {
      console.log("✅ Wallet connected successfully:", wallet);
      onSuccess?.();
    },
    onError: (error) => {
      console.error("❌ Wallet connection failed:", error);
    },
  });

  const handleConnectNewWallet = () => {
    connectWallet({
      walletChainType: "ethereum-and-solana",
    });
  };

  const handleSelectWallet = (wallet: any) => {
    setActiveWallet(wallet);
    onClose();
  };

  const getWalletIcon = (wallet: any) => {
    // Check meta.icon first (most reliable)
    if (wallet.meta?.icon) {
      return wallet.meta.icon;
    }
    
    // Check walletClientType (camelCase from Privy)
    const walletType = wallet.walletClientType || wallet.wallet_client_type;
    switch (walletType) {
      case 'metamask':
        return 'https://cdn.iconscout.com/icon/free/png-512/free-metamask-logo-icon-svg-download-png-2261817.png?f=webp&w=512';
      case 'coinbase_wallet':
      case 'coinbase':
        return 'https://cdn.iconscout.com/icon/free/png-512/free-coinbase-logo-icon-svg-download-png-7651204.png?f=webp&w=512';
      case 'wallet_connect':
      case 'walletconnect':
        return 'https://1000logos.net/wp-content/uploads/2022/05/WalletConnect-Logo-768x432.png';
      case 'rainbow':
        return 'https://avatars.githubusercontent.com/u/49955922?s=200&v=4';
      case 'privy':
        return assets.email;
      default:
        return assets.email;
    }
  };

  const getWalletTypeBadge = (wallet: any) => {
    // Check meta.name first for most accurate label
    if (wallet.meta?.name) {
      const name = wallet.meta.name.toLowerCase();
      if (name.includes('metamask')) {
        return { label: 'MetaMask', color: 'bg-orange-100 text-orange-700' };
      } else if (name.includes('coinbase')) {
        return { label: 'Coinbase Wallet', color: 'bg-blue-100 text-blue-700' };
      } else if (name.includes('rainbow')) {
        return { label: 'Rainbow', color: 'bg-pink-100 text-pink-700' };
      } else if (name.includes('walletconnect')) {
        return { label: 'WalletConnect', color: 'bg-indigo-100 text-indigo-700' };
      }
    }
    
    const walletType = wallet.walletClientType || wallet.wallet_client_type;
    const connectorType = wallet.connectorType;
    
    if (walletType === 'privy' || connectorType === 'embedded') {
      return { label: 'Embedded Wallet', color: 'bg-purple-100 text-purple-700' };
    } else if (walletType === 'metamask') {
      return { label: 'MetaMask', color: 'bg-orange-100 text-orange-700' };
    } else if (walletType === 'coinbase_wallet' || walletType === 'coinbase') {
      return { label: 'Coinbase Wallet', color: 'bg-blue-100 text-blue-700' };
    } else if (walletType === 'wallet_connect' || walletType === 'walletconnect') {
      return { label: 'WalletConnect', color: 'bg-indigo-100 text-indigo-700' };
    } else if (walletType === 'rainbow') {
      return { label: 'Rainbow', color: 'bg-pink-100 text-pink-700' };
    } else if (connectorType === 'injected') {
      return { label: 'Browser Wallet', color: 'bg-gray-100 text-gray-700' };
    } else {
      return { label: 'External Wallet', color: 'bg-gray-100 text-gray-700' };
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
            <div className="bg-[#D9D9D9] rounded-tl-[40px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[40px] p-6 border-3 border-dotted border-gray-600 shadow-xl max-h-[600px] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-light peridia-display-light text-black tracking-wider">
                  {wallets.length > 0 ? 'Your Wallets' : 'Connect Wallet'}
                </h2>
                <p className="text-xs text-gray-600 mt-2">
                  {wallets.length > 0 ? `${wallets.length} wallet${wallets.length > 1 ? 's' : ''} connected` : 'No wallets connected yet'}
                </p>
                {/* Debug info - remove in production */}
                <p className="text-[10px] text-gray-500 mt-1 font-mono">
                  Debug: {wallets.map((w, i) => `${i}:${getWalletDisplayName(w)}`).join(', ')}
                </p>
              </div>

              {/* Content - Scrollable wallet list */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] mb-4">
                {wallets.length === 0 ? (
                  <div className="text-center py-8">
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
                      Connect your first wallet to get started
                    </p>
                  </div>
                ) : (
                  <>
                    {wallets.map((wallet, index) => {
                      const walletAddress = typeof wallet.address === 'string' ? wallet.address : (wallet.address as any)?.toString?.() || `wallet-${index}`;
                      const isActive = activeWallet?.address === walletAddress;
                      const badge = getWalletTypeBadge(wallet);
                      
                      return (
                        <button
                          key={walletAddress}
                          onClick={() => handleSelectWallet(wallet)}
                          className={`w-full p-4 rounded-[20px] border-2 transition-all hover:scale-[0.98] active:scale-[0.96] ${
                            isActive
                              ? 'border-black bg-white'
                              : 'border-gray-300 bg-white/60 hover:border-gray-400 hover:bg-white'
                          }`}
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
                                {formatWalletAddress(walletAddress)}
                              </p>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.color}`}>
                                {badge.label}
                              </span>
                            </div>
                            {isActive && (
                              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Footer - Connect New Wallet Button */}
              <div className="pt-4 border-t border-gray-300 space-y-3">
                <button
                  onClick={handleConnectNewWallet}
                  className="w-full px-4 py-3 bg-black text-white rounded-[20px] text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  + Connect New Wallet
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-transparent text-black text-sm font-medium hover:bg-gray-200 transition-colors rounded-[20px]"
                >
                  {wallets.length > 0 ? 'Done' : 'Cancel'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
