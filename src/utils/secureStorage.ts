/**
 * Secure Storage Utility
 * Uses sessionStorage for sensitive data instead of localStorage
 * Provides safe methods for storing and retrieving auth tokens and user data
 */

export const secureStorage = {
  /**
   * Set authentication token in secure storage
   * Uses sessionStorage instead of localStorage for sensitive auth data
   */
  setAuthToken(token: string): void {
    try {
      sessionStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Failed to store auth token:', error);
    }
  },

  /**
   * Retrieve authentication token from secure storage
   */
  getAuthToken(): string | null {
    try {
      return sessionStorage.getItem('auth_token');
    } catch (error) {
      console.error('Failed to retrieve auth token:', error);
      return null;
    }
  },

  /**
   * Remove authentication token from secure storage
   */
  removeAuthToken(): void {
    try {
      sessionStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Failed to remove auth token:', error);
    }
  },

  /**
   * Set user information in secure storage
   */
  setUser(user: Record<string, unknown>): void {
    try {
      sessionStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  },

  /**
   * Retrieve user information from secure storage
   */
  getUser(): Record<string, unknown> | null {
    try {
      const user = sessionStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  },

  /**
   * Remove user information from secure storage
   */
  removeUser(): void {
    try {
      sessionStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to remove user data:', error);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getAuthToken() !== null;
  },

  /**
   * Clear all secure storage (on logout)
   */
  clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear secure storage:', error);
    }
  },
};

export default secureStorage;
