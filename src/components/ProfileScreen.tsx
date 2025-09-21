"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";

interface ProfileScreenProps {
  onBack: () => void;
}

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { user, logout } = usePrivy();

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header - Same as seeds listing */}
      <motion.div 
        className="flex items-center justify-between px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left icon - Back to Garden */}
        <button 
          onClick={onBack}
          className="w-10 h-10 flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/Seedbed Button.svg"
            alt="Back to Garden"
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
        
        {/* Right icon - Profile Button (same as seeds listing) */}
        <button 
          className="w-10 h-10 flex-shrink-0 opacity-60"
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
      
      {/* Profile Content */}
      <motion.div 
        className="px-6 py-4 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">PROFILE</h1>
        
        {user && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
            
            {user.wallet && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Wallet Address</label>
                  <p className="text-sm text-gray-900 font-mono">
                    {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Network</label>
                  <p className="text-sm text-gray-900">Ethereum</p>
                </div>
              </div>
            )}
            
            {user.email && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-sm text-gray-900">{user.email.address}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Disconnect Button */}
        <motion.div 
          className="pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => logout()}
            className="w-full text-gray-600 underline hover:text-gray-800"
          >
            Disconnect
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
