import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { PurchaseOrderReportResponse } from "../types/Interfaces/interfaces";
const API_BASE_URL = import.meta.env.VITE_SCM_API_BASE_URL ?? "/scm/api";

async function fetchPurchaseOrderReport(): Promise<PurchaseOrderReportResponse> {
  const response = await fetch(`${API_BASE_URL}/process-data`, {
    method: "GET"
  });

  let data: PurchaseOrderReportResponse;

  try {
    data = (await response.json()) as PurchaseOrderReportResponse;
  } catch (error) {
    if (!response.ok) {
      throw new Error(
        "Failed to fetch purchase order report. Server returned an invalid response.",
      );
    }
    throw error;
  }
  if (!response.ok || data.success === false) {
    const message =
      `Failed to fetch purchase order report. Server responded with status ${response.status}.`;
    throw new Error(message);
  }
  return data;
}

export const usePurchaseOrderReport = (): UseQueryResult<PurchaseOrderReportResponse, Error> =>
  useQuery<PurchaseOrderReportResponse, Error>({
    queryKey: ["scmPurchaseOrderReport"],
    queryFn: fetchPurchaseOrderReport,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  })