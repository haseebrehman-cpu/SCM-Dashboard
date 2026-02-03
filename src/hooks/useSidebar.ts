import { useContext } from "react";
import { SidebarContext } from "../context/sidebarContextValue";

/**
 * Custom hook to access sidebar context
 * Separated from context file to support Fast Refresh
 */
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
