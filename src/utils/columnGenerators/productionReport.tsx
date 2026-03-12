import { GridColDef } from "@mui/x-data-grid";
import { Warehouse } from '../../types/productionReport';
import { ProductionRemainingRow } from "../../types/Interfaces/interfaces";

interface ColumnGeneratorParams {
  selectedWarehouse: Warehouse;
  isDark: boolean;
  currentYear: number;
  data?: ProductionRemainingRow[];
}

// The column which are common for all the warehouses
const generateBaseColumns = (): GridColDef[] => [
  // { field: "warehouse_region", headerName: "Warehouse Region", width: 140, sortable: true, filterable: true },
  { field: "category_name", headerName: "Category Name", width: 140, sortable: true, filterable: true },
  { field: "item_number", headerName: "Item Number", width: 130, sortable: true, filterable: true },
  { field: "item_number_old", headerName: "Item Number Old", width: 130, sortable: true, filterable: true },
  { field: "item_title", headerName: "Item Title", minWidth: 250, sortable: true, filterable: true },
];

// below is the function which will dynamically generate the columns
export const generateProductionColumns = ({
  isDark,
  data,
}: ColumnGeneratorParams): GridColDef[] => {
  const baseColumns = generateBaseColumns();

  if (!data || data.length === 0) {
    return baseColumns;
  }

  const firstRow = data[0];
  const dynamicKeys = Object.keys(firstRow).filter(
    (key) => !["category_name", "item_number", "item_number_old", "item_title", "id"].includes(key)
  );

  const dynamicColumns: GridColDef[] = dynamicKeys.map((key) => {
    const headerName = key.replace(/_/g, " ");
    let width = 180;
    let renderCell: GridColDef["renderCell"];

    if (key.startsWith("FORECASTED Order")) {
      width = 220;
      renderCell = (params) => (
        <span style={{ fontWeight: 600, color: isDark ? '#818cf8' : '#6366f1' }}>
          {params.value ?? '-'}
        </span>
      );
    } else if (key.includes("Total") && key.includes("Dispatch")) {
      width = 250;
      renderCell = (params) => (
        <span style={{
          fontWeight: 600,
          color: isDark ? '#34d399' : '#059669',
          backgroundColor: isDark ? 'rgba(52,211,153,0.1)' : 'rgba(5,150,105,0.1)',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          {params.value ?? '-'}
        </span>
      );
    } else if (key.startsWith("Remaining ") || key.startsWith("REMAINING CLOSED")) {
      width = key.startsWith("REMAINING CLOSED") ? 240 : 200;
      const isClosed = key.startsWith("REMAINING CLOSED");
      renderCell = (params) => (
        <span style={{
          fontWeight: isClosed ? 700 : 600,
          color: isClosed
            ? (isDark ? '#fb7185' : '#e11d48')
            : (isDark ? '#f87171' : '#ef4444'),
          backgroundColor: isClosed
            ? (isDark ? 'rgba(251,113,133,0.15)' : 'rgba(225,29,72,0.12)')
            : 'transparent',
          padding: isClosed ? '6px 12px' : '0',
          borderRadius: isClosed ? '6px' : '0',
        }}>
          {params.value ?? '0'}
        </span>
      );
    } else {
      // For warehouse opening or other numeric columns
      width = 150;
      renderCell = (params) => (
        <span style={{ fontWeight: 600, color: isDark ? '#fbbf24' : '#d97706' }}>
          {params.value ?? '0'}
        </span>
      );
    }

    return {
      field: key,
      headerName,
      width,
      sortable: true,
      filterable: false,
      headerAlign: "center",
      align: "center",
      renderCell,
    };
  });

  return [...baseColumns, ...dynamicColumns];
};

