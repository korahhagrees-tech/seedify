"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useGlobalLogout } from '@/lib/auth/useGlobalLogout';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface UserProfileProps {
  className?: string;
}

export default function UserProfile({ className }: UserProfileProps) {
  const { ready, authenticated, user } = usePrivy();
  const globalLogout = useGlobalLogout();

  if (!ready) {
    return (
      <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    await globalLogout();
  };

  // Get user's wallet address if available
  const wallet = user.wallet;
  const address = wallet?.address;
  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected';

  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
        {displayAddress.charAt(0).toUpperCase()}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-xs text-gray-600 hover:text-gray-800"
      >
        Disconnect
      </Button>
    </motion.div>
  );
}
