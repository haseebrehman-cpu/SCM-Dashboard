import { Select, MenuItem } from "@mui/material";
import React from "react";

interface EditableStatusCellProps {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  isDark: boolean;
}

/**
 * Editable status cell component for DataGrid
 * Follows Single Responsibility Principle - only handles status editing
 */
export const EditableStatusCell: React.FC<EditableStatusCellProps> = React.memo(({
  value,
  options,
  onChange,
  isDark,
}) => {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"
      fullWidth
      variant="outlined"
      sx={{
        mt: '5px',
        color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
        '& .MuiSelect-select': {
          color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: isDark ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
});

EditableStatusCell.displayName = "EditableStatusCell";
