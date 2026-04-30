
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

/**
 * API Client Service
 * Handles all HTTP requests with proper error handling, retries, and auth
 */
export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '';
    this.timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');
    this.retryAttempts = parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3');
  }

  private async request<T>(
    method: string,
    endpoint: string,
    options?: RequestInit,
    attempt = 1
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...options?.headers,
        },
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          this.handleUnauthorized();
        }
        throw new ApiError(
          `HTTP ${response.status}`,
          response.status,
          'HTTP_ERROR'
        );
      }

      const data = await response.json();
      return {
        success: true,
        data,
        timestamp: Date.now(),
      };
    } catch (error) {
      // Retry on network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        if (attempt < this.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          return this.request<T>(method, endpoint, options, attempt + 1);
        }
      }

      const apiError = error instanceof ApiError
        ? error
        : new ApiError(
          error instanceof Error ? error.message : 'Unknown error',
          0,
          'UNKNOWN'
        );

      return {
        success: false,
        error: apiError.message,
        timestamp: Date.now(),
      };
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.request<T>('GET', endpoint);
    if (!response.success) throw new Error(response.error);
    return response.data as T;
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.request<T>('POST', endpoint, {
      body: JSON.stringify(data),
    });
    if (!response.success) throw new Error(response.error);
    return response.data as T;
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.request<T>('PUT', endpoint, {
      body: JSON.stringify(data),
    });
    if (!response.success) throw new Error(response.error);
    return response.data as T;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.request<T>('DELETE', endpoint);
    if (!response.success) throw new Error(response.error);
    return response.data as T;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }

  private getAuthToken(): string | null {
    const storage = import.meta.env.VITE_AUTH_TOKEN_STORAGE === 'localStorage'
      ? localStorage
      : sessionStorage;
    return storage.getItem('auth_token');
  }

  private handleUnauthorized(): void {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    window.location.href = '/signin';
  }
}

export const api = new ApiClient();
