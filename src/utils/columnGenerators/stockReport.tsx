import { GridColDef } from "@mui/x-data-grid";

export const generateStockReportColumns = (): GridColDef[] => [
  {
    field: "UploadDate",
    headerName: "Upload Date",
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: "WareHouseCode",
    headerName: "WareHouse Code",
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: "CategoryName",
    headerName: "Category Name",
    width: 200,
    sortable: true,
    filterable: true,
  },
  {
    field: "ItemNumber",
    headerName: "Item Number",
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: "ItemTitle",
    headerName: "Item Title",
    flex: 1,
    minWidth: 250,
    sortable: true,
    filterable: true,
  },
  {
    field: "SoldQuantity",
    headerName: "Last 60 Days Sales",
    width: 200,
    sortable: true,
    filterable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Available",
    headerName: "Warehouse Stock",
    width: 160,
    sortable: true,
    filterable: true,
    headerAlign: "center",
    align: "center",
  },
];
