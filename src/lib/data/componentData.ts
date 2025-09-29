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
    seedEmblemUrl: assets.globe
  },
  "2": {
    title: "Urban Garden Network Community Initiative",
    subtitle: "Metropolitan Area, California 50ha",
    shortText: "A community-driven urban agriculture project that transforms vacant lots into productive green spaces. This initiative combines sustainable growing practices with social engagement to create resilient urban ecosystems that support both human and environmental health.",
    extendedText: `The Urban Garden Network represents a grassroots approach to urban sustainability, engaging local communities in the creation and maintenance of productive green spaces across metropolitan areas. Since 2020, this initiative has established over 50 hectares of community gardens, rooftop farms, and vertical growing systems.

The project employs innovative growing techniques including hydroponics, aquaponics, and permaculture principles to maximize food production in limited urban spaces. This approach has resulted in significant improvements in local food security, community cohesion, and environmental education while providing measurable benefits in air quality and urban heat island mitigation.

The initiative serves as a model for scalable urban agriculture practices, demonstrating how community engagement and sustainable growing techniques can transform urban landscapes while addressing critical issues of food security and environmental justice.`,
    backgroundImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed2/seed.png",
    seedEmblemUrl: assets.globe
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
    seedEmblemUrl: assets.globe,
    firstText: "Evolving through",
    secondText: "ecosystem nurturing...",
    thirdText: "Grown by community stewardship.",
    mainQuote: "Evidence for the non-metaphorical memory of light residing in plant leaves...",
    author: "Michael Marder"
  },
  "2": {
    backgroundImageUrl: "https://wof-flourishing-backup.s3.amazonaws.com/seed2/seed.png",
    seedEmblemUrl: assets.globe,
    firstText: "Growing through",
    secondText: "urban transformation...",
    thirdText: "Cultivated by community wisdom.",
    mainQuote: "The garden suggests there might be a place where we can meet nature halfway...",
    author: "Michael Pollan"
  }
};

// Helper functions to get data by seed ID
export function getEcosystemProject(seedId: string) {
  return ecosystemProjects[seedId] || ecosystemProjects["1"]; // fallback to seed 1
}

export function getWayOfFlowersData(seedId: string) {
  return wayOfFlowersData[seedId] || wayOfFlowersData["1"]; // fallback to seed 1
}
