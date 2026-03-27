import { DataGridPremium, GridPaginationModel } from "@mui/x-data-grid-premium"
import { getDataGridStyles } from "../../styles/productionReportStyles"
import { useTheme } from "../../hooks/useTheme";
import { generateWarehouseColumns } from "../../utils/columnGenerators/whContainerReport";
import { PAGINATION_MODEL } from "../../mockData/whContainersReportMock";
import { useContainerReport, usePrefetchContainerReport, ContainerReportFilters } from "../../api/containerDetailReport";
import { useMemo, useState } from "react";
import { ContainerReportApiRow } from "../../types/Interfaces/interfaces";
import { WHContainerReportRow } from "../../types/whContainersReport";
import { useLatestSessionId } from "../../hooks/useLatestSessionId";

function mapApiRowToGridRow(apiRow: ContainerReportApiRow): WHContainerReportRow {
  return {
    id: apiRow.id,
    WareHouseCode: apiRow.warehouse_code,
    CategoryName: apiRow.category_name,
    ItemNumber: apiRow.item_number,
    ContainerName: apiRow.container_name,
    IntransitQuantity: apiRow.intransit_quantity,
    ContainerRegion: apiRow.container_region,
    ContainerNumber: apiRow.container_number,
    DepartureDate: apiRow.departure_date,
    ArrivalDate: apiRow.arrival_date,
    LeftDays: apiRow.left_days,
    UploadDate: apiRow.upload_date,
  };
}

interface WHContainerGridProps {
  filters?: ContainerReportFilters;
}

const WHContainerGrid = ({ filters = {} }: WHContainerGridProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(PAGINATION_MODEL);
  const sessionId = useLatestSessionId();
  const page = paginationModel.page + 1;
  const pageSize = paginationModel.pageSize ?? 100;

  const { data, isLoading } = useContainerReport(page, pageSize, sessionId, filters);

  const totalPages = data?.pagination?.total_pages;
  usePrefetchContainerReport("container", page, pageSize, sessionId, totalPages, 6, filters);

  const rowCount = data?.pagination?.total_records ?? 0;

  const rows: WHContainerReportRow[] = useMemo(
    () => (data?.data ?? []).map(mapApiRowToGridRow),
    [data?.data]
  );

  const columns = generateWarehouseColumns(isDark);

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      <DataGridPremium
        label="Warehouse Container Report"
        rows={rows}
        columns={columns}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[100, 500, 1000, 1500]}
        pagination
        disableRowSelectionOnClick
        loading={isLoading}
        sx={getDataGridStyles(isDark, "auto")}
        rowBufferPx={100}
        showToolbar
        virtualizeColumnsWithAutoRowHeight
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
