import React from 'react';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createTheme, ThemeProvider } from "@mui/material";

interface DateEditorProps {
  value: string;
  onChange: (date: string) => void;
  isDark: boolean;
}

const getDatePickerTheme = (isDark: boolean) => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    primary: {
      main: isDark ? '#ffffff' : '#1976d2',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          color: isDark ? '#ffffff' : 'rgb(31 41 55)',
          '&::placeholder': {
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(31, 41, 55, 0.5)',
            opacity: 1,
          },
        },
        root: {
          color: isDark ? '#ffffff' : 'rgb(31 41 55)',
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          '& input': {
            color: isDark ? '#ffffff' : 'rgb(31 41 55)',
          },
        },
        notchedOutline: {
          borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export const DateEditor: React.FC<DateEditorProps> = ({ value, onChange, isDark }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={getDatePickerTheme(isDark)}>
          <DatePicker
            format="MM/dd/yyyy"
            value={value ? new Date(value) : null}
            onChange={(newDate: Date | null) => {
              if (newDate) {
                const dateString = newDate.toISOString().split('T')[0];
                onChange(dateString);
              }
            }}
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  '& input': {
                    color: isDark ? '#ffffff' : 'rgb(31 41 55)',
                  },
                },
              },
            }}
          />
        </ThemeProvider>
      </LocalizationProvider>
    </div>
  );
};
