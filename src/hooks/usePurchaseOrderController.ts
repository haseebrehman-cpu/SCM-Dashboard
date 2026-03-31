import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { GridPaginationModel } from "@mui/x-data-grid-premium";
import { SelectChangeEvent } from "@mui/material";

import { PURCHASE_ORDER_PAGINATION_MODEL } from "../constants/pagination";
import { WAREHOUSE_OPTIONS } from "../constants/productionReport";
import { useLatestSessionId } from "./useLatestSessionId";
import { useLoadReportflagCheck } from "./useLoadReportflagCheck";

import { useInlineEdit } from "./useInlineEdit";
import {
  usePatchPurchaseOrderReport,
  usePostProductionLoadReport,
  usePurchaseOrderReport,
  useUploadPurchaseOrderFiles,
  useUploadPurchaseOrderReport,
} from "../api/purchaseOrder";
import { useDeleteRunningReport } from "../api/containerDetailReport";
import { generatePurchaseOrderColumns } from "../utils/columnGenerators/purchaseOrder";
import type { Warehouse } from "../types/productionReport";
import { LoadStatus } from "../Sections/PurchaseOrderGrid/LoadReportProgressDialog";
import type { PurchaseOrderData } from "../types/Interfaces/interfaces";
import type { GridColDef } from "@mui/x-data-grid";

interface UsePurchaseOrderControllerResult {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isLoadReportDialogOpen: boolean;
  setIsLoadReportDialogOpen: (open: boolean) => void;

  selectedWarehouse: Warehouse;
  handleWarehouseChange: (event: SelectChangeEvent<Warehouse>) => void;

  sessionId: number | null;

  rows: PurchaseOrderData[];
  columns: GridColDef[];

  paginationModel: GridPaginationModel;
  setPaginationModel: (value: GridPaginationModel) => void;
  isChangingPage: boolean;

  isAnyLoading: boolean;
  isRefetching: boolean;

  isFlagsDisabled: boolean;
  isFlagsLoading: boolean;

  isArrivalEmpty: boolean;
  emptyItemCount: number;

  // Refresh + load flows
  handleRefreshApi: () => Promise<void>;
  handleLoadReportClick: () => void;
  handleConfirmLoadReport: () => Promise<void>;
  handleCancelLoadReport: () => Promise<void>;

  // Inline editing states used by columns generator
  isUpdatingDate: boolean;
  updatingRowId: number | null;

  // Load progress dialog state
  loadStatus: LoadStatus;
  loadProgress: number;
  currentLoadStep: number;
  loadErrorMessage?: string;
  loadReportMutationStatus?: string;

  // File upload dialog handler
  handlePurchaseOrderUpload: (file: File) => Promise<void>;
}

function isBlankValue(value: string | null | undefined): boolean {
  if (value === null || value === undefined) return true;
  return typeof value === "string" ? value.trim() === "" : true;
}

function countBlankValues(values: Array<string | null | undefined>): number {
  let count = 0;
  for (const v of values) {
    if (isBlankValue(v)) count++;
  }
  return count;
}

