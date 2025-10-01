# API Quick Reference Card

## 🚀 Setup (One Time)

Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_USE_MOCK_DATA=true
```

## 📖 Read Operations

### Garden Data (Seed Listing)
```typescript
import { fetchGardenData } from '@/lib/api';

const { seeds, success, timestamp } = await fetchGardenData();
```

### Single Seed
```typescript
import { fetchSeedById } from '@/lib/api';

const seed = await fetchSeedById("1");
```

### User Portfolio (Wallet Page)
```typescript
import { fetchUserPortfolio } from '@/lib/api';

const portfolio = await fetchUserPortfolio(userAddress);
// portfolio.seeds, portfolio.snapshots, portfolio.summary
```

### User Snapshots (Tended Ecosystems)
```typescript
import { fetchUserSnapshots } from '@/lib/api';

const { snapshots, count } = await fetchUserSnapshots(userAddress);
```

### Beneficiaries
```typescript
import { fetchBeneficiaries, fetchBeneficiaryByCode } from '@/lib/api';

const beneficiaries = await fetchBeneficiaries();
const beneficiary = await fetchBeneficiaryByCode("01-GRG");
```

## ✍️ Write Operations

### Using the Hook (Recommended)
```typescript
import { prepareMintSnapshot, useWriteTransaction } from '@/lib/api';

function MyComponent() {
  const { execute, isLoading, isSuccess, error } = useWriteTransaction();

  async function handleMint() {
    try {
      // Step 1: Prepare transaction
      const txData = await prepareMintSnapshot({
        seedId: 1,
        beneficiaryIndex: 0,
        processId: "process-123",
        value: "0.01",
        projectCode: "01-GRG"
      });

      // Step 2: Execute with wallet
      const hash = await execute(txData);
      console.log('Success!', hash);
    } catch (err) {
      console.error('Failed:', err);
    }
  }

  return (
    <button onClick={handleMint} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Mint Snapshot'}
    </button>
  );
}
```

### Other Write Operations
```typescript
import { 
  prepareCreateSeed,
  prepareDepositToSeed,
  prepareWithdrawFromSeed,
  prepareClaimProfits 
} from '@/lib/api';

// Create Seed
const txData = await prepareCreateSeed({
  snapshotPrice: "0.01",
  location: "BERLIN"
});

// Deposit
const txData = await prepareDepositToSeed("1", { amount: "1.5" });

// Withdraw
const txData = await prepareWithdrawFromSeed("1", { amount: "1.0" });

// Claim Profits
const txData = await prepareClaimProfits("1");
```

## 🎭 Mock Data

### Use Mock Data Directly
```typescript
import { 
  mockSeedsData, 
  mockTendedEcosystems, 
  mockBeneficiariesData 
} from '@/lib/api';

// For testing UI without API calls
const seeds = mockSeedsData.seeds;
const ecosystems = mockTendedEcosystems;
const beneficiaries = mockBeneficiariesData;
```

## 🔧 Configuration

### Switch to Live Backend
```env
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_BASE_URL=https://api.seedify.com/api
```

### Check Current Config
```typescript
import { API_CONFIG } from '@/lib/api';

console.log('Using mock data:', API_CONFIG.useMockData);
console.log('API URL:', API_CONFIG.baseUrl);
```

## 🎯 Common Patterns

### Loading State
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchGardenData()
    .then(setData)
    .finally(() => setLoading(false));
}, []);
```

### Error Handling
```typescript
try {
  const data = await fetchGardenData();
} catch (error) {
  // Error is logged, mock data returned automatically
  console.error('API error:', error);
}
```

### Conditional Rendering
```typescript
{portfolio ? (
  <div>Balance: {portfolio.summary.poolBalance}</div>
) : (
  <div>Loading...</div>
)}
```

## 📱 Wallet Integration

### Get User Address
```typescript
import { useAccount } from 'wagmi';

const { address, isConnected } = useAccount();

if (isConnected && address) {
  const portfolio = await fetchUserPortfolio(address);
}
```

### Execute Transaction
```typescript
const { execute } = useWriteTransaction();

// Prepare transaction data from backend
const txData = await prepareDepositToSeed("1", { amount: "1.0" });

// Execute with user's wallet
const hash = await execute(txData);
```

## 🐛 Debugging

### Enable Detailed Logs
All services include detailed console logging:
- 🌸 `[SEED-SERVICE]`
- 👤 `[USER-SERVICE]`
- ✍️ `[WRITE-SERVICE]`
- 🌱 `[BENEFICIARY-SERVICE]`
- `[API]` Raw fetch calls

### Test with Mock Data First
```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```
This isolates UI issues from API issues.

### Check Network Tab
All API calls are logged in browser DevTools Network tab.

## 📚 Type Definitions

All types in `src/types/api.ts`:
```typescript
import type { 
  SeedsResponse,
  SeedResponse,
  UserPortfolioResponse,
  BeneficiariesResponse,
  WriteTransactionData
} from '@/types/api';
```

## 🎨 Complete Example

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { 
  fetchUserPortfolio,
  prepareMintSnapshot,
  useWriteTransaction 
} from '@/lib/api';

export default function WalletPage() {
  const { address } = useAccount();
  const [portfolio, setPortfolio] = useState(null);
  const { execute, isLoading } = useWriteTransaction();

  // Fetch user data on mount
  useEffect(() => {
    if (address) {
      fetchUserPortfolio(address).then(setPortfolio);
    }
  }, [address]);

  // Handle mint transaction
  const handleMint = async () => {
    const txData = await prepareMintSnapshot({
      seedId: 1,
      beneficiaryIndex: 0,
      processId: `process-${Date.now()}`,
      value: "0.01",
      projectCode: "01-GRG"
    });
    
    await execute(txData);
    
    // Refresh portfolio after transaction
    if (address) {
      fetchUserPortfolio(address).then(setPortfolio);
    }
  };

  if (!portfolio) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Portfolio</h1>
      <p>Seeds: {portfolio.summary.totalSeeds}</p>
      <p>Balance: {portfolio.summary.poolBalance} ETH</p>
      
      <button onClick={handleMint} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Mint Snapshot'}
      </button>
    </div>
  );
}
```

---

**Need More Help?** See `API_INTEGRATION.md` for detailed examples and explanations.

