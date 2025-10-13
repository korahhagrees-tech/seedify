/**
 * Contract ABIs for Way of Flowers
 * Centralized exports for all contract ABIs
 */

import snapshotNFTABI from './abi/snapshotnft-abi.json';
import seedNFTABI from './abi/seednft-abi.json';
import seedFactoryABI from './abi/seedfactory-abi.json';
import snapFactoryABI from './abi/snapfactory-abi.json';
import distributorABI from './abi/distributor-abi.json';
import aavePoolABI from './abi/aavepool-abi.json';
import AWETHABI from './abi/AWETH.abi.json';
import WETHABI from './abi/WETH.abi.json';

// Export individual ABIs
export const SNAPSHOT_NFT_ABI = snapshotNFTABI;
export const SEED_NFT_ABI = seedNFTABI;
export const SEED_FACTORY_ABI = seedFactoryABI;
export const SNAP_FACTORY_ABI = snapFactoryABI;
export const DISTRIBUTOR_ABI = distributorABI;
export const AAVE_POOL_ABI = aavePoolABI;
export const AWETH_ABI = AWETHABI;
export const WETH_ABI = WETHABI;

// Export all ABIs as an object for convenience
export const CONTRACT_ABIS = {
  SNAPSHOT_NFT: SNAPSHOT_NFT_ABI,
  SEED_NFT: SEED_NFT_ABI,
  SEED_FACTORY: SEED_FACTORY_ABI,
  SNAP_FACTORY: SNAP_FACTORY_ABI,
  DISTRIBUTOR: DISTRIBUTOR_ABI,
  AAVE_POOL: AAVE_POOL_ABI,
  AWETH: AWETH_ABI,
  WETH: WETH_ABI,
};
