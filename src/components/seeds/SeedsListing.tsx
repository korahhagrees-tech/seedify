/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { useGlobalLogout } from "@/lib/auth/useGlobalLogout";
import { Seed } from "@/types/seed";
import { fetchGardenData } from "@/lib/api/seeds";
import SeedCard from "./SeedCard";
import GardenHeader from "../GardenHeader";

interface SeedsListingProps {
  onSeedClick?: (seed: Seed) => void;
  onProfileClick?: () => void;
}

export default function SeedsListing({
  onSeedClick,
  onProfileClick,
}: SeedsListingProps) {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { logout } = usePrivy();
  const globalLogout = useGlobalLogout();

  useEffect(() => {
    loadSeeds();
  }, []);

  // Detect scroll to change header text
  useEffect(() => {
    const handleScroll = () => {
      // Change text after scrolling more than 50px
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadSeeds = async () => {
    try {
      setError(null);
      const gardenData = await fetchGardenData();
      setSeeds(gardenData.seeds);
    } catch (err) {
      console.error("Error loading seeds:", err);
      setError("Failed to load seeds. Please try again.");
    }
  };

  const handleSeedClick = (seed: Seed) => {
    if (onSeedClick) {
      onSeedClick(seed);
    } else {
      console.log("Seed clicked:", seed);
    }
  };

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
    <div className="min-h-screen w-full bg-none">
      {/* Header */}
      <motion.div
        className="pt-4 pb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GardenHeader />
      </motion.div>

      {/* Page Title - Animated based on scroll */}
      <motion.div
        className="px-4 py-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.h1
            key={hasScrolled ? "scrolled" : "initial"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-nowrap scale-[0.8] lg:scale-[1.0] md:scale-[0.9] font-light text-gray-900 text-center -mt-7 lg:-mt-4 md:-mt-4 -mb-4"
          >
            {hasScrolled ? "CLICK ON THE SEED YOU WISH TO EVOLVE" : "WELCOME TO THE GARDEN"}
          </motion.h1>
        </AnimatePresence>
      </motion.div>

      {/* Seeds Grid */}
      <motion.div
        className="px-4 pb-4 space-y-2 lg:space-y-8 md:space-y-8 -mt-10 lg:-mt-8 md:-mt-8 scale-[0.95]"
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
          <div className="text-center py-12 mb-8">
            <p className="text-gray-500">No seeds found in the garden.</p>
          </div>
        )}
      </motion.div>

      {/* Disconnect Button at Bottom */}
      <motion.div
        className="px-4 pb-6 -mt-22 lg:-mt-22 md:-mt-22"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Button
          variant="ghost"
          onClick={globalLogout}
          className="w-full text-gray-600 underline hover:text-gray-800 -mt-16 lg:-mt-22 md:-mt-22"
        >
          Disconnect
        </Button>
      </motion.div>
    </div>
  );
}
