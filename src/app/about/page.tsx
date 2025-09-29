"use client"

import { useRouter } from "next/navigation";
import EcosystemProjectCard from "@/components/EcosystemProjectCard";
import GardenHeader from "@/components/GardenHeader";
import { getEcosystemProject } from "@/lib/data/componentData";

export default function About() {
  const router = useRouter();
  
  // Use seed 1 data for the about page
  const ecosystem = getEcosystemProject("1");

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-white">
      <GardenHeader />
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


