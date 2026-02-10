export type Warehouse = "UK" | "DE" | "US" | "CA";

export interface ContainerInfo {
  id: string;
  date: string;
}

export interface StockPerformanceRow {
  id: number;
  itemNumber: string;
  oldSku: string;
  itemTitle: string;
  categoryName: string;
  whStock: number;
  linnLast60DaysSale: number;
  linnWorksSales: number;
  fbaLast30Days: number;
  fbaLast7Days: number;
  fbaStock: number;
  ctn1: number;
  ctn2: number;
  ctn3: number;
  ctn4: number;
  ctn5: number;
  ctn6: number;
  ctn7: number;
  ctn8: number;
  allStock: number;
  maxDc: number;
  totalCtn: number;
  daysCover: number;
  daysCoverCurrentStock: number;
  dispatchDateCover: string;
  remWarehouse: number;
  oosDays: number;
}
