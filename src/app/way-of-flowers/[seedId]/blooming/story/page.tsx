"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import StoryPanel from "@/components/StoryPanel";
import { getSeedStory } from "@/lib/data/componentData";

export default function StoryPage({ params }: { params: Promise<{ seedId: string }> }) {
  const router = useRouter();
  const { seedId } = React.use(params);
  const story = getSeedStory(seedId);

  return (
    <div className="min-h-screen w-full max-w-md mx-auto px-4 py-6">
      <StoryPanel
        text={story.story}
        title={story.title}
        author={story.author}
        onBack={() => router.back()}
      />
    </div>
  );
}


