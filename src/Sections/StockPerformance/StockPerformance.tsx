import { useState, useMemo } from "react";
import { SelectChangeEvent } from "@mui/material";
import { Warehouse } from '../../types/stockPerformance';
import { warehouseData, warehouseContainers, PAGINATION_MODEL } from '../../mockData/stockPerformanceMock';
import { generateStockPerformanceColumns } from '../../utils/columnGenerators/stockPerformance';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { ProductionReportHeader } from '../ProductionReport/ProductionReportHeader';
import ArchieveDialog from "../SummaryDash/ArchieveDialog";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { FileUploadDialog } from "../ProductionReport/FileUploadDialog";
import { useTheme } from "../../hooks/useTheme";

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

  return (
    <>
      <div className="flex justify-end my-4">
        <ProductionReportHeader
          selectedWarehouse={selectedWarehouse}
          isDark={isDark}
          onWarehouseChange={handleWarehouseChange}
          isSelectWarehouse={true}
          isShowUpload={true}
          isArchieved={true}
          onArchieveCLick={() => setIsDialogOpen(true)}
          onUploadClick={() => setIsUploadDialogOpen(true)}
        />
      </div>
      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">

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
        <DataGridPremium
          label="Stock Performance Report"
          rows={tableData}
          columns={columns}
          initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
          pageSizeOptions={[100, 500, 1000, 1500]}
          pagination
          disableRowSelectionOnClick
          rowBufferPx={100}
          sx={getDataGridStyles(isDark)}
          showToolbar
        />
      </div>
    </>
  );
}
