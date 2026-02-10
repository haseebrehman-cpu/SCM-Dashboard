import React from 'react';
import { Select, MenuItem } from "@mui/material";
import { DeliveryStatus } from './types';

interface StatusEditorProps {
  value: DeliveryStatus;
  onChange: (value: DeliveryStatus) => void;
  isDark: boolean;
}

export const StatusEditor: React.FC<StatusEditorProps> = ({ value, onChange, isDark }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as DeliveryStatus)}
        size="small"
        sx={{
          minWidth: 120,
          '& .MuiSelect-select': {
            padding: '4px 8px',
            fontSize: '0.875rem',
            color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: isDark ? 'rgb(75 85 99)' : 'rgb(209 213 219)',
          },
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        }}
      >
        <MenuItem value="Delivered">Delivered</MenuItem>
        <MenuItem value="InTransit">In Transit</MenuItem>
      </Select>
    </div>
  );
};
