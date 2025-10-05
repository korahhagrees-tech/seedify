"use client"

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EcosystemProjectCard from "@/components/EcosystemProjectCard";
import { fetchSeedById, beneficiaryToEcosystemProject } from "@/lib/api";

export default function EcosystemPage() {
  const router = useRouter();
  const params = useParams();
  const [ecosystemData, setEcosystemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const seedId = params?.id as string;
  const beneficiarySlug = params?.beneficiarySlug as string;

  useEffect(() => {
    async function loadEcosystemData() {
      try {
        setLoading(true);
        setError(null);

        console.log('🌱 Loading ecosystem for seed:', seedId, 'beneficiary:', beneficiarySlug);

        // Fetch the seed by ID to get beneficiaries with full project data
        const seed = await fetchSeedById(seedId);

        if (!seed) {
          throw new Error(`Seed ${seedId} not found`);
        }

        if (!seed.beneficiaries || seed.beneficiaries.length === 0) {
          throw new Error("No beneficiaries data found for this seed");
        }

        // Find the matching beneficiary by slug
        const beneficiary = seed.beneficiaries.find(
          (ben: any) => ben.slug === beneficiarySlug
        );

        if (!beneficiary) {
          throw new Error(`Beneficiary "${beneficiarySlug}" not found`);
        }

        console.log('🌱 Found beneficiary:', beneficiary.name);

        // Convert beneficiary data to ecosystem project format, passing seed data for seedEmblemUrl
        const ecosystem = beneficiaryToEcosystemProject(beneficiary, seed);
        setEcosystemData(ecosystem);
      } catch (err) {
        console.error('Error loading ecosystem data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load ecosystem data');
      } finally {
        setLoading(false);
      }
    }

    if (seedId && beneficiarySlug) {
      loadEcosystemData();
    }
  }, [seedId, beneficiarySlug]);

  if (loading) {
    return (
      <div className="min-h-screen w-full max-w-md mx-auto bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600">Loading ecosystem...</div>
        </div>
      </div>
    );
  }

  if (error || !ecosystemData) {
    return (
      <div className="min-h-screen w-full max-w-md mx-auto bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || 'Ecosystem not found'}</div>
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

