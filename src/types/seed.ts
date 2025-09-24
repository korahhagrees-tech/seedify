export interface SeedMetadata {
  exists: boolean;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface Seed {
  id: string;
  label: string;
  name: string;
  description: string;
  seedImageUrl: string;
  latestSnapshotUrl: string | null;
  snapshotCount: number;
  owner: string;
  depositAmount: string | null;
  snapshotPrice: string;
  isWithdrawn: boolean;
  isLive: boolean;
  metadata: SeedMetadata;
}

export interface GardenDataResponse {
  success: boolean;
  seeds: Seed[];
  timestamp: number;
}

// Helper function to convert Wei to ETH
export function weiToEth(wei: string): string {
  const eth = parseFloat(wei) / 1e18;
  return eth.toFixed(4);
}

// Helper function to format address
export function formatAddress(address: string): string {
  if (!address) return '';
  // return `${address.slice(0, 6)}...${address.slice(-4)}`;
  return `...${address.slice(-4)}`;
}
