import { assets } from "@/lib/assets";

// Ecosystem project data for each seed
export const ecosystemProjects: Record<string, {
  title: string;
  subtitle: string;
  shortText: string;
  extendedText: string;
  backgroundImageUrl: string;
  seedEmblemUrl: string;
}> = {
  "1": {
    title: "Grgich Hills Estate Regenerative Sheep Grazing",
    subtitle: "Rutherford AVA, Napa Valley 126ha",
    shortText: "Across Napa's vineyard terraces, a carefully orchestrated migration unfolds each season as sheep move through precise rotational patterns, their grazing transforming soil chemistry with each methodical step. This ancient practice, refined through contemporary ecological science, quietly rebuilds the underground architecture that sustains both wine and wildland.Key Benefits: Enhanced nutrient cycling, reduced external inputs, wildfire mitigation, soil carbon storage",
    extendedText: `The project represents a sophisticated evolution in sustainable viticulture, where high-density rotational grazing serves as both ecological restoration tool and climate adaptation strategy. Since 2021, this pioneering collaboration has integrated Kaos Sheep Outfit's skilled shepherding expertise with Grgich Hills' decades of organic farming leadership, creating a comprehensive approach to soil health enhancement.

The methodology employs targeted grazing patterns designed to optimize nutrient cycling while reducing external agri-cultural inputs, effectively transforming vineyard understory management into active carbon storage. This approach generates measurable improvements in soil organic matter, water retention capacity, and biodiversity support while providing critical wildfire fuel reduction across the vulnerable Rutherford AVA landscape.

The project establishes protocols for vineyard-integrated grazing that demonstrate how traditional pastoral practices can be precisely calibrated using contemporary monitoring technologies to achieve quantifiable ecosystem restoration outcomes within premium wine production systems.`,
    backgroundImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
    seedEmblemUrl: assets.glowers
  },
  "2": {
    title: "Urban Garden Network Community Initiative",
    subtitle: "Metropolitan Area, California 50ha",
    shortText: "A community-driven urban agriculture project that transforms vacant lots into productive green spaces. This initiative combines sustainable growing practices with social engagement to create resilient urban ecosystems that support both human and environmental health.",
    extendedText: `The Urban Garden Network represents a grassroots approach to urban sustainability, engaging local communities in the creation and maintenance of productive green spaces across metropolitan areas. Since 2020, this initiative has established over 50 hectares of community gardens, rooftop farms, and vertical growing systems.

The project employs innovative growing techniques including hydroponics, aquaponics, and permaculture principles to maximize food production in limited urban spaces. This approach has resulted in significant improvements in local food security, community cohesion, and environmental education while providing measurable benefits in air quality and urban heat island mitigation.

The initiative serves as a model for scalable urban agriculture practices, demonstrating how community engagement and sustainable growing techniques can transform urban landscapes while addressing critical issues of food security and environmental justice.`,
    backgroundImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed2/seed.png",
    seedEmblemUrl: assets.glowers
  }
};

// Way of Flowers card data for each seed
export const wayOfFlowersData: Record<string, {
  backgroundImageUrl: string;
  seedEmblemUrl: string;
  firstText: string;
  secondText: string;
  thirdText: string;
  mainQuote: string;
  author: string;
}> = {
  "1": {
    backgroundImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed1/seed.png",
    seedEmblemUrl: assets.glowers,
    firstText: "Evolving through",
    secondText: "ecosystem nurturing...",
    thirdText: "Grown by community stewardship.",
    mainQuote: "Evidence for the non-metaphorical memory of light residing in plant leaves adds insult to the injury suffered by the argument of those who still insist on the exceptionalism of the central nervous system. In other words, when consciousness is wholly embedded in its biochemical substratum, it becomes increasingly indistinguishable from the cellular and molecular processes of other, presumably nonconscious organisms, such as plants.",
    author: "Michael Marder"
  },
  "2": {
    backgroundImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed2/seed.png",
    seedEmblemUrl: assets.glowers,
    firstText: "Growing through",
    secondText: "urban transformation...",
    thirdText: "Cultivated by community wisdom.",
    mainQuote: "The garden suggests there might be a place where we can meet nature halfway...",
    author: "Michael Pollan"
  }
};

