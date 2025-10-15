/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, createContext, useContext, useEffect } from 'react';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useSetActiveWallet } from '@privy-io/wagmi';
import { privyConfig, getPrivyAppId, getPrivyClientId } from '@/lib/auth/config';
import { wagmiConfig } from '@/lib/wagmi/config';
import { useAuthStore } from '@/lib/store/authStore';
import type { ConnectedWallet } from '@privy-io/react-auth';

const queryClient = new QueryClient();

interface AuthContextType {
  user: any;
  walletAddress: string | null;
  balance: string | null;
  logout: () => void;
  // New: Expose Zustand store methods for backward compatibility
  wallets: ConnectedWallet[];
  activeWallet: ConnectedWallet | null;
  linkedAccounts: any[];
  setActiveWallet: (wallet: ConnectedWallet | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const { user, ready, authenticated, logout: privyLogout } = usePrivy();
  const { wallets } = useWallets();
  const { setActiveWallet: setWagmiActiveWallet } = useSetActiveWallet();
  
  // Get store state and actions
  const storeUser = useAuthStore((state) => state.user);
  const walletAddress = useAuthStore((state) => state.walletAddress);
  const activeWallet = useAuthStore((state) => state.activeWallet);
  const linkedAccounts = useAuthStore((state) => state.linkedAccounts);
  const storeWallets = useAuthStore((state) => state.wallets);
  
  const setUser = useAuthStore((state) => state.setUser);
  const setWallets = useAuthStore((state) => state.setWallets);
  const setActiveWallet = useAuthStore((state) => state.setActiveWallet);
  const setReady = useAuthStore((state) => state.setReady);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const reset = useAuthStore((state) => state.reset);

  // Sync Privy user to Zustand store
  useEffect(() => {
    console.log('🔍 [AUTH] Syncing user to store:', user);
    console.log('🔍 [AUTH] User linkedAccounts:', user?.linkedAccounts);
    setUser(user || null);
  }, [user, setUser]);

  // Sync Privy wallets to Zustand store
  useEffect(() => {
    console.log('🔍 [AUTH] Syncing wallets to store:', wallets);
    console.log('🔍 [AUTH] Privy wallets count:', wallets?.length || 0);
    if (wallets?.length > 0) {
      wallets.forEach((wallet, index) => {
        console.log(`🔍 [AUTH] Privy wallet ${index}:`, {
          address: wallet.address,
          walletClientType: wallet.walletClientType,
          connectorType: wallet.connectorType,
          meta: wallet.meta
        });
      });
    }
    setWallets(wallets);
  }, [wallets, setWallets]);

  // Sync user's linked accounts as wallets (more comprehensive than useWallets)
  useEffect(() => {
    if (user?.linkedAccounts && user.linkedAccounts.length > 0) {
      console.log('🔍 [AUTH] Syncing linkedAccounts as wallets:', user.linkedAccounts);
      
      // Convert linkedAccounts to wallet format for consistency
      const linkedWallets = user.linkedAccounts.map((account: any) => ({
        address: account.address,
        type: account.type,
        chainType: account.chainType,
        connectorType: account.connectorType,
        walletClientType: account.walletClientType,
        walletIndex: account.walletIndex,
        id: account.id,
        imported: account.imported,
        delegated: account.delegated,
        firstVerifiedAt: account.firstVerifiedAt,
        latestVerifiedAt: account.latestVerifiedAt,
        recoveryMethod: account.recoveryMethod,
        // Add required ConnectedWallet properties
        chainId: account.chainType === 'ethereum' ? 'eip155:8453' : account.chainType === 'solana' ? 'solana:mainnet' : 'eip155:1',
        connectedAt: Date.now(),
        // Add wallet-like methods for compatibility
        isConnected: () => Promise.resolve(true),
        disconnect: () => Promise.resolve(),
        linked: true,
        loginOrLink: () => Promise.resolve(),
        unlink: () => Promise.resolve(),
        fund: () => Promise.resolve(),
        getEthereumProvider: () => Promise.resolve(null),
        sign: () => Promise.resolve(''),
        switchChain: () => Promise.resolve(),
        // Meta information
        meta: {
          name: account.walletClientType === 'privy' ? 'Embedded Wallet' : 
                account.walletClientType === 'metamask' ? 'MetaMask' :
                account.walletClientType === 'coinbase' ? 'Coinbase Wallet' : 'Unknown Wallet',
          icon: account.walletClientType === 'privy' ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUiIGhl...' : null
        }
      }));
      
      console.log('🔍 [AUTH] Converted linkedAccounts to wallets:', linkedWallets);
      
      // Start with linked accounts as base wallets
      const allWallets = [...linkedWallets];
      
      // Add ALL connected wallets (including multiple accounts from same provider)
      wallets.forEach((wallet: any) => {
        const exists = allWallets.some((existing: any) => 
          existing.address?.toLowerCase() === wallet.address?.toLowerCase()
        );
        if (!exists) {
          console.log('🔍 [AUTH] Adding new connected wallet:', wallet.address, wallet.walletClientType);
          allWallets.push(wallet);
        }
      });
      
      // Sort wallets by type and address for consistent ordering
      allWallets.sort((a: any, b: any) => {
        // First sort by wallet type (embedded first, then external)
        const typeOrder = (type: string) => {
          if (type === 'privy' || type === 'embedded') return 0;
          if (type === 'metamask') return 1;
          if (type === 'coinbase') return 2;
          return 3;
        };
        
        const aTypeOrder = typeOrder(a.walletClientType || a.connectorType || 'unknown');
        const bTypeOrder = typeOrder(b.walletClientType || b.connectorType || 'unknown');
        
        if (aTypeOrder !== bTypeOrder) {
          return aTypeOrder - bTypeOrder;
        }
        
        // Then sort by address for same type
        return (a.address || '').localeCompare(b.address || '');
      });
      
      console.log('🔍 [AUTH] Final merged wallets:', allWallets);
      console.log('🔍 [AUTH] Total wallets count:', allWallets.length);
      console.log('🔍 [AUTH] Wallet addresses:', allWallets.map(w => w.address));
      setWallets(allWallets as any);
    }
  }, [user?.linkedAccounts, wallets, setWallets]);

  // Sync Privy ready state
  useEffect(() => {
    setReady(ready);
  }, [ready, setReady]);

  // Sync Privy authenticated state
  useEffect(() => {
    setAuthenticated(authenticated);
  }, [authenticated, setAuthenticated]);

  // Handle active wallet setting (sync with wagmi)
  const handleSetActiveWallet = (wallet: ConnectedWallet | null) => {
    setActiveWallet(wallet);
    if (wallet) {
      setWagmiActiveWallet(wallet);
    }
  };

  const logout = async () => {
    // Reset Zustand store
    reset();
    // Then logout from Privy
    await privyLogout();
  };

  return (
    <AuthContext.Provider value={{ 
      user: storeUser, 
      walletAddress, 
      balance: "0.063", // Mock balance - will be replaced by wagmi balance
      logout,
      wallets: storeWallets,
      activeWallet,
      linkedAccounts,
      setActiveWallet: handleSetActiveWallet,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const appId = getPrivyAppId();
  const clientId = getPrivyClientId();
  
  return (
    <PrivyProvider appId={appId} clientId={clientId} config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
