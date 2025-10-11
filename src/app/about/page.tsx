/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import GardenHeader from "@/components/GardenHeader";
import RootShapeArea from "@/components/wallet/RootShapeArea";
import InfoModal from "@/components/InfoModal";
import StoryPanel from "@/components/StoryPanel"; 
import WalletModal from "@/components/wallet/WalletModal";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getSeedStory } from "@/lib/data/componentData";
import { usePrivy } from "@privy-io/react-auth";

export default function About() {
  const router = useRouter();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"substrate" | "credits" | "tnc">("substrate");
  const [showStoryPanel, setShowStoryPanel] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { logout } = usePrivy();
  
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

  const handleWallet = () => {
    setIsWalletModalOpen(true);
  };

  const handleWalletModalClose = () => {
    setIsWalletModalOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleAddFunds = () => {
    // Handle add funds logic
    console.log("Add funds clicked");
  };

  const handleExportKey = () => {
    // Handle export key logic
    console.log("Export key clicked");
  };

  const handleSwitchWallet = () => {
    // Handle switch wallet logic
    console.log("Switch wallet clicked");
  };

  const handlePrivyHome = () => {
    // Handle privy home logic
    router.push("/garden");
  };

  return (
    <div className="min-h-screen w-full max-w-sm mx-auto bg-none relative px-3">
      <div className="pt-2 pb-2">
        <GardenHeader />
      </div>
      
      {/* Main content with dotted border */}
      <div className="pb-32 w-full">
        <div className="border-2 border-dotted border-black rounded-[50px] p-4 mb-6">
          {/* Tab buttons */}
          <div className="flex gap-6 mb-6 peridia-display-light justify-center">
            <button
              onClick={() => handleTabClick("substrate")}
              className={`px-5 py-1 scale-[1.2] rounded-full border border-black text-xs ${activeTab === "substrate" ? "bg-gray-200" : "bg-white"}`}
            >
              Substrate
            </button>
            <button
              onClick={() => handleTabClick("credits")}
              className={`px-5 py-1 scale-[1.2] rounded-full border border-black text-xs ${activeTab === "credits" ? "bg-gray-200" : "bg-white"}`}
            >
              Credits
            </button>
            <button
              onClick={() => handleTabClick("tnc")}
              className={`px-5 py-1 scale-[1.2] rounded-full border border-black text-xs ${activeTab === "tnc" ? "bg-gray-200" : "bg-white"}`}
            >
              T<span className="text-xs">&</span>C
            </button>
          </div>

          <AnimatePresence mode="wait">
            {showStoryPanel ? (
              <motion.div
                key="story"
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3 }}
                className="scale-[1.0]"
              >
                <StoryPanel
                  text={getSeedStory("1").story}
                  title={getSeedStory("1").title}
                  author={getSeedStory("1").author}
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
                className="text-xs leading-relaxed space-y-3"
              >
            {activeTab === "substrate" && (
              <>
                <div className="text-center mb-2">
                  <div className="mx-auto my-1 w-8 h-8 rounded-full border border-black flex items-center justify-center">
                    <Image src="/audio-play.svg" alt="Audio" width={14} height={14} />
                  </div>
                </div>
                <p className="text-xs leading-relaxed">
                  <span className="peridia-display-light">The Way of Flowers</span> represents a fundamental reimagining of environmental art through dynamic digital botanical compositions that maintain living connections to real-world conservation efforts. Collectors become original seeders, acquiring seeds that are collectively nurtured through their community and its engagement with specific ecosystem projects, creating uniquely evolving artworks that form a digital permaculture garden cultivated through ecosystem nurturing and grown by community stewardship.
                </p>
                <p className="text-xs leading-relaxed">
                  {`When participants engage with verified biodiversity projects, their botanical compositions evolve in response, incorporating traits specific to those initiatives. Through the unique forking mechanism, each contribution creates individual snapshot artworks—morphological plant representations of participants' unique conservation actions—while simultaneously shaping the collective evolving digital botanical that continues its growth, creating a fascinating tension between permanence and change where individual journeys crystallize into permanent beauty.`}
                </p>
                <p className="text-xs leading-relaxed">
                  The aesthetic language emerges from a generative morphological art engine trained on botanical datasets and responsive to verified conservation data, establishing direct connections between artistic evolution and ecological action.
                </p>
              </>
            )}
            
            {activeTab === "credits" && (
              <>
                <div className="text-center mb-2 peridia-display-light">
                  <div className="text-xl leading-relaxed tracking-wider">Credits</div>
                </div>
                <p className="text-xs leading-relaxed">
                  <span className="peridia-display-light">CROSSLUCID</span> {`is an artist collective (est. 2018) that engages in highly collaborative cross-disciplinary projects in co-evolution with technology. Their work and research converges around the exploration of the self as a network; speculative post-humanism; intimacy and the potential for pleasurable actualisation through the digital sphere, and the re-imagination of our alliances with technology seen as part of a sympoietic biosphere and universal post-material consciousness. Through explorations spanning filmmaking, poetic Artificial Intelligence, multi-layered techniques of collage, assemblage and experience-led interventions they create scenarios and build experiential formats that instigate prototyping and rehearsing potential futures and progressing 'metamodern' values. Their practice is process-driven with a set of enquiries and intuitive leaps of knowledge becoming long-term projects that materialise through ongoing iteration and experimentation to share findings with a deepening understanding.`}
                </p>
                <p className="text-left text-xs leading-relaxed">
                  croslucid.zone<br />
                  create@crosslucid.zone
                </p>
                <p className="text-left text-xs leading-relaxed">
                  ~~~<br />
                  <span className="peridia-display-light">The Way of Flowers</span> is a collaborative creation that brings together artists, technologists, environmental scientists, and conservationists from around the world.
                </p>
              </>
            )}
            
            {activeTab === "tnc" && (
              <>
                <div className="text-center mb-2">
                  <div className="text-xl peridia-display-light tracking-wider">Disclaimer</div>
                </div>
                <p className="text-xs leading-relaxed">
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
      <div className="fixed -bottom-1 left-0 right-0 z-30 pt-2 scale-[1.1]">
        <div className="max-w-sm mx-auto px-3">
          <RootShapeArea
            onSubstrate={handleSubstrateClick}
            onStory={handleStoryClick}
            onWallet={handleWallet}
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

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={handleWalletModalClose}
        onLogout={handleLogout}
        onAddFunds={handleAddFunds}
        onExportKey={handleExportKey}
        onSwitchWallet={handleSwitchWallet}
        onPrivyHome={handlePrivyHome}
      />
    </div>
  );
}


