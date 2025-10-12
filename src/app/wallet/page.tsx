/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { assets } from "@/lib/assets";
import RootShapeArea from "@/components/wallet/RootShapeArea";
import TendedEcosystem from "@/components/wallet/TendedEcosystem";
import StewardSeedCard from "@/components/wallet/StewardSeedCard";
import WalletModal from "@/components/wallet/WalletModal";
import { useAuth } from "@/components/auth/AuthProvider";
import GardenHeader from "@/components/GardenHeader";
import { fetchUserSeeds, fetchBeneficiaryByIndex } from "@/lib/api";

// Mock data for tended ecosystems
// Each tended ecosystem represents a snapshot mint of a beneficiary from a seed
const mockTendedEcosystems = [
  {
    id: "1",
    date: "07/09/2025",
    seedEmblemUrl: assets.glowers,
    beneficiaryName: "Grgich Hills Estate Regenerative Sheep Grazing",
    seedImageUrl:
      "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
    userContribution: "0.011 ETH",
    ecosystemCompost: "1.03 ETH",
    seedId: "3", // The seed ID that was tended
    seedSlug: "seed-003", // The seed's label/slug
    beneficiarySlug: "grgich-hills-estate", // The beneficiary slug from that seed
  },
  {
    id: "2",
    date: "05/09/2025",
    seedEmblemUrl: assets.glowers,
    beneficiaryName: "Urban Garden Network Community Initiative",
    seedImageUrl:
      "https://wof-flourishing-backup.s3.amazonaws.com/seed2/seed.png",
    userContribution: "0.025 ETH",
    ecosystemCompost: "3.44 ETH",
    seedId: "3", // The seed ID that was tended
    seedSlug: "seed-003", // The seed's label/slug
    beneficiarySlug: "el-globo", // Another beneficiary from the same seed
  },
];

// Mock data for steward seeds (displayed above tended ecosystems when user is a steward)
const mockStewardSeeds = [
  {
    id: "001",
    label: "SEED 001",
    name: "Way Of Flowers Seed 001",
    description: "Mock steward seed",
    seedImageUrl:
      "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
    latestSnapshotUrl: null,
    snapshotCount: 43,
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    depositAmount: "1.011",
    snapshotPrice: "0.025",
    isWithdrawn: false,
    isLive: true,
    metadata: { exists: true, attributes: [] },
    story: { title: "", author: "", story: "" },
  },
];

