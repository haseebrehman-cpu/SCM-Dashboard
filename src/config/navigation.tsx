import React from "react";
import {
  BoxIcon
} from "../icons";
// import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import FactoryIcon from '@mui/icons-material/Factory';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SummarizeIcon from '@mui/icons-material/Summarize';
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
  // {
  //   icon: <DashboardIcon />,
  //   name: "Dashboard Home",
  //   path: "/"
  // },
  {
    icon: <CloudUploadIcon />,
    name: "Linnworks Files Upload",
    path: "/"
  },
  {
    icon: <ShoppingCartIcon />,
    name: "Purchase Order Report",
    path: "/purchase-order"
  },
  {
    name: "Container Detail Report",
    icon: <BoxIcon />,
    subItems: [
      {
        name: "Stock Report",
        icon: <AssessmentIcon />,
        path: "/stock-report",
      },
      {
        name: "WH Container Report",
        icon: <LocalShippingIcon />,
        path: "/wh-container-report",
      },
      {
        name: "Combined Report",
        icon: <MergeTypeIcon />,
        path: "/combined-report",
      },
    ],
  },
  {
    icon: <FactoryIcon />,
    name: "Production Remaining Report",
    path: "/production-remaining-report",
  },
  {
    icon: <ShowChartIcon />,
    name: "Stock Performance Report",
    path: "/stock-performance-report",
  },
  {
    name: "Summary Dashboard",
    icon: <SummarizeIcon />,
    path: "/summary-dashboard",
  },


];
