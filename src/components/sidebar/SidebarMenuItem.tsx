import { Link } from "react-router";
import { ChevronDownIcon } from "../../icons";
import { NavItem } from "../../config/navigation";
import React from "react";

interface SidebarMenuItemProps {
  nav: NavItem;
  isActive: (path: string) => boolean;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  isSubmenuOpen: boolean;
  onSubmenuToggle: () => void;
  submenuHeight: string;
  setSubmenuRef: (el: HTMLDivElement | null) => void;
}

/**
 * Sidebar menu item component
 * Follows Single Responsibility Principle - only handles rendering a single menu item
 */
export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = React.memo(({
  nav,
  isActive,
  isExpanded,
  isHovered,
  isMobileOpen,
  isSubmenuOpen,
  onSubmenuToggle,
  submenuHeight,
  setSubmenuRef,
}) => {
  const isVisible = isExpanded || isHovered || isMobileOpen;

  if (nav.subItems) {
    return (
      <li>
        <button
          onClick={onSubmenuToggle}
          className={`menu-item group ${
            isSubmenuOpen ? "menu-item-active" : "menu-item-inactive"
          } cursor-pointer ${
            !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
          }`}
        >
          <span
            className={`menu-item-icon-size ${
              isSubmenuOpen
                ? "menu-item-icon-active"
                : "menu-item-icon-inactive"
            }`}
          >
            {nav.icon}
          </span>
          {isVisible && <span className="menu-item-text">{nav.name}</span>}
          {isVisible && (
            <ChevronDownIcon
              className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                isSubmenuOpen ? "rotate-180 text-brand-500" : ""
              }`}
            />
          )}
        </button>
        {isVisible && (
          <div
            ref={setSubmenuRef}
            className="overflow-hidden transition-all duration-300"
            style={{ height: submenuHeight }}
          >
            <ul className="mt-2 space-y-1 ml-9">
              {nav.subItems.map((subItem) => {
                const subItemIsActive = isActive(subItem.path);
                return (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        subItemIsActive
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              subItemIsActive
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              subItemIsActive
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </li>
    );
  }

  if (!nav.path) return null;

  const itemIsActive = isActive(nav.path);

  return (
    <li>
      <Link
        to={nav.path}
        className={`menu-item group ${
          itemIsActive ? "menu-item-active" : "menu-item-inactive"
        }`}
      >
        <span
          className={`menu-item-icon-size ${
            itemIsActive ? "menu-item-icon-active" : "menu-item-icon-inactive"
          }`}
        >
          {nav.icon}
        </span>
        {isVisible && <span className="menu-item-text">{nav.name}</span>}
      </Link>
    </li>
  );
});

SidebarMenuItem.displayName = "SidebarMenuItem";
