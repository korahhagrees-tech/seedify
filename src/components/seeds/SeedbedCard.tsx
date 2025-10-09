"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { assets } from "@/lib/assets";
import { Beneficiary, shortenBeneficiaryName } from "@/lib/utils";
import { defaultBeneficiaries } from "@/lib/api/seeds";
import CurvedText from "@/components/ui/CurvedText";
import { getEcosystemUrlFromParams } from "@/lib/utils/ecosystemUrl";

interface SeedbedCardProps {
  className?: string;
  beneficiaries?: Beneficiary[];
}

export default function SeedbedCard({ className = "", beneficiaries = defaultBeneficiaries }: SeedbedCardProps) {
  const params = useParams();
  
  // Build ecosystem URL with seed context using shared utility
  const getEcosystemUrl = (beneficiarySlug: string) => {
    return getEcosystemUrlFromParams(params, beneficiarySlug);
  };

  // Sort beneficiaries by percentage (highest first) and map to static images
  const sortedBeneficiaries = [...beneficiaries]
    .sort((a, b) => parseFloat(b.percentage || "0") - parseFloat(a.percentage || "0"))
    .map((beneficiary, index) => {
      // Map to static images based on size (largest to smallest)
      const staticImages = [assets.elGlobo, assets.grgichHills, assets.buenaVista, assets.walkersReserve];
      const staticPositions = [
        // El Globo (largest)
        {
          position: {
            top: "-top-10",
            left: "left-10 lg:left-8",
            width: "w-[150px]",
            height: "h-[150px]",
            transform: "transform -rotate-4"
          },
          labelPosition: {
            top: "-left-18",
            left: "-top-10",
            transform: "transform -rotate-90"
          }
        },
        // Grgich Hills (second largest)
        {
          position: {
            top: "lg:bottom-27 bottom-28",
            left: "lg:-right-3 -right-1",
            width: "w-32",
            height: "h-32",
            transform: "transform rotate-6"
          },
          labelPosition: {
            top: "right-18",
            left: "top-1/2",
            transform: "transform -rotate-90"
          }
        },
        // Buena Vista (third largest)
        {
          position: {
            top: "lg:bottom-24 bottom-24",
            left: "-left-2 lg:-left-3",
            width: "w-26",
            height: "h-26",
            transform: "transform -rotate-6"
          },
          labelPosition: {
            top: "left-16",
            left: "bottom-42",
            transform: "transform rotate-66"
          }
        },
        // Walkers Reserve (smallest)
        {
          position: {
            top: "top-6",
            left: "right-6 lg:right-6",
            width: "w-12",
            height: "h-12",
            transform: "transform rotate-12"
          },
          labelPosition: {
            top: "-right-10",
            left: "-top-4",
            transform: "transform rotate-45"
          }
        }
      ];

      return {
        ...beneficiary,
        image: staticImages[index] || staticImages[0],
        position: staticPositions[index]?.position || staticPositions[0].position,
        labelPosition: staticPositions[index]?.labelPosition || staticPositions[0].labelPosition
      };
    });
  
  return (
    <div className={`relative scale-[1.05] ${className}`}>
      {/* Outer gray layer */}
      <div className="bg-[#D9D9D9] rounded-3xl p-3">
        {/* Inner white layer */}
        <div className="bg-white rounded-3xl p-6 relative">
          {/* Title */}
          <div className="text-center text-black font-medium text-lg -mt-4 mb-26">
            THE SEEDBED
          </div>
          
          {/* Main subtract shape container */}
          <div className="relative w-full h-96">
            {/* Subtract.svg as the main outline */}
            <div className="absolute inset-0 scale-[1.1] -mb-5">
              <Image
                // src={assets.subtracts}
                src={assets.subtract}
                alt="Seedbed network"
                fill
                className="object-contain -mt-7"
                priority
              />
            </div>
            
            {/* Location SVG shapes positioned inside the subtract shape */}
            <div className="absolute inset-0 z-10">
              {sortedBeneficiaries.map((beneficiary) => (
                <Link
                  key={beneficiary.id}
                  href={getEcosystemUrl(beneficiary.slug)}
                  className={`absolute ${beneficiary.position.top} ${beneficiary.position.left} ${beneficiary.position.width} ${beneficiary.position.height} ${beneficiary.position.transform} hover:scale-[1.1] transition-all duration-300 cursor-pointer`}
                >
                  <Image
                    src={beneficiary.image}
                    alt={beneficiary.name}
                    fill
                    className="object-contain"
                  />
                </Link>
              ))}
            </div>
            
            {/* Text labels positioned around the shape with curved text effect */}
            <div className="absolute inset-0 z-0">
              {sortedBeneficiaries.map((beneficiary, index) => {
                const shortName = shortenBeneficiaryName(beneficiary.name);
                
                // Custom positioning parameters for each beneficiary
                const textConfigs = [
                  // El Globo (largest) - move text more to the right
                  {
                    radius: 70,
                    angle: Math.PI * 0.8,
                    fontSize: 14,
                    width: 140,
                    height: 180,
                    offsetX: 45, // Move right
                    offsetY: 62,
                    rotationOffset: 0.1 // Slight rotation adjustment
                  },
                  // Grgich Hills (second largest) - move text more to the right
                  {
                    radius: 65,
                    angle: Math.PI * 0.65,
                    fontSize: 14,
                    width: 130,
                    height: 150,
                    offsetX: 30, // Move right
                    offsetY: -120,
                    rotationOffset: 2.95
                  },
                  // Buena Vista (third largest) - move text left
                  {
                    radius: 55,
                    angle: Math.PI * 0.95,
                    fontSize: 12,
                    width: 140,
                    height: 170,
                    offsetX: 120, // Move left
                    offsetY: -58,
                    rotationOffset: 3.45
                  },
                  // Walkers Reserve (smallest) - move text slightly left
                  {
                    radius: 45,
                    angle: Math.PI * 0.95,
                    fontSize: 7,
                    width: 140,
                    height: 140,
                    offsetX: -15, // Move left
                    offsetY: 14,
                    rotationOffset: -0.1
                  }
                ];
                
                const config = textConfigs[index] || textConfigs[0];
                
                return (
                <div
                  key={`${beneficiary.id}-label`}
                    className={`absolute ${beneficiary.labelPosition.top} ${beneficiary.labelPosition.left} ${beneficiary.labelPosition.transform} pointer-events-none`}
                    style={{
                      transform: `translate(${config.offsetX}px, ${config.offsetY}px) ${beneficiary.labelPosition.transform.includes('translate') ? beneficiary.labelPosition.transform.replace('transform', '').trim() : ''}`
                    }}
                  >
                    <CurvedText
                      text={shortName}
                      radius={config.radius}
                      angle={config.angle}
                      fontSize={config.fontSize}
                      color="#000000"
                      width={config.width}
                      height={config.height}
                      rotationOffset={config.rotationOffset}
                    />
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SeedbedCard2({ className = "", beneficiaries = defaultBeneficiaries }: SeedbedCardProps) {
  const params = useParams();
  
  // Build ecosystem URL with seed context using shared utility
  const getEcosystemUrl = (beneficiarySlug: string) => {
    return getEcosystemUrlFromParams(params, beneficiarySlug);
  };

  // Sort beneficiaries by percentage (highest first) and map to static images
  const sortedBeneficiaries = [...beneficiaries]
    .sort((a, b) => parseFloat(b.percentage || "0") - parseFloat(a.percentage || "0"))
    .map((beneficiary, index) => {
      // Map to static images based on size (largest to smallest)
      const staticImages = [assets.elGlobo, assets.grgichHills, assets.buenaVista, assets.walkersReserve];
      const staticPositions = [
        // El Globo (largest)
        {
          position: {
            top: "-top-14",
            left: "left-6 lg:left-8",
            width: "w-[155px]",
            height: "h-[155px]",
            transform: "transform -rotate-4"
          },
          labelPosition: {
            top: "-left-18",
            left: "-top-10",
            transform: "transform -rotate-90"
          }
        },
        // Grgich Hills (second largest)
        {
          position: {
            top: "lg:bottom-27 bottom-28",
            left: "lg:-right-3 -right-6",
            width: "w-34",
            height: "h-34",
            transform: "transform rotate-6"
          },
          labelPosition: {
            top: "right-18",
            left: "top-1/2",
            transform: "transform -rotate-90"
          }
        },
        // Buena Vista (third largest)
        {
          position: {
            top: "lg:bottom-24 bottom-24",
            left: "-left-5 lg:-left-3",
            width: "w-28",
            height: "h-28",
            transform: "transform -rotate-6"
          },
          labelPosition: {
            top: "left-16",
            left: "bottom-42",
            transform: "transform rotate-66"
          }
        },
        // Walkers Reserve (smallest)
        {
          position: {
            top: "top-1",
            left: "right-2 lg:right-6",
            width: "w-14",
            height: "h-14",
            transform: "transform rotate-12"
          },
          labelPosition: {
            top: "-right-10",
            left: "-top-4",
            transform: "transform rotate-45"
          }
        }
      ];

      return {
        ...beneficiary,
        image: staticImages[index] || staticImages[0],
        position: staticPositions[index]?.position || staticPositions[0].position,
        labelPosition: staticPositions[index]?.labelPosition || staticPositions[0].labelPosition
      };
    });
  
  return (
    <div className={`relative ${className}`}>
      {/* Outer gray layer */}
      <div className="bg-[#D9D9D9] rounded-3xl p-3">
        {/* Arrow circle on border */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-1 border-black flex items-center justify-center">
          <Image
            src={assets.arrowUp}
            alt="Pull up"
            width={20}
            height={20}
            className="w-6 h-6"
          />
        </div>
        
        {/* Pull up text */}
        <div className="text-center text-sm text-black/70 mt-6 mb-4">
          Pull up to explore the seedbed
        </div>
        
        {/* Inner white layer */}
        <div className="bg-white rounded-3xl p-6 relative">
          {/* Title */}
          <div className="text-center text-black font-medium text-lg -mt-4 mb-36">
            THE SEEDBED
          </div>
          
          {/* Main subtract shape container */}
          <div className="relative w-full h-96">
            {/* Subtract.svg as the main outline */}
            <div className="absolute inset-0 scale-[1.33]">
              <Image
                src={assets.subtract}
                // src={assets.subtracts}
                alt="Seedbed network"
                fill
                className="object-contain -mt-7"
                priority
              />
            </div>
            
            {/* Location SVG shapes positioned inside the subtract shape */}
            <div className="absolute inset-0 z-10">
              {sortedBeneficiaries.map((beneficiary) => (
                <Link
                  key={beneficiary.id}
                  href={getEcosystemUrl(beneficiary.slug)}
                  className={`absolute ${beneficiary.position.top} ${beneficiary.position.left} ${beneficiary.position.width} ${beneficiary.position.height} ${beneficiary.position.transform} hover:scale-[1.1] transition-all duration-300 cursor-pointer`}
                >
                  <Image
                    src={beneficiary.image}
                    alt={beneficiary.name}
                    fill
                    className="object-contain"
                  />
                </Link>
              ))}
            </div>
            
            {/* Text labels positioned around the shape with curved text effect */}
            <div className="absolute inset-0 z-0">
              {sortedBeneficiaries.map((beneficiary, index) => {
                const shortName = shortenBeneficiaryName(beneficiary.name);
                
                // Custom positioning parameters for each beneficiary (simpler version for SeedbedCard2)
                const textConfigs = [
                  // El Globo (largest)
                  {
                    radius: 60,
                    angle: Math.PI * 0.4,
                    fontSize: 10,
                    width: 120,
                    height: 120,
                    offsetX: 0,
                    offsetY: 0,
                    rotationOffset: 0
                  },
                  // Grgich Hills (second largest)
                  {
                    radius: 55,
                    angle: Math.PI * 0.35,
                    fontSize: 9,
                    width: 110,
                    height: 110,
                    offsetX: 0,
                    offsetY: 0,
                    rotationOffset: 0
                  },
                  // Buena Vista (third largest)
                  {
                    radius: 50,
                    angle: Math.PI * 0.3,
                    fontSize: 8,
                    width: 100,
                    height: 100,
                    offsetX: 0,
                    offsetY: 0,
                    rotationOffset: 0
                  },
                  // Walkers Reserve (smallest)
                  {
                    radius: 40,
                    angle: Math.PI * 0.25,
                    fontSize: 7,
                    width: 80,
                    height: 80,
                    offsetX: 0,
                    offsetY: 0,
                    rotationOffset: 0
                  }
                ];
                
                const config = textConfigs[index] || textConfigs[0];
                
                return (
                <div
                  key={`${beneficiary.id}-label`}
                    className={`absolute ${beneficiary.labelPosition.top} ${beneficiary.labelPosition.left} ${beneficiary.labelPosition.transform} pointer-events-none`}
                    style={{
                      transform: `translate(${config.offsetX}px, ${config.offsetY}px) ${beneficiary.labelPosition.transform.includes('translate') ? beneficiary.labelPosition.transform.replace('transform', '').trim() : ''}`
                    }}
                  >
                    <CurvedText
                      text={shortName}
                      radius={config.radius}
                      angle={config.angle}
                      fontSize={config.fontSize}
                      color="#000000"
                      width={config.width}
                      height={config.height}
                      rotationOffset={config.rotationOffset}
                    />
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}