import { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import StockFilters from '../../Sections/StockReport/StockFilters'
import StockReportCharts from '../../Sections/StockReport/StockReportCharts'
import StockReportKpi from '../../Sections/StockReport/StockReportKpi'
import StockReportGrid from '../../Sections/StockReport/StockReportGrid';
import { useFilterOptions } from '../../api/containerDetailReport';
import toast from 'react-hot-toast';

const StockReportView = () => {
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({
    warehouse: [],
    category: [],
    item_number: []
  });

  const { data: filterOptionsData, isLoading } = useFilterOptions("stock", filters);

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
    toast.success("Filters Applied SuccessFully!")
    setAppliedFilters(filters);
  };

  const handleCancel = () => {
    setFilters({
      warehouse: [],
      category: [],
      item_number: []
    })
    setAppliedFilters({})
  }

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
          <Button onClick={handleApplyFilter} sx={{ borderRadius: '12px', ml: 1 }}>Apply Filter</Button>
          {Object.values(filters).some(arr => arr.length > 0) && (
            <Button onClick={handleCancel} color="error" sx={{ borderRadius: '12px', ml: 1 }}>
              Cancel
            </Button>
          )}
        </Box>
      </Paper>
      <StockReportKpi filters={appliedFilters} />
      <StockReportCharts />
      <StockReportGrid filters={appliedFilters} />
    </Box>
  )
}


export default StockReportView
