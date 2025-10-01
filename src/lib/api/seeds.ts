/**
 * Seeds API (Legacy)
 * 
 * This file is kept for backward compatibility.
 * New code should use the services from '@/lib/api' instead.
 * 
 * @deprecated Use services from '@/lib/api' instead
 */

import { Seed, GardenDataResponse } from '@/types/seed';
import { Beneficiary } from '@/lib/utils';
import { assets } from '@/lib/assets';
import { 
  fetchGardenData as fetchGardenDataService,
  fetchSeedById as fetchSeedByIdService 
} from './index';

/**
 * @deprecated Use fetchGardenData from '@/lib/api' instead
 */
export async function fetchGardenData(): Promise<GardenDataResponse> {
  return fetchGardenDataService();
}

/**
 * @deprecated Use fetchSeedById from '@/lib/api' instead
 */
export async function fetchSeedById(id: string): Promise<Seed | null> {
  return fetchSeedByIdService(id);
}

// Default beneficiaries data
export const defaultBeneficiaries: Beneficiary[] = [
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