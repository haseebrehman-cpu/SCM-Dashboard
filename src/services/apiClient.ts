// src/services/apiClient.ts

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions extends RequestInit {
  timeout?: number;
}

export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(config?: Partial<ApiClientConfig>) {
    this.baseURL = config?.baseURL?.replace(/\/$/, "") ?? ""; // Remove trailing slash
    this.timeout = config?.timeout ?? 9 * 60 * 1000;
  }

  private async request<TResponse, TBody = unknown>(
    method: HttpMethod,
    url: string,
    body?: TBody,
    options?: RequestOptions,
  ): Promise<TResponse> {
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    const fullUrl = `${this.baseURL}${cleanUrl}`;

    const { timeout, signal: externalSignal, headers: customHeaders, ...fetchOptions } = options || {};
    
    // Create timeout controller
    const controller = new AbortController();
    const timeoutMs = timeout ?? this.timeout;
    const timeoutId = setTimeout(() => controller.abort(new Error("TIMEOUT")), timeoutMs);

    // Merge signals if AbortSignal.any is available (Chrome 116+, Node 20+)
    // Otherwise fallback to the timeout signal
    let combinedSignal: AbortSignal = controller.signal;
    
    // Proper feature detection without 'any' or 'unknown' casts
    type AbortSignalWithAny = typeof AbortSignal & { 
      any: (signals: AbortSignal[]) => AbortSignal 
    };

    if ("any" in AbortSignal && typeof (AbortSignal as Partial<AbortSignalWithAny>).any === "function") {
      const signals = [controller.signal, externalSignal].filter((s): s is AbortSignal => !!s);
      combinedSignal = (AbortSignal as AbortSignalWithAny).any(signals);
    }

    const headers = new Headers(customHeaders);
    if (!(body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        method,
        signal: combinedSignal,
        headers,
        body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        let errorDetails: unknown;
        try {
          errorDetails = await response.json();
        } catch {
          errorDetails = await response.text();
        }

        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          "HTTP_ERROR",
          errorDetails
        );
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        return (await response.json()) as TResponse;
      }

      return (await response.text()) as unknown as TResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AbortError" || error.message === "TIMEOUT") {
          throw new ApiError(
            `Request timeout after ${timeoutMs}ms`,
            408,
            "REQUEST_TIMEOUT",
            { timeout: timeoutMs }
          );
        }
      }

      if (error instanceof ApiError) throw error;

      throw new ApiError(
        error instanceof Error ? error.message : "Network error",
        0,
        "NETWORK_ERROR",
        error
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<TResponse>(url: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>("GET", url, undefined, options);
  }

  async post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>("POST", url, body, options);
  }

  async put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>("PUT", url, body, options);
  }

  async patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>("PATCH", url, body, options);
  }

  async delete<TResponse>(
    url: string,
    options?: RequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>("DELETE", url, undefined, options);
  }

  async uploadFile<TResponse>(
    url: string,
    formData: FormData,
    options?: RequestOptions,
  ): Promise<TResponse> {
    // Explicitly destructure to avoid manual header spreading which can fail with Headers objects
    const { headers, ...otherOptions } = options ?? {};
    
    return this.request<TResponse, FormData>("POST", url, formData, {
      ...otherOptions,
      headers,
    });
  }

  // Special method for long-running requests (explicitly 2 minutes)
  async getLongRunning<TResponse>(url: string, options?: RequestOptions): Promise<TResponse> {
    return this.get<TResponse>(url, { 
      ...options, 
      timeout: 2 * 60 * 1000 // 2 minutes
    });
  }
}

// Create default instance with 2 minute timeout
export const apiClient = new ApiClient({
  timeout: 2 * 60 * 1000, // 2 minutes default
});

export default apiClient;
