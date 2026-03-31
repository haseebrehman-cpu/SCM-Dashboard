import { useState, useMemo, useEffect } from "react";
import { DataGridPremium, GridPaginationModel } from "@mui/x-data-grid-premium";
import { PAGINATION_MODEL } from "../../mockData/stockReportMock";
import { getDataGridStyles } from "../../styles/productionReportStyles";
import { useTheme } from "../../hooks/useTheme";
import { generateStockReportColumns } from "../../utils/columnGenerators/stockReport";
import { useStockReport, usePrefetchContainerReport, ContainerReportFilters } from "../../api/containerDetailReport";
import { StockReportRow } from "../../types/stockReport";
import { StockReportApiRow } from "../../types/Interfaces/interfaces";
import { useLatestSessionId } from "../../hooks/useLatestSessionId";
import { BrandedLogoLoader } from "../../components/common/BrandedLogoLoader";


function mapApiRowToGridRow(apiRow: StockReportApiRow): StockReportRow {
  return {
    id: apiRow?.id,
    UploadDate: apiRow?.upload_date,
    WareHouseCode: apiRow?.warehouse_code,
    CategoryName: apiRow?.category_name,
    ItemNumber: apiRow?.item_number,
    ItemTitle: apiRow?.item_title,
    SoldQuantity: apiRow?.sold_quantity,
    Available: apiRow?.available,
  };
}

interface StockReportGridProps {
  filters?: ContainerReportFilters;
}

const StockReportGrid = ({ filters = {} }: StockReportGridProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(PAGINATION_MODEL);
  const [isChangingPage, setIsChangingPage] = useState(false);

  // Show a brief loader when changing pages to provide feedback
  useEffect(() => {
    setIsChangingPage(true);
    const timer = setTimeout(() => {
      setIsChangingPage(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [paginationModel]);

  const sessionId = useLatestSessionId();

  const page = paginationModel?.page + 1;
  const pageSize = paginationModel?.pageSize ?? 100;

  const { data, isLoading } = useStockReport(page, pageSize, sessionId, filters);
  const isAnyLoading = isLoading || isChangingPage;

  const totalPages = data?.pagination?.total_pages;
  usePrefetchContainerReport("stock", page, pageSize, sessionId, totalPages, 6, filters);

  const rows: StockReportRow[] = useMemo(
    () => (data?.data ?? []).map(mapApiRowToGridRow),
    [data?.data]
  );

  const rowCount = data?.pagination?.total_records ?? 0;

  const columns = generateStockReportColumns();

  return (

    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden min-h-[400px]">
      {/* Loading Overlay */}
      <BrandedLogoLoader isLoading={isAnyLoading} isDark={isDark} message="Loading Stock Report..." />

      <DataGridPremium
        label="Stock Report"
        rows={rows}
        columns={columns}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[100, 500, 1000, 1500]}
        pagination
        disableRowSelectionOnClick
        loading={false}
        sx={getDataGridStyles(isDark, "80vh")}
        rowBufferPx={100}
        showToolbar
        slotProps={{
          toolbar: {
            printOptions: { disableToolbarButton: true },
            excelOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: false },
          },
        }}

      />
    </div>
  );
};

export default StockReportGrid;