/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BloomingView from "@/components/BloomingView";
import {
  getEcosystemProject,
  getWayOfFlowersData,
} from "@/lib/data/componentData";
import WalletModal from "@/components/wallet/WalletModal";
import ShareModal from "@/components/ShareModal";
import { useAuth } from "@/components/auth/AuthProvider";

export default function BloomingPage({
  params,
}: {
  params: Promise<{ seedId: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { seedId } = React.use(params);
  const eco = getEcosystemProject(seedId);
  const wof = getWayOfFlowersData(seedId);
  const { logout } = useAuth();

  const [isWalletModalOpen, setIsWalletModalOpen] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  // Extract image data from URL params
  const snapshotImageUrl = searchParams.get("snapshotImageUrl");
  const backgroundImageUrlParam = searchParams.get("backgroundImageUrl");
  const beneficiaryCode = searchParams.get("beneficiaryCode");

  // Use URL param background image if available, otherwise use default
  const backgroundImageUrl = backgroundImageUrlParam || eco.backgroundImageUrl;

  const handleWallet = () => {
    setIsWalletModalOpen(true);
  };

  const handleWalletModalClose = () => {
    setIsWalletModalOpen(false);
  };

  const handleLogout = async () => {
    setIsWalletModalOpen(false);
    await logout();
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  const handleShare = (clickPosition: { x: number; y: number }) => {
    setIsShareModalOpen(true);
  };

  return (
    <>
      <BloomingView
        backgroundImageUrl={backgroundImageUrl}
        beneficiary={eco.title.replace(/\s+Regenerative.*$/, "")}
        seedEmblemUrl={eco.seedEmblemUrl}
        snapshotImageUrl={snapshotImageUrl || undefined}
        seedImageUrl={eco.backgroundImageUrl}
        storyText={wof.mainQuote}
        onExploreGarden={() => router.push("/garden")}
        onStory={() => router.push(`/way-of-flowers/${seedId}/blooming/story`)}
        onShare={handleShare}
        onWallet={handleWallet}
      />

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={handleWalletModalClose}
        onLogout={handleLogout}
        onAddFunds={() => { }}
        onExportKey={() => { }}
        onSwitchWallet={() => { }}
        onPrivyHome={() => router.push("https://home.privy.io/login")}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        imageUrl={snapshotImageUrl || eco.backgroundImageUrl || ""}
        beneficiaryName={eco.title.replace(/\s+Regenerative.*$/, "")}
        beneficiaryCode={beneficiaryCode || undefined}
      />
    </>
  );
}
