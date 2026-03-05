import React, { useMemo, useCallback } from 'react';
import {
  Box,
  Autocomplete,
  TextField,
  Checkbox,
  ListItemText,
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
  CircularProgress,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// ============================================================================
// Constants
// ============================================================================

const ALL_OPTION = '__ALL__';
const CHECKBOX_ICON = <CheckBoxOutlineBlankIcon fontSize="small" />;
const CHECKBOX_ICON_CHECKED = <CheckBoxIcon fontSize="small" />;

const CHECKBOX_STYLE = { marginRight: 8 };
const TEXTFIELD_STYLE = { '& .MuiListItemText-primary': { fontSize: '14px' } };

const AUTOCOMPLETE_SX = {
  m: 1,
  minWidth: 220,
  maxWidth: 220,
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
  },
};

const LISTBOX_STYLE = {
  maxHeight: '250px',
  overflow: 'auto',
};

// ============================================================================
// Types
// ============================================================================

interface StockFiltersProps {
  value: string[];
  handleChange: (value: string[]) => void;
  filterName: string;
  options: string[];
  loading?: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Sanitizes an array of strings by removing empty or whitespace-only entries
 */
const sanitizeStringArray = (arr: string[]): string[] =>
  (arr || []).filter((item) => typeof item === 'string' && item.trim() !== '');

// ============================================================================
// Component
// ============================================================================

const StockFilters = React.memo<StockFiltersProps>(
  ({ value, handleChange, filterName, options, loading }) => {
    // Memoized sanitized data
    const sanitizedOptions = useMemo(
      () => sanitizeStringArray(options),
      [options]
    );

    const optionsWithAll = useMemo(
      () => [ALL_OPTION, ...sanitizedOptions],
      [sanitizedOptions]
    );

    const sanitizedValue = useMemo(
      () => sanitizeStringArray(value),
      [value]
    );

    const isAllSelected = useMemo(
      () =>
        sanitizedOptions.length > 0 &&
        sanitizedValue.length === sanitizedOptions.length,
      [sanitizedOptions, sanitizedValue]
    );

    const displayedValue = useMemo(
      () => sanitizedValue,
      [sanitizedValue]
    );

    // Memoized handlers
    const handleChange_Callback = useCallback(
      (
        _event: React.SyntheticEvent,
        newValue: string[],
        _reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<string>
      ) => {
        const clickedOption = details?.option;

        // Handle 'Select All' option click
        if (clickedOption === ALL_OPTION) {
          // If all are currently selected and user clicked Select All, deselect all
          if (isAllSelected) {
            handleChange([]);
          } else {
            // Otherwise, select all
            handleChange([...sanitizedOptions]);
          }
          return;
        }

        // Handle normal selection/deselection of individual options
        // Filter out the internal ALL_OPTION marker and clean values
        const cleaned = newValue.filter(
          (v) => v !== ALL_OPTION && typeof v === 'string' && v.trim() !== ''
        );
        handleChange(cleaned);
      },
      [sanitizedOptions, handleChange, isAllSelected]
    );

    const renderOption_Callback = useCallback(
      (props: React.HTMLAttributes<HTMLLIElement>, option: string, { selected }: { selected: boolean }) => (
        <li {...props} key={option}>
          <Checkbox
            icon={CHECKBOX_ICON}
            checkedIcon={CHECKBOX_ICON_CHECKED}
            style={CHECKBOX_STYLE}
            checked={option === ALL_OPTION ? isAllSelected : selected}
            size="small"
          />
          <ListItemText
            primary={option === ALL_OPTION ? 'Select All' : option}
            sx={TEXTFIELD_STYLE}
          />
        </li>
      ),
      [isAllSelected]
    );

    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Autocomplete<string, true, false, false>
          multiple
          size="small"
          options={optionsWithAll}
          loading={loading}
          disableCloseOnSelect
          getOptionLabel={(option) =>
            option === ALL_OPTION ? 'Select All' : option
          }
          value={displayedValue}
          onChange={handleChange_Callback}
          renderOption={renderOption_Callback}
          renderTags={() => null}
          disablePortal
          slotProps={{
            listbox: {
              style: LISTBOX_STYLE,
            },
          }}
          sx={AUTOCOMPLETE_SX}
          renderInput={(params) => (
            <TextField
              {...params}
              label={displayedValue.length > 0 ? `${filterName} (${displayedValue.length})` : filterName}
              placeholder={filterName}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </Box>
    );
  }
);

StockFilters.displayName = 'StockFilters';

export default StockFilters;