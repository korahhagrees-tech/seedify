/**
 * Mock Seed Data
 */

import { GardenDataResponse } from '@/types/seed';
import { getSeedStory } from '@/lib/data/componentData';

export const mockSeedsData: GardenDataResponse = {
  success: true,
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
      depositAmount: "",
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
    },
    {
      id: "2",
      label: "seed 002",
      name: "Seed #2",
      description: "A unique seed from the Way of Flowers collection",
      seedImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed2/seed.png",
      latestSnapshotUrl: null,
      snapshotCount: 8,
      owner: "0x98Db5558E91E3B2FFaE95187A6Ac98b7ae437970",
      depositAmount: "",
      snapshotPrice: "11, 111",
      isWithdrawn: false,
      isLive: true,
      metadata: {
        exists: true,
        attributes: [
          { trait_type: "Type", value: "Seed" },
          { trait_type: "Token ID", value: 2 },
          { trait_type: "Snapshots", value: 8 },
          { trait_type: "Live", value: "yes" }
        ]
      },
      story: getSeedStory("2")
    }
  ],
  timestamp: Date.now()
};

