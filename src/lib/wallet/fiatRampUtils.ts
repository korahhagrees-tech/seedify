// Fiat onramp and offramp utilities for Privy API

export interface OnrampRequest {
  amount: string;
  provider: 'bridge' | 'bridge-sandbox';
  source: {
    payment_rail: 'sepa' | 'ach_push' | 'wire';
    currency: 'usd' | 'eur';
  };
  destination: {
    chain: 'ethereum' | 'base' | 'arbitrum' | 'polygon' | 'optimism';
    currency: 'usdc';
    to_address: string;
  };
}

export interface OfframpRequest {
  amount: string;
  provider: 'bridge' | 'bridge-sandbox';
  source: {
    currency: 'usdc';
    chain: 'ethereum' | 'base' | 'arbitrum' | 'polygon' | 'optimism';
    from_address: string;
  };
  destination: {
    currency: 'usd' | 'eur';
    payment_rail: 'sepa' | 'ach_push' | 'wire';
    external_account_id: string;
  };
}

export interface DepositInstructions {
  amount: string;
  currency: string;
  payment_rail: string;
  deposit_message?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_routing_number?: string;
  bank_beneficiary_name?: string;
  bank_beneficiary_address?: string;
  bank_address?: string;
  iban?: string;
  bic?: string;
  account_holder_name?: string;
  to_address?: string;
  from_address?: string;
  chain?: string;
}

export interface OnrampResponse {
  id: string;
  status: 'awaiting_funds' | 'in_review' | 'funds_received' | 'payment_submitted' | 'payment_processed' | 'canceled' | 'error' | 'undeliverable' | 'returned' | 'refunded';
  deposit_instructions: DepositInstructions;
}

export interface OfframpResponse {
  id: string;
  status: 'awaiting_funds' | 'in_review' | 'funds_received' | 'payment_submitted' | 'payment_processed' | 'canceled' | 'error' | 'undeliverable' | 'returned' | 'refunded';
  deposit_instructions: DepositInstructions;
}

export interface TOSResponse {
  status: 'completed' | 'incomplete';
  url?: string;
}

export interface FiatTransaction {
  type: 'onramp' | 'offramp';
  id: string;
  status: string;
  created_at: string;
  destination: any;
  receipt?: {
    final_amount: string;
    transaction_hash?: string;
  };
  is_sandbox: boolean;
  deposit_instructions: DepositInstructions;
}

export interface TransactionsResponse {
  transactions: FiatTransaction[];
}

// Configure app for native onramp
export async function configureAppForOnramp(
  appId: string,
  provider: 'bridge' | 'bridge-sandbox',
  apiKey: string
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`https://api.privy.io/v1/apps/${appId}/fiat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'privy-app-id': process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
        'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_PRIVY_APP_ID}:${process.env.APP_SECRET}`)}`
      },
      body: JSON.stringify({
        provider,
        api_key: apiKey
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to configure onramp: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error configuring onramp:', error);
    throw error;
  }
}

// Create terms of service agreement
export async function createTOSAgreement(
  userId: string,
  provider: 'bridge' | 'bridge-sandbox' = 'bridge-sandbox'
): Promise<TOSResponse> {
  try {
    const response = await fetch(`https://api.privy.io/v1/users/${userId}/fiat/tos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'privy-app-id': process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
        'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_PRIVY_APP_ID}:${process.env.APP_SECRET}`)}`
      },
      body: JSON.stringify({
        provider
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create TOS agreement: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating TOS agreement:', error);
    throw error;
  }
}

// Initiate onramp (add funds)
export async function initiateOnramp(
  userId: string,
  request: OnrampRequest
): Promise<OnrampResponse> {
  try {
    const response = await fetch(`https://api.privy.io/v1/users/${userId}/fiat/onramp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'privy-app-id': process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
        'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_PRIVY_APP_ID}:${process.env.APP_SECRET}`)}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Failed to initiate onramp: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error initiating onramp:', error);
    throw error;
  }
}

// Initiate offramp (withdraw funds)
export async function initiateOfframp(
  userId: string,
  request: OfframpRequest
): Promise<OfframpResponse> {
  try {
    const response = await fetch(`https://api.privy.io/v1/users/${userId}/fiat/offramp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'privy-app-id': process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
        'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_PRIVY_APP_ID}:${process.env.APP_SECRET}`)}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Failed to initiate offramp: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error initiating offramp:', error);
    throw error;
  }
}

// Get fiat transactions
export async function getFiatTransactions(
  userId: string,
  provider: 'bridge' | 'bridge-sandbox' = 'bridge-sandbox'
): Promise<TransactionsResponse> {
  try {
    const response = await fetch(`https://api.privy.io/v1/users/${userId}/fiat/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'privy-app-id': process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
        'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_PRIVY_APP_ID}:${process.env.APP_SECRET}`)}`
      },
      body: JSON.stringify({
        provider
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to get transactions: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
}

// Helper function to format currency amount
export function formatCurrencyAmount(amount: string, currency: string): string {
  const numAmount = parseFloat(amount);
  
  if (currency.toUpperCase() === 'USD' || currency.toUpperCase() === 'EUR') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  }
  
  return `${numAmount.toFixed(4)} ${currency.toUpperCase()}`;
}

// Helper function to get payment rail display name
export function getPaymentRailDisplayName(rail: string): string {
  switch (rail) {
    case 'ach_push':
      return 'ACH (US Bank Transfer)';
    case 'sepa':
      return 'SEPA (European Bank Transfer)';
    case 'wire':
      return 'Wire Transfer';
    default:
      return rail.toUpperCase();
  }
}

// Helper function to get chain display name
export function getChainDisplayName(chain: string): string {
  switch (chain) {
    case 'ethereum':
      return 'Ethereum';
    case 'base':
      return 'Base';
    case 'arbitrum':
      return 'Arbitrum';
    case 'polygon':
      return 'Polygon';
    case 'optimism':
      return 'Optimism';
    default:
      return chain.charAt(0).toUpperCase() + chain.slice(1);
  }
}

// Helper to check if TOS is accepted
export function isTOSAccepted(tosResponse: TOSResponse): boolean {
  return tosResponse.status === 'completed';
}
