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
 * Note: Transaction execution is now handled by the useWriteTransaction hook.
 * This service only prepares transaction data from the backend.
 * 
 * For executing transactions, use the useWriteTransaction hook in your components:
 * 
 * @example
 * ```typescript
 * import { prepareMintSnapshot, useWriteTransaction } from '@/lib/api';
 * 
 * const { execute, isLoading } = useWriteTransaction();
 * 
 * const txData = await prepareMintSnapshot({...});
 * const hash = await execute(txData);
 * ```
 */

