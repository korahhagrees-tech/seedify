/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useRouter } from "next/navigation";
import GardenHeader from "@/components/GardenHeader";
import SeedbedCardStats, { SeedbedCardStats2 } from "@/components/seeds/SeedbedCardStats";

export default function About() {
  const router = useRouter();
  
  // Use seed 1 data for the about page

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-white">
      <GardenHeader />
      <SeedbedCardStats state="frame1" />
      {/* <SeedbedCardStats state="frame2" /> 
      <SeedbedCardStats2 /> */}
    </div>
  );
}


