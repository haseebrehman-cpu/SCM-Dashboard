import secureStorage from "./secureStorage";

/**
 * Generates authentication headers for API requests
 * @returns An object containing the Authorization header if the token is present
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = secureStorage.getAuthToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Generates common headers including Content-Type and Authorization
 * @returns An object containing standard API headers
 */
export const getCommonHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };
};
