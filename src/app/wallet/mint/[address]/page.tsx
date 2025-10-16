"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import StewardMint from "@/components/wallet/StewardMint";
import { usePrivy } from "@privy-io/react-auth";

export default function MintPage() {
  const params = useParams();
  const { user, walletAddress, activeWallet } = useAuth();
  const { authenticated: privyAuthenticated } = usePrivy();
  const router = useRouter();
  const address = params.address as string;

  // Use the authenticated state from the Zustand store instead of Privy directly
  const authenticated = !!user && !!walletAddress;

  // Debug logging
  console.log('🔍 MintPage Debug:', {
    authenticated,
    privyAuthenticated,
    user: user ? 'exists' : 'null',
    userType: typeof user,
    walletAddress,
    walletAddressType: typeof walletAddress,
    activeWallet: activeWallet?.address || 'no active wallet',
    address
  });

  // Check if user is authenticated and address matches
  useEffect(() => {
    console.log('🔍 useEffect triggered:', { 
      authenticated, 
      privyAuthenticated, 
      user: !!user, 
      walletAddress,
      activeWallet: activeWallet?.address 
    });
    
    // Wait a bit for authentication state to stabilize
    const timer = setTimeout(() => {
      if (!authenticated || !user || !walletAddress || !address) {
        console.log('🔍 Redirecting to wallet - missing data');
        router.push("/wallet");
        return;
      }

      // Check if the wallet address matches the URL parameter
      if (walletAddress && address && walletAddress.toLowerCase() !== address.toLowerCase()) {
        console.log('❌ Address mismatch:', {
          walletAddress,
          urlAddress: address
        });
        router.push("/wallet");
        return;
      }
    }, 1000); // Wait 1 second for state to stabilize

    return () => clearTimeout(timer);
  }, [authenticated, privyAuthenticated, user, walletAddress, address, router, activeWallet]);

  // Show loading state while user data is being fetched
  if (!authenticated || !user || !walletAddress || !address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Final check if address matches (double-check before rendering)
  if (walletAddress && address && walletAddress.toLowerCase() !== address.toLowerCase()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Unauthorized access</div>
      </div>
    );
  }

  const handleMintClick = () => {
    // Handle mint action here
    console.log("Mint clicked");
  };

  const handleTryAgainClick = () => {
    // Handle try again action here
    console.log("Try again clicked");
  };

  return (
    <StewardMint
      backgroundImageUrl="/seeds/01__GRG.png"
      onMintClick={handleMintClick}
      onTryAgainClick={handleTryAgainClick}
    />
  );
}
