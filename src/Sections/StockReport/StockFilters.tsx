import { Box, Checkbox, FormControl, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Typography } from '@mui/material'

interface StockFiltersProps {
  value: string[];
  handleChange: (event: SelectChangeEvent<string[]>) => void;
  filterName: string;
  options: string[];
}

const StockFilters = ({ value, handleChange, filterName, options }: StockFiltersProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <FormControl sx={{ m: 1, minWidth: 220, maxWidth: 220 }} size="small">
        <Typography sx={{ fontSize: '13px', fontWeight: 600, mb: 0.5, color: 'text.secondary' }}>
          {filterName}
        </Typography>
        <Select
          multiple
          size='small'
          value={value}
          onChange={handleChange}
          input={<OutlinedInput size="small" />}
          renderValue={(selected) => selected.join(', ')}
          sx={{
            borderRadius: '8px',
            '& .MuiSelect-select': {
              py: 1,
            }
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={value.indexOf(option) > -1} size="small" />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default StockFilters

