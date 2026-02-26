import { UseQueryResult, useQuery, useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { PurchaseOrderReportResponse } from "../types/Interfaces/interfaces";
const API_BASE_URL = import.meta.env.VITE_SCM_API_BASE_URL ?? "/scm/api";

const REQUEST_TIMEOUT_MS = 30_000;

const getAuthHeader = (): Record<string, string> => {
  const token = sessionStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchWithTimeout = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};

async function fetchPurchaseOrderReport(): Promise<PurchaseOrderReportResponse> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/process-data`, {
    method: "GET",
    headers: {
      ...getAuthHeader(),
    },
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

export const patchPurchaseOrderReportData = async (rowId: number, arrivalDate: string): Promise<PurchaseOrderReportResponse> => {
  const requestBody = {
    id: rowId,
    arrival_date: arrivalDate,
  };

  const response = await fetchWithTimeout(`${API_BASE_URL}/process-data/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await response.text();

  let data: PurchaseOrderReportResponse;
  try {
    data = JSON.parse(responseText) as PurchaseOrderReportResponse;
  } catch {
    throw new Error(`Failed to update purchase order. Server returned an invalid response (status ${response.status}).`);
  }

  if (!response.ok || data.success === false) {
    throw new Error(`Failed to update purchase order. Server responded with status ${response.status}.`);
  }

  return data;
}

export const usePatchPurchaseOrderReport = (): UseMutationResult<PurchaseOrderReportResponse, Error, {rowId: number, arrivalDate: string}, unknown> => {
  return useMutation<PurchaseOrderReportResponse, Error, {rowId: number, arrivalDate: string}, unknown>({
    mutationFn: ({rowId, arrivalDate}) => patchPurchaseOrderReportData(rowId, arrivalDate),
  });
}