import { useTheme } from "../../context/ThemeContext";
import { useState, useMemo } from "react";
import { SelectChangeEvent } from "@mui/material";
import { exportToCsv } from "../../utils/exportToCsv";
import { DataGridHeader } from "../../components/DataGrid/DataGridHeader";
import { Warehouse } from '../../types/stockPerformance';
import { warehouseData, warehouseContainers, PAGINATION_MODEL } from '../../mockData/stockPerformanceMock';
import { generateStockPerformanceColumns } from '../../utils/columnGenerators/stockPerformance';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { ProductionReportHeader } from '../ProductionReport/ProductionReportHeader';
import ArchieveDialog from "../SummaryDash/ArchieveDialog";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { FileUploadDialog } from "../ProductionReport/FileUploadDialog";

export default function StockPerformance() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>("UK");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleWarehouseChange = (event: SelectChangeEvent<Warehouse>) => {
    setSelectedWarehouse(event.target.value as Warehouse);
  };

  const tableData = warehouseData[selectedWarehouse];
  const containers = warehouseContainers[selectedWarehouse];

  const columns = useMemo(
    () =>
      generateStockPerformanceColumns({
        selectedWarehouse,
        containers,
        isDark,
      }),
    [selectedWarehouse, containers, isDark]
  );

  const handleExport = () => {
    exportToCsv(
      tableData,
      `Stock-Performance-Report-${selectedWarehouse}-${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <DataGridHeader title="Stock Performance Report" />

        <ProductionReportHeader
          selectedWarehouse={selectedWarehouse}
          isDark={isDark}
          onWarehouseChange={handleWarehouseChange}
          onExportClick={handleExport}
          isSelectWarehouse={true}
          isShowUpload={true}
          isArchieved={true}
          onArchieveCLick={() => setIsDialogOpen(true)}
          onUploadClick={() => setIsUploadDialogOpen(true)}
        />
      </div>

      {isDialogOpen && <>
        <ArchieveDialog isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)} /> 
      </>}


      {isUploadDialogOpen && (
        <FileUploadDialog
          isOpen={isUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
        />
      )}
      <DataGridPro
        rows={tableData}
        columns={columns}
        initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
        pageSizeOptions={[100, 500, 1000, 1500]}
        autoHeight
        pagination
        disableRowSelectionOnClick
        sx={getDataGridStyles(isDark)}
      />
    </div>
  );
}
