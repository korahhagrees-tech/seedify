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
import { fetchSeedById, beneficiaryToEcosystemProject } from "@/lib/api";

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
  const [ecosystemSeedEmblemUrl, setEcosystemSeedEmblemUrl] = useState<string>("");

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

  // Fetch ecosystem seed emblem using beneficiary code
  useEffect(() => {
    async function loadEcosystemSeedEmblem() {
      try {
        // Fetch the seed by ID to get beneficiaries
        const seed = await fetchSeedById(seedId);

        if (seed && seed.beneficiaries && seed.beneficiaries.length > 0) {
          // Use the first beneficiary's seed emblem
          const firstBeneficiary = seed.beneficiaries[0];
          const ecosystem = beneficiaryToEcosystemProject(
            firstBeneficiary,
            seed
          );

          if (ecosystem.seedEmblemUrl) {
            // console.log('[BloomingPage] Setting ecosystem seed emblem:', ecosystem.seedEmblemUrl);
            setEcosystemSeedEmblemUrl(ecosystem.seedEmblemUrl);
          }
        }
      } catch (err) {
        console.error("Error loading ecosystem seed emblem:", err);
        // Fallback to original seed emblem if ecosystem fails
        setEcosystemSeedEmblemUrl(eco.seedEmblemUrl);
      }
    }

    loadEcosystemSeedEmblem();
  }, [seedId, eco.seedEmblemUrl]);

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

  // Use ecosystem seed emblem if available, otherwise fallback to original
  const seedEmblemUrl = ecosystemSeedEmblemUrl || eco.seedEmblemUrl;

  return (
    <>
      <BloomingView
        backgroundImageUrl={backgroundImageUrl}
        beneficiary={beneficiaryName}
        seedEmblemUrl={seedEmblemUrl}
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
