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
        <video
          src={"/assets/video/video.mp4"}
          autoPlay
          playsInline
          muted
          className="object-cover opacity-80"
          loop
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover", 
            display: "block",
          }}
      />
        {/* <Image
          src="/flowers-bg.png"
          alt="Flowers background"
          fill
          // sizes="100vw"
          className="object-cover opacity-80"
          priority
        /> */}
      </div>
      
      {/* Dark backdrop overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30 z-5"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        {/* Logo with animation - perfectly centered on screen */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Image
            src="/text.svg"
            alt="THE WAY OF FLOWERS"
            width={354}
            height={84}
            className="w-auto h-auto max-w-[300px] sm:max-w-[354px]"
            priority
            />
            <div className="bg-transparent peridia-display-light text-white text-xl text-center w-full mt-10">
              <p>by  CROSSLUCID.</p>
            </div>
            <div className="bg-transparent peridia-display-light text-white text-xl text-center w-full mt-24 -mb-36 scale-[0.8]">
              <p>a regenerative art project</p>
              <p>reimagining environmental art</p>
              <p>through living digital botanicals </p>
              <p>directly connected</p>
              <p>to real-world conservation</p>
            </div>
        </motion.div>
        
        {/* Wallet Connect Button with animation */}
        <WalletConnectButton
          onSuccess={handleSuccess}
          className="text-white text-lg hover:text-white lg:mt-[630px] mt-[750px] animate-bounce font-medium px-8 py-4 hover:bg-white/20 transition-colors bg-transparent"
        >
          Tap to Start
        </WalletConnectButton>
      </div>
    </div>
  );
}
