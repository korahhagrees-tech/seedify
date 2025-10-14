"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import WayOfFlowersCard from "@/components/WayOfFlowersCard";
import PaymentModal from "@/components/PaymentModal";
import { getWayOfFlowersData } from "@/lib/data/componentData";
import { fetchSeedById, beneficiaryToEcosystemProject } from "@/lib/api";

export default function WayOfFlowers({
  params,
}: {
  params: Promise<{ seedId: string }>;
}) {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [ecosystemBackgroundUrl, setEcosystemBackgroundUrl] =
    useState<string>("");

  // Unwrap params using React.use()
  const { seedId } = use(params);

  const wayOfFlowersData = getWayOfFlowersData(seedId);

  // Fetch ecosystem background image
  useEffect(() => {
    async function loadEcosystemBackground() {
      try {
        // Fetch the seed by ID to get beneficiaries
        const seed = await fetchSeedById(seedId);

        if (seed && seed.beneficiaries && seed.beneficiaries.length > 0) {
          // Use the first beneficiary's background image
          const firstBeneficiary = seed.beneficiaries[0];
          const ecosystem = beneficiaryToEcosystemProject(
            firstBeneficiary,
            seed
          );

          if (ecosystem.backgroundImageUrl) {
            setEcosystemBackgroundUrl(ecosystem.backgroundImageUrl);
          }
        }
      } catch (err) {
        console.error("Error loading ecosystem background:", err);
        // Fallback to original background if ecosystem fails
        setEcosystemBackgroundUrl(wayOfFlowersData.backgroundImageUrl);
      }
    }

    loadEcosystemBackground();
  }, [seedId, wayOfFlowersData.backgroundImageUrl]);

  const handleExploreClick = () => {
    router.push(`/way-of-flowers/${seedId}/blooming`);
  };

  const handleTryAgainClick = () => {
    setShowPaymentModal(true);
  };

  // Use ecosystem background if available, otherwise fallback to original
  const backgroundImageUrl =
    ecosystemBackgroundUrl || wayOfFlowersData.backgroundImageUrl;

  return (
    <div className="min-h-screen w-full">
      <WayOfFlowersCard
        backgroundImageUrl={backgroundImageUrl}
        seedEmblemUrl={wayOfFlowersData.seedEmblemUrl}
        firstText={wayOfFlowersData.firstText}
        secondText={wayOfFlowersData.secondText}
        thirdText={wayOfFlowersData.thirdText}
        mainQuote={wayOfFlowersData.mainQuote}
        author={wayOfFlowersData.author}
        onExploreClick={handleExploreClick}
        onTryAgainClick={handleTryAgainClick}
      />

      {/* Payment Modal for Try Again */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        seedId={seedId}
        amount={50}
      />
    </div>
  );
}
