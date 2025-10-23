/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Seed Service
 * Handles all seed-related API calls
 */

import { apiClient, APIError } from '../client';
import { API_CONFIG, API_ENDPOINTS } from '../config';
import { SeedsResponse, SeedResponse, CountResponse } from '@/types/api';
import { Seed, GardenDataResponse } from '@/types/seed';
import { getEcosystemProject, getWayOfFlowersData, getSeedStory } from '@/lib/data/componentData';

/**
 * Convert backend seed to frontend seed format
 */
function convertBackendSeedToFrontend(backendSeed: any): Seed {
  return {
    id: backendSeed.id,
    label: backendSeed.label,
    name: backendSeed.name,
    description: backendSeed.description,
    seedImageUrl: backendSeed.seedImageUrl,
    latestSnapshotUrl: backendSeed.latestSnapshotUrl,
    snapshotCount: backendSeed.snapshotCount,
    owner: backendSeed.owner,
    depositAmount: backendSeed.depositAmount,
    snapshotPrice: backendSeed.snapshotPrice,
    isWithdrawn: backendSeed.isWithdrawn,
    isLive: backendSeed.isLive,
    metadata: backendSeed.metadata || {
      exists: false,
      attributes: []
    },
    story: backendSeed.story?.title ? backendSeed.story : getSeedStory(backendSeed.id),
    location: backendSeed.location,
    wayOfFlowersData: backendSeed.wayOfFlowersData,
    beneficiaries: backendSeed.beneficiaries || []
  };
}

/**
 * Fetch all seeds (Garden Data)
 */
export async function fetchGardenData(): Promise<GardenDataResponse> {
  console.log(' [SEED-SERVICE] Fetching garden data from:', API_CONFIG.baseUrl);

  try {
    const response = await apiClient.get<SeedsResponse>(API_ENDPOINTS.seeds);

    if (!response.success || !response.seeds) {
      throw new APIError('Invalid response format');
    }

    // Convert backend seeds to frontend format
    const seeds = response.seeds.map(convertBackendSeedToFrontend);

    console.log(' [SEED-SERVICE] Successfully fetched', seeds.length, 'seeds');

    return {
      success: true,
      seeds,
      timestamp: response.timestamp
    };
  } catch (error) {
    console.error(' [SEED-SERVICE] Error fetching garden data:', error);
    throw error;
  }
}

/**
 * Fetch seed by ID
 */
export async function fetchSeedById(id: string): Promise<Seed | null> {
  console.log(' [SEED-SERVICE] Fetching seed by ID:', id);

  try {
    const response = await apiClient.get<SeedResponse>(API_ENDPOINTS.seedById(id));

    if (!response.success || !response.seed) {
      return null;
    }

    // Convert backend seed to frontend format
    const seed = convertBackendSeedToFrontend(response.seed);

    // Enrich with frontend data if backend data is empty
    if (!seed.story?.title) {
      seed.story = getSeedStory(id);
    }

    console.log(' [SEED-SERVICE] Successfully fetched seed:', id);
    return seed;
  } catch (error) {
    console.error(' [SEED-SERVICE] Error fetching seed:', error);
    throw error;
  }
}

/**
 * Fetch seed count
 */
export async function fetchSeedCount(): Promise<number> {
  console.log(' [SEED-SERVICE] Fetching seed count...');

  try {
    const response = await apiClient.get<CountResponse>(API_ENDPOINTS.seedsCount);
    return response.count;
  } catch (error) {
    console.error(' [SEED-SERVICE] Error fetching seed count:', error);
    throw error;
  }
}

/**
 * Get ecosystem project data for a seed
 */
export function getEcosystemProjectData(seedId: string) {
  return getEcosystemProject(seedId);
}

/**
 * Get Way of Flowers data for a seed
 */
export function getWayOfFlowersDataForSeed(seedId: string) {
  return getWayOfFlowersData(seedId);
}

/**
 * Get story data for a seed
 */
export function getStoryData(seedId: string) {
  return getSeedStory(seedId);
}

/**
 * Fetch seed stats by ID
 */
export async function fetchSeedStats(seedId: string): Promise<any> {
  console.log(' [SEED-SERVICE] Fetching seed stats for ID:', seedId);

  try {
    const response = await apiClient.get<{ success: boolean; stats: any; timestamp?: number }>(
      API_ENDPOINTS.seedStats(seedId)
    );

    if (!response.success || !response.stats) {
      throw new APIError('Invalid seed stats response format');
    }

    console.log(' [SEED-SERVICE] Successfully fetched seed stats for:', seedId);
    return response.stats;
  } catch (error) {
    console.error(' [SEED-SERVICE] Error fetching seed stats:', error);
    throw error;
  }
}

