import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { PencilIcon, CheckCircleIcon } from "../icons";
import { EditableStatusCell } from "../components/DataGrid/EditableStatusCell";
import { EditableTextFieldCell } from "../components/DataGrid/EditableTextFieldCell";
import { STATUS_OPTIONS, REASON_OPTIONS } from "../config/summaryDashboard";

/**
 * Utility function to create DataGrid columns
 * Separated to follow Single Responsibility Principle
 */
export const createSummaryDashboardColumns = (
  isDark: boolean,
  editingRowId: number | null,
  editValues: { status: string; reason: string; factoryComments: string } | null,
  onStatusChange: (value: string) => void,
  onReasonChange: (value: string) => void,
  onCommentsChange: (value: string) => void,
  onEdit: (id: number) => void,
  onSave: (id: number) => void,
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
      headerAlign: "center",
      align: "center",
      renderHeader: () => renderHeader("ItemNumber"),
    },
    {
      field: "itemTitle",
      headerName: "ItemTitle",
      width: 120,
      sortable: true,
      filterable: true,
      headerAlign: "center",
      align: "center",
      renderHeader: () => renderHeader("ItemTitle"),
    },
    {
      field: "categoryName",
      headerName: "Category Nam",
      width: 130,
      sortable: true,
      filterable: true,
      headerAlign: "center",
      align: "center",
      renderHeader: () => renderHeader("Category Nam"),
    },
    {
      field: "wh",
      headerName: "WH",
      width: 80,
      sortable: true,
      filterable: true,
      headerAlign: "center",
      align: "center",
      renderHeader: () => renderHeader("WH"),
    },
    {
      field: "fbaWhCoverDay",
      headerName: "FBA+WH Cover Day",
      width: 140,
      sortable: true,
      filterable: true,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: number) => value?.toFixed(5) || "0",
      renderHeader: () => renderHeader("FBA+WH Cover Day"),
    },
    {
      field: "remaining",
      headerName: "Remaining",
      width: 110,
      sortable: true,
      filterable: true,
      headerAlign: "center",
      align: "center",
      renderHeader: () => renderHeader("Remaining"),
    },
    {
      field: "totalDispatchQty",
      headerName: "Total Dispatch Qty",
      width: 150,
      sortable: true,
      filterable: true,
      headerAlign: "center",
      align: "center",
      renderHeader: () => renderHeader("Total Dispatch Qty"),
    },
    {
      field: "dispatchCoverDay",
      headerName: "Dispatch Cover Day",
      width: 150,
      sortable: true,
      filterable: true,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: number) => value?.toFixed(5) || "0",
      renderHeader: () => renderHeader("Dispatch Cover Day"),
    },
    {
      field: "maxD",
      headerName: "MAX D",
      width: 100,
      sortable: true,
      filterable: true,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: number) => value?.toFixed(5) || "0",
      renderHeader: () => renderHeader("MAX D"),
    },
    {
      field: "status",
      headerName: "Status",
      width: 280,
      sortable: true,
      filterable: true,
      headerAlign: "center",
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
      field: "reason",
      headerName: "Reason",
      width: 350,
      sortable: true,
      filterable: true,
      headerAlign: "center",
      align: "left",
      renderHeader: () => renderHeader("Reason"),
      renderCell: (params) => {
        const isEditing = editingRowId === params.row.id;
        if (isEditing && editValues) {
          return (
            <EditableStatusCell
              value={editValues.reason}
              options={REASON_OPTIONS}
              onChange={onReasonChange}
              isDark={isDark}
            />
          );
        }
        return <span>{params.value}</span>;
      },
    },
    {
      field: "factoryComments",
      headerName: "Factory Comments",
      width: 200,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => {
        const isEditing = editingRowId === params.row.id;
        if (isEditing && editValues) {
          return (
            <EditableTextFieldCell
              value={editValues.factoryComments}
              onChange={onCommentsChange}
              isDark={isDark}
            />
          );
        }
        return <span>{params.value || ""}</span>;
      },
    },
    {
      field: "editedBy",
      headerName: "Edited By",
      width: 100,
      sortable: true,
      filterable: true,
      headerAlign: "center",
      align: "center",
      renderHeader: () => renderHeader("Edited By"),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Action",
      width: 120,
      headerAlign: "center",
      align: "center",
      getActions: (params) => {
        const isEditing = editingRowId === params.id;
        if (isEditing) {
          return [
            <GridActionsCellItem
              key="save"
              icon={
                <IconButton size="small">
                  <CheckCircleIcon className="w-5 h-5" />
                </IconButton>
              }
              label="Save"
              onClick={() => onSave(params.id as number)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={
                <IconButton size="small">
                  <span style={{ fontSize: "0.875rem" }}>Cancel</span>
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
              <IconButton size="small">
                <PencilIcon className="w-5 h-5" />
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
