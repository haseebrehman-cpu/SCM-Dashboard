import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid-premium";
import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo, useCallback } from "react";
import { SelectChangeEvent, LinearProgress, Box, Button, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { FileUploadDialog } from "./FileUploadDialog";  
import { Warehouse } from '../../types/productionReport';
import { PAGINATION_MODEL } from '../../constants/productionReport';
import { generateProductionColumns } from '../../utils/columnGenerators/productionReport';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { ProductionReportHeader } from './ProductionReportHeader';
import { useProductionRemainingReport } from "../../api/productionRemainingReport";
import { ProductionRemainingRow } from "../../types/Interfaces/interfaces";

// ─── Forecast CSV helpers ────────────────────────────────────────────────────

const FORECAST_FIXED_KEYS: (keyof ProductionRemainingRow)[] = [
  "category_name",
  "item_number",
  "warehouse_region",
];

function downloadForecastCSV(data: ProductionRemainingRow[]) {
  if (!data || data.length === 0) return;

  // Collect all FORECASTED Order keys from the first row
  const forecastedKeys = Object.keys(data[0]).filter((k) =>
    k.startsWith("FORECASTED Order")
  );

  const allKeys = [...FORECAST_FIXED_KEYS, ...forecastedKeys];

  // Build header row
  const header = allKeys.map((k) => `"${String(k).replace(/_/g, " ")}"`).join(",");

  // Build data rows
  const rows = data.map((row) =>
    allKeys
      .map((k) => {
        const val = (row as Record<string, unknown>)[k];
        const str = val == null ? "" : String(val);
        // Quote if the value contains a comma, quote, or newline
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
  link.setAttribute("download", `forecast_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    onDownloadForecast: () => void;
  }
}

interface ForecastToolbarProps {
  onDownloadForecast: () => void;
}

function ForecastToolbar({ onDownloadForecast }: ForecastToolbarProps) {
  return (
    <GridToolbarContainer sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, fontSize: "0.9rem", mr: 1, whiteSpace: "nowrap" }}
      >
        Production Remaining Report
      </Typography>

      <Box sx={{ flex: 1 }} />

      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport
        csvOptions={{ disableToolbarButton: false }}
        printOptions={{ disableToolbarButton: true }}
        excelOptions={{ disableToolbarButton: true }}
      />
      <Button
        size="small"
        startIcon={<DownloadIcon />}
        onClick={onDownloadForecast}
        sx={{
          fontSize: "0.8125rem",
          textTransform: "none",
          color: "inherit",
          fontWeight: 500,
        }}
      >
        Download Forecast
      </Button>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

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

  const handleDownloadForecast = useCallback(() => {
    downloadForecastCSV(reportResponse?.data ?? []);
  }, [reportResponse?.data]);

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
          slots={{ toolbar: ForecastToolbar }}
          slotProps={{
            toolbar: {
              onDownloadForecast: handleDownloadForecast,
            },
          }}
        />
      </div>
    </>
  );
}
