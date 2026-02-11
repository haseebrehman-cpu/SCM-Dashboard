import React from 'react';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createTheme, ThemeProvider } from "@mui/material";
import { format, parseISO } from 'date-fns';

interface DateEditorProps {
  value: string;
  onChange: (date: string) => void;
  isDark: boolean;
  max?: string;
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

export const DateEditor: React.FC<DateEditorProps> = ({ value, onChange, isDark, max }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={getDatePickerTheme(isDark)}>
          <DatePicker
            format="MM/dd/yyyy"
            value={value ? parseISO(value) : null}
            maxDate={max ? parseISO(max) : undefined}
            onChange={(newDate: Date | null) => {
              if (newDate) {
                const dateString = format(newDate, 'yyyy-MM-dd');
                onChange(dateString);
              }
            }}
            slotProps={{
              popper: {
                sx: {
                  zIndex: 999999,
                },
              },
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
