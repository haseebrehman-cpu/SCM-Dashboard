import React, { useMemo } from 'react';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, ThemeProvider, IconButton } from "@mui/material";
import { format, parseISO } from 'date-fns';

interface DateEditorProps {
  value: string;
  onChange: (date: string) => void;
  isDark: boolean;
  max?: string;
  minDate?: string;
  disabled?: boolean;
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

export const DateEditor: React.FC<DateEditorProps> = ({ value, onChange, isDark, max, minDate, disabled }) => {
  const theme = useMemo(() => getDatePickerTheme(isDark), [isDark]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
      <ThemeProvider theme={theme}>
        <DatePicker
          format="MM/dd/yyyy"
          value={value ? parseISO(value) : null}
          maxDate={max ? parseISO(max) : undefined}
          minDate={minDate ? parseISO(minDate) : undefined}
          disabled={disabled}
          onChange={(newDate: Date | null) => {
            if (!newDate) {
              onChange("");
              return;
            }

            const dateString = format(newDate, 'yyyy-MM-dd');
            onChange(dateString);
          }}
          slotProps={{
            actionBar: {
              actions: ['clear'],
            },
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

        {!disabled && value && (
          <IconButton
            size="small"
            aria-label="Clear date"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            sx={{
              ml: 0.5,
              color: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(31, 41, 55, 0.8)',
              '&:hover': {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(31, 41, 55, 0.08)',
              },
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </IconButton>
        )}
      </ThemeProvider>
    </div>
  );
};
