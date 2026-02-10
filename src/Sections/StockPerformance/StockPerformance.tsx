import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "../../context/ThemeContext";
import { useState, useMemo } from "react";
import { SelectChangeEvent } from "@mui/material";
import Badge from "../../components/ui/badge/Badge";
import { exportToCsv } from "../../utils/exportToCsv";
import { DataGridHeader } from "../../components/DataGrid/DataGridHeader";
import { Warehouse } from './types';
import { warehouseData, warehouseContainers, PAGINATION_MODEL } from './mockData';
import { generateStockPerformanceColumns } from './columnGenerator';
import { getDataGridStyles } from '../ProductionReport/styles';
import { ProductionReportHeader } from '../ProductionReport/ProductionReportHeader';

export default function StockPerformance() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>("UK");

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
          onUploadClick={() => { }} // No upload functionality for this report
          onExportClick={handleExport}
        />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">Showing data for:</span>
        <Badge size="md" color="primary">
          {selectedWarehouse} Warehouse
        </Badge>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          • {containers.length} Containers
        </span>
      </div>

      <DataGrid
        rows={tableData}
        columns={columns}
        initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
        pageSizeOptions={[5, 10, 15, 25]}
        autoHeight
        disableRowSelectionOnClick
        sx={getDataGridStyles(isDark)}
      />
    </div>
  );
}
