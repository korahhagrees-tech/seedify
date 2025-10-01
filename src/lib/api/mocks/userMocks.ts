/**
 * Mock User Data (for wallet page)
 */

import { Seed } from '@/types/seed';
import { Snapshot } from '@/types/api';
import { assets } from '@/lib/assets';
import { getSeedStory } from '@/lib/data/componentData';

export const mockUserData = {
  seeds: [
    {
      id: "1",
      label: "seed 001",
      name: "Seed #1",
      description: "A unique seed from the Way of Flowers collection",
      seedImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
      latestSnapshotUrl: null,
      snapshotCount: 643,
      owner: "0xc4b3CE8DD17F437ba4d9fc8D8e65E05e047792A8",
      depositAmount: null,
      snapshotPrice: "22, 232",
      isWithdrawn: false,
      isLive: true,
      metadata: {
        exists: true,
        attributes: [
          { trait_type: "Type", value: "Seed" },
          { trait_type: "Token ID", value: 1 },
          { trait_type: "Snapshots", value: 11 },
          { trait_type: "Live", value: "yes" }
        ]
      },
      story: getSeedStory("1")
    }
  ] as Seed[],

  snapshots: [
    {
      id: 1,
      creator: "0xc4b3CE8DD17F437ba4d9fc8D8e65E05e047792A8",
      value: 11000000000000000,
      valueEth: "0.011",
      beneficiaryIndex: 0,
      seedId: 1,
      timestamp: 1725753600,
      blockNumber: 12345,
      positionInSeed: 0,
      processId: "process-001"
    },
    {
      id: 2,
      creator: "0xc4b3CE8DD17F437ba4d9fc8D8e65E05e047792A8",
      value: 25000000000000000,
      valueEth: "0.025",
      beneficiaryIndex: 1,
      seedId: 2,
      timestamp: 1725580800,
      blockNumber: 12346,
      positionInSeed: 0,
      processId: "process-002"
    }
  ] as Snapshot[],

  balance: {
    balance: "1.234567",
    balanceWei: "1234567000000000000"
  },

  stats: {
    totalSeeds: 1,
    totalSnapshots: 2,
    poolBalance: "1.234567",
    seedNFTBalance: 1,
    snapshotNFTBalance: 2,
    totalDeposited: "0.036",
    totalSnapshotValue: "0.036"
  }
};

// Mock tended ecosystems data (derived from snapshots)
export const mockTendedEcosystems = [
  {
    id: "1",
    date: "07/09/2025",
    seedEmblemUrl: assets.glowers,
    beneficiaryName: "Grgich Hills Estate Regenerative Sheep Grazing",
    seedImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
    userContribution: "0.011 ETH",
    ecosystemCompost: "1.03 ETH"
  },
  {
    id: "2",
    date: "05/09/2025",
    seedEmblemUrl: assets.glowers,
    beneficiaryName: "Urban Garden Network Community Initiative",
    seedImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed2/seed.png",
    userContribution: "0.025 ETH",
    ecosystemCompost: "3.44 ETH"
  }
];

