import { DataGridPremium } from "@mui/x-data-grid-premium";
import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo } from "react";
import { SelectChangeEvent, LinearProgress, Box } from "@mui/material";
import { FileUploadDialog } from "./FileUploadDialog";
import { Warehouse } from '../../types/productionReport';
import { PAGINATION_MODEL } from '../../constants/productionReport';
import { generateProductionColumns } from '../../utils/columnGenerators/productionReport';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { ProductionReportHeader } from './ProductionReportHeader';
import { useProductionRemainingReport } from "../../api/productionRemainingReport";

export default function ProductionReport() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>("UK");

  const handleWarehouseChange = (event: SelectChangeEvent<Warehouse>) => {
    setSelectedWarehouse(event.target.value as Warehouse);
  };

  const { data: reportResponse, isLoading } = useProductionRemainingReport(selectedWarehouse);

  const tableDataWithId = useMemo(() =>
    (reportResponse?.data || []).map((row, index) => ({
      ...row,
      id: `${row.item_number}-${index}`
    })),
    [reportResponse]
  );

  const columns = useMemo(() =>
    generateProductionColumns({
      selectedWarehouse,
      isDark,
      currentYear,
      data: reportResponse?.data,
    }),
    [selectedWarehouse, isDark, currentYear, reportResponse?.data]
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

        {isLoading && (
          <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
            <LinearProgress />
          </Box>
        )}

        <DataGridPremium
          label="Production Remaining Report"
          rows={tableDataWithId}
          columns={columns}
          initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
          pageSizeOptions={[100, 500, 1000, 1500]}
          pagination
          disableRowSelectionOnClick
          sx={getDataGridStyles(isDark, "auto")}
          loading={isLoading}
          rowBufferPx={100}
          showToolbar
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
