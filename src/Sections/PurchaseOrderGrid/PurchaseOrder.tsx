import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo, useCallback, useEffect } from "react";
import { PAGINATION_MODEL } from '../../mockData/purchaseOrderMock';
import { useInlineEdit } from '../../hooks/useInlineEdit';
import { generatePurchaseOrderColumns } from '../../utils/columnGenerators/purchaseOrder';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { FileUploadDialog } from "../ProductionReport/FileUploadDialog";
import { ProductionReportHeader } from "../ProductionReport/ProductionReportHeader";
import { DataGridPremium, GridPaginationModel } from "@mui/x-data-grid-premium";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { usePurchaseOrderReport, usePatchPurchaseOrderReport, useUploadPurchaseOrderFiles, useUploadPurchaseOrderReport, usePostProductionLoadReport } from "../../api/purchaseOrder";
import toast, { LoaderIcon } from "react-hot-toast";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';

import { useLatestSessionId } from "../../hooks/useLatestSessionId";
import { useDeleteRunningReport } from "../../api/containerDetailReport";
import LoadReportProgressDialog, { LoadStatus } from "./LoadReportProgressDialog";
import { WAREHOUSE_OPTIONS } from '../../constants/productionReport';
import { Warehouse } from "../../types/productionReport";
import { SelectChangeEvent } from "@mui/material";
import { BrandedLogoLoader } from "../../components/common/BrandedLogoLoader";
import { useLoadReportflagCheck } from "../../hooks/useLoadReportFlagCheck";

