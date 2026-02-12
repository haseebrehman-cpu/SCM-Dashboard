import * as XLSX from 'xlsx';
import { GridColDef } from '@mui/x-data-grid-pro';
import { CombinedReportRow } from '../types/combinedReport';

export const exportCombinedReport = (
  data: CombinedReportRow[],
  columns: GridColDef[],
): void => {
  // Prepare headers
  const headers = columns.map(col => col.headerName || col.field);

  // Prepare data rows
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.field as keyof CombinedReportRow];
      if (typeof value === 'number') {
        return value;
      }
      return value?.toString() || '';
    });
  });

  // Combine headers and rows
  const worksheetData = [headers, ...rows];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  const columnWidths = columns.map(col => ({
    wch: Math.max(15, (col.headerName?.length || 10) + 2)
  }));
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Combined Report');

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `Combined_Report_${timestamp}.xlsx`;

  // Export to file
  XLSX.writeFile(workbook, filename);
};
