import { useTheme } from "../../context/ThemeContext";
import { useState, useMemo } from "react";
import { SummaryDashboardRow } from "../../config/summaryDashboard";
import { generateSummaryDashboardData } from "../../utils/dataGenerators";
import { createSummaryDashboardColumns } from "../../utils/dataGridColumns";
import { DataGridHeader } from "../../components/DataGrid/DataGridHeader";
import React from "react";
import { exportToCsv } from "../../utils/exportToCsv";
import { useSummaryEdit } from './useSummaryEdit';
import { PAGINATION_CONFIG, DEFAULT_ROW_COUNT } from './constants';
import { getDataGridStyles } from '../ProductionReport/styles';
import { ProductionReportHeader } from "../ProductionReport/ProductionReportHeader";
import ArchieveDialog from "./ArchieveDialog";
import { DataGridPro } from "@mui/x-data-grid-pro";

/**
 * Summary Dashboard Grid Component
 * Refactored to follow Single Responsibility Principle and React best practices
 */
const SummaryDashGrid: React.FC = React.memo(() => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [rows, setRows] = useState<SummaryDashboardRow[]>(() => generateSummaryDashboardData(DEFAULT_ROW_COUNT));
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const {
    editingRowId,
    editValues,
    handleEdit,
    handleSave,
    handleCancel,
    handleStatusChange,
    handleReasonChange,
    handleCommentsChange,
  } = useSummaryEdit(setRows);

  const columns = useMemo(() => {
    return createSummaryDashboardColumns(
      isDark,
      editingRowId,
      editValues,
      handleStatusChange,
      handleReasonChange,
      handleCommentsChange,
      (id: number) => handleEdit(id, rows),
      handleSave,
      handleCancel
    );
  }, [isDark, editingRowId, editValues, handleStatusChange, handleReasonChange, handleCommentsChange, handleEdit, handleSave, handleCancel, rows]);

  const handleExport = () => {
    exportToCsv(rows, `Summary-Dashboard-Report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <DataGridHeader title="Summary Dashboard Report" />

        <ProductionReportHeader
          isDark={isDark}
          onExportClick={handleExport}
          isArchieved={true}
          isSelectWarehouse={false}
          isShowUpload={false}
          onArchieveCLick={() => setIsDialogOpen(true)}
        />
      </div>

      {isDialogOpen && <>
        <ArchieveDialog isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)} />
      </>}

      <DataGridPro
        rows={rows}
        columns={columns}
        pageSizeOptions={PAGINATION_CONFIG.pageSizeOptions}
        initialState={{
          pagination: {
            paginationModel: { pageSize: PAGINATION_CONFIG.defaultPageSize },
          },
        }}
        pagination
        autoHeight
        disableRowSelectionOnClick
        sx={getDataGridStyles(isDark)}
      />
    </div>
  );
});

SummaryDashGrid.displayName = "SummaryDashGrid";

export default SummaryDashGrid;

