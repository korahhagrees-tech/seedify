# Wallet Page Integration Example

## Before (Current Implementation)

```typescript
// src/app/wallet/page.tsx (OLD)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TendedEcosystem from "@/components/wallet/TendedEcosystem";

// Hardcoded mock data
const mockTendedEcosystems = [
  {
    id: "1",
    date: "07/09/2025",
    seedEmblemUrl: assets.glowers,
    beneficiaryName: "Grgich Hills Estate Regenerative Sheep Grazing",
    seedImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
    userContribution: "0.011 ETH",
    ecosystemCompost: "1.03 ETH"
  }
];

export default function WalletPage() {
  const [tendedEcosystems] = useState(mockTendedEcosystems);

  return (
    <div>
      {tendedEcosystems.map((ecosystem, index) => (
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

## After (New Implementation)

```typescript
// src/app/wallet/page.tsx (NEW)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { assets } from "@/lib/assets";
import RootShapeArea from "@/components/wallet/RootShapeArea";
import TendedEcosystem from "@/components/wallet/TendedEcosystem";
import WalletModal from "@/components/wallet/WalletModal";
import GardenHeader from "@/components/GardenHeader";
import { useAuth } from "@/components/auth/AuthProvider";

// NEW: Import from unified API
import {
  fetchUserPortfolio,
  fetchUserSnapshots,
  prepareMintSnapshot,
  useWriteTransaction,
  mockTendedEcosystems, // Fallback for display
} from "@/lib/api";

// NEW: Type for tended ecosystem display
interface TendedEcosystemDisplay {
  id: string;
  date: string;
  seedEmblemUrl: string;
  beneficiaryName: string;
  seedImageUrl: string;
  userContribution: string;
  ecosystemCompost: string;
}

