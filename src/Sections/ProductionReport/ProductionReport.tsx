import {
  DataGridPremium,
} from "@mui/x-data-grid-premium";
import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo, useCallback, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { FileUploadDialog } from "./FileUploadDialog";
import { Warehouse } from '../../types/productionReport';
import { PAGINATION_MODEL } from '../../constants/productionReport';
import { generateProductionColumns } from '../../utils/columnGenerators/productionReport';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { ProductionReportHeader } from './ProductionReportHeader';
import { useProductionRemainingReport, useUploadForecastedFile } from "../../api/productionRemainingReport";
import { useLatestSessionId } from "../../hooks/useLatestSessionId";
import { BrandedLogoLoader } from "../../components/common/BrandedLogoLoader";
import { ForecastToolbar } from "./ForecastToolbar";
import { downloadForecastCSV } from "../../utils/productionRemainingReport/downloadForecastCSV";

export default function ProductionReport() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();
  const sessionId = useLatestSessionId();

  const [paginationModel, setPaginationModel] = useState(PAGINATION_MODEL);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>("UK");

  useEffect(() => {
    setIsChangingPage(true);
    const timer = setTimeout(() => {
      setIsChangingPage(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [paginationModel, selectedWarehouse]);

  const handleWarehouseChange = (event: SelectChangeEvent<Warehouse>) => {
    setSelectedWarehouse(event.target.value as Warehouse);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const { data: reportResponse, isLoading, error } = useProductionRemainingReport(selectedWarehouse, sessionId);
  const uploadMutation = useUploadForecastedFile();

  const isAnyLoading = isLoading || isChangingPage;

  const handleFileUpload = async (file: File) => {
    await uploadMutation.mutateAsync({
      file,
      warehouse_region: selectedWarehouse,
      session_id: sessionId,
    });
  };

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

  const handleDownloadForecast = useCallback(() => {
    downloadForecastCSV(reportResponse?.data ?? [], selectedWarehouse);
  }, [reportResponse?.data, selectedWarehouse]);

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
      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden min-h-[400px]">
        {isDialogOpen && (
          <FileUploadDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onUpload={handleFileUpload}
          />
        )}

        {/* Loading Overlay */}
        <BrandedLogoLoader isLoading={isAnyLoading} isDark={isDark} message="Loading Production Report..." />

        {error && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
            There was a problem loading the production remaining report. Please try again or contact support
            if the issue persists.
          </div>
        )}

        <DataGridPremium
          label="Production Remaining Report"
          rows={tableDataWithId}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[100, 500, 1000, 1500]}
          pagination
          disableRowSelectionOnClick
          sx={getDataGridStyles(isDark, "710px")}
          loading={isAnyLoading}
          rowBufferPx={100}
          showToolbar
          slots={{ toolbar: ForecastToolbar }}
          slotProps={{
            toolbar: {
              onDownloadForecast: handleDownloadForecast,
              selectedWarehouse: selectedWarehouse,
            },
          }}
        />
      </div>
    </>
  );
}
