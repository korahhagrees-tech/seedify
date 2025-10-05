"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePrivy } from '@privy-io/react-auth';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { prepareDepositToSeed } from "@/lib/api/services/writeService";
import { useWriteTransaction } from "@/lib/api/hooks/useWriteTransaction";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  seedId?: string;
  amount?: number;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  seedId = "1", 
  amount = 50 
}: PaymentModalProps) {
  const [email, setEmail] = useState("");
  const [amountInput, setAmountInput] = useState(String(amount));
  const [isProcessing, setIsProcessing] = useState(false);
  const { authenticated } = usePrivy();
  const { execute } = useWriteTransaction();
  const router = useRouter();

  const handleTransaction = async () => {
    try {
      setIsProcessing(true);
      
      // Prepare transaction data
      console.log('Calling prepareDepositToSeed with:', { seedId, amount: amountInput });
      
      let txData;
      try {
        txData = await prepareDepositToSeed(seedId, {
          amount: amountInput
        });
      } catch (apiError) {
        console.warn('Backend API not available, using mock transaction data:', apiError);
        
        // Mock transaction data for testing when backend is not available
        txData = {
          contractAddress: "0xF9CBaA0CEFeADf4BCf4dBDC6810c19C92e4688f8", // SeedFactory address from schema
          functionName: "depositForSeed",
          args: [BigInt(parseEther(amountInput)), BigInt(seedId)],
          value: String(parseEther(amountInput)),
          description: "Deposit to seed"
        };
      }

      console.log('Transaction data prepared:', txData);
      console.log('Transaction data structure:', {
        contractAddress: txData.contractAddress,
        functionName: txData.functionName,
        args: txData.args,
        value: txData.value,
        description: txData.description
      });

      // Validate transaction data
      if (!txData.contractAddress || !txData.functionName || !Array.isArray(txData.args)) {
        throw new Error('Invalid transaction data received from backend');
      }

      // Execute the transaction
      const hash = await execute(txData);
      console.log('Transaction executed:', hash);
      toast.success('Transaction submitted', { description: 'Waiting for confirmation…' });

      // Route to Way of Flowers with transaction hash
      router.push(`/way-of-flowers/${seedId}?txHash=${hash}`);
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('Transaction failed:', error);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      toast.error('Transaction failed', { description: error instanceof Error ? error.message : 'Unknown error' });
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 scale-[1.1]"
          >
            <div className="bg-gray-200 rounded-[40px] p-8 max-w-sm w-full mx-auto">
              {/* Header */}
              <h2 className="text-2xl text-black text-center font-serif mb-6 peridia-display">
                Your Contribution
              </h2>

              {/* Informational Banner */}
              <div className="bg-white rounded-[20px] px-6 py-2 mb-6">
                <p className="text-black text-center text-sm font-medium uppercase favorit-mono text-nowrap scale-[0.8] -ml-8">
                  YOU ARE ABOUT TO SPRING FORTH A NEW GROWTH
                </p>
              </div>

              {/* Price and Allocation */}
              <div className="flex items-start gap-4 mb-6">
                {/* Price */}
                <div className="bg-white rounded-full px-4 py-2 border-1 border-black/40 flex-none scale-[0.8] -ml-4 -mt-6 w-[100px]">
                  <div className="text-black text-[10px] font-medium uppercase mb-1">PRICE</div>
                  <div className="text-black text-2xl font-bold break-all whitespace-normal leading-tight">€{amountInput}</div>
                </div>

                {/* Allocation Breakdown */}
                <div className="flex-1 -ml-16 scale-[0.7] -mt-6">
                  <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase mb-2">
                    50% SENT TO YOUR SELECTED ECOSYSTEM
                  </div>
                  <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase mb-2">
                    20% ACCUMULATES AS SEED COMPOST
                  </div>
                  <div className="text-black text-base text-nowrap favorit-mono font-medium uppercase">
                    30% NURTURES THIS FLOURISHING
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full bg-white rounded-[20px] px-4 py-3 text-black text-sm border-1 border-black/30 outline-none pr-16"
                    placeholder="Enter amount"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/70 text-xs uppercase favorit-mono">ETH</span>
                </div>
              </div>

              {/* Email Input with inside label */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white rounded-[20px] px-4 py-5 text-black text-sm border-1 border-black/30 outline-none placeholder:text-black/50"
                    placeholder="user@mail.com"
                  />
                  <span className="absolute left-4 top-2 text-black text-[10px] favorit-mono uppercase">ENTER YOUR EMAIL ADDRESS</span>
                </div>
              </div>

               {/* Pay/Deposit Button */}
               <Button
                 onClick={handleTransaction}
                 disabled={isProcessing}
                 className="w-full bg-gray-300 text-black text-sm font-medium py-4 rounded-[20px] hover:bg-gray-400 transition-colors disabled:opacity-50"
               >
                 {isProcessing ? (
                   <div className="flex items-center justify-center gap-2">
                     <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                     PROCESSING...
                   </div>
                 ) : (
                   "PAY / DEPOSIT"
                 )}
               </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
