"use client"

import { useRouter } from "next/navigation";
import EcosystemProjectCard from "@/components/EcosystemProjectCard";
import { getEcosystemProject } from "@/lib/data/componentData";

export default function Ecosystem({ params }: { params: { slug: string } }) {
  const router = useRouter();
  
  // Map slug to seed ID (you can customize this mapping)
  const slugToSeedId: Record<string, string> = {
    "el-globo-habitat-bank": "1",
    "walkers-reserve": "1", 
    "buena-vista-heights": "1",
    "grgich-hills-estate": "1",
    "mountain-forest-reserve": "2",
    "coastal-wetlands": "2",
    "prairie-grasslands": "2",
    "urban-garden-network": "2"
  };

  const seedId = slugToSeedId[params.slug] || "1"; // fallback to seed 1
  const ecosystem = getEcosystemProject(seedId);

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-white">
      <EcosystemProjectCard 
        backgroundImageUrl={ecosystem.backgroundImageUrl}
        title={ecosystem.title} 
        subtitle={ecosystem.subtitle}
        seedEmblemUrl={ecosystem.seedEmblemUrl}
        shortText={ecosystem.shortText} 
        extendedText={ecosystem.extendedText} 
      />
    </div>
  );
}
