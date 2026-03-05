import { useEffect, useCallback } from "react";
import { API_BASE_URL } from "./purchaseOrder";
import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  StockReportApiResponse,
  ContainerReportApiResponse,
  CombinedReportApiResponse,
  CancelRunningReportResponse,
} from "../types/Interfaces/interfaces";

export const CONTAINER_DETAIL_REPORT_QUERY_KEY = ["containerDetailReport"] as const;

export async function fetchContainerDetailReport<T = StockReportApiResponse | ContainerReportApiResponse>(
  table: string,
  page: number,
  pageSize: number,
  signal?: AbortSignal
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}/container-report/?table=${table}&page=${page}&limit=${pageSize}`, {
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
  pageSize: number
): UseQueryResult<T, Error> =>
  useQuery<T, Error>({
    queryKey: [...CONTAINER_DETAIL_REPORT_QUERY_KEY, table, page, pageSize],
    queryFn: ({ signal }) => fetchContainerDetailReport<T>(table, page, pageSize, signal),
    staleTime: 60_000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false
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
  totalPages: number | undefined,
  prefetchCount = 6
): void {
  const queryClient = useQueryClient();

  const prefetch = useCallback(() => {
    if (totalPages === undefined) return;

    for (let i = 1; i <= prefetchCount; i++) {
      const nextPage = currentPage + i;
      if (nextPage > totalPages) break;

      queryClient.prefetchQuery<T, Error>({
        queryKey: [...CONTAINER_DETAIL_REPORT_QUERY_KEY, table, nextPage, pageSize],
        queryFn: ({ signal }) => fetchContainerDetailReport<T>(table, nextPage, pageSize, signal),
        staleTime: 60_000,
      });
    }
  }, [queryClient, table, currentPage, pageSize, totalPages, prefetchCount]);

  useEffect(() => {
    prefetch();
  }, [prefetch]);
}

// Convenience hooks for specific tables
export const useStockReport = (
  page: number,
  pageSize: number
): UseQueryResult<StockReportApiResponse, Error> =>
  useContainerDetailReport<StockReportApiResponse>("stock", page, pageSize);

export const useContainerReport = (
  page: number,
  pageSize: number
): UseQueryResult<ContainerReportApiResponse, Error> =>
  useContainerDetailReport<ContainerReportApiResponse>("container", page, pageSize);

export const useCombinedReport = (
  page: number,
  pageSize: number
): UseQueryResult<CombinedReportApiResponse, Error> =>
  useContainerDetailReport<CombinedReportApiResponse>("combined", page, pageSize);

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