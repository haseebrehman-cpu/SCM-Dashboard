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
import { usePurchaseOrderReport, usePatchPurchaseOrderReport, useUploadPurchaseOrderFiles } from "../../api/purchaseOrder";
import toast from "react-hot-toast";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from "@mui/material";
import CachedIcon from '@mui/icons-material/Cached';

export default function PurchaseOrder() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdatingDate, setIsUpdatingDate] = useState(false);
  const [updatingRowId, setUpdatingRowId] = useState<number | null>(null);

  const {
    editingRowId,
    editedData,
    isEditing,
    startEdit,
    saveEdit,
    cancelEdit,
    updateEditedData,
  } = useInlineEdit();

  const { data: purchaseOrderResponse, isLoading, refetch } = usePurchaseOrderReport();
  const patchMutation = usePatchPurchaseOrderReport();
  const uploadMutation = useUploadPurchaseOrderFiles();

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

  return (
    <>
      <div className="flex justify-end my-2">
        <Button onClick={() => handleRefreshApi()} startIcon={<RefreshIcon />} >Refresh Report</Button>
        <Button onClick={() => handleRefreshApi()} startIcon={<CachedIcon />}>Load Reports</Button>
        <ProductionReportHeader
          isDark={isDark}
          onUploadClick={() => setIsDialogOpen(true)}
          isSelectWarehouse={false}
          isShowUpload={true}
        />
      </div>
      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
          ⚠️ Attention
        </p>
        <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
          Arrival Dates cannot be empty, please make sure to fill the arrival dates for all records
        </p>
      </div>
      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
        {isDialogOpen && (
          <FileUploadDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onUpload={async (file) => {
              try {
                await uploadMutation.mutateAsync(file);
              } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to upload file";
                toast.error(message);
                throw error;
              }
            }}
          />
        )}

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DataGridPremium
            label="Purchase Order Report"
            loading={isLoading}
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
            pageSizeOptions={[100, 500, 1000]}
            rowBufferPx={100}
            pagination
            sx={getDataGridStyles(isDark, "75vh")}
            showToolbar
            rowSelection={false}
            slotProps={{
              toolbar: {
                printOptions: { disableToolbarButton: true },
                excelOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: false },
              }
            }}
          />
        </LocalizationProvider>
      </div>
    </>
  );
}
