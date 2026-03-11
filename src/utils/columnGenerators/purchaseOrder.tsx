import { GridColDef } from "@mui/x-data-grid";
import Badge from "../../components/ui/badge/Badge";
import { EditableFields } from '../../types/purchaseOrder';
import { PurchaseOrderData } from "../../types/Interfaces/interfaces";
import { DateEditor } from '../../Sections/PurchaseOrderGrid/DateEditor';
import { ActionButtons } from '../../Sections/PurchaseOrderGrid/ActionButtons';

interface ColumnGeneratorParams {
  isDark: boolean;
  editedData: EditableFields | null;
  isEditing: (rowId: number) => boolean;
  startEdit: (row: PurchaseOrderData) => void;
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
      (DD/MM/YYYY)
    </span>
  </div>
);

const formatDate = (value: string | null | undefined) => {
  if (!value) return '';

  // Standardize delimiters and split, removing any zero-width characters
  const cleanValue = value.toString().trim().replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
  const parts = cleanValue.includes('-') ? cleanValue.split('-') : cleanValue.split('/');

  if (parts.length === 3) {
    let day, month, year;

    if (parts[0].length === 4) {
      // YYYY-MM-DD
      [year, month, day] = parts;
    } else {
      // DD-MM-YYYY
      [day, month, year] = parts;
    }

    const d = parseInt(day, 10).toString().padStart(2, '0');
    const m = parseInt(month, 10).toString().padStart(2, '0');
    const y = year.toString();

    // Prepend a single space to force Excel to treat this as a string (General) 
    // instead of auto-converting it to a Date object.
    return ` ${d}/${m}/${y}`;
  }

  return cleanValue;
};


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
      valueFormatter: (value: string | null | undefined) => formatDate(value),
      renderHeader: () => renderDateHeader("Departure Date", isDark),
      renderCell: (params) => <span>{params.value?.toString().trim()}</span>,
    },
    {
      field: "arrival_date",
      headerName: "Arrival Date",
      width: 180,
      sortable: true,
      filterable: false,
      valueFormatter: (value: string | null | undefined) => formatDate(value),
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
        return <span>{params.value?.toString().trim()}</span>;
      },
    },
    {
      field: "delivery_status",
      headerName: "Delivery Status",
      width: 150,
      sortable: true,
      filterable: true,
      valueGetter: (_value, row) => {
        const arrivalDate = row.arrival_date;

        if (arrivalDate) {
          const arrival = new Date(arrivalDate + 'T00:00:00');
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (arrival <= today) {
            return "Delivered";
          }
        }
        return "In Transit";
      },
      renderCell: (params) => (
        <Badge size="sm" color={params.value === "Delivered" ? "success" : "warning"}>
          {params.value}
        </Badge>
      ),
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
      disableExport: true,
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
              <span className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
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
