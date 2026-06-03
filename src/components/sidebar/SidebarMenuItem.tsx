import { Link } from "react-router";
import { ChevronDownIcon } from "../../icons";
import { NavItem } from "../../config/navigation";
import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";

interface SidebarMenuItemProps {
  nav: NavItem;
  isActive: (path: string) => boolean;
  isExpanded: boolean;
  isMobileOpen: boolean;
  isSubmenuOpen: boolean;
  onSubmenuToggle: () => void;
  submenuHeight: string;
  setSubmenuRef: (el: HTMLDivElement | null) => void;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = React.memo(({
  nav,
  isActive,
  isExpanded,
  isMobileOpen,
  isSubmenuOpen,
  onSubmenuToggle,
  submenuHeight,
  setSubmenuRef,
}) => {
  const isVisible = isExpanded || isMobileOpen;
  const itemRef = useRef<HTMLLIElement | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null);

  const openFlyout = () => {
    if (isVisible) return;
    const rect = itemRef.current?.getBoundingClientRect();
    if (!rect) return;
    setFlyoutPos({ top: rect.top, left: rect.right });
  };

  const closeFlyout = () => setFlyoutPos(null);

  if (nav.subItems) {
    return (
      <li
        ref={itemRef}
        className="relative"
        onMouseEnter={openFlyout}
        onMouseLeave={closeFlyout}
      >
        <button
          onClick={onSubmenuToggle}
          className={`menu-item group ${isSubmenuOpen ? "menu-item-active" : "menu-item-inactive"
            } cursor-pointer ${!isExpanded ? "lg:justify-center" : "lg:justify-start"
            }`}
        >
          <span
            className={`menu-item-icon-size ${isSubmenuOpen
              ? "menu-item-icon-active"
              : "menu-item-icon-inactive"
              }`}
          >
            {nav.icon}
          </span>
          {isVisible && <span className="menu-item-text">{nav.name}</span>}
          {isVisible && (
            <ChevronDownIcon
              className={`ml-auto w-5 h-5 transition-transform duration-200 ${isSubmenuOpen ? "rotate-180 text-white" : ""
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
                      className={`menu-dropdown-item ${subItemIsActive
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${subItemIsActive
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${subItemIsActive
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
        {!isVisible && flyoutPos &&
          createPortal(
            <div
              className="fixed z-[9999] w-60 pl-5"
              style={{ top: flyoutPos.top, left: flyoutPos.left }}
              onMouseEnter={openFlyout}
              onMouseLeave={closeFlyout}
            >
              <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {nav.name}
                </p>
                <ul className="space-y-1">
                  {nav.subItems.map((subItem) => {
                    const subItemIsActive = isActive(subItem.path);
                    return (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          onClick={closeFlyout}
                          className={`menu-dropdown-item ${subItemIsActive
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                            }`}
                        >
                          {subItem.icon && (
                            <span className="menu-item-icon-size flex shrink-0 items-center">
                              {subItem.icon}
                            </span>
                          )}
                          <span>{subItem.name}</span>
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto ${subItemIsActive
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                                  } menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${subItemIsActive
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
            </div>,
            document.body
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
        className={`menu-item group ${itemIsActive ? "menu-item-active" : "menu-item-inactive"
          }`}
      >
        <span
          className={`menu-item-icon-size ${itemIsActive ? "menu-item-icon-active" : "menu-item-icon-inactive"
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
