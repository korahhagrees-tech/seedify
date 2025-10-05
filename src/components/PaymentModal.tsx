"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePrivy } from '@privy-io/react-auth';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const { authenticated } = usePrivy();
  const { execute } = useWriteTransaction();
  const router = useRouter();

  const handleTransaction = async () => {
    try {
      setIsProcessing(true);
      
      // Prepare transaction data
      console.log('Calling prepareDepositToSeed with:', { seedId, amount: amount.toString() });
      
      let txData;
      try {
        txData = await prepareDepositToSeed(seedId, {
          amount: amount.toString()
        });
      } catch (apiError) {
        console.warn('Backend API not available, using mock transaction data:', apiError);
        
        // Mock transaction data for testing when backend is not available
        txData = {
          contractAddress: "0xF9CBaA0CEFeADf4BCf4dBDC6810c19C92e4688f8", // SeedFactory address from schema
          functionName: "depositToSeed",
          args: [BigInt(seedId), BigInt(amount.toString())],
          value: "0",
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
      
      // Handle error (could show toast notification)
      alert(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                <div className="bg-white rounded-full px-8 py-2 border-1 border-black/40 flex-shrink-2 scale-[0.8] -ml-4 -mt-6">
                  <div className="text-black text-xs font-medium uppercase mb-1">PRICE</div>
                  <div className="text-black text-2xl font-bold">€{amount}</div>
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

              {/* Email Input */}
              <div className="mb-6">
                <label className="text-black text-xs text-nowrap favorit-mono font-medium uppercase block mb-2 top-8">
                  ENTER YOUR EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white rounded-[20px] px-4 py-3 text-black text-sm border-none outline-none"
                  placeholder="user@mail.com"
                />
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
