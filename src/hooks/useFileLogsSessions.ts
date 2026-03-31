import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useDeleteFileUploads, useLatestUploadSession, useProcessScmFiles } from "../api/scmFileUpload";
import { SessionWithFiles } from "../types/Interfaces/interfaces";

export interface FileLogsSessionRow {
  id: number;
  uploadTimestamp: string;
  totalFilesProcessed: number;
  status: "Success" | "Failed";
  message: string;
  uploadedBy: string;
  process_data: boolean;
  sessionData: SessionWithFiles;
}

export const useFileLogsSessions = () => {
  const { data, isLoading } = useLatestUploadSession();
  const deleteMutation = useDeleteFileUploads();
  const processMutation = useProcessScmFiles();

  const rows = useMemo<FileLogsSessionRow[]>(() => {
    if (!data?.sessions || data.sessions.length === 0) return [];

    return data.sessions.map((session) => ({
      id: session.session.id,
      uploadTimestamp: session.session.upload_timestamp,
      totalFilesProcessed: session.session.total_files,
      status: session.session.status === "Success" ? "Success" : "Failed",
      message: session.session.message,
      uploadedBy: session.session.uploaded_by,
      process_data: session.session.process_data,
      sessionData: session,
    }));
  }, [data]);

  const isGridLoading = isLoading || deleteMutation.isPending || processMutation.isPending;

  const deleteSession = useCallback(
    (sessionId: number, onSuccess?: () => void) => {
      deleteMutation.mutate(
        { sessionId },
        {
          onSuccess: () => {
            onSuccess?.();
          },
          onError: (err) => {
            toast.error((err as Error).message || "Failed to delete upload session");
          },
        },
      );
    },
    [deleteMutation],
  );

  const processSession = useCallback(
    (sessionId: number, onSuccess?: () => void) => {
      processMutation.mutate(
        { session_id: sessionId },
        {
          onSuccess: () => {
            toast.success("Files processed successfully!");
            onSuccess?.();
          },
          onError: (err) => {
            toast.error((err as Error).message || "Failed to process files");
          },
        },
      );
    },
    [processMutation],
  );

  return {
    rows,
    isGridLoading,
    isDeleting: deleteMutation.isPending,
    isProcessing: processMutation.isPending,
    deleteSession,
    processSession,
  };
};

