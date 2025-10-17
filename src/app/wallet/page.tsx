/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { assets } from "@/lib/assets";
import RootShapeArea from "@/components/wallet/RootShapeArea";
import TendedEcosystem from "@/components/wallet/TendedEcosystem";
import StewardSeedCard from "@/components/wallet/StewardSeedCard";
import WalletModal from "@/components/wallet/WalletModal";
import ShareModal from "@/components/ShareModal";
import { useAuth } from "@/components/auth/AuthProvider";
import { clearAppStorage } from "@/lib/auth/logoutUtils";
import GardenHeader from "@/components/GardenHeader";
import { fetchBeneficiaryByIndex, fetchSeedById, fetchSeedStats } from "@/lib/api";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api/config";
import { getCodeForIndex, codeToSeedEmblemPath } from "@/lib/data/beneficiaryIndexMap";

// Mock data for tended ecosystems
// Each tended ecosystem represents a snapshot mint of a beneficiary from a seed
const mockTendedEcosystems = [
  {
    id: "1",
    date: "07/09/2025",
    seedEmblemUrl: assets.glowers,
    beneficiaryName: "Grgich Hills Estate Regenerative Sheep Grazing",
    seedImageUrl:
      "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
    userContribution: "0.011 ETH",
    ecosystemCompost: "1.03 ETH",
    seedId: "3", // The seed ID that was tended
    seedSlug: "seed-003", // The seed's label/slug
    beneficiarySlug: "grgich-hills-estate", // The beneficiary slug from that seed
  },
  {
    id: "2",
    date: "05/09/2025",
    seedEmblemUrl: assets.glowers,
    beneficiaryName: "Urban Garden Network Community Initiative",
    seedImageUrl:
      "https://wof-flourishing-backup.s3.amazonaws.com/seed2/seed.png",
    userContribution: "0.025 ETH",
    ecosystemCompost: "3.44 ETH",
    seedId: "3", // The seed ID that was tended
    seedSlug: "seed-003", // The seed's label/slug
    beneficiarySlug: "el-globo", // Another beneficiary from the same seed
  },
];

// Mock data for steward seeds (displayed above tended ecosystems when user is a steward)
const mockStewardSeeds = [
  {
    id: "001",
    label: "SEED 001",
    name: "Way Of Flowers Seed 001",
    description: "Mock steward seed",
    seedImageUrl:
      "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
    latestSnapshotUrl: null,
    snapshotCount: 43,
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    depositAmount: "1.011",
    snapshotPrice: "0.025",
    isWithdrawn: false,
    isLive: true,
    metadata: { exists: true, attributes: [] },
    story: { title: "", author: "", story: "" },
  },
];

