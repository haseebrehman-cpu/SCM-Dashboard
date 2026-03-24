import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo, useCallback } from "react";
import { PAGINATION_MODEL } from '../../mockData/purchaseOrderMock';
import { useInlineEdit } from '../../hooks/useInlineEdit';
import { generatePurchaseOrderColumns } from '../../utils/columnGenerators/purchaseOrder';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { FileUploadDialog } from "../ProductionReport/FileUploadDialog";
import { ProductionReportHeader } from "../ProductionReport/ProductionReportHeader";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { usePurchaseOrderReport, usePatchPurchaseOrderReport, useUploadPurchaseOrderFiles, useUploadPurchaseOrderReport, usePostProductionLoadReport } from "../../api/purchaseOrder";
import toast, { LoaderIcon } from "react-hot-toast";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';
import { useLatestSessionId } from "../../hooks/useLatestSessionId";
import { useDeleteRunningReport } from "../../api/containerDetailReport";
import LoadReportProgressDialog, { LoadStatus } from "./LoadReportProgressDialog";
import { WAREHOUSE_OPTIONS } from '../../constants/productionReport';
import { Warehouse } from "../../types/productionReport";
import { SelectChangeEvent } from "@mui/material";
import { useLoadReportflagCheck } from "../../hooks/useLoadReportflagCheck";

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
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentLoadStep, setCurrentLoadStep] = useState(0);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | undefined>();

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
    setLoadProgress(0);
    setCurrentLoadStep(0);
    setLoadErrorMessage(undefined);
    setIsLoadReportDialogOpen(true);
  }

  const handleConfirmLoadReport = async () => {
    if (sessionId === null) return;

    setLoadStatus('loading');
    setLoadErrorMessage(undefined);

    let currentTaskName = "Initial Report Generation";

    try {
      let step = currentLoadStep;

      if (step === 0) {
        await loadReportMutation.mutateAsync({ session_id: sessionId });
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
        setLoadProgress(20 + (i + 1) * 20);
      }

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
        <Button onClick={() => handleRefreshApi()} disabled={isRefetching} startIcon={isRefetching ? "" : <RefreshIcon />}>{isRefetching ? <>
          Refetching &nbsp; <LoaderIcon />
        </> : "Refresh Report"}</Button>
        <Button
          disabled={!isArrivalEmpty || sessionId === null || isRefetching || isFlagsDisabled || isFlagsLoading}
          onClick={handleLoadReportClick}
          startIcon={<CachedIcon />}
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

      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
        {isDialogOpen && (
          <FileUploadDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onUpload={async (file) => {
              try {
                await uploadMutation.mutateAsync({ file })
                if (uploadMutation.isSuccess) {
                  try {
                    await refetchFlag();
                  } catch (error) {
                    console.error(error)
                  }
                }
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
          />
        )}

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DataGridPremium
            label="Purchase Order Report"
            loading={isLoading}
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
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
