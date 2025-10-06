/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Write Transaction Hook
 * Custom hook to simplify write transaction execution with wallet
 */

'use client';

import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import type { Abi } from 'viem';
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

  const execute = async (txData: WriteTransactionData): Promise<string> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    setTxHash(null);

    try {
      // Execute the transaction directly with writeContractAsync
      const txConfig: any = {
        address: txData.contractAddress as `0x${string}`,
        functionName: txData.functionName,
        args: txData.args,
      };

      // If backend didn't provide ABI, use a minimal fallback for SeedFactory.depositForSeed
      // This prevents encodeFunctionData from crashing on undefined ABI
      if (!('abi' in txData) || !(txData as any).abi) {
        const fallbackAbi: Abi = [
          {
            type: 'function',
            name: 'depositForSeed',
            stateMutability: 'payable',
            inputs: [
              { name: 'seedId', type: 'uint256' },
            ],
            outputs: [],
          },
        ];
        (txConfig as any).abi = fallbackAbi;
      } else {
        (txConfig as any).abi = (txData as any).abi as Abi;
      }
      
      // Only include value if it's not "0"
      if (txData.value !== "0") {
        txConfig.value = BigInt(txData.value);
      }
      
      const hash = await writeContractAsync(txConfig);

      console.log('✍️ [WRITE-HOOK] Transaction submitted:', hash);

      setTxHash(hash);
      setIsSuccess(true);
      setIsLoading(false);
      return hash;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transaction failed');
      console.error('✍️ [WRITE-HOOK] Transaction failed:', error);
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

