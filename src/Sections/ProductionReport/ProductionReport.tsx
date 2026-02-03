import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Badge from "../../components/ui/badge/Badge";
import { useTheme } from "../../context/ThemeContext";
import { useState, useMemo } from "react";
import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";

// Warehouse types
type Warehouse = "UK" | "DE" | "US" | "CA";

// Define the TypeScript interface for the table rows
interface ProductionReportRow {
  id: number;
  itemRangeStatus: "Active" | "Inactive" | "Pending";
  categoryName: string;
  itemNumber: string;
  itemTitle: string;
  warehouseRemYear: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  container1: number;
  container2: number;
  container3: number;
  container4?: number;
  container5?: number;
  remWarehouse: number;
}

// Generate random container numbers
const generateContainerNumber = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const prefix = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `${prefix}${number}`;
};

// Container numbers for each warehouse
const warehouseContainers: Record<Warehouse, string[]> = {
  UK: [generateContainerNumber(), generateContainerNumber(), generateContainerNumber()],
  DE: [generateContainerNumber(), generateContainerNumber(), generateContainerNumber(), generateContainerNumber()],
  US: [generateContainerNumber(), generateContainerNumber(), generateContainerNumber(), generateContainerNumber(), generateContainerNumber()],
  CA: [generateContainerNumber(), generateContainerNumber()],
};

// Generate sample data for each warehouse
const generateWarehouseData = (): ProductionReportRow[] => {
  const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Toys", "Books", "Automotive", "Health"];
  const statuses: Array<"Active" | "Inactive" | "Pending"> = ["Active", "Inactive", "Pending"];
  
  return Array(15).fill(0).map((_, index) => ({
    id: index + 1,
    itemRangeStatus: statuses[Math.floor(Math.random() * statuses.length)],
    categoryName: categories[Math.floor(Math.random() * categories.length)],
    itemNumber: `ITM-${String(1000 + index).padStart(5, "0")}`,
    itemTitle: `Product Item ${index + 1} - ${categories[Math.floor(Math.random() * categories.length)]} Item`,
    warehouseRemYear: Math.floor(Math.random() * 500) + 50,
    jan: Math.floor(Math.random() * 200),
    feb: Math.floor(Math.random() * 200),
    mar: Math.floor(Math.random() * 200),
    apr: Math.floor(Math.random() * 200),
    may: Math.floor(Math.random() * 200),
    jun: Math.floor(Math.random() * 200),
    jul: Math.floor(Math.random() * 200),
    aug: Math.floor(Math.random() * 200),
    sep: Math.floor(Math.random() * 200),
    oct: Math.floor(Math.random() * 200),
    nov: Math.floor(Math.random() * 200),
    dec: Math.floor(Math.random() * 200),
    container1: Math.floor(Math.random() * 100),
    container2: Math.floor(Math.random() * 100),
    container3: Math.floor(Math.random() * 100),
    container4: Math.floor(Math.random() * 100),
    container5: Math.floor(Math.random() * 100),
    remWarehouse: Math.floor(Math.random() * 300) + 20,
  }));
};

// Data for each warehouse
const warehouseData: Record<Warehouse, ProductionReportRow[]> = {
  UK: generateWarehouseData(),
  DE: generateWarehouseData(),
  US: generateWarehouseData(),
  CA: generateWarehouseData(),
};

const paginationModel = { page: 0, pageSize: 10 };

export default function ProductionReport() {
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
  const containerNumbers = warehouseContainers[selectedWarehouse];

  // Define columns dynamically based on selected warehouse
  const columns: GridColDef[] = useMemo(() => {
    const baseColumns: GridColDef[] = [
      {
        field: "itemRangeStatus",
        headerName: "Item Range Status",
        width: 140,
        sortable: true,
        filterable: true,
        renderCell: (params) => {
          const status = params.value as "Active" | "Inactive" | "Pending";
          const colorMap = {
            Active: "success",
            Inactive: "error",
            Pending: "warning",
          } as const; 
          return (
            <Badge size="sm" color={colorMap[status]}>
              {status}
            </Badge>
          );
        },
      },
      {
        field: "categoryName",
        headerName: "Category Name",
        width: 140,
        sortable: true,
        filterable: true,
      },
      {
        field: "itemNumber",
        headerName: "Item Number",
        width: 130,
        sortable: true,
        filterable: true,
      },
      {
        field: "itemTitle",
        headerName: "Item Title",
        flex: 1,
        minWidth: 200,
        sortable: true,
        filterable: true,
      },
      {
        field: "warehouseRemYear",
        headerName: `${selectedWarehouse}-Rem-${currentYear}`,
        width: 130,
        sortable: true,
        filterable: false,
        headerAlign: "center",
        align: "center",
      },
    ];

    // Monthly columns
    const months = [
      { field: "jan", name: "Jan" },
      { field: "feb", name: "Feb" },
      { field: "mar", name: "Mar" },
      { field: "apr", name: "Apr" },
      { field: "may", name: "May" },
      { field: "jun", name: "Jun" },
      { field: "jul", name: "Jul" },
      { field: "aug", name: "Aug" },
      { field: "sep", name: "Sep" },
      { field: "oct", name: "Oct" },
      { field: "nov", name: "Nov" },
      { field: "dec", name: "Dec" },
    ];

    const monthColumns: GridColDef[] = months.map((month) => ({
      field: month.field,
      headerName: `${selectedWarehouse} ${month.name}`,
      width: 90,
      sortable: true,
      filterable: false,
      headerAlign: "center" as const,
      align: "center" as const,
    }));

    // Container columns (dynamic based on warehouse)
    const containerColumns: GridColDef[] = containerNumbers.map((containerNum, index) => ({
      field: `container${index + 1}`,
      headerName: `${selectedWarehouse}CTN-${containerNum.slice(0, 8)}`,
      width: 130,
      sortable: true,
      filterable: false,
      headerAlign: "center" as const,
      align: "center" as const,
      renderHeader: () => (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          lineHeight: 1.2,
        }}>
          <span style={{ 
            fontWeight: 600, 
            fontSize: '0.75rem',
            color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' 
          }}>
            {selectedWarehouse}CTN
          </span>
          <span style={{ 
            fontSize: '0.65rem', 
            opacity: 0.8,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)' 
          }}>
            {containerNum.slice(0, 11)}
          </span>
        </div>
      ),
    }));

    // Remaining warehouse column
    const remColumn: GridColDef = {
      field: "remWarehouse",
      headerName: `Rem ${selectedWarehouse}`,
      width: 110,
      sortable: true,
      filterable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span style={{ 
          fontWeight: 600, 
          color: isDark ? '#60a5fa' : '#2563eb' 
        }}>
          {params.value}
        </span>
      ),
    };

    return [...baseColumns, ...monthColumns, ...containerColumns, remColumn];
  }, [selectedWarehouse, containerNumbers, currentYear, isDark]);

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      {/* Header with title and warehouse selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Production Remaining Report
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
          • {containerNumbers.length} Containers
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
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
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
