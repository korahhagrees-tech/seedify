# API Integration Guide

## Overview
This document explains the new robust API integration system that separates mock data from live backend interactions.

## Architecture

```
src/lib/api/
├── config.ts              # API configuration and endpoints
├── client.ts              # Fetch wrappers with retry and timeout
├── index.ts               # Central export
├── services/
│   ├── seedService.ts     # Seed-related API calls
│   ├── userService.ts     # User-specific API calls (wallet page)
│   ├── writeService.ts    # Write transactions (wallet interactions)
│   └── beneficiaryService.ts  # Beneficiary-related API calls
└── mocks/
    ├── seedMocks.ts       # Mock seed data
    ├── userMocks.ts       # Mock user data
    └── beneficiaryMocks.ts # Mock beneficiary data
```

## Environment Configuration

Create a `.env.local` file in the project root:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_USE_MOCK_DATA=true

# For production
# NEXT_PUBLIC_API_BASE_URL=https://api.seedify.com/api
# NEXT_PUBLIC_USE_MOCK_DATA=false
```

## Usage Examples

### 1. Fetching Garden Data (Seed Listing)

```typescript
import { fetchGardenData } from '@/lib/api';

// In your component
const gardenData = await fetchGardenData();
// Returns: { success: boolean, seeds: Seed[], timestamp: number }
```

### 2. Fetching User's Portfolio (Wallet Page)

```typescript
import { fetchUserPortfolio } from '@/lib/api';

const portfolio = await fetchUserPortfolio(userAddress);
// Returns: { seeds: Seed[], snapshots: Snapshot[], summary: {...} }
```

### 3. Fetching User's Tended Ecosystems

```typescript
import { fetchUserSnapshots } from '@/lib/api';

const { snapshots, count } = await fetchUserSnapshots(userAddress);
// Use snapshots to populate TendedEcosystem components
```

### 4. Write Transactions (Minting Snapshot)

```typescript
import { prepareMintSnapshot, executeTransaction } from '@/lib/api';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

// In your component
const { writeContractAsync } = useWriteContract();
const { waitForTransactionReceiptAsync } = useWaitForTransactionReceipt();

async function handleMintSnapshot() {
  try {
    // Step 1: Prepare transaction data from backend
    const txData = await prepareMintSnapshot({
      seedId: 1,
      beneficiaryIndex: 0,
      processId: "process-123",
      value: "0.01",
      projectCode: "01-GRG"
    });

    // Step 2: Execute transaction with wallet
    const hash = await executeTransaction({
      transactionData: txData,
      writeContract: writeContractAsync,
      waitForTransactionReceipt: waitForTransactionReceiptAsync
    });

    console.log('Transaction successful:', hash);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
}
```

### 5. Fetching Beneficiaries

```typescript
import { fetchBeneficiaries, fetchBeneficiaryByCode } from '@/lib/api';

// Get all beneficiaries
const beneficiaries = await fetchBeneficiaries();

// Get specific beneficiary
const beneficiary = await fetchBeneficiaryByCode("01-GRG");
```

## Mock Data vs Live Backend

The system automatically switches between mock data and live backend based on `NEXT_PUBLIC_USE_MOCK_DATA`:

- **`true`**: Uses mock data from `src/lib/api/mocks/`
- **`false`**: Fetches from live backend API

All services gracefully fallback to mock data if the API call fails.

## Error Handling

All API calls include:
- **Timeout support** (10 seconds default)
- **Retry logic** (3 retries with exponential backoff)
- **Automatic fallback** to mock data
- **Detailed console logging** for debugging

Example:
```typescript
try {
  const data = await fetchGardenData();
} catch (error) {
  // Error is already handled and logged
  // Mock data is returned automatically
  console.error('Failed to fetch data:', error);
}
```

## API Response Types

All response types are defined in `src/types/api.ts`:

- `GardenDataResponse` - List of seeds
- `SeedResponse` - Single seed details
- `UserPortfolioResponse` - User's complete portfolio
- `UserSnapshotsResponse` - User's snapshots (tended ecosystems)
- `BeneficiariesResponse` - List of beneficiaries
- `WriteTransactionResponse` - Transaction data for wallet execution

## Wallet Integration for Write Operations

Write operations follow a two-step process:

1. **Backend prepares transaction data**:
   - Contract address
   - Function name
   - Arguments
   - Value (ETH amount)

2. **Frontend executes with wallet**:
   - Uses wagmi/viem
   - User approves in wallet
   - Transaction is sent on-chain

This ensures the backend doesn't need private keys and the user maintains full control.

## Migration Guide

### Old Code:
```typescript
import { fetchGardenData } from '@/lib/api/seeds';
const data = await fetchGardenData();
```

### New Code:
```typescript
import { fetchGardenData } from '@/lib/api';
const data = await fetchGardenData();
```

The old `seeds.ts` file is kept for backward compatibility but marked as deprecated.

## Backend Schema Alignment

The API integration follows the schema defined in `BACKEND_API_SCHEMA.md`:

- ✅ Read endpoints (seeds, beneficiaries, snapshots, user data)
- ✅ Write endpoints (create seed, deposit, withdraw, mint snapshot)
- ❌ Admin endpoints (excluded - frontend doesn't need these)

## Debugging

Enable detailed logging by checking browser console:

- `🌸 [SEED-SERVICE]` - Seed-related operations
- `👤 [USER-SERVICE]` - User-related operations
- `✍️ [WRITE-SERVICE]` - Write transactions
- `🌱 [BENEFICIARY-SERVICE]` - Beneficiary operations
- `[API]` - Raw API calls

## Testing

To test with mock data:
1. Set `NEXT_PUBLIC_USE_MOCK_DATA=true` in `.env.local`
2. All API calls will use mock data from `src/lib/api/mocks/`

To test with live backend:
1. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` in `.env.local`
2. Set `NEXT_PUBLIC_API_BASE_URL=http://your-backend-url/api`
3. Ensure backend is running and accessible

## Best Practices

1. **Always import from `@/lib/api`**, not individual files
2. **Use TypeScript types** from `@/types/api.ts`
3. **Handle errors gracefully** (services auto-fallback to mocks)
4. **Test with both mock and live data** before deploying
5. **Use write services** for all on-chain transactions
6. **Never expose private keys** - wallet handles signing

## Example: Complete Wallet Page Integration

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { fetchUserPortfolio, mockTendedEcosystems } from '@/lib/api';
import TendedEcosystem from '@/components/wallet/TendedEcosystem';

export default function WalletPage() {
  const { address } = useAccount();
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    if (address) {
      fetchUserPortfolio(address).then(setPortfolio);
    }
  }, [address]);

  return (
    <div>
      {portfolio?.summary && (
        <div>
          <p>Seeds: {portfolio.summary.totalSeeds}</p>
          <p>Balance: {portfolio.summary.poolBalance} ETH</p>
        </div>
      )}
      
      {mockTendedEcosystems.map((ecosystem, index) => (
        <TendedEcosystem
          key={ecosystem.id}
          {...ecosystem}
          onReadMore={() => {}}
          onTendAgain={() => {}}
          onShare={() => {}}
          index={index}
        />
      ))}
    </div>
  );
}
```

## Support

For issues or questions:
1. Check console logs for detailed error messages
2. Verify environment variables are set correctly
3. Ensure backend API is accessible
4. Test with mock data first to isolate issues