export default function WalletPage() {
  const router = useRouter();
  const { logout, walletAddress } = useAuth();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [tendedEcosystems, setTendedEcosystems] = useState<any[]>([]);
  const [stewardSeeds, setStewardSeeds] = useState<any[]>([]);
  const [beneficiaryLinks, setBeneficiaryLinks] = useState<Map<number, string>>(new Map());

  // Fetch user's seeds (steward check) and snapshots (tended ecosystems)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!walletAddress) return;
      
      try {
        // Fetch user's seeds to check if they are a steward
        const { seeds } = await fetchUserSeeds(walletAddress);
        if (!cancelled) {
          setStewardSeeds(seeds && seeds.length > 0 ? seeds : []);
        }

        // Fetch user's snapshots to show tended ecosystems
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
        const snapshotsResponse = await fetch(`${apiBaseUrl}/users/${walletAddress}/snapshots`);
        const snapshotsData = await snapshotsResponse.json();
        
        if (snapshotsData.success && snapshotsData.snapshots.length > 0) {
          // Fetch beneficiary data for each snapshot to get readMoreLink
          const linksMap = new Map<number, string>();
          
          for (const snapshot of snapshotsData.snapshots) {
            try {
              const beneficiary = await fetchBeneficiaryByIndex(snapshot.beneficiaryIndex);
              if (beneficiary?.projectData?.readMoreLink) {
                linksMap.set(snapshot.beneficiaryIndex, beneficiary.projectData.readMoreLink);
              }
            } catch (e) {
              console.error('Failed to fetch beneficiary:', e);
            }
          }
          
          if (!cancelled) {
            setBeneficiaryLinks(linksMap);
            setTendedEcosystems(snapshotsData.snapshots);
          }
        }
      } catch (_e) {
        console.error('Failed to load wallet data:', _e);
        if (!cancelled) {
          setStewardSeeds([]);
          setTendedEcosystems([]);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

  const handleReadMore = (beneficiaryIndex: number) => {
    // Get beneficiary's readMoreLink from the map
    const link = beneficiaryLinks.get(beneficiaryIndex);
    if (link) {
      window.open(link, '_blank');
    }
  };

  const handleTendAgain = (ecosystemId: string) => {
    // Route to ecosystem page
    router.push(`/ecosystem/ecosystem-${ecosystemId}`);
  };

  const handleShare = () => {
    // Handle share functionality
    console.log("Share ecosystem");
  };

  const handleWalletModalClose = () => {
    setIsWalletModalOpen(false);
  };

  const handleLogout = async () => {
    setIsWalletModalOpen(false);
    await logout();
    router.push("/");
  };

  const handleAddFunds = () => {
    // Handle add funds
    console.log("Add funds");
  };

  const handleExportKey = () => {
    // Handle export key
    console.log("Export key");
  };

  const handleSwitchWallet = () => {
    // Handle switch wallet
    console.log("Switch wallet");
  };

  const handlePrivyHome = () => {
    // Handle privy home
    router.push("/garden");
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto overflow-x-hidden">
      {/* Header */}
      <GardenHeader />

      {/* Content Area - Tended Ecosystems List */}
      <div className="px-4 pb-40 overflow-x-hidden">
        {/* Steward Seeds Section (always show; defaults to mock if backend empty) */}
        {stewardSeeds.length > 0 && (
          <div className="space-y-8 mb-10 scale-[0.8] lg:scale-[1.0] md:scale-[1.0] -ml-10">
            {stewardSeeds.map((seed, index) => {
              // Generate slug from seed label for routing
              const seedSlug =
                seed.label?.replace(/\s+/g, "-").toLowerCase() ||
                `seed-${seed.id}`;
              return (
                <StewardSeedCard
                  key={seed.id}
                  seed={seed}
                  index={index}
                  onTendSeed={() => router.push(`/seed/${seed.id}/${seedSlug}`)}
                  onExplore={() => router.push(`/wallet/steward/${seed.id}`)}
                />
              );
            })}
          </div>
        )}
        {tendedEcosystems.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 mt-18"
          >
            <div className="text-gray-400 text-lg mb-2">{`You haven't tended`}</div>
            <div className="text-gray-400 text-lg mb-8">an Ecosystem yet</div>
            <div className="text-gray-500 text-sm mb-2">Explore the Garden</div>
            <div className="text-gray-500 text-sm">to start nurturing one</div>
          </motion.div>
        ) : (
          /* Tended Ecosystems List */
          <div className="space-y-4 mb-24">
            {tendedEcosystems.map((snapshot, index) => (
              <TendedEcosystem
                key={snapshot.id}
                date={new Date(snapshot.timestamp * 1000).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                seedEmblemUrl={assets.glowers}
                beneficiaryName={`Beneficiary #${snapshot.beneficiaryIndex}`}
                seedImageUrl={snapshot.imageUrl || ''}
                userContribution={`${snapshot.valueEth} ETH`}
                ecosystemCompost="0.00 ETH"
                onReadMore={() => handleReadMore(snapshot.beneficiaryIndex)}
                onTendAgain={() => handleTendAgain(snapshot.id)}
                onShare={handleShare}
                index={index}
                beneficiarySlug={`beneficiary-${snapshot.beneficiaryIndex}`}
                seedId={snapshot.seedId.toString()}
                seedSlug={`seed-${snapshot.seedId}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fixed Root Shape Area */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="max-w-md mx-auto w-full px-4">
          <RootShapeArea
            onWallet={() => setIsWalletModalOpen(true)}
            showGlassEffect={false}
            showStoryButton={false}
          />
        </div>
      </div>

      {/* Wallet Modal */}
      <div className="">
        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={handleWalletModalClose}
          onLogout={handleLogout}
          onAddFunds={handleAddFunds}
          onExportKey={handleExportKey}
          onSwitchWallet={handleSwitchWallet}
          onPrivyHome={handlePrivyHome}
        />
      </div>
    </div>
  );
}
