import { UseQueryResult, useQuery, useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { PurchaseOrderReportResponse, PurchaseOrderBulkUpdateErrorResponse, PurchaseOrderBulkUpdateSuccessResponse, ProductionRemainingLoadResponse } from "../types/Interfaces/interfaces";
export const API_BASE_URL = import.meta.env.VITE_SCM_API_BASE_URL ?? "/scm/api";

export const PURCHASE_ORDER_REPORT_QUERY_KEY = ["scmPurchaseOrderReport"] as const;

async function fetchPurchaseOrderReport(signal?: AbortSignal): Promise<PurchaseOrderReportResponse> {
  const response = await fetch(`${API_BASE_URL}/process-data`, {
    method: "GET",
    signal,
    headers: {
    },
  });

  const responseText = await response.text();
  let data: PurchaseOrderReportResponse;

  try {
    data = JSON.parse(responseText) as PurchaseOrderReportResponse;
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    if (!response.ok) {
      throw new Error(responseText || response.statusText);
    }
    throw error;
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || responseText || response.statusText);
  }
  return data;
}

export const usePurchaseOrderReport = (): UseQueryResult<PurchaseOrderReportResponse, Error> =>
  useQuery<PurchaseOrderReportResponse, Error>({
    queryKey: PURCHASE_ORDER_REPORT_QUERY_KEY,
    queryFn: ({ signal }) => fetchPurchaseOrderReport(signal),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

export const patchPurchaseOrderReportData = async ({ rowId, arrivalDate, signal }: { rowId: number; arrivalDate: string | null; signal?: AbortSignal }): Promise<PurchaseOrderReportResponse> => {
  const requestBody = {
    id: rowId,
    arrival_date: arrivalDate,
  };

  const response = await fetch(`${API_BASE_URL}/process-data/`, {
    method: "PATCH",
    signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await response.text();
  let data: PurchaseOrderReportResponse;

  try {
    data = JSON.parse(responseText) as PurchaseOrderReportResponse;
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    if (!response.ok) {
      throw new Error(responseText || response.statusText);
    }
    throw error;
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || responseText || response.statusText);
  }

  return data;
}

export const usePatchPurchaseOrderReport = (): UseMutationResult<PurchaseOrderReportResponse, Error, { rowId: number, arrivalDate: string | null; signal?: AbortSignal }, unknown> => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseOrderReportResponse, Error, { rowId: number, arrivalDate: string | null; signal?: AbortSignal }, unknown>({
    mutationFn: (variables) => patchPurchaseOrderReportData(variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_REPORT_QUERY_KEY });
    },
  });
}

type PurchaseOrderBulkUpdateResponse =
  | PurchaseOrderBulkUpdateSuccessResponse
  | PurchaseOrderBulkUpdateErrorResponse;

async function uploadPurchaseOrderFile({ file, signal }: { file: File; signal?: AbortSignal }): Promise<PurchaseOrderBulkUpdateSuccessResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/bulk-update/`, {
    method: "POST",
    body: formData,
    signal,
  });

  const responseText = await response.text();
  let data: PurchaseOrderBulkUpdateResponse;

  try {
    data = JSON.parse(responseText) as PurchaseOrderBulkUpdateResponse;
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    if (!response.ok) {
      throw new Error(responseText || response.statusText);
    }
    throw error;
  }

  if (!response.ok || data.success === false) {
    const message = (data as PurchaseOrderBulkUpdateErrorResponse).message;
    throw new Error(message || responseText || response.statusText);
  }

  return data;
}

export const useUploadPurchaseOrderFiles = (): UseMutationResult<PurchaseOrderBulkUpdateSuccessResponse, Error, { file: File; signal?: AbortSignal }> => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseOrderBulkUpdateSuccessResponse, Error, { file: File; signal?: AbortSignal }>({
    mutationFn: uploadPurchaseOrderFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_REPORT_QUERY_KEY });
    },

  })
}

export async function postProductionRemainingLoadReport(warehouse_region: string, session_id: number, signal?: AbortSignal): Promise<ProductionRemainingLoadResponse> {
  const formData = new FormData();
  formData.append("session_id", String(session_id));

  const queryParams = new URLSearchParams({
    warehouse_region,
  });

  const response = await fetch(`${API_BASE_URL}/production-remaining/?${queryParams.toString()}`, {
    method: "POST",
    body: formData,
    signal,
  });

  const responseText = await response.text();
  let data: ProductionRemainingLoadResponse;

  try {
    data = JSON.parse(responseText) as ProductionRemainingLoadResponse;
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    if (!response.ok) {
      throw new Error(responseText || response.statusText);
    }
    throw error;
  }

  if (!response.ok || data.success === false) {
    const message = (data as PurchaseOrderBulkUpdateErrorResponse).message;
    throw new Error(message || responseText || response.statusText);
  }

  return data;
}

export const usePostProductionLoadReport = (): UseMutationResult<ProductionRemainingLoadResponse, Error, { warehouse_region: string; session_id: number; signal?: AbortSignal }> => {
  const queryClient = useQueryClient();

  return useMutation<ProductionRemainingLoadResponse, Error, { warehouse_region: string; session_id: number; signal?: AbortSignal }>({
    mutationFn: ({ warehouse_region, session_id, signal }) =>
      postProductionRemainingLoadReport(warehouse_region, session_id, signal),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_REPORT_QUERY_KEY });
    },
  });
}

export async function postUploadPurchaseOrderReport(session_id: number, signal?: AbortSignal): Promise<PurchaseOrderBulkUpdateSuccessResponse> {
  const formData = new FormData();
  formData.append("session_id", String(session_id));

  const response = await fetch(`${API_BASE_URL}/container-report/`, {
    method: "POST",
    body: formData,
    signal,
  });

  const responseText = await response.text();
  let data: PurchaseOrderBulkUpdateResponse;

  try {
    data = JSON.parse(responseText) as PurchaseOrderBulkUpdateResponse;
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    if (!response.ok) {
      throw new Error(responseText || response.statusText);
    }
    throw error;
  }

  if (!response.ok || data.success === false) {
    const message = (data as PurchaseOrderBulkUpdateErrorResponse).message;
    throw new Error(message || responseText || response.statusText);
  }

  return data;
}

// Load Report Mutation
export const useUploadPurchaseOrderReport = (): UseMutationResult<PurchaseOrderBulkUpdateSuccessResponse, Error, { session_id: number; signal?: AbortSignal }> => {
  const queryClient = useQueryClient();

  return useMutation<PurchaseOrderBulkUpdateSuccessResponse, Error, { session_id: number; signal?: AbortSignal }>({
    mutationFn: ({ session_id, signal }) => postUploadPurchaseOrderReport(session_id, signal),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_REPORT_QUERY_KEY });
    },
  });
}