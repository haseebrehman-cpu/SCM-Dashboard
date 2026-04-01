/**
 * Configuration constants for Summary Dashboard
 * Separated from component to follow Single Responsibility Principle
 */

export interface SummaryDashboardRow {
  id: number;
  upload_date: string;
  warehouse_code: string;
  category_name: string;
  itemNumber: string;
  itemTitle: string;
  wh_stock: number;
  fba_wh_cover_day: number;
  all_stock: number;
  dispatch_date_cover: number;
  max_daily_consumption: number;
  reason1: string;
  reason2: string;
  reason3: string;
  reason4: string;
  remaining: number;
  status: string;
  factory_comment: string
}

export const STATUS_OPTIONS = [
  "Most High Selling Item – High Priority",
  "High Selling Item – High Priority",
  "Moderate Selling Item – Medium Priority",
  "Low Selling Item – Low Priority",
  "No Action Required – FYI Only",
] as const;

export const REASON_OPTIONS = [
  "Currently OOS on FBA until sufficient dispatch.",
  "OOS after 6-20 days until sufficient dispatch.",
  "OOS after 21-40 days until sufficient dispatch.",
  "OOS after 41-60 days until sufficient dispatch.",
  "OOS after 61-80 days until sufficient dispatch.",
] as const;

export const ITEM_TITLES = [
  "MMA SHO",
  "BOXING",
  "CLOTHIN",
  "HAND WI",
  "GYM HOC",
  "PRO DIPP BELTS",
  "GYM ACC",
  "BELTS"
];

export const CATEGORIES = [
  "MMA SHO",
  "BOXING",
  "CLOTHIN",
  "HAND WI",
  "GYM ACC",
  "BELTS",
  "GYM EQUIP",
  "APPAREL"
];
