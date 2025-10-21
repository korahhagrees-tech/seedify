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

// --- Helper functions outside component for cache access ---
const getInitialCachedSnapshots = (walletAddress: string | null): any[] => {
  console.log('🚀 [WALLET INIT] getInitialCachedSnapshots called with walletAddress:', walletAddress);
  
  if (typeof window === 'undefined') {
    console.log('[WALLET INIT] Server-side render, returning empty array');
    return [];
  }
  
  if (!walletAddress) {
    console.log('[WALLET INIT] No wallet address, returning empty array');
    return [];
  }
  
  const cacheKey = `snapshots_cache_${walletAddress.toLowerCase()}`;
  
  try {
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      console.log('[WALLET INIT] No cached data found in localStorage for key:', cacheKey);
      return [];
    }
    
    const cacheData = JSON.parse(cached);
    const isExpired = Date.now() - cacheData.timestamp > 60 * 60 * 2 * 1000; // 2 hours
    
    if (isExpired) {
      console.log('⏰ [WALLET INIT] Cache expired, clearing and returning empty array');
      localStorage.removeItem(cacheKey);
      return [];
    }
    
    console.log('✅ [WALLET INIT] Loaded cached snapshots from localStorage:', cacheData.snapshots?.length || 0, 'snapshots');
    return cacheData.snapshots || [];
  } catch (error) {
    console.warn('⚠️ [WALLET INIT] Failed to parse cached snapshots:', error);
    return [];
  }
};

