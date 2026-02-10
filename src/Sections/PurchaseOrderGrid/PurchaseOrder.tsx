import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "../../context/ThemeContext";
import { useState, useMemo } from "react";
import { Button } from "@mui/material";
import { exportToCsv } from "../../utils/exportToCsv";
import { DataGridHeader } from "../../components/DataGrid/DataGridHeader";
import { mockContainers, PAGINATION_MODEL } from './mockData';
import { useInlineEdit } from './useInlineEdit';
import { generatePurchaseOrderColumns } from './columnGenerator';
import { getDataGridStyles } from '../ProductionReport/styles';

export default function PurchaseOrder() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tableData, setTableData] = useState(mockContainers);

  const {
    editedData,
    isEditing,
    startEdit,
    saveEdit,
    cancelEdit,
    updateEditedData,
  } = useInlineEdit(setTableData);

  const columns = useMemo(
    () =>
      generatePurchaseOrderColumns({
        isDark,
        editedData,
        isEditing,
        startEdit,
        saveEdit,
        cancelEdit,
        updateEditedData,
      }),
    [isDark, editedData, isEditing, startEdit, saveEdit, cancelEdit, updateEditedData]
  );

  const handleExport = () => {
    exportToCsv(
      tableData,
      `Purchase-Order-Report-${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <DataGridHeader title="Purchase Order Report" />

        <div className="flex items-center gap-2">
          <Button
            variant="contained"
            onClick={handleExport}
            sx={{ borderRadius: '20px', fontSize: '12px' }}
          >
            Export to CSV
          </Button>
        </div>
      </div>

      <DataGrid
        rows={tableData}
        columns={columns}
        initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
        pageSizeOptions={[5, 10, 15]}
        autoHeight
        sx={getDataGridStyles(isDark)}
      />
    </div>
  );
}
