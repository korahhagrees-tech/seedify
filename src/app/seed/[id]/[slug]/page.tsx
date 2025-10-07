"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SeedDetailPage from "@/components/seeds/SeedDetailPage";
import { Seed } from "@/types/seed";
import { fetchSeedById } from "@/lib/api/seeds";
import Image from "next/image";

export default function SeedDetailsRoute() {
  const params = useParams();
  const router = useRouter();
  const [seed, setSeed] = useState<Seed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);
      if (!id) return;
      const s = await fetchSeedById(id);
      setSeed(s || null);
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mx-auto mb-4">
              <Image
                src="/assets/WOF_Logo-black.png"
                alt="Loading"
                width={100}
                height={100}
                className="w-full h-full max-w-[420px] scale-[1.2]"
                />
              </div>
            <p className="text-gray-600">Loading seed...</p>
          </div>
      </div>
    );
  }

  if (!seed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Seed not found.</p>
        <button onClick={() => router.push("/garden")} className="underline">Back to Garden</button>
      </div>
    );
  }

  return (
    <div className="-mt-4">
      <SeedDetailPage 
        seed={seed}
        onBack={() => router.push("/garden")}
      />
    </div>
  );
}

