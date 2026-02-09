import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { UploadedFile } from '../components/FileUpload/types';

/**
 * Validation functions (outside component to avoid re-creation and dependency issues)
 */
const validateWarehouseCode = (files: File[]): boolean => {
  const warehousePrefixes = ['UK_', 'US_', 'DE_', 'CA_'];
  const invalidFiles = files.filter(
    (file) => !warehousePrefixes.some((prefix) => file.name.toUpperCase().startsWith(prefix))
  );

  if (invalidFiles.length > 0) {
    const invalidNames = invalidFiles.map((f) => f.name).join(', ');
    const errorMsg = `File names must start with warehouse code (UK_, US_, DE_, CA_). Invalid: ${invalidNames}`;
    toast.error(errorMsg);
    return false;
  }
  return true;
};

const validateOpenOrderPrefix = (files: File[]): boolean => {
  const invalidFiles = files.filter(
    (file) => !file.name.toUpperCase().startsWith('OPEN ORDERS')
  );

  if (invalidFiles.length > 0) {
    const invalidNames = invalidFiles.map((f) => f.name).join(', ');
    const errorMsg = `File names must start with "Open Orders". Invalid: ${invalidNames}`;
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const simulateUpload = useCallback(
    (files: File[], setFileState: (file: UploadedFile | null) => void, step: 1 | 2 | 3 = 1) => {
      if (!validateFilesByStep(files, step)) {
        setIsUploading(false);
        return;
      }

      setIsUploading(true);
      const previews = files.map((file) => URL.createObjectURL(file));
      toast.success('Files uploaded successfully');

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFileState({
          files,
          previews,
          progress,
          status: progress < 100 ? 'uploading' : 'completed',
        });

        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
        }
      }, 200);
    },
    []
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
    simulateUpload,
    handleRemoveFile,
  };
};
