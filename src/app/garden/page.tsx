"use client";

import SeedsListing from "@/components/seeds/SeedsListing";
import { useRouter } from "next/navigation";
import { Seed } from "@/types/seed";

export default function GardenPage() {
  const router = useRouter();

  const handleSeedClick = (seed: Seed) => {
    const slug = seed.label.replace(/\s+/g, "-").toLowerCase();
    router.push(`/seed/${seed.id}/${slug}`);
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-none relative">
      <SeedsListing onSeedClick={handleSeedClick} />
    </div>
  );
}


