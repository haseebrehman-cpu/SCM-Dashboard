import { useTheme } from "../../hooks/useTheme";
import { usePurchaseOrderController } from "../../hooks/usePurchaseOrderController";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CachedIcon from "@mui/icons-material/Cached";
import { LoaderIcon } from "react-hot-toast";

import { ProductionReportHeader } from "../ProductionReport/ProductionReportHeader";
import { FileUploadDialog } from "../ProductionReport/FileUploadDialog";
import { getDataGridStyles } from "../../styles/productionReportStyles";
import { BrandedLogoLoader } from "../../components/common/BrandedLogoLoader";
import LoadReportProgressDialog from "./LoadReportProgressDialog";

export default function PurchaseOrder() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    sessionId,
    isDialogOpen,
    setIsDialogOpen,
    isLoadReportDialogOpen,
    setIsLoadReportDialogOpen,
    selectedWarehouse,
    handleWarehouseChange,
    rows,
    columns,
    paginationModel,
    setPaginationModel,
    isAnyLoading,
    isRefetching,
    isFlagsDisabled,
    isFlagsLoading,
    isArrivalEmpty,
    emptyItemCount,
    handleRefreshApi,
    handleLoadReportClick,
    handleConfirmLoadReport,
    handleCancelLoadReport,
    loadStatus,
    loadProgress,
    currentLoadStep,
    loadErrorMessage,
    loadReportMutationStatus,
    handlePurchaseOrderUpload,
    startEdit,
    isEditing,
    editedData,
  } = usePurchaseOrderController(isDark);

  const isLoadReportsDisabled =
    !isArrivalEmpty ||
    sessionId === null ||
    isRefetching ||
    isFlagsDisabled ||
    isFlagsLoading;

  const editableColumnsOnDoubleClick = ["arrival_date"];

  const handleCellDoubleClick = (params: any) => {
    if (editableColumnsOnDoubleClick.includes(params.field)) {
      const rowData = rows.find((row) => row.id === params.id);
      if (rowData) {
        isEditing &&
          isEditing(rowData.id) &&
          editedData &&
          editedData.arrivalDate
          ? null
          : startEdit(rowData);
      }
    }
  };

  return (
    <>
      <div className="flex justify-end my-2">
        <Button
          sx={{
            color: isDark ? "#047ADB" : "#045CB8",
          }}
          onClick={() => handleRefreshApi()}
          disabled={isRefetching}
          startIcon={isRefetching ? "" : <RefreshIcon />}
        >
          {isRefetching ? (
            <>
              Refetching &nbsp; <LoaderIcon />
            </>
          ) : (
            "Refresh Report"
          )}
        </Button>

        <Button
          disabled={isLoadReportsDisabled}
          onClick={handleLoadReportClick}
          startIcon={<CachedIcon />}
          sx={{
            color: isDark ? "#047ADB" : "#045CB8",
          }}
        >
          {isFlagsLoading ? "Checking Status..." : "Load Reports"}
        </Button>

        <ProductionReportHeader
          selectedWarehouse={selectedWarehouse}
          isDark={isDark}
          onWarehouseChange={handleWarehouseChange}
          onUploadClick={() => setIsDialogOpen(true)}
          isSelectWarehouse={false}
          isShowUpload={true}
        />
      </div>

      {isLoadReportsDisabled && (
        <div className="p-3 bg-[#047ADB]/10 dark:bg-[#047ADB]/20 border border-[#047ADB]/20 dark:border-[#047ADB]/40 rounded-lg mb-4">
          <p className="text-sm font-semibold text-[#047ADB] dark:text-white">
            ⓘ &nbsp; Information
          </p>
          <p className="text-xs text-[#047ADB] dark:text-white mt-2">
            The Process with current data is completed, please uplaod new files to continue.
          </p>
        </div>
      )}

      {!isLoadReportsDisabled && isArrivalEmpty && (
        <div className="p-3 bg-[#047ADB]/10 dark:bg-[#047ADB]/20 border border-[#047ADB]/20 dark:border-[#047ADB]/40 rounded-lg mb-4">
          <p className="text-sm font-semibold text-[#047ADB] dark:text-white">
            ⓘ &nbsp;  Information
          </p>
          <p className="text-xs text-[#047ADB] dark:text-white mt-2">
            All Arrival Dates are filled for all records. Please click the load
            report button to hydrate next reports.
          </p>
        </div>
      )}

      {!isArrivalEmpty && (
        <div className="p-3 bg-[#047ADB]/10 dark:bg-[#047ADB]/20 border border-[#047ADB]/20 dark:border-[#047ADB]/40 rounded-lg">
          <p className="text-sm font-semibold text-[#047ADB] dark:text-white">
            ⓘ &nbsp; Information
          </p>
          <p className="text-xs text-[#047ADB] dark:text-white mt-1">
            Arrival Dates cannot be empty, please make sure to fill the arrival
            dates for all records.
            {` Count of missing arrival dates: ${emptyItemCount}`}
          </p>
        </div>
      )}

      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden min-h-[400px]">
        {/* Loading Overlay */}
        <BrandedLogoLoader
          isLoading={isAnyLoading}
          isDark={isDark}
          message="Loading Purchase Order Report..."
        />

        {isDialogOpen && (
          <FileUploadDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onUpload={handlePurchaseOrderUpload}
          />
        )}

        {isLoadReportDialogOpen && (
          <LoadReportProgressDialog
            isOpen={isLoadReportDialogOpen}
            onClose={() => setIsLoadReportDialogOpen(false)}
            onConfirm={handleConfirmLoadReport}
            onRetry={handleConfirmLoadReport}
            onCancel={handleCancelLoadReport}
            isDark={isDark}
            status={loadStatus}
            progress={loadProgress}
            errorMessage={loadErrorMessage}
            showRetry={currentLoadStep >= 1}
            containerSuccess={loadReportMutationStatus}
          />
        )}

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DataGridPremium
            label="Purchase Order Report"
            loading={false}
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onCellDoubleClick={handleCellDoubleClick}
            pageSizeOptions={[100, 250, 500, 1000, 1500]}
            rowBufferPx={100}
            pagination
            sx={getDataGridStyles(isDark)}
            showToolbar
            rowSelection={false}
            slotProps={{
              toolbar: {
                printOptions: { disableToolbarButton: true },
                excelOptions: { disableToolbarButton: true, fileName: `${selectedWarehouse}_PurchaseOrder` },
                csvOptions: {
                  disableToolbarButton: false,
                  fileName: `${selectedWarehouse}_Purchase_Order_SCM Dashboard`,
                  escapeFormulas: false,
                },
              },
            }}
          />
        </LocalizationProvider>
      </div>
    </>
  );
}
