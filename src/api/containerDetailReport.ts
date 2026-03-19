import { useEffect, useCallback } from "react";
import { API_BASE_URL } from "./purchaseOrder";
import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  StockReportApiResponse,
  ContainerReportApiResponse,
  CombinedReportApiResponse,
  CancelRunningReportResponse,
  FilterOptionsResponse,
} from "../types/Interfaces/interfaces";

export const CONTAINER_DETAIL_REPORT_QUERY_KEY = ["containerDetailReport"] as const;

export interface ContainerReportFilters {
  warehouse?: string | string[];
  category?: string | string[];
  item_number?: string | string[];
  container_name?: string | string[];
  sku?: string | string[];
}

const appendFilter = (params: URLSearchParams, name: string, value: string | string[] | undefined) => {
  if (!value) return;
  const val = Array.isArray(value) ? value.filter(v => v !== "" && v !== null && v !== undefined).join(",") : value;
  if (val) {
    params.append(name, val);
  }
};

export async function fetchContainerDetailReport<T = StockReportApiResponse | ContainerReportApiResponse>(
  table: string,
  page: number,
  pageSize: number,
  session_id: number,
  filters: ContainerReportFilters = {},
  signal?: AbortSignal
): Promise<T> {
  const isFilterActive = (val: string | string[] | undefined) => {
    if (!val) return false;
    if (Array.isArray(val)) return val.some(v => v !== "" && v !== null && v !== undefined);
    return val !== "";
  };

  const hasActiveFilters =
    isFilterActive(filters.warehouse) ||
    isFilterActive(filters.category) ||
    isFilterActive(filters.item_number) ||
    isFilterActive(filters.container_name) ||
    isFilterActive(filters.sku);

  const queryParams = new URLSearchParams({ table });

  if (!hasActiveFilters) {
    queryParams.append("page", String(page));
    queryParams.append("page_size", String(pageSize));
    queryParams.append("session_id", String(session_id))
  }

  appendFilter(queryParams, "warehouse", filters.warehouse);
  appendFilter(queryParams, "category", filters.category);
  appendFilter(queryParams, "item_number", filters.item_number);
  appendFilter(queryParams, "container_name", filters.container_name);
  appendFilter(queryParams, "sku", filters.sku);

  const response = await fetch(
    `${API_BASE_URL}/container-report/?${queryParams.toString()}`, {
    method: "GET",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
  }
  );

  let data: T;

  try {
    data = (await response.json()) as T;
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    if (!response.ok) {
      throw new Error("Failed to fetch report. Server returned an invalid response.");
    }
    throw error;
  }

  if (!response.ok || (data as { success?: boolean }).success === false) {
    throw new Error(`Failed to fetch report. Server responded with status ${response.status}.`);
  }

  return data;
}

export const useContainerDetailReport = <T = StockReportApiResponse | ContainerReportApiResponse>(
  table: string,
  page: number,
  pageSize: number,
  session_id: number | null,
  filters: ContainerReportFilters = {}
): UseQueryResult<T, Error> =>
  useQuery<T, Error>({
    queryKey: [...CONTAINER_DETAIL_REPORT_QUERY_KEY, table, page, pageSize, session_id, filters],
    queryFn: ({ signal }) => fetchContainerDetailReport<T>(table, page, pageSize, session_id!, filters, signal),
    staleTime: 60_000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    enabled: session_id !== null && session_id !== undefined,
  });

/**
 * Prefetch the next `prefetchCount` pages for a container-detail table.
 * Call this hook alongside the main data-fetching hook so that when the user
 * navigates forward the data is already in the React-Query cache.
 */
