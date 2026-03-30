import { useState, useMemo } from "react";
import { SelectChangeEvent, LinearProgress, Box } from "@mui/material";
import { Warehouse } from '../../types/stockPerformance';
import { generateStockPerformanceColumns } from '../../utils/columnGenerators/stockPerformance';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { ProductionReportHeader } from '../ProductionReport/ProductionReportHeader';
import ArchieveDialog from "../SummaryDash/ArchieveDialog";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { useTheme } from "../../hooks/useTheme";
import { useStockPerfomanceReport, usePrefetchStockPerformance } from "../../api/stockPerfomance";
import { useLatestSessionId } from "../../hooks/useLatestSessionId";

export default function StockPerformance() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sessionId = useLatestSessionId();

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>("UK");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 1000,
  });

  const handleWarehouseChange = (event: SelectChangeEvent<Warehouse>) => {
    setSelectedWarehouse(event.target.value as Warehouse);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const { data: reportResponse, isLoading } = useStockPerfomanceReport(
    selectedWarehouse,
    sessionId,
    "spr",
    paginationModel.page + 1,
    paginationModel.pageSize
  );

  // Prefetch next 7 pages when current page changes
  usePrefetchStockPerformance(
    selectedWarehouse,
    sessionId,
    "spr",
    paginationModel.page + 1,
    paginationModel.pageSize
  );

  const tableData = useMemo(() => {
    if (!reportResponse?.stock_performance_data) return [];
    return reportResponse.stock_performance_data.map((row, index) => ({
      ...row,
      id: row.id ?? `${row.item_number}-${index}`,
      itemNumber: row.item_number,
      categoryName: row.category_name,
      itemTitle: row.item_title ?? row.item_number,
      whStock: row.wh_stock,
      linnLast60DaysSale: row.linn_last_60days_sale,
      linnWorksSales: row.linn_next_60days_sale_previousyear,
      fbaLast30Days: row.fba_last_30days_sale,
      fbaLast7Days: row.fba_last_07days_sale,
      fbaStock: row.fba_stock,
      allStock: row.all_stock,
      maxDc: row.max_daily_consumption,
      totalCtn: row.total_ctn,
      daysCover: row.days_cover,
      daysCoverCurrentStock: row.days_cover_current_stock,
      dispatchDateCover: row.dispatch_date_cover,
      daysGap: row.days_gap,
      stockAfterArrival: row.stock_after_arrival,
      stockDaysAfterArrival: row.stock_days_after_arrival,
      containerName: row.container_name,
      intransitQuantity: row.intransit_quantity,
      remWarehouse: row.remaining,
      oosDays: row.oos_days,
    }));
  }, [reportResponse]);

  // const containers = warehouseContainers[selectedWarehouse];

  const columns = useMemo(
    () =>
      generateStockPerformanceColumns({
        selectedWarehouse,
        containers: [],
        isDark,
        data: tableData,
      }),
    [selectedWarehouse, isDark, tableData]
  );

  return (
    <>
      <div className="flex justify-end my-4">
        <ProductionReportHeader
          selectedWarehouse={selectedWarehouse}
          isDark={isDark}
          onWarehouseChange={handleWarehouseChange}
          isSelectWarehouse={true}
          isShowUpload={false}
          isArchieved={true}
          onArchieveCLick={() => setIsDialogOpen(true)}
        />
      </div>
      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
        {isLoading && (
          <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
            <LinearProgress
              sx={{
                backgroundColor: isDark ? 'rgba(4, 122, 219, 0.1)' : 'rgba(4, 122, 219, 0.05)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#047ADB'
                }
              }}
            />
          </Box>
        )}

        {isDialogOpen && <>
          <ArchieveDialog isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)} />
        </>}

        <DataGridPremium
          label="Stock Performance Report"
          rows={tableData}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          rowCount={reportResponse?.stock_performance_count ?? 0}
          pageSizeOptions={[100, 500, 1000]}
          pagination
          loading={isLoading}
          disableRowSelectionOnClick
          rowBufferPx={100}
          sx={getDataGridStyles(isDark, "auto")}
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
    </>
  );
}
