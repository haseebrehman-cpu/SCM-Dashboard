import { useEffect, useState } from "react";
import { SummaryDashboardRow } from "../config/summaryDashboard";
import { Warehouse } from "../types/common";
import { useStockPerfomanceReport, usePrefetchStockPerformance } from "../api/stockPerfomance";
import { SummaryDashboardDataRowApi } from "../types/Interfaces/interfaces";

interface UseSummaryDashboardDataParams {
  selectedWarehouse: Warehouse;
  sessionId: number | null;
  page: number;
  pageSize: number;
}

interface UseSummaryDashboardDataResult {
  rows: SummaryDashboardRow[];
  setRows: React.Dispatch<React.SetStateAction<SummaryDashboardRow[]>>;
  rowCount: number;
  isLoading: boolean;
}

export const useSummaryDashboardData = ({
  selectedWarehouse,
  sessionId,
  page,
  pageSize,
}: UseSummaryDashboardDataParams): UseSummaryDashboardDataResult => {
  const [rows, setRows] = useState<SummaryDashboardRow[]>([]);

  const {
    data: reportResponse,
    isLoading,
    isSuccess,
  } = useStockPerfomanceReport(
    selectedWarehouse,
    sessionId,
    "sd",
    page + 1,
    pageSize,
  );

  usePrefetchStockPerformance(
    selectedWarehouse,
    sessionId,
    "sd",
    page + 1,
    pageSize,
    isSuccess,
  );

  useEffect(() => {
    if (reportResponse?.summary_dashboard_data) {
      const mappedRows = reportResponse.summary_dashboard_data.map(
        (row: SummaryDashboardDataRowApi): SummaryDashboardRow => ({
          id: row.id,
          itemNumber: String(row.item_number),
          itemTitle: row.item_title,
          categoryName: row.category_name,
          wh: row.warehouse_code,
          fbaWhCoverDay: row.fba_wh_cover_day,
          remaining: row.remaining ?? 0,
          totalDispatchQty: row.total_dispatch_quantity,
          dispatchCoverDay: row.dispatch_cover_day,
          maxD: row.max_daily_consumption,
          status: row.status,
          reason1: row.reason_1 ?? "",
          reason2: row.reason_2 ?? "",
          reason3: row.reason_3 ?? "",
          reason4: row.reason_4 ?? "",
          factoryComments: row.factory_comments ?? "",
          editedBy: row.edited_by ?? undefined,
        }),
      );
      setRows(mappedRows);
    } else if (!isLoading) {
      setRows([]);
    }
  }, [reportResponse, isLoading]);

  return {
    rows,
    setRows,
    rowCount: reportResponse?.summary_dashboard_count ?? 0,
    isLoading,
  };
};

