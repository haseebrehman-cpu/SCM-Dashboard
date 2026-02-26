import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo } from "react";
import { SummaryDashboardRow } from "../../config/summaryDashboard";
import { generateSummaryDashboardData } from "../../utils/dataGenerators";
import { createSummaryDashboardColumns } from "../../utils/dataGridColumns";
import React from "react";
import { useSummaryEdit } from '../../hooks/useSummaryEdit';
import { PAGINATION_CONFIG, DEFAULT_ROW_COUNT } from '../../constants/summaryDash';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { ProductionReportHeader } from "../ProductionReport/ProductionReportHeader";
import ArchieveDialog from "./ArchieveDialog";
import { DataGridPremium } from "@mui/x-data-grid-premium";

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

  return (
    <>
      <div className="flex justify-end my-4">
        <ProductionReportHeader
          isDark={isDark}
          isArchieved={true}
          isSelectWarehouse={false}
          isShowUpload={false}
          onArchieveCLick={() => setIsDialogOpen(true)}
        />
      </div>
      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">

        {isDialogOpen && <>
          <ArchieveDialog isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)} />
        </>}

        <DataGridPremium
          label="Summary Dashboard Report"
          rows={rows}
          columns={columns}
          pageSizeOptions={PAGINATION_CONFIG.pageSizeOptions}
          initialState={{
            pagination: {
              paginationModel: { pageSize: PAGINATION_CONFIG.defaultPageSize },
            },
          }}
          pagination
          rowBufferPx={100}
          disableRowSelectionOnClick
          sx={getDataGridStyles(isDark, "auto")}
          showToolbar
          slotProps={{
            toolbar: {
              printOptions: { disableToolbarButton: true },
              excelOptions: { disableToolbarButton: true }, 
              csvOptions: { disableToolbarButton: false }, 
            }
          }}
        />
      </div>
    </>
  );
});

export default SummaryDashGrid;

