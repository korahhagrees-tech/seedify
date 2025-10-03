/**
 * User Service
 * Handles all user-specific API calls (wallet page data)
 */

import { apiClient, APIError } from '../client';
import { API_CONFIG, API_ENDPOINTS } from '../config';
import {
  UserSeedsResponse,
  UserSnapshotsResponse,
  UserBalanceResponse,
  UserStatsResponse,
  UserPortfolioResponse,
  CountResponse,
} from '@/types/api';
import { Seed } from '@/types/seed';

/**
 * Fetch user's seeds
 */
export async function fetchUserSeeds(address: string): Promise<{
  seeds: Seed[];
  count: number;
}> {
  console.log('👤 [USER-SERVICE] Fetching user seeds for:', address);

  try {
    const response = await apiClient.get<UserSeedsResponse>(
      API_ENDPOINTS.userSeeds(address)
    );

    if (!response.success) {
      throw new APIError('Failed to fetch user seeds');
    }

    console.log('👤 [USER-SERVICE] Successfully fetched', response.count, 'seeds');

    return {
      seeds: response.seeds as unknown as Seed[],
      count: response.count,
    };
  } catch (error) {
    console.error('👤 [USER-SERVICE] Error fetching user seeds:', error);
    throw error;
  }
}

/**
 * Fetch user's seed count
 */
export async function fetchUserSeedCount(address: string): Promise<number> {
  console.log('👤 [USER-SERVICE] Fetching user seed count for:', address);

  try {
    const response = await apiClient.get<CountResponse>(
      API_ENDPOINTS.userSeedsCount(address)
    );
    return response.count;
  } catch (error) {
    console.error('👤 [USER-SERVICE] Error fetching user seed count:', error);
    throw error;
  }
}

/**
 * Fetch user's snapshots (tended ecosystems)
 */
export async function fetchUserSnapshots(address: string) {
  console.log('👤 [USER-SERVICE] Fetching user snapshots for:', address);

  try {
    const response = await apiClient.get<UserSnapshotsResponse>(
      API_ENDPOINTS.userSnapshots(address)
    );

    if (!response.success) {
      throw new APIError('Failed to fetch user snapshots');
    }

    console.log('👤 [USER-SERVICE] Successfully fetched', response.count, 'snapshots');

    return {
      snapshots: response.snapshots,
      count: response.count,
    };
  } catch (error) {
    console.error('👤 [USER-SERVICE] Error fetching user snapshots:', error);
    throw error;
  }
}

/**
 * Fetch user's snapshot count
 */
export async function fetchUserSnapshotCount(address: string): Promise<number> {
  console.log('👤 [USER-SERVICE] Fetching user snapshot count for:', address);

  try {
    const response = await apiClient.get<CountResponse>(
      API_ENDPOINTS.userSnapshotsCount(address)
    );
    return response.count;
  } catch (error) {
    console.error('👤 [USER-SERVICE] Error fetching user snapshot count:', error);
    throw error;
  }
}

/**
 * Fetch user's pool balance
 */
export async function fetchUserBalance(address: string) {
  console.log('👤 [USER-SERVICE] Fetching user balance for:', address);

  try {
    const response = await apiClient.get<UserBalanceResponse>(
      API_ENDPOINTS.userBalance(address)
    );

    if (!response.success) {
      throw new APIError('Failed to fetch user balance');
    }

    console.log('👤 [USER-SERVICE] Successfully fetched balance:', response.balance);

    return {
      balance: response.balance,
      balanceWei: response.balanceWei,
    };
  } catch (error) {
    console.error('👤 [USER-SERVICE] Error fetching user balance:', error);
    throw error;
  }
}

/**
 * Fetch user's stats
 */
export async function fetchUserStats(address: string) {
  console.log('👤 [USER-SERVICE] Fetching user stats for:', address);

  try {
    const response = await apiClient.get<UserStatsResponse>(
      API_ENDPOINTS.userStats(address)
    );

    if (!response.success) {
      throw new APIError('Failed to fetch user stats');
    }

    console.log('👤 [USER-SERVICE] Successfully fetched user stats');

    return response.stats;
  } catch (error) {
    console.error('👤 [USER-SERVICE] Error fetching user stats:', error);
    throw error;
  }
}

/**
 * Fetch user's complete portfolio
 */
export async function fetchUserPortfolio(address: string) {
  console.log('👤 [USER-SERVICE] Fetching user portfolio for:', address);

  try {
    const response = await apiClient.get<UserPortfolioResponse>(
      API_ENDPOINTS.userPortfolio(address)
    );

    if (!response.success) {
      throw new APIError('Failed to fetch user portfolio');
    }

    console.log('👤 [USER-SERVICE] Successfully fetched user portfolio');

    return response.portfolio;
  } catch (error) {
    console.error('👤 [USER-SERVICE] Error fetching user portfolio:', error);
    throw error;
  }
}

