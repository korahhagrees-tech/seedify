/**
 * API Configuration
 * 
 * Environment variables:
 * - NEXT_PUBLIC_API_BASE_URL: Backend API base URL (required)
 */

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000, // 10 seconds
  retries: 3,
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Health & Status
  health: '/health',
  status: '/status',
  
  // Seeds
  seeds: '/seeds',
  seedById: (id: string) => `/seeds/${id}`,
  seedsCount: '/seeds/count',
  
  // Beneficiaries
  beneficiaries: '/beneficiaries',
  beneficiaryByIndex: (index: number) => `/beneficiaries/${index}`,
  beneficiaryByCode: (code: string) => `/beneficiaries/code/${code}`,
  
  // Snapshots
  snapshotsBySeed: (seedId: string) => `/snapshots/seed/${seedId}`,
  snapshotsByBeneficiary: (beneficiaryIndex: number) => `/snapshots/beneficiary/${beneficiaryIndex}`,
  snapshotStats: '/snapshots/stats',
  
  // User-Specific
  userSeeds: (address: string) => `/users/${address}/seeds`,
  userSeedsCount: (address: string) => `/users/${address}/seeds/count`,
  userSnapshots: (address: string) => `/users/${address}/snapshots`,
  userSnapshotsCount: (address: string) => `/users/${address}/snapshots/count`,
  userSnapshotsData: (address: string) => `/users/${address}/snapshots/data`,
  userBalance: (address: string) => `/users/${address}/balance`,
  userStats: (address: string) => `/users/${address}/stats`,
  userPortfolio: (address: string) => `/users/${address}/portfolio`,
  
  // Write Operations
  writeCreateSeed: '/write/seeds/create',
  writeDepositToSeed: (id: string) => `/write/seeds/${id}/deposit`,
  writeWithdrawFromSeed: (id: string) => `/write/seeds/${id}/withdraw`,
  writeClaimProfits: (id: string) => `/write/seeds/${id}/claim-profits`,
  writeMintSnapshot: '/write/snapshots/mint',
} as const;