export default function WalletPage() {
  const router = useRouter();
  const { logout, walletAddress } = useAuth();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Initialize state with cached data using lazy initialization
  const [allSnapshots, setAllSnapshots] = useState<any[]>(() => {
    // This runs synchronously during initial render
    return getInitialCachedSnapshots(walletAddress);
  });
  
  const [tendedEcosystems, setTendedEcosystems] = useState<any[]>(() => {
    const cached = getInitialCachedSnapshots(walletAddress);
    return cached.slice(0, 5); // First page
  });
  
  const [hasMoreSnapshots, setHasMoreSnapshots] = useState(() => {
    const cached = getInitialCachedSnapshots(walletAddress);
    return cached.length > 5;
  });
  
  const [stewardSeeds, setStewardSeeds] = useState<any[]>([]);
  const [beneficiaryLinks, setBeneficiaryLinks] = useState<Map<number, string>>(new Map());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [snapshotsPerPage] = useState(5); // Show 5 snapshots per page

  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<{
    imageUrl: string;
    beneficiaryName: string;
    beneficiaryCode?: string;
  } | null>(null);

  // Debug wallet address and load cache when wallet address becomes available
  useEffect(() => {
    console.log('🔍 [WALLET] Current walletAddress:', walletAddress);
    console.log('🔍 [WALLET] Current state - allSnapshots.length:', allSnapshots.length, 'tendedEcosystems.length:', tendedEcosystems.length);
    
    // If wallet address just became available and we don't have data yet, try loading from cache
    if (walletAddress && allSnapshots.length === 0) {
      const cachedSnapshots = getInitialCachedSnapshots(walletAddress);
      if (cachedSnapshots.length > 0) {
        console.log('⚡ [WALLET] Wallet address now available, loading cache immediately');
        setAllSnapshots(cachedSnapshots);
        setTendedEcosystems(cachedSnapshots.slice(0, snapshotsPerPage));
        setHasMoreSnapshots(cachedSnapshots.length > snapshotsPerPage);
      }
    }
  }, [walletAddress, allSnapshots.length, tendedEcosystems.length, snapshotsPerPage]);

  // --- Enhanced localStorage helpers for caching ---
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  };
  const setCookie = (name: string, value: string, maxAgeSeconds = 60 * 60 * 24): void => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
  };

  // Cache snapshots data in localStorage (much faster than cookies)
  const cacheSnapshots = (snapshots: any[], address: string) => {
    if (typeof window === 'undefined') return;
    
    const cacheKey = `snapshots_cache_${address.toLowerCase()}`;
    const cacheData = {
      snapshots,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log('💾 [WALLET] Cached', snapshots.length, 'snapshots to localStorage');
    } catch (error) {
      console.warn('⚠️ [WALLET] Failed to cache snapshots to localStorage:', error);
    }
  };

  const getCachedSnapshots = (address: string): any[] | null => {
    if (typeof window === 'undefined') return null;
    
    const cacheKey = `snapshots_cache_${address.toLowerCase()}`;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      const isExpired = Date.now() - cacheData.timestamp > 60 * 60 * 2 * 1000; // 2 hours
      
      if (isExpired) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return cacheData.snapshots || [];
    } catch (error) {
      console.warn('⚠️ [WALLET] Failed to get cached snapshots:', error);
      return null;
    }
  };

  // Check if we need to refresh data (new snapshot minted)
  const shouldRefreshSnapshots = (address: string): boolean => {
    if (typeof window === 'undefined') return true;
    
    const lastCheckKey = `snapshots_last_check_${address.toLowerCase()}`;
    const lastCheck = localStorage.getItem(lastCheckKey);
    const now = Date.now();

    // Refresh if never checked or more than 5 minutes since last check
    if (!lastCheck || now - parseInt(lastCheck) > 5 * 60 * 1000) {
      localStorage.setItem(lastCheckKey, String(now));
      return true;
    }
    return false;
  };

  // Load more snapshots function for pagination
  const loadMoreSnapshots = async () => {
    if (!walletAddress || isLoadingMore || !hasMoreSnapshots) return;

    setIsLoadingMore(true);
    try {
      const snapshotsUrl = `${API_CONFIG.baseUrl}${API_ENDPOINTS.userSnapshots(walletAddress)}`;
      const response = await fetch(snapshotsUrl);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.snapshots) {
          // Enrich new snapshots
          const enrichedSnapshots = await Promise.all(
            data.snapshots.map(async (snapshot: any) => {
              try {
                const seedData = await fetchSeedById(snapshot.seedId.toString());
                const beneficiary = await fetchBeneficiaryByIndex(snapshot.beneficiaryIndex);

                let ecosystemCompost = "0.00 ETH";
                try {
                  const seedStats = await fetchSeedStats(snapshot.seedId.toString());
                  if (seedStats?.beneficiaries && Array.isArray(seedStats.beneficiaries)) {
                    const matchingBeneficiary = seedStats.beneficiaries.find(
                      (b: any) => b.code === beneficiary?.code
                    );
                    if (matchingBeneficiary?.totalValue) {
                      const rawValue = parseFloat(matchingBeneficiary.totalValue);
                      ecosystemCompost = `${rawValue.toFixed(6)} ETH`;
                    }
                  }
                } catch (statsError) {
                  console.warn(`Failed to fetch seed stats for snapshot ${snapshot.id}:`, statsError);
                }

                return {
                  ...snapshot,
                  seedImageUrl: snapshot.imageUrl || '',
                  seedName: seedData?.name || `Seed ${snapshot.seedId}`,
                  seedLabel: seedData?.label || `SEED ${snapshot.seedId}`,
                  beneficiaryName: beneficiary?.name || `Beneficiary #${snapshot.beneficiaryIndex}`,
                  beneficiaryCode: beneficiary?.code || '',
                  beneficiarySlug: beneficiary?.slug || `beneficiary-${snapshot.beneficiaryIndex}`,
                  ecosystemCompost: ecosystemCompost,
                };
              } catch (e) {
                console.error(`Failed to enrich snapshot ${snapshot.id}:`, e);
                return {
                  ...snapshot,
                  seedImageUrl: snapshot.imageUrl || '',
                  seedName: `Seed ${snapshot.seedId}`,
                  seedLabel: `SEED ${snapshot.seedId}`,
                  beneficiaryName: `Beneficiary #${snapshot.beneficiaryIndex}`,
                  beneficiaryCode: '',
                  beneficiarySlug: `beneficiary-${snapshot.beneficiaryIndex}`,
                  ecosystemCompost: "0.00 ETH",
                };
              }
            })
          );

          // Update all snapshots and check if we have more
          setAllSnapshots(enrichedSnapshots.reverse());
          setHasMoreSnapshots(enrichedSnapshots.length >= snapshotsPerPage);

          // Update displayed snapshots
          const startIndex = 0;
          const endIndex = currentPage * snapshotsPerPage;
          setTendedEcosystems(enrichedSnapshots.slice(startIndex, endIndex));

          // Cache the data
          cacheSnapshots(enrichedSnapshots, walletAddress);
        }
      }
    } catch (error) {
      console.error('Failed to load more snapshots:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Fetch user's seeds (steward check) and snapshots (tended ecosystems)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!walletAddress) {
        console.log('[WALLET] No wallet address available');
        return;
      }

      console.log('🔗 [WALLET] Starting to load wallet data for address:', walletAddress);

      // Check if we need to refresh (cache may already be loaded in state)
      const shouldRefresh = shouldRefreshSnapshots(walletAddress);

      try {
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
            console.log('[WALLET] No seeds found or API failed:', seedsData);
            if (!cancelled) {
              setStewardSeeds([]);
            }
          }
        } else {
          console.error('[WALLET] Seeds API request failed with status:', seedsResponse.status);
          if (!cancelled) {
            setStewardSeeds([]);
          }
        }

        // Check if we have valid cached data
        const cachedSnapshots = getCachedSnapshots(walletAddress);
        const hasCachedData = cachedSnapshots && cachedSnapshots.length > 0;
        
        // If we have cached data and don't need to refresh, use it
        if (hasCachedData && !shouldRefresh) {
          console.log('✅ [WALLET] Using cached data, skipping API fetch (', cachedSnapshots.length, 'snapshots)');
          if (!cancelled && allSnapshots.length === 0) {
            // Only update state if we don't already have data (avoid unnecessary re-renders)
            const reversedSnapshots = cachedSnapshots; // Already reversed in cache
            setAllSnapshots(reversedSnapshots);
            setTendedEcosystems(reversedSnapshots.slice(0, snapshotsPerPage));
            setHasMoreSnapshots(reversedSnapshots.length > snapshotsPerPage);
          }
        } else {
          // Fetch fresh data if no cache or need refresh
          console.log('🔄 [WALLET] Fetching fresh snapshots data (hasCachedData:', hasCachedData, 'shouldRefresh:', shouldRefresh, ')');

          // Fetch user's snapshots from /users/{address}/snapshots endpoint for TendedEcosystem (with ETag + throttle)
          const snapshotsUrl = `${API_CONFIG.baseUrl}${API_ENDPOINTS.userSnapshots(walletAddress)}`;
          console.log('🔗 [WALLET] Final snapshots URL:', snapshotsUrl);
          const snapsEtagCookieKey = `snaps_etag_${addressKey}`;
          const snapsLastCookieKey = `snaps_last_${addressKey}`;
          const prevSnapsEtag = getCookie(snapsEtagCookieKey);
          const prevSnapsLast = getCookie(snapsLastCookieKey);

          // Throttle refetch if we fetched within last 20s and already have data
          const nowMs = Date.now();
          const lastMs = prevSnapsLast ? parseInt(prevSnapsLast, 10) : 0;
          const shouldThrottle = allSnapshots.length > 0 && lastMs && nowMs - lastMs < 20_000;

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
                // Reverse order to show newest first (backend returns oldest first)
                const reversedSnapshots = enrichedSnapshots.reverse();
                setAllSnapshots(reversedSnapshots);

                // Set initial pagination
                const startIndex = 0;
                const endIndex = currentPage * snapshotsPerPage;
                setTendedEcosystems(reversedSnapshots.slice(startIndex, endIndex));
                setHasMoreSnapshots(reversedSnapshots.length > snapshotsPerPage);

                // Cache the data
                cacheSnapshots(reversedSnapshots, walletAddress);
                console.log('✅ [WALLET] Enriched snapshots (newest first):', reversedSnapshots);
              }

              const newSnapsEtag = snapshotsResponse.headers.get('ETag');
              if (newSnapsEtag) setCookie(snapsEtagCookieKey, newSnapsEtag, 60 * 10); // 10 minutes
              setCookie(snapsLastCookieKey, String(Date.now()), 60 * 10);
            } else {
              console.log('[WALLET] No snapshots found or API failed:', snapshotsData);
              if (!cancelled) {
                setAllSnapshots([]);
                setTendedEcosystems([]);
                setHasMoreSnapshots(false);
              }
            }
          } else {
            // 304 or throttled
            console.log('✅ [WALLET] Using existing snapshots (304/throttled).');
          }
        } // End of else block for fresh data fetch
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
  }, [walletAddress, allSnapshots]);

  // Scroll-based pagination
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        if (hasMoreSnapshots && !isLoadingMore) {
          setCurrentPage(prev => {
            const newPage = prev + 1;
            const startIndex = 0;
            const endIndex = newPage * snapshotsPerPage;
            const newSnapshots = allSnapshots.slice(startIndex, endIndex);
            setTendedEcosystems(newSnapshots);
            setHasMoreSnapshots(newSnapshots.length < allSnapshots.length);
            return newPage;
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMoreSnapshots, isLoadingMore, allSnapshots, snapshotsPerPage]);

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

  // Function to refresh snapshots data (called when new snapshot is minted)
  const refreshSnapshots = async () => {
    if (!walletAddress) return;

    console.log('🔄 [WALLET] Refreshing snapshots data');

    // Clear localStorage cache to force fresh fetch
    const addressKey = walletAddress.toLowerCase();
    const cacheKey = `snapshots_cache_${addressKey}`;
    const lastCheckKey = `snapshots_last_check_${addressKey}`;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(lastCheckKey);
      console.log('🗑️ [WALLET] Cleared localStorage cache');
    }

    // Reset pagination
    setCurrentPage(1);
    setHasMoreSnapshots(true);
    setAllSnapshots([]);
    setTendedEcosystems([]);

    // Trigger fresh data load
    const shouldRefresh = shouldRefreshSnapshots(walletAddress);
    if (shouldRefresh) {
      // Force refresh by clearing the last check time
      if (typeof window !== 'undefined') {
        localStorage.removeItem(lastCheckKey);
      }
    }
  };

  // Expose refresh function globally for other components to call
  useEffect(() => {
    (window as any).refreshWalletSnapshots = refreshSnapshots;
    return () => {
      delete (window as any).refreshWalletSnapshots;
    };
  }, [walletAddress, refreshSnapshots]);

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
          <div className="space-y-8 -mb-2 lg:mb-6 md:mb-6 scale-[0.8] lg:scale-[1.0] md:scale-[1.0] -ml-10">
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
          <>
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

            {/* Mint Button at Bottom */}
            {walletAddress && (
              <div className="-mt-10 mb-16 flex justify-center">
                <motion.button
                  onClick={() => router.push(`/wallet/mint/${walletAddress}`)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full border-3 border-dotted border-gray-600 bg-white/80 backdrop-blur-sm text-black text-lg font-medium peridia-display tracking-widest shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                  CREATE NEW SEED
                </motion.button>
              </div>
            )}
          </>
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
