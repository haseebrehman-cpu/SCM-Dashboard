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

const appendFilter = (params: URLSearchParams, name: string, value: string | string[] | undefined) => {
  if (!value) return;
  const val = Array.isArray(value) ? value.filter(v => v !== "" && v !== null && v !== undefined).join(",") : value;
  if (val) {
    params.append(name, val);
  }
};

async function fetchStockChartData<T>(chart: string, filters: ChartFilters = {}, signal?: AbortSignal): Promise<T> {
  const queryParams = new URLSearchParams({ chart });
  
  appendFilter(queryParams, "warehouse", filters.warehouse);
  appendFilter(queryParams, "category", filters.category);
  appendFilter(queryParams, "item_number", filters.item_number);

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

export const useTopSellingChart = (filters: ChartFilters = {}): UseQueryResult<TopSellingItemsResponse, Error> =>
  useQuery<TopSellingItemsResponse, Error>({
    queryKey: [...STOCK_REPORT_CHARTS_QUERY_KEY, "top_selling", filters],
    queryFn: ({ signal }) => fetchStockChartData<TopSellingItemsResponse>("top_selling", filters, signal),
    staleTime: 300_000,
    refetchOnWindowFocus: false,
  });

export const useRegionalSummaryChart = (filters: ChartFilters = {}): UseQueryResult<RegionalSummaryResponse, Error> =>
  useQuery<RegionalSummaryResponse, Error>({
    queryKey: [...STOCK_REPORT_CHARTS_QUERY_KEY, "regional_summary", filters],
    queryFn: ({ signal }) => fetchStockChartData<RegionalSummaryResponse>("regional_summary", filters, signal),
    staleTime: 300_000,
    refetchOnWindowFocus: false,
  });

export const useCategoryDistributionChart = (filters: ChartFilters = {}): UseQueryResult<CategoryDistributionResponse, Error> =>
  useQuery<CategoryDistributionResponse, Error>({
    queryKey: [...STOCK_REPORT_CHARTS_QUERY_KEY, "category_distribution", filters],
    queryFn: ({ signal }) => fetchStockChartData<CategoryDistributionResponse>("category_distribution", filters, signal),
    staleTime: 300_000,
    refetchOnWindowFocus: false,
  });