export default function PurchaseOrder() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadReportDialogOpen, setIsLoadReportDialogOpen] = useState(false);
  const [isUpdatingDate, setIsUpdatingDate] = useState(false);
  const [updatingRowId, setUpdatingRowId] = useState<number | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>("UK");

  const latestSessionId = useLatestSessionId();
  const sessionId = latestSessionId;
  const loadReportMutation = useUploadPurchaseOrderReport();
  const postProductionLoadReportMutation = usePostProductionLoadReport();

  const { isButtonDisabled: isFlagsDisabled, isLoading: isFlagsLoading, refetchAll: refetchFlag } = useLoadReportflagCheck(selectedWarehouse, sessionId);

  const [loadStatus, setLoadStatus] = useState<LoadStatus>('idle');
  const [loadProgress, setLoadProgress] = useState(1);
  const [currentLoadStep, setCurrentLoadStep] = useState(0);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | undefined>();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(PAGINATION_MODEL);
  const [isChangingPage, setIsChangingPage] = useState(false);

  const {
    editingRowId,
    editedData,
    isEditing,
    startEdit,
    saveEdit,
    cancelEdit,
    updateEditedData,
  } = useInlineEdit();

  const { data: purchaseOrderResponse, isLoading, refetch, isRefetching } = usePurchaseOrderReport();
  const isAnyLoading = isLoading || isChangingPage || isRefetching;

  const patchMutation = usePatchPurchaseOrderReport();
  const uploadMutation = useUploadPurchaseOrderFiles();
  const deleteMutation = useDeleteRunningReport()

  const apiData = purchaseOrderResponse?.data;

  const rows = apiData ?? [];

  const handleDateChange = useCallback((rowId: number, arrivalDate: string) => {
    if (!isEditing(rowId)) return;
    updateEditedData({ arrivalDate });
  }, [isEditing, updateEditedData]);

  const handleSave = useCallback(async () => {
    if (editingRowId !== null) {
      setUpdatingRowId(editingRowId);
      setIsUpdatingDate(true);

      try {
        if (editedData) {
          await patchMutation.mutateAsync({
            rowId: editingRowId,
            arrivalDate: editedData.arrivalDate === "" ? null : editedData.arrivalDate,
          });
        }
        saveEdit("test@mail.com");
        toast.success('Record Updated Successfully!');
      } catch (error) {
        console.error('Failed to save data:', error);
        const message = error instanceof Error ? error.message : 'Failed to save data';
        toast.error(message);
      } finally {
        setIsUpdatingDate(false);
        setUpdatingRowId(null);
      }
    }
  }, [editingRowId, editedData, patchMutation, saveEdit]);

  const columns = useMemo(
    () =>
      generatePurchaseOrderColumns({
        isDark,
        editedData,
        isEditing,
        startEdit,
        saveEdit: handleSave,
        cancelEdit,
        onDateChange: handleDateChange,
        isUpdatingDate,
        updatingRowId,
      }),
    [isDark, editedData, isEditing, startEdit, handleSave, cancelEdit, handleDateChange, isUpdatingDate, updatingRowId]
  );

  const handleRefreshApi = async () => {
    try {
      const result = await refetch();
      await refetchFlag();
      if (result.isSuccess) {
        toast.success("Data Refetched Successfully!");
      } else if (result.isError) {
        const message = result.error instanceof Error ? result.error.message : "Failed to refetch data. Please try again.";
        toast.error(message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred while refetching data.";
      toast.error(message);
      console.error("Refetch error:", error);
    }
  };

  const arrivalDates = rows.map((item) => item.arrival_date)

  function checkForEmptyItems(arr: (string | null)[]): boolean {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (item === null ||
        item === undefined ||
        item === '' ||
        (typeof item === 'string' && item.trim() === '')) {
        console.log(`Empty item found at index ${i}: "${item}"`);
        return false;
      }
    }
    return true;
  }

  const isArrivalEmpty = checkForEmptyItems(arrivalDates)

  const countEmptyItems = (arr: (string | null | undefined)[]): number => {
    let count = 0;
    for (const item of arr) {
      if (item == null || (typeof item === 'string' && item.trim() === '')) {
        count++;
      }
    }
    return count;
  };

  const emptyItemCount = countEmptyItems(arrivalDates);

  const handleWarehouseChange = (event: SelectChangeEvent<Warehouse>) => {
    setSelectedWarehouse(event.target.value as Warehouse);
  };

  const handleLoadReportClick = () => {
    if (sessionId === null) {
      toast.error("No upload session found. Please upload a file first.");
      return;
    }
    setLoadStatus('idle');
    setLoadProgress(1);
    setCurrentLoadStep(0);
    setLoadErrorMessage(undefined);
    setIsLoadReportDialogOpen(true);
  }

  // Show a brief loader when changing pages to provide feedback
  useEffect(() => {
    setIsChangingPage(true);
    const timer = setTimeout(() => {
      setIsChangingPage(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [paginationModel]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loadStatus === 'loading') {
      interval = setInterval(() => {
        setLoadProgress((prev) => {
          if (prev >= 99) return 99;

          // Total steps: 1 (Main Report) + 4 (Warehouse Reports) = 5
          const totalSteps = WAREHOUSE_OPTIONS.length + 1;
          const progressPerStep = 100 / totalSteps;
          const currentMilestone = (currentLoadStep + 1) * progressPerStep;

          if (prev < currentMilestone - 1) {
            const increment = Math.random() * 2 + 0.5;
            return Math.min(prev + increment, currentMilestone - 0.5, 99);
          }
          return prev;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [loadStatus, currentLoadStep]);

  const handleConfirmLoadReport = async () => {
    if (sessionId === null) return;

    setLoadStatus('loading');
    setLoadErrorMessage(undefined);

    let currentTaskName = "Initial Report Generation";

    try {
      let step = currentLoadStep;

      if (step === 0) {
        await loadReportMutation.mutateAsync({ session_id: sessionId });
        try {
          await refetchFlag();
        } catch (error) {
          console.error(error)
        }
        step = 1;
        setCurrentLoadStep(1);
        setLoadProgress(20);
      }

      for (let i = step - 1; i < WAREHOUSE_OPTIONS.length; i++) {
        currentTaskName = `Report for ${WAREHOUSE_OPTIONS[i].label}`;
        await postProductionLoadReportMutation.mutateAsync({
          warehouse_region: WAREHOUSE_OPTIONS[i].value,
          session_id: sessionId,
        });
        const nextStep = i + 2;
        setCurrentLoadStep(nextStep);
        const progress = 20 + (i + 1) * 20;
        setLoadProgress(Math.min(progress, 99));
      }

      setLoadProgress(100);
      setLoadStatus('success');
    } catch (error) {
      setLoadStatus('error');
      const apiError = error instanceof Error ? error.message : "An unknown error occurred";
      setLoadErrorMessage(`${currentTaskName} failed: ${apiError}. Click Retry to continue the process.`);
      console.error("Failed to load report:", error);
    }
  }

  const handleCancelLoadReport = async () => {
    if (sessionId !== null) {
      try {
        await deleteMutation.mutateAsync({ session_id: sessionId });
        setIsLoadReportDialogOpen(false)
        toast.success("Report loading cancelled.");
      } catch (error) {
        toast.error("Failed to cancel report loading.");
        console.error("Cancel error:", error);
      }
    }
  }

  return (
    <>
      <div className="flex justify-end my-2">
        <Button
          sx={{
            color: isDark ? '#047ADB' : '#045CB8',
            // '&:hover': {
            //   backgroundColor: isDark ? 'rgba(251, 191, 36, 0.08)' : 'rgba(146, 64, 14, 0.08)'
            // }
          }}
          onClick={() => handleRefreshApi()}
          disabled={isRefetching}
          startIcon={isRefetching ? "" : <RefreshIcon />}
        >
          {isRefetching ? <>
            Refetching &nbsp; <LoaderIcon />
          </> : "Refresh Report"}
        </Button>
        <Button
          disabled={!isArrivalEmpty || sessionId === null || isRefetching || isFlagsDisabled || isFlagsLoading}
          onClick={handleLoadReportClick}
          startIcon={<CachedIcon />}
          sx={{
            color: isDark ? '#047ADB' : '#045CB8',
            // '&:hover': {
            //   backgroundColor: isDark ? 'rgba(251, 191, 36, 0.08)' : 'rgba(146, 64, 14, 0.08)'
            // }
          }}
        >
          {isFlagsLoading ? "Checking Status..." : "Load Reports"}
        </Button>
        <ProductionReportHeader
          selectedWarehouse={selectedWarehouse}
          isDark={isDark}
          onWarehouseChange={handleWarehouseChange}
          onUploadClick={() => setIsDialogOpen(true)}
          isSelectWarehouse={false}
          isShowUpload={true}
        />
      </div>
      {!isArrivalEmpty && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
            ⚠️ Attention
          </p>
          <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
            Arrival Dates cannot be empty, please make sure to fill the arrival dates for all records.
            {` Count of missing arrival dates: ${emptyItemCount}`}
          </p>
        </div>
      )}

      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden min-h-[400px]">
        {/* Loading Overlay */}
        <BrandedLogoLoader isLoading={isAnyLoading} isDark={isDark} message="Loading Purchase Order Report..." />

        {isDialogOpen && (
          <FileUploadDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onUpload={async (file) => {
              try {
                await uploadMutation.mutateAsync({ file })
              } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to upload file";
                toast.error(message);
                throw error;
              }
            }}
          />
        )}

        {isLoadReportDialogOpen && (
          <LoadReportProgressDialog
            isOpen={isLoadReportDialogOpen}
            onClose={() => setIsLoadReportDialogOpen(false)}
            onConfirm={handleConfirmLoadReport}
            onRetry={handleConfirmLoadReport}
            onCancel={handleCancelLoadReport}
            isDark={isDark}
            status={loadStatus}
            progress={loadProgress}
            errorMessage={loadErrorMessage}
            showRetry={currentLoadStep >= 1}
            containerSuccess={loadReportMutation.status}
          />
        )}

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DataGridPremium
            label="Purchase Order Report"
            loading={false}
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[100, 250, 500, 1000, 1500]}
            rowBufferPx={100}
            pagination
            sx={getDataGridStyles(isDark, "75vh")}
            showToolbar
            rowSelection={false}
            slotProps={{
              toolbar: {
                printOptions: { disableToolbarButton: true },
                excelOptions: { disableToolbarButton: true, fileName: "PurchaseOrder" },
                csvOptions: { disableToolbarButton: false, fileName: "Purchase_Order_SCM Dashboard" },
              }
            }}
          />
        </LocalizationProvider>
      </div>
    </>
  );
}
