import { GridColDef } from "@mui/x-data-grid";

const renderDateHeader = (title: string, isDark: boolean) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <span style={{ fontWeight: 500, color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)', fontSize: '0.7rem' }}>
      {title}
    </span>
    <span style={{ fontSize: '0.5rem', opacity: 0.7, fontWeight: 400, color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>
      (YYYY/MM/DD)
    </span>
  </div>
);

export const generateWarehouseColumns = (isDark: boolean): GridColDef[] => [
  {
    field: "CategoryName",
    headerName: "Category Name",
    flex: 1.5,
    minWidth: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: "ItemNumber",
    headerName: "Item Number",
    flex: 1.5,
    minWidth: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: "ContainerName",
    headerName: "Container Name",
    flex: 1.5,
    minWidth: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: "ContainerRegion",
    headerName: "Warehouse",
    flex: 1,
    minWidth: 120,
    sortable: true,
    filterable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "IntransitQuantity",
    headerName: "Intransit Qty",
    flex: 1,
    minWidth: 110,
    sortable: true,
    filterable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "ContainerNumber",
    headerName: "Container #",
    flex: 1,
    minWidth: 100,
    sortable: true,
    filterable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "DepartureDate",
    headerName: "Departure Date",
    flex: 1,
    minWidth: 140,
    sortable: true,
    filterable: true,
    headerAlign: "center",
    align: "center",
    renderHeader: () => renderDateHeader("Departure Date", isDark),
  },
  {
    field: "ArrivalDate",
    headerName: "Arrival Date",
    flex: 1,
    minWidth: 140,
    sortable: true,
    filterable: true,
    headerAlign: "center",
    align: "center",
    renderHeader: () => renderDateHeader("Arrival Date", isDark),
  },
  {
    field: "LeftDays",
    headerName: "Left Days",
    flex: 1,
    minWidth: 120,
    sortable: true,
    filterable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "UploadDate",
    headerName: "Current Date",
    flex: 1,
    minWidth: 140,
    sortable: true,
    filterable: true,
    headerAlign: "center",
    align: "center",
    renderHeader: () => renderDateHeader("Current Date", isDark),
  },
  {
    field: 'status',
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    sortable: true,
    filterable: true,
    headerAlign: "center",
    align: "center",
    valueGetter: (_value, row) => {
      return row.LeftDays === 0 ? "Delivered" : "Transit";
    }
  }
];