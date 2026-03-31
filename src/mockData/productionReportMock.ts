import { Warehouse, ProductionReportRow } from '../types/productionReport';

/**
 * NOTE:
 * This file is only used by unit tests as a “shape fixture”.
 * Runtime data should come from the API via hooks, not from mock arrays.
 */
export const warehouseContainers: Record<Warehouse, string[]> = {
  UK: [],
  DE: [],
  US: [],
  CA: [],
};

export const warehouseData: Record<Warehouse, ProductionReportRow[]> = {
  UK: [],
  DE: [],
  US: [],
  CA: [],
};
