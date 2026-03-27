import { useState, useCallback } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import StockFilters from '../../Sections/StockReport/StockFilters'
import StockReportCharts from '../../Sections/StockReport/StockReportCharts'
import StockReportKpi from '../../Sections/StockReport/StockReportKpi'
import StockReportGrid from '../../Sections/StockReport/StockReportGrid';
import { useFilterOptions } from '../../api/containerDetailReport';
import toast from 'react-hot-toast';
import { useLatestSessionId } from '../../hooks/useLatestSessionId';
import AppliedFiltersDisplay from '../../Sections/StockReport/AppliedFiltersDisplay';
import AddTaskIcon from '@mui/icons-material/AddTask';

const StockReportView = () => {
  const sessionId = useLatestSessionId();
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({
    warehouse: [],
    category: [],
    item_number: []
  });

  const { data: filterOptionsData, isLoading } = useFilterOptions("stock", sessionId, filters);

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

  const handleDeleteFilter = useCallback((category: string, value: string) => {
    setAppliedFilters(prev => {
      const updated = {
        ...prev,
        [category]: prev[category].filter(v => v !== value)
      };
      // Keep unapplied filters in sync
      setFilters(updated);
      return updated;
    });
  }, []);

  const handleClearAll = () => {
    handleCancel();
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Filter Options:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
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
            <Button
              variant="contained"
              onClick={handleApplyFilter}
              sx={{
                borderRadius: '12px',
                ml: 1,
                boxShadow: 'none',
                height: '40px',
                backgroundColor: '#047ADB',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }
              }}
              startIcon={<AddTaskIcon/>}
            >
              Apply Filter
            </Button>
            {Object.values(filters).some(arr => arr.length > 0) && (
              <Button
                onClick={handleCancel}
                color="error"
                sx={{
                  borderRadius: '12px',
                  ml: 1,
                  height: '40px',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.04)',
                  }
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>

        <AppliedFiltersDisplay
          appliedFilters={appliedFilters}
          onDelete={handleDeleteFilter}
          onClearAll={handleClearAll}
        />
      </Paper>
      <StockReportKpi filters={appliedFilters} />
      <StockReportCharts />
      <StockReportGrid filters={appliedFilters} />
    </Box>
  )
}

export default StockReportView
