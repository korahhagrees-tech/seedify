/**
 * Write Transaction Hook
 * Custom hook to simplify write transaction execution with wallet
 */

'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { executeTransaction } from '../services/writeService';
import { WriteTransactionData } from '@/types/api';

interface UseWriteTransactionResult {
  execute: (txData: WriteTransactionData) => Promise<string>;
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
  txHash: string | null;
}

/**
 * Hook to execute write transactions with wallet
 * 
 * @example
 * ```typescript
 * const { execute, isLoading, isSuccess, error } = useWriteTransaction();
 * 
 * async function handleMint() {
 *   const txData = await prepareMintSnapshot({...});
 *   await execute(txData);
 * }
 * ```
 */
export function useWriteTransaction(): UseWriteTransactionResult {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();
  const { waitForTransactionReceipt: waitForTransactionReceiptAsync } = useWaitForTransactionReceipt();

  const execute = async (txData: WriteTransactionData): Promise<string> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    setTxHash(null);

    try {
      const hash = await executeTransaction({
        transactionData: txData,
        writeContract: writeContractAsync,
        waitForTransactionReceipt: waitForTransactionReceiptAsync as any,
      });

      setTxHash(hash);
      setIsSuccess(true);
      setIsLoading(false);
      return hash;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transaction failed');
      setError(error);
      setIsLoading(false);
      throw error;
    }
  };

  return {
    execute,
    isLoading,
    isSuccess,
    error,
    txHash,
  };
}

