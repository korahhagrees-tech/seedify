/**
 * Shared utility for generating ecosystem URLs
 * Used by both SeedbedCard and TendedEcosystem components
 */

export interface EcosystemUrlParams {
  seedId?: string;
  seedSlug?: string;
  beneficiarySlug: string;
}

export function getEcosystemUrl({ seedId, seedSlug, beneficiarySlug }: EcosystemUrlParams): string {
  if (seedId && seedSlug) {
    return `/seed/${seedId}/${seedSlug}/ecosystem/${beneficiarySlug}`;
  }
  return `/ecosystem/${beneficiarySlug}`;
}

export function getEcosystemUrlFromParams(params: any, beneficiarySlug: string): string {
  const seedId = params?.id as string;
  const seedSlug = params?.slug as string;
  
  return getEcosystemUrl({ seedId, seedSlug, beneficiarySlug });
}
