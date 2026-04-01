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
    reportResponse?.pagination?.total_pages ?? reportResponse?.summary_dashboard_page_count ?? reportResponse?.stock_performance_page_count ?? 1
  );

  useEffect(() => {
    const data = (reportResponse?.summary_dashboard_data || reportResponse?.data) as SummaryDashboardDataRowApi[] | undefined;
    if (data) {
      const mappedRows = data.map(
        (row: SummaryDashboardDataRowApi): SummaryDashboardRow => ({
          id: row.id,
          upload_date: row.upload_date,
          warehouse_code: row.warehouse_code,
          category_name: row.category_name,
          itemNumber: String(row.item_number),
          itemTitle: row.item_title,
          wh_stock: row.wh_stock,
          fba_wh_cover_day: row.fba_wh_cover_day,
          all_stock: row.all_stock,
          dispatch_date_cover: row.dispatch_date_cover,
          max_daily_consumption: row.max_daily_consumption,
          reason1: row.reason_1 ?? "",
          reason2: row.reason_2 ?? "",
          reason3: row.reason_3 ?? "",
          reason4: row.reason_4 ?? "",
          remaining: row.remaining ?? 0,
          status: row.status,
          factory_comment: row.factory_comment ?? row.factory_comments ?? "",
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
    rowCount: reportResponse?.pagination?.total_records ?? reportResponse?.summary_dashboard_count ?? reportResponse?.total_records ?? 0,
    isLoading,
  };
};