export function usePrefetchContainerReport<T = StockReportApiResponse | ContainerReportApiResponse>(
  table: string,
  currentPage: number,
  pageSize: number,
  session_id: number | null,
  totalPages: number | undefined,
  prefetchCount = 6,
  filters: ContainerReportFilters = {}
): void {
  const queryClient = useQueryClient();

  const prefetch = useCallback(() => {
    if (totalPages === undefined || session_id === null || session_id === undefined) return;

    for (let i = 1; i <= prefetchCount; i++) {
      const nextPage = currentPage + i;
      if (nextPage > totalPages) break;

      queryClient.prefetchQuery<T, Error>({
        queryKey: [...CONTAINER_DETAIL_REPORT_QUERY_KEY, table, nextPage, pageSize, session_id, filters],
        queryFn: ({ signal }) => fetchContainerDetailReport<T>(table, nextPage, pageSize, session_id, filters, signal),
        staleTime: 60_000,
      });
    }
  }, [queryClient, table, currentPage, pageSize, session_id, totalPages, prefetchCount, filters]);

  useEffect(() => {
    prefetch();
  }, [prefetch]);
}

// Convenience hooks for specific tables
export const useStockReport = (
  page: number,
  pageSize: number,
  session_id: number | null,
  filters: ContainerReportFilters = {}
): UseQueryResult<StockReportApiResponse, Error> =>
  useContainerDetailReport<StockReportApiResponse>("stock", page, pageSize, session_id, filters);

export const useContainerReport = (
  page: number,
  pageSize: number,
  session_id: number | null,
  filters: ContainerReportFilters = {}
): UseQueryResult<ContainerReportApiResponse, Error> =>
  useContainerDetailReport<ContainerReportApiResponse>("container", page, pageSize, session_id, filters);

export const useCombinedReport = (
  page: number,
  pageSize: number,
  session_id: number | null,
  filters: ContainerReportFilters = {}
): UseQueryResult<CombinedReportApiResponse, Error> =>
  useContainerDetailReport<CombinedReportApiResponse>("combined", page, pageSize, session_id, filters);

async function deleteRunningReport({ session_id, signal }: { session_id: number; signal?: AbortSignal }): Promise<CancelRunningReportResponse> {
  const formData = new FormData();
  formData.append("session_id", String(session_id));

  const response = await fetch(`${API_BASE_URL}/container-report/`, {
    method: "DELETE",
    body: formData,
    signal
  });

  let data: CancelRunningReportResponse;

  try {
    data = (await response.json()) as CancelRunningReportResponse;
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    if (!response.ok) {
      throw new Error(
        'Failed to delete the running report'
      )
    }
    throw error;
  }
  if (!response.ok || data.success === false) {
    const message = (data as CancelRunningReportResponse).message || `Failed to delete the running report. Server responded with status ${response.status}.`
    throw new Error(message)
  }
  return data
}

export const useDeleteRunningReport = (): UseMutationResult<CancelRunningReportResponse, Error, { session_id: number; signal?: AbortSignal }> => {
  const queryClient = useQueryClient();

  return useMutation<CancelRunningReportResponse, Error, { session_id: number; signal?: AbortSignal }>({
    mutationFn: deleteRunningReport,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CONTAINER_DETAIL_REPORT_QUERY_KEY })
    }
  })
}

export async function fetchFilterOptions(table: string, session_id: number | null, filters: ContainerReportFilters = {}, signal?: AbortSignal): Promise<FilterOptionsResponse> {
  const queryParams = new URLSearchParams({
    table,
    filter_options: "true"
  });

  if (session_id !== null && session_id !== undefined) {
    queryParams.append("session_id", String(session_id))
  }

  appendFilter(queryParams, "warehouse", filters.warehouse);
  appendFilter(queryParams, "category", filters.category);
  appendFilter(queryParams, "item_number", filters.item_number);
  appendFilter(queryParams, "container_name", filters.container_name);
  appendFilter(queryParams, "sku", filters.sku);

  const response = await fetch(`${API_BASE_URL}/container-report/?${queryParams.toString()}`, {
    method: "GET",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch filter options. Status: ${response.status}`);
  }

  const data = (await response.json()) as FilterOptionsResponse;
  return data;
}

export const useFilterOptions = (table: string, session_id: number | null, filters: ContainerReportFilters = {}): UseQueryResult<FilterOptionsResponse, Error> =>
  useQuery<FilterOptionsResponse, Error>({
    queryKey: ["filterOptions", table, session_id, filters],
    queryFn: ({ signal }) => fetchFilterOptions(table, session_id, filters, signal),
    staleTime: 300_000,
    refetchOnWindowFocus: false,
    enabled: session_id !== null && session_id !== undefined,
  });