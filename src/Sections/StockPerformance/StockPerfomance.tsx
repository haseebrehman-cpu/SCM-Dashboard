import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useTheme } from "../../context/ThemeContext";
import { useState, useMemo } from "react";
import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import Badge from "../../components/ui/badge/Badge";

// Warehouse types
type Warehouse = "UK" | "DE" | "US" | "CA";

// Define the TypeScript interface for the table rows
interface StockPerformanceRow {
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

// Container data for each warehouse
const warehouseContainers: Record<Warehouse, { id: string; date: string }[]> = {
  UK: [
    { id: "S-700", date: "31-01-2026" },
    { id: "S-701", date: "31-01-2026" },
    { id: "S-703", date: "14-01-2026" },
    { id: "S-704", date: "21-02-2026" },
    { id: "S-705", date: "21-02-2026" },
    { id: "S-706", date: "22-02-2026" },
    { id: "S-707", date: "" },
    { id: "S-708", date: "" },
  ],
  DE: [
    { id: "D-400", date: "15-01-2026" },
    { id: "D-401", date: "20-01-2026" },
    { id: "D-402", date: "25-01-2026" },
    { id: "D-403", date: "01-02-2026" },
    { id: "D-404", date: "10-02-2026" },
    { id: "D-405", date: "" },
  ],
  US: [
    { id: "U-200", date: "05-01-2026" },
    { id: "U-201", date: "12-01-2026" },
    { id: "U-202", date: "18-01-2026" },
    { id: "U-203", date: "25-01-2026" },
    { id: "U-204", date: "01-02-2026" },
    { id: "U-205", date: "08-02-2026" },
    { id: "U-206", date: "15-02-2026" },
  ],
  CA: [
    { id: "C-100", date: "10-01-2026" },
    { id: "C-101", date: "20-01-2026" },
    { id: "C-102", date: "30-01-2026" },
    { id: "C-103", date: "" },
  ],
};

// Generate sample data
const generateWarehouseData = (): StockPerformanceRow[] => {
  const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Toys", "Books", "Automotive", "Health", "Beauty", "Food"];
  
  return Array(20).fill(0).map((_, index) => {
    const ctn1 = Math.floor(Math.random() * 50);
    const ctn2 = Math.floor(Math.random() * 50);
    const ctn3 = Math.floor(Math.random() * 50);
    const ctn4 = Math.floor(Math.random() * 50);
    const ctn5 = Math.floor(Math.random() * 50);
    const ctn6 = Math.floor(Math.random() * 50);
    const ctn7 = Math.floor(Math.random() * 50);
    const ctn8 = Math.floor(Math.random() * 50);
    const whStock = Math.floor(Math.random() * 500) + 50;
    const fbaStock = Math.floor(Math.random() * 200);
    const totalCtn = ctn1 + ctn2 + ctn3 + ctn4 + ctn5 + ctn6 + ctn7 + ctn8;
    const allStock = whStock + totalCtn + fbaStock;
    const daysCover = Math.floor(Math.random() * 90) + 10;
    
    return {
      id: index + 1,
      itemNumber: `ITM-${String(10000 + index).padStart(6, "0")}`,
      oldSku: `SKU-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`,
      itemTitle: `Product ${index + 1} - ${categories[Math.floor(Math.random() * categories.length)]} Premium Item`,
      categoryName: categories[Math.floor(Math.random() * categories.length)],
      whStock,
      linnLast60DaysSale: Math.floor(Math.random() * 300) + 20,
      linnWorksSales: Math.floor(Math.random() * 500) + 50,
      fbaLast30Days: Math.floor(Math.random() * 150),
      fbaLast7Days: Math.floor(Math.random() * 40),
      fbaStock,
      ctn1,
      ctn2,
      ctn3,
      ctn4,
      ctn5,
      ctn6,
      ctn7,
      ctn8,
      allStock,
      maxDc: Math.floor(Math.random() * 100) + 20,
      totalCtn,
      daysCover,
      daysCoverCurrentStock: Math.floor(daysCover * 0.7),
      dispatchDateCover: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-2026`,
      remWarehouse: Math.floor(Math.random() * 200) + 10,
      oosDays: Math.floor(Math.random() * 30),
    };
  });
};

// Data for each warehouse
const warehouseData: Record<Warehouse, StockPerformanceRow[]> = {
  UK: generateWarehouseData(),
  DE: generateWarehouseData(),
  US: generateWarehouseData(),
  CA: generateWarehouseData(),
};

const paginationModel = { page: 0, pageSize: 10 };

export default function StockPerformance() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();

  // Warehouse selection state
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>("UK");

  // Handle warehouse change
  const handleWarehouseChange = (event: SelectChangeEvent<Warehouse>) => {
    setSelectedWarehouse(event.target.value as Warehouse);
  };

  // Get current warehouse data
  const tableData = warehouseData[selectedWarehouse];
  const containers = warehouseContainers[selectedWarehouse];

  // Define columns dynamically based on selected warehouse
  const columns: GridColDef[] = useMemo(() => {
    // Basic Info columns
    const basicColumns: GridColDef[] = [
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

    // Sales Data columns
    const salesColumns: GridColDef[] = [
      {
        field: "linnLast60DaysSale",
        headerName: "Linn-LAST 60 Days Sale",
        width: 130,
        sortable: true,
        filterable: false,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
            <span style={{ fontWeight: 600, fontSize: '0.7rem', color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>Linn-LAST</span>
            <span style={{ fontSize: '0.65rem', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)' }}>60 Days Sale</span>
          </div>
        ),
      },
      {
        field: "linnWorksSales",
        headerName: `LINN WORKS SALES JAN ${currentYear}-FEB`,
        width: 140,
        sortable: true,
        filterable: false,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
            <span style={{ fontWeight: 600, fontSize: '0.65rem', color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>LINN WORKS</span>
            <span style={{ fontSize: '0.6rem', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)' }}>SALES JAN {currentYear}</span>
            <span style={{ fontSize: '0.6rem', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)' }}>-FEB 20</span>
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
        renderHeader: () => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
            <span style={{ fontWeight: 600, fontSize: '0.7rem', color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>FBA-last 30</span>
            <span style={{ fontSize: '0.65rem', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)' }}>Days Sale</span>
          </div>
        ),
      },
      {
        field: "fbaLast7Days",
        headerName: "FBA-last 7 Days Sale",
        width: 110,
        sortable: true,
        filterable: false,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
            <span style={{ fontWeight: 600, fontSize: '0.7rem', color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>FBA-last 7</span>
            <span style={{ fontSize: '0.65rem', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)' }}>Days Sale</span>
          </div>
        ),
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

    // Container columns (dynamic based on warehouse)
    const containerColumns: GridColDef[] = containers.map((container, index) => ({
      field: `ctn${index + 1}`,
      headerName: `CTN# ${container.id}`,
      width: 100,
      sortable: true,
      filterable: false,
      headerAlign: "center" as const,
      align: "center" as const,
      renderHeader: () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
          <span style={{ fontWeight: 600, fontSize: '0.7rem', color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>CTN#</span>
          <span style={{ fontSize: '0.65rem', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)' }}>{container.id}</span>
          {container.date && <span style={{ fontSize: '0.6rem', opacity: 0.8, color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgb(156 163 175)' }}>{container.date}</span>}
        </div>
      ),
    }));

    // Summary columns
    const summaryColumns: GridColDef[] = [
      {
        field: "allStock",
        headerName: "ALL IStock (WH+CTN+FBA)",
        width: 130,
        sortable: true,
        filterable: false,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
            <span style={{ fontWeight: 600, fontSize: '0.7rem', color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>ALL IStock</span>
            <span style={{ fontSize: '0.6rem', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)' }}>(WH+CTN+FBA)</span>
          </div>
        ),
        renderCell: (params) => (
          <span style={{ fontWeight: 600 }}>{params.value}</span>
        ),
      },
      {
        field: "maxDc",
        headerName: "Max DC",
        width: 80,
        sortable: true,
        filterable: false,
        headerAlign: "center",
        align: "center",
      },
      {
        field: "totalCtn",
        headerName: "TOTAL-CTN",
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
        width: 130,
        sortable: true,
        filterable: false,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
            <span style={{ fontWeight: 600, fontSize: '0.7rem', color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>Days Cover</span>
            <span style={{ fontSize: '0.6rem', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)' }}>Current Stock</span>
          </div>
        ),
      },
      {
        field: "dispatchDateCover",
        headerName: "Dispatch Date Cover",
        width: 130,
        sortable: true,
        filterable: false,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
            <span style={{ fontWeight: 600, fontSize: '0.7rem', color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>Dispatch</span>
            <span style={{ fontSize: '0.6rem', color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)' }}>Date Cover</span>
          </div>
        ),
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
          return (
            <span style={{ fontWeight: 600, color }}>{value}</span>
          );
        },
      },
    ];

    return [...basicColumns, ...salesColumns, ...containerColumns, ...summaryColumns];
  }, [selectedWarehouse, containers, currentYear, isDark]);

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      {/* Header with title and warehouse selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Stock Performance Report
        </h3>
        
        <FormControl 
          size="small" 
          sx={{ 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
              '& fieldset': {
                borderColor: isDark ? 'rgb(55 65 81)' : 'rgb(209 213 219)',
              },
              '&:hover fieldset': {
                borderColor: isDark ? 'rgb(75 85 99)' : 'rgb(156 163 175)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#465fff',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
              '&.Mui-focused': {
                color: '#465fff',
              },
            },
            '& .MuiSelect-select': {
              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
            },
            '& .MuiSelect-icon': {
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
            },
          }}
        >
          <InputLabel id="warehouse-select-label">Select Warehouse</InputLabel>
          <Select
            labelId="warehouse-select-label"
            id="warehouse-select"
            value={selectedWarehouse}
            label="Select Warehouse"
            onChange={handleWarehouseChange}
          >
            <MenuItem value="UK">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇬🇧</span>
                <span>UK - United Kingdom</span>
              </div>
            </MenuItem>
            <MenuItem value="DE">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇩🇪</span>
                <span>DE - Germany</span>
              </div>
            </MenuItem>
            <MenuItem value="US">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇺🇸</span>
                <span>US - United States</span>
              </div>
            </MenuItem>
            <MenuItem value="CA">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇨🇦</span>
                <span>CA - Canada</span>
              </div>
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Warehouse indicator badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">Showing data for:</span>
        <Badge size="md" color="primary">
          {selectedWarehouse} Warehouse
        </Badge>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          • {containers.length} Containers
        </span>
      </div>

      {/* DataGrid */}
      <DataGrid
        rows={tableData}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 15, 25]}
        autoHeight
        disableRowSelectionOnClick
        sx={{
          border: 'none',
          backgroundColor: 'transparent',
          width: '100%',
          '& .MuiDataGrid-main': {
            backgroundColor: 'transparent',
          },
          '& .MuiDataGrid-container--top [role=row]': {
            backgroundColor: 'transparent',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: 'transparent',
          },
          '& .MuiDataGrid-row': {
            backgroundColor: 'transparent !important',
          },
          '& .MuiDataGrid-cell': {
            borderColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
            color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
            backgroundColor: 'transparent',
          },
          '& .MuiDataGrid-columnHeaders': {
            borderColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
            backgroundColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: 'transparent',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
            fontWeight: 600,
          },
          '& .MuiDataGrid-footerContainer': {
            borderColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
            backgroundColor: 'transparent',
          },
          '& .MuiTablePagination-root': {
            color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
          },
          '& .MuiIconButton-root': {
            color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05) !important' : 'rgba(0, 0, 0, 0.04) !important',
          },
          '& .MuiDataGrid-selectedRowCount': {
            color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
          },
          '& .MuiDataGrid-columnSeparator': {
            color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgb(229 231 235)',
          },
          '& .MuiDataGrid-sortIcon': {
            color: isDark ? '#000' : 'rgb(107 114 128)',
          },
          '& .MuiDataGrid-menuIconButton': {
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
          },
          '& .MuiDataGrid-iconButtonContainer': {
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
          },
          '& .MuiDataGrid-columnHeader .MuiIconButton-root': {
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
          },
        }}
      />
    </div>
  );
}
