import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo, useEffect } from "react";
import { SummaryDashboardRow } from "../../config/summaryDashboard";
import { createSummaryDashboardColumns } from "../../utils/dataGridColumns";
import React from "react";
import { useSummaryEdit } from "../../hooks/useSummaryEdit";
import { getDataGridStyles } from "../../styles/productionReportStyles";
import { ProductionReportHeader } from "../ProductionReport/ProductionReportHeader";
import ArchieveDialog from "./ArchieveDialog";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { Warehouse } from "../../types/common";
import { SelectChangeEvent } from "@mui/material";
import { useLatestSessionId } from "../../hooks/useLatestSessionId";
import { BrandedLogoLoader } from "../../components/common/BrandedLogoLoader";
import { useSummaryDashboardData } from "../../hooks/useSummaryDashboardData";

/**
 * Summary Dashboard Grid Component
 */
const SummaryDashGrid: React.FC = React.memo(() => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sessionId = useLatestSessionId();

  const [rows, setRows] = useState<SummaryDashboardRow[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>("UK");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 500,
  });
  const [isChangingPage, setIsChangingPage] = useState(false);

  useEffect(() => {
    setIsChangingPage(true);
    const timer = setTimeout(() => {
      setIsChangingPage(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [paginationModel.page, paginationModel.pageSize]);

  const handleWarehouseChange = (event: SelectChangeEvent<Warehouse>) => {
    setSelectedWarehouse(event.target.value as Warehouse);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const { rows: summaryRows, rowCount, isLoading } = useSummaryDashboardData({
    selectedWarehouse,
    sessionId,
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
  });

  // Keep local rows state in sync with summaryRows for editing logic
  useEffect(() => {
    setRows(summaryRows);
  }, [summaryRows]);
  
  console.log(summaryRows);
  

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

  const isAnyLoading = isLoading || isChangingPage;

  return (
    <>
      <div className="flex justify-end my-4">
        <ProductionReportHeader
          selectedWarehouse={selectedWarehouse}
          isDark={isDark}
          onWarehouseChange={handleWarehouseChange}
          isArchieved={true}
          isSelectWarehouse={true}
          isShowUpload={false}
          onArchieveCLick={() => setIsDialogOpen(true)}
        />
      </div>
      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden min-h-[400px]">

        {/* Loading Overlay */}
        <BrandedLogoLoader isLoading={isAnyLoading} isDark={isDark} message="Loading Summary Dashboard" />

        {isDialogOpen && <>
          <ArchieveDialog isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)} />
        </>}

        <DataGridPremium
          label="Summary Dashboard Report"
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          rowCount={rowCount}
          pageSizeOptions={[500, 1000, 2500, 5000]}
          pagination
          rowBufferPx={100}
          loading={isAnyLoading}
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

