import { Seed, GardenDataResponse } from '@/types/seed';
import { Location } from '@/lib/utils';
import { assets } from '@/lib/assets';

// Mock data based on the API response you provided
const mockSeeds: GardenDataResponse = {
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
      }
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
      depositAmount: null,
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

// Default locations data
export const defaultLocations: Location[] = [
  {
    id: "el-globo",
    name: "El Globo Habitat Bank",
    slug: "el-globo-habitat-bank",
    image: assets.elGlobo,
    position: {
      top: "-top-14",
      left: "left-6 lg:left-8",
      width: "w-[155px]",
      height: "h-[155px]",
      transform: "transform -rotate-4"
    },
    labelPosition: {
      top: "-left-18",
      left: "-top-10",
      transform: "transform -rotate-90"
    }
  },
  {
    id: "walkers-reserve",
    name: "Walkers Reserve",
    slug: "walkers-reserve",
    image: assets.walkersReserve,
    position: {
      top: "top-1",
      left: "right-2 lg:right-6",
      width: "w-14",
      height: "h-14",
      transform: "transform rotate-12"
    },
    labelPosition: {
      top: "-right-10",
      left: "-top-4",
      transform: "transform rotate-45"
    }
  },
  {
    id: "buena-vista",
    name: "Buena Vista Heights",
    slug: "buena-vista-heights",
    image: assets.buenaVista,
    position: {
      top: "lg:bottom-24 bottom-24",
      left: "-left-5 lg:-left-3",
      width: "w-28",
      height: "h-28",
      transform: "transform -rotate-6"
    },
    labelPosition: {
      top: "left-16",
      left: "bottom-42",
      transform: "transform rotate-66"
    }
  },
  {
    id: "grgich-hills",
    name: "Grgich Hills Estate",
    slug: "grgich-hills-estate",
    image: assets.grgichHills,
    position: {
      top: "lg:bottom-27 bottom-28",
      left: "lg:-right-3 -right-6",
      width: "w-34",
      height: "h-34",
      transform: "transform rotate-6"
    },
    labelPosition: {
      top: "right-18",
      left: "top-1/2",
      transform: "transform -rotate-90"
    }
  }
];