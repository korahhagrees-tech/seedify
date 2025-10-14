"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SeedDetailPage from "@/components/seeds/SeedDetailPage";
import { Seed } from "@/types/seed";
import { fetchSeedById } from "@/lib/api/seeds";

export default function SeedDetailsRoute() {
  const params = useParams();
  const router = useRouter();
  const [seed, setSeed] = useState<Seed | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    async function load() {
      const id = Array.isArray(params.id)
        ? params.id[0]
        : (params.id as string);
      if (!id) return;
      const s = await fetchSeedById(id);
      setSeed(s || null);
      setHasFetched(true);
    }
    load();
  }, [params.id]);

  if (!seed && hasFetched) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Seed not found.</p>
        <button onClick={() => router.push("/garden")} className="underline">
          Back to Garden
        </button>
      </div>
    );
  }

  if (!seed) {
    return null; // Still fetching, show nothing
  }

  return (
    <div className="-mt-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-44">
      <SeedDetailPage seed={seed} onBack={() => router.push("/garden")} />
    </div>
  );
}
