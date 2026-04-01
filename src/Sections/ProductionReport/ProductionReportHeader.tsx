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
            sx={{ fontSize: "10px" }}
            renderValue={(selected) => {
              const option = WAREHOUSE_OPTIONS.find(
                (opt) => opt.value === selected
              );
              return (
                <div className="flex items-center gap-2">
                  {option && (
                    <img
                      src={`https://flagcdn.com/w20/${option.flag.toLowerCase()}.png`}
                      width="20"
                      alt={option.label}
                      className="rounded-xs"
                    />
                  )}
                  <span>{option ? option.label : selected}</span>
                </div>
              );
            }}
          >
            {WAREHOUSE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <img
                    src={`https://flagcdn.com/w20/${option.flag.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${option.flag.toLowerCase()}.png 2x`}
                    width="20"
                    alt={option.label}
                  />
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
            sx={{ borderRadius: '20px', fontSize: '12px', bgcolor: "#047ADB" }}
            onClick={onUploadClick}
            startIcon={<IosShare sx={{ width: '16px' }} />}
          >
            Upload File
          </Button>
        }
        {isArchieved &&
          <Button variant='contained' sx={{ borderRadius: '20px', fontSize: '12px', bgcolor: "#047ADB" }} size='small' onClick={onArchieveCLick} startIcon={<ListIcon style={{ width: '16px' }} />}>View Archieved Reports</Button>
        }
      </FormControl>
    </>
  );
};