export default function WalletPage() {
  const router = useRouter();
  const { logout, walletAddress } = useAuth();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [tendedEcosystems, setTendedEcosystems] = useState<any[]>([]);
  const [stewardSeeds, setStewardSeeds] = useState<any[]>([]);
  const [beneficiaryLinks, setBeneficiaryLinks] = useState<Map<number, string>>(new Map());

  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<{
    imageUrl: string;
    beneficiaryName: string;
    beneficiaryCode?: string;
  } | null>(null);

  // Debug wallet address
  useEffect(() => {
    console.log('🔍 [WALLET] Current walletAddress:', walletAddress);
  }, [walletAddress]);

  // --- Lightweight cookie helpers (tiny metadata only) ---
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  };
  const setCookie = (name: string, value: string, maxAgeSeconds = 60 * 60 * 24): void => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
  };

  // Fetch user's seeds (steward check) and snapshots (tended ecosystems)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!walletAddress) {
        console.log('❌ [WALLET] No wallet address available');
        return;
      }

      console.log('🔗 [WALLET] Starting to load wallet data for address:', walletAddress);

      try {
        // Test URL construction with a sample address
        const testAddress = '0xa8B484814De1CC58F89fce9d4490405DAC1e2cd5';
        const testSeedsUrl = `${API_CONFIG.baseUrl}${API_ENDPOINTS.userSeeds(testAddress)}`;
        console.log('🧪 [WALLET] Test seeds URL:', testSeedsUrl);

        // Fetch user's seeds from /users/{address}/seeds endpoint for StewardSeedCard (with ETag cookies)
        const addressKey = walletAddress.toLowerCase();
        const seedsUrl = `${API_CONFIG.baseUrl}${API_ENDPOINTS.userSeeds(walletAddress)}`;
        console.log('🔗 [WALLET] Fetching seeds from:', seedsUrl);
        const seedsEtagCookieKey = `seeds_etag_${addressKey}`;
        const seedsPrevEtag = getCookie(seedsEtagCookieKey);
        const seedsResponse = await fetch(seedsUrl, {
          headers: seedsPrevEtag ? { 'If-None-Match': seedsPrevEtag } : undefined,
        });
        console.log('📊 [WALLET] Seeds API Response status:', seedsResponse.status);

        if (seedsResponse.status === 304) {
          console.log('✅ [WALLET] Seeds not modified (ETag). Skipping state update.');
        } else if (seedsResponse.ok) {
          const seedsData = await seedsResponse.json();
          console.log('📊 [WALLET] Seeds API Response data:', seedsData);

          if (seedsData.success && seedsData.seeds && seedsData.seeds.length > 0) {
            console.log('✅ [WALLET] Loaded seeds:', seedsData.seeds);
            if (!cancelled) {
              setStewardSeeds(seedsData.seeds);
            }
            const newEtag = seedsResponse.headers.get('ETag');
            if (newEtag) setCookie(seedsEtagCookieKey, newEtag, 60 * 60); // 1 hour
          } else {
            console.log('❌ [WALLET] No seeds found or API failed:', seedsData);
            if (!cancelled) {
              setStewardSeeds([]);
            }
          }
        } else {
          console.error('❌ [WALLET] Seeds API request failed with status:', seedsResponse.status);
          if (!cancelled) {
            setStewardSeeds([]);
          }
        }

        // Fetch user's snapshots from /users/{address}/snapshots endpoint for TendedEcosystem (with ETag + throttle)
        const snapshotsUrl = `${API_CONFIG.baseUrl}${API_ENDPOINTS.userSnapshots(walletAddress)}`;
        console.log('🔗 [WALLET] API_CONFIG.baseUrl:', API_CONFIG.baseUrl);
        console.log('🔗 [WALLET] API_ENDPOINTS.userSnapshots(walletAddress):', API_ENDPOINTS.userSnapshots(walletAddress));
        console.log('🔗 [WALLET] Final snapshots URL:', snapshotsUrl);
        const snapsEtagCookieKey = `snaps_etag_${addressKey}`;
        const snapsLastCookieKey = `snaps_last_${addressKey}`;
        const prevSnapsEtag = getCookie(snapsEtagCookieKey);
        const prevSnapsLast = getCookie(snapsLastCookieKey);

        // Throttle refetch if we fetched within last 20s and already have data
        const nowMs = Date.now();
        const lastMs = prevSnapsLast ? parseInt(prevSnapsLast, 10) : 0;
        const shouldThrottle = tendedEcosystems.length > 0 && lastMs && nowMs - lastMs < 20_000;

        let snapshotsResponse: Response | null = null;
        if (!shouldThrottle) {
          snapshotsResponse = await fetch(snapshotsUrl, {
            headers: prevSnapsEtag ? { 'If-None-Match': prevSnapsEtag } : undefined,
          });
        } else {
          console.log('⏭️ [WALLET] Skipping snapshots refetch (throttled <20s).');
        }

        if (snapshotsResponse) {
          console.log('📊 [WALLET] API Response status:', snapshotsResponse.status);
        }

        if (snapshotsResponse && !snapshotsResponse.ok && snapshotsResponse.status !== 304) {
          throw new Error(`API request failed with status ${snapshotsResponse.status}`);
        }

        if (snapshotsResponse && snapshotsResponse.status !== 304) {
          const snapshotsData = await snapshotsResponse.json();
          console.log('📊 [WALLET] API Response data:', snapshotsData);

          if (snapshotsData.success && snapshotsData.snapshots.length > 0) {
            console.log('✅ [WALLET] Loaded snapshots:', snapshotsData.snapshots);
            console.log('🔍 [WALLET] First snapshot structure:', snapshotsData.snapshots[0]);

            // Enrich snapshots with seed and beneficiary data
            const enrichedSnapshots = await Promise.all(
              snapshotsData.snapshots.map(async (snapshot: any) => {
                try {
                  // Fetch seed data to get seed image and info
                  const seedData = await fetchSeedById(snapshot.seedId.toString());

                  // Fetch beneficiary data to get proper name and readMoreLink
                  const beneficiary = await fetchBeneficiaryByIndex(snapshot.beneficiaryIndex);
                  console.log(`🔍 [WALLET] Beneficiary data for index ${snapshot.beneficiaryIndex}:`, beneficiary);

                  // Fetch seed stats to get ecosystem compost value
                  let ecosystemCompost = "0.00 ETH"; // Default fallback
                  try {
                    console.log(`🔍 [WALLET] Fetching seed stats for seedId: ${snapshot.seedId} (type: ${typeof snapshot.seedId}), beneficiaryCode: ${beneficiary?.code}`);
                    const seedStats = await fetchSeedStats(snapshot.seedId.toString());
                    console.log(`🔍 [WALLET] Seed stats response for seedId ${snapshot.seedId}:`, seedStats);

                    if (seedStats?.beneficiaries && Array.isArray(seedStats.beneficiaries)) {
                      console.log(`🔍 [WALLET] Available beneficiaries in stats:`, seedStats.beneficiaries.map((b: any) => ({ code: b.code, totalValue: b.totalValue })));

                      // Find matching beneficiary by code
                      const matchingBeneficiary = seedStats.beneficiaries.find(
                        (b: any) => b.code === beneficiary?.code
                      );

                      console.log(`🔍 [WALLET] Looking for beneficiary code: ${beneficiary?.code}`);
                      console.log(`🔍 [WALLET] Matching beneficiary found:`, matchingBeneficiary);

                      if (matchingBeneficiary?.totalValue) {
                        const rawValue = parseFloat(matchingBeneficiary.totalValue);
                        ecosystemCompost = `${rawValue.toFixed(6)} ETH`;
                        console.log(`🔍 [WALLET] Raw totalValue: ${matchingBeneficiary.totalValue}, parsed: ${rawValue}, formatted: ${ecosystemCompost}`);
                      } else {
                        console.log(`🔍 [WALLET] No matching beneficiary or totalValue found`);
                      }
                    } else {
                      console.log(`🔍 [WALLET] No beneficiaries array in seed stats`);
                    }
                  } catch (statsError) {
                    console.warn(`Failed to fetch seed stats for snapshot ${snapshot.id}:`, statsError);
                  }

                  // Store readMoreLink in the map
                  if (beneficiary?.projectData?.readMoreLink) {
                    setBeneficiaryLinks(prev => new Map(prev).set(snapshot.beneficiaryIndex, beneficiary.projectData!.readMoreLink!));
                  }

                  // Return enriched snapshot data
                  const enrichedSnapshot = {
                    ...snapshot,
                    // Use imageUrl from snapshot response as seedImageUrl
                    seedImageUrl: snapshot.imageUrl || '',
                    seedName: seedData?.name || `Seed ${snapshot.seedId}`,
                    seedLabel: seedData?.label || `SEED ${snapshot.seedId}`,
                    // Add beneficiary data
                    beneficiaryName: beneficiary?.name || `Beneficiary #${snapshot.beneficiaryIndex}`,
                    beneficiaryCode: beneficiary?.code || '',
                    beneficiarySlug: beneficiary?.slug || `beneficiary-${snapshot.beneficiaryIndex}`,
                    // Add ecosystem compost value
                    ecosystemCompost: ecosystemCompost,
                  };

                  console.log(`🔍 [WALLET] Enriched snapshot ${snapshot.id}:`, {
                    originalImageUrl: snapshot.imageUrl,
                    seedImageUrl: enrichedSnapshot.seedImageUrl,
                    beneficiaryName: enrichedSnapshot.beneficiaryName,
                    beneficiaryCode: enrichedSnapshot.beneficiaryCode,
                    ecosystemCompost: enrichedSnapshot.ecosystemCompost
                  });

                  return enrichedSnapshot;
                } catch (e) {
                  console.error(`Failed to enrich snapshot ${snapshot.id}:`, e);
                  // Return original snapshot with fallback data
                  const fallbackSnapshot = {
                    ...snapshot,
                    // Use imageUrl from snapshot response as seedImageUrl
                    seedImageUrl: snapshot.imageUrl || '',
                    seedName: `Seed ${snapshot.seedId}`,
                    seedLabel: `SEED ${snapshot.seedId}`,
                    beneficiaryName: `Beneficiary #${snapshot.beneficiaryIndex}`,
                    beneficiaryCode: '',
                    beneficiarySlug: `beneficiary-${snapshot.beneficiaryIndex}`,
                    ecosystemCompost: "0.00 ETH", // Default fallback
                  };

                  console.log(`🔍 [WALLET] Fallback snapshot ${snapshot.id}:`, {
                    originalImageUrl: snapshot.imageUrl,
                    seedImageUrl: fallbackSnapshot.seedImageUrl,
                    beneficiaryName: fallbackSnapshot.beneficiaryName,
                    ecosystemCompost: fallbackSnapshot.ecosystemCompost
                  });

                  return fallbackSnapshot;
                }
              })
            );

            if (!cancelled) {
              setTendedEcosystems(enrichedSnapshots);
              console.log('✅ [WALLET] Enriched snapshots:', enrichedSnapshots);
            }

            const newSnapsEtag = snapshotsResponse.headers.get('ETag');
            if (newSnapsEtag) setCookie(snapsEtagCookieKey, newSnapsEtag, 60 * 10); // 10 minutes
            setCookie(snapsLastCookieKey, String(Date.now()), 60 * 10);
          } else {
            console.log('❌ [WALLET] No snapshots found or API failed:', snapshotsData);
            if (!cancelled) {
              setTendedEcosystems([]);
            }
          }
        } else {
          // 304 or throttled
          console.log('✅ [WALLET] Using existing snapshots (304/throttled).');
        }
      } catch (_e) {
        console.error('Failed to load wallet data:', _e);
        if (!cancelled) {
          setStewardSeeds([]);
          setTendedEcosystems([]);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [walletAddress, tendedEcosystems]);

  const handleReadMore = (beneficiaryIndex: number) => {
    // Get beneficiary's readMoreLink from the map
    const link = beneficiaryLinks.get(beneficiaryIndex);
    if (link) {
      window.open(link, '_blank');
    }
  };

  const handleTendAgain = (ecosystemId: string) => {
    // Route to ecosystem page
    router.push(`/ecosystem/ecosystem-${ecosystemId}`);
  };

  const handleShare = (data: { imageUrl: string; beneficiaryName: string; beneficiaryCode?: string }) => {
    // Set share data and open modal
    setShareData(data);
    setIsShareModalOpen(true);
  };

  const handleShareModalClose = () => {
    setIsShareModalOpen(false);
    setShareData(null);
  };

  const handleWalletModalClose = () => {
    setIsWalletModalOpen(false);
  };

  const handleLogout = async () => {
    setIsWalletModalOpen(false);
    clearAppStorage();
    await logout();
    router.push("/");
    // Force refresh to clear all state
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  const handleAddFunds = () => {
    // Handle add funds
    console.log("Add funds");
  };

  const handleExportKey = () => {
    // Handle export key
    console.log("Export key");
  };

  const handleSwitchWallet = () => {
    // Handle switch wallet
    console.log("Switch wallet");
  };

  const handlePrivyHome = () => {
    // Handle privy home
    router.push("https://home.privy.io/login");
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto overflow-x-hidden">
      {/* Header */}
      <GardenHeader />

      {/* Content Area - Tended Ecosystems List */}
      <div className="px-4 pb-40 overflow-x-hidden lg:scale-[1.0] md:scale-[1.0] scale-[1.0] lg:mt-6 md:-mt-4 -mt-4">
        <div className="text-xs text-gray-800 text-center z-50 -mb-1 mt-2 lg:mt-2 md:mt-2">
          YOUR TENDED ECOSYSTEM
        </div>
        {/* Steward Seeds Section (always show; defaults to mock if backend empty) */}
        {stewardSeeds.length > 0 && (
          <div className="space-y-8 mb-10 scale-[0.8] lg:scale-[1.0] md:scale-[1.0] -ml-10">
            {stewardSeeds.map((seed, index) => {
              // Generate slug from seed label for routing
              const seedSlug =
                seed.label?.replace(/\s+/g, "-").toLowerCase() ||
                `seed-${seed.id}`;
              return (
                <StewardSeedCard
                  key={seed.id}
                  seed={seed}
                  index={index}
                  onTendSeed={() => router.push(`/seed/${seed.id}/${seedSlug}`)}
                  onExplore={() => router.push(`/wallet/steward/${seed.id}`)}
                />
              );
            })}
          </div>
        )}
        {tendedEcosystems.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 mt-30 lg:mt-26 md:mt-30"
          >
            <div className="text-gray-400 text-lg -mb-2 tracking-wider"><span className="peridia-display-light">Y</span>ou {`haven't`} tended</div>
            <div className="text-gray-400 text-lg mb-3 peridia-display-light tracking-wide">an Ecosystem yet</div>
            <div className="text-gray-400 text-lg -mb-2 peridia-display-light tracking-wider">Explore the Garden</div>
            <div className="text-gray-400 text-lg peridia-display-light tracking-widest">to start nurturing one</div>
          </motion.div>
        ) : (
          /* Tended Ecosystems List */
          <div className="space-y-4 mb-20 mt-6 z-50 lg:mt-6 md:mt-6">
            {tendedEcosystems.map((snapshot, index) => {
              const codeFromIndex = getCodeForIndex(snapshot.beneficiaryIndex);
              const emblem = codeToSeedEmblemPath(codeFromIndex);
              return (
                <TendedEcosystem
                  key={snapshot.id}
                  date={new Date(snapshot.timestamp * 1000).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                  seedEmblemUrl={emblem}
                  beneficiaryName={snapshot.beneficiaryName} // Now uses actual beneficiary name
                  seedImageUrl={snapshot.seedImageUrl} // Now uses actual seed image
                  userContribution={`${snapshot.valueEth} ETH`}
                  ecosystemCompost={snapshot.ecosystemCompost} // Now uses fetched ecosystem compost value
                  onReadMore={() => handleReadMore(snapshot.beneficiaryIndex)}
                  onTendAgain={() => handleTendAgain(snapshot.id)}
                  onShare={handleShare}
                  index={index}
                  beneficiarySlug={snapshot.beneficiarySlug} // Now uses actual beneficiary slug
                  beneficiaryCode={snapshot.beneficiaryCode} // Add beneficiary code for sharing
                  seedId={snapshot.seedId.toString()}
                  seedSlug={`seed-${snapshot.seedId}`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed Root Shape Area */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="max-w-md mx-auto w-full px-4">
          <RootShapeArea
            onWallet={() => setIsWalletModalOpen(true)}
            showGlassEffect={false}
            showStoryButton={false}
          />
        </div>
      </div>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={handleWalletModalClose}
        onLogout={handleLogout}
        onAddFunds={handleAddFunds}
        onExportKey={handleExportKey}
        onSwitchWallet={handleSwitchWallet}
        onPrivyHome={handlePrivyHome}
      />

      {/* Share Modal - Page Level */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleShareModalClose}
        imageUrl={shareData?.imageUrl || ""}
        beneficiaryName={shareData?.beneficiaryName}
        beneficiaryCode={shareData?.beneficiaryCode}
      />
    </div>
  );
}
