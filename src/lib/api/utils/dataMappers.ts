/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Data Mappers
 * Utilities to transform backend responses into component-friendly formats
 */

import { BeneficiaryData, BeneficiaryProjectData } from '@/types/api';

/**
 * Convert beneficiary project data to ecosystem project format
 * 
 * Mapping:
 * - title: projectData.title + projectData.subtitle
 * - subtitle: projectData.location
 * - shortText: projectData.description + formatted benefits list
 * - extendedText: projectData.moreDetails
 * - backgroundImageUrl: projectData.backgroundImage
 * - seedEmblemUrl: from wayOfFlowersData.seedEmblemUrl
 */
export function beneficiaryToEcosystemProject(beneficiary: BeneficiaryData, seedData?: any) {
  const { projectData } = beneficiary;
  
  if (!projectData) {
    throw new Error(`Beneficiary ${beneficiary.code} is missing projectData`);
  }
  
  // Combine title and subtitle
  const title = `${projectData.title} ${projectData.subtitle}`.trim();
  
  // Use location as subtitle
  const subtitle = projectData.location;
  
  // Combine description and benefits for short text (each benefit on new line)
  const benefitsList = projectData.benefits
    .map(benefit => `• ${benefit}`)
    .join('\n');
  
  const shortText = `${projectData.description}\n\nKey Benefits:\n${benefitsList}`;
  
  // Use moreDetails as extended text
  const extendedText = projectData.moreDetails;
  
  // Use backgroundImage
  const backgroundImageUrl = projectData.backgroundImage;
  
  // Get seedEmblemUrl from wayOfFlowersData if available
  const seedEmblemUrl = seedData?.wayOfFlowersData?.seedEmblemUrl;
  
  return {
    title,
    subtitle,
    location: projectData.location,
    shortText,
    extendedText,
    backgroundImageUrl,
    area: projectData.area,
    benefits: projectData.benefits,
    beneficiaryCode: beneficiary.code,
    beneficiarySlug: beneficiary.slug || '',
    seedEmblemUrl,
    seedId: seedData?.id,
  };
}

/**
 * Get ecosystem project data for a seed by beneficiary slug
 */
export function getEcosystemProjectBySlug(
  beneficiaries: BeneficiaryData[],
  slug: string,
  seedData?: any
) {
  const beneficiary = beneficiaries.find(b => b.slug === slug);
  
  if (!beneficiary) {
    return null;
  }
  
  return beneficiaryToEcosystemProject(beneficiary, seedData);
}

/**
 * Get all ecosystem projects from seed beneficiaries
 */
export function getAllEcosystemProjects(beneficiaries: BeneficiaryData[], seedData?: any) {
  return beneficiaries.map(beneficiary => beneficiaryToEcosystemProject(beneficiary, seedData));
}

/**
 * Convert backend beneficiaries to Seedbed UI format
 * This maps the backend beneficiaries to the format expected by SeedbedCard
 */
export function convertBeneficiariesToSeedbedFormat(beneficiaries: BeneficiaryData[]): any[] {
  // Map of beneficiary codes to their UI positioning data
  const positionMap: Record<string, any> = {
    '01-GRG': {
      position: {
        top: "lg:bottom-27 bottom-28",
        left: "lg:-right-3 -right-6",
        width: "w-34",
        height: "h-34",
        transform: "transform rotate-6"
      },
      labelPosition: {
        top: "right-18",
        left: "top-1/2",
        transform: "transform -rotate-90"
      }
    },
    '02-ELG': {
      position: {
        top: "-top-14",
        left: "left-6 lg:left-8",
        width: "w-[155px]",
        height: "h-[155px]",
        transform: "transform -rotate-4"
      },
      labelPosition: {
        top: "-left-18",
        left: "-top-10",
        transform: "transform -rotate-90"
      }
    },
    '03-JAG': {
      position: {
        top: "top-1",
        left: "right-2 lg:right-6",
        width: "w-14",
        height: "h-14",
        transform: "transform rotate-12"
      },
      labelPosition: {
        top: "-right-10",
        left: "-top-4",
        transform: "transform rotate-45"
      }
    },
    '04-BUE': {
      position: {
        top: "lg:bottom-24 bottom-24",
        left: "-left-5 lg:-left-3",
        width: "w-28",
        height: "h-28",
        transform: "transform -rotate-6"
      },
      labelPosition: {
        top: "left-16",
        left: "bottom-42",
        transform: "transform rotate-66"
      }
    },
    '05-WAL': {
      position: {
        top: "top-1",
        left: "right-2 lg:right-6",
        width: "w-14",
        height: "h-14",
        transform: "transform rotate-12"
      },
      labelPosition: {
        top: "-right-10",
        left: "-top-4",
        transform: "transform rotate-45"
      }
    },
    '06-PIM': {
      position: {
        top: "top-8",
        left: "left-4",
        width: "w-20",
        height: "h-20",
        transform: "transform -rotate-12"
      },
      labelPosition: {
        top: "-left-12",
        left: "top-6",
        transform: "transform -rotate-90"
      }
    },
    '07-HAR': {
      position: {
        top: "bottom-32",
        left: "left-1/2 -translate-x-1/2",
        width: "w-24",
        height: "h-24",
        transform: "transform rotate-0"
      },
      labelPosition: {
        top: "left-1/2 -translate-x-1/2",
        left: "bottom-36",
        transform: "transform rotate-0"
      }
    },
    '08-STE': {
      position: {
        top: "top-16",
        left: "right-8",
        width: "w-16",
        height: "h-16",
        transform: "transform rotate-6"
      },
      labelPosition: {
        top: "-right-8",
        left: "top-12",
        transform: "transform rotate-45"
      }
    }
  };

  return beneficiaries.map(ben => ({
    id: ben.code.toLowerCase(),
    name: ben.name,
    slug: ben.slug || ben.code.toLowerCase(),
    image: ben.projectData?.backgroundImage || `/project_images/${ben.code}.png`,
    position: positionMap[ben.code]?.position || positionMap['01-GRG'].position,
    labelPosition: positionMap[ben.code]?.labelPosition || positionMap['01-GRG'].labelPosition,
  }));
}

