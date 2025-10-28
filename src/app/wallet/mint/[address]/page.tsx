/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import StewardMint from "@/components/wallet/StewardMint";
import { usePrivy } from "@privy-io/react-auth";
import { assets } from "@/lib/assets";
import { API_CONFIG } from "@/lib/api/config";

export default function MintPage() {
  const params = useParams();
  const { user, walletAddress, activeWallet } = useAuth();
  const { authenticated: privyAuthenticated, ready: privyReady } = usePrivy();
  const router = useRouter();
  const address = params.address as string;
  const [prepareData, setPrepareData] = useState<any | null>(null);
  const [prepLoading, setPrepLoading] = useState<boolean>(false);
  const [prepError, setPrepError] = useState<string | null>(null);

  // Use the authenticated state from the Zustand store instead of Privy directly
  const authenticated = !!user && !!walletAddress;

  // Debug logging
  // console.log(' MintPage Debug:', {
  //   authenticated,
  //   privyAuthenticated,
  //   user: user ? 'exists' : 'null',
  //   userType: typeof user,
  //   walletAddress,
  //   walletAddressType: typeof walletAddress,
  //   activeWallet: activeWallet?.address || 'no active wallet',
  //   address
  // });

  // Render-first approach: do NOT redirect away. We'll check readiness/address lazily for actions.
  useEffect(() => {
    // console.log(' MintPage mounted with:', {
    //   authenticated,
    //   privyAuthenticated,
    //   user: !!user,
    //   walletAddress,
    //   activeWallet: activeWallet?.address,
    //   address
    // });
  }, [authenticated, privyAuthenticated, user, walletAddress, address, activeWallet]);

  // Fetch prepare data once
  useEffect(() => {
    const run = async () => {
      if (!address) return;
      setPrepLoading(true);
      setPrepError(null);
      try {
        const base = API_CONFIG.baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const url = `${base}/write/seeds/prepare/${address}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json?.success || !json?.data) throw new Error('Invalid prepare response');
        setPrepareData(json.data);
      } catch (e: any) {
        console.error('Failed to fetch prepareSeedCreation:', e);
        setPrepError('Failed to load minting data');
      } finally {
        setPrepLoading(false);
      }
    };
    run();
  }, [address]);

  const userEvmAddress = useMemo(() => {
    // console.log(' [MINT] Computing userEvmAddress:', {
    //   walletAddress,
    //   walletAddressType: typeof walletAddress,
    //   walletAddressStartsWith0x: walletAddress?.startsWith('0x'),
    //   activeWalletAddress: activeWallet?.address,
    //   activeWalletType: typeof activeWallet?.address,
    //   activeWalletStartsWith0x: activeWallet?.address?.startsWith('0x')
    // });

    // Priority 1: Use walletAddress from Zustand store
    if (walletAddress && typeof walletAddress === 'string' && walletAddress.startsWith('0x')) {
      console.log(' [MINT] Using walletAddress from Zustand:', walletAddress);
      return walletAddress;
    }
    
    // Priority 2: Use activeWallet address
    if (activeWallet?.address && typeof activeWallet.address === 'string' && activeWallet.address.startsWith('0x')) {
      // console.log(' [MINT] Using activeWallet.address:', activeWallet.address);
      return activeWallet.address;
    }
    
    // Priority 3: Use URL param address (the user's address we're minting for)
    if (address && typeof address === 'string' && address.startsWith('0x')) {
      // console.log(' [MINT] Falling back to URL param address:', address);
      return address;
    }
    
    console.error('[MINT] No valid EVM address found!');
    return undefined;
  }, [walletAddress, activeWallet?.address, address]);

  const handleMintClick = () => {
    // Handle mint action here
    console.log("Mint clicked");
  };

  const handleTryAgainClick = () => {
    // Handle try again action here
    console.log("Try again clicked");
  };

  // Show loading state while Privy initializes
  // if (!privyReady) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-[url('/gradient.png')] bg-cover bg-center">
  //       <div className="text-center">
  //         <div className="text-white text-xl mb-4 peridia-display"></div>
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <StewardMint
      backgroundImageUrl={assets.flowersBg}
      walletAddress={address}
      prepareData={prepareData}
      prepareLoading={prepLoading}
      prepareError={prepError}
      userEvmAddress={userEvmAddress}
      onMintClick={handleMintClick}
      onTryAgainClick={handleTryAgainClick}
    />
  );
}
