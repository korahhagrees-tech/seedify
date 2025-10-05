import { mainnet, sepolia, base } from 'viem/chains';
import { http } from 'wagmi';
import { createConfig } from '@privy-io/wagmi';

// Replace these with your app's chains
export const wagmiConfig = createConfig({
  chains: [base, mainnet, sepolia],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
