import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  useGridApiContext,
  GridToolbarProps,
} from "@mui/x-data-grid-premium";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DownloadIcon from "@mui/icons-material/Download";
import { useRef, useState } from "react";
import { Warehouse } from "../../types/productionReport";

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

function ExportDropdown({
  onDownloadForecast,
  selectedWarehouse,
}: ForecastToolbarProps) {
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
        aria-label="Export options"
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
        slotProps={{
          paper: {
            elevation: 3,
            sx: { minWidth: 200, borderRadius: 2, mt: 0.5 },
          },
        }}
      >
        <MenuItem onClick={handleExportCSV} sx={{ fontSize: "0.875rem", gap: 1 }}>
          <DownloadIcon fontSize="small" />
          Export as CSV
        </MenuItem>
        <MenuItem
          onClick={handleExportForecast}
          sx={{ fontSize: "0.875rem", gap: 1 }}
        >
          <DownloadIcon fontSize="small" />
          Export Forecast Data
        </MenuItem>
      </Menu>
    </>
  );
}

export function ForecastToolbar({
  onDownloadForecast,
  selectedWarehouse,
}: ForecastToolbarProps) {
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
      <ExportDropdown
        onDownloadForecast={onDownloadForecast}
        selectedWarehouse={selectedWarehouse}
      />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

