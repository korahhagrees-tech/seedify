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
          loop
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          className="object-cover opacity-120"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            pointerEvents: "none",
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
      <div className="absolute inset-0 bg-black/40 z-5"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-8">
        {/* Logo with animation - positioned with top */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center -top-28 md:top-60 lg:top-30"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="relative left-0 right-auto top-20 lg:top-0 md:top-0">
            <Image
              src="/text.svg"
              alt="THE WAY OF FLOWERS"
              width={354}
              height={84}
              className="w-auto h-auto max-w-[300px] lg:max-w-[350px] md:max-w-[300px] mt-64 lg:mt-32 md:mt-4"
              priority
            />
            <div className="bg-transparent peridia-display-light text-white text-xl text-center w-full mt-6">
              <p>by CROSSLUCID.</p>
            </div>
          </div>
          <div className="bg-transparent peridia-display-light text-white text-xl text-center w-full mt-42 lg:mt-30 md:mt-36 text-[8px] lg:text-[12px] md:text-[12px] scale-[1.8] lg:scale-[1.0] md:scale-[0.9] relative left-0 right-auto top-4 lg:top-0 md:top-0">
            <p>a regenerative art project</p>
            <p className="text-nowrap">reimagining environmental art</p>
            <p className="text-nowrap">through living digital botanicals </p>
            <p>directly connected</p>
            <p>to real-world conservation</p>
          </div>
        </motion.div>

        {/* Wallet Connect Button with animation */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-5 lg:bottom-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <WalletConnectButton
            onSuccess={handleSuccess}
            className="text-white text-lg hover:text-white animate-bounce font-light px-8 py-4 hover:bg-white/20 transition-colors bg-transparent relative left-0 right-auto -top-14 lg:top-0 md:top-0"
          >
            Tap to Start
          </WalletConnectButton>
        </motion.div>
      </div>
    </div>
  );
}
