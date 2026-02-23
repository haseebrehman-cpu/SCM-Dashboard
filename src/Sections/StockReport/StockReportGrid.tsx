import { DataGridPremium } from "@mui/x-data-grid-premium"
import { STOCK_REPORT_DATA, PAGINATION_MODEL } from "../../mockData/stockReportMock"
import { getDataGridStyles } from "../../styles/productionReportStyles"
import { useTheme } from "../../hooks/useTheme";
import { generateStockReportColumns } from "../../utils/columnGenerators/stockReport";

const StockReportGrid = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const columns = generateStockReportColumns();

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      <DataGridPremium
        label="Stock Report"
        rows={STOCK_REPORT_DATA}
        columns={columns}
        initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
        pageSizeOptions={[100, 500, 1000, 1500]}
        pagination
        disableRowSelectionOnClick
        sx={getDataGridStyles(isDark, "70vh")}
        rowBufferPx={100}
        showToolbar
      />
    </div>
  )
}

export default StockReportGrid