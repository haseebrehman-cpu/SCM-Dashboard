import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Badge from "../../components/ui/badge/Badge";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import { IconButton, Select, MenuItem, Button, createTheme, ThemeProvider } from "@mui/material";
import { exportToCsv } from "../../utils/exportToCsv";
import { exportToPng } from "../../utils/exportToPng";
import { DataGridHeader } from "../../components/DataGrid/DataGridHeader";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Define the TypeScript interface for the table rows
interface Container {
  id: number;
  containerName: string;
  containerNumber: string;
  containerRegion: string;
  departureDate: string;
  arrivalDate: string;
  deliveryStatus: "Delivered" | "InTransit";
}

// Define the table data
const rows: Container[] = [
  {
    id: 1,
    containerName: "Container Alpha",
    containerNumber: "CSNU1234567",
    containerRegion: "North America",
    departureDate: "2026-01-15",
    arrivalDate: "2026-02-01",
    deliveryStatus: "Delivered",
  },
  {
    id: 2,
    containerName: "Container Beta",
    containerNumber: "MSCU9876543",
    containerRegion: "Europe",
    departureDate: "2026-01-20",
    arrivalDate: "2026-02-10",
    deliveryStatus: "InTransit",
  },
  {
    id: 3,
    containerName: "Container Gamma",
    containerNumber: "HLCU5551234",
    containerRegion: "Asia Pacific",
    departureDate: "2026-01-18",
    arrivalDate: "2026-02-05",
    deliveryStatus: "Delivered",
  },
  {
    id: 4,
    containerName: "Container Delta",
    containerNumber: "TCLU7778889",
    containerRegion: "Middle East",
    departureDate: "2026-01-25",
    arrivalDate: "2026-02-15",
    deliveryStatus: "InTransit",
  },
  {
    id: 5,
    containerName: "Container Epsilon",
    containerNumber: "OOLU3334445",
    containerRegion: "South America",
    departureDate: "2026-01-10",
    arrivalDate: "2026-01-28",
    deliveryStatus: "Delivered",
  },
  {
    id: 6,
    containerName: "Container Epsilon",
    containerNumber: "OOLU3334445",
    containerRegion: "South America",
    departureDate: "2026-01-10",
    arrivalDate: "2026-01-28",
    deliveryStatus: "Delivered",
  },
  {
    id: 7,
    containerName: "Container Epsilon",
    containerNumber: "OOLU3334445",
    containerRegion: "South America",
    departureDate: "2026-01-10",
    arrivalDate: "2026-01-28",
    deliveryStatus: "Delivered",
  },
  {
    id: 8,
    containerName: "Container Epsilon",
    containerNumber: "OOLU3334445",
    containerRegion: "South America",
    departureDate: "2026-01-10",
    arrivalDate: "2026-01-28",
    deliveryStatus: "Delivered",
  },
  {
    id: 9,
    containerName: "Container Epsilon",
    containerNumber: "OOLU3334445",
    containerRegion: "South America",
    departureDate: "2026-01-10",
    arrivalDate: "2026-01-28",
    deliveryStatus: "Delivered",
  },
  {
    id: 10,
    containerName: "Container Epsilon",
    containerNumber: "OOLU3334445",
    containerRegion: "South America",
    departureDate: "2026-01-10",
    arrivalDate: "2026-01-28",
    deliveryStatus: "Delivered",
  },
  {
    id: 11,
    containerName: "Container Epsilon",
    containerNumber: "OOLU3334445",
    containerRegion: "South America",
    departureDate: "2026-01-10",
    arrivalDate: "2026-01-28",
    deliveryStatus: "Delivered",
  },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function PurchaseOrder() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // State management
  const [tableData, setTableData] = useState<Container[]>(rows);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<{
    arrivalDate: string;
    deliveryStatus: "Delivered" | "InTransit";
  } | null>(null);

  // Handle edit button click
  const handleEdit = (row: Container) => {
    setEditingRowId(row.id);
    setEditedData({
      arrivalDate: row.arrivalDate,
      deliveryStatus: row.deliveryStatus,
    });
  };

  // Handle save button click
  const handleSave = () => {
    if (editingRowId !== null && editedData) {
      setTableData((prevData) =>
        prevData.map((row) =>
          row.id === editingRowId
            ? { ...row, ...editedData }
            : row
        )
      );
      setEditingRowId(null);
      setEditedData(null);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setEditingRowId(null);
    setEditedData(null);
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    {
      field: "containerName",
      headerName: "Container Name",
      flex: 1,
      minWidth: 180,
      sortable: true,
      filterable: true,
    },
    {
      field: "containerNumber",
      headerName: "Container Number",
      width: 180,
      sortable: true,
      filterable: true,
    },
    {
      field: "containerRegion",
      headerName: "Container Region",
      width: 180,
      sortable: true,
      filterable: true,
    },
    {
      field: "departureDate",
      headerName: "Departure Date",
      width: 150,
      sortable: true,
      filterable: false,
      renderHeader: () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontWeight: 600, color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>Departure Date</span>
          <span style={{ fontSize: '0.7rem', opacity: 0.7, fontWeight: 400, color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>(YYYY-MM-DD)</span>
        </div>
      ),
    },
    {
      field: "arrivalDate",
      headerName: "Arrival Date",
      width: 180,
      sortable: true,
      filterable: false,
      renderHeader: () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontWeight: 600, color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>Arrival Date</span>
          <span style={{ fontSize: '0.7rem', opacity: 0.7, fontWeight: 400, color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>(YYYY-MM-DD)</span>
        </div>
      ),
      renderCell: (params) => {
        const isEditing = editingRowId === params.row.id;

        if (isEditing && editedData) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <ThemeProvider theme={createTheme({
                  palette: {
                    mode: isDark ? 'dark' : 'light',
                    primary: {
                      main: isDark ? '#ffffff' : '#1976d2',
                    },
                  },
                  components: {
                    MuiOutlinedInput: {
                      styleOverrides: {
                        input: {
                          color: isDark ? '#ffffff' : 'rgb(31 41 55)',
                          '&::placeholder': {
                            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(31, 41, 55, 0.5)',
                            opacity: 1,
                          },
                        },
                        root: {
                          color: isDark ? '#ffffff' : 'rgb(31 41 55)',
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                          '& input': {
                            color: isDark ? '#ffffff' : 'rgb(31 41 55)',
                          },
                        },
                        notchedOutline: {
                          borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                        },
                      },
                    },
                  },
                })}>
                  <DatePicker
                    format="MM/dd/yyyy"
                    value={editedData.arrivalDate ? new Date(editedData.arrivalDate) : null}
                    onChange={(newDate: Date | null) => {
                      if (newDate) {
                        const dateString = newDate.toISOString().split('T')[0];
                        setEditedData({ ...editedData, arrivalDate: dateString });
                      }
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          '& input': {
                            color: isDark ? '#ffffff' : 'rgb(31 41 55)',
                          },
                        },
                      },
                    }}
                  />
                </ThemeProvider>
              </LocalizationProvider>
            </div>
          );
        }

        return <span>{params.value}</span>;
      },
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      width: 180,
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        const isEditing = editingRowId === params.row.id;
        const status = params.value as "Delivered" | "InTransit";

        if (isEditing && editedData) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
              <Select
                value={editedData.deliveryStatus}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    deliveryStatus: e.target.value as "Delivered" | "InTransit",
                  })
                }
                size="small"
                sx={{
                  minWidth: 120,
                  '& .MuiSelect-select': {
                    padding: '4px 8px',
                    fontSize: '0.875rem',
                    color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark ? 'rgb(75 85 99)' : 'rgb(209 213 219)',
                  },
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                }}
              >
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="InTransit">In Transit</MenuItem>
              </Select>
            </div>
          );
        }

        return (
          <Badge
            size="sm"
            color={status === "Delivered" ? "success" : "warning"}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isEditing = editingRowId === params.row.id;

        if (isEditing) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '100%', width: '100%' }}>
              <IconButton
                size="small"
                onClick={handleSave}
                sx={{
                  color: isDark ? '#10b981' : '#059669',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                  },
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </IconButton>
              <IconButton
                size="small"
                onClick={handleCancel}
                sx={{
                  color: isDark ? '#ef4444' : '#dc2626',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                  },
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </IconButton>
            </div>
          );
        }

        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            <IconButton
              size="small"
              onClick={() => handleEdit(params.row)}
              sx={{
                color: isDark ? '#60a5fa' : '#2563eb',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                },
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <DataGridHeader title="Purchase Order Report" />

        <div className="flex items-center gap-2">
          <Button variant="contained" onClick={() => exportToCsv(tableData, `Purchase-Order-Report-${new Date().toISOString().split('T')[0]}.csv`)} sx={{ borderRadius: '20px', fontSize: '12px' }}>Export to CSV</Button>
          <Button variant="contained" onClick={() => exportToPng(tableData.map(row => ({
            ...row,
          })), `Purchase-Order-Report-${new Date().toISOString().split('T')[0]}.png`)} sx={{ borderRadius: '20px', fontSize: '12px' }}>Export to PNG</Button>
        </div>
      </div>
      <DataGrid
        rows={tableData}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 15]}
        autoHeight
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
