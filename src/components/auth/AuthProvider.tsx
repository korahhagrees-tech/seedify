"use client";

import { ReactNode } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from '@privy-io/wagmi';
import { privyConfig, getPrivyAppId, getPrivyClientId } from '@/lib/auth/config';
import { wagmiConfig } from '@/lib/wagmi/config';

const queryClient = new QueryClient();

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
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
