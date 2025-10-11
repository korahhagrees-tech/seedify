"use client";

import { Beneficiary, shortenBeneficiaryName } from "@/lib/utils";
import { defaultBeneficiaries } from "@/lib/api/seeds";
import CurvedText from "@/components/ui/CurvedText";
import Image from "next/image";

interface SeedbedCardStatsProps {
  className?: string;
  beneficiaries?: Beneficiary[];
  state?: 'frame1' | 'frame2'; // Two different states as shown in screenshot
}

export default function SeedbedCardStats({ 
  className = "", 
  beneficiaries = defaultBeneficiaries,
  state = 'frame1'
}: SeedbedCardStatsProps) {
  // Sort beneficiaries by percentage (highest first) for consistent ordering
  const sortedBeneficiaries = [...beneficiaries]
    .sort((a, b) => parseFloat(b.percentage || "0") - parseFloat(a.percentage || "0"));

  // Different circle configurations for the two states
  const circleConfigs = {
    frame1: {
      // Frame 1: El Globo (45%), Pantanal (42%), Walkers (12%), Grgich (63%)
      circles: [
        {
          id: 'grgich',
          name: 'Grgich Hills Estate',
          percentage: '63%',
          size: 'w-40 h-40', // Largest
          position: 'bottom-right',
          top: 'bottom-20',
          left: '-right-8',
          transform: 'rotate-6',
          borderStyle: 'border-dashed', // Alternating dashes and dots
          labelPosition: { top: 'right-20', left: 'top-1/2', transform: '-rotate-90' },
          radius: 80,
          angle: Math.PI * 0.5,
          rotationOffset: 0.2
        },
        {
          id: 'elglobo',
          name: 'El Globo Habitat Bank',
          percentage: '45%',
          size: 'w-36 h-36', // Second largest
          position: 'top-left',
          top: '-top-16',
          left: 'left-4',
          transform: '-rotate-4',
          borderStyle: 'border-dashed', // Short thick dashes
          labelPosition: { top: '-left-20', left: '-top-8', transform: '-rotate-90' },
          radius: 75,
          angle: Math.PI * 0.45,
          rotationOffset: -0.1
        },
        {
          id: 'pantanal',
          name: 'Pantanal biome',
          percentage: '42%',
          size: 'w-32 h-32', // Medium
          position: 'top-right',
          top: '-top-8',
          left: 'right-4',
          transform: 'rotate-8',
          borderStyle: 'border-dotted', // Fine dots
          labelPosition: { top: '-right-16', left: '-top-2', transform: 'rotate-45' },
          radius: 70,
          angle: Math.PI * 0.4,
          rotationOffset: 0.1
        },
        {
          id: 'walkers',
          name: 'Walkers Reserve',
          percentage: '12%',
          size: 'w-20 h-20', // Smallest
          position: 'bottom-left',
          top: 'bottom-16',
          left: '-left-4',
          transform: '-rotate-6',
          borderStyle: 'border-dotted', // Fine dots
          labelPosition: { top: 'left-12', left: 'bottom-32', transform: 'rotate-60' },
          radius: 50,
          angle: Math.PI * 0.3,
          rotationOffset: -0.2
        }
      ]
    },
    frame2: {
      // Frame 2: El Globo (45%), Pantanal (42%), Walkers (51%), Grgich (63%)
      circles: [
        {
          id: 'grgich',
          name: 'Grgich Hills Estate',
          percentage: '63%',
          size: 'w-40 h-40', // Still largest
          position: 'bottom-right',
          top: 'bottom-20',
          left: '-right-8',
          transform: 'rotate-6',
          borderStyle: 'border-dashed', // Alternating dashes and dots
          labelPosition: { top: 'right-20', left: 'top-1/2', transform: '-rotate-90' },
          radius: 80,
          angle: Math.PI * 0.5,
          rotationOffset: 0.2
        },
        {
          id: 'walkers',
          name: 'Walkers Reserve',
          percentage: '51%', // Increased from 12%
          size: 'w-38 h-38', // Much larger now
          position: 'bottom-left',
          top: 'bottom-18',
          left: '-left-6',
          transform: '-rotate-6',
          borderStyle: 'border-dotted', // Dense fine dots
          labelPosition: { top: 'left-16', left: 'bottom-36', transform: 'rotate-60' },
          radius: 78,
          angle: Math.PI * 0.48,
          rotationOffset: -0.2
        },
        {
          id: 'elglobo',
          name: 'El Globo Habitat Bank',
          percentage: '45%',
          size: 'w-36 h-36', // Same as frame 1
          position: 'top-left',
          top: '-top-16',
          left: 'left-4',
          transform: '-rotate-4',
          borderStyle: 'border-dashed', // Short thick dashes
          labelPosition: { top: '-left-20', left: '-top-8', transform: '-rotate-90' },
          radius: 75,
          angle: Math.PI * 0.45,
          rotationOffset: -0.1
        },
        {
          id: 'pantanal',
          name: 'Pantanal biome',
          percentage: '42%',
          size: 'w-32 h-32', // Same as frame 1
          position: 'top-right',
          top: '-top-8',
          left: 'right-4',
          transform: 'rotate-8',
          borderStyle: 'border-dotted', // Fine dots
          labelPosition: { top: '-right-16', left: '-top-2', transform: 'rotate-45' },
          radius: 70,
          angle: Math.PI * 0.4,
          rotationOffset: 0.1
        }
      ]
    }
  };

  const config = circleConfigs[state];

  // Map beneficiaries to circle SVGs based on percentage ranking
  const circleSvgs = [
    '/circle-big.svg',      // 3rd largest
    '/mid-dashed.svg',       // Largest percentage (1st)
    '/circle-small.svg',    // Smallest percentage (4th)
    '/dotted-dashed.svg',   // 2nd largest  
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Outer gray layer */}
      <div className="bg-[#D9D9D9] rounded-3xl p-3">
        {/* Inner gradient layer */}
        <div className="bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 rounded-3xl p-6 relative">
          {/* Title */}
          <div className="text-center text-black font-medium text-lg -mt-4 mb-36">
            THE SEEDBED
          </div>
          
          {/* Main seedbed container */}
          <div className="relative w-full h-84">
            {/* Background seedbed-2.svg shape */}
            <div className="absolute inset-0 -top-30 flex items-center justify-center">
              <Image
                src="/seedbed-2.svg"
                alt="Seedbed shape"
                className="w-96 h-96 object-contain scale-[1.2]"
                width={320}
                height={320}
              />
            </div>
            
            {/* Four circles positioned on the seedbed shape */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-80 h-80">
                {/* Map beneficiaries to circles based on percentage ranking */}
                {config.circles.map((circle, index) => {
                  // Get the beneficiary data for this position
                  const beneficiary = sortedBeneficiaries[index];
                  const circleSvg = circleSvgs[index];
                  
                  return (
                    <div
                      key={circle.id}
                      className={`absolute ${circle.top} ${circle.left} ${circle.size} ${circle.transform} z-10`}
                    >
                      {/* Circle SVG */}
                      <div className="relative w-full h-full">
                        <Image
                          src={circleSvg}
                          alt={`${circle.name} circle`}
                          className="w-full h-full object-contain"
                          width={320}
                          height={320}
                        />
                        
                        {/* Percentage display */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-black">{beneficiary?.percentage || circle.percentage}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Curved text labels */}
            <div className="absolute inset-0 z-0">
              {config.circles.map((circle, index) => {
                const beneficiary = sortedBeneficiaries[index];
                const shortName = shortenBeneficiaryName(beneficiary?.name || circle.name);
                
                return (
                  <div
                    key={`${circle.id}-label`}
                    className={`absolute ${circle.labelPosition.top} ${circle.labelPosition.left} ${circle.labelPosition.transform} pointer-events-none`}
                  >
                    <CurvedText
                      text={shortName}
                      radius={circle.radius}
                      angle={circle.angle}
                      fontSize={10}
                      color="#000000"
                      width={circle.radius * 2}
                      height={circle.radius * 2}
                      rotationOffset={circle.rotationOffset}
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

export function SeedbedCardStats2({ className = "", beneficiaries = defaultBeneficiaries }: SeedbedCardStatsProps) {
  // Sort beneficiaries by percentage (highest first)
  const sortedBeneficiaries = [...beneficiaries]
    .sort((a, b) => parseFloat(b.percentage || "0") - parseFloat(a.percentage || "0"));

  // Map beneficiaries to circle SVGs based on percentage ranking
  const circleSvgs = [
    '/circle-small.svg',    // Smallest percentage (4th)
    '/circle-big.svg',      // 3rd largest
    '/dotted-dashed.svg',   // 2nd largest  
    '/mid-dashed.svg'       // Largest percentage (1st)
  ];

  // Circle positions and sizes
  const circlePositions = [
    // Top left - mid-dashed (largest percentage)
    { top: '-top-16', left: 'left-4', size: 'w-36 h-36', transform: '-rotate-4' },
    // Top right - dotted-dashed (2nd largest)
    { top: '-top-8', left: 'right-4', size: 'w-32 h-32', transform: 'rotate-8' },
    // Bottom left - circle-big (3rd largest)
    { top: 'bottom-16', left: '-left-4', size: 'w-20 h-20', transform: '-rotate-6' },
    // Bottom right - circle-small (smallest percentage)
    { top: 'bottom-20', left: '-right-8', size: 'w-40 h-40', transform: 'rotate-6' }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Outer gray layer */}
      <div className="bg-[#D9D9D9] rounded-3xl p-3">
        {/* Arrow circle on border */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-1 border-black flex items-center justify-center">
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        
        {/* Pull up text */}
        <div className="text-center text-sm text-black/70 mt-6 mb-4">
          Pull up to explore the seedbed
        </div>
        
        {/* Inner gradient layer */}
        <div className="bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 rounded-3xl p-6 relative">
          {/* Title */}
          <div className="text-center text-black font-medium text-lg -mt-4 mb-36">
            THE SEEDBED
          </div>
          
          {/* Main seedbed container */}
          <div className="relative w-full h-96">
            {/* Background seedbed-2.svg shape */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/seedbed-2.svg"
                alt="Seedbed shape"
                className="w-80 h-80 object-contain"
                width={320}
                height={320}
              />
            </div>
            
            {/* Four circles positioned on the seedbed shape */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-80 h-80">
                {circlePositions.map((position, index) => {
                  const beneficiary = sortedBeneficiaries[index];
                  const circleSvg = circleSvgs[index];
                  
                  return (
                    <div
                      key={index}
                      className={`absolute ${position.top} ${position.left} ${position.size} transform ${position.transform} z-10`}
                    >
                      {/* Circle SVG */}
                      <div className="relative w-full h-full">
                        <Image
                          src={circleSvg}
                          alt={`${beneficiary?.name || 'Beneficiary'} circle`}
                          className="w-full h-full object-contain"
                          width={320}
                          height={320}
                        />
                        
                        {/* Percentage display */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-black">{beneficiary?.percentage || '0%'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Simple text labels */}
            <div className="absolute inset-0 pointer-events-none">
              {circlePositions.map((position, index) => {
                const beneficiary = sortedBeneficiaries[index];
                const shortName = shortenBeneficiaryName(beneficiary?.name || '');
                
                const labelPositions = [
                  { top: '-left-20', left: '-top-8', transform: '-rotate-90' },
                  { top: '-right-16', left: '-top-2', transform: 'rotate-45' },
                  { top: 'left-12', left: 'bottom-32', transform: 'rotate-60' },
                  { top: 'right-20', left: 'top-1/2', transform: '-rotate-90' }
                ];
                
                const labelPos = labelPositions[index];
                
                return (
                  <div
                    key={`label-${index}`}
                    className={`absolute ${labelPos.top} ${labelPos.left} transform ${labelPos.transform} text-xs font-medium text-black whitespace-nowrap`}
                  >
                    {shortName}
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