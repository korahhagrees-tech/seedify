"use client";

import React from "react";

interface MobileViewProviderProps {
  children: React.ReactNode;
}

/**
 * Constrains the app to a centered mobile viewport on all screens.
 * - Fixed max width similar to typical mobile width
 * - Full-height canvas with neutral background
 * - Prevents horizontal scroll bleed
 */
export default function MobileViewProvider({ children }: MobileViewProviderProps) {
  return (
    <div className="min-h-screen w-full bg-white lg:bg-gray-100 mx-auto flex justify-center">
      <div className="relative min-h-screen w-full bg-none max-w-md">
        {children}
      </div>
    </div>
  );
}


