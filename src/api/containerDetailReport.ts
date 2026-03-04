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
  pageSize: number
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}/container-report/?table=${table}&page=${page}&limit=${pageSize}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
  );

  let data: T;

  try {
    data = (await response.json()) as T;
  } catch (error) {
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
    queryFn: () => fetchContainerDetailReport<T>(table, page, pageSize),
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
        queryFn: () => fetchContainerDetailReport<T>(table, nextPage, pageSize),
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

async function deleteRunningReport(session_id: number): Promise<CancelRunningReportResponse> {
  const formData = new FormData();
  formData.append("session_id", String(session_id));

  const response = await fetch(`${API_BASE_URL}/container-report/`, {
    method: "DELETE",
    body: formData
  });

  let data: CancelRunningReportResponse;

  try {
    data = (await response.json()) as CancelRunningReportResponse;
  } catch (error) {
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

export const useDeleteRunningReport = (): UseMutationResult<CancelRunningReportResponse, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation<CancelRunningReportResponse, Error, number>({
    mutationFn: deleteRunningReport,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CONTAINER_DETAIL_REPORT_QUERY_KEY })
    }
  })
}