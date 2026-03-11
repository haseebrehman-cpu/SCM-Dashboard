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
import { usePurchaseOrderReport, usePatchPurchaseOrderReport, useUploadPurchaseOrderFiles, useUploadPurchaseOrderReport } from "../../api/purchaseOrder";
import toast, { LoaderIcon } from "react-hot-toast";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';
import { useLatestSessionId } from "../../hooks/useLatestSessionId";
import { useDeleteRunningReport } from "../../api/containerDetailReport";
import LoadReportProgressDialog from "./LoadReportProgressDialog";

export default function PurchaseOrder() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadReportDialogOpen, setIsLoadReportDialogOpen] = useState(false);
  const [isUpdatingDate, setIsUpdatingDate] = useState(false);
  const [updatingRowId, setUpdatingRowId] = useState<number | null>(null);

  const latestSessionId = useLatestSessionId();
  const sessionId = latestSessionId;
  const loadReportMutation = useUploadPurchaseOrderReport();

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

  console.log(editedData?.arrivalDate);


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
        toast.error('Failed to save data');
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
      const result = await refetch()
      if (result.isSuccess) {
        toast.success("Data Refetched Successfully!")
      } else if (result.isError) {
        toast.error("Failed to refetch data. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while refetching data.");
      console.error("Refetch error:", error);
    }
  }

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

  const handleLoadReportClick = () => {
    if (sessionId === null) {
      toast.error("No upload session found. Please upload a file first.");
      return;
    }
    setIsLoadReportDialogOpen(true);
  }

  const handleConfirmLoadReport = async () => {
    if (sessionId !== null) {
      try {
        await loadReportMutation.mutateAsync({ session_id: sessionId });
      } catch (error) {
        console.error("Failed to load report:", error);
      }
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
          disabled={!isArrivalEmpty || sessionId === null || isRefetching}
          onClick={handleLoadReportClick}
          startIcon={<CachedIcon />}
        >
          Load Reports
        </Button>
        <ProductionReportHeader
          isDark={isDark}
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
                await uploadMutation.mutateAsync({ file });
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
            onCancel={handleCancelLoadReport}
            isDark={isDark}
            isPending={loadReportMutation.isPending}
            isSuccess={loadReportMutation.isSuccess}
            isError={loadReportMutation.isError}
            errorMessage={loadReportMutation.error?.message}
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
