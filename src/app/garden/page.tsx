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
    <div className="min-h-screen w-screen mx-auto scale-[0.9] -ml-2 -mt-18 max-w-md bg-none">
      <SeedsListing onSeedClick={handleSeedClick} />
    </div>
  );
}


