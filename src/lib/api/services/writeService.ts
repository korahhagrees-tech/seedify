/**
 * Write Service
 * Handles write operations that prepare transaction data for wallet execution
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import {
  WriteTransactionResponse,
  WriteTransactionData,
  CreateSeedRequest,
  DepositRequest,
  WithdrawRequest,
  MintSnapshotRequest,
} from '@/types/api';

/**
 * Prepare transaction data for creating a seed
 */
export async function prepareCreateSeed(
  request: CreateSeedRequest
): Promise<WriteTransactionData> {
  console.log('✍️ [WRITE-SERVICE] Preparing create seed transaction:', request);

  const response = await apiClient.post<WriteTransactionResponse>(
    API_ENDPOINTS.writeCreateSeed,
    request
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Failed to prepare transaction');
  }

  console.log('✍️ [WRITE-SERVICE] Transaction data prepared:', response.data);
  return response.data;
}

/**
 * Prepare transaction data for depositing to a seed
 */
export async function prepareDepositToSeed(
  seedId: string,
  request: DepositRequest
): Promise<WriteTransactionData> {
  console.log('✍️ [WRITE-SERVICE] Preparing deposit transaction:', seedId, request);

  const response = await apiClient.post<WriteTransactionResponse>(
    API_ENDPOINTS.writeDepositToSeed(seedId),
    request
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Failed to prepare transaction');
  }

  console.log('✍️ [WRITE-SERVICE] Transaction data prepared:', response.data);
  return response.data;
}

/**
 * Prepare transaction data for withdrawing from a seed
 */
export async function prepareWithdrawFromSeed(
  seedId: string,
  request: WithdrawRequest
): Promise<WriteTransactionData> {
  console.log('✍️ [WRITE-SERVICE] Preparing withdraw transaction:', seedId, request);

  const response = await apiClient.post<WriteTransactionResponse>(
    API_ENDPOINTS.writeWithdrawFromSeed(seedId),
    request
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Failed to prepare transaction');
  }

  console.log('✍️ [WRITE-SERVICE] Transaction data prepared:', response.data);
  return response.data;
}

/**
 * Prepare transaction data for claiming seed profits
 */
export async function prepareClaimProfits(
  seedId: string
): Promise<WriteTransactionData> {
  console.log('✍️ [WRITE-SERVICE] Preparing claim profits transaction:', seedId);

  const response = await apiClient.post<WriteTransactionResponse>(
    API_ENDPOINTS.writeClaimProfits(seedId)
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Failed to prepare transaction');
  }

  console.log('✍️ [WRITE-SERVICE] Transaction data prepared:', response.data);
  return response.data;
}

/**
 * Prepare transaction data for minting a snapshot
 */
export async function prepareMintSnapshot(
  request: MintSnapshotRequest
): Promise<WriteTransactionData> {
  console.log('✍️ [WRITE-SERVICE] Preparing mint snapshot transaction:', request);

  const response = await apiClient.post<WriteTransactionResponse>(
    API_ENDPOINTS.writeMintSnapshot,
    request
  );

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Failed to prepare transaction');
  }

  console.log('✍️ [WRITE-SERVICE] Transaction data prepared:', response.data);
  return response.data;
}

/**
 * Execute a write transaction using wagmi/viem
 * This helper function will be used by components to execute the prepared transaction
 */
export interface ExecuteTransactionParams {
  transactionData: WriteTransactionData;
  writeContract: any; // wagmi's writeContract function
  waitForTransactionReceipt: any; // wagmi's waitForTransactionReceipt function
}

export async function executeTransaction({
  transactionData,
  writeContract,
  waitForTransactionReceipt,
}: ExecuteTransactionParams): Promise<string> {
  console.log('✍️ [WRITE-SERVICE] Executing transaction:', transactionData);

  try {
    // Execute the transaction
    const hash = await writeContract({
      address: transactionData.contractAddress as `0x${string}`,
      functionName: transactionData.functionName,
      args: transactionData.args,
      value: BigInt(transactionData.value),
    });

    console.log('✍️ [WRITE-SERVICE] Transaction submitted:', hash);

    // Wait for confirmation
    const receipt = await waitForTransactionReceipt({ hash });

    console.log('✍️ [WRITE-SERVICE] Transaction confirmed:', receipt);

    return hash;
  } catch (error) {
    console.error('✍️ [WRITE-SERVICE] Transaction failed:', error);
    throw error;
  }
}

