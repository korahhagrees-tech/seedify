# API Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │  Garden Page   │  │  Wallet Page   │  │   Seed Detail  │   │
│  │                │  │                │  │      Page      │   │
│  │ - Seed Listing │  │ - Portfolio    │  │ - Blooming     │   │
│  │ - Filters      │  │ - Tended       │  │ - Story        │   │
│  │                │  │   Ecosystems   │  │ - Actions      │   │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘   │
│           │                   │                    │            │
│           └───────────────────┼────────────────────┘            │
│                               │                                 │
│  ┌────────────────────────────▼──────────────────────────────┐ │
│  │              API Service Layer (@/lib/api)                 │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │                                                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ seedService  │  │ userService  │  │writeService  │    │ │
│  │  ├──────────────┤  ├──────────────┤  ├──────────────┤    │ │
│  │  │ Garden Data  │  │ Portfolio    │  │ Prepare TX   │    │ │
│  │  │ Seed by ID   │  │ Snapshots    │  │ Execute TX   │    │ │
│  │  │ Seed Count   │  │ Balance      │  │              │    │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │ │
│  │         │                  │                 │             │ │
│  │  ┌──────────────┐          │                 │             │ │
│  │  │beneficiary   │          │                 │             │ │
│  │  │   Service    │          │                 │             │ │
│  │  ├──────────────┤          │                 │             │ │
│  │  │ List         │          │                 │             │ │
│  │  │ By Index     │          │                 │             │ │
│  │  │ By Code      │          │                 │             │ │
│  │  └──────┬───────┘          │                 │             │ │
│  │         │                  │                 │             │ │
│  │         └──────────────────┼─────────────────┘             │ │
│  │                            │                               │ │
│  └────────────────────────────┼───────────────────────────────┘ │
│                               │                                 │
│  ┌────────────────────────────▼──────────────────────────────┐ │
│  │                    API Client                              │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ • Fetch wrapper with retry                                 │ │
│  │ • Timeout handling (10s)                                   │ │
│  │ • Error handling                                           │ │
│  │ • Automatic fallback to mock data                          │ │
│  │ • Logging                                                  │ │
│  └────────────────┬───────────────────────┬───────────────────┘ │
│                   │                       │                     │
└───────────────────┼───────────────────────┼─────────────────────┘
                    │                       │
                    │                       │
      ┌─────────────▼────────┐   ┌──────────▼──────────┐
      │  NEXT_PUBLIC_        │   │   Mock Data         │
      │  USE_MOCK_DATA       │   │   (@/lib/api/mocks) │
      │                      │   │                     │
      │  true ──────────────────▶│ • seedMocks.ts     │
      │                      │   │ • userMocks.ts     │
      │  false               │   │ • beneficiary...   │
      │    │                 │   └────────────────────┘
      └────┼─────────────────┘
           │
           │
      ┌────▼──────────────────────────────────────────────────┐
      │              Live Backend API                         │
      │         (NEXT_PUBLIC_API_BASE_URL)                    │
      ├───────────────────────────────────────────────────────┤
      │                                                        │
      │  Read Endpoints:                                      │
      │  • GET /seeds                                         │
      │  • GET /seeds/:id                                     │
      │  • GET /beneficiaries                                 │
      │  • GET /users/:address/portfolio                      │
      │  • GET /users/:address/snapshots                      │
      │  • ... more                                           │
      │                                                        │
      │  Write Endpoints:                                     │
      │  • POST /write/seeds/create                           │
      │  • POST /write/seeds/:id/deposit                      │
      │  • POST /write/snapshots/mint                         │
      │  • ... more                                           │
      │                                                        │
      └───────────────────────┬───────────────────────────────┘
                              │
                              │ Returns Transaction Data
                              │ (not executing transaction)
                              │
      ┌───────────────────────▼───────────────────────────────┐
      │              Wallet Interaction                        │
      │                  (wagmi/viem)                          │
      ├───────────────────────────────────────────────────────┤
      │                                                        │
      │  User approves transaction in wallet                  │
      │  Transaction executed on-chain                        │
      │                                                        │
      └───────────────────────┬───────────────────────────────┘
                              │
                              │
      ┌───────────────────────▼───────────────────────────────┐
      │              Smart Contracts                           │
      │                (Base Network)                          │
      ├───────────────────────────────────────────────────────┤
      │                                                        │
      │  • SeedNFT Contract                                   │
      │  • SnapshotNFT Contract                               │
      │  • SeedFactory Contract                               │
      │  • Distributor Contract                               │
      │                                                        │
      └───────────────────────────────────────────────────────┘
```

## Data Flow: Read Operations

```
Component
   │
   └─▶ Service (e.g., fetchGardenData)
        │
        ├─▶ Check API_CONFIG.useMockData
        │    │
        │    ├─▶ true  ──▶ Return Mock Data ──▶ Component
        │    │
        │    └─▶ false ──▶ API Client
        │                   │
        │                   ├─▶ Fetch from Backend
        │                   │    │
        │                   │    ├─▶ Success ──▶ Return Data ──▶ Component
        │                   │    │
        │                   │    └─▶ Error ──▶ Log Error ──▶ Fallback to Mock ──▶ Component
        │
        └─▶ Transform data if needed ──▶ Component
