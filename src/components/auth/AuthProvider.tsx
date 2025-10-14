/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from '@privy-io/wagmi';
import { privyConfig, getPrivyAppId, getPrivyClientId } from '@/lib/auth/config';
import { wagmiConfig } from '@/lib/wagmi/config';

const queryClient = new QueryClient();

interface AuthContextType {
  user: any;
  walletAddress: string | null;
  balance: string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const { user, logout: privyLogout } = usePrivy();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 [AUTH] User object:', user);
    console.log('🔍 [AUTH] User wallet:', user?.wallet);
    console.log('🔍 [AUTH] User wallet address:', user?.wallet?.address);
    
    if (user?.wallet?.address) {
      setWalletAddress(user.wallet.address);
      console.log('✅ [AUTH] Set wallet address:', user.wallet.address);
      // Mock balance for now - in real app, fetch from blockchain
      setBalance("0.063");
    } else {
      setWalletAddress(null);
      setBalance(null);
      console.log('❌ [AUTH] No wallet address found');
    }
  }, [user]);

  const logout = async () => {
    // Clear local state first
    setWalletAddress(null);
    setBalance(null);
    // Then logout from Privy
    await privyLogout();
  };

  return (
    <AuthContext.Provider value={{ user, walletAddress, balance, logout }}>
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
