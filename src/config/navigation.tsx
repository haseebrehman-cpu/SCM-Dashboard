import React from "react";
import {
  BoxIcon,
  CalenderIcon,
  DollarLineIcon,
  GridIcon,
  ListIcon,
  UserCircleIcon,
} from "../icons";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    icon?: React.ReactNode;
    pro?: boolean;
    new?: boolean;
  }[];
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
    name: "Linnworks Files Upload",
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
    path: "/stock-performance-report",
  },
  {
    name: "Summary Dashboard",
    icon: <ListIcon />,
    path: "/summary-dashboard",
  },
  {
    name: "Container Detail Report",
    icon: <BoxIcon />,
    subItems: [
      {
        name: "Stock Report",
        icon: <DollarLineIcon />,
        path: "/stock-report",
      },
      {
        name: "WH Container Report",
        icon: <BoxIcon />,
        path: "/wh-container-report",
      },
      {
        name: "Combined Report",
        icon: <BoxIcon />,
        path: "/combined-report",
      },
    ],
  },

];
