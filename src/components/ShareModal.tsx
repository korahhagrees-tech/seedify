"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { assets } from "@/lib/assets";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  beneficiaryName?: string;
  beneficiaryCode?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  imageUrl,
  beneficiaryName,
  beneficiaryCode,
}: ShareModalProps) {
  const [canUseNativeShare, setCanUseNativeShare] = useState(false);

  useEffect(() => {
    // Check if native share is available
    setCanUseNativeShare(
      typeof navigator !== 'undefined' && 
      typeof navigator.share === 'function'
    );
  }, []);
  
  // Download image
  const handleDownload = async () => {
    try {
      // Convert base64 to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `way-of-flowers-snapshot-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image');
    }
  };

  // Share using native share API (mobile) or copy to clipboard (desktop)
  const handleShare = async () => {
    try {
      // Check if native share is available (mobile)
      if (navigator.share && typeof navigator.canShare === 'function') {
        // Convert base64 to blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'way-of-flowers-snapshot.png', { type: 'image/png' });
        
        // Check if we can share this file
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Way of Flowers Snapshot',
            text: `Check out my contribution to ${beneficiaryName || 'regenerative ecosystem'}!`,
            files: [file],
          });
          
          toast.success('Shared successfully!');
        } else {
          // Fallback if file sharing not supported
          const response2 = await fetch(imageUrl);
          const blob2 = await response2.blob();
          
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob2
            })
          ]);
          
          toast.success('Image copied to clipboard!');
        }
      } else {
        // Fallback for desktop: copy image to clipboard
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        
        toast.success('Image copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast.error('Failed to share image');
    }
  };

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Copy link failed:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-[40px] border-2 border-dotted border-black p-6 max-w-md w-full mx-auto relative shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-10"
              >
                <span className="text-black text-2xl font-bold">×</span>
              </button>

              {/* Header */}
              <h2 className="text-2xl text-black text-center mb-6 peridia-display">
                Share Your Artwork
              </h2>

              {/* Image Preview */}
              <div className="relative w-full h-64 rounded-[30px] overflow-hidden border-2 border-dashed border-black/70 bg-gray-100 mb-6">
                <Image
                  src={imageUrl || "https://d17wy07434ngk.cloudfront.net/seed1/seed.png"}
                  alt="Snapshot artwork"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://d17wy07434ngk.cloudfront.net/seed1/seed.png";
                  }}
                />
              </div>

              {/* Beneficiary Info */}
              {beneficiaryName && (
                <div className="text-center mb-6">
                  <p className="text-sm text-black/70 favorit-mono uppercase">
                    Supporting {beneficiaryName}
                  </p>
                  {beneficiaryCode && (
                    <p className="text-xs text-black/50 favorit-mono uppercase mt-1">
                      {beneficiaryCode}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="w-full px-6 py-3 rounded-full border-2 border-dotted border-black text-black text-lg font-medium bg-purple-200 hover:bg-purple-300 transition-colors peridia-display"
                >
                  Download Image
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="w-full px-6 py-3 rounded-full border-2 border-dotted border-black text-black text-lg font-medium bg-white hover:bg-gray-100 transition-colors peridia-display"
                >
                  {canUseNativeShare ? 'Share Image' : 'Copy to Clipboard'}
                </button>

                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="w-full px-6 py-3 rounded-full border-1 border-black/40 text-black text-sm font-light bg-gray-100 hover:bg-gray-200 transition-colors favorit-mono"
                >
                  COPY LINK
                </button>
              </div>

              {/* Footer Text */}
              <div className="text-center mt-6 mx-auto">
                <Image
                  src={assets.textBlack}
                  alt="Footer text"
                  width={100}
                  height={100}
                  className="w-auto h-auto mx-auto scale-[0.8] -mb-6"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

