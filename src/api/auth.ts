import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "@tanstack/react-query";
import { authLoginResponse } from "../types/Interfaces/interfaces";
import { getAuthHeaders } from "../utils/apiHeaders";

import { API_BASE_URL } from "./purchaseOrder";
import secureStorage from "../utils/secureStorage";

/**
 * authenticates a user with username and password
 * @param username - The username of the user
 * @param password - The password of the user
 * @param signal - An optional AbortSignal to cancel the request
 * @returns A promise that resolves to the authentication response containing tokens
 */
export async function authLogin({
  username,
  password,
  signal,
}: {
  username: string;
  password: string;
  signal?: AbortSignal;
}): Promise<authLoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Authentication failed: ${response.statusText}`,
      );
    }

    const data: authLoginResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") throw error;
      throw error;
    }
    throw new Error("An unknown error occurred during authentication.");
  }
}

/**
 * Hook for performing authentication login
 * @returns A mutation result object from React Query
 */
export const useAuthLogin = (): UseMutationResult<
  authLoginResponse,
  Error,
  { username: string; password: string; signal?: AbortSignal }
> => {
  return useMutation({
    mutationFn: (variables) => authLogin(variables),
  });
};

/**
 * Log out the current user by calling the backend API and clearing secure storage
 */
export const logout = async (): Promise<void> => {
  try {
    const refresh = secureStorage.getRefreshToken();
    if (refresh) {
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ refresh }),
      }).catch(err => console.error("Logout API failed:", err));
    }
  } finally {
    secureStorage.clear();
    window.location.href = "/scm/signin";
  }
};

/**
 * Hook for performing logout
 * @returns A function to trigger logout
 */
export const useLogout = () => {
  return logout;
};

import { apiClient } from "../utils/apiClient";

export async function authUserInformation(
  signal?: AbortSignal,
): Promise<authLoginResponse> {
  const response = await apiClient(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    signal,
  });
  const responseText = await response.text();
  let data: authLoginResponse;

  try {
    data = JSON.parse(responseText) as authLoginResponse;
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    if (response.status === 524) {
      throw new Error(
        "Cloudflare 524: Server Timeout. The server is taking too long to respond. Please try again later.",
      );
    }
    if (!response.ok) {
      throw new Error(responseText || response.statusText);
    }
    throw error;
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || responseText || response.statusText);
  }
  return data;
}

export const useAuthUserInfo = (): UseQueryResult<authLoginResponse, Error> =>
  useQuery<authLoginResponse, Error>({
    queryKey: ["authUserInformation"],
    queryFn: ({ signal }) => authUserInformation(signal),
    staleTime: 60_000,
  });

/**
 * Refreshes the access token using a refresh token
 * @param refresh - The refresh token
 * @param signal - An optional AbortSignal
 * @returns A promise that resolves to the new tokens
 */
export async function authRefresh(
  refresh: string,
  signal?: AbortSignal,
): Promise<{ access: string; refresh: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Token refresh failed: ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") throw error;
      throw error;
    }
    throw new Error("An unknown error occurred during token refresh.");
  }
}
