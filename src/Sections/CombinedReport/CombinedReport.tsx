import { useState, useMemo } from "react";
import { DataGridPremium, GridPaginationModel } from "@mui/x-data-grid-premium";
import { useTheme } from "../../hooks/useTheme";
import { getDataGridStyles } from "../../styles/productionReportStyles";
import { useCombinedReport, usePrefetchContainerReport, ContainerReportFilters } from "../../api/containerDetailReport";
import { generateCombinedReportColumns } from "../../utils/columnGenerators/combinedReport";
import { PAGINATION_MODEL } from "../../mockData/combinedReportMock";
import { CombinedReportRow } from "../../types/combinedReport";
import { CombinedReportApiRow } from "../../types/Interfaces/interfaces";

function mapApiRowToGridRow(apiRow: CombinedReportApiRow, index: number): CombinedReportRow {
  const {
    upload_date,
    category_name,
    item_number,
    item_title,
    ...rest
  } = apiRow;
  return {
    id: index,
    uploadDate: upload_date ?? "",
    dataFrom: upload_date ?? "-",
    categoryName: category_name ?? "",
    itemNumber: item_number ?? "",
    itemTitle: item_title ?? "",
    ...rest,
  } as CombinedReportRow;
}

interface CombinedReportGridProps {
  filters?: ContainerReportFilters;
}

const CombinedReportGrid = ({ filters = {} }: CombinedReportGridProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(PAGINATION_MODEL);

  const page = paginationModel.page + 1;
  const pageSize = paginationModel.pageSize ?? 100;

  const { data, isLoading } = useCombinedReport(page, pageSize, filters);

  const totalPages = data?.pagination?.total_pages;
  usePrefetchContainerReport("combined", page, pageSize, totalPages, 6, filters);

  const rows: CombinedReportRow[] = useMemo(() => {
    const list = data?.data ?? [];
    const baseId = (page - 1) * pageSize;
    return list.map((row, i) => mapApiRowToGridRow(row, baseId + i));
  }, [data?.data, page, pageSize]);

  const rowCount = data?.pagination?.total_records ?? 0;

  // Here Extracting thhe container column keys from first row (API returns dynamic container columns)
  const containerKeys = useMemo(() => {
    const first = data?.data?.[0];
    if (!first || typeof first !== "object") return undefined;
    const KNOWN = [
      "upload_date", "category_name", "item_number", "item_title",
      "CA_Last_60_Days_Sale", "DE_Last_60_Days_Sale", "UK_Last_60_Days_Sale", "US_Last_60_Days_Sale",
      "CA_WH_Data", "DE_WH_Data", "UK_WH_Data", "US_WH_Data",
      "CA_Containers_Overall_Qty", "CA_Containers_Intransit_Qty", "DE_Containers_Overall_Qty",
      "DE_Containers_Intransit_Qty", "US_Containers_Overall_Qty", "US_Containers_Intransit_Qty",
      "UK_Containers_Overall_Qty", "UK_Containers_Intransit_Qty",
    ];
    return Object.keys(first).filter((k) => !KNOWN.includes(k));
  }, [data?.data]);

  const columns = useMemo(
    () => generateCombinedReportColumns({ isDark, containerKeys }),
    [isDark, containerKeys]
  );

  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-hidden">
      <DataGridPremium
        label="Combined Report"
        rows={rows}
        columns={columns}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[100, 200, 500]}
        pagination
        disableRowSelectionOnClick
        loading={isLoading}
        sx={getDataGridStyles(isDark, "auto")}
        rowBufferPx={100}
        columnHeaderHeight={56}
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

export default CombinedReportGrid