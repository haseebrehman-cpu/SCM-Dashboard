import { useState } from 'react';
import { Box, Paper, SelectChangeEvent, Typography } from '@mui/material';
import StockFilters from '../../Sections/StockReport/StockFilters'
import StockReportCharts from '../../Sections/StockReport/StockReportCharts'
import StockReportKpi from '../../Sections/StockReport/StockReportKpi'
import StockReportGrid from '../../Sections/StockReport/StockReportGrid';

const filtersArray = [
  {
    id: 'warehouse',
    filterName: "Select Warehouse",
    filterOptions: ["UK", "US", "CA", "DE"]
  },
  {
    id: 'category',
    filterName: "Select Category",
    filterOptions: ["BUNDLES", "BOXING GLOVES", "CLOTHING", "BELTS"]
  },
  {
    id: 'itemNumber',
    filterName: "Select Item Number",
    filterOptions: ["YM-TPE-DC-MJ", "YM-TPE-SCB", "YM-TPE-SCO", "YM-TPE-DC-CU"]
  },
]

const StockReportView = () => {
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({
    warehouse: ['UK'],
    category: ['BUNDLES'],
    itemNumber: ['YM-TPE-DC-MJ']
  });

  const handleChange = (id: string) => (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setFilters(prev => ({
      ...prev,
      [id]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography>Filter Options:</Typography>
        <Box sx={{ display: 'flex' }}>
          {filtersArray.map((item) => (
            <StockFilters
              key={item.id}
              value={filters[item.id] || []}
              handleChange={handleChange(item.id)}
              filterName={item.filterName}
              options={item.filterOptions}
            />
          ))}
        </Box>
      </Paper>
      <StockReportKpi />
      <StockReportCharts />
      <StockReportGrid />
    </Box>
  )
}


export default StockReportView
