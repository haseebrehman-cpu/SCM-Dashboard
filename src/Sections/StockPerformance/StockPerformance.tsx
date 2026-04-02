import { useState, useMemo, useEffect } from "react";
import { Button, SelectChangeEvent } from "@mui/material";
import { Warehouse } from '../../types/stockPerformance';
import { StockPerformanceRow } from "../../types/Interfaces/interfaces";
import { generateStockPerformanceColumns } from '../../utils/columnGenerators/stockPerformance';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { ProductionReportHeader } from '../ProductionReport/ProductionReportHeader';
import ArchieveDialog from "../SummaryDash/ArchieveDialog";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { useTheme } from "../../hooks/useTheme";
import { useStockPerfomanceReport, usePrefetchStockPerformance, useLoadStockPerformanceReport } from "../../api/stockPerfomance";
import { useLatestSessionId } from "../../hooks/useLatestSessionId";
import { BrandedLogoLoader } from "../../components/common/BrandedLogoLoader";
import CachedIcon from "@mui/icons-material/Cached";
import { showToast } from "../../utils/toastNotification";
import StockPerformanceLoadProgressDialog, { LoadStatus } from "./StockPerformanceLoadProgressDialog";
import { useDeleteRunningReport } from "../../api/containerDetailReport";
import toast from "react-hot-toast";

