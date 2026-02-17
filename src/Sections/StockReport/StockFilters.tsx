import { Box, Autocomplete, TextField, Checkbox, ListItemText } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface StockFiltersProps {
  value: string[];
  handleChange: (value: string[]) => void;
  filterName: string;
  options: string[];
}

const StockFilters = ({ value, handleChange, filterName, options }: StockFiltersProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Autocomplete
        multiple
        size="small"
        options={options}
        disableCloseOnSelect
        getOptionLabel={(option) => option}
        value={value}
        onChange={(_, newValue) => {
          handleChange(newValue);
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
                size="small"
              />
              <ListItemText primary={option} sx={{ '& .MuiListItemText-primary': { fontSize: '14px' } }} />
            </li>
          );
        }}
        disablePortal
        sx={{
          m: 1,
          minWidth: 220,
          maxWidth: 220,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={filterName}
            placeholder={filterName}
          />
        )}
      />
    </Box>
  );
};

export default StockFilters;

