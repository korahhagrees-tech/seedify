"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { assets } from "@/lib/assets";
import RootShapeArea from "@/components/wallet/RootShapeArea";
import TendedEcosystem from "@/components/wallet/TendedEcosystem";
import WalletModal from "@/components/wallet/WalletModal";
import { useAuth } from "@/components/auth/AuthProvider";
import GardenHeader from "@/components/GardenHeader";

// Mock data for tended ecosystems
const mockTendedEcosystems = [
  {
    id: "1",
    date: "07/09/2025",
    seedEmblemUrl: assets.glowers,
    beneficiaryName: "Grgich Hills Estate Regenerative Sheep Grazing",
    seedImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
    userContribution: "0.011 ETH",
    ecosystemCompost: "1.03 ETH"
  },
  {
    id: "2", 
    date: "05/09/2025",
    seedEmblemUrl: assets.glowers,
    beneficiaryName: "Urban Garden Network Community Initiative",
    seedImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed2/seed.png",
    userContribution: "0.025 ETH",
    ecosystemCompost: "3.44 ETH"
  }
];

export default function WalletPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [tendedEcosystems] = useState(mockTendedEcosystems);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <GardenHeader />

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
                onShare={handleShare}
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
    </div>
  );
}
