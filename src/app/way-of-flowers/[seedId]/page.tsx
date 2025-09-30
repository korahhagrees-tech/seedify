"use client"

import { useRouter } from "next/navigation";
import WayOfFlowersCard from "@/components/WayOfFlowersCard";
import { getWayOfFlowersData } from "@/lib/data/componentData";

export default function WayOfFlowers({ params }: { params: { seedId: string } }) {
  const router = useRouter();
  const wayOfFlowersData = getWayOfFlowersData(params.seedId);

  const handleExploreClick = () => {
    router.push(`/way-of-flowers/${params.seedId}/blooming`);
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
      />
    </div>
  );
}
