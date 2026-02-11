import { useTheme } from "../../context/ThemeContext";
import { useState, useMemo } from "react";
import { exportToCsv } from "../../utils/exportToCsv";
import { DataGridHeader } from "../../components/DataGrid/DataGridHeader";
import { mockContainers, PAGINATION_MODEL } from '../../mockData/purchaseOrderMock';
import { useInlineEdit } from '../../hooks/useInlineEdit';
import { generatePurchaseOrderColumns } from '../../utils/columnGenerators/purchaseOrder';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { FileUploadDialog } from "../ProductionReport/FileUploadDialog";
import { ProductionReportHeader } from "../ProductionReport/ProductionReportHeader";
import { DataGridPro } from "@mui/x-data-grid-pro";

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
        saveEdit,
        cancelEdit,
        updateEditedData,
      }),
    [isDark, editedData, isEditing, startEdit, saveEdit, cancelEdit, updateEditedData]
  );

  const handleExport = () => {
    exportToCsv(
      tableData,
      `Purchase-Order-Report-${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <DataGridHeader title="Purchase Order Report" />

        <div className="flex items-center gap-2">
          <ProductionReportHeader
            isDark={isDark}
            onUploadClick={() => setIsDialogOpen(true)}
            onExportClick={handleExport}
            isSelectWarehouse={false}
            isShowUpload={true}
          />
        </div>
      </div>

      {isDialogOpen && (
        <FileUploadDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}

      <DataGridPro
        rows={tableData}
        columns={columns}
        initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
        pageSizeOptions={[100, 500, 1000]}
        autoHeight
        pagination
        sx={getDataGridStyles(isDark)}
      />
    </div>
  );
}
