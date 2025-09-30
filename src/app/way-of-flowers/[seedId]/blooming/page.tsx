"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import BloomingView from "@/components/BloomingView";
import { getEcosystemProject, getWayOfFlowersData } from "@/lib/data/componentData";

export default function BloomingPage({ params }: { params: Promise<{ seedId: string }> }) {
  const router = useRouter();
  const { seedId } = React.use(params);
  const eco = getEcosystemProject(seedId);
  const wof = getWayOfFlowersData(seedId);

  return (
    <BloomingView
      backgroundImageUrl={eco.backgroundImageUrl}
      beneficiary={eco.title.replace(/\s+Regenerative.*$/, "")}
      seedEmblemUrl={eco.seedEmblemUrl}
      storyText={wof.mainQuote}
      onExploreGarden={() => router.push("/garden")}
      onStory={() => router.push(`/way-of-flowers/${seedId}/blooming/story`)}
      onShare={() => {}}
      onWallet={() => router.push(`/wallet`)}
    />
  );
}


