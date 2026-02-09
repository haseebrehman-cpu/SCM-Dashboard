import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowRightIcon, CheckCircleIcon } from '../../icons';
import Button from '../../components/ui/button/Button';
import { showToast } from '../../utils/toastNotification';
import { StepIndicator } from '../../components/FileUpload/StepIndicator';
import { UploadZone } from '../../components/FileUpload/UploadZone';
import { useFileUpload } from '../../hooks/useFileUpload';
import { UploadedFile } from '../../components/FileUpload/types';
import { useFileUploadLogs } from '../../context/FileUploadContext';

const FileUpload: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const { file1, file2, file3, isUploading, setFile1, setFile2, setFile3, formatFileSize, simulateUpload, handleRemoveFile } =
    useFileUpload();
  const { addFileLogs } = useFileUploadLogs();

  const onDropStep1 = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        // Don't add logs yet - only upload files
        simulateUpload(acceptedFiles, setFile1, 1);
      }
    },
    [simulateUpload, setFile1],
  );

  const onDropStep2 = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        // Don't add logs yet - only upload files
        simulateUpload(acceptedFiles, setFile2, 2);
      }
    },
    [simulateUpload, setFile2],
  );

  const onDropStep3 = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        // Don't add logs yet - only upload files
        const file = acceptedFiles[0];
        simulateUpload([file], setFile3, 3);
      }
    },
    [simulateUpload, setFile3],
  );

  const dropzone1 = useDropzone({
    onDrop: onDropStep1,
    accept: {
      // 'application/pdf': ['.pdf'],
      // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      // 'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: true,
    noClick: isUploading || !!file1,
    noKeyboard: isUploading || !!file1,
  });

  const dropzone2 = useDropzone({
    onDrop: onDropStep2,
    accept: {
      // 'application/pdf': ['.pdf'],
      // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      // 'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: true,
    noClick: isUploading || !!file2 || !file1 || file1.status !== 'completed',
    noKeyboard: isUploading || !!file2 || !file1 || file1.status !== 'completed',
  });

  const dropzone3 = useDropzone({
    onDrop: onDropStep3,
    accept: {
      // 'application/pdf': ['.pdf'],
      // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      // 'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: false, // Only one file allowed in step 3
    noClick: isUploading || !!file3 || !file2 || file2.status !== 'completed',
    noKeyboard: isUploading || !!file3 || !file2 || file2.status !== 'completed',
  });

  const handleRemoveFile1 = () => handleRemoveFile(file1, setFile1);
  const handleRemoveFile2 = () => handleRemoveFile(file2, setFile2);
  const handleRemoveFile3 = () => handleRemoveFile(file3, setFile3);

  const handleNext = () => {
    if (currentStep === 1 && file1 && file1.status === 'completed') {
      if (file1.files.length !== 4) {
        showToast.error('All 4 Files are required to proceed further');
        return;
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 2 && file2 && file2.status === 'completed') {
      if (file2.files.length !== 4) {
        showToast.error('All 4 Files are required to proceed further');
        return;
      } else {
        setCurrentStep(3);
      }
    }
  };
  const handleBack = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleComplete = () => {
    if (file1?.files) {
      addFileLogs(file1.files, 1);
    }
    if (file2?.files) {
      addFileLogs(file2.files, 2);
    }
    if (file3?.files) {
      addFileLogs(file3.files, 3);
    }

    showToast.success('Files uploaded successfully');

    // Reset all uploads
    setFile1(null);
    setFile2(null); 
    setFile3(null);
    setCurrentStep(1);
  };


  const renderStepIndicator = () => (
    <StepIndicator currentStep={currentStep} file1Status={file1?.status} file2Status={file2?.status} file3Status={file3?.status} />
  );

  const renderDropzone = (
    dropzone: ReturnType<typeof useDropzone>,
    file: UploadedFile | null,
    onRemove: () => void,
    isDisabled: boolean
  ) => <UploadZone dropzone={dropzone} file={file} onRemove={onRemove} isDisabled={isDisabled} formatFileSize={formatFileSize} />;

  return (
    <div className="flex items-center justify-center py-2 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Linnworks Files Upload
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload your files in three simple steps
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-3 md:p-4 border border-gray-200 dark:border-gray-700">
          {/* Step 1 Content */}
          {currentStep === 1 && (
            <div className="space-y-2">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Step 1: Upload Last 60 days (According to current date) Files
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Please upload your last 60 days (According to current date) files to continue
                </p>
              </div>
              {renderDropzone(dropzone1, file1, handleRemoveFile1, isUploading || !!file1)}

              {file1 && file1.status === 'completed' && (
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    Continue to Step 2
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2 Content */}
          {currentStep === 2 && (
            <div className="space-y-2">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Step 2: Upload Next 60 days (Of Last Year according to current date) Files
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Please upload your next 60 days (Last Year) files to continue
                </p>
              </div>
              {renderDropzone(dropzone2, file2, handleRemoveFile2, isUploading || !!file2 || !file1 || file1.status !== 'completed')}

              <div className="flex justify-between mt-2">
                <Button
                  onClick={handleBack}
                  size="sm"
                  variant="outline"
                >
                  Back
                </Button>
                {file2 && file2.status === 'completed' && (
                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    Continue to Step 3
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-2">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Step 3: Upload Purchase Orders by Status and Date (status : open last 12 month file) Files
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Please upload your purchase orders by status and date (status : open last 12 month file) file to complete the process
                </p>
              </div>
              {renderDropzone(dropzone3, file3, handleRemoveFile3, isUploading || !!file3 || !file2 || file2.status !== 'completed')}

              <div className="flex justify-between mt-2">
                <Button
                  onClick={handleBack}
                  size="sm"
                  variant="outline"
                >
                  Back
                </Button>
                {file3 && file3.status === 'completed' && (
                  <Button
                    onClick={handleComplete}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    Complete Process
                    <CheckCircleIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Summary (when both files are uploaded) */}
        {file1 && file1.status === 'completed' && file2 && file2.status === 'completed' && file3 && file3.status === 'completed' && (
          <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs font-semibold text-green-900 dark:text-green-100">
                  All files uploaded successfully!
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                  You can now proceed with your workflow.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
