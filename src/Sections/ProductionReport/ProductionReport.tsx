import { DataGridPro } from "@mui/x-data-grid-pro";
import { useTheme } from "../../context/ThemeContext";
import { useState, useMemo } from "react";
import { SelectChangeEvent } from "@mui/material";
import { DataGridHeader } from "../../components/DataGrid/DataGridHeader";
import { FileUploadDialog } from "./FileUploadDialog";
import { Warehouse } from '../../types/productionReport';
import { warehouseData, warehouseContainers } from '../../mockData/productionReportMock';
import { PAGINATION_MODEL } from '../../constants/productionReport';
import { generateProductionColumns } from '../../utils/columnGenerators/productionReport';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { exportProductionReport } from '../../utils/productionReportExport';
import { ProductionReportHeader } from './ProductionReportHeader';

export default function ProductionReport() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>("UK");

  const handleWarehouseChange = (event: SelectChangeEvent<Warehouse>) => {
    setSelectedWarehouse(event.target.value as Warehouse);
  };

  const tableData = warehouseData[selectedWarehouse];
  const containerNumbers = warehouseContainers[selectedWarehouse];

  const columns = useMemo(() =>
    generateProductionColumns({
      selectedWarehouse,
      containerCount: containerNumbers.length,
      isDark,
      currentYear,
    }),
    [selectedWarehouse, containerNumbers.length, isDark, currentYear]
  );

  const handleExport = () => {
    exportProductionReport(tableData, columns, selectedWarehouse);
  };

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <DataGridHeader title="Production Remaining Report" />

        <ProductionReportHeader
          selectedWarehouse={selectedWarehouse}
          isDark={isDark}
          onWarehouseChange={handleWarehouseChange}
          onUploadClick={() => setIsDialogOpen(true)}
          onExportClick={handleExport}
          isSelectWarehouse={true}
          isShowUpload={true}
        />
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
        pageSizeOptions={[100, 500, 1000, 1500]}
        pagination
        autoHeight
        disableRowSelectionOnClick
        sx={getDataGridStyles(isDark)}
      />
    </div>
  );
}