export default function WalletPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { address, isConnected } = useAccount(); // NEW: Get wallet address
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // NEW: State for user data
  const [portfolio, setPortfolio] = useState<any>(null);
  const [tendedEcosystems, setTendedEcosystems] = useState<TendedEcosystemDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  // NEW: Write transaction hook
  const { execute, isLoading: isTxLoading } = useWriteTransaction();

  // NEW: Fetch user data on mount and when address changes
  useEffect(() => {
    async function loadUserData() {
      if (!isConnected || !address) {
        // Use mock data if not connected
        setTendedEcosystems(mockTendedEcosystems);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch user portfolio (includes stats)
        const portfolioData = await fetchUserPortfolio(address);
        setPortfolio(portfolioData);

        // Fetch user snapshots (tended ecosystems)
        const { snapshots } = await fetchUserSnapshots(address);

        // Transform snapshots into display format
        const ecosystems = snapshots.map((snapshot, index) => ({
          id: snapshot.seedId.toString(),
          date: new Date(snapshot.timestamp * 1000).toLocaleDateString(),
          seedEmblemUrl: assets.glowers,
          beneficiaryName: getBeneficiaryName(snapshot.beneficiaryIndex),
          seedImageUrl: getSeedImageUrl(snapshot.seedId),
          userContribution: `${snapshot.valueEth} ETH`,
          ecosystemCompost: "1.03 ETH", // TODO: Calculate from portfolio data
        }));

        setTendedEcosystems(ecosystems);
      } catch (error) {
        console.error("Error loading user data:", error);
        // Fallback to mock data
        setTendedEcosystems(mockTendedEcosystems);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [address, isConnected]);

  // NEW: Helper to get beneficiary name
  const getBeneficiaryName = (index: number): string => {
    const beneficiaryNames = {
      0: "Grgich Hills Estate Regenerative Sheep Grazing",
      1: "El Globo Habitat Bank",
      2: "Jaguar Corridor Conservation",
      3: "Buena Vista Heights Conservation",
    };
    return beneficiaryNames[index as keyof typeof beneficiaryNames] || "Unknown Beneficiary";
  };

  // NEW: Helper to get seed image URL
  const getSeedImageUrl = (seedId: number): string => {
    return `https://wof-flourishing-backup.s3.amazonaws.com/seed${seedId}/seed.png`;
  };

  // UPDATED: Read more handler
  const handleReadMore = (ecosystemId: string) => {
    router.push(`/seed/${ecosystemId}/ecosystem-detail`);
  };

  // UPDATED: Tend again handler with write transaction
  const handleTendAgain = async (ecosystemId: string) => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      // Prepare transaction data from backend
      const txData = await prepareMintSnapshot({
        seedId: parseInt(ecosystemId),
        beneficiaryIndex: 0, // TODO: Let user select beneficiary
        processId: `process-${Date.now()}`,
        value: "0.01", // TODO: Let user input amount
        projectCode: "01-GRG", // TODO: Map from beneficiary
      });

      // Execute transaction with wallet
      const hash = await execute(txData);

      console.log("Snapshot minted successfully:", hash);

      // Refresh user data after successful transaction
      const portfolioData = await fetchUserPortfolio(address);
      setPortfolio(portfolioData);

      const { snapshots } = await fetchUserSnapshots(address);
      const ecosystems = snapshots.map((snapshot) => ({
        id: snapshot.seedId.toString(),
        date: new Date(snapshot.timestamp * 1000).toLocaleDateString(),
        seedEmblemUrl: assets.glowers,
        beneficiaryName: getBeneficiaryName(snapshot.beneficiaryIndex),
        seedImageUrl: getSeedImageUrl(snapshot.seedId),
        userContribution: `${snapshot.valueEth} ETH`,
        ecosystemCompost: "1.03 ETH",
      }));
      setTendedEcosystems(ecosystems);

      alert("Snapshot minted successfully!");
    } catch (error) {
      console.error("Failed to mint snapshot:", error);
      alert("Failed to mint snapshot. Please try again.");
    }
  };

  // UPDATED: Share handler
  const handleShare = (ecosystemId?: string) => {
    const url = ecosystemId
      ? `${window.location.origin}/seed/${ecosystemId}`
      : window.location.href;

    if (navigator.share) {
      navigator.share({
        title: "Way of Flowers - Tended Ecosystem",
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleWalletModalClose = () => {
    setIsWalletModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsWalletModalOpen(false);
  };

  const handleAddFunds = () => {
    console.log("Add funds");
  };

  const handleExportKey = () => {
    console.log("Export key");
  };

  const handleSwitchWallet = () => {
    console.log("Switch wallet");
  };

  const handlePrivyHome = () => {
    console.log("Privy home");
  };

  // NEW: Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading your portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <GardenHeader />

      {/* NEW: Portfolio Stats Section */}
      {portfolio && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pt-4 pb-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Your Portfolio</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Seeds</div>
                <div className="text-xl font-bold">{portfolio.summary.totalSeeds}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Snapshots</div>
                <div className="text-xl font-bold">{portfolio.summary.totalSnapshots}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Pool Balance</div>
                <div className="text-xl font-bold">{portfolio.summary.poolBalance} ETH</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content Area - Tended Ecosystems List */}
      <div className="px-4 pb-32">
        {tendedEcosystems.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-gray-400 text-lg mb-2">{`You haven't tended`}</div>
            <div className="text-gray-400 text-lg mb-8">an Ecosystem yet</div>
            <div className="text-gray-500 text-sm mb-2">Explore the Garden</div>
            <div className="text-gray-500 text-sm">to start nurturing one</div>
          </motion.div>
        ) : (
          /* Tended Ecosystems List */
          <div className="space-y-4 mb-24">
            {tendedEcosystems.map((ecosystem, index) => (
              <TendedEcosystem
                key={ecosystem.id}
                date={ecosystem.date}
                seedEmblemUrl={ecosystem.seedEmblemUrl}
                beneficiaryName={ecosystem.beneficiaryName}
                seedImageUrl={ecosystem.seedImageUrl}
                userContribution={ecosystem.userContribution}
                ecosystemCompost={ecosystem.ecosystemCompost}
                onReadMore={() => handleReadMore(ecosystem.id)}
                onTendAgain={() => handleTendAgain(ecosystem.id)}
                onShare={() => handleShare(ecosystem.id)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fixed Root Shape Area */}
      <div className="fixed -bottom-18 left-0 right-0 z-30 pt-4 scale-[1.1]">
        <div className="max-w-md mx-auto px-4">
          <RootShapeArea
            onWallet={() => setIsWalletModalOpen(true)}
            onSubstrate={() => {}}
            onExploreGarden={() => router.push("/garden")}
          />
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={handleWalletModalClose}
        onLogout={handleLogout}
        onAddFunds={handleAddFunds}
        onExportKey={handleExportKey}
        onSwitchWallet={handleSwitchWallet}
        onPrivyHome={handlePrivyHome}
      />

      {/* NEW: Transaction Loading Overlay */}
      {isTxLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full mx-auto mb-4" />
            <div className="text-lg font-semibold">Processing Transaction...</div>
            <div className="text-sm text-gray-500 mt-2">Please confirm in your wallet</div>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Key Changes Explained

### 1. **Import from Unified API**
```typescript
import {
  fetchUserPortfolio,
  fetchUserSnapshots,
  prepareMintSnapshot,
  useWriteTransaction,
  mockTendedEcosystems,
} from "@/lib/api";
```

### 2. **Fetch User Data with useEffect**
```typescript
useEffect(() => {
  if (address) {
    fetchUserPortfolio(address).then(setPortfolio);
    fetchUserSnapshots(address).then(/* transform and set */);
  }
}, [address]);
```

### 3. **Write Transaction with Wallet**
```typescript
const { execute, isLoading } = useWriteTransaction();

const handleTendAgain = async (seedId: string) => {
  const txData = await prepareMintSnapshot({...});
  const hash = await execute(txData);
  // Refresh data after success
};
```

### 4. **Loading States**
```typescript
if (loading) {
  return <LoadingScreen />;
}

{isTxLoading && <TransactionOverlay />}
```

### 5. **Environment-Based Behavior**
- **Mock Mode**: Uses `mockTendedEcosystems`
- **Live Mode**: Fetches from backend
- **Auto Fallback**: Falls back to mock if API fails

## Testing Checklist

- [ ] Test with mock data (`NEXT_PUBLIC_USE_MOCK_DATA=true`)
- [ ] Test with wallet disconnected (should show mock data)
- [ ] Test with wallet connected (should fetch user data)
- [ ] Test "Tend Again" with real wallet transaction
- [ ] Test error handling (disconnect network, check fallback)
- [ ] Test loading states
- [ ] Test portfolio stats display
- [ ] Test empty state (no tended ecosystems)

## Next Steps

1. **Add User Input for Transaction**
   - Amount selector
   - Beneficiary selector
   - Confirmation dialog

2. **Add Transaction History**
   - Show recent transactions
   - Link to block explorer

3. **Add Real-time Updates**
   - Poll for new snapshots
   - WebSocket integration

4. **Improve Error Handling**
   - Better error messages
   - Retry failed transactions
   - Transaction status tracking

