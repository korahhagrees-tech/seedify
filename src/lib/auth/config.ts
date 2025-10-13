/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PrivyClientConfig, useSyncJwtBasedAuthState } from '@privy-io/react-auth';
import { base, baseSepolia } from '@privy-io/chains';

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
    solana: {
      createOnLogin: 'users-without-wallets',
    },
    showWalletUIs: true,
    extendedCalldataDecoding: true,
    priceDisplay: {
      primary: 'fiat-currency',
      secondary: 'native-token',
    },
  },
  loginMethods: ['email', 'sms', 'google', 'twitter', 'discord', 'github', 'wallet'],
  supportedChains: [baseSepolia, base],
  defaultChain: base, // Set Base as the default chain for funding
  appearance: {
    showWalletLoginFirst: true,
    theme: 'light',
    logo: '/assets/WOF_Logo-grey.png',
    walletChainType: 'ethereum-and-solana',
    walletList: ['metamask', 'coinbase_wallet', 'rainbow', 'wallet_connect'],
    landingHeader: 'Welcome to The Way of Flowers',
    loginMessage: 'Sign in to your account',
  },
};

// Get the Privy App ID and Client ID from environment variables
export const getPrivyAppId = () => {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!appId) {
    throw new Error('NEXT_PUBLIC_PRIVY_APP_ID environment variable is required');
  }
  return appId;
};

export const getPrivyClientId = () => {
  const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;
  if (!clientId) {
    throw new Error('NEXT_PUBLIC_PRIVY_CLIENT_ID environment variable is required');
  }
  return clientId;
};
