import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { PatchSummaryDashboardResponse, StockPerformanceResponse } from "../types/Interfaces/interfaces";
import { API_BASE_URL } from "./purchaseOrder";
import toast from "react-hot-toast";

export const STOCK_PERFORMANCE_REPORT_QUERY_KEY = ["stockPerformanceReport"] as const;

export async function fetchStockPerformanceReportData(
  warehouse_code: string,
  session_id: number | null,
  p: string,
  page: number = 1,
  page_size: number | string = 500,
  signal?: AbortSignal
): Promise<StockPerformanceResponse> {
  const queryParams = new URLSearchParams({
    warehouse_code,
    p,
  })

  if (page_size === "all") {
    queryParams.append("page_size", "all");
  } else {
    queryParams.append("page", String(page));
    queryParams.append("page_size", String(page_size));
  }

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
  page_size: number | string = 1000
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
  pageSize: number | string = 1000,
  isSuccess: boolean = false,
  totalPages: number = 1
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!warehouse_code || !isSuccess || currentPage >= totalPages) return;

    for (let i = 1; i <= 2; i++) {
      const nextPage = currentPage + i;
      if (nextPage > totalPages) break;

      queryClient.prefetchQuery({
        queryKey: [...STOCK_PERFORMANCE_REPORT_QUERY_KEY, warehouse_code, session_id, p, nextPage, pageSize],
        queryFn: ({ signal }) => fetchStockPerformanceReportData(warehouse_code, session_id, p, nextPage, pageSize, signal),
        staleTime: 60_000,
      });
    }
  }, [warehouse_code, session_id, p, currentPage, pageSize, queryClient, isSuccess, totalPages]);
};

export async function postLoadStockPerformanceReport(session_id: number, signal?: AbortSignal | null): Promise<StockPerformanceResponse> {
  const formData = new FormData();
  formData.append("session_id", String(session_id));


  const response = await fetch(`${API_BASE_URL}/stock-performance/`, {
    method: 'POST',
    body: formData,
    signal: signal || undefined
  });


  const responseText = await response.text();
  let data: StockPerformanceResponse;

  try {
    data = JSON.parse(responseText) as StockPerformanceResponse;
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    if (response.status === 524) {
      throw new Error("Cloudflare 524: Server Timeout. The server is taking too long to respond. Please try again later.");
    }
    if (!response.ok) {
      throw new Error(responseText || response.statusText);
    }
    throw error;
  }

  return data
}

export const useLoadStockPerformanceReport = (): UseMutationResult<StockPerformanceResponse, Error, { session_id: number; signal?: AbortSignal }> => {
  const queryClient = useQueryClient();

  return useMutation<StockPerformanceResponse, Error, { session_id: number; signal?: AbortSignal }>({
    mutationFn: ({ session_id, signal }) => postLoadStockPerformanceReport(session_id, signal),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: STOCK_PERFORMANCE_REPORT_QUERY_KEY })
    }
  })
}

// Patch api for summary dashbaord for update status and factory comment
export async function patchSummaryDashboard(id: number, status: string, factory_comment: string, warehouse_code: string, signal?: AbortSignal): Promise<PatchSummaryDashboardResponse> {
  const formData = new FormData();
  formData.append("id", String(id));
  formData.append("status", status);
  formData.append("factory_comment", factory_comment);
  formData.append('warehouse_code', warehouse_code)

  const response = await fetch(`${API_BASE_URL}/stock-performance/?p=sd`, {
    method: 'PATCH',
    body: formData,
    signal: signal || undefined
  });

  const responseText = await response.text();
  let data: PatchSummaryDashboardResponse;

  try {
    data = JSON.parse(responseText) as PatchSummaryDashboardResponse;
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    if (response.status === 524) {
      throw new Error("Cloudflare 524: Server Timeout. The server is taking too long to respond. Please try again later.");
    }
    if (!response.ok) {
      throw new Error(responseText || response.statusText);
    }
    throw error;
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || responseText || response.statusText);
  }

  return data;
}

export const usePatchSummaryDashboard = (): UseMutationResult<PatchSummaryDashboardResponse, Error, { id: number; status: string; factory_comment: string; warehouse_code: string; signal?: AbortSignal }> => {
  return useMutation<PatchSummaryDashboardResponse, Error, { id: number; status: string; factory_comment: string; warehouse_code: string; signal?: AbortSignal }>({
    mutationFn: ({ id, status, factory_comment, warehouse_code, signal }) =>
      patchSummaryDashboard(id, status, factory_comment, warehouse_code, signal),
    onSuccess: () => {
      toast.success("Data Updated Successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Unable to Update at the moment");
    },
  })
}