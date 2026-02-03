import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { useTheme } from "../../context/ThemeContext";
import { useState, useMemo, useCallback } from "react";
import { TextField, Select, MenuItem, IconButton } from "@mui/material";
import { PencilIcon, CheckCircleIcon } from "../../icons";

// Define the TypeScript interface for the table rows
interface SummaryDashboardRow {
  id: number;
  itemNumber: string;
  itemTitle: string;
  categoryName: string;
  wh: string;
  fbaWhCoverDay: number;
  remaining: number;
  totalDispatchQty: number;
  dispatchCoverDay: number;
  maxD: number;
  status: string;
  reason: string;
  factoryComments: string;
}

// Generate sample data
const generateSampleData = (): SummaryDashboardRow[] => {
  const statuses = [
    "Most High Selling Item – High Priority",
    "High Selling Item – High Priority",
    "Moderate Selling Item – Medium Priority",
    "Low Selling Item – Low Priority",
  ];

  const reasons = [
    "Currently OOS on FBA until sufficient dispatch.",
    "OOS after 6-20 days until sufficient dispatch.",
    "OOS after 21-40 days until sufficient dispatch.",
    "OOS after 41-60 days until sufficient dispatch.",
    "OOS after 61-80 days until sufficient dispatch.",
  ];

  const itemTitles = ["MMA SHO", "BOXING", "CLOTHIN", "HAND WI", "GYM HOC", "PRO DIPP BELTS", "GYM ACC", "BELTS"];
  const categories = ["MMA SHO", "BOXING", "CLOTHIN", "HAND WI", "GYM ACC", "BELTS", "GYM EQUIP", "APPAREL"];

  return Array(50).fill(0).map((_, index) => {
    const isHighPriority = index < 5;
    return {
      id: index + 1,
      itemNumber: `MSC-T${String(index + 16).padStart(2, "0")}BG-XL`,
      itemTitle: itemTitles[index % itemTitles.length],
      categoryName: categories[index % categories.length],
      wh: index % 10 === 0 ? String(Math.floor(Math.random() * 100)) : "0",
      fbaWhCoverDay: parseFloat((Math.random() * 50).toFixed(5)),
      remaining: Math.floor(Math.random() * 2000) + 100,
      totalDispatchQty: Math.floor(Math.random() * 200),
      dispatchCoverDay: parseFloat((Math.random() * 25).toFixed(5)),
      maxD: parseFloat((Math.random() * 10).toFixed(5)),
      status: isHighPriority ? statuses[0] : statuses[Math.floor(Math.random() * 3) + 1],
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      factoryComments: "",
    };
  });
};