```

## Data Flow: Write Operations

```
Component (User clicks "Mint Snapshot")
   │
   ├─▶ Step 1: Prepare Transaction
   │    │
   │    └─▶ prepareMintSnapshot(params)
   │         │
   │         └─▶ API Client
   │              │
   │              └─▶ POST /write/snapshots/mint
   │                   │
   │                   └─▶ Backend returns Transaction Data
   │                        {
   │                          contractAddress: "0x...",
   │                          functionName: "mintSnapshot",
   │                          args: [...],
   │                          value: "0.01"
   │                        }
   │
   ├─▶ Step 2: Execute Transaction
   │    │
   │    └─▶ executeTransaction(txData)
   │         │
   │         └─▶ useWriteContract (wagmi)
   │              │
   │              └─▶ Wallet Popup
   │                   │
   │                   ├─▶ User Approves ──▶ Transaction Sent
   │                   │                      │
   │                   │                      └─▶ On-chain
   │                   │                           │
   │                   │                           └─▶ Success ──▶ Component
   │                   │
   │                   └─▶ User Rejects ──▶ Error ──▶ Component
   │
   └─▶ Update UI based on result
```

## Environment-Based Routing

```
┌─────────────────────────────────────────┐
│         .env.local                       │
├─────────────────────────────────────────┤
│ NEXT_PUBLIC_USE_MOCK_DATA=true          │
│ NEXT_PUBLIC_API_BASE_URL=...            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         API_CONFIG                       │
├─────────────────────────────────────────┤
│ useMockData: boolean                    │
│ baseUrl: string                         │
└──────────────┬──────────────────────────┘
               │
               ▼
        ┌──────┴──────┐
        │             │
   true │             │ false
        │             │
        ▼             ▼
┌─────────────┐  ┌─────────────┐
│  Mock Data  │  │  Live API   │
└─────────────┘  └─────────────┘
```

## Service Layer Structure

```
src/lib/api/
│
├── config.ts              # Configuration & endpoints
├── client.ts              # Fetch wrapper
├── index.ts               # Central export
│
├── services/
│   ├── seedService.ts     # Seed operations
│   ├── userService.ts     # User operations
│   ├── writeService.ts    # Write transactions
│   └── beneficiaryService.ts  # Beneficiary operations
│
├── mocks/
│   ├── seedMocks.ts       # Mock seed data
│   ├── userMocks.ts       # Mock user data
│   └── beneficiaryMocks.ts    # Mock beneficiary data
│
└── hooks/
    └── useWriteTransaction.ts  # React hook for writes
```

## Error Handling Flow

```
API Call
   │
   ├─▶ Timeout (10s)
   │    │
   │    └─▶ Retry (3x with exponential backoff)
   │         │
   │         ├─▶ Success ──▶ Return Data
   │         │
   │         └─▶ All retries failed
   │              │
   │              ├─▶ Log detailed error
   │              │
   │              └─▶ Fallback to Mock Data
   │                   │
   │                   └─▶ Return Mock Data to Component
   │
   └─▶ Network Error
        │
        └─▶ Same retry flow as above
```

## Type Safety Flow

```
Backend Response
   │
   └─▶ Type Definition in src/types/api.ts
        │
        ├─▶ SeedsResponse
        ├─▶ SeedResponse
        ├─▶ UserPortfolioResponse
        ├─▶ WriteTransactionResponse
        └─▶ ... more
             │
             └─▶ Service Layer
                  │
                  └─▶ Transform if needed
                       │
                       └─▶ Component (Fully typed)
```

## Deployment Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    Development                             │
├───────────────────────────────────────────────────────────┤
│ NEXT_PUBLIC_USE_MOCK_DATA=true                            │
│ NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api        │
│                                                            │
│ ✓ Fast iteration                                          │
│ ✓ No backend dependency                                   │
│ ✓ Predictable data                                        │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                     Staging                                │
├───────────────────────────────────────────────────────────┤
│ NEXT_PUBLIC_USE_MOCK_DATA=false                           │
│ NEXT_PUBLIC_API_BASE_URL=https://staging-api.seedify.com  │
│                                                            │
│ ✓ Test with real backend                                  │
│ ✓ Test wallet interactions                                │
│ ✓ Fallback to mock if API fails                           │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│                    Production                              │
├───────────────────────────────────────────────────────────┤
│ NEXT_PUBLIC_USE_MOCK_DATA=false                           │
│ NEXT_PUBLIC_API_BASE_URL=https://api.seedify.com          │
│                                                            │
│ ✓ Live backend                                            │
│ ✓ Real blockchain transactions                            │
│ ✓ Fallback to mock ensures uptime                         │
└───────────────────────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ **Separation of Concerns**: Services, mocks, and client are separate
- ✅ **Environment Flexibility**: Easy switching between mock and live
- ✅ **Robust Error Handling**: Retry, timeout, and fallback
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Secure Transactions**: Two-step process with user approval
- ✅ **Developer Experience**: Clean API, good logging, easy debugging

