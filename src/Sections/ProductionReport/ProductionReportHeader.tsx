import React from 'react';
import { MenuItem, Select, FormControl, InputLabel, SelectChangeEvent, Button } from "@mui/material";
import { Warehouse } from '../../types/productionReport';
import { WAREHOUSE_OPTIONS } from '../../constants/productionReport';
import { getFormControlStyles } from '../../styles/productionReportStyles';
import IosShare from '@mui/icons-material/IosShare';
import { ListIcon } from '../../icons';

interface ProductionReportHeaderProps {
  selectedWarehouse?: Warehouse;
  isDark: boolean;
  isArchieved?: boolean;
  isSelectWarehouse?: boolean;
  isShowUpload?: boolean;
  onWarehouseChange?: (event: SelectChangeEvent<Warehouse>) => void;
  onUploadClick?: () => void;
  onArchieveCLick?: () => void;
}

export const ProductionReportHeader: React.FC<ProductionReportHeaderProps> = ({
  selectedWarehouse,
  isDark,
  onWarehouseChange,
  onUploadClick,
  isArchieved,
  isSelectWarehouse,
  isShowUpload,
  onArchieveCLick
}) => {
  return (
    <>
      <FormControl sx={getFormControlStyles(isDark)}>
        {isSelectWarehouse && <>
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
        </>
        }
        {isShowUpload &&
          <Button
            variant="contained"
            sx={{ borderRadius: '20px', fontSize: '12px' }}
            onClick={onUploadClick}
            startIcon={<IosShare sx={{ width: '16px' }} />}
          >
            Upload File
          </Button>
        }
        {isArchieved &&
          <Button variant='contained' sx={{ borderRadius: '20px', fontSize: '12px' }} size='small' onClick={onArchieveCLick} startIcon={<ListIcon style={{ width: '16px' }} />}>View Archieved Reports</Button>
        }
      </FormControl>
    </>
  );
};
