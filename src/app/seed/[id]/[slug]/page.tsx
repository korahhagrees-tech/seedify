"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SeedDetailPage from "@/components/SeedDetailPage";
import { Seed } from "@/types/seed";
import { fetchSeedById } from "@/lib/api/seeds";

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
    <SeedDetailPage 
      seed={seed}
      onBack={() => router.push("/garden")}
    />
  );
}


