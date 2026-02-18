import { logger } from './logger';
import { env } from '../config/environment';
import { z } from 'zod';

/**
 * Production-Grade API Client
 * Features:
 * - Request/Response interceptors
 * - Automatic retry with exponential backoff
 * - Request deduplication
 * - Request queuing
 * - Error handling and logging
 * - Response schema validation
 * - Performance tracking
 * - Auth token management
 * - Timeout handling
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableRequestDeduplication: boolean;
  enableRequestQueue: boolean;
  enablePerformanceTracking: boolean;
}

interface RequestInterceptor {
  (config: RequestInit): RequestInit | Promise<RequestInit>;
}

interface ResponseInterceptor<T = any> {
  (response: T): T | Promise<T>;
}

interface ErrorInterceptor {
  (error: Error): Error | Promise<Error>;
}

interface PendingRequest {
  url: string;
  options: RequestInit;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

/**
 * Main API Client Class
 */
export class ApiClient {
  private config: ApiClientConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private requestQueue: PendingRequest[] = [];
  private isOnline: boolean = navigator.onLine;
  private authToken: string | null = null;

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = {
      baseURL: env.apiBaseUrl,
      timeout: env.apiTimeout,
      retryAttempts: env.apiRetryAttempts,
      retryDelay: 1000,
      enableRequestDeduplication: env.requestDeduplicationEnabled,
      enableRequestQueue: env.requestQueueEnabled,
      enablePerformanceTracking: env.performanceTrackingEnabled,
      ...config,
    };

