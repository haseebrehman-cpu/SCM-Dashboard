import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo } from "react";
import { mockContainers, PAGINATION_MODEL } from '../../mockData/purchaseOrderMock';
import { useInlineEdit } from '../../hooks/useInlineEdit';
import { generatePurchaseOrderColumns } from '../../utils/columnGenerators/purchaseOrder';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { FileUploadDialog } from "../ProductionReport/FileUploadDialog";
import { ProductionReportHeader } from "../ProductionReport/ProductionReportHeader";
import { DataGridPremium } from "@mui/x-data-grid-premium";

export default function PurchaseOrder() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tableData, setTableData] = useState(mockContainers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    editedData,
    isEditing,
    startEdit,
    saveEdit,
    cancelEdit,
    updateEditedData,
  } = useInlineEdit(setTableData);

  const columns = useMemo(
    () =>
      generatePurchaseOrderColumns({
        isDark,
        editedData,
        isEditing,
        startEdit,
        saveEdit: () => saveEdit("haseeb.rehman@igate.com.pk"),
        cancelEdit,
        updateEditedData,
      }),
    [isDark, editedData, isEditing, startEdit, saveEdit, cancelEdit, updateEditedData]
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
          rows={tableData}
          columns={columns}
          initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
          pageSizeOptions={[100, 500, 1000]}
          rowBufferPx={100}
          pagination
          sx={getDataGridStyles(isDark)}
          showToolbar
        />
      </div>
    </>
  );
}
