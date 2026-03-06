import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { API_BASE_URL } from "./purchaseOrder";
import {
  TopSellingItemsResponse,
  RegionalSummaryResponse,
  CategoryDistributionResponse,
} from "../types/Interfaces/interfaces";

export const STOCK_REPORT_CHARTS_QUERY_KEY = ["stockReportCharts"] as const;

export interface ChartFilters {
  warehouse?: string | string[];
  category?: string | string[];
  item_number?: string | string[];
}

async function fetchStockChartData<T>(chart: string, signal?: AbortSignal): Promise<T> {
  const queryParams = new URLSearchParams({ chart });

  const response = await fetch(`${API_BASE_URL}/charts/stock/?${queryParams.toString()}`, {
    method: "GET",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${chart} chart data. Status: ${response.status}`);
  }

  const data = (await response.json()) as T;
  return data;
}

export const useTopSellingChart = (): UseQueryResult<TopSellingItemsResponse, Error> =>
  useQuery<TopSellingItemsResponse, Error>({
    queryKey: [...STOCK_REPORT_CHARTS_QUERY_KEY, "top_selling"],
    queryFn: ({ signal }) => fetchStockChartData<TopSellingItemsResponse>("top_selling", signal),
    staleTime: 300_000,
    refetchOnWindowFocus: false,
  });

export const useRegionalSummaryChart = (): UseQueryResult<RegionalSummaryResponse, Error> =>
  useQuery<RegionalSummaryResponse, Error>({
    queryKey: [...STOCK_REPORT_CHARTS_QUERY_KEY, "regional_summary"],
    queryFn: ({ signal }) => fetchStockChartData<RegionalSummaryResponse>("regional_summary", signal),
    staleTime: 300_000,
    refetchOnWindowFocus: false,
  });

export const useCategoryDistributionChart = (): UseQueryResult<CategoryDistributionResponse, Error> =>
  useQuery<CategoryDistributionResponse, Error>({
    queryKey: [...STOCK_REPORT_CHARTS_QUERY_KEY, "category_distribution"],
    queryFn: ({ signal }) => fetchStockChartData<CategoryDistributionResponse>("category_distribution", signal),
    staleTime: 300_000,
    refetchOnWindowFocus: false,
  });
