import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { API_BASE_URL } from "./purchaseOrder";
import {
  InTransitVolumeResponse, ContainerKpisResponse,
} from "../types/Interfaces/interfaces";

export const WAREHOUSE_CONTAINER_REPORT_CHARTS_QUERY_KEY = ["warehouseContainerReportCharts"] as const;

export interface ChartFilters {
  warehouse?: string | string[];
  category?: string | string[];
  container_name?: string | string[];
  sku?: string | string[];
}

async function fetchContainerChartData<T>(chart: string, session_id: number | null, filters?: ChartFilters, signal?: AbortSignal): Promise<T> {
  const queryParams = new URLSearchParams({ chart });

  if (session_id !== null && session_id !== undefined) {
    queryParams.append("session_id", String(session_id));
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => queryParams.append(key, v));
      } else if (value) {
        queryParams.append(key, value);
      }
    });
  }

  const response = await fetch(`${API_BASE_URL}/charts/container/?${queryParams.toString()}`, {
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


export const useInTransitVolumeChart = (session_id: number | null, filters?: ChartFilters): UseQueryResult<InTransitVolumeResponse, Error> =>
  useQuery<InTransitVolumeResponse, Error>({
    queryKey: [...WAREHOUSE_CONTAINER_REPORT_CHARTS_QUERY_KEY, "intransit_volume", session_id, filters],
    queryFn: ({ signal }) => fetchContainerChartData<InTransitVolumeResponse>("intransit_volume", session_id, filters, signal),
    staleTime: 300_000,
    refetchOnWindowFocus: false,
    enabled: session_id !== null && session_id !== undefined,
  });

export const useWarehouseKpi = (session_id: number | null, filters?: ChartFilters): UseQueryResult<ContainerKpisResponse, Error> =>
  useQuery<ContainerKpisResponse, Error>({
    queryKey: [...WAREHOUSE_CONTAINER_REPORT_CHARTS_QUERY_KEY, "kpis", session_id, filters],
    queryFn: ({ signal }) => fetchContainerChartData<ContainerKpisResponse>("kpis", session_id, filters, signal),
    staleTime: 300_000,
    refetchOnWindowFocus: false,
    enabled: session_id !== null && session_id !== undefined,
  });
