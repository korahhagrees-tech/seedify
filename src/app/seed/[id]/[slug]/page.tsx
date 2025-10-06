"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SeedDetailPage from "@/components/seeds/SeedDetailPage";
import SeedStewardStats from "@/components/SeedStewardStats";
import { Seed } from "@/types/seed";
import { fetchSeedById } from "@/lib/api/seeds";
import Image from "next/image";
import { assets } from "@/lib/assets";

export default function SeedDetailsRoute() {
  const params = useParams();
  const router = useRouter();
  const [seed, setSeed] = useState<Seed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);
      if (!id) return;
      const s = await fetchSeedById(id);
      setSeed(s || null);
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mx-auto mb-4">
              <Image
                src="/assets/WOF_Logo-black.png"
                alt="Loading"
                width={100}
                height={100}
                className="w-full h-full max-w-[420px] scale-[1.2]"
                />
              </div>
            <p className="text-gray-600">Loading seed...</p>
          </div>
      </div>
    );
  }

  if (!seed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Seed not found.</p>
        <button onClick={() => router.push("/garden")} className="underline">Back to Garden</button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* New Steward Explore/Stats view. Replace/augment old detail page as needed. */}
      <SeedStewardStats
        seed={seed}
        links={{ openseaUrl: "https://opensea.io/" }}
        metrics={{
          core: [
            { label: "SEED NUMBER", value: seed.label },
            { label: "SNAPSHOTS", value: String(seed.snapshotCount), sublabel: `SNAPSHOT PRICE ${seed.snapshotPrice} ETH` },
            { label: "SNAPSHOT SHARE", value: "12,5%", sublabel: "20% SHARE VALUE 2.023 ETH" },
            { label: "MINTED ON", value: "04/09/2025" },
            { label: "NUTRIENT RESERVE TOTAL", value: "1.826 ETH" },
            { label: "YOUR CONTRIBUTIONS", value: seed.depositAmount + " ETH" },
            { label: "ABSOLUTE NUTRIENT YIELD", value: "0.176 ETH" },
            { label: "HARVESTABLE", value: "0.126 ETH", sublabel: "MATURATION DATE 02/09/2029" },
          ],
          regenerativeImpact: {
            immediateImpactEth: "0.270",
            immediateDistributedDate: "04/06/2027",
            longtermImpactEth: "0.070",
            longtermDistributedDate: "01/01/2027",
            overallAccumulatedEth: "0.399",
          },
          beneficiaries: (seed.beneficiaries || []).map((b: any, i: number) => ({
            id: b.id || String(i),
            name: b.name || "Beneficiary",
            emblemUrl: b.image || assets.glowers,
            benefitShare: b.benefitShare || "12.45%",
            snapshots: b.snapshots || 127,
            gainEth: b.gainEth || "0.112",
            gardenEth: b.gardenEth || "1.911",
            yieldShareEth: b.yieldShareEth || "0.211",
            unclaimedEth: b.unclaimedEth || "0.162",
            claimedEth: b.claimedEth || "0.222",
          })),
        }}
      />
    </div>
  );
}


