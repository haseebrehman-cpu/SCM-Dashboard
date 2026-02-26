import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo, useCallback } from "react";
import { mockContainers, PAGINATION_MODEL } from '../../mockData/purchaseOrderMock';
import { useInlineEdit } from '../../hooks/useInlineEdit';
import { generatePurchaseOrderColumns } from '../../utils/columnGenerators/purchaseOrder';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { FileUploadDialog } from "../ProductionReport/FileUploadDialog";
import { ProductionReportHeader } from "../ProductionReport/ProductionReportHeader";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { usePurchaseOrderReport, usePatchPurchaseOrderReport } from "../../api/purchaseOrder";
import toast from "react-hot-toast";

export default function PurchaseOrder() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [tableData, setTableData] = useState(mockContainers);
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
  } = useInlineEdit(setTableData);

  const { data: purchaseOrderResponse, isLoading, refetch } = usePurchaseOrderReport();
  const patchMutation = usePatchPurchaseOrderReport();

  const apiData = purchaseOrderResponse?.data || [];

  // Use API data if available, otherwise fall back to mock data
  const displayData = apiData.length > 0 ? apiData : tableData;

  const handleDateChange = useCallback((rowId: number, arrivalDate: string) => {
    if (!isEditing(rowId)) return;
    updateEditedData({ arrivalDate });
  }, [isEditing, updateEditedData]);

  const handleSave = useCallback(async () => {
    if (editingRowId !== null) {
      setUpdatingRowId(editingRowId);
      setIsUpdatingDate(true);

      try {
        if (editedData?.arrivalDate) {
          await patchMutation.mutateAsync({ rowId: editingRowId, arrivalDate: editedData.arrivalDate });
          await refetch()
        }

        await saveEdit("test@mail.com");
        toast.success('Record Updated Successfully!');
      } catch (error) {
        console.error('Failed to save data:', error);
        toast.error('Failed to save data');
      } finally {
        setIsUpdatingDate(false);
        setUpdatingRowId(null);
      }
    }
  }, [editingRowId, editedData, patchMutation, saveEdit,]);


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

  return (
    <>
      <div className="flex justify-end my-2">
        <ProductionReportHeader
          isDark={isDark}
          onUploadClick={() => setIsDialogOpen(true)}
          isSelectWarehouse={false}
          isShowUpload={true}
        />
      </div>
      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">

        {isDialogOpen && (
          <FileUploadDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
          />
        )}

        <DataGridPremium
          label="Purchase Order Report"
          loading={isLoading}
          rows={displayData}
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
      </div>
    </>
  );
}
