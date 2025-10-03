/**
 * API Response Types
 * Matching the backend schema from BACKEND_API_SCHEMA.md
 */

import { Seed, SeedMetadata, SeedStory } from './seed';

// ============================================
// Base Response Types
// ============================================

export interface APIResponse<T> {
  success: boolean;
  timestamp: number;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// Beneficiary Types
// ============================================

export interface BeneficiaryProjectData {
  title: string;
  subtitle: string;
  location: string;
  area: string;
  description: string;
  benefits: string[];
  moreDetails: string;
  backgroundImage: string;
}

export interface BeneficiaryData {
  index: number;
  address: string;
  name: string;
  code: string;
  allocatedAmount: string;
  totalClaimed: string;
  claimableAmount: string;
  isActive: boolean;
  percentage: string;
  beneficiaryValue: string;
  slug?: string;
  projectData?: BeneficiaryProjectData;
}

export interface BeneficiariesResponse {
  success: boolean;
  beneficiaries: BeneficiaryData[];
  timestamp: number;
}

export interface BeneficiaryResponse {
  success: boolean;
  beneficiary: BeneficiaryData;
  timestamp: number;
}

// ============================================
// Seed Types (Backend Schema)
// ============================================

export interface SeedResponse {
  success: boolean;
  seed: BackendSeed;
  timestamp: number;
}

export interface SeedsResponse {
  success: boolean;
  seeds: BackendSeed[];
  timestamp: number;
}

export interface BackendSeed {
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
  metadata?: SeedMetadata;
  location?: string;
  ecosystemProjects?: EcosystemProject[];
  wayOfFlowersData?: WayOfFlowersData;
  story?: SeedStory;
  beneficiaries?: BeneficiaryData[];
}

export interface EcosystemProject {
  title: string;
  subtitle: string;
  shortText: string;
  extendedText: string;
  backgroundImageUrl: string;
  seedEmblemUrl: string;
}

export interface WayOfFlowersData {
  backgroundImageUrl: string;
  seedEmblemUrl: string;
  firstText: string;
  secondText: string;
  thirdText: string;
  mainQuote: string;
  author: string;
}

// ============================================
// Snapshot Types
// ============================================

export interface Snapshot {
  id: number;
  creator: string;
  value: number;
  valueEth: string;
  beneficiaryIndex: number;
  seedId: number;
  timestamp: number;
  blockNumber: number;
  positionInSeed: number;
  processId: string;
}

export interface SnapshotsResponse {
  success: boolean;
  snapshots: Snapshot[];
  count: number;
  timestamp: number;
}

export interface SnapshotStatsResponse {
  success: boolean;
  stats: {
    totalSnapshots: number;
    totalValueRaised: string;
    latestSnapshotId: number;
  };
  timestamp: number;
}

// ============================================
// User Types
// ============================================

export interface UserSeedsResponse {
  success: boolean;
  seeds: BackendSeed[];
  count: number;
  owner: string;
  timestamp: number;
}

export interface UserSnapshotsResponse {
  success: boolean;
  snapshots: Snapshot[];
  count: number;
  creator: string;
  timestamp: number;
}

export interface UserBalanceResponse {
  success: boolean;
  balance: string;
  balanceWei: string;
  user: string;
  timestamp: number;
}

export interface UserStatsResponse {
  success: boolean;
  stats: {
    totalSeeds: number;
    totalSnapshots: number;
    poolBalance: string;
    seedNFTBalance: number;
    snapshotNFTBalance: number;
  };
  user: string;
  timestamp: number;
}

export interface UserPortfolioResponse {
  success: boolean;
  portfolio: {
    seeds: BackendSeed[];
    snapshots: Snapshot[];
    summary: {
      totalSeeds: number;
      totalSnapshots: number;
      totalDeposited: string;
      totalSnapshotValue: string;
      poolBalance: string;
    };
  };
  user: string;
  timestamp: number;
}

// ============================================
// Write Operation Types
// ============================================

export interface WriteTransactionData {
  contractAddress: string;
  functionName: string;
  args: unknown[];
  value: string;
  description: string;
}

export interface WriteTransactionResponse {
  success: boolean;
  data: WriteTransactionData;
  message: string;
  timestamp: number;
}

export interface CreateSeedRequest {
  snapshotPrice: string;
  location: string;
}

export interface DepositRequest {
  amount: string;
}

export interface WithdrawRequest {
  amount: string;
}

export interface MintSnapshotRequest {
  seedId: number;
  beneficiaryIndex: number;
  processId: string;
  value: string;
  projectCode: string;
}

// ============================================
// Health & Status Types
// ============================================

export interface HealthResponse {
  status: string;
  timestamp: number;
}

export interface StatusResponse {
  success: boolean;
  data: {
    contractsConnected: boolean;
    usingMockData: boolean;
  };
  timestamp: number;
}

export interface CountResponse {
  success: boolean;
  count: number;
  timestamp: number;
}

