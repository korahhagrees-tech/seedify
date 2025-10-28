/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Beneficiary Service
 * Handles all beneficiary-related API calls
 */

import { apiClient, APIError } from '../client';
import { API_CONFIG, API_ENDPOINTS } from '../config';
import { BeneficiariesResponse, BeneficiaryResponse, BeneficiaryData } from '@/types/api';

/**
 * Fetch all beneficiaries
 */
export async function fetchBeneficiaries(): Promise<BeneficiaryData[]> {
  // console.log('[BENEFICIARY-SERVICE] Fetching beneficiaries...');

  try {
    const response = await apiClient.get<BeneficiariesResponse>(
      API_ENDPOINTS.beneficiaries
    );

    if (!response.success || !response.beneficiaries) {
      throw new APIError('Invalid response format');
    }

    // console.log(
    //   '[BENEFICIARY-SERVICE] Successfully fetched',
    //   response.beneficiaries.length,
    //   'beneficiaries'
    // );

    return response.beneficiaries;
  } catch (error) {
    console.error('[BENEFICIARY-SERVICE] Error fetching beneficiaries:', error);
    throw error;
  }
}

/**
 * Fetch beneficiary by index
 */
export async function fetchBeneficiaryByIndex(
  index: number
): Promise<BeneficiaryData | null> {
  // console.log('[BENEFICIARY-SERVICE] Fetching beneficiary by index:', index);

  try {
    const response = await apiClient.get<BeneficiaryResponse>(
      API_ENDPOINTS.beneficiaryByIndex(index)
    );

    if (!response.success || !response.beneficiary) {
      return null;
    }

    // console.log('[BENEFICIARY-SERVICE] Successfully fetched beneficiary:', index);
    return response.beneficiary;
  } catch (error) {
    console.error('[BENEFICIARY-SERVICE] Error fetching beneficiary:', error);
    throw error;
  }
}

/**
 * Fetch beneficiary by code
 */
export async function fetchBeneficiaryByCode(
  code: string
): Promise<BeneficiaryData | null> {
  // console.log('[BENEFICIARY-SERVICE] Fetching beneficiary by code:', code);

  try {
    const response = await apiClient.get<BeneficiaryResponse>(
      API_ENDPOINTS.beneficiaryByCode(code)
    );

    if (!response.success || !response.beneficiary) {
      return null;
    }

    // console.log('[BENEFICIARY-SERVICE] Successfully fetched beneficiary:', code);
    return response.beneficiary;
  } catch (error) {
    console.error('[BENEFICIARY-SERVICE] Error fetching beneficiary:', error);
    throw error;
  }
}

