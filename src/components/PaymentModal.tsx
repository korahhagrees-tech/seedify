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
import { clearAppStorage } from "@/lib/auth/logoutUtils";
import Image from "next/image";
import { assets } from "@/lib/assets";
import { useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useSendTransaction, useWallets, useFundWallet } from "@privy-io/react-auth";
import { encodeFunctionData } from "viem";
import { SNAPSHOT_NFT_ABI, SNAP_FACTORY_ABI } from "@/lib/contracts";
import { base } from "viem/chains";
import WalletConnectionModal from "@/components/wallet/WalletConnectionModal";
import { waitForTransactionReceipt } from "@wagmi/core";
import { wagmiConfig } from "@/lib/wagmi/config";

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
  const { ready, authenticated, login, logout } = usePrivy();
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
    chainId: base.id,
  });

  const balance = balanceData ? parseFloat(balanceData.formatted).toFixed(4) : '0.0000';

  const formatAddress = (address: string) => {
    if (!address) return '';
    // If it's an email address, don't format it as a wallet address
    if (address.includes('@')) return address;
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
      // Defensive readiness/authentication checks (no flow changes)
      if (!ready) {
        toast.info('Setting up wallet... Please wait.');
        setIsProcessing(false);
        return;
      }
      if (!authenticated) {
        toast.info('Please connect your wallet to continue.');
        setIsProcessing(false);
        setShowWalletConnection(true);
        return;
      }

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

        // Smart amount handling: Use backend's exact wei if user hasn't changed the amount
        let amountInWei: string;
        const backendValueEth = mintData.data.valueEth || "0.011"; // Fallback to default

        if (amountInput === backendValueEth) {
          // User hasn't changed the amount → Use backend's exact wei value (no precision loss)
          amountInWei = mintData.data.value;
          console.log('🎯 Using backend\'s exact wei value (no conversion):', amountInWei);
        } else {
          // User changed the amount → Convert their new value to wei
          amountInWei = (parseFloat(amountInput) * 1e18).toString();
          console.log('🔄 User changed amount, converting to wei:', amountInWei);
        }

        // Debug: Log the backend data we received
        console.log('🔍 Backend mintData:', JSON.stringify(mintData, null, 2));
        console.log('🔍 Backend valueEth:', backendValueEth);
        console.log('🔍 User input:', amountInput);
        console.log('🔍 Amounts match:', amountInput === backendValueEth);
        console.log('🔍 Using beneficiaryIndex:', beneficiaryIndex);
        console.log('🔍 Using beneficiaryCode:', beneficiaryCode);
        console.log('🔍 Final amountInWei:', amountInWei);
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
        // const reciept = await waitForTransactionReceipt(config, { hash: txHash as `0x${string}` });
        // const reciept = await fetch(`${process.env.RPC_URL}`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     jsonrpc: '2.0',
        //     id: `${txHash}`,
        //     method: 'eth_getTransactionReceipt',
        //     params: [txHash],
        //   }),
        // }).then(response => response.json()).then(data => data.result);

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
            console.error('❌ Embedded wallet transaction failed:', embeddedError);
            toast.error('Transaction failed. Please try again or switch to an external wallet.');
            setIsProcessing(false);
            return;
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
            }
            // else if (reciept.status === '0x0') {
            //   toast.error('Transaction failed. Please try again.');
            // }
            else {
              toast.error('Transaction failed. Please try again.');
            }
            setIsProcessing(false);
            return;
          }
        }

        // Step 4: Verify transaction status using Alchemy API before proceeding
        if (txHash) {
          console.log('🔍 Verifying transaction status for hash:', txHash);
          toast.info('Verifying transaction... Please wait.');

          try {
            // Use Moralis API for reliable transaction verification
            let transactionData = null;
            const maxAttempts = 12; // 12 attempts = ~1 minute max wait
            let attempts = 0;
            const startTime = Date.now();
            const maxWaitTime = 120000; // 2 minutes maximum wait

            while (attempts < maxAttempts && !transactionData && (Date.now() - startTime) < maxWaitTime) {
              try {
                const apiKey = process.env.MORALIS_API_KEY;

                const response = await fetch(`https://deep-index.moralis.io/api/v2.2/transaction/${txHash}?chain=base`, {
                  method: 'GET',
                  headers: {
                    'accept': 'application/json',
                    'X-API-Key': `${apiKey}`,
                  },
                });

                if (response.ok) {
                  const data = await response.json();
                  console.log(`🔍 Moralis response:`, data);

                  // Check if transaction is confirmed (has receipt_status)
                  if (data.receipt_status !== undefined) {
                    transactionData = data;
                    break;
                  } else {
                    console.log(`⏳ Transaction not yet confirmed, waiting...`);
                  }
                } else {
                  console.warn(`⚠️ Moralis API returned ${response.status}: ${response.statusText}`);
                  if (response.status === 401) {
                    console.warn('🔑 API key may be invalid or missing');
                  } else if (response.status === 429) {
                    console.warn('⏳ Rate limit exceeded, waiting longer...');
                    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds for rate limit
                  }
                }

                // Wait 5 seconds before next attempt
                await new Promise(resolve => setTimeout(resolve, 5000));
                attempts++;
              } catch (fetchError) {
                console.warn(`🔍 Moralis attempt ${attempts + 1} failed:`, fetchError);
                await new Promise(resolve => setTimeout(resolve, 5000));
                attempts++;
              }
            }

            // Check if we timed out
            if (!transactionData && (Date.now() - startTime) >= maxWaitTime) {
              console.error('❌ Transaction verification timed out after 2 minutes');
              toast.error('Transaction verification timed out. Please check your wallet or try again.');
              setIsProcessing(false);
              return;
            }

            // Fallback to original RPC method if Moralis fails
            if (!transactionData) {
              console.warn('⚠️ Moralis API failed, trying fallback RPC method...');

              try {
                const response = await fetch(process.env.RPC_URL || '', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: `tx-${txHash}`,
                    method: 'eth_getTransactionReceipt',
                    params: [txHash],
                  }),
                });

                const data = await response.json();
                if (data.result) {
                  console.log('✅ Fallback RPC method succeeded:', data.result);
                  // Convert RPC receipt to Moralis-like format
                  transactionData = {
                    receipt_status: data.result.status,
                    block_number: data.result.blockNumber,
                    receipt_gas_used: data.result.gasUsed,
                    gas_price: data.result.effectiveGasPrice,
                  };
                }
              } catch (fallbackError) {
                console.warn('⚠️ Fallback RPC method also failed:', fallbackError);
              }
            }

            if (!transactionData) {
              console.error('❌ All verification methods failed - cannot verify transaction status');
              toast.error('Failed to verify transaction. Please check your wallet or try again.');
              setIsProcessing(false);
              return;
            }

            // Check transaction status if data is available
            if (transactionData) {
              const receiptStatus = transactionData.receipt_status;
              console.log('🔍 Moralis receipt_status:', receiptStatus);
              console.log('🔍 Full transaction data:', transactionData);

              if (receiptStatus === "0") {
                console.error('❌ Transaction failed (receipt_status: 0)');
                toast.error('Transaction failed. Please try again.');
                setIsProcessing(false);
                return;
              } else if (receiptStatus === "1") {
                console.log('✅ Transaction successful (receipt_status: 1)');
              } else {
                console.warn('⚠️ Unknown transaction status:', receiptStatus, 'proceeding optimistically');
              }
            } else {
              console.log('⚠️ No transaction data available, proceeding with optimistic flow');
            }

            // Transaction is confirmed successful, proceed with webhook data
            const webhookData = {
              contractAddress: mintData.data.contractAddress,
              seedId: mintData.data.args.seedId,
              snapshotId: mintData.data.snapshotId,
              beneficiaryCode: mintData.data.beneficiaryCode || `BENEFICIARY-${beneficiaryIndex}`,
              beneficiaryDistribution: mintData.data.beneficiaryDistribution || 0,
              creator: currentActiveWallet.address,
              txHash: txHash,
              timestamp: Math.floor(Date.now() / 1000),
              blockNumber: transactionData?.block_number || mintData.data.blockNumber,
              processId: mintData.data.processId,
              // Add transaction verification data from Moralis
              transactionStatus: transactionData?.receipt_status || 'pending',
              gasUsed: transactionData?.receipt_gas_used || '0',
              effectiveGasPrice: transactionData?.gas_price || '0',
              transactionFee: transactionData?.transaction_fee || '0',
            };

            console.log('🔗 Verified webhook data:', JSON.stringify(webhookData, null, 2));

            // Store webhook data for way-of-flowers page to use
            if (seedId) {
              localStorage.setItem(`webhook_data_${seedId}`, JSON.stringify(webhookData));
              console.log('🔗 Verified webhook data stored for way-of-flowers page:', seedId);
            }

            // Trigger wallet snapshots refresh if available
            if (typeof window !== 'undefined' && (window as any).refreshWalletSnapshots) {
              console.log('🔄 Triggering wallet snapshots refresh...');
              try {
                (window as any).refreshWalletSnapshots();
              } catch (refreshError) {
                console.warn('⚠️ Failed to refresh wallet snapshots:', refreshError);
              }
            }

          } catch (verificationError) {
            console.error('❌ Transaction verification failed:', verificationError);
            toast.error('Failed to verify transaction. Please check your wallet or try again.');
            setIsProcessing(false);
            return;
          }
        }

        // Transaction completed successfully
        toast.success('Snapshot minted successfully!');

        // Close payment modal and call callback
        console.log('🎯 [PaymentModal] Transaction completed, calling onConfirm callback');
        onClose();
        if (onConfirm) {
          console.log('🎯 [PaymentModal] Calling onConfirm with amount:', amountInput);
          onConfirm(amountInput);
        } else {
          console.log('⚠️ [PaymentModal] No onConfirm callback provided');
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
    <>
      <AnimatePresence mode="wait">
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
                  <div className="bg-[#D3C9DE] rounded-[20px] px-6 py-0 border-1 border-black/40 mb-6 mt-4">
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
                        {copied && <span className="text-[8px] text-green-600">Copied!</span>}
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
                      <span className="text-sm text-black">
                        {typeof user?.email === 'string' ? user.email : formatAddress(walletAddress || '')}
                      </span>
                      <button
                        onClick={handleAddFunds}
                        className="w-48 px-8 py-0 lg:-ml-1 md:-ml-1 -ml-6 mb-6 -mt-4 border-3 border-dotted border-gray-500 rounded-full text-xl text-black peridia-display-light bg-[#F2EAF8] hover:bg-gray-50 transition-colors scale-[0.7] text-nowrap"
                      >
                        A<span className="favorit-mono font-light text-nowrap">dd</span> F<span className="favorit-mono font-light text-nowrap">unds</span>
                      </button>
                    </div>
                    <button onClick={async () => {
                      onClose();
                      clearAppStorage();
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
                      <p className="text-nowrap text-center scale-[0.8] lg:scale-[1.0] md:scale-[0.8]">
                        <span className="lg:ml-0 md:ml-0 -ml-2">C</span><span className="favorit-mono font-light text-nowrap">onnect</span> W<span className="favorit-mono font-light text-nowrap">allet</span>
                      </p>
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
      </AnimatePresence>

      {/* Wallet Connection Modal - Outside AnimatePresence */}
      {showWalletConnection && (
        <WalletConnectionModal
          isOpen={showWalletConnection}
          onClose={() => setShowWalletConnection(false)}
          onSuccess={() => {
            console.log('Wallet connected successfully from PaymentModal');
          }}
        />
      )}
    </>
  );
}
