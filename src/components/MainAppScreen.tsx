import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface MainAppScreenProps {
  onSeedbedClick: () => void;
  onProfileClick: () => void;
}

export default function MainAppScreen({ onSeedbedClick, onProfileClick }: MainAppScreenProps) {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Left icon - Profile */}
        <motion.button
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src="/Profile Button.svg"
            alt="Profile"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </motion.button>
        
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
        
        {/* Right icon - Seedbed */}
        <motion.button
          onClick={onSeedbedClick}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src="/Seedbed Button.svg"
            alt="Seedbed"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </motion.button>
      </motion.div>
      
      {/* Main content */}
      <div className="px-6 pb-6">
        {/* Main image card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src="/first-seed.png"
                  alt="Seed 01"
                  width={400}
                  height={300}
                  className="w-full h-auto"
                />
                {/* Seed label */}
                <motion.div 
                  className="absolute top-4 left-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    SEED 01
                  </span>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Info cards */}
        <motion.div 
          className="grid grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">RAISED</div>
                <div className="text-lg font-bold text-gray-900">€29,752</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">SEEDER</div>
                <div className="text-lg font-bold text-gray-900">&lt;user&gt;</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-1">ACTIONS</div>
                <div className="text-lg font-bold text-gray-900">643</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
