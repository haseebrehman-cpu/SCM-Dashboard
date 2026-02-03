import { useState, useCallback, useEffect, useRef } from "react";

/**
 * Custom hook for managing dropdown state
 * Follows Single Responsibility Principle - only handles dropdown open/close logic
 */
export const useDropdown = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openDropdown = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  return {
    isOpen,
    toggleDropdown,
    openDropdown,
    closeDropdown,
    dropdownRef,
  };
};
