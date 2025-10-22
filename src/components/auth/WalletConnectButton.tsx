/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePrivy, useLogin } from '@privy-io/react-auth';
import { useState } from 'react';

interface WalletConnectButtonProps {
  onSuccess?: () => void;
  onError?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function WalletConnectButton({ 
  onSuccess, 
  onError,
  className,
  children 
}: WalletConnectButtonProps) {
  const { ready, authenticated } = usePrivy();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const { login } = useLogin({
    onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount }) => {
      console.log('User logged in successfully', user);
      console.log('Is new user:', isNewUser);
      console.log('Was already authenticated:', wasAlreadyAuthenticated);
      console.log('Login method:', loginMethod);
      console.log('Login account:', loginAccount);
      
      // Reset retry state on success
      setRetryCount(0);
      setIsRetrying(false);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error('Login failed', error);
      setIsRetrying(false);
      
      // Handle error with retry logic
      handleLoginError(error);
    }
  });

  // Error handling with retry logic
  const handleLoginError = (error: any) => {
    console.error('Login error details:', error);
    
    // Call the error callback if provided
    if (onError) {
      onError();
    }
    
    // Retry logic: try up to 3 times
    if (retryCount < 3) {
      console.log(`Retrying login attempt ${retryCount + 1}/3...`);
      setRetryCount(prev => prev + 1);
      setIsRetrying(true);
      
      // Retry after a short delay
      setTimeout(() => {
        if (ready && !authenticated) {
          login();
        }
      }, 1000 * (retryCount + 1)); // Exponential backoff: 1s, 2s, 3s
    } else {
      // Max retries reached, refresh the page
      console.log('Max retries reached, refreshing page...');
      window.location.reload();
    }
  };

  // Only disable login when Privy is not ready or when retrying
  const disableLogin = !ready || isRetrying;

  const handleClick = () => {
    if (ready && !authenticated && !isRetrying) {
      setRetryCount(0); // Reset retry count on manual click
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
        className={`text-white text-lg font-light px-8 py-4 hover:bg-white/20 transition-colors peridia-display ${className}`}
      >
        {!ready 
          ? 'Loading...' 
          : isRetrying 
            ? `Retrying... (${retryCount}/3)`
            : children || (authenticated ? 'Connected' : 'Tap to Start')
        }
      </Button>
    </motion.div>
  );
}
