"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { Seed } from "@/types/seed";
import { fetchGardenData } from "@/lib/api/seeds";
import SeedCard from "./SeedCard";

interface SeedsListingProps {
  onSeedClick?: (seed: Seed) => void;
  onProfileClick?: () => void;
}

export default function SeedsListing({ onSeedClick, onProfileClick }: SeedsListingProps) {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = usePrivy();

  useEffect(() => {
    loadSeeds();
  }, []);

  const loadSeeds = async () => {
    try {
      setLoading(true);
      setError(null);
      const gardenData = await fetchGardenData();
      setSeeds(gardenData.seeds);
    } catch (err) {
      console.error('Error loading seeds:', err);
      setError('Failed to load seeds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedClick = (seed: Seed) => {
    if (onSeedClick) {
      onSeedClick(seed);
    } else {
      console.log('Seed clicked:', seed);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading garden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadSeeds}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header - No background, just on the page */}
      <motion.div 
        className="flex items-center justify-between px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left icon - Seedbed Button */}
        <button 
          onClick={() => window.location.href = '/'}
          className="w-10 h-10 flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/Seedbed Button.svg"
            alt="Seedbed"
            width={40}
            height={40}
            className="w-full h-full"
          />
        </button>
        
        {/* Center logo */}
        <div className="flex-1 flex justify-center">
          <Image
            src="/test-pink.svg"
            alt="THE WAY OF FLOWERS"
            width={200}
            height={48}
            className="w-auto h-auto max-w-[200px]"
          />
        </div>
        
        {/* Right icon - Profile Button */}
        <button 
          onClick={onProfileClick}
          className="w-10 h-10 flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/Profile Button.svg"
            alt="Profile"
            width={40}
            height={40}
            className="w-full h-full"
          />
        </button>
      </motion.div>
      
      {/* Page Title */}
      <motion.div 
        className="px-6 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">THE GARDEN</h1>
      </motion.div>
      
      {/* Seeds Grid */}
      <motion.div 
        className="px-6 pb-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <AnimatePresence>
          {seeds.map((seed, index) => (
            <SeedCard
              key={seed.id}
              seed={seed}
              index={index}
              onClick={() => handleSeedClick(seed)}
            />
          ))}
        </AnimatePresence>
        
        {seeds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No seeds found in the garden.</p>
          </div>
        )}
      </motion.div>
      
      {/* Disconnect Button at Bottom */}
      <motion.div 
        className="px-6 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Button 
          variant="ghost" 
          onClick={() => logout()}
          className="w-full text-gray-600 underline hover:text-gray-800"
        >
          Disconnect
        </Button>
      </motion.div>
    </div>
  );
}
