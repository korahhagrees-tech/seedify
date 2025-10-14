/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EcosystemProjectCard from "@/components/EcosystemProjectCard";
import { fetchSeedById, beneficiaryToEcosystemProject } from "@/lib/api";

export default function Ecosystem({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [ecosystemData, setEcosystemData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    async function loadEcosystemData() {
      try {
        setError(null);

        // Try fetching seeds 1 and 2 to find beneficiaries
        // Most seeds will have the same beneficiaries, so we check both
        let seedWithBeneficiaries = null;
        let beneficiary = null;

        for (const seedId of ["1", "2"]) {
          try {
            const seed = await fetchSeedById(seedId);

            if (seed?.beneficiaries && seed.beneficiaries.length > 0) {
              // Try to find matching beneficiary by slug
              const matchingBen = seed.beneficiaries.find(
                (ben: any) => ben.slug === params.slug
              );

              if (matchingBen) {
                beneficiary = matchingBen;
                seedWithBeneficiaries = seed; // Store the seed data for seedEmblemUrl
                break;
              }
            }
          } catch (err) {
            console.log(`Seed ${seedId} not found, trying next...`);
          }
        }

        if (!beneficiary) {
          throw new Error(`Beneficiary with slug "${params.slug}" not found`);
        }

        // Convert beneficiary data to ecosystem project format, passing seed data for seedEmblemUrl
        const ecosystem = beneficiaryToEcosystemProject(
          beneficiary,
          seedWithBeneficiaries
        );
        setEcosystemData(ecosystem);
      } catch (err) {
        console.error("Error loading ecosystem data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load ecosystem data"
        );
      } finally {
        setHasFetched(true);
      }
    }

    loadEcosystemData();
  }, [params.slug]);

  if (hasFetched && (error || !ecosystemData)) {
    return (
      <div className="min-h-screen w-full max-w-md mx-auto bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            {error || "Ecosystem not found"}
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!ecosystemData) {
    return null; // Still fetching, show nothing
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-white">
      <EcosystemProjectCard
        backgroundImageUrl={ecosystemData.backgroundImageUrl}
        title={ecosystemData.title}
        subtitle={ecosystemData.subtitle}
        location={ecosystemData.location}
        area={ecosystemData.area}
        shortText={ecosystemData.shortText}
        extendedText={ecosystemData.extendedText}
        seedEmblemUrl={ecosystemData.seedEmblemUrl}
        seedId={ecosystemData.seedId}
      />
    </div>
  );
}
