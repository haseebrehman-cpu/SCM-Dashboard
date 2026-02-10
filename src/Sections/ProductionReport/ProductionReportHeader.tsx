import React from 'react';
import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent, Button } from "@mui/material";
import { Warehouse } from './types';
import { WAREHOUSE_OPTIONS } from './constants';
import { getFormControlStyles } from './styles';

interface ProductionReportHeaderProps {
  selectedWarehouse: Warehouse;
  isDark: boolean;
  onWarehouseChange: (event: SelectChangeEvent<Warehouse>) => void;
  onUploadClick ?: () => void;
  onExportClick: () => void;
}

export const ProductionReportHeader: React.FC<ProductionReportHeaderProps> = ({
  selectedWarehouse,
  isDark,
  onWarehouseChange,
  onUploadClick,
  onExportClick,
}) => {
  return (
    <FormControl sx={getFormControlStyles(isDark)}>
      <InputLabel id="warehouse-select-label">Select Warehouse</InputLabel>
      <Select
        labelId="warehouse-select-label"
        id="warehouse-select"
        value={selectedWarehouse}
        label="Select Warehouse"
        onChange={onWarehouseChange}
        size="small"
        sx={{ fontSize: '10px' }}
      >
        {WAREHOUSE_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{option.flag}</span>
              <span>{option.label}</span>
            </div>
          </MenuItem>
        ))}
      </Select>

      <Button
        variant="contained"
        sx={{ borderRadius: '20px', fontSize: '12px' }}
        onClick={onUploadClick}
      >
        Upload File
      </Button>
      <Button
        variant="contained"
        onClick={onExportClick}
        sx={{ borderRadius: '20px', fontSize: '12px' }}
      >
        Export to CSV
      </Button>
    </FormControl>
  );
};
