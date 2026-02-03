import { useEffect, useRef } from "react";

/**
 * Custom hook for handling keyboard shortcuts
 * Follows Single Responsibility Principle - only handles keyboard events
 */
export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  options?: {
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
  }
) => {
  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey = false, metaKey = false, shiftKey = false, altKey = false } = options || {};
      
      if (
        event.key === key &&
        event.ctrlKey === ctrlKey &&
        event.metaKey === metaKey &&
        event.shiftKey === shiftKey &&
        event.altKey === altKey
      ) {
        event.preventDefault();
        callbackRef.current();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, options]);
};
