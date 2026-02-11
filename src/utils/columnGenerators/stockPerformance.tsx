import { GridColDef } from "@mui/x-data-grid";
import { ContainerInfo, Warehouse } from '../../types/stockPerformance';

interface ColumnGeneratorParams {
  selectedWarehouse: Warehouse;
  containers: ContainerInfo[];
  isDark: boolean;
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
  {
    field: "itemNumber",
    headerName: "ItemNumber",
    width: 130,
    sortable: true,
    filterable: true,
  },
  {
    field: "oldSku",
    headerName: "OLD SKU",
    width: 120,
    sortable: true,
    filterable: true,
  },
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
    width: 140,
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

const generateContainerColumns = (containers: ContainerInfo[], isDark: boolean): GridColDef[] => {
  return containers.map((container, index) => ({
    field: `ctn${index + 1}`,
    headerName: `CTN# ${container.id}`,
    width: 100,
    sortable: true,
    filterable: false,
    headerAlign: "center" as const,
    align: "center" as const,
    renderHeader: () => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
        <span style={{ fontWeight: 600, fontSize: '0.7rem', color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>
          CTN#
        </span>
        <span style={{ fontSize: '0.65rem', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)' }}>
          {container.id}
        </span>
        {container.date && (
          <span style={{ fontSize: '0.6rem', opacity: 0.8, color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgb(156 163 175)' }}>
            {container.date}
          </span>
        )}
      </div>
    ),
  }));
};

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
    width: 180,
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
    width: 180,
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
    field: "remWarehouse",
    headerName: `Rem ${selectedWarehouse}`,
    width: 100,
    sortable: true,
    filterable: false,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "oosDays",
    headerName: "OOS DAYS",
    width: 100,
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
  containers,
  isDark,
}: ColumnGeneratorParams): GridColDef[] => {
  const basicColumns = generateBasicColumns();
  const salesColumns = generateSalesColumns(isDark);
  const containerColumns = generateContainerColumns(containers, isDark);
  const summaryColumns = generateSummaryColumns(selectedWarehouse, isDark);

  return [...basicColumns, ...salesColumns, ...containerColumns, ...summaryColumns];
};
