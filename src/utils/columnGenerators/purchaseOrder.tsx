import { GridColDef } from "@mui/x-data-grid";
import Badge from "../../components/ui/badge/Badge";
import { Container, EditableFields, DeliveryStatus } from '../../types/purchaseOrder';
import { DateEditor } from '../../Sections/PurchaseOrderGrid/DateEditor';
import { StatusEditor } from '../../Sections/PurchaseOrderGrid/StatusEditor';
import { ActionButtons } from '../../Sections/PurchaseOrderGrid/ActionButtons';

interface ColumnGeneratorParams {
  isDark: boolean;
  editedData: EditableFields | null;
  isEditing: (rowId: number) => boolean;
  startEdit: (row: Container) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  updateEditedData: (updates: Partial<EditableFields>) => void;
}

const renderDateHeader = (title: string, isDark: boolean) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <span style={{ fontWeight: 500, color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)', fontSize: '0.7rem' }}>
      {title}
    </span>
    <span style={{ fontSize: '0.5rem', opacity: 0.7, fontWeight: 400, color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)' }}>
      (YYYY-MM-DD)
    </span>
  </div>
);

export const generatePurchaseOrderColumns = ({
  isDark,
  editedData,
  isEditing,
  startEdit,
  saveEdit,
  cancelEdit,
  updateEditedData,
}: ColumnGeneratorParams): GridColDef[] => [
    {
      field: "containerName",
      headerName: "Container Name",
      flex: 1,
      minWidth: 180,
      sortable: true,
      filterable: true,
    },
    {
      field: "referenceContainer",
      headerName: "Reference Container",
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
      renderHeader: () => renderDateHeader("Departure Date", isDark),
    },
    {
      field: "arrivalDate",
      headerName: "Arrival Date",
      width: 180,
      sortable: true,
      filterable: false,
      renderHeader: () => renderDateHeader("Arrival Date", isDark),
      renderCell: (params) => {
        if (isEditing(params.row.id) && editedData) {
          return (
            <DateEditor
              value={editedData.arrivalDate}
              onChange={(date) => updateEditedData({ arrivalDate: date })}
              isDark={isDark}
            />
          );
        }
        return <span>{params.value}</span>;
      },
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      width: 120,
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        const status = params.value as DeliveryStatus;

        if (isEditing(params.row.id) && editedData) {
          return (
            <StatusEditor
              value={editedData.deliveryStatus}
              onChange={(status) => updateEditedData({ deliveryStatus: status })}
              isDark={isDark}
            />
          );
        }

        return (
          <Badge size="sm" color={status === "Delivered" ? "success" : "warning"}>
            {status}
          </Badge>
        );
      },
    },
    {
      field: "editedBy",
      headerName: "Edited By",
      width: 180,
      sortable: true,
      filterable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtons
          isEditing={isEditing(params.row.id)}
          isDark={isDark}
          onEdit={() => startEdit(params.row)}
          onSave={saveEdit}
          onCancel={cancelEdit}
        />
      ),
    },
  ];
