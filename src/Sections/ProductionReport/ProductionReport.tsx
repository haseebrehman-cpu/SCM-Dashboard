import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  useGridApiContext,
  GridToolbarProps,
} from "@mui/x-data-grid-premium";
import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { SelectChangeEvent, Button, Typography, Menu, MenuItem, Box } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { FileUploadDialog } from "./FileUploadDialog";
import { Warehouse } from '../../types/productionReport';
import { PAGINATION_MODEL } from '../../constants/productionReport';
import { generateProductionColumns } from '../../utils/columnGenerators/productionReport';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { ProductionReportHeader } from './ProductionReportHeader';
import { useProductionRemainingReport, useUploadForecastedFile } from "../../api/productionRemainingReport";
import { ProductionRemainingRow } from "../../types/Interfaces/interfaces";
import { useLatestSessionId } from "../../hooks/useLatestSessionId";
import { BrandedLogoLoader } from "../../components/common/BrandedLogoLoader";

const FORECAST_FIXED_KEYS: (keyof ProductionRemainingRow)[] = [
  "category_name",
  "item_number",
  "warehouse_region",
];

function downloadForecastCSV(data: ProductionRemainingRow[], region: string) {
  if (!data || data.length === 0) return;

  const forecastedKeys = Object.keys(data[0]).filter((k) =>
    k.startsWith("FORECASTED Order")
  );

  const allKeys = [...FORECAST_FIXED_KEYS, ...forecastedKeys];

  const header = allKeys.map((k) => `"${String(k).replace(/_/g, " ")}"`).join(",");

  const rows = data.map((row) =>
    allKeys
      .map((k) => {
        const val = (row as Record<string, unknown>)[k];
        const str = val == null ? "" : String(val);
        return str.includes(",") || str.includes('"') || str.includes("\n")
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      })
      .join(",")
  );

  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `forecast_${region}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

declare module "@mui/x-data-grid-premium" {
  interface ToolbarPropsOverrides {
    onDownloadForecast: () => void;
    selectedWarehouse: Warehouse;
  }
}

interface ForecastToolbarProps extends Partial<GridToolbarProps> {
  onDownloadForecast: () => void;
  selectedWarehouse: Warehouse;
}

function ExportDropdown({ onDownloadForecast, selectedWarehouse }: ForecastToolbarProps) {
  const apiRef = useGridApiContext();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const handleExportCSV = () => {
    apiRef.current.exportDataAsCsv({
      fileName: `production_remaining_${selectedWarehouse}_${new Date().toISOString().slice(0, 10)}`,
    });
    setOpen(false);
  };

  const handleExportForecast = () => {
    onDownloadForecast();
    setOpen(false);
  };

  return (
    <>
      <Button
        ref={anchorRef}
        size="small"
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          minWidth: 0,
          px: 1,
          color: "gray",
        }}
      >
        <DownloadIcon fontSize="small" />
        <ArrowDropDownIcon fontSize="small" />
      </Button>
      <Menu
        anchorEl={anchorRef.current}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { elevation: 3, sx: { minWidth: 200, borderRadius: 2, mt: 0.5 } } }}
      >
        <MenuItem onClick={handleExportCSV} sx={{ fontSize: "0.875rem", gap: 1 }}>
          <DownloadIcon fontSize="small" />
          Export as CSV
        </MenuItem>
        <MenuItem onClick={handleExportForecast} sx={{ fontSize: "0.875rem", gap: 1 }}>
          <DownloadIcon fontSize="small" />
          Export Forecast Data
        </MenuItem>
      </Menu>
    </>
  );
}

function ForecastToolbar({ onDownloadForecast, selectedWarehouse }: ForecastToolbarProps) {
  return (
    <GridToolbarContainer
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        "& .MuiButton-root": {
          color: "gray",
          minWidth: 0,
          p: 1,
          textTransform: "none",
          fontWeight: 500,
          "& .MuiButton-startIcon": {
            mr: 0,
          },
          "& .MuiButton-endIcon": {
            ml: 0,
          },
          fontSize: 0,
        },
        "& .MuiInputBase-root": {
          fontSize: "0.8125rem",
          color: "gray",
        },
        "& .MuiSvgIcon-root": {
          color: "gray",
          fontSize: "1.25rem",
        },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          fontSize: "0.9rem",
          mr: 1,
          whiteSpace: "nowrap",
          color: "white",
        }}
      >
        Production Remaining Report
      </Typography>

      <Box sx={{ flex: 1 }} />

      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <ExportDropdown onDownloadForecast={onDownloadForecast} selectedWarehouse={selectedWarehouse} />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

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

  const { data: reportResponse, isLoading } = useProductionRemainingReport(selectedWarehouse, sessionId);
  const uploadMutation = useUploadForecastedFile();

  const isAnyLoading = isLoading || isChangingPage;

  const handleFileUpload = async (file: File) => {
    const controller = new AbortController();
    await uploadMutation.mutateAsync({
      file,
      warehouse_region: selectedWarehouse,
      session_id: sessionId,
      signal: controller.signal
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

        <DataGridPremium
          label="Production Remaining Report"
          rows={tableDataWithId}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[100, 500, 1000, 1500]}
          pagination
          disableRowSelectionOnClick
          sx={getDataGridStyles(isDark, "auto")}
          loading={false}
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
