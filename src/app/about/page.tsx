"use client"

import InfoModal from "@/components/InfoModal";
import { useRouter } from "next/navigation";
import EcosystemProjectCard from "@/components/EcosystemProjectCard";

export default function About() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-white">
      <EcosystemProjectCard 
        backgroundImageUrl={"/Project 01.svg"} 
        title={"patrick is kinda a ggod teacher, hence he should buy me ice cream"} 
        subtitle={"I think hes gonna buy me ice cream"} 
        areaText={"Patrick buys Lydia ice cream"} 
        shortText={"ice cream is  very yummy and i like it so much"}
        extendedText={"vanilla, chocolate ice cream hit different when its 100 degrees outside, that is why patrick is getting me two when we meet next,hes giving me a lesson on frontend which is so coool. Thanks P :)"} 
      />
      {/* <InfoModal open={true} onClose={handleClose} /> */}
    </div>
  );
}


