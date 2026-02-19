import { Link } from "react-router";
import { useTheme } from "../../hooks/useTheme";
import React from "react";

const getAssetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;

interface SidebarHeaderProps {
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}

/**
 * Sidebar header component
 * Follows Single Responsibility Principle - only handles header rendering
 */
export const SidebarHeader: React.FC<SidebarHeaderProps> = React.memo(({
  isExpanded,
  isHovered,
  isMobileOpen,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isVisible = isExpanded || isHovered || isMobileOpen;

  return (
    <div
      className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
    >
      <Link to="/">
        {isVisible ? (
          isDark ? <img src={getAssetPath("logos/Dark.svg")} alt="Logo" width={100} height={100} /> : <img src={getAssetPath("logos/Light.svg")} alt="Logo" width={100} height={100} />
        ) : (
          isDark ? <img src={getAssetPath("logos/Dark.svg")} alt="Logo" width={100} height={100} /> : <img src={getAssetPath("logos/Light.svg")} alt="Logo" width={100} height={100} />
        )}
      </Link>
    </div>
  );
});

SidebarHeader.displayName = "SidebarHeader";
