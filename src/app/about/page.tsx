/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import GardenHeader from "@/components/GardenHeader";
import SeedbedCardStats, { SeedbedCardStats2 } from "@/components/seeds/SeedbedCardStats";
import RootShapeArea from "@/components/wallet/RootShapeArea";
import InfoModal from "@/components/InfoModal";
import StoryPanel from "@/components/StoryPanel";
import { assets } from "@/lib/assets";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function About() {
  const router = useRouter();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"substrate" | "credits" | "tnc">("substrate");
  const [showStoryPanel, setShowStoryPanel] = useState(false);
  
  // Use seed 1 data for the about page

  const handleClose = () => {
    router.push("/");
  };

  const handleSubstrateClick = () => {
    setIsInfoModalOpen(true);
  };

  const handleInfoModalClose = () => {
    setIsInfoModalOpen(false);
  };

  const handleTabClick = (tab: "substrate" | "credits" | "tnc") => {
    setActiveTab(tab);
  };

  const handleStoryClick = () => {
    setShowStoryPanel(true);
  };

  const handleBackFromStory = () => {
    setShowStoryPanel(false);
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-white relative">
      <GardenHeader />
      
      {/* Main content with dotted border */}
      <div className="px-4 pb-38">
        <div className="border-2 border-dotted border-black rounded-3xl p-6 mb-8">
          {/* Tab buttons */}
          <div className="flex gap-2 mb-8 scale-[1.6] peridia-display-light justify-center">
            <button
              onClick={() => handleTabClick("substrate")}
              className={`px-2 py-2 rounded-full border border-black text-sm ${activeTab === "substrate" ? "bg-gray-200" : "bg-white"}`}
            >
              Substrate
            </button>
            <button
              onClick={() => handleTabClick("credits")}
              className={`px-4 py-2 rounded-full border border-black text-sm ${activeTab === "credits" ? "bg-gray-200" : "bg-white"}`}
            >
              Credits
            </button>
            <button
              onClick={() => handleTabClick("tnc")}
              className={`px-4 py-2 rounded-full border border-black text-sm ${activeTab === "tnc" ? "bg-gray-200" : "bg-white"}`}
            >
              T<span className="text-xs">&</span>C
            </button>
          </div>

          {/* Hamburger icon */}
          <div className="flex justify-center mb-6">
            {/* <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center">
              <div className="space-y-1">
                <Image src={assets.audioPlay} alt="Hamburger Icon" width={24} height={24} />
              </div>
            </div> */}
          </div>

          <AnimatePresence mode="wait">
            {showStoryPanel ? (
              <motion.div
                key="story"
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3 }}
              >
                <StoryPanel
                  text="The Way of Flowers represents a fundamental reimagining of environmental art through dynamic digital botanical compositions that maintain living connections to real-world conservation efforts. Collectors become original seeders, acquiring seeds that are collectively nurtured through their community and its engagement with specific ecosystem projects, creating uniquely evolving artworks that form a digital permaculture garden cultivated through ecosystem nurturing and grown by community stewardship."
                  title="The Story"
                  author="CROSSLUCID"
                  onBack={handleBackFromStory}
                />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 0.3 }}
                className="text-sm leading-relaxed space-y-4"
              >
            {activeTab === "substrate" && (
              <>
                <div className="text-center mb-3 -mt-8">
                  {/* <div className="text-2xl">Substrate</div> */}
                  <div className="mx-auto my-2 w-10 h-10 rounded-full border border-black flex items-center justify-center">
                    <Image src="/audio-play.svg" alt="Audio" width={20} height={20} />
                  </div>
                </div>
                <p>
                  <span className="peridia-display-light">The Way of Flowers</span> represents a fundamental reimagining of environmental art through dynamic digital botanical compositions that maintain living connections to real-world conservation efforts. Collectors become original seeders, acquiring seeds that are collectively nurtured through their community and its engagement with specific ecosystem projects, creating uniquely evolving artworks that form a digital permaculture garden cultivated through ecosystem nurturing and grown by community stewardship.
                </p>
                <p>
                  When participants engage with verified biodiversity projects, their botanical compositions evolve in response, incorporating traits specific to those initiatives. Through the unique forking mechanism, each contribution creates individual snapshot artworks—morphological plant representations of participants' unique conservation actions—while simultaneously shaping the collective evolving digital botanical that continues its growth, creating a fascinating tension between permanence and change where individual journeys crystallize into permanent beauty.
                </p>
                <p>
                  The aesthetic language emerges from a generative morphological art engine trained on botanical datasets and responsive to verified conservation data, establishing direct connections between artistic evolution and ecological action.
                </p>
              </>
            )}
            
            {activeTab === "credits" && (
              <>
                <div className="text-center mb-3 -mt-8 peridia-display-light">
                  <div className="text-3xl leading-relaxed tracking-wider">Credits</div>
                </div>
                <p>
                  <span className="peridia-display-light">CROSSLUCID</span> is an artist collective (est. 2018) that engages in highly collaborative cross-disciplinary projects in co-evolution with technology. Their work and research converges around the exploration of the self as a network; speculative post-humanism; intimacy and the potential for pleasurable actualisation through the digital sphere, and the re-imagination of our alliances with technology seen as part of a sympoietic biosphere and universal post-material consciousness. Through explorations spanning filmmaking, poetic Artificial Intelligence, multi-layered techniques of collage, assemblage and experience-led interventions they create scenarios and build experiential formats that instigate prototyping and rehearsing potential futures and progressing 'metamodern' values. Their practice is process-driven with a set of enquiries and intuitive leaps of knowledge becoming long-term projects that materialise through ongoing iteration and experimentation to share findings with a deepening understanding.
                </p>
                <p className="text-left">
                  croslucid.zone<br />
                  create@crosslucid.zone
                </p>
                <p className="text-left">
                  ~~~<br />
                  <span className="peridia-display-light">The Way of Flowers</span> is a collaborative creation that brings together artists, technologists, environmental scientists, and conservationists from around the world.
                </p>
              </>
            )}
            
            {activeTab === "tnc" && (
              <>
                <div className="text-center mb-3 -mt-8">
                  <div className="text-3xl peridia-display-light tracking-wider">Disclaimer</div>
                </div>
                <p>
                  1. DEFINITIONS AND GLOSSARY<br />
                  The following terms and definitions apply to this Agreement:<br />
                  1.1 Core Concepts<br />
                  &quot;Way of Flowers&quot; means an artistic project focused on ecological stewardship that explores the relationship between biodiversity, conservation, and digital art through a generative art system.<br />
                  &quot;CROSSLUCID&quot; means the creator and owner of the Way of Flowers project, partially licensed by W&apos;A&apos;Y&apos;S, a Swiss association registered at c/o Dan Stein &amp; Impact Hub, Rue Fendt 1, 1201 Geneva, Switzerland.<br />
                  &quot;Seed&quot; / &quot;Dynamic NFT&quot; means a living, evolving digital botanical artwork that responds to collective community activity and environmental data. Each Seed is owned by a Seed Steward and transforms based on community contributions to verified regenerative projects. The artwork&apos;s morphology evolves as participants engage with its associated ecosystem projects, creating a unique visual narrative of collective environmental impact.<br />
                  &quot;Snapshot&quot; / &quot;Static NFT&quot; means a permanent capture of a specific evolutionary moment in a Seed&apos;s development. This represents an individual conservation contribution by Community Member.<br />
                  &quot;Seedbed Ecosystem&quot; means the curated collection of verified regenerative initiatives that form a Seed&apos;s &quot;DNA.&quot; Initially comprising 4 projects selected by the Seed Steward from a curated pool of 8 verified regenerative initiatives, this ecosystem expands over time as the art project progresses.
                </p>
              </>
            )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed Root Shape Area with glass effect */}
      <div className="fixed -bottom-1 left-0 right-0 z-30 pt-4 scale-[1.0]">
        <div className="max-w-md mx-auto px-4">
          <RootShapeArea
            onSubstrate={handleSubstrateClick}
            onStory={handleStoryClick}
            showGlassEffect={true}
            showStoryButton={true}
          />
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal
        open={isInfoModalOpen}
        onClose={handleInfoModalClose}
      />
    </div>
  );
}


