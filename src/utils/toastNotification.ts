/**
 * Toast Notification Utility
 * Simple wrapper that shows notifications in the UI
 * Uses the Toaster component from react-hot-toast in main.tsx
 */

// Store toast notifications in a simple store
const toastQueue: Array<{ type: 'success' | 'error'; message: string }> = [];

// Try to get the global toast function (set by Toaster component in main.tsx)
interface WindowWithToast extends Window {
  __toastFn?: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

const getGlobalToast = () => {
  return (window as unknown as WindowWithToast).__toastFn || null;
};

export const showToast = {
  /**
   * Show success message
   */
  success: (message: string) => {
    const globalToast = getGlobalToast();
    if (globalToast?.success) {
      globalToast.success(message);
    } else {
      // Fallback to console
      console.log('✅ Success:', message);
      toastQueue.push({ type: 'success', message });
    }
  },

  /**
   * Show error message
   */
  error: (message: string) => {
    const globalToast = getGlobalToast();
    if (globalToast?.error) {
      globalToast.error(message);
    } else {
      // Fallback to console
      console.error('❌ Error:', message);
      toastQueue.push({ type: 'error', message });
    }
  },
};
