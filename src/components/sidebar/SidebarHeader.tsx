import { Link } from "react-router";
import { useTheme } from "../../hooks/useTheme";
import React from "react";

const getAssetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;

interface SidebarHeaderProps {
  isExpanded: boolean;
  isMobileOpen: boolean;
}

/**
 * Sidebar header component
 * Follows Single Responsibility Principle - only handles header rendering
 */
export const SidebarHeader: React.FC<SidebarHeaderProps> = React.memo(({
  isExpanded,
  isMobileOpen,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isVisible = isExpanded || isMobileOpen;

  return (
    <div
      className={`py-8 flex ${!isExpanded ? "lg:justify-center" : "justify-start"
        }`}
    >
      <Link to="/">
        {isVisible ? (
          isDark ? <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img src={getAssetPath("logos/Dark1.svg")} alt="Logo" width={120} height={100} /> <p style={{ color: isDark ? "white" : "black", fontSize: '15px' }}>Supply Chain Management</p> </div> : <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img src={getAssetPath("logos/Light1.svg")} alt="Logo" width={120} height={100} /> <p style={{ color: isDark ? "white" : "black", fontSize: '15px' }}>Supply Chain Management</p> </div>
        ) : (
          isDark ? <img src={getAssetPath("logos/Dark1.svg")} alt="Logo" width={150} height={100} /> : <img src={getAssetPath("logos/Light1.svg")} alt="Logo" width={100} height={100} />
        )}
      </Link>
    </div>
  );
});

SidebarHeader.displayName = "SidebarHeader";
