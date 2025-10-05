"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePrivy, useLogin } from '@privy-io/react-auth';

interface WalletConnectButtonProps {
  onSuccess?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function WalletConnectButton({ 
  onSuccess, 
  className,
  children 
}: WalletConnectButtonProps) {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount }) => {
      console.log('User logged in successfully', user);
      console.log('Is new user:', isNewUser);
      console.log('Was already authenticated:', wasAlreadyAuthenticated);
      console.log('Login method:', loginMethod);
      console.log('Login account:', loginAccount);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error('Login failed', error);
    }
  });

  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  const handleClick = () => {
    if (!disableLogin) {
      login();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1 }}
    >
      <Button
        variant="ghost"
        size="lg"
        onClick={handleClick}
        disabled={disableLogin}
        className={`text-white text-lg font-medium px-8 py-4 hover:bg-white/20 transition-colors peridia-display ${className}`}
      >
        {children || (authenticated ? 'Connected' : 'Tap to Start')}
      </Button>
    </motion.div>
  );
}
