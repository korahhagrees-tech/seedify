"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import StewardMint from "@/components/wallet/StewardMint";
import { usePrivy } from "@privy-io/react-auth";

export default function MintPage() {
  const params = useParams();
  const { user } = useAuth();
  const { authenticated } = usePrivy();
  const router = useRouter();
  const address = params.address as string;

  // Check if user is authenticated and address matches
  useEffect(() => {
    if (!authenticated || !user) {
      router.push('/wallet');
      return;
    }

    // Get the connected wallet address
    const connectedAddress = user.wallet?.address;
    if (!connectedAddress || connectedAddress.toLowerCase() !== address.toLowerCase()) {
      router.push('/wallet');
      return;
    }
  }, [authenticated, user, address, router]);

  // Show loading while checking authentication
  if (!authenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Check if address matches
  const connectedAddress = user.wallet?.address;
  if (!connectedAddress || connectedAddress.toLowerCase() !== address.toLowerCase()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Unauthorized access</div>
      </div>
    );
  }

  const handleMintClick = () => {
    // Handle mint action here
    console.log('Mint clicked');
  };

  const handleTryAgainClick = () => {
    // Handle try again action here
    console.log('Try again clicked');
  };

  return (
    <StewardMint
      backgroundImageUrl="/seeds/01__GRG.png"
      onMintClick={handleMintClick}
      onTryAgainClick={handleTryAgainClick}
    />
  );
}
