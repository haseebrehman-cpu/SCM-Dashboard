import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { EditableStatusCell } from "../components/DataGrid/EditableStatusCell";
import { EditableTextFieldCell } from "../components/DataGrid/EditableTextFieldCell";
import { STATUS_OPTIONS } from "../config/summaryDashboard";

/**
 * Utility function to create DataGrid columns
 * Separated to follow Single Responsibility Principle
 */
export const createSummaryDashboardColumns = (
  isDark: boolean,
  editingRowId: number | null,
  editValues: { status: string; reason1: string; reason2: string; reason3: string; reason4: string; factory_comment: string } | null,
  onStatusChange: (value: string) => void,
  onCommentsChange: (value: string) => void,
  onEdit: (id: number) => void,
  onSave: (id: number, warehouse_code: string) => void,
  onCancel: () => void
): GridColDef[] => {
  const renderHeader = (headerName: string) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
      <span>{headerName}</span>
      <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
    </div>
  );

  return [
    {
      field: "itemNumber",
      headerName: "ItemNumber",
      width: 150,
      sortable: true,
      filterable: true,
      renderHeader: () => renderHeader("ItemNumber"),
    },
    {
      field: "upload_date",
      headerName: "Upload Date",
      width: 150,
      sortable: true,
      filterable: true,
      renderHeader: () => renderHeader("Upload Date"),
    },
    {
      field: "itemTitle",
      headerName: "ItemTitle",
      width: 120,
      sortable: true,
      filterable: true,
      renderHeader: () => renderHeader("ItemTitle"),
    },
    {
      field: "category_name",
      headerName: "Category Name",
      width: 140,
      sortable: true,
      filterable: true,
      renderHeader: () => renderHeader("Category Name"),
    },
    // {
    //   field: "warehouse_code",
    //   headerName: "WH",
    //   width: 80,
    //   sortable: true,
    //   filterable: true,
    //   renderHeader: () => renderHeader("WH"),
    // },
    {
      field: "wh_stock",
      headerName: "WH Stock",
      width: 100,
      sortable: true,
      filterable: true,
      renderHeader: () => renderHeader("WH Stock"),
    },
    {
      field: "fba_wh_cover_day",
      headerName: "FBA+WH Cover Day",
      width: 160,
      sortable: true,
      filterable: true,
      valueFormatter: (value: number) => value?.toFixed(2) || "0",
      renderHeader: () => renderHeader("FBA+WH Cover Day"),
    },
    {
      field: "all_stock",
      headerName: "All Stock",
      width: 100,
      sortable: true,
      filterable: true,
      renderHeader: () => renderHeader("All Stock"),
    },
    {
      field: "remaining",
      headerName: "Remaining",
      width: 110,
      sortable: true,
      filterable: true,
      renderHeader: () => renderHeader("Remaining"),
    },
    {
      field: "dispatch_date_cover",
      headerName: "Dispatch Date Cover",
      width: 160,
      sortable: true,
      filterable: true,
      valueFormatter: (value: number) => value?.toFixed(2) || "0",
      renderHeader: () => renderHeader("Dispatch Date Cover"),
    },
    {
      field: "max_daily_consumption",
      headerName: "Max Daily Consumption",
      width: 220,
      sortable: true,
      filterable: true,
      valueFormatter: (value: number) => value?.toFixed(2) || "0",
      renderHeader: () => renderHeader("Max Daily Consumption"),
    },

    {
      field: "reason1",
      headerName: "Reason 1",
      width: 350,
      sortable: true,
      filterable: true,

      align: "left",
      // renderCell: (params) => {
      //   const isEditing = editingRowId === params.row.id;
      //   if (isEditing && editValues) {
      //     return (
      //       <EditableTextFieldCell
      //         value={editValues.reason1}
      //         onChange={(value) => onReasonChange('reason1', value)}
      //         isDark={isDark}
      //       />
      //     );
      //   }
      //   return <span>{params.value}</span>;
      // },
    },
    {
      field: "reason2",
      headerName: "Reason 2",
      width: 350,
      sortable: true,
      filterable: true,

      align: "left",
      // renderCell: (params) => {
      //   const isEditing = editingRowId === params.row.id;
      //   if (isEditing && editValues) {
      //     return (
      //       <EditableTextFieldCell
      //         value={editValues.reason2}
      //         onChange={(value) => onReasonChange('reason2', value)}
      //         isDark={isDark}
      //       />
      //     );
      //   }
      //   return <span>{params.value}</span>;
      // },
    },
    {
      field: "reason3",
      headerName: "Reason 3",
      width: 350,
      sortable: true,
      filterable: true,

      align: "left",
      // renderCell: (params) => {
      //   const isEditing = editingRowId === params.row.id;
      //   if (isEditing && editValues) {
      //     return (
      //       <EditableTextFieldCell
      //         value={editValues.reason3}
      //         onChange={(value) => onReasonChange('reason3', value)}
      //         isDark={isDark}
      //       />
      //     );
      //   }
      //   return <span>{params.value}</span>;
      // },
    },
    {
      field: "reason4",
      headerName: "Reason 4",
      width: 350,
      sortable: true,
      filterable: true,

      align: "left",
      // renderCell: (params) => {
      //   const isEditing = editingRowId === params.row.id;
      //   if (isEditing && editValues) {
      //     return (
      //       <EditableTextFieldCell
      //         value={editValues.reason4}
      //         onChange={(value) => onReasonChange('reason4', value)}
      //         isDark={isDark}
      //       />
      //     );
      //   }
      //   return <span>{params.value}</span>;
      // },
    },
    {
      field: "status",
      headerName: "Status",
      width: 280,
      sortable: true,
      filterable: true,
      align: "left",
      renderHeader: () => renderHeader("Status"),
      renderCell: (params) => {
        const isEditing = editingRowId === params.row.id;
        if (isEditing && editValues) {
          return (
            <EditableStatusCell
              value={editValues.status}
              options={STATUS_OPTIONS}
              onChange={onStatusChange}
              isDark={isDark}
            />
          );
        }
        return <span>{params.value}</span>;
      },
    },
    {
      field: "factory_comment",
      headerName: "Factory Comments",
      width: 200,
      sortable: false,
      filterable: true,

      align: "left",
      renderCell: (params) => {
        const isEditing = editingRowId === params.row.id;
        if (isEditing && editValues) {
          return (
            <EditableTextFieldCell
              value={editValues.factory_comment}
              onChange={onCommentsChange}
              isDark={isDark}
            />
          );
        }
        return <span>{params.value || ""}</span>;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      width: 120,


      getActions: (params) => {
        const isEditing = editingRowId === params.id;
        if (isEditing) {
          return [
            <GridActionsCellItem
              key="save"
              icon={
                <IconButton
                  size="small"
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
              }
              label="Save"
              onClick={() => onSave(params.id as number, (params.row as { warehouse_code: string }).warehouse_code)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={
                <IconButton
                  size="small"
                  onClick={onCancel}
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
              }
              label="Cancel"
              onClick={onCancel}
            />,
          ];
        }
        return [
          <GridActionsCellItem
            key="edit"
            icon={
              <IconButton
                size="small"
                onClick={() => onEdit(params.id as number)}
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
            }
            label="Edit"
            onClick={() => onEdit(params.id as number)}
          />,
        ];
      },
    },
  ];
};
