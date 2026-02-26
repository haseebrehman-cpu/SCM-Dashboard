import { GridColDef } from "@mui/x-data-grid";
import Badge from "../../components/ui/badge/Badge";
import { Container, EditableFields, DeliveryStatus } from '../../types/purchaseOrder';
import { DateEditor } from '../../Sections/PurchaseOrderGrid/DateEditor';
import { ActionButtons } from '../../Sections/PurchaseOrderGrid/ActionButtons';

interface ColumnGeneratorParams {
  isDark: boolean;
  editedData: EditableFields | null;
  isEditing: (rowId: number) => boolean;
  startEdit: (row: Container) => void;
  saveEdit: (userEmail?: string) => void;
  cancelEdit: () => void;
  onDateChange: (rowId: number, arrivalDate: string) => void;
  isUpdatingDate?: boolean;
  updatingRowId?: number | null;
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
  onDateChange,
  isUpdatingDate,
  updatingRowId,
}: ColumnGeneratorParams): GridColDef[] => [
    {
      field: "container_name",
      headerName: "Container Name",
      flex: 1,
      minWidth: 180,
      sortable: true,
      filterable: true,
    },
    {
      field: "reference_container",
      headerName: "Reference Container",
      flex: 1,
      minWidth: 180,
      sortable: true,
      filterable: true,
    },
    {
      field: "container_number",
      headerName: "Container Number",
      width: 180,
      sortable: true,
      filterable: true,
    },
    {
      field: "container_region",
      headerName: "Container Region",
      width: 180,
      sortable: true,
      filterable: true,
    },
    {
      field: "departure_date",
      headerName: "Departure Date",
      width: 150,
      sortable: true,
      filterable: false,
      renderHeader: () => renderDateHeader("Departure Date", isDark),
    },
    {
      field: "arrival_date",
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
              onChange={(date) => {
                onDateChange(params.row.id, date);
              }}
              isDark={isDark}
              minDate={params.row.departure_date}
              />
          );
        }
        return <span>{params.value}</span>;
      },
    },
    {
      field: "delivery_status",
      headerName: "Delivery Status",
      width: 150,
      sortable: true,
      filterable: true,
      renderCell: (params) => {
        const arrivalDate = params.row.arrival_date;

        let deliveryStatus: DeliveryStatus = "InTransit";

        if (arrivalDate) {
          const arrival = new Date(arrivalDate + 'T00:00:00');

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (arrival <= today) {
            deliveryStatus = "Delivered";
          }
        }

        return (
          <Badge size="sm" color={deliveryStatus === "Delivered" ? "success" : "warning"}>
            {params.row.arrival_date ? (deliveryStatus === "Delivered" ? "Delivered" : "In Transit") : "In Transit"}
          </Badge>
        );
      },
    },
    {
      field: "modified_by",
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
      renderCell: (params) => {
        const isCurrentRowUpdating = params.row.id === updatingRowId && isUpdatingDate;
        
        if (isCurrentRowUpdating) {
          return (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#10b981' : '#059669',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Updating...
              </div>
            </div>
          );
        }
        
        return (
          <ActionButtons
            isEditing={isEditing(params.row.id)}
            isDark={isDark}
            onEdit={() => startEdit(params.row)}
            onSave={saveEdit}
            onCancel={cancelEdit}
          />
        );
      },
    },
  ];
