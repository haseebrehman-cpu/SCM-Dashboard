import React from "react";
import {
  CalenderIcon,
  GridIcon,
  ListIcon,
  UserCircleIcon,
} from "../icons";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

/**
 * Navigation configuration
 * Separated from component to follow Single Responsibility Principle
 */
export const navItems: NavItem[] = [
  {
    icon: <CalenderIcon />,
    name: "Dashboard Home",
    path: "/"
  },
  {
    icon: <CalenderIcon />,
    name: "Linworks Files Upload",
    path: "/file-upload"
  },
  {
    icon: <GridIcon />,
    name: "Purchase Order Report",
    path: "/purchase-order"
  },
  {
    icon: <CalenderIcon />,
    name: "Production Remaining Report",
    path: "/production-remaining-report",
  },
  {
    icon: <UserCircleIcon />,
    name: "Stock Performance Report",
    path: "/stock-perfomance-report",
  },
  {
    name: "Summary Dashboard",
    icon: <ListIcon />,
    path: "/summary-dashboard",
  }
];
