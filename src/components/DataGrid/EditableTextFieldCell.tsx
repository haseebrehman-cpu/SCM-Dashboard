import { TextField } from "@mui/material";
import React from "react";

interface EditableTextFieldCellProps {
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
}

/**
 * Editable text field cell component for DataGrid
 * Follows Single Responsibility Principle - only handles text editing
 */
export const EditableTextFieldCell: React.FC<EditableTextFieldCellProps> = React.memo(({
  value,
  onChange,
  isDark,
}) => {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        // Prevent spacebar and arrow keys from triggering grid navigation
        if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.stopPropagation();
        }
      }}
      size="small"
      fullWidth
      variant="outlined"
      sx={{
        mt: '5px',
        '& .MuiInputBase-input': {
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
    />
  );
});

EditableTextFieldCell.displayName = "EditableTextFieldCell";
