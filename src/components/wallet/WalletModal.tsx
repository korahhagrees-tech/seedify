/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthProvider";
import { assets } from "@/lib/assets";
import WalletSelector from "./WalletSelector";
import AddFundsModal from "./AddFundsModal";
import { useWalletUtils, formatWalletAddress } from "@/lib/wallet/walletUtils";
import { useFundWallet, useWallets, useConnectWallet, useLogin, usePrivy } from "@privy-io/react-auth";
import { useBalance } from "wagmi";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { base } from "viem/chains";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onAddFunds: () => void;
  onExportKey: () => void;
  onSwitchWallet: () => void;
  onPrivyHome: () => void;
  onWalletConnect?: () => void;
}

export default function WalletModal({
  isOpen,
  onClose,
  onLogout,
  onAddFunds,
  onExportKey,
  onSwitchWallet,
  onPrivyHome,
  onWalletConnect
}: WalletModalProps) {
  const { user, walletAddress } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  
  // Use Privy hooks for wallet management
  const { wallets, ready } = useWallets(); // Get all connected wallets
  const { setActiveWallet } = useSetActiveWallet(); // Set active wallet for wagmi
  const { fundWallet } = useFundWallet();
  const { connectWallet } = useConnectWallet({
    onSuccess: ({ wallet }) => {
      console.log('✅ Wallet connected successfully:', wallet);
      // The newly connected wallet will automatically be available in the wallets array
      // User can switch to it via the wallet selector if needed
    },
    onError: (error) => {
      console.error('❌ Wallet connection failed:', error);
    },
  });
  
  // Get Privy instance for linking social accounts
  const { linkGoogle, linkTwitter, linkDiscord, linkGithub, linkApple, linkEmail, linkPasskey } = usePrivy();
  const { data: balanceData } = useBalance({
    address: walletAddress as `0x${string}`,
  });

  const { login } = useLogin({
    onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount }) => {
      console.log('User logged in successfully', user);
      console.log('Is new user:', isNewUser);
      console.log('Was already authenticated:', wasAlreadyAuthenticated);
      console.log('Login method:', loginMethod);
      console.log('Login account:', loginAccount);      
    },
    onError: (error) => {
      console.error('Login failed', error);
    }
  });
  
  const balance = balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0.0000';
  
  console.log('🔍 Connected wallets:', wallets.length, ready ? '(ready)' : '(loading)');
  
  
  const copyToClipboard = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSwitchWallet = () => {
    // If user has multiple wallets, show selector
    if (wallets.length > 1) {
      setShowWalletSelector(true);
    } else {
      // If user only has one wallet, help them connect additional wallets
      connectWallet({
        walletChainType: 'ethereum-and-solana', // Show both Ethereum and Solana wallets
      });
    }
  };

  const handleConnectAccount = () => {
    // Unified connection flow for both wallets and social accounts
    // This will open a modal/interface where users can choose to connect:
    // - Additional wallets (MetaMask, Coinbase, etc.)
    // - Social accounts (Google, Twitter, Discord, etc.)
    // - Email/SMS accounts
    // - Passkeys
    
    // For now, let's prioritize wallet connection but also show social options
    connectWallet({
      walletChainType: 'ethereum-and-solana',
    });
  };

  const handleLinkSocialAccount = async (provider: 'google' | 'twitter' | 'discord' | 'github' | 'apple') => {
    try {
      switch (provider) {
        case 'google':
          await linkGoogle();
          break;
        case 'twitter':
          await linkTwitter();
          break;
        case 'discord':
          await linkDiscord();
          break;
        case 'github':
          await linkGithub();
          break;
        case 'apple':
          await linkApple();
          break;
        default:
          console.warn('Unknown social provider:', provider);
      }
      console.log(`✅ Successfully linked ${provider} account`);
    } catch (error) {
      console.error(`❌ Failed to link ${provider} account:`, error);
    }
  };

  const handleLinkEmail = async () => {
    try {
      await linkEmail();
      console.log('✅ Successfully linked email account');
    } catch (error) {
      console.error('❌ Failed to link email account:', error);
    }
  };

  // Note: SMS linking is not available in the current Privy interface
  // const handleLinkSms = async () => {
  //   try {
  //     await linkSms();
  //     console.log('✅ Successfully linked SMS account');
  //   } catch (error) {
  //     console.error('❌ Failed to link SMS account:', error);
  //   }
  // };

  const handleLinkPasskey = async () => {
    try {
      await linkPasskey();
      console.log('✅ Successfully linked passkey');
    } catch (error) {
      console.error('❌ Failed to link passkey:', error);
    }
  };

  const handleWalletSelect = (wallet: any) => {
    setActiveWallet(wallet);
    setShowWalletSelector(false);
    console.log('Selected wallet:', wallet);
  };


  const handleAddFunds = async () => {
    if (walletAddress) {
      try {
        // Use Privy's fundWallet with Base chain
        await fundWallet({address: walletAddress, options: {
          chain: base,
        }});
      } catch (error) {
        console.error('Failed to fund wallet:', error);
        // Fallback to modal if needed
        setShowAddFunds(true);
      }
    }
  };

  const handleExportKey = async () => {
    // For now, just call the parent handler
    onExportKey();
  };

  const formatAddress = (address: string) => {
    return formatWalletAddress(address);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="wallet-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 z-40 backdrop-blur-xs"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            key="wallet-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-x-6 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
          >
            {/* Single card with asymmetric rounding and dotted border */}
            <div className="bg-[#D9D9D9] rounded-tl-[120px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[120px] p-6 border-3 border-dotted border-gray-600 shadow-xl scale-[1.05]">
              {/* Header */}
              <div className="text-center mb-6 -mt-4">
                <h2 className="text-2xl text-right font-light peridia-display-light text-black tracking-wider">Rooted Wallet</h2>
              </div>

              {/* Wallet Address and Balance Bar */}
              <div className="bg-white rounded-[40px] h-13 p-4 mb-6 border-1 border-black/60">
                <p className="text-sm mb-1 -mt-4 font-light text-black -ml-6 lg:ml-0 md:-ml-2 scale-[0.75] lg:scale-[1.0] md:scale-[0.8]">YOUR WALLET</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 -mt-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center transition-colors scale-[0.75] lg:scale-[1.0] md:scale-[0.8]"
                    >
                    <span className="text-base font-mono text-black">
                      {formatAddress(walletAddress || '')}
                    </span>
                      <Image src={assets.copy} alt="Copy" width={12} height={12} className="w-4 h-4" />
                    </button>
                    {copied && <span className="text-xs text-green-600">Copied!</span>}
                  </div>
                  <div className="bg-gray-100 px-3 scale-[0.8] -mt-3 py-1 rounded-lg">
                    <span className="text-base scale-[1.3] font-light text-nowrap text-[#64668B] -mt-4">{balance} ETH</span>
                  </div>
                </div>
              </div>

              {/* Email and Private Key Section */}
              <div className="space-y-4 mb-6 bg-white/60 p-4 rounded-[40px] -mt-14 h-32">
                <div className="flex items-center gap-2 mt-4">
                  <Image src={assets.email} alt="Email" width={16} height={16} className="w-4 h-4" />
                  <span className="text-sm text-black">{user?.email || formatAddress(walletAddress || '')}</span>
                <button
                  onClick={handleSwitchWallet}
                  className="w-[30%] ml-12 px-2 py-1 border border-gray-400 rounded-full text-base text-black hover:bg-gray-50 transition-colors peridia-display-light bg-[#E2E3F0] flex flex-col mt-3 scale-[0.75] lg:scale-[1.0] md:scale-[0.8]"
                >
                  <span className="text-base scale-[1.05] font-light -mt-2">
                    {wallets.length > 1 ? 'Switch' : 'Change'}
                  </span>
                  <span className="text-base scale-[1.05] font-light -mt-2 -mb-1">
                    {wallets.length > 1 ? 'Wallet' : 'Address'}
                  </span>
                </button>
                </div>
                <div className="flex items-center gap-2 -mt-5">
                  <Image src={assets.key} alt="Key" width={16} height={16} className="w-4 h-4" />
                  <button onClick={handleExportKey} className="text-sm text-black hover:text-gray-900 transition-colors">
                    Export private key
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6 -mt-9">
                <button
                  onClick={onPrivyHome}
                  className="w-[32%] px-4 py-1 border-1 border-black rounded-full text-sm text-black hover:bg-gray-50 transition-colors -mt-14  h-6 peridia-display-light bg-[#E2E3F0]"
                >
                  <p className="-mt-1 text-nowrap -ml-2 lg:ml-0 md:-ml-2 scale-[0.75] lg:scale-[1.0] md:scale-[0.8]">  
                    P<span className="favorit-mono">rivy</span> H<span className="favorit-mono">ome</span>
                  </p>
                </button>
                <div className="w-[50%] ml-14 scale-[0.75] lg:scale-[1.0] md:scale-[0.8]">
                  <button
                    onClick={handleConnectAccount}
                    className="w-full px-4 py-2 border-3 border-dotted border-black rounded-full text-sm text-black bg-[#E2E3F0] hover:bg-gray-50 transition-colors peridia-display text-nowrap"
                  >
                    <span className="-ml-2 lg:ml-0 md:-ml-2">Connect Account</span>
                  </button>
                </div>
              </div>

              {/* Social Account Linking Options */}
              <div className="space-y-2 mb-4 -mt-6">
                <p className="text-xs text-center text-black/70 uppercase favorit-mono">Link Additional Accounts</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {/* Social Login Buttons */}
                  <button
                    onClick={() => handleLinkSocialAccount('google')}
                    className="px-3 py-1 text-xs border border-gray-400 rounded-full text-black hover:bg-gray-50 transition-colors bg-white/60"
                  >
                    Google
                  </button>
                  <button
                    onClick={() => handleLinkSocialAccount('twitter')}
                    className="px-3 py-1 text-xs border border-gray-400 rounded-full text-black hover:bg-gray-50 transition-colors bg-white/60"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => handleLinkSocialAccount('discord')}
                    className="px-3 py-1 text-xs border border-gray-400 rounded-full text-black hover:bg-gray-50 transition-colors bg-white/60"
                  >
                    Discord
                  </button>
                  <button
                    onClick={() => handleLinkSocialAccount('github')}
                    className="px-3 py-1 text-xs border border-gray-400 rounded-full text-black hover:bg-gray-50 transition-colors bg-white/60"
                  >
                    GitHub
                  </button>
                  <button
                    onClick={() => handleLinkEmail()}
                    className="px-3 py-1 text-xs border border-gray-400 rounded-full text-black hover:bg-gray-50 transition-colors bg-white/60"
                  >
                    Email
                  </button>
                  {/* SMS linking not available in current Privy interface */}
                  {/* <button
                    onClick={() => handleLinkSms()}
                    className="px-3 py-1 text-xs border border-gray-400 rounded-full text-black hover:bg-gray-50 transition-colors bg-white/60"
                  >
                    SMS
                  </button> */}
                  <button
                    onClick={() => handleLinkPasskey()}
                    className="px-3 py-1 text-xs border border-gray-400 rounded-full text-black hover:bg-gray-50 transition-colors bg-white/60"
                  >
                    Passkey
                  </button>
                </div>
              </div>

              {/* Log out */}
              <div className="flex items-center gap-2">
                <button onClick={onLogout} className="flex items-center gap-2 text-sm text-black hover:text-gray-800 transition-colors -mb-12">
                  <Image src={assets.logout} alt="Logout" width={16} height={16} className="w-4 h-4" />
                  <span className="text-sm font-light text-nowrap">Log out</span>
                </button>
                <button
                  onClick={handleAddFunds}
                  className="w-48 px-4 py-2 ml-4 -mb-2 border-3 border-dotted border-gray-500 rounded-full text-2xl text-black peridia-display-light bg-white hover:bg-gray-50 transition-colors scale-[0.75] lg:scale-[1.0] md:scale-[0.8]"
                >
                  A<span className="favorit-mono font-light text-nowrap">dd</span> F<span className="favorit-mono font-light text-nowrap">unds</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
      
      {/* Wallet Selector Modal */}
      <WalletSelector
        isOpen={showWalletSelector}
        onClose={() => setShowWalletSelector(false)}
        onWalletSelect={handleWalletSelect}
        currentWalletId={walletAddress || ''}
      />
      
      
      {/* Add Funds Modal */}
      <AddFundsModal
        isOpen={showAddFunds}
        onClose={() => setShowAddFunds(false)}
        walletAddress={walletAddress || undefined}
      />
    </AnimatePresence>
  );
}
