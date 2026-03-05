import WHContainerKPI from "../../Sections/WHContainerReport/WHContainerKPI"
import ContainerLoadAnalysis from "../../Sections/WHContainerReport/ContainerLoadAnalysis"
import WHContainerGrid from "../../Sections/WHContainerReport/WHContainerGrid"
import { useState } from "react"
import { Box, Button, Paper, Typography } from "@mui/material"
import StockFilters from "../../Sections/StockReport/StockFilters"
import { useFilterOptions } from "../../api/containerDetailReport"

const WHContainerReportView = () => {
  const { data: filterOptionsData, isLoading } = useFilterOptions("container");

  const [filters, setFilters] = useState<{ [key: string]: string[] }>({
    warehouse: [],
    category: [],
    container_name: [],
    sku: []
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
      id: 'container_name',
      filterName: "Select Container Name",
      filterOptions: filterOptionsData?.filter_options.container_name || []
    },
    {
      id: 'sku',
      filterName: "Select SKU",
      filterOptions: filterOptionsData?.filter_options.sku || []
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

  const handleCancel = () => {
    setFilters({
      warehouse: [],
      category: [],
      container_name: [],
      sku: []
    })
    setAppliedFilters({})
  }

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <Button onClick={handleApplyFilter}>Apply Filter</Button>
          {Object.values(appliedFilters).some(arr => arr.length > 0) && (
            <Button onClick={handleCancel} color="error" sx={{ borderRadius: '12px', ml: 1 }}>
              Cancel
            </Button>
          )}
        </Box>
      </Paper>
      <WHContainerKPI />
      <ContainerLoadAnalysis />
      <WHContainerGrid filters={appliedFilters} />
    </Box>
  )
}

export default WHContainerReportView