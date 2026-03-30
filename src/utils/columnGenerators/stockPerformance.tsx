import { GridColDef } from "@mui/x-data-grid";
import { ContainerInfo, Warehouse } from '../../types/stockPerformance';

interface ColumnGeneratorParams {
  selectedWarehouse: Warehouse;
  containers: ContainerInfo[];
  isDark: boolean;
  data?: any[];
}

const renderMultiLineHeader = (line1: string, line2?: string, isDark?: boolean) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
    <span style={{ fontWeight: 600, fontSize: '0.7rem', color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>
      {line1}
    </span>
    {line2 && (
      <span style={{ fontSize: '0.65rem', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)' }}>
        {line2}
      </span>
    )}
  </div>
);

const generateBasicColumns = (): GridColDef[] => [
  // {
  //   field: "itemNumber",
  //   headerName: "ItemNumber",
  //   width: 150,
  //   sortable: true,
  //   filterable: true,
  // },
  // {
  //   field: "oldSku",
  //   headerName: "OLD SKU",
  //   width: 120,
  //   sortable: true,
  //   filterable: true,
  // },
  {
    field: "itemTitle",
    headerName: "ItemTitle",
    flex: 1,
    minWidth: 250,
    sortable: true,
    filterable: true,
  },
  {
    field: "categoryName",
    headerName: "Category Name",
    width: 160,
    sortable: true,
    filterable: true,
  },
  {
    field: "whStock",
    headerName: "WH Stock",
    width: 100,
    sortable: true,
    filterable: true,
    headerAlign: "center",
    align: "center",
  },
];

const generateSalesColumns = (isDark: boolean): GridColDef[] => [
  {
    field: "linnLast60DaysSale",
    headerName: "Linn-LAST 60 Days Sale",
    width: 130,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderHeader: () => renderMultiLineHeader("Linn-Last", "60 Days Sale", isDark),
  },
  {
    field: "linnWorksSales",
    headerName: `LINN-Next 60 Days SALE from previous year`,
    width: 160,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderHeader: () => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
        <span style={{ fontWeight: 600, fontSize: '0.65rem', color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>
          Linn-Next
        </span>
        <span style={{ fontSize: '0.6rem', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)' }}>
          60 Days sale from previous year
        </span>
      </div>
    ),
  },
  {
    field: "fbaLast30Days",
    headerName: "FBA-last 30 Days Sale",
    width: 120,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderHeader: () => renderMultiLineHeader("FBA-last 30", "Days Sale", isDark),
  },
  {
    field: "fbaLast7Days",
    headerName: "FBA-last 7 Days Sale",
    width: 110,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderHeader: () => renderMultiLineHeader("FBA-last 7", "Days Sale", isDark),
  },
  {
    field: "fbaStock",
    headerName: "FBA Stock",
    width: 90,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
];

const generateSummaryColumns = (selectedWarehouse: Warehouse, isDark: boolean): GridColDef[] => [
  {
    field: "allStock",
    headerName: "ALL IStock (WH+CTN+FBA)",
    width: 130,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderHeader: () => renderMultiLineHeader("ALL IStock", "(WH+CTN+FBA)", isDark),
    renderCell: (params) => <span style={{ fontWeight: 600 }}>{params.value}</span>,
  },
  {
    field: "maxDc",
    headerName: "Max Daily Consumption",
    width: 220,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "totalCtn",
    headerName: "Total CTN",
    width: 100,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "daysCover",
    headerName: "Days Cover",
    width: 100,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "daysCoverCurrentStock",
    headerName: "Days Cover - Current Stock",
    width: 220,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "dispatchDateCover",
    headerName: "Dispatch Date Cover",
    width: 130,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderHeader: () => renderMultiLineHeader("Dispatch", "Date Cover", isDark),
  },
  {
    field: "daysGap",
    headerName: "Days Gap",
    width: 120,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "stockAfterArrival",
    headerName: "Stock After Arrival",
    width: 180,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "stockDaysAfterArrival",
    headerName: "Stock Days After Arrival",
    width: 210,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "remWarehouse",
    headerName: `Remaining ${selectedWarehouse}`,
    width: 150,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "oosDays",
    headerName: "OOS DAYS",
    width: 110,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const value = params.value as number;
      const color = value > 20 ? '#EF4444' : value > 10 ? '#F59E0B' : '#10B981';
      return <span style={{ fontWeight: 600, color }}>{value}</span>;
    },
  },
];

export const generateStockPerformanceColumns = ({
  selectedWarehouse,
  isDark,
  data,
}: ColumnGeneratorParams): GridColDef[] => {
  const basicColumns = generateBasicColumns();
  const salesColumns = generateSalesColumns(isDark);

  // Dynamic columns from data (Container columns)
  let dynamicColumns: GridColDef[] = [];
  if (data && data.length > 0) {
    const fixedKeys = [
      "upload_date", "warehouse_code", "category_name", "item_number", "wh_stock",
      "linn_last_60days_sale", "linn_next_60days_sale_previousyear", "fba_last_30days_sale",
      "fba_last_07days_sale", "fba_stock", "max_daily_consumption", "total_ctn",
      "all_stock", "days_cover", "days_cover_current_stock", "dispatch_date_cover",
      "days_gap", "stock_after_arrival", "stock_days_after_arrival", "oos_days",
      "FBA+WH_Cover_day", "id", "session_id", "itemNumber", "categoryName",
      "itemTitle", "whStock", "linnLast60DaysSale", "linnWorksSales", "fbaLast30Days",
      "fbaLast7Days", "fbaStock", "allStock", "maxDc", "totalCtn", "daysCover",
      "daysCoverCurrentStock", "dispatchDateCover", "daysGap", "stockAfterArrival",
      "stockDaysAfterArrival", "remWarehouse",
      "oosDays", "item_title", "remaining"
    ];

    // Find all potential dynamic keys from first few rows to be safe
    const allKeys = new Set<string>();
    data.slice(0, 10).forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });

    const dynamicKeys = Array.from(allKeys).filter(key =>
      !fixedKeys.includes(key) && typeof data[0][key] === 'number'
    );

    dynamicColumns = dynamicKeys.map(key => ({
      field: key,
      headerName: `CTN # ${key}`,
      width: 260,
      sortable: true,
      filterable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ fontWeight: 600, color: isDark ? '#fbbf24' : '#d97706' }}>
          {params.value ?? '0'}
        </span>
      )
    }));
  }

  const summaryColumns = generateSummaryColumns(selectedWarehouse, isDark);

  return [...basicColumns, ...salesColumns, ...dynamicColumns, ...summaryColumns];
};
