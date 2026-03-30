import { UseQueryResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { StockPerformanceResponse } from "../types/Interfaces/interfaces";
import { API_BASE_URL } from "./purchaseOrder";

export const STOCK_PERFORMANCE_REPORT_QUERY_KEY = ["stockPerformanceReport"] as const;


export async function fetchStockPerformanceReportData(
  warehouse_code: string,
  session_id: number | null,
  p: string,
  page: number = 1,
  page_size: number = 1000,
  signal?: AbortSignal
): Promise<StockPerformanceResponse> {
  const queryParams = new URLSearchParams({
    warehouse_code,
    p,
    page: String(page),
    page_size: String(page_size)
  })

  if (session_id !== null && session_id !== undefined) {
    queryParams.append("session_id", String(session_id))
  }

  const url = `${API_BASE_URL}/stock-performance/?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    signal,
    headers: {
      "Content-Type": "application/json"
    },
  });


  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to fetch report. Status: ${response.status}`)
  }

  const data = (await response.json()) as StockPerformanceResponse;

  if (data.success === false) {
    throw new Error(data.message || "API returned success: false");
  }

  return data;
}

export const useStockPerfomanceReport = (
  warehouse_code: string,
  session_id: number | null,
  p: string,
  page: number = 1,
  page_size: number = 1000
): UseQueryResult<StockPerformanceResponse, Error> =>
  useQuery<StockPerformanceResponse, Error>({
    queryKey: [...STOCK_PERFORMANCE_REPORT_QUERY_KEY, warehouse_code, session_id, p, page, page_size],
    queryFn: ({ signal }) => fetchStockPerformanceReportData(warehouse_code, session_id, p, page, page_size, signal),
    staleTime: 60_000,
    enabled: !!warehouse_code,
  })

export const usePrefetchStockPerformance = (
  warehouse_code: string,
  session_id: number | null,
  p: string,
  currentPage: number,
  pageSize: number = 1000
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!warehouse_code) return;

    // Prefetch next 7 pages
    for (let i = 1; i <= 7; i++) {
      const nextPage = currentPage + i;
      queryClient.prefetchQuery({
        queryKey: [...STOCK_PERFORMANCE_REPORT_QUERY_KEY, warehouse_code, session_id, p, nextPage, pageSize],
        queryFn: ({ signal }) => fetchStockPerformanceReportData(warehouse_code, session_id, p, nextPage, pageSize, signal),
        staleTime: 60_000,
      });
    }
  }, [warehouse_code, session_id, p, currentPage, pageSize, queryClient]);
};