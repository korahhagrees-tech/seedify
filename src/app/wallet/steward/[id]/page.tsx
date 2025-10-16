/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SeedStewardStats from "@/components/SeedStewardStats";
import { Seed } from "@/types/seed";
import { fetchSeedById } from "@/lib/api/seeds";

export default function StewardStatsRoute() {
  const params = useParams();
  const router = useRouter();
  const [seed, setSeed] = useState<Seed | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const id = Array.isArray(params.id)
        ? params.id[0]
        : (params.id as string);
      if (!id) return;

      try {
        setLoading(true);

        // Fetch seed data
        const s = await fetchSeedById(id);
        setSeed(s || null);

        // Fetch stats data
        const statsResponse = await fetch(
          `https://seedify-backend.up.railway.app/api/seeds/${id}/stats`
        );
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.success ? statsData.stats : null);
        } else {
          console.error("Failed to fetch stats:", statsResponse.statusText);
          setStats(null);
        }

        setHasFetched(true);
      } catch (error) {
        console.error("Error loading data:", error);
        setHasFetched(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!seed && hasFetched) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Seed not found.</p>
        <button onClick={() => router.push("/wallet")} className="underline">
          Back to Wallet
        </button>
      </div>
    );
  }

  if (!seed || !stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Failed to load data.</p>
        <button onClick={() => router.push("/wallet")} className="underline">
          Back to Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-md mx-auto">
      <SeedStewardStats
        seed={seed}
        links={{ openseaUrl: stats.openSeaUrl }}
        stats={stats}
      />
    </div>
  );
}
