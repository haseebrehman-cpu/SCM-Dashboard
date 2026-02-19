import { useMutation, UseMutationResult, useQuery, UseQueryResult, useQueryClient } from "@tanstack/react-query";
import { LatestUploadSessionResponse, ScmUploadError, ScmUploadPayload, ScmUploadSuccess } from "../types/Interfaces/interfaces";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_SCM_API_BASE_URL ?? "";

type ScmUploadResponse = ScmUploadSuccess | ScmUploadError;

// Mutation File Uplaod
async function uploadScmFiles(payload: ScmUploadPayload): Promise<ScmUploadResponse> {
  const formData = new FormData();

  payload.last_60_days.forEach((file) => {
    formData.append("last_60_days", file);
  });

  payload.next_60_days_previous_year.forEach((file) => {
    formData.append("next_60_days_previous_year", file);
  });

  payload.open_orders.forEach((file) => {
    formData.append("open_orders", file);
  });

  const response = await fetch(`${API_BASE_URL}/files/`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  let data: ScmUploadResponse;

  try {
    data = (await response.json()) as ScmUploadResponse;
  } catch (error) {
    if (!response.ok) {
      throw new Error("Failed to upload files. Server returned an invalid response.");
    }
    throw error;
  }

  if (!response.ok || data.success === false) {
    const message =
      (data as ScmUploadError).message ||
      `Failed to upload file. Server responded with status ${response.status}.`;
    const error = new Error(message) as Error & { details?: unknown };
    error.details = (data as ScmUploadError).details;
    throw error;
  }

  return data;
}

export const useUploadScmFiles = (): UseMutationResult<
  ScmUploadResponse,
  Error,
  ScmUploadPayload
> => {
  const queryClient = useQueryClient();

  return useMutation<ScmUploadResponse, Error, ScmUploadPayload>({
    mutationFn: uploadScmFiles,
    onSuccess: () => {
      // this will ensure latest-session grid reflects newly saved uploads
      queryClient.invalidateQueries({ queryKey: ["scmLatestUploadSession"] });
    },
  });
};

//  Query latest upload session 
async function fetchLatestUploadSession(): Promise<LatestUploadSessionResponse> {
  const response = await fetch(`${API_BASE_URL}/files/`, {
    method: "GET",
    credentials: "include",
  });

  let data: LatestUploadSessionResponse;

  try {
    data = (await response.json()) as LatestUploadSessionResponse;
  } catch (error) {
    if (!response.ok) {
      throw new Error("Failed to fetch latest upload session. Server returned an invalid response.");
    }
    throw error;
  }

  if (!response.ok || data.success === false) {
    const message =
      data.session?.message ||
      `Failed to fetch latest upload session. Server responded with status ${response.status}.`;
    throw new Error(message);
  }

  return data;
}

export const useLatestUploadSession = (): UseQueryResult<
  LatestUploadSessionResponse,
  Error
> =>
  useQuery<LatestUploadSessionResponse, Error>({
    queryKey: ["scmLatestUploadSession"],
    queryFn: fetchLatestUploadSession,
    staleTime: 60_000,
  });

//  Delete uploads by session id
async function deleteFileUploads(sessionId: number): Promise<LatestUploadSessionResponse> {
  const response = await fetch(`${API_BASE_URL}/files/?session_id=${sessionId}`, {
    method: "DELETE",
    credentials: "include",
  });

  let data: LatestUploadSessionResponse;

  try {
    data = (await response.json()) as LatestUploadSessionResponse;
  } catch (error) {
    if (!response.ok) {
      throw new Error("Failed to delete uploads. Server returned an invalid response.");
    }
    throw error;
  }

  if (!response.ok || data.success === false) {
    const message =
      data.session?.message ||
      `Failed to delete uploads. Server responded with status ${response.status}.`;
    throw new Error(message);
  }

  toast.success("Files Deleted Successfully!")
  return data;
}

export const useDeleteFileUploads = (): UseMutationResult<
  LatestUploadSessionResponse,
  Error,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation<LatestUploadSessionResponse, Error, number>({
    mutationFn: deleteFileUploads,
    onSuccess: () => {
      // Refresh latest-session grid after deletion
      queryClient.invalidateQueries({ queryKey: ["scmLatestUploadSession"] });
    },
  });
};
