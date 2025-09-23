import Image from "next/image";
import { motion } from "framer-motion";
import WalletConnectButton from "@/components/auth/WalletConnectButton";
import { useRouter } from "next/navigation";

interface SplashScreenProps {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  const router = useRouter();
  const handleSuccess = () => {
    if (onStart) onStart();
    router.push("/garden");
  };
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <Image
          src="/gradient.png"
          alt="Background gradient"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Flowers background */}
      <div className="absolute inset-0">
        <Image
          src="/flowers-bg.png"
          alt="Flowers background"
          fill
          // sizes="100vw"
          className="object-cover opacity-80"
          priority
        />
      </div>
      
      {/* Dark backdrop overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30 z-5"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        {/* Logo with animation */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Image
            src="/text.svg"
            alt="THE WAY OF FLOWERS"
            width={354}
            height={84}
            className="w-auto h-auto max-w-[280px] sm:max-w-[354px]"
            priority
          />
        </motion.div>
        
        {/* Wallet Connect Button with animation */}
        <WalletConnectButton
          onSuccess={handleSuccess}
          className="text-white text-lg hover:text-white mt-[450px] animate-bounce font-medium px-8 py-4 hover:bg-white/20 transition-colors backdrop-blur-sm"
        >
          Tap to Start
        </WalletConnectButton>
      </div>
    </div>
  );
}
