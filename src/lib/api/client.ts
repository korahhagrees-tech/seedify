/**
 * API Client Utilities
 * 
 * Provides fetch wrappers with error handling, retries, and timeout support
 */

import { API_CONFIG } from './config';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = API_CONFIG.timeout, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIError('Request timeout', 408);
    }
    throw error;
  }
}

/**
 * Fetch with retry support
 */
async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { retries = API_CONFIG.retries, ...fetchOptions } = options;
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fetchWithTimeout(url, fetchOptions);
    } catch (error) {
      lastError = error as Error;
      if (i < retries) {
        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
  }

  throw lastError || new APIError('Request failed after retries');
}

/**
 * Parse API response
 */
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorData: unknown;

    try {
      if (contentType?.includes('application/json')) {
        errorData = await response.json();
        if (typeof errorData === 'object' && errorData !== null && 'message' in errorData) {
          errorMessage = (errorData as { message: string }).message;
        }
      } else {
        errorMessage = await response.text();
      }
    } catch {
      // Use default error message
    }

    throw new APIError(errorMessage, response.status, errorData);
  }

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return response.text() as unknown as T;
}

/**
 * Main API client
 */
export const apiClient = {
  /**
   * GET request
   */
  async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    console.log(`[API] GET ${url}`);

    const response = await fetchWithRetry(url, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await parseResponse<T>(response);
    console.log(`[API] GET ${url} - Success`);
    return data;
  },

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options: FetchOptions = {}
  ): Promise<T> {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    console.log(`[API] POST ${url}`);

    const response = await fetchWithRetry(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await parseResponse<T>(response);
    console.log(`[API] POST ${url} - Success`);
    return data;
  },

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options: FetchOptions = {}
  ): Promise<T> {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    console.log(`[API] PUT ${url}`);

    const response = await fetchWithRetry(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await parseResponse<T>(response);
    console.log(`[API] PUT ${url} - Success`);
    return data;
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    console.log(`[API] DELETE ${url}`);

    const response = await fetchWithRetry(url, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await parseResponse<T>(response);
    console.log(`[API] DELETE ${url} - Success`);
    return data;
  },
};

