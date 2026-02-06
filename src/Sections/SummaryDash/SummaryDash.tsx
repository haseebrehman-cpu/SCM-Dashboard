import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "../../context/ThemeContext";
import { useState, useMemo, useCallback } from "react";
import { SummaryDashboardRow } from "../../config/summaryDashboard";
import { generateSummaryDashboardData } from "../../utils/dataGenerators";
import { createSummaryDashboardColumns } from "../../utils/dataGridColumns";
import { DataGridHeader } from "../../components/DataGrid/DataGridHeader";
import React from "react";
import { exportToCsv } from "../../utils/exportToCsv";
import { Button } from "@mui/material";
import { exportToPng } from "../../utils/exportToPng";

/**
 * Summary Dashboard Grid Component
 * Refactored to follow Single Responsibility Principle and React best practices
 */
const SummaryDashGrid: React.FC = React.memo(() => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [rows, setRows] = useState<SummaryDashboardRow[]>(() => generateSummaryDashboardData(50));
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
              editedBy: "user@gmail.com"
            }
            : row
        )
      );
      setEditingRowId(null);
      setEditValues(null);
      console.log("rows", rows);
      const updatedRows = rows.map((row) =>
        row.id === id
          ? {
            ...row,
            status: editValues.status,
            reason: editValues.reason,
            factoryComments: editValues.factoryComments,
            editedBy: "user@gmail.com"
          }
          : row
      );
      console.log("updatedRows", updatedRows);
    }
  }, [editValues, rows]);

  const handleCancel = useCallback(() => {
    setEditingRowId(null);
    setEditValues(null);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setEditValues((prev) => prev ? { ...prev, status: value } : null);
  }, []);

  const handleReasonChange = useCallback((value: string) => {
    setEditValues((prev) => prev ? { ...prev, reason: value } : null);
  }, []);

  const handleCommentsChange = useCallback((value: string) => {
    setEditValues((prev) => prev ? { ...prev, factoryComments: value } : null);
  }, []);

  const columns = useMemo(() => {
    return createSummaryDashboardColumns(
      isDark,
      editingRowId,
      editValues,
      handleStatusChange,
      handleReasonChange,
      handleCommentsChange,
      handleEdit,
      handleSave,
      handleCancel
    );
  }, [isDark, editingRowId, editValues, handleStatusChange, handleReasonChange, handleCommentsChange, handleEdit, handleSave, handleCancel]);

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <DataGridHeader title="Summary Dashboard Report" />
        <div className="flex items-center gap-2">
          <Button variant="contained" onClick={() => exportToCsv(rows, `Summary-Dashboard-Report-${new Date().toISOString().split('T')[0]}.csv`)}>Export to CSV</Button>
          <Button variant="contained" onClick={() => exportToPng(rows, `Summary-Dashboard-Report-${new Date().toISOString().split('T')[0]}.png`)}>Export to PNG</Button>
        </div>
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
            fontWeight: 600
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
});

SummaryDashGrid.displayName = "SummaryDashGrid";

export default SummaryDashGrid;
