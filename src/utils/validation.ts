/**
 * Input Validation Utilities
 * Provides functions to validate and sanitize user inputs
 * Helps prevent XSS attacks and injection vulnerabilities
 */

export const validation = {
  /**
   * Sanitize string input to prevent XSS attacks
   */
  sanitizeInput(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  /**
   * Sanitize filename to prevent path traversal and injection attacks
   */
  sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-z0-9.-]/gi, '_')
      .replace(/^\.+/, '') // Remove leading dots
      .slice(0, 255); // Max 255 chars
  },

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.toLowerCase());
  },

  /**
   * Validate URL format
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate file type
   */
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  },

  /**
   * Validate file size
   */
  validateFileSize(file: File, maxSizeMB: number): boolean {
    return file.size <= maxSizeMB * 1024 * 1024;
  },

  /**
   * Validate phone number (basic international format)
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  /**
   * Validate password strength
   */
  isStrongPassword(password: string): {
    isStrong: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain uppercase letters');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain lowercase letters');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain numbers');
    }

    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain special characters (!@#$%^&*)');
    }

    return {
      isStrong: errors.length === 0,
      errors,
    };
  },
};
