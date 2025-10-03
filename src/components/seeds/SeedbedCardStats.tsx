"use client";

import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import { Beneficiary } from "@/lib/utils";
import { defaultBeneficiaries } from "@/lib/api/seeds";

interface SeedbedCardProps {
  className?: string;
  beneficiaries?: Beneficiary[];
}

export default function SeedbedCard({ className = "", beneficiaries = defaultBeneficiaries }: SeedbedCardProps) {
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
          
          {/* Main subtract shape container */}
          <div className="relative w-full h-96">
            {/* Subtract.svg as the main outline */}
            <div className="absolute inset-0 scale-[1.2] -mb-5">
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
            <div className="absolute inset-0">
              {beneficiaries.map((beneficiary) => (
                <Link
                  key={beneficiary.id}
                  href={`/ecosystem/${beneficiary.slug}`}
                  className={`absolute ${beneficiary.position.top} ${beneficiary.position.left} ${beneficiary.position.width} ${beneficiary.position.height} ${beneficiary.position.transform} hover:scale-[1.1] transition-all duration-300`}
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
            
            {/* Text labels positioned around the shape */}
            <div className="absolute inset-0">
              {beneficiaries.map((beneficiary) => (
                <div
                  key={`${beneficiary.id}-label`}
                  className={`absolute ${beneficiary.labelPosition.top} ${beneficiary.labelPosition.left} ${beneficiary.labelPosition.transform} text-xs font-medium text-black whitespace-nowrap`}
                >
                  {beneficiary.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SeedbedCard2({ className = "" }: SeedbedCardProps) {
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
            <div className="absolute inset-0">
              {/* El Globo - top left area */}
              <div className="absolute -top-20 left-4 w-[170px] h-[170px] transform -rotate-4">
                <Image
                  src={assets.elGlobo}
                  alt="El Globo Habitat Bank"
                  fill
                  className="object-contain hover:scale-[1.1] transition-all duration-300"
                />
              </div>
              
              {/* Walkers Reserve - top right area */}
              <div className="absolute -top-2 right-1 w-12 h-12 transform rotate-12">
                <Image
                  src={assets.walkersReserve}
                  alt="Walkers Reserve"
                  fill
                  className="object-contain hover:scale-[1.2] transition-all duration-300"
                />
              </div>
              
              {/* Buena Vista Heights - bottom left area */}
              <div className="absolute bottom-24 -left-3 w-32 h-32 transform -rotate-6">
                <Image
                  src={assets.buenaVista}
                  alt="Buena Vista Heights"
                  fill
                  className="object-contain hover:scale-[1.1] transition-all duration-300"
                />
              </div>
              
              {/* Grgich Hills Estate - bottom right area */}
              <div className="absolute bottom-28 -right-8 w-38 h-38 transform rotate-6">
                <Image
                  src={assets.grgichHills}
                  alt="Grgich Hills Estate"
                  fill
                  className="object-contain hover:scale-[1.1] transition-all duration-300"
                />
              </div>
            </div>
            
            {/* Text labels positioned around the shape */}
            <div className="absolute inset-0">
              {/* El Globo Habitat Bank - left side */}
              <div className="absolute -left-18 -top-10 transform -rotate-90 text-xs font-medium text-black whitespace-nowrap">
                El Globo Habitat Bank
              </div>
              
              {/* Buena Vista Heights - bottom left */}
              <div className="absolute left-16 bottom-42 transform rotate-66 text-xs font-medium text-black whitespace-nowrap">
                Buena Vista Heights
              </div>
              
              {/* Grgich Hills Estate - right side */}
              <div className="absolute right-18 top-1/2 transform -rotate-90 text-xs font-medium text-black whitespace-nowrap">
                Grgich Hills Estate
              </div>
              
              {/* Walkers Reserve - top right */}
              <div className="absolute -right-10 -top-4 transform rotate-45 text-xs font-medium text-black whitespace-nowrap">
                Walkers Reserve
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}