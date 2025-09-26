"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface GardenHeaderProps {
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  logo?: string;
}

export default function GardenHeader({ onHomeClick, onProfileClick, logo }: GardenHeaderProps) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <button 
        onClick={onHomeClick ?? (() => router.push('/garden'))}
        className="w-14 h-14 flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <Image src="/Seedbed Button.svg" alt="Home" width={56} height={56} className="w-full h-full" />
      </button>

      <div className="flex-1 flex justify-center">
        <Image
          src={logo || "/test-pink.svg"}
          alt="THE WAY OF FLOWERS"
          width={220}
          height={48}
          className="w-full h-auto max-w-[220px]"
        />
      </div>

      <button 
        onClick={onProfileClick ?? (() => router.push('/profile'))}
        className="w-14 h-14 flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <Image src="/Profile Button.svg" alt="Profile" width={56} height={56} className="w-full h-full" />
      </button>
    </div>
  );
}
