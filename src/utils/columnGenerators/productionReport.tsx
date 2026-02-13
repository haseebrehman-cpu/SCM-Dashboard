import { GridColDef } from "@mui/x-data-grid";
import Badge from "../../components/ui/badge/Badge";
import { Warehouse, MonthData } from '../../types/productionReport';
import { MONTHS_DATA } from '../../constants/productionReport';

interface ColumnGeneratorParams {
  selectedWarehouse: Warehouse;
  containerCount: number;
  isDark: boolean;
  currentYear: number;
}

/**
 * Determines which months to display based on current date
 * Q1 (Jan-Apr): Show only Jan-Apr
 * Q2 (May-Aug): Show Jan-Aug
 * Q3+ (Sep-Dec): Show full year
 */
export const getMonthsToShow = (): MonthData[] => {
  const currentMonthNumber = new Date().getMonth() + 1;

  if (currentMonthNumber <= 4) {
    return MONTHS_DATA.slice(0, 4); // Q1
  } else if (currentMonthNumber <= 8) {
    return MONTHS_DATA.slice(0, 8); // Q1 + Q2
  } else {
    return MONTHS_DATA; // Full year
  }
};

/**
 * Generates base columns (non-dynamic columns)
 */
const generateBaseColumns = (): GridColDef[] => [
  {
    field: "itemRangeStatus",
    headerName: "Item Range Status",
    width: 150,
    sortable: true,
    filterable: true,
    renderCell: (params) => {
      const status = params.value as "Active" | "Inactive" | "Pending";
      const colorMap = { Active: "success", Inactive: "error", Pending: "warning" } as const;
      return <Badge size="sm" color={colorMap[status]}>Retail</Badge>;
    },
  },
  { field: "categoryName", headerName: "Category Name", width: 140, sortable: true, filterable: true },
  { field: "itemNumber", headerName: "Item Number", width: 130, sortable: true, filterable: true },
  { field: "itemTitle", headerName: "Item Title", flex: 1, minWidth: 200, sortable: true, filterable: true },
];

/**
 * Generates dynamic columns for each month
 */
const generateMonthColumns = (
  month: MonthData,
  warehouse: Warehouse,
  containerCount: number,
  isDark: boolean,
  currentYear: number
): GridColDef[] => {
  const columns: GridColDef[] = [];
  const currentMonthNumber = new Date().getMonth() + 1;

  // 1. Remaining Opening - Only for January
  if (month.monthCode === "January") {
    columns.push({
      field: `${month.monthCode}Opening`,
      headerName: `${warehouse} ${month.prefix} ${currentYear} Remaining Opening`,
      width: 250,
      sortable: true,
      filterable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ fontWeight: 600, color: isDark ? '#fbbf24' : '#d97706' }}>
          {params.value ?? '0'}
        </span>
      ),
    });
  }

  // 2. Forecasted Order
  columns.push({
    field: `${month.monthCode}`,
    headerName: `${warehouse} ${month.prefix} ${currentYear} Forecasted Order`,
    width: 250,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <span style={{ fontWeight: 600, color: isDark ? '#818cf8' : '#6366f1' }}>
        {params.value ?? '-'}
      </span>
    ),
  });

  // 3. Containers
  for (let i = 1; i <= containerCount; i++) {
    columns.push({
      field: `${month.monthCode}Container${i}`,
      headerName: `${month.prefix}-CTN${i}`,
      width: 100,
      sortable: true,
      filterable: false,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
          <span style={{
            fontWeight: 600,
            fontSize: '0.75rem',
            color: isDark ? 'rgba(255,255,255,0.9)' : 'rgb(31 41 55)'
          }}>
            {month.prefix}-CTN{i}
          </span>
        </div>
      ),
    });
  }

  // 4. Factory Total Dispatch
  columns.push({
    field: `${month.monthCode}TotalDispatch`,
    headerName: `${warehouse} ${month.prefix} ${currentYear} Factory Total Dispatch`,
    width: 270,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
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
    ),
  });

  // 5. Remaining after this month
  columns.push({
    field: `${month.monthCode}warehouseRemYear`,
    headerName: `${warehouse} ${month.prefix} ${currentYear} Remaining`,
    width: 220,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <span style={{ fontWeight: 600, color: isDark ? '#f87171' : '#ef4444' }}>
        {params.value ?? '0'}
      </span>
    ),
  });

  // 6. Quarter-end "Remaining Closed" columns
  const quarterEndColumn = getQuarterEndColumn(month.monthCode, currentMonthNumber, currentYear, isDark);
  if (quarterEndColumn) {
    columns.push(quarterEndColumn);
  }

  return columns;
};

/**
 * Generates quarter-end "Remaining Closed" column if applicable
 */
const getQuarterEndColumn = (
  monthCode: string,
  currentMonthNumber: number,
  currentYear: number,
  isDark: boolean
): GridColDef | null => {
  const quarterEndConfig: Record<string, { condition: boolean; date: string; field: string }> = {
    April: {
      condition: currentMonthNumber < 4,
      date: `30-04-${currentYear}`,
      field: 'closedRemApril'
    },
    August: {
      condition: currentMonthNumber < 8,
      date: `31-08-${currentYear}`,
      field: 'closedRemAugust'
    },
    December: {
      condition: currentMonthNumber <= 12,
      date: `31-12-${currentYear}`,
      field: 'closedRemDecember'
    },
  };

  const config = quarterEndConfig[monthCode];
  if (!config || !config.condition) return null;

  return {
    field: config.field,
    headerName: `REMAINING CLOSED ${config.date}`,
    width: 240,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => (
      <span style={{
        fontWeight: 700,
        color: isDark ? '#fb7185' : '#e11d48',
        backgroundColor: isDark ? 'rgba(251,113,133,0.15)' : 'rgba(225,29,72,0.12)',
        padding: '6px 12px',
        borderRadius: '6px',
      }}>
        {params.value ?? '0'}
      </span>
    ),
  };
};

/**
 * Main function to generate all columns for the DataGrid
 */
export const generateProductionColumns = ({
  selectedWarehouse,
  containerCount,
  isDark,
  currentYear,
}: ColumnGeneratorParams): GridColDef[] => {
  const baseColumns = generateBaseColumns();
  const monthsToShow = getMonthsToShow();

  const dynamicColumns: GridColDef[] = [];

  monthsToShow.forEach((month) => {
    const monthColumns = generateMonthColumns(
      month,
      selectedWarehouse,
      containerCount,
      isDark,
      currentYear
    );
    dynamicColumns.push(...monthColumns);
  });

  return [...baseColumns, ...dynamicColumns];
};
