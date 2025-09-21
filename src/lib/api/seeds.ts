import { Seed, GardenDataResponse } from '@/types/seed';

// Mock data based on the API response you provided
const mockSeeds: GardenDataResponse = {
  success: true,
  seeds: [
    {
      id: "1",
      label: "seed 01",
      name: "Seed #1",
      description: "A unique seed from the Way of Flowers collection",
      seedImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
      latestSnapshotUrl: null,
      snapshotCount: 11,
      owner: "0xc4b3CE8DD17F437ba4d9fc8D8e65E05e047792A8",
      depositAmount: null,
      snapshotPrice: "11000000000000000",
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
      }
    },
    {
      id: "2",
      label: "seed 02",
      name: "Seed #2",
      description: "A unique seed from the Way of Flowers collection",
      seedImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed2/seed.png",
      latestSnapshotUrl: null,
      snapshotCount: 8,
      owner: "0x98Db5558E91E3B2FFaE95187A6Ac98b7ae437970",
      depositAmount: null,
      snapshotPrice: "11000000000000000",
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
      }
    }
  ],
  timestamp: Date.now()
};

export async function fetchGardenData(): Promise<GardenDataResponse> {
  try {
    console.log('🌸 [GARDEN-HOOK] Fetching optimized garden data...');
    
    const response = await fetch('https://way-of-flowers.garden/api/garden-data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GardenDataResponse = await response.json();
    console.log('🌸 [GARDEN-HOOK] Garden data received:', data);
    
    return data;
  } catch (error) {
    console.error('🌸 [GARDEN-HOOK] Error fetching garden data:', error);
    console.log('🌸 [GARDEN-HOOK] Using mock data as fallback');
    
    // Return mock data as fallback
    return mockSeeds;
  }
}

export async function fetchSeedById(id: string): Promise<Seed | null> {
  try {
    const gardenData = await fetchGardenData();
    return gardenData.seeds.find(seed => seed.id === id) || null;
  } catch (error) {
    console.error('Error fetching seed by ID:', error);
    return null;
  }
}
