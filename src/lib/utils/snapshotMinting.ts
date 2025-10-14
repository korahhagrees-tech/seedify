/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Snapshot minting utilities
 * Handles the new snapshot minting flow with webhook retries
 */

export interface SnapshotMintResponse {
  success: boolean;
  data: {
    contractAddress: string;
    functionName: string;
    args: {
      seedId: number;
      beneficiaryIndex?: number;
      royaltyRecipient: string;
    };
    value: string;
    valueEth: string;
    description: string;
    seedOwner: string;
    processId: string;
    snapshotId: number;
    blockNumber: number;
    beneficiaryCode?: string;
    beneficiaryDistribution?: number;
  };
  message: string;
  timestamp: number;
}

export interface WebhookData {
  contractAddress: string;
  seedId: number;
  snapshotId: number;
  beneficiaryCode: string;
  beneficiaryDistribution: number;
  creator: string;
  txHash: string;
  timestamp: number;
  blockNumber: number;
  processId: string;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  data: {
    seedId: number;
    snapshotId: number;
    beneficiaryCode: string;
    beneficiaryDistribution: number;
    imageUrl: string;
    generation: {
      jobId: string;
      totalTime: number;
      status: string;
    };
    storage: {
      status: string;
      message: string;
    };
    blockchain: {
      contractAddress: string;
      txHash: string;
      timestamp: number;
      blockNumber: number;
      processId: string;
    };
  };
}

export interface RetryData {
  data: WebhookData;
  count: number;
  nextRetry: number;
}

/**
 * Generate a unique process ID (fallback if backend doesn't provide one)
 */
export function generateProcessId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Store retry data in cookies
 */
export function storeRetryData(processId: string, retryData: RetryData): void {
  const cookieName = `webhook_retry_${processId}`;
  const expires = new Date(Date.now() + 5 * 60 * 1000).toUTCString(); // 5 minutes
  document.cookie = `${cookieName}=${JSON.stringify(retryData)}; expires=${expires}; path=/`;
}

/**
 * Get retry data from cookies
 */
export function getRetryData(processId: string): RetryData | null {
  const cookieName = `webhook_retry_${processId}`;
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Clear retry data from cookies
 */
export function clearRetryData(processId: string): void {
  const cookieName = `webhook_retry_${processId}`;
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

/**
 * Retry webhook with exponential backoff
 */
export async function retryWebhook(
  webhookData: WebhookData,
  retryCount: number = 0,
  onSuccess?: (imageData?: { imageUrl: string; backgroundImageUrl: string; beneficiaryCode: string }) => void,
  onFailure?: (error: Error) => void
): Promise<void> {
  const maxRetries = 18; // 3 minutes with 10s intervals
  const baseDelay = 10000; // 10 seconds

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
    const response = await fetch(`${apiBaseUrl}/snapshot-minted`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

    // Parse the webhook response
    const webhookResult: WebhookResponse = await response.json();
    
    // Success - clear retry data
    clearRetryData(webhookData.processId);
    
    // Extract image data from webhook response
    let imageData: { imageUrl: string; backgroundImageUrl: string; beneficiaryCode: string } | undefined;
    
    if (webhookResult.success && webhookResult.data) {
      const { imageUrl, beneficiaryCode } = webhookResult.data;
      
      // Transform beneficiaryCode format: 02-ELG -> 02__ELG
      const transformedBeneficiaryCode = beneficiaryCode ? beneficiaryCode.replace('-', '__') : '';
      const backgroundImageUrl = `/project_images/${transformedBeneficiaryCode}.png`;
      
      imageData = {
        imageUrl,
        backgroundImageUrl,
        beneficiaryCode
      };
      
      console.log('🖼️ Image data extracted from webhook:', {
        imageUrl: imageUrl ? `${imageUrl.substring(0, 50)}...` : 'none',
        beneficiaryCode,
        transformedBeneficiaryCode,
        backgroundImageUrl
      });
    }
    
    onSuccess?.(imageData);

  } catch (error) {
    // Simplified error - don't expose technical details to user
    const errorObj = new Error('Webhook processing failed');
    
    if (retryCount < maxRetries) {
      // Store retry data for persistence across page refreshes
      const retryData: RetryData = {
        data: webhookData,
        count: retryCount + 1,
        nextRetry: Date.now() + baseDelay,
      };
      
      storeRetryData(webhookData.processId, retryData);
      
      // Schedule next retry
      setTimeout(() => {
        retryWebhook(webhookData, retryCount + 1, onSuccess, onFailure);
      }, baseDelay);
      
    } else {
      // Max retries reached
      clearRetryData(webhookData.processId);
      onFailure?.(errorObj);
    }
  }
}

/**
 * Check for pending webhook retries on page load
 */
export function checkPendingRetries(): void {
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    
    if (name.startsWith('webhook_retry_')) {
      try {
        const retryData: RetryData = JSON.parse(value);
        
        // Check if it's time to retry
        if (Date.now() >= retryData.nextRetry) {
          retryWebhook(
            retryData.data,
            retryData.count,
            () => console.log('Webhook retry successful'),
            (error) => console.error('Webhook retry failed:', error)
          );
        }
      } catch {
        // Invalid cookie data, ignore
      }
    }
  }
}
