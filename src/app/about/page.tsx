"use client"

import InfoModal from "@/components/InfoModal"
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-white">
      <InfoModal open={true} onClose={handleClose} />
    </div>
  );
}