const SummaryDashGrid: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [rows, setRows] = useState<SummaryDashboardRow[]>(generateSampleData());
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{
    status: string;
    reason: string;
    factoryComments: string;
  } | null>(null);


  const handleEdit = useCallback((id: number) => {
    const row = rows.find((r) => r.id === id);
    if (row) {
      setEditingRowId(id);
      setEditValues({
        status: row.status,
        reason: row.reason,
        factoryComments: row.factoryComments,
      });
    }
  }, [rows]);

  const handleSave = useCallback((id: number) => {
    if (editValues) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id
            ? {
              ...row,
              status: editValues.status,
              reason: editValues.reason,
              factoryComments: editValues.factoryComments,
            }
            : row
        )
      );
      setEditingRowId(null);
      setEditValues(null);
    }
  }, [editValues]);

  const handleCancel = () => {
    setEditingRowId(null);
    setEditValues(null);
  };

  const statusOptions = useMemo(() => [
    "Most High Selling Item – High Priority",
    "High Selling Item – High Priority",
    "Moderate Selling Item – Medium Priority",
    "Low Selling Item – Low Priority",
  ], []);

  const reasonOptions = useMemo(() => [
    "Currently OOS on FBA until sufficient dispatch.",
    "OOS after 6-20 days until sufficient dispatch.",
    "OOS after 21-40 days until sufficient dispatch.",
    "OOS after 41-60 days until sufficient dispatch.",
    "OOS after 61-80 days until sufficient dispatch.",
  ], []);

  const columns: GridColDef[] = useMemo(() => {
    const baseColumns: GridColDef[] = [
      {
        field: "itemNumber",
        headerName: "ItemNumber",
        width: 150,
        sortable: true,
        filterable: true,
        headerAlign: "center",
        align: "center",
        renderHeader: (params) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>{params.colDef.headerName}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
      },
      {
        field: "itemTitle",
        headerName: "ItemTitle",
        width: 120,
        sortable: true,
        filterable: true,
        headerAlign: "center",
        align: "center",
        renderHeader: (params) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>{params.colDef.headerName}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
      },
      {
        field: "categoryName",
        headerName: "Category Nam",
        width: 130,
        sortable: true,
        filterable: true,
        headerAlign: "center",
        align: "center",
        renderHeader: (params) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>{params.colDef.headerName}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
      },
      {
        field: "wh",
        headerName: "WH",
        width: 80,
        sortable: true,
        filterable: true,
        headerAlign: "center",
        align: "center",
        renderHeader: (params) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>{params.colDef.headerName}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
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
        renderHeader: (params) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>{params.colDef.headerName}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
      },
      {
        field: "remaining",
        headerName: "Remaining",
        width: 110,
        sortable: true,
        filterable: true,
        headerAlign: "center",
        align: "center",
        renderHeader: (params) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>{params.colDef.headerName}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
      },
      {
        field: "totalDispatchQty",
        headerName: "Total Dispatch Qty",
        width: 150,
        sortable: true,
        filterable: true,
        headerAlign: "center",
        align: "center",
        renderHeader: (params) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>{params.colDef.headerName}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
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
        renderHeader: (params) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>{params.colDef.headerName}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
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
        renderHeader: (params) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>{params.colDef.headerName}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 280,
        sortable: true,
        filterable: true,
        headerAlign: "center",
        align: "left",
        renderHeader: (params) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>{params.colDef.headerName}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
        renderCell: (params) => {
          const isEditing = editingRowId === params.row.id;
          if (isEditing && editValues) {
            return (
              <Select
                value={editValues.status}
                onChange={(e) =>
                  setEditValues({ ...editValues, status: e.target.value })
                }
                size="small"
                fullWidth
                variant="outlined"
                sx={{
                  mt: '5px',
                  color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
                  '& .MuiSelect-select': {
                    color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                  },
                }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
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
        renderHeader: (params) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>{params.colDef.headerName}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
        renderCell: (params) => {
          const isEditing = editingRowId === params.row.id;
          if (isEditing && editValues) {
            return (
              <Select
                value={editValues.reason}
                onChange={(e) =>
                  setEditValues({ ...editValues, reason: e.target.value })
                }
                size="small"
                fullWidth
                variant="outlined"
                sx={{
                  mt: '5px',
                  color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
                  '& .MuiSelect-select': {
                    color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                  },
                }}
              >
                {reasonOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
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
              <TextField
                value={editValues.factoryComments}
                onChange={(e) =>
                  setEditValues({ ...editValues, factoryComments: e.target.value })
                }
                onKeyDown={(e) => {
                  // Prevent spacebar and arrow keys from triggering grid navigation
                  if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.stopPropagation();
                  }
                }}
                size="small"
                fullWidth
                variant="outlined"
                sx={{
                  mt: '5px',
                  '& .MuiInputBase-input': {
                    color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                  },
                }}
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
        headerAlign: "center",
        align: "center",
        getActions: (params) => {
          const isEditing = editingRowId === params.id;
          if (isEditing) {
            return [
              <GridActionsCellItem
                icon={
                  <IconButton size="small">
                    <CheckCircleIcon className="w-5 h-5" />
                  </IconButton>
                }
                label="Save"
                onClick={() => handleSave(params.id as number)}
              />,
              <GridActionsCellItem
                icon={
                  <IconButton size="small">
                    <span style={{ fontSize: "0.875rem" }}>Cancel</span>
                  </IconButton>
                }
                label="Cancel"
                onClick={handleCancel}
              />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={
                <IconButton size="small">
                  <PencilIcon className="w-5 h-5" />
                </IconButton>
              }
              label="Edit"
              onClick={() => handleEdit(params.id as number)}
            />,
          ];
        },
      },
    ];

    return baseColumns;
  }, [isDark, editingRowId, editValues, statusOptions, reasonOptions, handleEdit, handleSave]);

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      {/* Header with title */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Summary Dashboard Report
        </h3>
      </div>

      {/* DataGrid */}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25 },
          },
        }}
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
            '& .MuiDataGrid-cellContent': {
              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
            },
          },
          '& .MuiDataGrid-columnHeaders': {
            borderColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
            backgroundColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
            color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: 'transparent',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: isDark ? 'rgb(255, 255, 255)' : 'rgb(31 41 55)',
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
};

export default SummaryDashGrid;
