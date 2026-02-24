import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { UploadedFile } from '../components/FileUpload/types';
import { useUploadTodayCheck } from './useUploadTodayCheck';

/**
 * Validation functions (outside component to avoid re-creation and dependency issues)
 */
const validateWarehouseCode = (files: File[]): boolean => {
  const warehousePrefixes = ["US_", "DE_", "UK_", "CA_"];
  const invalidFiles = files.filter(
    (file) =>
      !warehousePrefixes.some((prefix) =>
        file.name.toUpperCase().startsWith(prefix),
      ),
  );

  if (invalidFiles.length > 0) {
    const invalidNames = invalidFiles.map((f) => f.name).join(", ");
    const errorMsg = `File names must start with warehouse region code (US_, DE_, UK_, CA_). Invalid: ${invalidNames}`;
    toast.error(errorMsg);
    return false;
  }
  return true;
};

const validateOpenOrderPrefix = (files: File[]): boolean => {
  const invalidFiles = files.filter((file) => {
    const name = file.name.toLowerCase();
    return !(
      name.startsWith("open_order") ||
      name.startsWith("open_orders")
    );
  });

  if (invalidFiles.length > 0) {
    const invalidNames = invalidFiles.map((f) => f.name).join(", ");
    const errorMsg =
      'Open orders file must start with "open_order" or "open_orders". Invalid: ' +
      invalidNames;
    toast.error(errorMsg);
    return false;
  }
  return true;
};

const validateFilesByStep = (files: File[], step: 1 | 2 | 3): boolean => {
  if (step === 1 || step === 2) {
    return validateWarehouseCode(files);
  } else if (step === 3) {
    return validateOpenOrderPrefix(files);
  }
  return true;
};

/**
 * useFileUpload Hook
 * Single Responsibility: Handles file upload logic, validation, and state management
 */
export const useFileUpload = () => {
  const [file1, setFile1] = useState<UploadedFile | null>(null);
  const [file2, setFile2] = useState<UploadedFile | null>(null);
  const [file3, setFile3] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Check if an upload has already been made today
  const { uploadedToday, errorMessage: todayUploadErrorMessage } = useUploadTodayCheck();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const registerFiles = useCallback(
    (
      files: File[],
      setFileState: (file: UploadedFile | null) => void,
      step: 1 | 2 | 3 = 1,
    ) => {
      // Check if an upload has already been made today
      if (uploadedToday) {
        toast.error(todayUploadErrorMessage || 'An upload has already been made today. Please delete the existing entry before uploading again.');
        return;
      }

      if (!validateFilesByStep(files, step)) {
        return;
      }

      const previews = files.map((file) => URL.createObjectURL(file));

      setFileState({
        files,
        previews,
        progress: 100,
        status: "completed",
      });

      toast.success("Files validated successfully");
    },
    [uploadedToday, todayUploadErrorMessage],
  );

  const handleRemoveFile = (file: UploadedFile | null, setFileState: (file: UploadedFile | null) => void) => {
    if (file?.previews) {
      file.previews.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    }
    setFileState(null);
  };

  return {
    file1,
    file2,
    file3,
    isUploading,
    setFile1,
    setFile2,
    setFile3,
    setIsUploading,
    formatFileSize,
    registerFiles,
    handleRemoveFile,
    uploadedToday,
    todayUploadErrorMessage,
  };
};
