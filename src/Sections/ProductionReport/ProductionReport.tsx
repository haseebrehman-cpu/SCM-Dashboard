import { DataGridPremium } from "@mui/x-data-grid-premium";
import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo } from "react";
import { SelectChangeEvent } from "@mui/material";
import { FileUploadDialog } from "./FileUploadDialog";
import { Warehouse } from '../../types/productionReport';
import { warehouseData, warehouseContainers } from '../../mockData/productionReportMock';
import { PAGINATION_MODEL } from '../../constants/productionReport';
import { generateProductionColumns } from '../../utils/columnGenerators/productionReport';
import { getDataGridStyles } from '../../styles/productionReportStyles';
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

  return (
    <>
      <div className="flex justify-end my-2">
        <ProductionReportHeader
          selectedWarehouse={selectedWarehouse}
          isDark={isDark}
          onWarehouseChange={handleWarehouseChange}
          onUploadClick={() => setIsDialogOpen(true)}
          isSelectWarehouse={true}
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
          label="Production Remaining Report"
          rows={tableData}
          columns={columns}
          initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
          pageSizeOptions={[100, 500, 1000, 1500]}
          pagination
          disableRowSelectionOnClick
          sx={getDataGridStyles(isDark)}
          rowBufferPx={100}
          showToolbar
        />
      </div>
    </>
  );
}
