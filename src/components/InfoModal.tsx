/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
}

const ABOUT_TEXT = [
  "The Way of Flowers represents a fundamental reimagining of environmental art through dynamic digital botanical compositions that maintain living connections to real-world conservation efforts. Collectors become original seeders, acquiring seeds that are collectively nurtured through their community and its engagement with specific ecosystem projects, creating uniquely evolving artworks that form a digital permaculture garden cultivated through ecosystem nurturing and grown by community stewardship.",
  "When participants engage with verified biodiversity projects, their botanical compositions evolve in response, incorporating traits specific to those initiatives. Through the unique forking mechanism, each contribution creates individual snapshot artworks—morphological plant representations of participants' unique conservation actions—while simultaneously shaping the collective evolving digital botanical that continues its growth, creating a fascinating tension between permanence and change where individual journeys crystallize into permanent beauty.",
  "The aesthetic language emerges from a generative morphological art engine trained on botanical datasets and responsive to verified conservation data, establishing direct connections between artistic evolution and ecological action."
].join("\n\n");

const DISCLAIMER_TEXT = [
  "1. DEFINITIONS AND GLOSSARY",
  "The following terms and definitions apply to this Agreement:",
  "1.1 Core Concepts",
  '"Way of Flowers" means an artistic project focused on ecological stewardship that explores the relationship between biodiversity, conservation, and digital art through a generative art system.',
  '"CROSSLUCID" means the creator and owner of the Way of Flowers project, partially licensed by W\'A\'Y\'S, a Swiss association registered at c/o Dan Stein & Impact Hub, Rue Fendt 1, 1201 Geneva, Switzerland.',
  '"Seed" / "Dynamic NFT" means a living, evolving digital botanical artwork that responds to collective community activity and environmental data. Each Seed is owned by a Seed Steward and transforms based on community contributions to verified regenerative projects. The artwork\'s morphology evolves as participants engage with its associated ecosystem projects, creating a unique visual narrative of collective environmental impact.',
  '"Snapshot" / "Static NFT" means a permanent capture of a specific evolutionary moment in a Seed\'s development. This represents an individual conservation contribution by Community Member.',
  '"Seedbed Ecosystem" means the curated collection of verified regenerative initiatives that form a Seed\'s "DNA." Initially comprising 4 projects selected by the Seed Steward from a curated pool of 8 verified regenerative initiatives, this ecosystem expands over time as the art project progresses.'
].join("\n");

const CREDITS_TEXT = [
  "CROSSLUCID is an artist collective (est. 2018) that engages in highly collaborative cross-disciplinary projects in co-evolution with technology. Their work and research converges around the exploration of the self as a network; speculative post-humanism; intimacy and the potential for pleasurable actualisation through the digital sphere, and the re-imagination of our alliances with technology seen as part of a sympoietic biosphere and universal post-material consciousness. Through explorations spanning filmmaking, poetic Artificial Intelligence, multi-layered techniques of collage, assemblage and experience-led interventions they create scenarios and build experiential formats that instigate prototyping and rehearsing potential futures and progressing 'metamodern' values. Their practice is process-driven with a set of enquiries and intuitive leaps of knowledge becoming long-term projects that materialise through ongoing iteration and experimentation to share findings with a deepening understanding.",
  "",
  "croslucid.zone",
  "create@crosslucid.zone"
].join("\n");

export default function InfoModal({ open, onClose }: InfoModalProps) {
  const [tab, setTab] = useState<"substrate" | "credits" | "tnc">("substrate");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setTab("substrate");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-2 peridia-display"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="relative w-full max-w-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            <div className="relative rounded-[50px] border-2 border-dotted border-black bg-white p-4">
              <div className="flex gap-14 mt-2 mb-6 mx-auto justify-center">
                {[
                  { k: "substrate", label: "Substrate" },
                  { k: "credits", label: "Credits" },
                  { k: "tnc", label: "T&C" },
                ].map(({ k, label }) => (
                  <button
                    key={k}
                    onClick={() => setTab(k as any)}
                    className={`px-4 py-1 rounded-full border border-black scale-[1.4] ${tab === k ? "bg-gray-200" : "bg-white"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tab === "substrate" && (
                <div className="text-center mb-3">
                  <div className="text-2xl">Substrate</div>
                  <div className="mx-auto my-2 w-10 h-10 rounded-full border border-black flex items-center justify-center">
                    <Image src="/audio-play.svg" alt="Audio" width={20} height={20} />
                  </div>
                </div>
              )}

              {tab === "tnc" && (
                <div className="text-center mb-3">
                  <div className="text-2xl">Disclaimer</div>
                </div>
              )}

              <div className="relative">
                <div
                  ref={scrollRef}
                  className="max-h-[420px] overflow-y-auto pr-1 text-sm leading-relaxed"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <p className="whitespace-pre-line mb-12">
                    {tab === "substrate" ? ABOUT_TEXT : tab === "tnc" ? DISCLAIMER_TEXT : CREDITS_TEXT}
                  </p>
                </div>
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
