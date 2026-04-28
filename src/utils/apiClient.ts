import secureStorage from "./secureStorage";
import { authRefresh } from "../api/auth";

/**
 * A wrapper around the native fetch API that handles authentication
 * and automatic token refresh on 401 errors.
 */
export async function apiClient(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const access = secureStorage.getAuthToken();

  const headers = new Headers(options.headers || {});
  if (access && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  let response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    const refreshToken = secureStorage.getRefreshToken();

    if (refreshToken) {
      try {
        const newTokens = await authRefresh(refreshToken);

        if (newTokens && newTokens.access) {
          secureStorage.setAuthToken(newTokens.access);
          if (newTokens.refresh) {
            secureStorage.setRefreshToken(newTokens.refresh);
          }
          headers.set("Authorization", `Bearer ${newTokens.access}`);
          response = await fetch(url, {
            ...options,
            headers,
          });
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        secureStorage.clear();
        window.location.href = "/scm/signin";
        throw new Error("Session expired. Please log in again.");
      }
    } else {
      secureStorage.clear();
      window.location.href = "/scm/signin";
      throw new Error("No authentication session found.");
    }
  }

  return response;
}

export default apiClient;