// Seed story data for each seed
export const seedStories: Record<string, {
  title: string;
  author: string;
  story: string;
}> = {
  "1": {
    title: "We are the Soil for What Comes Next",
    author: "Stanley Qiufan Chen",
    story: `As a kid, I fever-dreamed too often. I wasn't in my bed but underground, dark, warm, damp, my limbs unraveling into a long, tangle of strings growing through a tunnel made of humming light. I could taste the hum of the cartoons with my fingers; it tasted like putting your tongue on a sour battery.
    CROSSLUCID had made my dream literal—or perhaps I never woke. The Way of Flowers sprawls before me like a hallucination of late capitalism finally eating its own tail, birthing something beautiful and monstrous: a garden where generative code photosynthesizes and collective devotion blossoms into literal biomes.
    The "seeds" pulse with impossible life—neither plant nor code, but a fusion that renders the distinction obsolete. Watch: a participant in Tokyo dedicates their support to protect jaguars in Brazil. Instantly, the botanical on screen convulses. Tendrils erupt. Leaves shift from emerald to jade. Aerial roots descend like synaptic connections seeking soil that exists only as verified biodiversity outcomes. The Morphological Art Engine doesn't simulate growth; it channels it from a parallel dimension where our conservation actions have already crystallized as matter.
    In this fevered ecology, Marder's "vegetal thinking" becomes protocol. The botanicals think without brains, remember without neurons, evolve without DNA—unless you count the seed ecosystems each steward selects. This is a living code woven from six distinct bioregions, more complex than any double helix, entangling California vineyard mycorrhizae with Barbadian mangrove pneumatophores in impossible anatomies.`
  },
  "2": {
    title: "Digital Roots",
    author: "Maya Chen",
    story: `The city breathes differently now. Where concrete once suffocated the earth, digital tendrils reach through fiber optic soil, connecting urban gardens across continents. Each seed planted in this network carries the weight of collective intention—a thousand hands tending to a single root system that spans the globe.

In the heart of Tokyo's vertical farms, sensors hum with the rhythm of photosynthesis, translating plant language into data streams that flow through the network. A community garden in São Paulo responds to the same digital pulse, its tomatoes ripening in sync with the algorithmic seasons of distant biomes. The boundaries between natural and artificial dissolve as the network learns to think like a forest.

This is not simulation—it's symbiosis. The Way of Flowers has become a living protocol where every action ripples through the digital mycelium, creating patterns of growth that transcend individual gardens. We are not just growing plants; we are growing a new kind of consciousness, one that remembers the ancient wisdom of roots while dreaming of digital futures.

The seeds know this truth: in the space between code and chlorophyll, between data and DNA, lies the possibility of a world where technology serves life, where every algorithm is a prayer, and where the garden becomes the cathedral of our collective becoming.`
  }
};

// Helper functions to get data by seed ID
/**
 * @deprecated Use beneficiary data from API response instead
 * This is kept for backward compatibility only
 */
export function getEcosystemProject(seedId: string) {
  return ecosystemProjects[seedId] || ecosystemProjects["1"]; // fallback to seed 1
}

/**
 * Get Way of Flowers data by seed ID
 * Now checks backend response first, falls back to local data
 */
export function getWayOfFlowersData(seedId: string, backendData?: any) {
  // If backend provides data with any non-empty field, use it
  if (backendData && (
    backendData.backgroundImageUrl ||
    backendData.seedEmblemUrl ||
    backendData.firstText ||
    backendData.mainQuote
  )) {
    return backendData;
  }
  
  // Otherwise fallback to local data
  return wayOfFlowersData[seedId] || wayOfFlowersData["1"];
}

export function getSeedStory(seedId: string) {
  return seedStories[seedId] || seedStories["1"]; // fallback to seed 1
}
