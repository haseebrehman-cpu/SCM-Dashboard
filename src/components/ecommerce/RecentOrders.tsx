import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Badge from "../ui/badge/Badge";
import { useTheme } from "../../context/ThemeContext";

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

export default function RecentOrders() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
    },
    {
      field: "arrivalDate",
      headerName: "Arrival Date",
      width: 150,
      sortable: true,
      filterable: false,
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      width: 150,
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        const status = params.value as "Delivered" | "InTransit";
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
  ];

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
        Purchase Order Report
      </h3>
      <Paper
        sx={{
          height: 550,
          width: "100%",
          backgroundColor: "transparent !important",
          boxShadow: "none !important",
          position: "relative",
          zIndex: 1,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 15]}
          sx={{
            border: 'none',
            backgroundColor: 'transparent',
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
              color: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
            },
          }}
        // disableRowSelectionOnClick
        />
      </Paper>
    </div>
  );
}
