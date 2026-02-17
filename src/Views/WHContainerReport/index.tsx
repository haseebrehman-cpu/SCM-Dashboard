import WHContainerKPI from "../../Sections/WHContainerReport/WHContainerKPI"
import ContainerLoadAnalysis from "../../Sections/WHContainerReport/ContainerLoadAnalysis"
import WHContainerGrid from "../../Sections/WHContainerReport/WHContainerGrid"
import { useState } from "react"
import { Box, Paper, Typography } from "@mui/material"
import StockFilters from "../../Sections/StockReport/StockFilters"

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
    id: 'containerNumber',
    filterName: "Select Container Number",
    filterOptions: ["81", "707", "180", "704"]
  },
]

const WHContainerReportView = () => {
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({
    warehouse: [''],
    category: [''],
    containerNumber: ['']
  });

  const handleChange = (id: string) => (value: string[]) => {
    setFilters(prev => ({
      ...prev,
      [id]: value,
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
      <WHContainerKPI />
      <ContainerLoadAnalysis />
      <WHContainerGrid />
    </Box>
  )
}

export default WHContainerReportView