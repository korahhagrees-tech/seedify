import { usePrivy, useLogin } from '@privy-io/react-auth';

// Types for wallet data
export interface Wallet {
  id: string;
  address: string;
  chain_type: string;
  wallet_client?: string;
  wallet_client_type?: string;
  connector_type?: string;
  verified_at: number;
}

export interface WalletBalance {
  chain: string;
  asset: string;
  raw_value: string;
  raw_value_decimals: number;
  display_values: {
    [key: string]: string;
  };
}

export interface WalletListResponse {
  data: Wallet[];
  next_cursor?: string;
}

export interface WalletBalanceResponse {
  balances: WalletBalance[];
}

export interface ExportWalletResponse {
  encryption_type: string;
  ciphertext: string;
  encapsulated_key: string;
}

// Get all wallets for a user
export async function getUserWallets(userId: string): Promise<Wallet[]> {
  try {
    const response = await fetch(`https://api.privy.io/v1/wallets?user_id=${userId}`, {
      headers: {
        'privy-app-id': process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
        'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_PRIVY_APP_ID}:${process.env.APP_SECRET}`)}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch wallets: ${response.statusText}`);
    }

    const data: WalletListResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user wallets:', error);
    throw error;
  }
}

// Get wallet balance
export async function getWalletBalance(walletId: string, assets: string[] = ['eth'], chains: string[] = ['ethereum']): Promise<WalletBalanceResponse> {
  try {
    const params = new URLSearchParams();
    assets.forEach(asset => params.append('asset', asset));
    chains.forEach(chain => params.append('chain', chain));
    params.append('include_currency', 'usd');

    const response = await fetch(`https://api.privy.io/v1/wallets/${walletId}/balance?${params.toString()}`, {
      headers: {
        'privy-app-id': process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
        'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_PRIVY_APP_ID}:${process.env.APP_SECRET}`)}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch wallet balance: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
}

// Export wallet private key
export async function exportWalletPrivateKey(walletId: string, recipientPublicKey: string): Promise<ExportWalletResponse> {
  try {
    const response = await fetch(`https://api.privy.io/v1/wallets/${walletId}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'privy-app-id': process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
        'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_PRIVY_APP_ID}:${process.env.APP_SECRET}`)}`
      },
      body: JSON.stringify({
        encryption_type: 'HPKE',
        recipient_public_key: recipientPublicKey
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to export wallet: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error exporting wallet:', error);
    throw error;
  }
}

// Switch active wallet (this would typically update your app's state)
export function switchActiveWallet(walletId: string, wallets: Wallet[]): Wallet | null {
  const selectedWallet = wallets.find(wallet => wallet.id === walletId);
  if (selectedWallet) {
    // Update your app's global state here
    // This could be stored in context, localStorage, or passed up to parent components
    console.log('Switching to wallet:', selectedWallet);
    return selectedWallet;
  }
  return null;
}

// Hook for wallet connection (similar to WalletConnectButton)
export function useWalletConnection(onSuccess?: () => void) {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount }) => {
      console.log('User logged in successfully', user);
      console.log('Is new user:', isNewUser);
      console.log('Was already authenticated:', wasAlreadyAuthenticated);
      console.log('Login method:', loginMethod);
      console.log('Login account:', loginAccount);
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error('Login failed', error);
    }
  });

  const handleConnect = () => {
    if (ready && !authenticated) {
      login();
    }
  };

  return {
    handleConnect,
    isReady: ready,
    isAuthenticated: authenticated,
    canConnect: ready && !authenticated
  };
}

// Format wallet address for display
export function formatWalletAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

// Get wallet display name based on type
export function getWalletDisplayName(wallet: Wallet): string {
  if (wallet.wallet_client_type) {
    switch (wallet.wallet_client_type) {
      case 'privy':
        return 'Privy Wallet';
      case 'metamask':
        return 'MetaMask';
      case 'coinbase':
        return 'Coinbase Wallet';
      case 'walletconnect':
        return 'WalletConnect';
      default:
        return wallet.wallet_client_type.charAt(0).toUpperCase() + wallet.wallet_client_type.slice(1);
    }
  }
  
  if (wallet.connector_type) {
    switch (wallet.connector_type) {
      case 'embedded':
        return 'Embedded Wallet';
      default:
        return 'Connected Wallet';
    }
  }
  
  return 'Unknown Wallet';
}

// Check if wallet is embedded (Privy managed)
export function isEmbeddedWallet(wallet: Wallet): boolean {
  return wallet.wallet_client === 'privy' || wallet.connector_type === 'embedded';
}
