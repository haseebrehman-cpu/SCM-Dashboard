import { GridColDef } from "@mui/x-data-grid";
import { ProductionReportRow, Warehouse } from './types';
import { exportToCsv } from "../../utils/exportToCsv";

/**
 * Exports production report data to CSV format
 */
export const exportProductionReport = (
  tableData: ProductionReportRow[],
  columns: GridColDef[],
  selectedWarehouse: Warehouse
): void => {
  if (!tableData || tableData.length === 0) {
    return;
  }

  const csvData = tableData.map((row) => {
    const csvRow: Record<string, string | number> = {};
    columns.forEach((col) => {
      const rawValue = row[col.field as keyof ProductionReportRow];
      // Ensure strictly no undefined/null values in CSV
      csvRow[col.headerName || col.field] = rawValue === undefined || rawValue === null ? '' : (rawValue as string | number);
    });
    return csvRow;
  });

  const fileName = `Production-Report-${selectedWarehouse}-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCsv(csvData, fileName);
};
