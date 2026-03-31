import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo, useEffect } from "react";
import { SummaryDashboardRow } from "../../config/summaryDashboard";
import { createSummaryDashboardColumns } from "../../utils/dataGridColumns";
import React from "react";
import { useSummaryEdit } from '../../hooks/useSummaryEdit';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { ProductionReportHeader } from "../ProductionReport/ProductionReportHeader";
import ArchieveDialog from "./ArchieveDialog";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { Warehouse } from "../../types/common";
import { SelectChangeEvent } from "@mui/material";
import { useStockPerfomanceReport, usePrefetchStockPerformance } from "../../api/stockPerfomance";
import { useLatestSessionId } from "../../hooks/useLatestSessionId";
import { BrandedLogoLoader } from "../../components/common/BrandedLogoLoader";

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
    pageSize: 1000,
  });
  const [isChangingPage, setIsChangingPage] = useState(false);

  // Show a brief loader when changing pages to provide feedback
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

  const { data: reportResponse, isLoading, isSuccess } = useStockPerfomanceReport(
    selectedWarehouse,
    sessionId,
    "sd",
    paginationModel.page + 1,
    paginationModel.pageSize
  );

  // Prefetch next 9 pages when successful
  usePrefetchStockPerformance(
    selectedWarehouse,
    sessionId,
    "sd",
    paginationModel.page + 1,
    paginationModel.pageSize,
    isSuccess
  );

  useEffect(() => {
    if (reportResponse?.summary_dashboard_data) {
      const mappedRows = reportResponse.summary_dashboard_data.map((row: any) => ({
        ...row,
        id: row.id,
        itemNumber: row.item_number,
        itemTitle: row.item_title,
        categoryName: row.category_name,
        wh: row.warehouse_code,
        fbaWhCoverDay: row.fba_wh_cover_day,
        remaining: row.remaining,
        totalDispatchQty: row.total_dispatch_quantity,
        dispatchCoverDay: row.dispatch_cover_day,
        maxD: row.max_daily_consumption,
        status: row.status,
        reason1: row.reason_1,
        reason2: row.reason_2,
        reason3: row.reason_3,
        reason4: row.reason_4,
        factoryComments: row.factory_comments,
        editedBy: row.edited_by,
      }));
      setRows(mappedRows);
    } else if (!isLoading) {
      setRows([]);
    }
  }, [reportResponse, isLoading]);

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
          rowCount={reportResponse?.summary_dashboard_count ?? 0}
          pageSizeOptions={[500, 1000, 2500, 5000]}
          pagination
          rowBufferPx={100}
          loading={false}
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

