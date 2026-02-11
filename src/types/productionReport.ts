import { Warehouse } from './common';

export type { Warehouse };

// Define the TypeScript interface for the table rows
export interface ProductionReportRow {
  id: number;
  itemRangeStatus: "Active" | "Inactive" | "Pending";
  categoryName: string;
  itemNumber: string;
  itemTitle: string;
  warehouseRemYear: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  // January containers and dispatch
  janContainer1: number;
  janContainer2: number;
  janContainer3: number;
  janContainer4?: number;
  janContainer5?: number;
  janTotalDispatch: number;
  // February containers and dispatch
  febContainer1: number;
  febContainer2: number;
  febContainer3: number;
  febContainer4?: number;
  febContainer5?: number;
  febTotalDispatch: number;
  // March containers and dispatch
  marContainer1: number;
  marContainer2: number;
  marContainer3: number;
  marContainer4?: number;
  marContainer5?: number;
  marTotalDispatch: number;
  // April containers and dispatch
  aprContainer1: number;
  aprContainer2: number;
  aprContainer3: number;
  aprContainer4?: number;
  aprContainer5?: number;
  aprTotalDispatch: number;
  // May containers and dispatch
  mayContainer1: number;
  mayContainer2: number;
  mayContainer3: number;
  mayContainer4?: number;
  mayContainer5?: number;
  mayTotalDispatch: number;
  // June containers and dispatch
  junContainer1: number;
  junContainer2: number;
  junContainer3: number;
  junContainer4?: number;
  junContainer5?: number;
  junTotalDispatch: number;
  // July containers and dispatch
  julContainer1: number;
  julContainer2: number;
  julContainer3: number;
  julContainer4?: number;
  julContainer5?: number;
  julTotalDispatch: number;
  // August containers and dispatch
  augContainer1: number;
  augContainer2: number;
  augContainer3: number;
  augContainer4?: number;
  augContainer5?: number;
  augTotalDispatch: number;
  // September containers and dispatch
  sepContainer1: number;
  sepContainer2: number;
  sepContainer3: number;
  sepContainer4?: number;
  sepContainer5?: number;
  sepTotalDispatch: number;
  // October containers and dispatch
  octContainer1: number;
  octContainer2: number;
  octContainer3: number;
  octContainer4?: number;
  octContainer5?: number;
  octTotalDispatch: number;
  // November containers and dispatch
  novContainer1: number;
  novContainer2: number;
  novContainer3: number;
  novContainer4?: number;
  novContainer5?: number;
  novTotalDispatch: number;
  // December containers and dispatch
  decContainer1: number;
  decContainer2: number;
  decContainer3: number;
  decContainer4?: number;
  decContainer5?: number;
  decTotalDispatch: number;
  remWarehouse: number;
}

export interface MonthData {
  monthCode: string;
  prefix: string;
}
