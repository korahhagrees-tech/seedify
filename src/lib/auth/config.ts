import type { PrivyClientConfig } from '@privy-io/react-auth';

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets'
    },
    showWalletUIs: true
  },
  loginMethods: ['wallet', 'email', 'sms'],
  appearance: {
    showWalletLoginFirst: true,
    walletChainType: 'ethereum-only',
    walletList: ['metamask', 'coinbase_wallet', 'rainbow', 'wallet_connect']
  }
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
