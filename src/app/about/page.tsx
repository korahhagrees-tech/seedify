"use client"

import InfoModal from "@/components/InfoModal";
import { useRouter } from "next/navigation";
import GardenHeader from "@/components/GardenHeader";


export default function About() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-white">
      <GardenHeader />
      <div className="scale-[0.85]">
        <InfoModal open={true} onClose={handleClose} />
      </div>
    </div>
  );
}


