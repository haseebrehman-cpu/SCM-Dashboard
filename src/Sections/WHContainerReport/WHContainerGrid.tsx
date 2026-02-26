import { DataGridPremium } from "@mui/x-data-grid-premium"
import { getDataGridStyles } from "../../styles/productionReportStyles"
import { useTheme } from "../../hooks/useTheme";
import { generateWarehouseColumns } from "../../utils/columnGenerators/whContainerReport";
import { CONTAINER_REPORT_DATA, PAGINATION_MODEL } from "../../mockData/whContainersReportMock";

const WHContainerGrid = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const columns = generateWarehouseColumns();

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      <DataGridPremium
        label="Warehouse Container Report"
        rows={CONTAINER_REPORT_DATA}
        columns={columns}
        initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
        pageSizeOptions={[100, 500, 1000, 1500]}
        pagination
        disableRowSelectionOnClick
        sx={getDataGridStyles(isDark, "auto")}
        rowBufferPx={100}
        showToolbar
        slotProps={{
          toolbar: {
            printOptions: { disableToolbarButton: true },
            excelOptions: { disableToolbarButton: true }, 
            csvOptions: { disableToolbarButton: false }, 
          }
        }}
      />
    </div>
  )
}

export default WHContainerGrid
