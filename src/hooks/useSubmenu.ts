import { useState, useEffect, useCallback, useRef } from "react";

type SubmenuState = {
  type: "main";
  index: number;
} | null;

/**
 * Custom hook for managing submenu state and height calculations
 * Follows Single Responsibility Principle - only handles submenu logic
 */
export const useSubmenu = (navItems: Array<{ subItems?: Array<{ path: string }> }>, isActive: (path: string) => boolean) => {
  const [openSubmenu, setOpenSubmenu] = useState<SubmenuState>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Auto-open submenu if active route matches
  useEffect(() => {
    let submenuMatched = false;
    
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              type: "main",
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [navItems, isActive]);

  // Calculate submenu height when opened
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = useCallback((index: number, menuType: "main") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  }, []);

  const getSubmenuHeight = useCallback((menuType: "main", index: number) => {
    const key = `${menuType}-${index}`;
    return openSubmenu?.type === menuType && openSubmenu?.index === index
      ? `${subMenuHeight[key]}px`
      : "0px";
  }, [openSubmenu, subMenuHeight]);

  const isSubmenuOpen = useCallback((menuType: "main", index: number) => {
    return openSubmenu?.type === menuType && openSubmenu?.index === index;
  }, [openSubmenu]);

  const setSubmenuRef = useCallback((menuType: "main", index: number) => {
    return (el: HTMLDivElement | null) => {
      subMenuRefs.current[`${menuType}-${index}`] = el;
    };
  }, []);

  return {
    openSubmenu,
    handleSubmenuToggle,
    getSubmenuHeight,
    isSubmenuOpen,
    setSubmenuRef,
  };
};
