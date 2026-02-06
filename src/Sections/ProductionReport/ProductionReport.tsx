import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Badge from "../../components/ui/badge/Badge";
import { useTheme } from "../../context/ThemeContext";
import { useState, useMemo } from "react";
import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent, Button } from "@mui/material";
import { exportToCsv } from "../../utils/exportToCsv";
import { exportToPng } from "../../utils/exportToPng";
import { DataGridHeader } from "../../components/DataGrid/DataGridHeader";

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
  // January containers and dispatch
  janContainer1: number;
  janContainer2: number;
  janContainer3: number;
  janContainer4?: number;
  janContainer5?: number;
  janTotalDispatch: number;
  // February containers and dispatch
  febContainer1: number;
  febContainer2: number;
  febContainer3: number;
  febContainer4?: number;
  febContainer5?: number;
  febTotalDispatch: number;
  // March containers and dispatch
  marContainer1: number;
  marContainer2: number;
  marContainer3: number;
  marContainer4?: number;
  marContainer5?: number;
  marTotalDispatch: number;
  // April containers and dispatch
  aprContainer1: number;
  aprContainer2: number;
  aprContainer3: number;
  aprContainer4?: number;
  aprContainer5?: number;
  aprTotalDispatch: number;
  // May containers and dispatch
  mayContainer1: number;
  mayContainer2: number;
  mayContainer3: number;
  mayContainer4?: number;
  mayContainer5?: number;
  mayTotalDispatch: number;
  // June containers and dispatch
  junContainer1: number;
  junContainer2: number;
  junContainer3: number;
  junContainer4?: number;
  junContainer5?: number;
  junTotalDispatch: number;
  // July containers and dispatch
  julContainer1: number;
  julContainer2: number;
  julContainer3: number;
  julContainer4?: number;
  julContainer5?: number;
  julTotalDispatch: number;
  // August containers and dispatch
  augContainer1: number;
  augContainer2: number;
  augContainer3: number;
  augContainer4?: number;
  augContainer5?: number;
  augTotalDispatch: number;
  // September containers and dispatch
  sepContainer1: number;
  sepContainer2: number;
  sepContainer3: number;
  sepContainer4?: number;
  sepContainer5?: number;
  sepTotalDispatch: number;
  // October containers and dispatch
  octContainer1: number;
  octContainer2: number;
  octContainer3: number;
  octContainer4?: number;
  octContainer5?: number;
  octTotalDispatch: number;
  // November containers and dispatch
  novContainer1: number;
  novContainer2: number;
  novContainer3: number;
  novContainer4?: number;
  novContainer5?: number;
  novTotalDispatch: number;
  // December containers and dispatch
  decContainer1: number;
  decContainer2: number;
  decContainer3: number;
  decContainer4?: number;
  decContainer5?: number;
  decTotalDispatch: number;
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
    // January containers and dispatch
    janContainer1: Math.floor(Math.random() * 100),
    janContainer2: Math.floor(Math.random() * 100),
    janContainer3: Math.floor(Math.random() * 100),
    janContainer4: Math.floor(Math.random() * 100),
    janContainer5: Math.floor(Math.random() * 100),
    janTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // February containers and dispatch
    febContainer1: Math.floor(Math.random() * 100),
    febContainer2: Math.floor(Math.random() * 100),
    febContainer3: Math.floor(Math.random() * 100),
    febContainer4: Math.floor(Math.random() * 100),
    febContainer5: Math.floor(Math.random() * 100),
    febTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // March containers and dispatch
    marContainer1: Math.floor(Math.random() * 100),
    marContainer2: Math.floor(Math.random() * 100),
    marContainer3: Math.floor(Math.random() * 100),
    marContainer4: Math.floor(Math.random() * 100),
    marContainer5: Math.floor(Math.random() * 100),
    marTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // April containers and dispatch
    aprContainer1: Math.floor(Math.random() * 100),
    aprContainer2: Math.floor(Math.random() * 100),
    aprContainer3: Math.floor(Math.random() * 100),
    aprContainer4: Math.floor(Math.random() * 100),
    aprContainer5: Math.floor(Math.random() * 100),
    aprTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // May containers and dispatch
    mayContainer1: Math.floor(Math.random() * 100),
    mayContainer2: Math.floor(Math.random() * 100),
    mayContainer3: Math.floor(Math.random() * 100),
    mayContainer4: Math.floor(Math.random() * 100),
    mayContainer5: Math.floor(Math.random() * 100),
    mayTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // June containers and dispatch
    junContainer1: Math.floor(Math.random() * 100),
    junContainer2: Math.floor(Math.random() * 100),
    junContainer3: Math.floor(Math.random() * 100),
    junContainer4: Math.floor(Math.random() * 100),
    junContainer5: Math.floor(Math.random() * 100),
    junTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // July containers and dispatch
    julContainer1: Math.floor(Math.random() * 100),
    julContainer2: Math.floor(Math.random() * 100),
    julContainer3: Math.floor(Math.random() * 100),
    julContainer4: Math.floor(Math.random() * 100),
    julContainer5: Math.floor(Math.random() * 100),
    julTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // August containers and dispatch
    augContainer1: Math.floor(Math.random() * 100),
    augContainer2: Math.floor(Math.random() * 100),
    augContainer3: Math.floor(Math.random() * 100),
    augContainer4: Math.floor(Math.random() * 100),
    augContainer5: Math.floor(Math.random() * 100),
    augTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // September containers and dispatch
    sepContainer1: Math.floor(Math.random() * 100),
    sepContainer2: Math.floor(Math.random() * 100),
    sepContainer3: Math.floor(Math.random() * 100),
    sepContainer4: Math.floor(Math.random() * 100),
    sepContainer5: Math.floor(Math.random() * 100),
    sepTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // October containers and dispatch
    octContainer1: Math.floor(Math.random() * 100),
    octContainer2: Math.floor(Math.random() * 100),
    octContainer3: Math.floor(Math.random() * 100),
    octContainer4: Math.floor(Math.random() * 100),
    octContainer5: Math.floor(Math.random() * 100),
    octTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // November containers and dispatch
    novContainer1: Math.floor(Math.random() * 100),
    novContainer2: Math.floor(Math.random() * 100),
    novContainer3: Math.floor(Math.random() * 100),
    novContainer4: Math.floor(Math.random() * 100),
    novContainer5: Math.floor(Math.random() * 100),
    novTotalDispatch: Math.floor(Math.random() * 500) + 50,
    // December containers and dispatch
    decContainer1: Math.floor(Math.random() * 100),
    decContainer2: Math.floor(Math.random() * 100),
    decContainer3: Math.floor(Math.random() * 100),
    decContainer4: Math.floor(Math.random() * 100),
    decContainer5: Math.floor(Math.random() * 100),
    decTotalDispatch: Math.floor(Math.random() * 500) + 50,
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

    // Monthly data with containers
    const monthsData = [
      { monthCode: "jan", monthName: "January", prefix: "Jan" },
      { monthCode: "feb", monthName: "February", prefix: "Feb" },
      { monthCode: "mar", monthName: "March", prefix: "Mar" },
      { monthCode: "apr", monthName: "April", prefix: "Apr" },
      { monthCode: "may", monthName: "May", prefix: "May" },
      { monthCode: "jun", monthName: "June", prefix: "Jun" },
      { monthCode: "jul", monthName: "July", prefix: "Jul" },
      { monthCode: "aug", monthName: "August", prefix: "Aug" },
      { monthCode: "sep", monthName: "September", prefix: "Sep" },
      { monthCode: "oct", monthName: "October", prefix: "Oct" },
      { monthCode: "nov", monthName: "November", prefix: "Nov" },
      { monthCode: "dec", monthName: "December", prefix: "Dec" },
    ];

    // Build month-based columns
    const monthBasedColumns: GridColDef[] = [];

    monthsData.forEach((month) => {
      // Monthly column
      monthBasedColumns.push({
        field: month.monthCode,
        headerName: `${selectedWarehouse} ${month.prefix}`,
        width: 90,
        sortable: true,
        filterable: false,
        headerAlign: "center" as const,
        align: "center" as const,
      });

      // Container columns for this month (1-5)
      for (let i = 1; i <= containerNumbers.length; i++) {
        monthBasedColumns.push({
          field: `${month.monthCode}Container${i}`,
          headerName: `${month.prefix}-CTN${i}`,
          width: 100,
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
              textAlign: 'center',
            }}>
              <span style={{
                fontWeight: 600,
                fontSize: '0.75rem',
                color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)'
              }}>
                {month.prefix}-CTN{i}
              </span>
            </div>
          ),
        });
      }

      // Total Dispatch column for this month
      monthBasedColumns.push({
        field: `${month.monthCode}TotalDispatch`,
        headerName: `${month.prefix} Total Dispatch`,
        width: 140,
        sortable: true,
        filterable: false,
        headerAlign: "center" as const,
        align: "center" as const,
        renderCell: (params) => (
          <span style={{
            fontWeight: 600,
            color: isDark ? '#34d399' : '#059669',
            backgroundColor: isDark ? 'rgba(52, 211, 153, 0.1)' : 'rgba(5, 150, 105, 0.1)',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            {params.value}
          </span>
        ),
      });
    });

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

    return [...baseColumns, ...monthBasedColumns, remColumn];
  }, [selectedWarehouse, containerNumbers, currentYear, isDark]);


  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      {/* Header with title and warehouse selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <DataGridHeader title="Production Remaining Report" />

        <FormControl
          size="small"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
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
            size="small"
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

          <Button variant="contained" onClick={() => exportToCsv(tableData, `Production-Report-${selectedWarehouse}-${new Date().toISOString().split('T')[0]}.csv`)}>Export to CSV</Button>
          <Button variant="contained" onClick={() => exportToPng(tableData.map(row => ({
            ...row,
          })), `Production-Report-${selectedWarehouse}-${new Date().toISOString().split('T')[0]}.png`)}>Export to PNG</Button>
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
