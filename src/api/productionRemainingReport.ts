import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { API_BASE_URL } from "./purchaseOrder";
import { ProductionRemainingApiResponse } from "../types/Interfaces/interfaces";

export const PRODUCTION_REMAINING_REPORT_QUERY_KEY = ["productionRemainingReport"] as const;

export async function fetchProductionRemainingReport(
  warehouse_region: string,
  signal?: AbortSignal
): Promise<ProductionRemainingApiResponse> {
  const queryParams = new URLSearchParams({
    warehouse_region,
  });

  const url = `${API_BASE_URL}/production-remaining/?${queryParams.toString()}`;
  console.log("Fetching Production Remaining Report from:", url);

  const response = await fetch(url, {
    method: "GET",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error(errorText || `Failed to fetch report. Status: ${response.status}`);
  }

  const data = (await response.json()) as ProductionRemainingApiResponse;
  console.log("API Success Data:", data);

  if (data.success === false) {
    throw new Error(data.message || "API returned success: false");
  }

  return data;
}

export const useProductionRemainingReport = (
  warehouse_region: string
): UseQueryResult<ProductionRemainingApiResponse, Error> =>
  useQuery<ProductionRemainingApiResponse, Error>({
    queryKey: [...PRODUCTION_REMAINING_REPORT_QUERY_KEY, warehouse_region],
    queryFn: ({ signal }) => fetchProductionRemainingReport(warehouse_region, signal),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    enabled: !!warehouse_region,
  });