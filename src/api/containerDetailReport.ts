import { API_BASE_URL, fetchWithTimeout } from "./purchaseOrder";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  StockReportApiResponse,
  ContainerReportApiResponse,
  CombinedReportApiResponse,
} from "../types/Interfaces/interfaces";

export const CONTAINER_DETAIL_REPORT_QUERY_KEY = ["containerDetailReport"] as const;

export async function fetchContainerDetailReport<T = StockReportApiResponse | ContainerReportApiResponse>(
  table: string,
  page: number,
  pageSize: number
): Promise<T> {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/container-report/?table=${table}&page=${page}&limit=${pageSize}`,
    { method: "GET" }
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
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

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