import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Seed } from "@/types/seed";

interface SeedbedPullUpProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSeed?: Seed | null;
}

export default function SeedbedPullUp({ isOpen, onClose, selectedSeed }: SeedbedPullUpProps) {
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
        className={`fixed bottom-0 left-0 right-0 bg-gray-200 rounded-t-3xl z-50 transition-transform duration-300 ease-out ${
          isDragging ? 'transition-none' : ''
        }`}
        style={{
          transform: `translateY(${translateY}%)`,
          height: '70vh'
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
        
        {/* Header */}
        <div className="px-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            THE SEEDBED
          </h2>
          <p className="text-sm text-gray-600 text-center mt-1">
            Pull up to explore the seedbed
          </p>
        </div>
        
        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto h-full">
          {/* Network diagram placeholder */}
          <Card className="mb-4">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Network nodes */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full border-2 border-dashed border-gray-400"></div>
                    <span className="text-sm font-medium text-gray-700">Globo Habitat Bank</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full border-2 border-dashed border-gray-400"></div>
                    <span className="text-sm font-medium text-gray-700">Walkers Reserve</span>
                  </div>
                </div>
                
                {/* Connection lines */}
                <div className="ml-4">
                  <div className="w-px h-8 bg-gray-300 ml-4"></div>
                  <div className="w-16 h-px bg-gray-300 ml-4"></div>
                </div>
                
                {/* Additional nodes */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-dashed border-gray-400"></div>
                    <span className="text-xs text-gray-600">Node A</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-white rounded-full border-2 border-dashed border-gray-400"></div>
                    <span className="text-xs text-gray-600">Node B</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Additional content */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Seed Network</h3>
                <p className="text-sm text-gray-600">
                  Explore the interconnected network of seed habitats and conservation areas.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Conservation Status</h3>
                <p className="text-sm text-gray-600">
                  Track the health and growth of various seed populations across different regions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