export const usePurchaseOrderController = (isDark: boolean): UsePurchaseOrderControllerResult => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadReportDialogOpen, setIsLoadReportDialogOpen] = useState(false);

  const [isUpdatingDate, setIsUpdatingDate] = useState(false);
  const [updatingRowId, setUpdatingRowId] = useState<number | null>(null);

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>("UK");

  const latestSessionId = useLatestSessionId();
  const sessionId = latestSessionId;

  const loadReportMutation = useUploadPurchaseOrderReport();
  const postProductionLoadReportMutation = usePostProductionLoadReport();

  const {
    isButtonDisabled: isFlagsDisabled,
    isLoading: isFlagsLoading,
    refetchAll: refetchFlag,
  } = useLoadReportflagCheck(selectedWarehouse, sessionId);

  const [loadStatus, setLoadStatus] = useState<LoadStatus>("idle");
  const [loadProgress, setLoadProgress] = useState(1);
  const [currentLoadStep, setCurrentLoadStep] = useState(0);
  const [loadErrorMessage, setLoadErrorMessage] = useState<string | undefined>();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(PURCHASE_ORDER_PAGINATION_MODEL);
  const [isChangingPage, setIsChangingPage] = useState(false);

  const {
    editingRowId,
    editedData,
    isEditing,
    startEdit,
    saveEdit,
    cancelEdit,
    updateEditedData,
  } = useInlineEdit();

  const { data: purchaseOrderResponse, isLoading, refetch, isRefetching } = usePurchaseOrderReport();
  const patchMutation = usePatchPurchaseOrderReport();
  const uploadMutation = useUploadPurchaseOrderFiles();
  const deleteMutation = useDeleteRunningReport();

  const rows = useMemo(
    () => (purchaseOrderResponse?.data ?? []) as PurchaseOrderData[],
    [purchaseOrderResponse],
  );
  const isAnyLoading = isLoading || isChangingPage || isRefetching;

  const handleDateChange = useCallback(
    (rowId: number, arrivalDate: string) => {
      if (!isEditing(rowId)) return;
      updateEditedData({ arrivalDate });
    },
    [isEditing, updateEditedData],
  );

  const handleSave = useCallback(async () => {
    if (editingRowId === null) return;

    setUpdatingRowId(editingRowId);
    setIsUpdatingDate(true);

    try {
      if (editedData) {
        await patchMutation.mutateAsync({
          rowId: editingRowId,
          arrivalDate: editedData.arrivalDate === "" ? null : editedData.arrivalDate,
        });
      }

      // userEmail is currently unused by the hook but kept for compatibility
      saveEdit("test@mail.com");
      toast.success("Record Updated Successfully!");
    } catch (error) {
      console.error("Failed to save data:", error);
      const message = error instanceof Error ? error.message : "Failed to save data";
      toast.error(message);
    } finally {
      setIsUpdatingDate(false);
      setUpdatingRowId(null);
    }
  }, [editingRowId, editedData, patchMutation, saveEdit]);

  const columns = useMemo((): GridColDef[] => {
    return generatePurchaseOrderColumns({
      isDark,
      editedData,
      isEditing,
      startEdit,
      saveEdit: handleSave,
      cancelEdit,
      onDateChange: handleDateChange,
      isUpdatingDate,
      updatingRowId,
    });
  }, [
    isDark,
    editedData,
    isEditing,
    startEdit,
    handleSave,
    cancelEdit,
    handleDateChange,
    isUpdatingDate,
    updatingRowId,
  ]);

  const arrivalDates = useMemo(
    () => rows.map((item) => item.arrival_date),
    [rows],
  );

  const isArrivalEmpty = useMemo(
    () => arrivalDates.every((v) => !isBlankValue(v)),
    [arrivalDates],
  );

  const emptyItemCount = useMemo(
    () => countBlankValues(arrivalDates),
    [arrivalDates],
  );

  const handleRefreshApi = useCallback(async () => {
    try {
      const result = await refetch();
      await refetchFlag();

      if (result.isSuccess) {
        toast.success("Data Refetched Successfully!");
      } else if (result.isError) {
        const message = result.error instanceof Error
          ? result.error.message
          : "Failed to refetch data. Please try again.";
        toast.error(message);
      }
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "An error occurred while refetching data.";
      toast.error(message);
      console.error("Refetch error:", error);
    }
  }, [refetch, refetchFlag]);

  const handleWarehouseChange = useCallback(
    (event: SelectChangeEvent<Warehouse>) => {
      setSelectedWarehouse(event.target.value as Warehouse);
    },
    [],
  );

  const handleLoadReportClick = useCallback(() => {
    if (sessionId === null) {
      toast.error("No upload session found. Please upload a file first.");
      return;
    }

    setLoadStatus("idle");
    setLoadProgress(1);
    setCurrentLoadStep(0);
    setLoadErrorMessage(undefined);
    setIsLoadReportDialogOpen(true);
  }, [sessionId]);

  // Show a brief loader when changing pages to provide feedback
  useEffect(() => {
    setIsChangingPage(true);
    const timer = setTimeout(() => {
      setIsChangingPage(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [paginationModel]);

  // Load progress animation for the load-report dialog
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loadStatus === "loading") {
      interval = setInterval(() => {
        setLoadProgress((prev) => {
          if (prev >= 99) return 99;

          const totalSteps = WAREHOUSE_OPTIONS.length + 1;
          const progressPerStep = 100 / totalSteps;
          const currentMilestone = (currentLoadStep + 1) * progressPerStep;

          if (prev < currentMilestone - 1) {
            const increment = Math.random() * 2 + 0.5;
            return Math.min(prev + increment, currentMilestone - 0.5, 99);
          }
          return prev;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [loadStatus, currentLoadStep]);

  const handleConfirmLoadReport = useCallback(async () => {
    if (sessionId === null) return;

    setLoadStatus("loading");
    setLoadErrorMessage(undefined);

    let currentTaskName = "Initial Report Generation";

    try {
      let step = currentLoadStep;

      if (step === 0) {
        await loadReportMutation.mutateAsync({ session_id: sessionId });
        try {
          await refetchFlag();
        } catch (error) {
          console.error(error);
        }

        step = 1;
        setCurrentLoadStep(1);
        setLoadProgress(20);
      }

      for (let i = step - 1; i < WAREHOUSE_OPTIONS.length; i++) {
        currentTaskName = `Report for ${WAREHOUSE_OPTIONS[i].label}`;
        await postProductionLoadReportMutation.mutateAsync({
          warehouse_region: WAREHOUSE_OPTIONS[i].value,
          session_id: sessionId,
        });

        const nextStep = i + 2;
        setCurrentLoadStep(nextStep);
        const progress = 20 + (i + 1) * 20;
        setLoadProgress(Math.min(progress, 99));
      }

      setLoadProgress(100);
      setLoadStatus("success");
    } catch (error) {
      setLoadStatus("error");
      const apiError = error instanceof Error ? error.message : "An unknown error occurred";
      setLoadErrorMessage(
        `${currentTaskName} failed: ${apiError}. Click Retry to continue the process.`,
      );
      console.error("Failed to load report:", error);
    }
  }, [
    sessionId,
    currentLoadStep,
    loadReportMutation,
    refetchFlag,
    postProductionLoadReportMutation,
  ]);

  const handleCancelLoadReport = useCallback(async () => {
    if (sessionId === null) return;
    try {
      await deleteMutation.mutateAsync({ session_id: sessionId });
      setIsLoadReportDialogOpen(false);
      toast.success("Report loading cancelled.");
    } catch (error) {
      toast.error("Failed to cancel report loading.");
      console.error("Cancel error:", error);
    }
  }, [sessionId, deleteMutation]);

  const handlePurchaseOrderUpload = useCallback(
    async (file: File) => {
      try {
        await uploadMutation.mutateAsync({ file });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to upload file";
        toast.error(message);
        throw error;
      }
    },
    [uploadMutation],
  );

  return {
    isDialogOpen,
    setIsDialogOpen,
    isLoadReportDialogOpen,
    setIsLoadReportDialogOpen,

    selectedWarehouse,
    handleWarehouseChange,

    sessionId,
    rows,
    columns,

    paginationModel,
    setPaginationModel: (value) => setPaginationModel(value),
    isChangingPage,

    isAnyLoading,
    isRefetching,
    isFlagsDisabled,
    isFlagsLoading,

    isArrivalEmpty,
    emptyItemCount,

    handleRefreshApi,
    handleLoadReportClick,
    handleConfirmLoadReport,
    handleCancelLoadReport,

    isUpdatingDate,
    updatingRowId,

    loadStatus,
    loadProgress,
    currentLoadStep,
    loadErrorMessage,
    loadReportMutationStatus: loadReportMutation.status,

    handlePurchaseOrderUpload,
  };
};

