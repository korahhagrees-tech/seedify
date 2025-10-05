import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to shorten beneficiary names to 3 words, skipping 2-3 character words except at start
export function shortenBeneficiaryName(name: string): string {
  const words = name.split(' ');
  if (words.length <= 3) return name;
  
  const result = [];
  let wordCount = 0;
  
  for (let i = 0; i < words.length && wordCount < 3; i++) {
    const word = words[i];
    // Keep the first word regardless of length, or words with 4+ characters
    if (i === 0 || word.length >= 4) {
      result.push(word);
      wordCount++;
    }
  }
  
  return result.join(' ');
}

// Function to format area for display (e.g., "126.6 hectares" -> "126.6ha")
export function formatArea(area: string): string {
  if (!area) return '';
  
  // Extract number and unit, convert to short form
  const match = area.match(/(\d+(?:\.\d+)?)\s*(hectares?|ha|acres?|ac|sq\s*km|km²|m²|sq\s*m)/i);
  if (match) {
    const number = match[1];
    const unit = match[2].toLowerCase();
    
    // Convert to short form
    if (unit.includes('hectare')) return `${number}ha`;
    if (unit.includes('acre')) return `${number}ac`;
    if (unit.includes('km')) return `${number}km²`;
    if (unit.includes('m²')) return `${number}m²`;
    
    return `${number}${unit}`;
  }
  
  return area;
}


export interface Beneficiary {
  id: string;
  name: string;
  slug: string;
  image: string;
  percentage?: string;
  position: {
    top: string;
    left: string;
    width: string;
    height: string;
    transform: string;
  };
  labelPosition: {
    top: string;
    left: string;
    transform: string;
  };
}