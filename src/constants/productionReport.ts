import { MonthData } from '../types/productionReport';

export const MONTHS_DATA: MonthData[] = [
  { monthCode: "January", prefix: "Jan" },
  { monthCode: "February", prefix: "Feb" },
  { monthCode: "March", prefix: "Mar" },
  { monthCode: "April", prefix: "Apr" },
  { monthCode: "May", prefix: "May" },
  { monthCode: "June", prefix: "Jun" },
  { monthCode: "July", prefix: "Jul" },
  { monthCode: "August", prefix: "Aug" },
  { monthCode: "September", prefix: "Sep" },
  { monthCode: "October", prefix: "Oct" },
  { monthCode: "November", prefix: "Nov" },
  { monthCode: "December", prefix: "Dec" },
];

export const PAGINATION_MODEL = { page: 0, pageSize: 500 };

export const WAREHOUSE_OPTIONS = [
  { value: "UK", label: "UK - United Kingdom", flag: "🇬🇧" },
  { value: "DE", label: "DE - Germany", flag: "🇩🇪" },
  { value: "US", label: "US - United States", flag: "🇺🇸" },
  { value: "CA", label: "CA - Canada", flag: "🇨🇦" },
] as const;
