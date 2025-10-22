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
            top: "top-6 lg:top-4 md:top-3",
            left: "left-6 lg:left-8 md:left-8",
            width: "w-[132px] lg:w-[128px] md:w-[130px]",
            height: "h-[130px] lg:h-[128px] md:h-[130px]",
            transform: "transform -rotate-4 lg:-rotate-4 md:-rotate-4"
          },
          labelPosition: {
            top: "-left-32 lg:-left-30 md:-left-28",
            left: "-top-9 lg:-top-16 md:-top-14",
            transform: "transform -rotate-50 lg:-rotate-66 md:-rotate-50 scale-[1.3] lg:scale-[1.2] md:scale-[1.2]"
          }
        },
        // Grgich Hills (second largest)
        {
          position: {
            top: "lg:bottom-27 bottom-26 md:bottom-32",
            left: "lg:right-1 -right-2 md:right-2",
            width: "w-24 lg:w-28 md:w-22",
            height: "h-24 lg:h-28 md:h-22",
            transform: "transform rotate-6 lg:-rotate-6 md:-rotate-2 scale-[1.2] lg:scale-[1.2] md:scale-[1.2]"
          },
          labelPosition: {
            top: "right-22 lg:right-18 md:right-26",
            left: "top-22 lg:top-1/2 md:top-16",
            transform: "transform rotate-108 lg:-rotate-90 md:rotate-106 scale-[1.1] lg:scale-[1.2] md:scale-[1.2]"
          }
        },
        // Buena Vista (third largest)
        {
          position: {
            top: "lg:bottom-25 bottom-22 md:bottom-28",
            left: "-left-0 lg:left-4 md:left-2",
            width: "w-18 lg:w-20 md:w-18",
            height: "h-18 lg:h-20 md:h-18",
            transform: "transform -rotate-6 lg:-rotate-6 md:-rotate-6 scale-[1.2] lg:scale-[1.2] md:scale-[1.2]"
          },
          labelPosition: {
            top: "left-8 lg:left-24 md:left-12",
            left: "-bottom-12 lg:bottom-60 md:-bottom-6",
            transform: "transform -rotate-112 lg:-rotate-275 md:rotate-238 scale-[1.0] lg:scale-[1.2] md:scale-[0.9]"
          }
        },
        // Walkers Reserve (smallest)
        {
          position: {
            top: "top-20 lg:top-17 md:top-17",
            left: "right-5 lg:right-7 md:right-7",
            width: "w-8 lg:w-8 md:w-8",
            height: "h-8 lg:h-8 md:h-8",
            transform: "transform rotate-12 lg:-rotate-12 md:-rotate-12 scale-[1.2] lg:scale-[1.2] md:scale-[1.2]"
          },
          labelPosition: {
            top: "-right-12 lg:-right-10 md:-right-12",
            left: "top-12 lg:top-2 md:top-8",
            transform: "transform rotate-45 lg:rotate-45 md:rotate-46 scale-[1.2] lg:scale-[1.2] md:scale-[1.2]"
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
          <div className="text-center text-black font-medium text-lg -mt-4 mb-20">
            THE SEEDBED
          </div>

          {/* Main subtract shape container */}
          <div className="relative w-full h-96">
            {/* Subtract.svg as the main outline */}
            <div className="absolute inset-0 scale-[1.1] lg:scale-[1.0] md:scale-[1.0] -mb-59 lg:-mb-48 md:-mb-48 -mt-38 lg:-mt-38 md:-mt-38">
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
                    width: 230,
                    height: 230,
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
                    radius: 95,
                    angle: Math.PI * 0.55,
                    fontSize: 12,
                    width: 180,
                    height: 200,
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
            top: "-top-7 md:-top-17 lg:-top-8",
            left: "left-5 md:left-3 lg:left-8",
            width: "w-[126px] md:w-[147px] lg:w-[128px]",
            height: "h-[126px] md:h-[147px] lg:h-[128px]",
            transform: "transform -rotate-4"
          },
          labelPosition: {
            top: "-left-8 md:-left-10 lg:-left-6",
            left: "-top-20 md:-top-33 lg:-top-22",
            transform: "transform -rotate-52 md:-rotate-48 lg:-rotate-38 scale-[1.3]"
          }
        },
        // Grgich Hills (second largest)
        {
          position: {
            top: "lg:bottom-24 bottom-30 md:bottom-27",
            left: "lg:-right-4 -right-4 md:-right-9",
            width: "w-26 md:w-32 lg:w-32",
            height: "h-26 md:h-32 lg:h-32",
            transform: "transform rotate-6"
          },
          labelPosition: {
            top: "-right-25 md:-right-26 lg:-right-20",
            left: "top-20 md:top-20 lg:top-26",
            transform: "transform rotate-277 md:rotate-270 lg:rotate-270 scale-[1.3]"
          }
        },
        // Buena Vista (third largest)
        {
          position: {
            top: "lg:bottom-24 bottom-27 md:bottom-24",
            left: "-left-3 lg:-left-3 md:-left-8",
            width: "w-22 md:w-26 lg:w-28",
            height: "h-22 md:h-26 lg:h-28",
            transform: "transform -rotate-6"
          },
          labelPosition: {
            top: "-left-48 md:-left-54 lg:-left-52",
            left: "-bottom-2 md:-bottom-1 lg:-bottom-2",
            transform: "transform rotate-80 md:rotate-84 lg:rotate-88 scale-[1.15] md:scale-[1.3] lg:scale-[1.3]"
          }
        },
        // Walkers Reserve (smallest)
        {
          position: {
            top: "top-5 md:-top-2 lg:top-4",
            left: "right-4 lg:right-6 md:-right-1",
            width: "w-10 md:w-12 lg:w-10",
            height: "h-10 md:h-12 lg:h-10",
            transform: "transform rotate-12"
          },
          labelPosition: {
            top: "-right-4 md:-right-8 lg:-right-4",
            left: "-top-6 md:-top-24 lg:-top-10",
            transform: "transform rotate-52 md:rotate-80 lg:rotate-42 scale-[1.2] lg:scale-[1.2] md:scale-[1.1]"
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
          <div className="relative w-full h-86">
            {/* Subtract.svg as the main outline */}
            <div className="absolute inset-0 lg:scale-[1.1] md:scale-[1.3] scale-[1.1]">
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
                    radius: 70,
                    angle: Math.PI * 0.6,
                    fontSize: 20,
                    width: 240,
                    height: 240,
                    offsetX: 0,
                    offsetY: 0,
                    rotationOffset: 0
                  },
                  // Grgich Hills (second largest)
                  {
                    radius: 82,
                    angle: Math.PI * 0.35,
                    fontSize: 9,
                    width: 200,
                    height: 200,
                    offsetX: 0,
                    offsetY: 0,
                    rotationOffset: 0
                  },
                  // Buena Vista (third largest)
                  {
                    radius: 126,
                    angle: Math.PI * 0.3,
                    fontSize: 8,
                    width: 300,
                    height: 300,
                    offsetX: 0,
                    offsetY: 0,
                    rotationOffset: 0
                  },
                  // Walkers Reserve (smallest)
                  {
                    radius: 84,
                    angle: Math.PI * 0.6,
                    fontSize: 20,
                    width: 220,
                    height: 220,
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