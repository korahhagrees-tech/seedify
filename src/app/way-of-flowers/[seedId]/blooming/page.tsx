/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BloomingView from "@/components/BloomingView";
import { clearAppStorage } from "@/lib/auth/logoutUtils";
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
  const beneficiaryNameParam = searchParams.get("beneficiaryName");

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
    clearAppStorage();
    await logout();
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  const handleShare = (clickPosition: { x: number; y: number }) => {
    setIsShareModalOpen(true);
  };

  // Resolve beneficiary name (query > localStorage > API by code > ecosystem title fallback)
  const [beneficiaryName, setBeneficiaryName] = useState<string>(beneficiaryNameParam || "");

  useEffect(() => {
    let name = beneficiaryNameParam || '';
    if (!name) {
      try {
        const stored = localStorage.getItem(`webhook_data_${seedId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.beneficiaryName) name = parsed.beneficiaryName;
        }
      } catch { }
    }

    const setFromEco = () => {
      setBeneficiaryName(eco.title.replace(/\s+Regenerative.*$/, ""));
    };

    if (name) {
      setBeneficiaryName(name);
    } else if (beneficiaryCode) {
      fetch('https://seedify-backend.up.railway.app/api/beneficiaries')
        .then(r => r.ok ? r.json() : Promise.reject(new Error(String(r.status))))
        .then(data => {
          const match = Array.isArray(data?.beneficiaries)
            ? data.beneficiaries.find((b: any) => b.code === beneficiaryCode)
            : null;
          if (match?.name) setBeneficiaryName(match.name);
          else setFromEco();
        })
        .catch(() => setFromEco());
    } else {
      setFromEco();
    }
  }, [beneficiaryNameParam, beneficiaryCode, seedId, eco.title]);

  return (
    <>
      <BloomingView
        backgroundImageUrl={backgroundImageUrl}
        beneficiary={beneficiaryName}
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
        beneficiaryName={beneficiaryName}
        beneficiaryCode={beneficiaryCode || undefined}
      />
    </>
  );
}
