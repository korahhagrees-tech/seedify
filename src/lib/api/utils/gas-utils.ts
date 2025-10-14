// /**
//  * 🔥 Gas utilities for transaction estimation and debugging
//  * 
//  * Provides helpful gas estimation and pricing utilities for the WOF minting system
//  */

// import { PublicClient } from 'viem';

// export interface GasEstimate {
//   gasLimit: bigint;
//   gasPrice: bigint;
//   maxFeePerGas?: bigint;
//   maxPriorityFeePerGas?: bigint;
//   estimatedCost: bigint;
//   estimatedCostEth: number;
// }

// /**
//  * Get current gas prices from the network
//  */
// export async function getCurrentGasPrices(publicClient: PublicClient): Promise<{
//   gasPrice: bigint;
//   maxFeePerGas?: bigint;
//   maxPriorityFeePerGas?: bigint;
// }> {
//   try {
//     const gasPrice = await publicClient.getGasPrice();
    
//     // Try to get EIP-1559 gas prices if supported
//     try {
//       const feeData = await publicClient.estimateFeesPerGas();
//       return {
//         gasPrice,
//         maxFeePerGas: feeData.maxFeePerGas,
//         maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
//       };
//     } catch {
//       // Fallback to legacy gas price
//       return { gasPrice };
//     }
//   } catch (error) {
//     console.warn('Failed to get gas prices:', error);
//     // Fallback to reasonable defaults (50 gwei)
//     return { gasPrice: 50000000000n };
//   }
// }

// /**
//  * Estimate gas for a mint transaction with detailed breakdown
//  */
// export async function estimateMintGas(
//   publicClient: PublicClient,
//   contractAddress: string,
//   abi: any,
//   args: any[],
//   value: bigint,
//   account: string
// ): Promise<GasEstimate> {
//   try {
//     // Estimate gas limit - ensure args includes feeRecipient for SnapFactory
//     const gasLimit = await publicClient.estimateContractGas({
//       address: contractAddress as `0x${string}`,
//       abi,
//       functionName: 'mintSnapshot',
//       args,
//       value,
//       account: account as `0x${string}`,
//     });

//     // Add 20% buffer for safety
//     const gasLimitWithBuffer = (gasLimit * 120n) / 100n;

//     // Get current gas prices
//     const gasPrices = await getCurrentGasPrices(publicClient);

//     // Calculate estimated cost
//     const estimatedCost = gasLimitWithBuffer * gasPrices.gasPrice;
//     const estimatedCostEth = Number(estimatedCost) / 1e18;

//     return {
//       gasLimit: gasLimitWithBuffer,
//       gasPrice: gasPrices.gasPrice,
//       ...(gasPrices.maxFeePerGas && { maxFeePerGas: gasPrices.maxFeePerGas }),
//       ...(gasPrices.maxPriorityFeePerGas && { maxPriorityFeePerGas: gasPrices.maxPriorityFeePerGas }),
//       estimatedCost,
//       estimatedCostEth,
//     };
//   } catch (error) {
//     console.warn('Gas estimation failed, using defaults:', error);
    
//     // Return reasonable defaults
//     const defaultGasLimit = 800000n;
//     const defaultGasPrice = 50000000000n; // 50 gwei
//     const estimatedCost = defaultGasLimit * defaultGasPrice;
    
//     return {
//       gasLimit: defaultGasLimit,
//       gasPrice: defaultGasPrice,
//       estimatedCost,
//       estimatedCostEth: Number(estimatedCost) / 1e18,
//     };
//   }
// }

// /**
//  * Check if user has sufficient balance for transaction + gas
//  */
// export async function checkSufficientBalance(
//   publicClient: PublicClient,
//   userAddress: string,
//   transactionValue: bigint,
//   gasEstimate: GasEstimate
// ): Promise<{
//   hasBalance: boolean;
//   balance: bigint;
//   balanceEth: number;
//   required: bigint;
//   requiredEth: number;
//   shortfall?: bigint;
//   shortfallEth?: number;
// }> {
//   const balance = await publicClient.getBalance({
//     address: userAddress as `0x${string}`,
//   });

//   const required = transactionValue + gasEstimate.estimatedCost;
//   const hasBalance = balance >= required;

//   const result = {
//     hasBalance,
//     balance,
//     balanceEth: Number(balance) / 1e18,
//     required,
//     requiredEth: Number(required) / 1e18,
//   };

//   if (!hasBalance) {
//     const shortfall = required - balance;
//     return {
//       ...result,
//       shortfall,
//       shortfallEth: Number(shortfall) / 1e18,
//     };
//   }

//   return result;
// }

// /**
//  * Format gas estimate for logging
//  */
// export function formatGasEstimate(estimate: GasEstimate): string {
//   return `Gas: ${estimate.gasLimit.toString()} units @ ${Number(estimate.gasPrice) / 1e9} gwei = ${estimate.estimatedCostEth.toFixed(6)} ETH`;
// }

// /**
//  * Get human-readable error message for common gas-related failures
//  */
// export function getGasErrorMessage(error: any): string | null {
//   const errorMessage = error.message || error.toString();
  
//   if (errorMessage.includes('insufficient funds for gas')) {
//     return 'Insufficient funds to cover gas fees. Please add ETH to your wallet.';
//   }
  
//   if (errorMessage.includes('gas required exceeds allowance')) {
//     return 'Transaction requires more gas than allowed. The network may be congested.';
//   }
  
//   if (errorMessage.includes('gas limit reached')) {
//     return 'Transaction failed due to gas limit. Please try again when network is less busy.';
//   }
  
//   if (errorMessage.includes('gas estimation failed')) {
//     return 'Unable to estimate gas costs. The transaction may fail or network may be unstable.';
//   }
  
//   if (errorMessage.includes('gas price too low')) {
//     return 'Gas price too low for current network conditions. Please try again.';
//   }
  
//   return null; // Not a gas-related error
// }
