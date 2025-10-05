"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import WayOfFlowersCard from "@/components/WayOfFlowersCard";
import PaymentModal from "@/components/PaymentModal";
import { getWayOfFlowersData } from "@/lib/data/componentData";

export default function WayOfFlowers({ params }: { params: { seedId: string } }) {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const wayOfFlowersData = getWayOfFlowersData(params.seedId);

  const handleExploreClick = () => {
    router.push(`/way-of-flowers/${params.seedId}/blooming`);
  };

  const handleTryAgainClick = () => {
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen w-full">
      <WayOfFlowersCard 
        backgroundImageUrl={wayOfFlowersData.backgroundImageUrl}
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
        seedId={params.seedId}
        amount={50}
      />
    </div>
  );
}
