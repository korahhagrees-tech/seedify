/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePrivy } from '@privy-io/react-auth';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { prepareDepositToSeed } from "@/lib/api/services/writeService";
import { useWriteTransaction } from "@/lib/api/hooks/useWriteTransaction";
import { useAuth } from "@/components/auth/AuthProvider";
import Image from "next/image";
import { assets } from "@/lib/assets";
import { useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useSendTransaction, useWallets, useFundWallet } from "@privy-io/react-auth";
import { encodeFunctionData } from "viem";
import { SNAPSHOT_NFT_ABI, SNAP_FACTORY_ABI } from "@/lib/contracts";
import { base } from "viem/chains";
import WalletConnectionModal from "@/components/wallet/WalletConnectionModal";

// Contract addresses for conditional ABI logic
const SNAP_FACTORY_ADDRESS = "0x038cC19fF06F823B2037C7EFF239bE99aD99A01D"; // Uses mintSnapshot with royaltyRecipient
const SNAPSHOT_NFT_ADDRESS = "0x5203D3C460ba2d0156c97D8766cCE70b69eDd3A6"; // Uses mintSnapshot with projectCode

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  seedId?: string;
  amount?: number;
  onConfirm?: (amount: string) => void; // Callback for snapshot minting
  isSnapshotMint?: boolean; // Flag to indicate snapshot minting mode
  beneficiaryIndex?: number; // For snapshot minting
  beneficiaryCode?: string; // Beneficiary code (e.g., "01-GRG", "04-BUE")
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  seedId = "1", 
  amount = 50,
  onConfirm,
  isSnapshotMint = false,
  beneficiaryIndex,
  beneficiaryCode
}: PaymentModalProps) {
  const [email, setEmail] = useState("");
  const [amountInput, setAmountInput] = useState(amount ? amount.toString() : "0.011"); // Default ETH amount
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showWalletConnection, setShowWalletConnection] = useState(false);
  const { authenticated, login, logout } = usePrivy();
  const { execute } = useWriteTransaction();
  const { user, walletAddress, wallets: contextWallets, activeWallet, linkedAccounts } = useAuth();
  const router = useRouter();
  const { sendTransaction } = useSendTransaction();

  // Update amountInput when amount prop changes
  useEffect(() => {
    if (amount) {
      setAmountInput(amount.toString());
    }
  }, [amount]);
  
  const { wallets: privyWallets } = useWallets();
  const { writeContractAsync } = useWriteContract();
  const { fundWallet } = useFundWallet();
  
  // Use wallets from context (Zustand store) or fallback to Privy wallets
  const wallets = contextWallets.length > 0 ? contextWallets : privyWallets;
  
  // Get ETH balance from wagmi
  const { data: balanceData } = useBalance({
    address: walletAddress as `0x${string}`,
  });
  
  const balance = balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0.0000';

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWalletConnect = () => {
    setShowWalletConnection(true);
  };

  const handleAddFunds = async () => {
    if (walletAddress) {
      try {
        // Use Privy's fundWallet with Base chain (same logic as WalletModal)
        await fundWallet({
          address: walletAddress,
          options: {
            chain: base,
          }
        });
      } catch (error) {
        console.error('Failed to fund wallet:', error);
        toast.error('Failed to open funding flow');
      }
    }
  };

  const handleTransaction = async () => {
      setIsProcessing(true);
      
    try {
      // Use activeWallet from context (Zustand store), fallback to first wallet
      const currentActiveWallet = activeWallet || wallets[0];
      if (!currentActiveWallet) {
        toast.error("No active wallet found. Please connect your wallet.");
        setIsProcessing(false);
        return;
      }

      // If this is snapshot mint mode, trigger the appropriate transaction method
      if (isSnapshotMint && beneficiaryIndex !== undefined && seedId) {
        // Step 1: Get transaction data from backend
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
        const response = await fetch(`${apiBaseUrl}/write/snapshots/mint/${seedId}?beneficiaryIndex=${beneficiaryIndex}`);
        const mintData = await response.json();

        if (!mintData.success) {
          toast.error('Failed to prepare snapshot transaction');
          setIsProcessing(false);
          return;
        }

        // Convert user's ETH amount to wei
        const amountInWei = (parseFloat(amountInput) * 1e18).toString();

        // Debug: Log the backend data we received
        console.log('🔍 Backend mintData:', JSON.stringify(mintData, null, 2));
        console.log('🔍 Using beneficiaryIndex:', beneficiaryIndex);
        console.log('🔍 Using beneficiaryCode:', beneficiaryCode);
        console.log('🔍 User amount in wei:', amountInWei);
        console.log('🔍 Using royaltyRecipient from backend:', mintData.data.args.royaltyRecipient);

        // Detect wallet type and use appropriate transaction method
        // Embedded wallets include: email/social login wallets, privy embedded wallets
        const isEmbeddedWallet = currentActiveWallet.walletClientType === 'privy' || 
                                currentActiveWallet.connectorType === 'embedded' ||
                                currentActiveWallet.walletClientType === 'embedded' ||
                                // Additional checks for email/social login wallets
                                (currentActiveWallet.walletClientType && !['solana', 'metamask', 'coinbase_wallet', 'rainbow', 'wallet_connect'].includes(currentActiveWallet.walletClientType));
        const isSolanaWallet = currentActiveWallet.walletClientType === 'solana';
        let txHash: string | undefined;

        console.log('🔍 Wallet detection:', {
          walletClientType: currentActiveWallet.walletClientType,
          connectorType: currentActiveWallet.connectorType,
          isEmbeddedWallet,
          isSolanaWallet,
          address: currentActiveWallet.address,
          activeWalletFromContext: activeWallet?.address,
          // Additional debugging for embedded wallets
          allWallets: wallets.map(w => ({
            walletClientType: w.walletClientType,
            connectorType: w.connectorType,
            address: w.address
          }))
        });

        if (isSolanaWallet) {
          // For Solana wallets, use useSignAndSendTransaction
          toast.error('Solana wallets not supported for this transaction');
          setIsProcessing(false);
          return;
        } else if (isEmbeddedWallet) {
          console.log('🔄 Using embedded wallet flow for email/social login wallet');
          
          // Determine which contract we're interacting with
          const contractAddress = mintData.data.contractAddress.toLowerCase();
          const isSnapFactory = contractAddress === SNAP_FACTORY_ADDRESS.toLowerCase();
          const isSnapshotNFT = contractAddress === SNAPSHOT_NFT_ADDRESS.toLowerCase();
          
          console.log('🔍 Contract detection:', {
            contractAddress,
            isSnapFactory,
            isSnapshotNFT
          });

          // Use appropriate ABI based on contract address
          let simplifiedABI: any[];
          let transactionArgs: any[];

          if (isSnapFactory) {
            // SnapFactory ABI - uses royaltyRecipient instead of projectCode
            simplifiedABI = [
              {
                "type": "function",
                "name": "mintSnapshot",
                "stateMutability": "payable",
                "inputs": [
                  { "name": "seedId", "type": "uint256" },
                  { "name": "beneficiaryIndex", "type": "uint256" },
                  { "name": "process", "type": "string" },
                  { "name": "to", "type": "address" },
                  { "name": "royaltyRecipient", "type": "address" }
                ],
                "outputs": [{ "name": "", "type": "uint256" }]
              }
            ];
            
            transactionArgs = [
              BigInt(mintData.data.args.seedId),
              BigInt(beneficiaryIndex),
              mintData.data.processId,
              currentActiveWallet.address as `0x${string}`,
              mintData.data.args.royaltyRecipient as `0x${string}` // ✅ Use actual royaltyRecipient from backend
            ];
          } else {
            // SnapshotNFT ABI - uses value and projectCode
            simplifiedABI = [
              {
                "type": "function",
                "name": "mintSnapshot",
                "stateMutability": "nonpayable",
                "inputs": [
                  { "name": "seedId", "type": "uint256" },
                  { "name": "beneficiaryIndex", "type": "uint256" },
                  { "name": "processId", "type": "string" },
                  { "name": "to", "type": "address" },
                  { "name": "value", "type": "uint256" },
                  { "name": "projectCode", "type": "string" }
                ],
                "outputs": [{ "name": "", "type": "uint256" }]
              }
            ];
            
            transactionArgs = [
              BigInt(mintData.data.args.seedId),
              BigInt(beneficiaryIndex),
              mintData.data.processId,
              currentActiveWallet.address as `0x${string}`,
              BigInt(amountInWei),
              beneficiaryCode || "DEFAULT"
            ];
          }

          // For embedded wallets, use useSendTransaction with correct backend data
          try {
            const txResult = await sendTransaction(
              {
                to: mintData.data.contractAddress,
                value: isSnapFactory ? amountInWei : "0", // SnapFactory is payable, SnapshotNFT is not
                data: encodeFunctionData({
                  abi: simplifiedABI,
                  functionName: "mintSnapshot",
                  args: transactionArgs,
                })
              },
              {
                sponsor: true, // Enable gas sponsorship
                uiOptions: {
                  description: `Mint a snapshot for ${amountInput} ETH to support ecosystem regeneration`,
                  buttonText: "Mint Snapshot",
                  transactionInfo: {
                    title: "Transaction Details",
                    action: "Mint Snapshot",
                    contractInfo: {
                      name: "Way of Flowers",
                      url: "https://wayofflowers.com",
                    }
                  },
                  successHeader: "Snapshot Minted!",
                  successDescription: "Your contribution has been recorded and will help regenerate the ecosystem.",
                }
              }
            );
            
            txHash = txResult.hash;
            console.log('✅ Embedded wallet transaction hash:', txHash);
          } catch (embeddedError) {
            console.warn('⚠️ Embedded wallet transaction failed, falling back to external wallet flow:', embeddedError);
            // Fall through to external wallet flow below
            // Note: We'll use external wallet flow in the next condition
          }
        }

        // If embedded wallet failed or this is an external wallet, use external wallet flow
        if (!txHash) {
          console.log('🔄 Using external wallet flow (MetaMask, Coinbase, etc.)');
          // For external EVM wallets (MetaMask, Coinbase, etc.) or fallback for any EVM wallet
          // This will trigger the wallet's native transaction modal
          toast.info('Please confirm the transaction in your wallet...');
          
          try {
            // Determine which contract we're interacting with
            const contractAddress = mintData.data.contractAddress.toLowerCase();
            const isSnapFactory = contractAddress === SNAP_FACTORY_ADDRESS.toLowerCase();
            const isSnapshotNFT = contractAddress === SNAPSHOT_NFT_ADDRESS.toLowerCase();
            
            console.log('🔍 External wallet contract detection:', {
              contractAddress,
              isSnapFactory,
              isSnapshotNFT
            });

            // Use appropriate ABI based on contract address
            let comprehensiveABI: any[];
            let transactionArgs: any[];
            let valueToSend: bigint;

            if (isSnapFactory) {
              // SnapFactory ABI - uses royaltyRecipient
              comprehensiveABI = [
                {
                  "type": "function",
                  "name": "mintSnapshot",
                  "stateMutability": "payable",
                  "inputs": [
                    { "name": "seedId", "type": "uint256" },
                    { "name": "beneficiaryIndex", "type": "uint256" },
                    { "name": "process", "type": "string" },
                    { "name": "to", "type": "address" },
                    { "name": "royaltyRecipient", "type": "address" }
                  ],
                  "outputs": [{ "name": "", "type": "uint256" }]
                },
                {
                  "type": "function",
                  "name": "name",
                  "stateMutability": "view",
                  "inputs": [],
                  "outputs": [{ "name": "", "type": "string" }]
                }
              ];
              
              transactionArgs = [
                BigInt(mintData.data.args.seedId),
                BigInt(beneficiaryIndex),
                mintData.data.processId,
                currentActiveWallet.address as `0x${string}`,
                mintData.data.args.royaltyRecipient as `0x${string}` // ✅ Use actual royaltyRecipient from backend
              ];
              
              valueToSend = BigInt(amountInWei); // SnapFactory is payable
            } else {
              // SnapshotNFT ABI - uses value and projectCode
              comprehensiveABI = [
                {
                  "type": "function",
                  "name": "mintSnapshot",
                  "stateMutability": "nonpayable",
                  "inputs": [
                    { "name": "seedId", "type": "uint256" },
                    { "name": "beneficiaryIndex", "type": "uint256" },
                    { "name": "processId", "type": "string" },
                    { "name": "to", "type": "address" },
                    { "name": "value", "type": "uint256" },
                    { "name": "projectCode", "type": "string" }
                  ],
                  "outputs": [{ "name": "", "type": "uint256" }]
                },
                {
                  "type": "function",
                  "name": "name",
                  "stateMutability": "view",
                  "inputs": [],
                  "outputs": [{ "name": "", "type": "string" }]
                }
              ];
              
              transactionArgs = [
                BigInt(mintData.data.args.seedId),
                BigInt(beneficiaryIndex),
                mintData.data.processId,
                currentActiveWallet.address as `0x${string}`,
                BigInt(amountInWei),
                beneficiaryCode || "DEFAULT"
              ];
              
              valueToSend = BigInt(0); // SnapshotNFT is nonpayable
            }

            txHash = await writeContractAsync({
              address: mintData.data.contractAddress as `0x${string}`,
              abi: comprehensiveABI,
              functionName: "mintSnapshot",
              args: transactionArgs,
              value: valueToSend, // Dynamic: SnapFactory is payable, SnapshotNFT is nonpayable
              gas: undefined, // Let wallet estimate gas
            });

            toast.success('Transaction submitted! Waiting for confirmation...');
            console.log('✅ External wallet transaction hash:', txHash);
          } catch (error: any) {
            console.error('❌ External wallet transaction failed:', error);
            if (error?.code === 4001 || error?.message?.includes('User rejected')) {
              toast.error('Transaction rejected');
            } else if (error?.message?.includes('No embedded or connected wallet found')) {
              toast.error('Wallet connection issue. Please reconnect your wallet.');
            } else {
              toast.error('Transaction failed. Please try again.');
            }
            setIsProcessing(false);
            return;
          }
        }

        // Step 4: Call webhook with backend data + transaction hash
        if (txHash) {
          const webhookData = {
            contractAddress: mintData.data.contractAddress,
            seedId: mintData.data.args.seedId,
            snapshotId: mintData.data.snapshotId,
            beneficiaryCode: mintData.data.beneficiaryCode || `BENEFICIARY-${beneficiaryIndex}`,
            beneficiaryDistribution: mintData.data.beneficiaryDistribution || 0,
            creator: currentActiveWallet.address,
            txHash: txHash,
            timestamp: Math.floor(Date.now() / 1000),
            blockNumber: mintData.data.blockNumber,
            processId: mintData.data.processId,
          };

          console.log('🔗 Webhook data:', JSON.stringify(webhookData, null, 2));

          // Call webhook to trigger image generation
          try {
            const webhookResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'}/snapshot-minted`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(webhookData),
            });
            
            if (webhookResponse.ok) {
              console.log('✅ Webhook called successfully');
            } else {
              console.warn('⚠️ Webhook failed:', await webhookResponse.text());
            }
          } catch (webhookError) {
            console.warn('⚠️ Webhook error:', webhookError);
          }
        }

        // Transaction completed successfully
        toast.success('Snapshot minted successfully!');
        
        // Close payment modal and call callback
        onClose();
        if (onConfirm) {
          onConfirm(amountInput);
        }
      } else {
        // For non-snapshot minting, just call the callback
        if (onConfirm) {
          onConfirm(amountInput);
        }
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="payment-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="payment-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:scale-[1.05] md:scale-[1.05] scale-[0.98]"
          >
            {/* State 1: Disconnected Wallet */}
            {!authenticated ? (
              <div className="bg-gray-200 rounded-[40px] border-2 border-black border-dotted p-8 max-w-sm w-full mx-auto relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute -top-12 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                >
                  <span className="text-black text-lg font-bold">×</span>
                </button>
                
              {/* Header */}
                <h2 className="text-2xl text-black text-center -mt-6 peridia-display-light">
                Your Contribution
              </h2>

              {/* Informational Banner */}
                <div className="bg-white rounded-[20px] px-6 py-0 border-1 border-black/40 mb-6 mt-4">
                  <p className="text-black text-center text-sm font-medium uppercase favorit-mono text-nowrap scale-[0.7] -ml-8">
                  YOU ARE ABOUT TO SPRING FORTH A NEW GROWTH
                </p>
              </div>

              {/* Price and Allocation */}
              <div className="flex items-start gap-4 mb-6">
                {/* Price */}
                  <div className="bg-white rounded-full px-4 py-4 border-1 border-black/40 flex-none scale-[0.6] -ml-8 -mt-8 w-[165px]">
                    <div className="text-black text-[12px] font-light text-center items-center uppercase -mt-4 mb-1">PRICE</div>
                    <div className="text-black text-2xl font-light break-all whitespace-normal leading-tight">{amountInput} ETH</div>
                </div>

                {/* Allocation Breakdown */}
                  <div className="flex-1 -ml-22 scale-[0.6] -mt-6">
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase -mt-1">
                      50% SENT TO SELECTED ECOSYSTEM
                  </div>
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase -mt-1">
                    20% ACCUMULATES AS SEED COMPOST
                  </div>
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase -mt-1">
                    30% NURTURES THIS FLOURISHING
                  </div>
                </div>
              </div>

                {/* Email Input with inside label */}
                <div className="mb-6">
                <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white rounded-full px-4 py-3 text-black text-sm border-1 border-black/30 outline-none placeholder:text-black/50"
                      placeholder="user@mail.com"
                    />
                    <span className="absolute left-4 top-0 text-black text-[10px] favorit-mono uppercase">STAY IN TOUCH</span>
                  </div>
                </div>

                {/* Wallet Connect Button - Actually connects wallet */}
                <Button
                  onClick={async () => {
                    try {
                      if (authenticated) {
                        toast.success('Wallet already connected');
                      } else {
                        // Actually trigger wallet connection
                        await login();
                        toast.success('Wallet connected successfully!');
                      }
                    } catch (error) {
                      toast.error('Failed to connect wallet');
                      console.error('Wallet connection error:', error);
                    }
                  }}
                  className="w-full bg-gray-300 text-white text-xl font-medium py-8 rounded-[20px] hover:bg-gray-400 transition-colors"
                >
                  WALLET CONNECT
                </Button>
              </div>
            ) : (
              /* State 2: Connected Wallet */
              <div className="bg-[#f4e9e9] rounded-tl-[120px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[120px] p-6 border-3 border-dotted border-gray-600 shadow-xl max-w-sm w-full mx-auto relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors z-10"
                >
                  <span className="text-black text-xl font-bold">×</span>
                </button>
                
                {/* Header */}
                <h2 className="text-2xl text-black text-center mb-6 peridia-display-light">
                  Your Contribution
                </h2>

                {/* Wallet Details Section */}
                <div className="bg-white rounded-[40px] h-13 p-4 mb-6 border-1 border-black/60">
                  <p className="text-sm scale-[0.7] -ml-13 lg:mb-1 md:mb-1 mb-1 -mt-4 font-light text-black">YOUR WALLET</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 -mt-2">
                      <span className="text-base font-mono text-black">
                        {formatAddress(walletAddress || '')}
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center justify-center transition-colors"
                      >
                        <Image src={assets.copy} alt="Copy" width={12} height={12} className="w-4 h-4" />
                      </button>
                      {copied && <span className="text-xs text-green-600">Copied!</span>}
                    </div>
                    <div className="bg-gray-100 px-3 scale-[0.8] -mt-3 py-1 rounded-lg">
                      <span className="text-base text-nowrap scale-[1.3] font-light text-[#64668B] -mt-4">{balance} ETH</span>
                    </div>
                  </div>
                </div>

                {/* Email and Actions Section */}
                <div className="space-y-4 mb-6 bg-white/60 p-4 rounded-[40px] -mt-14 h-26">
                  <div className="flex items-center gap-2 mt-4">
                    <Image src={assets.email} alt="Email" width={16} height={16} className="w-4 h-4" />
                    <span className="text-sm text-black">{user?.email || formatAddress(walletAddress || '')}</span>
                  <button
                    onClick={handleAddFunds}
                    className="w-48 px-8 py-0 lg:-ml-1 md:-ml-1 -ml-6 mb-6 -mt-4 border-3 border-dotted border-gray-500 rounded-full text-xl text-black peridia-display-light bg-[#E2E3F0] hover:bg-gray-50 transition-colors scale-[0.7] text-nowrap"
                  >
                    A<span className="favorit-mono font-light text-nowrap">dd</span> F<span className="favorit-mono font-light text-nowrap">unds</span>
                  </button>
                  </div>
                    <button onClick={async () => {
                      onClose();
                      await logout();
                      // Force refresh to clear all state
                      setTimeout(() => {
                        window.location.href = "/";
                      }, 100);
                    }} className="flex items-center gap-2 text-sm text-black hover:text-gray-800 transition-colors -mt-6 -mb-3">
                      <Image src={assets.logout} alt="Logout" width={16} height={16} className="w-4 h-4" />
                      <span className="text-sm font-light text-nowrap">Log out</span>
                    </button>
                <button 
                  onClick={handleWalletConnect}
                  className="w-[50%] px-4 py-1 text-nowrap border-2 border-dotted border-black rounded-full text-sm lg:ml-40 md:ml-40 ml-36 -mt-34 text-black bg-white hover:bg-gray-50 transition-colors scale-[0.8]"
                >
                  <span className="lg:ml-0 md:ml-0 -ml-2">C</span><span className="favorit-mono font-light text-nowrap">onnect</span> A<span className="favorit-mono font-light text-nowrap">ccount</span>
                </button>
                </div>

                {/* Informational Banner - Different background */}
                <div className="bg-purple-200 rounded-[20px] px-6 py-0 mb-6 border-1 border-black/40">
                  <p className="text-black text-center text-sm font-medium uppercase favorit-mono text-nowrap scale-[0.7] -ml-8">
                    YOU ARE ABOUT TO SPRING FORTH A NEW GROWTH
                  </p>
                </div>

                {/* Price Input and Allocation */}
                <div className="flex items-start gap-4 mb-6">
                  {/* Price Input */}
                  <div className="bg-white rounded-full px-4 py-2 border-1 border-black/40 flex-none scale-[0.7] -ml-4 -mt-6 w-[165px]">
                    <div className="text-black text-[12px] font-medium uppercase mb-1 text-center">PRICE</div>
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                      className="text-black text-lg font-light bg-transparent border-none outline-none w-full"
                      placeholder="0.011"
                    />
                    <div className="text-black text-base mr-2 text-right -mt-8 font-light uppercase">ETH</div>
                  </div>

                  {/* Allocation Breakdown */}
                  <div className="flex-1 -ml-20 scale-[0.65] -mt-4">
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase mb-2 -mt-2">
                      50% SENT TO SELECTED ECOSYSTEM
                    </div>
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase mb-2 -mt-2">
                      20% ACCUMULATES AS SEED COMPOST
                    </div>
                    <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase -mt-2">
                      30% NURTURES THIS FLOURISHING
                    </div>
                </div>
              </div>

              {/* Email Input with inside label */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white rounded-full px-4 py-3 text-black text-sm border-1 border-black/30 outline-none mt-2 placeholder:text-black/50"
                    placeholder="user@mail.com"
                  />
                    <span className="absolute left-4 top-2 text-black text-[10px] favorit-mono uppercase">STAY IN TOUCH</span>
                </div>
              </div>

                {/* Confirm Contribution Button */}
               <Button
                 onClick={handleTransaction}
                 disabled={isProcessing}
                  className="w-2/3 text-wrap bg-white border-2 border-dotted border-black ml-10 text-black text-sm font-medium py-6 rounded-full hover:bg-gray-100 transition-colors peridia-display-light disabled:opacity-50"
               >
                 {isProcessing ? (
                   <div className="flex items-center justify-center gap-2">
                     <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                     PROCESSING...
                   </div>
                 ) : (
                    <span className="text-nowrap text-base -mt-1 -mb-2">C<span className="favorit-mono font-light text-nowrap">onfrim</span><br /> C<span className="favorit-mono font-light text-nowrap -mt-2">ontribution</span></span>
                 )}
               </Button>

                {/* Mint Your Own Artwork text */}
                <p className="text-center text-xs text-black/70 mt-2">
                  MINT YOUR OWN ARTWORK
                </p>
            </div>
            )}
          </motion.div>
        </>
      )}
      
      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={showWalletConnection}
        onClose={() => setShowWalletConnection(false)}
        onSuccess={() => {
          console.log('Wallet connected successfully from PaymentModal');
        }}
      />
    </AnimatePresence>
  );
}
