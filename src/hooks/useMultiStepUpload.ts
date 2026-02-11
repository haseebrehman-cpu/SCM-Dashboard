import { useState, useCallback } from 'react';
import { UploadedFile } from '../components/FileUpload/types';
import { REQUIRED_FILES_COUNT, StepNumber } from '../constants/fileUpload';
import toast from 'react-hot-toast';
import { useFileUploadLogs } from './useFileUploadLogs';

interface UseMultiStepUploadReturn {
  currentStep: StepNumber;
  canProceedToNextStep: (step: StepNumber, file: UploadedFile | null) => boolean;
  handleNext: (step: StepNumber, file: UploadedFile | null) => void;
  handleBack: () => void;
  handleComplete: (file1: UploadedFile | null, file2: UploadedFile | null, file3: UploadedFile | null, resetCallback: () => void) => void;
  isStepComplete: (file: UploadedFile | null) => boolean;
}

export const useMultiStepUpload = (): UseMultiStepUploadReturn => {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const { addFileLogs } = useFileUploadLogs();

  const isStepComplete = useCallback((file: UploadedFile | null): boolean => {
    return file !== null && file.status === 'completed';
  }, []);

  const validateFileCount = useCallback((file: UploadedFile | null): boolean => {
    if (!file || !file.files) return false;
    
    if (file.files.length !== REQUIRED_FILES_COUNT) {
      toast.error(`All ${REQUIRED_FILES_COUNT} Files are required to proceed further`);
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
    resetCallback: () => void
  ) => {
    // Add logs for all uploaded files
    if (file1?.files) {
      addFileLogs(file1.files, 1);
    }
    if (file2?.files) {
      addFileLogs(file2.files, 2);
    }
    if (file3?.files) {
      addFileLogs(file3.files, 3);
    }

    toast.success('Files uploaded successfully');

    // Reset all state
    resetCallback();
    setCurrentStep(1);
  }, [addFileLogs]);

  return {
    currentStep,
    canProceedToNextStep,
    handleNext,
    handleBack,
    handleComplete,
    isStepComplete,
  };
};