export default function StockPerformance() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sessionId = useLatestSessionId();
  const ALL_VALUE = -1;

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>("UK");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 500,
  });
  const [isChangingPage, setIsChangingPage] = useState(false);

  const [isLoadReportDialogOpen, setIsLoadReportDialogOpen] = useState(false);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("idle");
  const [loadProgress, setLoadProgress] = useState(1);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | undefined>();

  const loadReportMutation = useLoadStockPerformanceReport();
  const deleteMutation = useDeleteRunningReport();

  useEffect(() => {
    setIsChangingPage(true);
    const timer = setTimeout(() => {
      setIsChangingPage(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [paginationModel.page, paginationModel.pageSize]);

  const handleWarehouseChange = (event: SelectChangeEvent<Warehouse>) => {
    setSelectedWarehouse(event.target.value as Warehouse);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const { data: reportResponse, isLoading, isSuccess } = useStockPerfomanceReport(
    selectedWarehouse,
    sessionId,
    "spr",
    paginationModel.page + 1,
    paginationModel.pageSize === ALL_VALUE ? "all" : paginationModel.pageSize
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loadStatus === "loading") {
      interval = setInterval(() => {
        setLoadProgress((prev) => {
          // Cap at 90% while loading to keep "room" for the final completion
          if (prev >= 90) return 90;
          const increment = Math.random() * 3 + 1;
          return Math.min(prev + increment, 90);
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loadStatus]);

  const handleLoadReportClick = () => {
    if (sessionId === null || sessionId === undefined) {
      showToast.error("No active session found. Please upload a file first.");
      return;
    }
    setLoadStatus("idle");
    setLoadProgress(1);
    setLoadErrorMessage(undefined);
    setIsLoadReportDialogOpen(true);
  };

  const handleConfirmLoadReport = async () => {
    if (sessionId === null || sessionId === undefined) return;
    setLoadStatus("loading");
    setLoadErrorMessage(undefined);
    setLoadProgress(10);

    try {
      const response = await loadReportMutation.mutateAsync({ session_id: sessionId });

      if (response.success) {
        setLoadProgress(100);
        setLoadStatus("success");
      }
    } catch (error) {
      setLoadStatus("error");
      const apiError = error instanceof Error ? error.message : "An unknown error occurred";
      setLoadErrorMessage(`Failed to load report: ${apiError}`);
      console.error("Load report failed:", error);
    }
  };

  const handleCancelLoadReport = async () => {
    if (sessionId === null || sessionId === undefined) return;
    try {
      await deleteMutation.mutateAsync({ session_id: sessionId });
      setIsLoadReportDialogOpen(false);
      toast.success("Report loading cancelled.");
    } catch (error) {
      toast.error("Failed to cancel report loading.");
      console.log(error);

    }
  };

  usePrefetchStockPerformance(
    selectedWarehouse,
    sessionId,
    "spr",
    paginationModel.page + 1,
    paginationModel.pageSize === ALL_VALUE ? "all" : paginationModel.pageSize,
    isSuccess,
    reportResponse?.pagination?.total_pages ?? reportResponse?.stock_performance_page_count ?? reportResponse?.summary_dashboard_page_count ?? 1
  );

  const tableData = useMemo(() => {
    const data = (reportResponse?.stock_performance_data || reportResponse?.data) as StockPerformanceRow[] | undefined;
    if (!data) return [];
    return data.map((row, index) => ({
      ...row,
      id: row.id ?? `${row.item_number}-${index}`,
      upload_date: row.upload_date,
      itemNumber: row.item_number,
      categoryName: row.category_name,
      itemTitle: row.item_title ?? row.item_number,
      whStock: row.wh_stock,
      linnLast60DaysSale: row.linn_last_60days_sale,
      linnWorksSales: row.linn_next_60days_sale_previousyear,
      fbaLast30Days: row.fba_last_30days_sale,
      fbaLast7Days: row.fba_last_07days_sale,
      fbaStock: row.fba_stock,
      allStock: row.all_stock,
      maxDc: row.max_daily_consumption,
      totalCtn: row.total_ctn,
      daysCover: row.days_cover,
      daysCoverCurrentStock: row.days_cover_current_stock,
      dispatchDateCover: row.dispatch_date_cover,
      daysGap: row.days_gap,
      stockAfterArrival: row.stock_after_arrival,
      stockDaysAfterArrival: row.stock_days_after_arrival,
      remWarehouse: row.remaining,
      oosDays: row.oos_days,
    }));
  }, [reportResponse]);

  const columns = useMemo(
    () =>
      generateStockPerformanceColumns({
        selectedWarehouse,
        isDark,
        data: tableData,
      }),
    [selectedWarehouse, isDark, tableData]
  );

  const isAnyLoading = isLoading || isChangingPage;

  const totalRecords = reportResponse?.pagination?.total_records ?? reportResponse?.stock_performance_count ?? reportResponse?.total_records ?? 0;

  return (
    <>
      <div className="flex justify-end my-4 gap-2 items-center">
        <Button
          onClick={handleLoadReportClick}
          startIcon={<CachedIcon />}
          sx={{
            color: isDark ? "#047ADB" : "#045CB8",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px"
          }}
        >
          Load Reports
        </Button>
        <ProductionReportHeader
          selectedWarehouse={selectedWarehouse}
          isDark={isDark}
          onWarehouseChange={handleWarehouseChange}
          isSelectWarehouse={true}
          isShowUpload={false}
          isArchived={true}
          onArchiveClick={() => setIsDialogOpen(true)}
        />
      </div>
      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden min-h-[400px]">

        {/* Loading Overlay */}
        <BrandedLogoLoader isLoading={isAnyLoading} isDark={isDark} message="Loading Stock Performance Report..." />

        {isDialogOpen && <>
          <ArchieveDialog isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)} />
        </>}

        {isLoadReportDialogOpen && (
          <StockPerformanceLoadProgressDialog
            isOpen={isLoadReportDialogOpen}
            onClose={() => setIsLoadReportDialogOpen(false)}
            onConfirm={handleConfirmLoadReport}
            onRetry={handleConfirmLoadReport}
            onCancel={handleCancelLoadReport}
            isDark={isDark}
            status={loadStatus}
            progress={loadProgress}
            errorMessage={loadErrorMessage}
            containerSuccess={loadReportMutation.status}
          />
        )}

        <DataGridPremium
          label="Stock Performance Report"
          rows={tableData}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          rowCount={totalRecords}
          pageSizeOptions={[500, 1000, 5000, { value: ALL_VALUE, label: `Show All` }]}
          pagination
          loading={isAnyLoading}
          disableRowSelectionOnClick
          rowBufferPx={100}
          sx={getDataGridStyles(isDark, "690px")}
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
}
