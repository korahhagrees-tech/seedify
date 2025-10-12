"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { assets } from "@/lib/assets";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-gray-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full border-2 border-dashed border-gray-400"></div>
          <div className="absolute top-40 right-8 w-24 h-24 rounded-full border border-gray-300"></div>
          <div className="absolute bottom-32 left-6 w-20 h-20 rounded-full border-2 border-dotted border-gray-400"></div>
          <div className="absolute bottom-20 right-12 w-16 h-16 rounded-full border border-gray-300"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <Image
            src="/text.svg"
            alt="THE WAY OF FLOWERS"
            width={280}
            height={70}
            className="w-auto h-auto max-w-[250px]"
            priority
          />
        </motion.div>

        {/* Main illustration - large placeholder image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-64 h-64 rounded-[40px] overflow-hidden mb-8 border-2 border-dashed border-gray-300"
        >
          <Image
            src="/seeds/01__GRG.png"
            alt=""
            fill
            className="object-cover opacity-60"
          />

          {/* Overlay with 404 */}
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-6xl font-bold text-gray-800 mb-2 peridia-display"
              >
                404
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="w-12 h-12 mx-auto rounded-full border-2 border-dotted border-gray-400 flex items-center justify-center"
              >
                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-xl text-gray-800 mb-3 peridia-display-light">
            This seed hasn&apos;t bloomed yet
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
            The path you&apos;re looking for seems to have wandered into
            uncharted garden territory.
          </p>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="space-y-4 w-full max-w-xs"
        >
          {/* Return to Garden button */}
          <Button
            onClick={() => router.push("/garden")}
            className="w-full rounded-full border-2 border-black text-black bg-white hover:bg-gray-50 py-6 text-lg peridia-display"
            variant="outline"
          >
            Return to Garden
          </Button>

          {/* Go back button */}
          <button
            onClick={() => router.back()}
            className="w-full py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors peridia-display-light"
          >
            Go Back
          </button>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        >
          <div className="text-xs text-gray-400 mb-2">
            Lost in the digital garden?
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </motion.div>

        {/* Floating seed emblems */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute top-24 right-8 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
        >
          <Image
            src={assets.glowers}
            alt=""
            width={20}
            height={20}
            className="opacity-50"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="absolute bottom-32 left-8 w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center"
        >
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        </motion.div>
      </div>
    </div>
  );
}
