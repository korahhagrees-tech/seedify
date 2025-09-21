"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import SeedsListing from "@/components/seeds/SeedsListing";
import SeedDetailPage from "@/components/SeedDetailPage";
import ProfileScreen from "@/components/ProfileScreen";
import SeedbedPullUp from "@/components/SeedbedPullUp";
import AuthProvider from "@/components/auth/AuthProvider";
import { Seed } from "@/types/seed";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'garden' | 'seed-detail' | 'profile'>('splash');
  const [isSeedbedOpen, setIsSeedbedOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState<Seed | null>(null);

  useEffect(() => {
    // Ensure the component is fully loaded before showing content
    setIsLoaded(true);
  }, []);

  const handleStart = () => {
    setCurrentScreen('garden');
  };

  const handleSeedClick = (seed: Seed) => {
    setSelectedSeed(seed);
    setCurrentScreen('seed-detail');
  };

  const handleSeedbedClose = () => {
    setIsSeedbedOpen(false);
    setSelectedSeed(null);
  };

  const handleProfileClick = () => {
    setCurrentScreen('profile');
  };

  const handleBackToGarden = () => {
    setCurrentScreen('garden');
  };

  const handleOpenSeedbed = () => {
    setIsSeedbedOpen(true);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full max-w-md mx-auto bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen w-full max-w-md mx-auto bg-white">
        <AnimatePresence mode="wait">
          {currentScreen === 'splash' && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SplashScreen onStart={handleStart} />
            </motion.div>
          )}
          
          {currentScreen === 'garden' && (
            <motion.div
              key="garden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <SeedsListing 
                onSeedClick={handleSeedClick} 
                onProfileClick={handleProfileClick}
              />
            </motion.div>
          )}
          
          {currentScreen === 'seed-detail' && selectedSeed && (
            <motion.div
              key="seed-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <SeedDetailPage 
                seed={selectedSeed}
                onBack={handleBackToGarden}
                onProfileClick={handleProfileClick}
                onPlantSeed={handleOpenSeedbed}
              />
            </motion.div>
          )}
          
          {currentScreen === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ProfileScreen onBack={handleBackToGarden} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <SeedbedPullUp 
          isOpen={isSeedbedOpen}
          onClose={handleSeedbedClose}
          selectedSeed={selectedSeed}
        />
      </div>
    </AuthProvider>
  );
}
