import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface Beneficiary {
  id: string;
  name: string;
  slug: string;
  image: string;
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