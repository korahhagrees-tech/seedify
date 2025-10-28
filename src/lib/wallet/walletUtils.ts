/* eslint-disable @typescript-eslint/no-unused-vars */
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
      // console.log('User logged in successfully', user);
      // console.log('Is new user:', isNewUser);
      // console.log('Was already authenticated:', wasAlreadyAuthenticated);
      // console.log('Login method:', loginMethod);
      // console.log('Login account:', loginAccount);
      
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
export function getWalletDisplayName(wallet: any, allWallets?: any[], index?: number): string {
  // Check meta.name first (most reliable)
  if (wallet.meta?.name) {
    return wallet.meta.name;
  }
  
  let baseName = '';
  
  // Check walletClientType (camelCase from Privy)
  if (wallet.walletClientType) {
    switch (wallet.walletClientType) {
      case 'privy':
        baseName = 'Embedded Wallet';
        break;
      case 'metamask':
        baseName = 'MetaMask';
        break;
      case 'coinbase':
      case 'coinbase_wallet':
        baseName = 'Coinbase Wallet';
        break;
      case 'wallet_connect':
      case 'walletconnect':
        baseName = 'WalletConnect';
        break;
      case 'rainbow':
        baseName = 'Rainbow';
        break;
      default:
        baseName = wallet.walletClientType.charAt(0).toUpperCase() + wallet.walletClientType.slice(1);
    }
  } else if (wallet.wallet_client_type) {
    // Fallback to legacy wallet_client_type (snake_case)
    switch (wallet.wallet_client_type) {
      case 'privy':
        baseName = 'Embedded Wallet';
        break;
      case 'metamask':
        baseName = 'MetaMask';
        break;
      case 'coinbase':
        baseName = 'Coinbase Wallet';
        break;
      case 'walletconnect':
        baseName = 'WalletConnect';
        break;
      default:
        baseName = wallet.wallet_client_type.charAt(0).toUpperCase() + wallet.wallet_client_type.slice(1);
    }
  } else if (wallet.connectorType) {
    // Check connectorType
    switch (wallet.connectorType) {
      case 'embedded':
        baseName = 'Embedded Wallet';
        break;
      case 'injected':
        baseName = 'Browser Wallet';
        break;
      default:
        baseName = 'Connected Wallet';
    }
  } else if (wallet.connector_type) {
    // Fallback to legacy connector_type
    switch (wallet.connector_type) {
      case 'embedded':
        baseName = 'Embedded Wallet';
        break;
      default:
        baseName = 'Connected Wallet';
    }
  } else {
    baseName = 'Unknown Wallet';
  }
  
  // If we have all wallets and this is an external wallet, add account number
  if (allWallets && (wallet.walletClientType === 'metamask' || wallet.walletClientType === 'coinbase' || wallet.connectorType === 'injected')) {
    const sameTypeWallets = allWallets.filter(w => 
      w.walletClientType === wallet.walletClientType && 
      w.connectorType === wallet.connectorType
    );
    
    if (sameTypeWallets.length > 1) {
      const accountIndex = sameTypeWallets.findIndex(w => w.address === wallet.address) + 1;
      return `${baseName} #${accountIndex}`;
    }
  }
  
  return baseName;
}

// Check if wallet is embedded (Privy managed)
export function isEmbeddedWallet(wallet: any): boolean {
  return wallet.wallet_client === 'privy' || wallet.connector_type === 'embedded';
}
