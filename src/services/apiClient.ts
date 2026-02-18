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

export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(config?: Partial<ApiClientConfig>) {
    this.baseURL = config?.baseURL ?? "";
    this.timeout = config?.timeout ?? 30000;
  }

  private createAbortSignal(): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.timeout);
    return controller.signal;
  }

  private async request<TResponse, TBody = unknown>(
    method: HttpMethod,
    url: string,
    body?: TBody,
    options?: RequestInit,
  ): Promise<TResponse> {
    const fullUrl = `${this.baseURL}${url}`;

    const init: RequestInit = {
      method,
      signal: this.createAbortSignal(),
      ...options,
    };

    const baseHeaders: HeadersInit = body instanceof FormData
      ? options?.headers ?? {}
      : { "Content-Type": "application/json", ...(options?.headers ?? {}) };

    if (Object.keys(baseHeaders).length > 0) {
      init.headers = baseHeaders;
    }

    if (body !== undefined) {
      init.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    const response = await fetch(fullUrl, init);

    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}`,
        response.status,
        "HTTP_ERROR",
      );
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return (await response.json()) as TResponse;
    }

    return (await response.text()) as unknown as TResponse;
  }

  async get<TResponse>(url: string, options?: RequestInit): Promise<TResponse> {
    return this.request<TResponse>("GET", url, undefined, options);
  }

  async post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestInit,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>("POST", url, body, options);
  }

  async put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestInit,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>("PUT", url, body, options);
  }

  async patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestInit,
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>("PATCH", url, body, options);
  }

  async delete<TResponse>(
    url: string,
    options?: RequestInit,
  ): Promise<TResponse> {
    return this.request<TResponse>("DELETE", url, undefined, options);
  }

  async uploadFile<TResponse>(
    url: string,
    formData: FormData,
    options?: RequestInit,
  ): Promise<TResponse> {
    return this.request<TResponse, FormData>("POST", url, formData, {
      ...options,
      headers: {
        // Let the browser set the correct multipart boundary
        ...(options?.headers ?? {}),
      },
      method: "POST",
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
