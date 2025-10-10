/**
 * External URLs for "Read More" functionality
 * These are external links that users can access through the dashed circle button
 */

export const readMoreLinks = [
  "https://www.regenerativeagriculture.com",
  "https://www.sustainablefarming.org",
  "https://www.permaculture.org.uk",
  "https://www.organicconsumers.org",
  "https://www.farmland.org",
  "https://www.sustainableagriculture.net",
  "https://www.regenerativeag.org",
  "https://www.soilhealthinstitute.org",
  "https://www.biodynamics.com",
  "https://www.agroecology.org",
  "https://www.foodsystems.org",
  "https://www.climatefarming.org",
  "https://www.carbonfarming.org",
  "https://www.regenerativegrazing.org",
  "https://www.covercrops.org",
  "https://www.no-till.com",
  "https://www.agroforestry.org",
  "https://www.composting.org",
  "https://www.vermiculture.org",
  "https://www.mycorrhizae.org",
  "https://www.soilmicrobes.org",
  "https://www.beneficialinsects.org",
  "https://www.pollinator.org",
  "https://www.nativeplants.org",
  "https://www.permaculturenews.org",
  "https://www.regenerativefinance.org",
  "https://www.impactinvesting.org",
  "https://www.sustainablefinance.org",
  "https://www.greenbonds.org",
  "https://www.esginvesting.org"
];

/**
 * Get a random link from the array
 */
export function getRandomReadMoreLink(): string {
  const randomIndex = Math.floor(Math.random() * readMoreLinks.length);
  return readMoreLinks[randomIndex];
}

/**
 * Get a link by index (useful for consistent rotation)
 */
export function getReadMoreLinkByIndex(index: number): string {
  const normalizedIndex = index % readMoreLinks.length;
  return readMoreLinks[normalizedIndex];
}
