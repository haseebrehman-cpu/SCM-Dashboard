import { useContext } from "react";
import { ThemeContext } from "../context/themeContextValue";

/**
 * Custom hook to access theme context
 * Separated from context provider file to support Fast Refresh
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
