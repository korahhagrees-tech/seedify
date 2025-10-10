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
import { fetchUserSeeds } from "@/lib/api";

// Mock data for tended ecosystems
// Each tended ecosystem represents a snapshot mint of a beneficiary from a seed
const mockTendedEcosystems = [
  {
    id: "1",
    date: "07/09/2025",
    seedEmblemUrl: assets.glowers,
    beneficiaryName: "Grgich Hills Estate Regenerative Sheep Grazing",
    seedImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
    userContribution: "0.011 ETH",
    ecosystemCompost: "1.03 ETH",
    seedId: "3", // The seed ID that was tended
    seedSlug: "seed-003", // The seed's label/slug
    beneficiarySlug: "grgich-hills-estate" // The beneficiary slug from that seed
  },
  {
    id: "2", 
    date: "05/09/2025",
    seedEmblemUrl: assets.glowers,
    beneficiaryName: "Urban Garden Network Community Initiative",
    seedImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed2/seed.png",
    userContribution: "0.025 ETH",
    ecosystemCompost: "3.44 ETH",
    seedId: "3", // The seed ID that was tended
    seedSlug: "seed-003", // The seed's label/slug
    beneficiarySlug: "el-globo" // Another beneficiary from the same seed
  }
];

// Mock data for steward seeds (displayed above tended ecosystems when user is a steward)
const mockStewardSeeds = [
  {
    id: "001",
    label: "SEED 001",
    name: "Way Of Flowers Seed 001",
    description: "Mock steward seed",
    seedImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
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
  const [tendedEcosystems] = useState(mockTendedEcosystems);
  const [stewardSeeds, setStewardSeeds] = useState<any[]>(mockStewardSeeds);

  // Backend check using connected wallet; default to steward with mock if none/error
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!walletAddress) return;
      try {
        const { seeds } = await fetchUserSeeds(walletAddress);
        if (!cancelled) {
          setStewardSeeds(seeds && seeds.length > 0 ? seeds : mockStewardSeeds);
        }
      } catch (_e) {
        if (!cancelled) setStewardSeeds(mockStewardSeeds);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

  const handleReadMore = (ecosystemId: string) => {
    // Route to seed detail page
    router.push(`/seed/${ecosystemId}/ecosystem-detail`);
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

  const handleLogout = () => {
    logout();
    setIsWalletModalOpen(false);
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
    console.log("Privy home");
  };

  return (
    <div className="min-h-screen w-screen scale-[0.9] -ml-2 -mt-14 max-w-md mx-auto">
      {/* Header */}
      <div className="ml-4 -px-1 scale-[1.1]">
        <GardenHeader />
      </div>

      {/* Content Area - Tended Ecosystems List */}
      <div className="px-4 pb-32">
        {/* Steward Seeds Section (always show; defaults to mock if backend empty) */}
        {stewardSeeds.length > 0 && (
          <div className="space-y-8 mb-10 scale-[0.95]">
            {stewardSeeds.map((seed, index) => (
              <StewardSeedCard
                key={seed.id}
                seed={seed}
                index={index}
                onTendSeed={() => router.push(`/way-of-flowers/${seed.id}/blooming`)}
                onExplore={() => router.push(`/wallet/steward/${seed.id}`)}
              />
            ))}
          </div>
        )}
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
                onShare={handleShare}
                index={index}
                beneficiarySlug={ecosystem.beneficiarySlug}
                seedId={ecosystem.seedId}
                seedSlug={ecosystem.seedSlug}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fixed Root Shape Area */}
      <div className="fixed -bottom-1 left-0 right-0 z-30 pt-4 scale-[1.1]">
        <div className="max-w-md mx-auto px-4 w-full">
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
