"use client";

import { Beneficiary, shortenBeneficiaryName } from "@/lib/utils";
import { defaultBeneficiaries } from "@/lib/api/seeds";
import CurvedText from "@/components/ui/CurvedText";

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
          labelPosition: { top: '-right-16', left: '-top-2', transform: 'rotate-45' },
          radius: 70,
          angle: Math.PI * 0.4,
          rotationOffset: 0.1
        }
      ]
    }
  };

  const config = circleConfigs[state];

  return (
    <div className={`relative ${className}`}>
      {/* Outer gray layer */}
      <div className="bg-[#D9D9D9] rounded-3xl p-3">
        {/* Inner white layer */}
        <div className="bg-white rounded-3xl p-6 relative">
          {/* Title */}
          <div className="text-center text-black font-medium text-lg -mt-4 mb-36">
            THE SEEDBED
          </div>
          
          {/* Four conjoined circles container */}
          <div className="relative w-full h-96">
            {/* Conjoined circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Main organic shape formed by four conjoined circles */}
              <div className="relative w-80 h-80">
                {/* Background organic shape */}
                <div className="absolute inset-0 bg-white rounded-full opacity-50"></div>
                
                {/* Individual circles with dynamic sizing */}
                {config.circles.map((circle, index) => (
                  <div
                    key={circle.id}
                    className={`absolute ${circle.top} ${circle.left} ${circle.size} ${circle.transform} z-10`}
                  >
                    {/* Circle with border */}
                    <div className="w-full h-full rounded-full border-2 border-black bg-white relative overflow-hidden">
                      {/* Percentage display */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-black">{circle.percentage}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Curved text labels */}
            <div className="absolute inset-0 z-0">
              {config.circles.map((circle, index) => {
                const shortName = shortenBeneficiaryName(circle.name);
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

export function SeedbedCardStats2({ className = "" }: SeedbedCardStatsProps) {
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
        
        {/* Inner white layer */}
        <div className="bg-white rounded-3xl p-6 relative">
          {/* Title */}
          <div className="text-center text-black font-medium text-lg -mt-4 mb-36">
            THE SEEDBED
          </div>
          
          {/* Simplified conjoined circles for default state */}
          <div className="relative w-full h-96">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Four simple conjoined circles */}
              <div className="relative w-80 h-80">
                {/* El Globo - top left */}
                <div className="absolute -top-16 left-4 w-36 h-36 rounded-full border-2 border-dashed border-black bg-white flex items-center justify-center transform -rotate-4">
                  <span className="text-lg font-bold text-black">45%</span>
                </div>
                
                {/* Pantanal - top right */}
                <div className="absolute -top-8 right-4 w-32 h-32 rounded-full border-2 border-dotted border-black bg-white flex items-center justify-center transform rotate-8">
                  <span className="text-lg font-bold text-black">42%</span>
                </div>
                
                {/* Walkers - bottom left */}
                <div className="absolute bottom-16 -left-4 w-20 h-20 rounded-full border-2 border-dotted border-black bg-white flex items-center justify-center transform -rotate-6">
                  <span className="text-lg font-bold text-black">12%</span>
                </div>
                
                {/* Grgich - bottom right */}
                <div className="absolute bottom-20 -right-8 w-40 h-40 rounded-full border-2 border-dotted border-black bg-white flex items-center justify-center transform rotate-6">
                  <span className="text-lg font-bold text-black">63%</span>
                </div>
              </div>
            </div>
            
            {/* Simple text labels */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -left-20 -top-8 transform -rotate-90 text-xs font-medium text-black whitespace-nowrap">
                El Globo Habitat Bank
              </div>
              <div className="absolute -right-16 -top-2 transform rotate-45 text-xs font-medium text-black whitespace-nowrap">
                Pantanal biome
              </div>
              <div className="absolute left-12 bottom-32 transform rotate-60 text-xs font-medium text-black whitespace-nowrap">
                Walkers Reserve
              </div>
              <div className="absolute right-20 top-1/2 transform -rotate-90 text-xs font-medium text-black whitespace-nowrap">
                Grgich Hills Estate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}