"use client"

import InfoModal from "@/components/InfoModal";
import { useRouter } from "next/navigation";
import EcosystemProjectCard from "@/components/EcosystemProjectCard";
import GardenHeader from "@/components/GardenHeader";


const title = "Grgich Hills Estate Regenerative Sheep Grazing";
const subtitle = "Rutherford AVA, Napa Valley 126ha";
const areaText = "Across Napa's vineyard terraces, a carefully orchestrated migration unfolds each season as sheep move through precise rotational patterns, their grazing transforming soil chemistry with each methodical step. This ancient practice, refined through contemporary ecological science, quietly rebuilds the underground architecture that sustains both wine and wildland.";
const shortText = "Key Benefits: Enhanced nutrient cycling, reduced external inputs, wildfire mitigation, soil carbon storage";
const extendedText = `The project represents a sophisticated evolution in sustainable viticulture, where high-density rotational grazing serves as both ecological restoration tool and climate adaptation strategy. Since 2021, this pioneering collaboration has integrated Kaos Sheep Outfit's skilled shepherding expertise with Grgich Hills' decades of organic farming leadership, creating a comprehensive approach to soil health enhancement.

The methodology employs targeted grazing patterns designed to optimize nutrient cycling while reducing external agri-cultural inputs, effectively transforming vineyard understory management into active carbon storage. This approach generates measurable improvements in soil organic matter, water retention capacity, and biodiversity support while providing critical wildfire fuel reduction across the vulnerable Rutherford AVA landscape.

The project establishes protocols for vineyard-integrated grazing that demonstrate how traditional pastoral practices can be precisely calibrated using contemporary monitoring technologies to achieve quantifiable ecosystem restoration outcomes within premium wine production systems.`;


export default function About() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-white">
      <GardenHeader />
      {/* <EcosystemProjectCard 
        backgroundImageUrl={"/public/assets/images/02__ELG.png"} 
        title={title} 
        subtitle={subtitle} 
        areaText={areaText} 
        shortText={shortText} 
        extendedText={extendedText} 
      /> */}
      <div className="scale-[0.85]">
        <InfoModal open={true} onClose={handleClose} />
      </div>
    </div>
  );
}


