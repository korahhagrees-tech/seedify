/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  usePrivy, 
  useLogin, 
  useWallets, 
  useConnectWallet, 
  useActiveWallet,
  useFundWallet,
  useSendTransaction
} from '@privy-io/react-auth';

// Re-export Privy types for convenience
export type { Wallet } from '@privy-io/react-auth';

// Wallet utility functions using Privy hooks
export function useWalletUtils() {
  const { wallets } = useWallets();
  const { connectWallet } = useConnectWallet();
  const { setActiveWallet } = useActiveWallet();
  const { fundWallet } = useFundWallet();
  const { sendTransaction } = useSendTransaction();

  return {
    wallets,
    connectWallet,
    setActiveWallet,
    fundWallet,
    sendTransaction
  };
}

// Enhanced wallet connection hook using Privy's recommended approach
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
export function getWalletDisplayName(wallet: any): string {
  // Check meta.name first (most reliable)
  if (wallet.meta?.name) {
    return wallet.meta.name;
  }
  
  // Check walletClientType (camelCase from Privy)
  if (wallet.walletClientType) {
    switch (wallet.walletClientType) {
      case 'privy':
        return 'Embedded Wallet';
      case 'metamask':
        return 'MetaMask';
      case 'coinbase':
      case 'coinbase_wallet':
        return 'Coinbase Wallet';
      case 'wallet_connect':
      case 'walletconnect':
        return 'WalletConnect';
      case 'rainbow':
        return 'Rainbow';
      default:
        return wallet.walletClientType.charAt(0).toUpperCase() + wallet.walletClientType.slice(1);
    }
  }
  
  // Fallback to legacy wallet_client_type (snake_case)
  if (wallet.wallet_client_type) {
    switch (wallet.wallet_client_type) {
      case 'privy':
        return 'Embedded Wallet';
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
  
  // Check connectorType
  if (wallet.connectorType) {
    switch (wallet.connectorType) {
      case 'embedded':
        return 'Embedded Wallet';
      case 'injected':
        return 'Browser Wallet';
      default:
        return 'Connected Wallet';
    }
  }
  
  // Fallback to legacy connector_type
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
export function isEmbeddedWallet(wallet: any): boolean {
  return wallet.wallet_client === 'privy' || wallet.connector_type === 'embedded';
}