    this.setupNetworkListeners();
    this.setupDefaultInterceptors();
  }

  /**
   * Setup network listeners for offline/online detection
   */
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      logger.info('Application is back online');
      this.flushRequestQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      logger.warn('Application is offline');
    });
  }

  /**
   * Setup default interceptors for auth and logging
   */
  private setupDefaultInterceptors(): void {
    // Default request interceptor: Add auth token
    this.addRequestInterceptor((config) => {
      if (this.authToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${this.authToken}`,
        };
      }
      return config;
    });

    // Default error interceptor: Handle 401
    this.addErrorInterceptor((error) => {
      if (error instanceof ApiError && error.statusCode === 401) {
        this.handleUnauthorized();
      }
      return error;
    });
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
    logger.debug('Auth token updated', { hasToken: !!token });
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let finalConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await Promise.resolve(interceptor(finalConfig));
    }
    return finalConfig;
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors(response: any): Promise<any> {
    let finalResponse = response;
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await Promise.resolve(interceptor(finalResponse));
    }
    return finalResponse;
  }

  /**
   * Apply error interceptors
   */
  private async applyErrorInterceptors(error: Error): Promise<Error> {
    let finalError = error;
    for (const interceptor of this.errorInterceptors) {
      finalError = await Promise.resolve(interceptor(finalError));
    }
    return finalError;
  }

  /**
   * Generate request key for deduplication
   */
  private getRequestKey(url: string, options: RequestInit): string {
    return `${options.method || 'GET'}:${url}:${JSON.stringify(options.body || {})}`;
  }

  /**
   * Check if request is already pending
   */
  private isPendingRequest(key: string): boolean {
    return this.config.enableRequestDeduplication && this.pendingRequests.has(key);
  }

  /**
   * Core request method with retry logic
   */
  private async request<T>(
    method: string,
    url: string,
    data?: any,
    options?: RequestInit,
    attempt = 1
  ): Promise<T> {
    const fullUrl = `${this.config.baseURL}${url}`;
    const requestKey = this.getRequestKey(fullUrl, { ...options, method });
    const startTime = performance.now();

    try {
      // Check if offline and request should be queued
      if (!this.isOnline && this.config.enableRequestQueue) {
        return this.queueRequest<T>(method, url, data, options);
      }

      // Check for duplicate request
      if (this.isPendingRequest(requestKey)) {
        logger.debug('Duplicate request detected, returning cached promise', { url });
        return new Promise((resolve, reject) => {
          const pending = this.pendingRequests.get(requestKey);
          if (pending) {
            pending.resolve = resolve;
            pending.reject = reject;
          }
        });
      }

      // Build request config
      let requestConfig: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: this.createAbortSignal(),
        ...options,
      };

      // Add body for POST/PUT/PATCH
      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        requestConfig.body = data instanceof FormData ? data : JSON.stringify(data);
      }

      // Apply request interceptors
      requestConfig = await this.applyRequestInterceptors(requestConfig);

      // Create pending request
      let resolveFunc: (value: any) => void;
      let rejectFunc: (reason?: any) => void;
      const pendingPromise = new Promise<any>((resolve, reject) => {
        resolveFunc = resolve;
        rejectFunc = reject;
      });

      if (this.config.enableRequestDeduplication) {
        this.pendingRequests.set(requestKey, {
          url: fullUrl,
          options: requestConfig,
          resolve: resolveFunc!,
          reject: rejectFunc!,
        });
      }

      // Make the request
      const response = await fetch(fullUrl, requestConfig);
      const duration = performance.now() - startTime;

      // Log performance
      if (this.config.enablePerformanceTracking) {
        logger.debug(`API ${method} ${url}`, {
          duration: duration.toFixed(2) + 'ms',
          status: response.status,
        });
      }

      // Handle response
      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}`,
          response.status,
          'HTTP_ERROR'
        );
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      let responseData: T;

      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text() as unknown as T;
      }

      // Apply response interceptors
      const finalResponse = await this.applyResponseInterceptors(responseData);

      // Clear pending request
      if (this.config.enableRequestDeduplication) {
        this.pendingRequests.delete(requestKey);
      }

      return finalResponse;
    } catch (error) {
      const duration = performance.now() - startTime;
      const processedError = await this.handleRequestError(
        error,
        method,
        url,
        duration,
        attempt
      );

      // Clear pending request on error
      if (this.config.enableRequestDeduplication) {
        this.pendingRequests.delete(requestKey);
      }

      throw processedError;
    }
  }

  /**
   * Handle request errors with retry logic
   */
  private async handleRequestError(
    error: any,
    method: string,
    url: string,
    duration: number,
    attempt: number
  ): Promise<Error> {
    // Determine if error is retryable
    const isRetryable = this.isRetryableError(error, attempt);

    if (isRetryable && attempt < this.config.retryAttempts) {
      const backoffDelay = Math.min(
        this.config.retryDelay * Math.pow(2, attempt - 1),
        30000 // Max 30 seconds
      );

      logger.warn(`Request failed, retrying in ${backoffDelay}ms`, {
        url,
        method,
        attempt,
        error: error instanceof Error ? error.message : String(error),
      });

      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return this.request(method, url, undefined, { method }, attempt + 1);
    }

    // Create API error
    let apiError: ApiError;

    if (error instanceof ApiError) {
      apiError = error;
    } else if (error instanceof Error) {
      apiError = new ApiError(error.message, 0, 'REQUEST_ERROR');
    } else {
      apiError = new ApiError('Unknown error', 0, 'UNKNOWN');
    }

    // Apply error interceptors
    const processedError = await this.applyErrorInterceptors(apiError);

    // Log error
    logger.error(`API request failed: ${method} ${url}`, processedError, {
      attempt,
      duration: duration.toFixed(2) + 'ms',
      retryable: isRetryable,
    });

    return processedError;
  }

  /**
   * Determine if error is retryable
   */
  private isRetryableError(error: any, attempt: number): boolean {
    if (error instanceof ApiError) {
      // Retry on 5xx errors
      if (error.statusCode >= 500) return true;
      // Retry on specific 4xx errors
      if (error.statusCode === 429) return true; // Too many requests
      if (error.statusCode === 408) return true; // Request timeout
      // Don't retry on 401, 403, 404
      if ([401, 403, 404].includes(error.statusCode)) return false;
    }

    // Retry on network errors
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return true;
    }

    return false;
  }

  /**
   * Create abort signal with timeout
   */
  private createAbortSignal(): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.config.timeout);
    return controller.signal;
  }

  /**
   * Queue request for later execution
   */
  private async queueRequest<T>(
    method: string,
    url: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    logger.debug('Request queued (offline)', { url });

    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        url,
        options: { ...options, method },
        resolve,
        reject,
      });
    });
  }

  /**
   * Flush request queue when back online
   */
  private async flushRequestQueue(): Promise<void> {
    if (this.requestQueue.length === 0) return;

    logger.info(`Flushing ${this.requestQueue.length} queued requests`);

    const queue = [...this.requestQueue];
    this.requestQueue = [];

    for (const pending of queue) {
      try {
        const result = await this.request(
          pending.options.method || 'GET',
          pending.url,
          pending.options.body,
          pending.options
        );
        pending.resolve(result);
      } catch (error) {
        pending.reject(error);
      }
    }
  }

  /**
   * Handle unauthorized errors
   */
  private handleUnauthorized(): void {
    logger.warn('Unauthorized access, clearing auth token');
    this.authToken = null;
    // Dispatch custom event for app to handle logout
    window.dispatchEvent(new CustomEvent('unauthorized'));
  }

  /**
   * Validate response against schema
   */
  async validateResponse<T>(
    response: any,
    schema: z.ZodTypeAny
  ): Promise<T> {
    const result = schema.safeParse(response);
    if (!result.success) {
      const errorMessage = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new ApiError(
        `Response validation failed: ${errorMessage}`,
        0,
        'VALIDATION_ERROR',
        result.error
      );
    }
    return result.data as T;
  }

  /**
   * HTTP methods
   */
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  async post<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('POST', url, data, options);
  }

  async put<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PUT', url, data, options);
  }

  async patch<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PATCH', url, data, options);
  }

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  /**
   * Upload file with form data
   */
  async uploadFile<T>(
    url: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>('POST', url, formData, {
      ...options,
      headers: {
        // Don't set Content-Type for FormData
        ...(options?.headers || {}),
      },
    });
  }

  /**
   * Get client stats
   */
  getStats(): {
    pendingRequests: number;
    queuedRequests: number;
    isOnline: boolean;
  } {
    return {
      pendingRequests: this.pendingRequests.size,
      queuedRequests: this.requestQueue.length,
      isOnline: this.isOnline,
    };
  }
}

// Singleton instance
export const apiClient = new ApiClient();

export default apiClient;
