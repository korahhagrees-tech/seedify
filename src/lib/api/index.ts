/**
 * API Index
 * Central export for all API services
 */

// Configuration
export { API_CONFIG, API_ENDPOINTS } from './config';

// Client
export { apiClient, APIError } from './client';

// Services
export * from './services/seedService';
export * from './services/userService';
export * from './services/writeService';
export * from './services/beneficiaryService';

// Mock Data
export { mockSeedsData } from './mocks/seedMocks';
export { mockBeneficiariesData } from './mocks/beneficiaryMocks';
export { mockUserData, mockTendedEcosystems } from './mocks/userMocks';

