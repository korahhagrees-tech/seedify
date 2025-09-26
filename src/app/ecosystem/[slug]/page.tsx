"use client"

import { useRouter } from "next/navigation";
import EcosystemProjectCard from "@/components/EcosystemProjectCard";
import { assets } from "@/lib/assets";

// Mock ecosystem data - this should be replaced with actual data fetching
const ecosystemData: Record<string, {
  title: string;
  subtitle: string;
  shortText: string;
  extendedText: string;
  backgroundImageUrl: string;
  seedEmblemUrl: string;
}> = {
  "el-globo-habitat-bank": {
    title: "El Globo Habitat Bank",
    subtitle: "Conservation Area, California 150ha",
    shortText: "A comprehensive habitat restoration project focusing on native species recovery and ecosystem resilience. This initiative combines traditional conservation methods with modern ecological science to restore degraded landscapes and support biodiversity.",
    extendedText: `The El Globo Habitat Bank represents a pioneering approach to landscape-scale conservation, integrating multiple ecosystem restoration techniques across diverse terrain. Since its establishment, the project has successfully restored over 150 hectares of degraded habitat, creating vital corridors for wildlife migration and supporting over 200 native plant species.

The restoration methodology employs a multi-phase approach, beginning with soil remediation and native seed bank activation, followed by strategic planting of keystone species and ongoing monitoring of ecosystem health indicators. This comprehensive strategy has resulted in measurable improvements in biodiversity indices, water quality, and carbon sequestration rates.

The project serves as a model for scalable conservation practices, demonstrating how targeted interventions can catalyze natural ecosystem recovery processes while providing measurable environmental and social benefits.`,
    backgroundImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
    seedEmblemUrl: assets.globe
  },
  "grgich-hills-estate": {
    title: "Grgich Hills Estate Regenerative Sheep Grazing",
    subtitle: "Rutherford AVA, Napa Valley 126ha",
    shortText: "Across Napa's vineyard terraces, a carefully orchestrated migration unfolds each season as sheep move through precise rotational patterns, their grazing transforming soil chemistry with each methodical step. This ancient practice, refined through contemporary ecological science, quietly rebuilds the underground architecture that sustains both wine and wildland.Key Benefits: Enhanced nutrient cycling, reduced external inputs, wildfire mitigation, soil carbon storage",
    extendedText: `The project represents a sophisticated evolution in sustainable viticulture, where high-density rotational grazing serves as both ecological restoration tool and climate adaptation strategy. Since 2021, this pioneering collaboration has integrated Kaos Sheep Outfit's skilled shepherding expertise with Grgich Hills' decades of organic farming leadership, creating a comprehensive approach to soil health enhancement.

The methodology employs targeted grazing patterns designed to optimize nutrient cycling while reducing external agri-cultural inputs, effectively transforming vineyard understory management into active carbon storage. This approach generates measurable improvements in soil organic matter, water retention capacity, and biodiversity support while providing critical wildfire fuel reduction across the vulnerable Rutherford AVA landscape.

The project establishes protocols for vineyard-integrated grazing that demonstrate how traditional pastoral practices can be precisely calibrated using contemporary monitoring technologies to achieve quantifiable ecosystem restoration outcomes within premium wine production systems.`,
    backgroundImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
    seedEmblemUrl: assets.globe
  },
  "buena-vista-heights": {
    title: "Buena Vista Heights Restoration",
    subtitle: "Mountain Range, California 200ha",
    shortText: "A high-altitude ecosystem restoration project focused on montane forest recovery and watershed protection. This initiative addresses the critical need for climate-resilient forest management in California's mountain regions.",
    extendedText: `The Buena Vista Heights Restoration project represents a comprehensive approach to montane ecosystem recovery, addressing the complex challenges of climate change adaptation and forest health restoration. The project encompasses 200 hectares of mixed conifer forest, focusing on species diversity, fire resilience, and watershed protection.

The restoration strategy employs a combination of selective thinning, prescribed burning, and native species reintroduction to restore natural forest dynamics. This approach has resulted in improved forest health indicators, increased biodiversity, and enhanced ecosystem services including water filtration and carbon storage.

The project serves as a demonstration site for climate-adaptive forest management practices, providing valuable data and methodologies for similar restoration efforts across the region.`,
    backgroundImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed2/seed.png",
    seedEmblemUrl: assets.globe
  },
  "walkers-reserve": {
    title: "Walkers Reserve Wetland Restoration",
    subtitle: "Wetland Complex, California 75ha",
    shortText: "A comprehensive wetland restoration project that combines traditional ecological knowledge with modern conservation science to restore critical habitat for migratory birds and aquatic species.",
    extendedText: `The Walkers Reserve Wetland Restoration project focuses on the recovery of degraded wetland ecosystems through strategic water management, native vegetation restoration, and habitat enhancement. The project encompasses 75 hectares of diverse wetland habitats, including seasonal marshes, permanent ponds, and riparian corridors.

The restoration methodology emphasizes natural hydrologic processes, working with seasonal water patterns to create optimal conditions for native wetland species. This approach has resulted in significant improvements in water quality, increased habitat diversity, and the return of several threatened and endangered species.

The project demonstrates the critical importance of wetland ecosystems for biodiversity conservation, climate regulation, and water resource management, serving as a model for similar restoration efforts throughout the region.`,
    backgroundImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed2/seed.png",
    seedEmblemUrl: assets.globe
  }
};

export default function Ecosystem({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const ecosystem = ecosystemData[params.slug];

  const handleClose = () => {
    router.push("/");
  };

  if (!ecosystem) {
    return (
      <div className="min-h-screen w-full max-w-md mx-auto bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Ecosystem Not Found</h1>
          <p className="text-gray-600 mb-6">The requested ecosystem could not be found.</p>
          <button 
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

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
