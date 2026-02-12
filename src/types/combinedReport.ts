export type Warehouse = 'CA' | 'DE' | 'UK' | 'US';

// Container information with delivery tracking
export interface ContainerInfo {
  containerNumber: string;
  shipmentDate: string;
  arrivalDate: string;
  status: 'Delivered' | number; // 'Delivered' or days until delivery
}

// Combined Report Row - tracks sales, warehouse stock, and containers across all regions
export interface CombinedReportRow {
  id: number;
  uploadDate: string;
  dataFrom: string;
  categoryName: string;
  itemNumber: string;
  itemTitle: string;
  
  // Last 60 Days Sales by Region
  CA_Last_60_Days_Sale: number;
  DE_Last_60_Days_Sale: number;
  UK_Last_60_Days_Sale: number;
  US_Last_60_Days_Sale: number;
  
  // Warehouse Data by Region
  CA_WH_Data: number;
  DE_WH_Data: number;
  UK_WH_Data: number;
  US_WH_Data: number;
  
  // Dynamic container columns (will be added dynamically)
  [key: string]: string | number | ContainerInfo;
  
  // Summary Quantities by Region
  CA_Containers_Overall_Qty: number;
  CA_Containers_Intransit_Qty: number;
  DE_Containers_Overall_Qty: number;
  DE_Containers_Intransit_Qty: number;
  US_Containers_Overall_Qty: number;
  US_Containers_Intransit_Qty: number;
  UK_Containers_Overall_Qty: number;
  UK_Containers_Intransit_Qty: number;
}

export interface CombinedReportFilters {
  dataFrom?: string;
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}
