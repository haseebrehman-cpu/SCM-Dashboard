import WHContainerKPI from "../../Sections/WHContainerReport/WHContainerKPI"
import ContainerLoadAnalysis from "../../Sections/WHContainerReport/ContainerLoadAnalysis"
import WHContainerGrid from "../../Sections/WHContainerReport/WHContainerGrid"
import { useWHContainerReportFilters } from "../../hooks/useWHContainerReportFilters";
import { Box, Button, Paper, Typography } from "@mui/material"
import StockFilters from "../../Sections/StockReport/StockFilters"
import AppliedFiltersDisplay from "../../Sections/StockReport/AppliedFiltersDisplay";
import AddTaskIcon from '@mui/icons-material/AddTask';

const WHContainerReportView = () => {
  const {
    sessionId,
    filters,
    appliedFilters,
    isLoading,
    filtersArray,
    hasFilters,
    handleChange,
    handleApplyFilter,
    handleCancel,
    handleDeleteFilter,
    handleClearAll,
  } = useWHContainerReportFilters();

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
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
              disabled={!hasFilters}
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
              startIcon={<AddTaskIcon />}
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
      <WHContainerKPI filters={appliedFilters} sessionId={sessionId} />
      <ContainerLoadAnalysis filters={appliedFilters} sessionId={sessionId} />
      <WHContainerGrid filters={appliedFilters} />
    </Box>
  )
}

export default WHContainerReportView