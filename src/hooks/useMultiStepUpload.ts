import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { UploadedFile } from "../components/FileUpload/types";
import { REQUIRED_FILES_COUNT, StepNumber } from "../constants/fileUpload";
import { useFileUploadLogs } from "./useFileUploadLogs";
import { useUploadScmFiles } from "../api/scmFileUpload";
import { UseMultiStepUploadReturn, LatestUploadSessionResponse } from "../types/Interfaces/interfaces";
import { useLatestSessionId } from "./useLatestSessionId";

export const useMultiStepUpload = (): UseMultiStepUploadReturn => {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [isUploadSuccess, setIsUploadSuccess] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const latestSessionId = useLatestSessionId();
  const { addFileLogs } = useFileUploadLogs();
  const uploadMutation = useUploadScmFiles();

  // Use the latest session ID from files log grid
  const sessionId = latestSessionId;

  const isStepComplete = useCallback((file: UploadedFile | null): boolean => {
    return file !== null && file.status === "completed";
  }, []);

  const validateFileCount = useCallback((file: UploadedFile | null): boolean => {
    if (!file || !file.files) return false;

    if (file.files.length !== REQUIRED_FILES_COUNT) {
      toast.error(
        `All ${REQUIRED_FILES_COUNT} files are required to proceed further.`,
      );
      return false;
    }

    return true;
  }, []);

  const canProceedToNextStep = useCallback((step: StepNumber, file: UploadedFile | null): boolean => {
    return isStepComplete(file) && (step === 3 || validateFileCount(file));
  }, [isStepComplete, validateFileCount]);

  const handleNext = useCallback((step: StepNumber, file: UploadedFile | null) => {
    if (!isStepComplete(file)) return;

    // Step 3 doesn't require file count validation
    if (step !== 3 && !validateFileCount(file)) return;

    if (step === 1) {
      setCurrentStep(2);
    } else if (step === 2) {
      setCurrentStep(3);
    }
  }, [isStepComplete, validateFileCount]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev === 3) return 2;
      if (prev === 2) return 1;
      return prev;
    });
  }, []);

  const handleComplete = useCallback((
    file1: UploadedFile | null,
    file2: UploadedFile | null,
    file3: UploadedFile | null,
    resetCallback: () => void,
    setUploading: (value: boolean) => void,
  ) => {
    if (!file1?.files || !file2?.files || !file3?.files) {
      toast.error("Please upload files for all three steps before completing.");
      return;
    }

    setUploading(true);
    setIsUploadSuccess(false);

    uploadMutation.mutate(
      {
        last_60_days: file1.files,
        next_60_days_previous_year: file2.files,
        open_orders: file3.files,
      },
      {
        onSuccess: (data: LatestUploadSessionResponse) => {
          setIsUploadSuccess(true);
          setShowSuccessModal(true);
          // Session ID will be automatically updated from the files log grid
          toast.success(data.sessions?.[0]?.session?.message || "Files uploaded successfully.");

          if (file1.files) {
            addFileLogs(file1.files, 1);
          }
          if (file2.files) {
            addFileLogs(file2.files, 2);
          }
          if (file3.files) {
            addFileLogs(file3.files, 3);
          }

          resetCallback();
          setCurrentStep(1);
        },
        onError: (error) => {
          setIsUploadSuccess(false);
          setShowSuccessModal(false);
          toast.error(error.message || "Failed to upload files. Please try again.");
        },
        onSettled: () => {
          setUploading(false);
        },
      },
    );

  }, [addFileLogs, uploadMutation]);

  const closeSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
  }, []);

  return {
    currentStep,
    canProceedToNextStep,
    handleNext,
    handleBack,
    handleComplete,
    isStepComplete,
    isUploadSuccess,
    showSuccessModal,
    closeSuccessModal,
    sessionId,
  };
};
