import { useState, useEffect } from "react";
import Image from "next/image";
import { Seed } from "@/types/seed";

interface SeedbedPullUpProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSeed?: Seed | null;
  seedbedImageSrc: string; // e.g. "/Seedbed.svg"
}

export default function SeedbedPullUp({ isOpen, onClose, selectedSeed, seedbedImageSrc }: SeedbedPullUpProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setTranslateY(0);
    } else {
      setTranslateY(100);
    }
  }, [isOpen]);

  // Don't render if not open to prevent initial flash
  if (!isOpen) {
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    const newTranslateY = Math.max(0, Math.min(100, translateY + deltaY));
    setTranslateY(newTranslateY);
    setCurrentY(e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    const newTranslateY = Math.max(0, Math.min(100, translateY + deltaY));
    setTranslateY(newTranslateY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (translateY > 30) {
      onClose();
    } else {
      setTranslateY(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (translateY > 30) {
      onClose();
    } else {
      setTranslateY(0);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Pull-up panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-transparent z-50 transition-transform duration-300 ease-out ${
          isDragging ? 'transition-none' : ''
        }`}
        style={{
          transform: `translateY(${translateY}%)`,
          height: '80vh'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 bg-gray-400 rounded-full cursor-pointer" />
        </div>

        {/* Dark shade card */}
        <div className="px-4 h-full">
          <div className="h-full w-full bg-gray-300 rounded-t-3xl p-3 border-2 border-black/20">
            {/* White card */}
            <div className="h-full w-full bg-white rounded-3xl p-4 overflow-hidden border-2 border-black/20">
              {/* Seedbed image */}
              <div className="relative w-full h-full">
                <Image src={seedbedImageSrc} alt="Seedbed" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
