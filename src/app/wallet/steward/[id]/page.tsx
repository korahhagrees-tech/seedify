/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SeedStewardStats from "@/components/SeedStewardStats";
import AmplifySeedModal from "@/components/wallet/AmplifySeedModal";
import HarvestSeedModal from "@/components/wallet/HarvestSeedModal";
import { Seed } from "@/types/seed";
import { fetchSeedById } from "@/lib/api/seeds";

export default function StewardStatsRoute() {
  const params = useParams();
  const router = useRouter();
  const [seed, setSeed] = useState<Seed | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [hasFetched, setHasFetched] = useState(false);
  // Render immediately without a loading state
  const [isAmplifyModalOpen, setIsAmplifyModalOpen] = useState(false);
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const id = Array.isArray(params.id)
        ? params.id[0]
        : (params.id as string);
      if (!id) return;

      try {
        // Fetch seed data
        const s = await fetchSeedById(id);
        setSeed(s || null);

        // Fetch stats data
        const statsResponse = await fetch(
          `https://seedify-backend.up.railway.app/api/seeds/${id}/stats`
        );
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.success ? statsData.stats : null);
        } else {
          console.error("Failed to fetch stats:", statsResponse.statusText);
          setStats(null);
        }

        setHasFetched(true);
      } catch (error) {
        console.error("Error loading data:", error);
        setHasFetched(true);
      } finally {
        // no-op
      }
    }
    load();
  }, [params.id]);

  // Modal handlers
  const handleAmplifyClick = () => {
    console.log("🌱 Amplify button clicked from page level");
    setIsAmplifyModalOpen(true);
  };

  const handleHarvestClick = () => {
    console.log("🌾 Harvest button clicked from page level");
    setIsHarvestModalOpen(true);
  };

  // Helper functions for modal data formatting
  const formatPercentage = (value: string) => {
    const num = parseFloat(value);
    return `${num.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto">
      {seed && stats && (
        <SeedStewardStats
          seed={seed}
          links={{ openseaUrl: stats.openSeaUrl }}
          onAmplifyClick={handleAmplifyClick}
          onHarvestClick={handleHarvestClick}
          stats={stats}
        />
      )}

      {/* Amplify Seed Modal */}
      {stats && (
        <AmplifySeedModal
          isOpen={isAmplifyModalOpen}
          onCloseAction={() => setIsAmplifyModalOpen(false)}
          seedId={stats.seedId.toString()}
          stats={{
            totalValue: `${parseFloat(stats.nutrientReserveTotal).toFixed(
              3
            )} ETH`,
            fundsCommitted: `${parseFloat(stats.highestSeedDeposit).toFixed(
              3
            )} ETH`,
            snapRewards: `${parseFloat(stats.absoluteNutrientYield).toFixed(
              3
            )} ETH`,
            numSnaps: stats.totalSnapshots.toString(),
            totalFundings: `${parseFloat(stats.nutrientReserveTotal).toFixed(
              3
            )} ETH`,
            yearlyFunding: `${parseFloat(stats.immediateImpact).toFixed(
              3
            )} ETH`,
            allSeedsTotal: `${parseFloat(stats.nutrientReserveTotal).toFixed(
              3
            )} ETH`,
            snapsPercentage: formatPercentage(stats.snapshotShare),
            currentClaimable: `${parseFloat(stats.harvestable).toFixed(3)} ETH`,
            maturationDate: formatDate(stats.maturationDate),
            prematurePenalty: `${parseFloat(
              stats.earlyHarvestFee.amount
            ).toFixed(3)} ETH`,
          }}
        />
      )}

      {/* Harvest Seed Modal */}
      {stats && (
        <HarvestSeedModal
          isOpen={isHarvestModalOpen}
          onClose={() => setIsHarvestModalOpen(false)}
          seedId={stats.seedId.toString()}
          stats={{
            nutrientReserve: `${parseFloat(stats.nutrientReserveTotal).toFixed(
              3
            )} ETH`,
            mintingDate: formatDate(stats.mintedOn),
            totalCommitted: `${parseFloat(stats.highestSeedDeposit).toFixed(
              3
            )} ETH`,
            currentClaimable: `${parseFloat(stats.harvestable).toFixed(3)} ETH`,
            maturationDate: formatDate(stats.maturationDate),
            prematurePenalty: `${parseFloat(
              stats.earlyHarvestFee.amount
            ).toFixed(3)} ETH`,
          }}
        />
      )}
    </div>
  );
}
