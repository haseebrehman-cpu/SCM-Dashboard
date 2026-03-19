import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import CombinedReportGrid from '../../Sections/CombinedReport/CombinedReport'
import StockFilters from '../../Sections/StockReport/StockFilters'
import { useFilterOptions } from '../../api/containerDetailReport';
import { useLatestSessionId } from '../../hooks/useLatestSessionId';

const CombinedReportView = () => {
  const sessionId = useLatestSessionId();
  const { data: filterOptionsData, isLoading } = useFilterOptions("combined", sessionId);

  const [filters, setFilters] = useState<{ [key: string]: string[] }>({
    warehouse: [],
    category: [],
    item_number: []
  });

  const [appliedFilters, setAppliedFilters] = useState<{ [key: string]: string[] }>({});

  const filtersArray = [
    {
      id: 'warehouse',
      filterName: "Select Warehouse",
      filterOptions: filterOptionsData?.filter_options.warehouse || []
    },
    {
      id: 'category',
      filterName: "Select Category",
      filterOptions: filterOptionsData?.filter_options.category || []
    },
    {
      id: 'item_number',
      filterName: "Select Item Number",
      filterOptions: filterOptionsData?.filter_options.item_number || []
    },
  ];

  const handleChange = (id: string) => (value: string[]) => {
    setFilters(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleApplyFilter = () => {
    setAppliedFilters(filters);
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
              loading={isLoading}
            />
          ))}
          <Button onClick={handleApplyFilter} variant="contained" sx={{ borderRadius: '12px', ml: 1 }}>Apply Filter</Button>
        </Box>
      </Paper>
      <CombinedReportGrid filters={appliedFilters} />
    </Box>
  )
}

export default CombinedReportView