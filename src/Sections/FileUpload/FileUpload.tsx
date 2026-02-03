import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CheckCircleIcon, ArrowRightIcon, FileIcon, TrashBinIcon } from '../../icons';
import Button from '../../components/ui/button/Button';

interface UploadedFile {
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const FileUpload: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [file1, setFile1] = useState<UploadedFile | null>(null);
  const [file2, setFile2] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const simulateUpload = useCallback((file: File, setFileState: (file: UploadedFile | null) => void) => {
    setIsUploading(true);
    const preview = URL.createObjectURL(file);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFileState({
        file,
        preview,
        progress,
        status: progress < 100 ? 'uploading' : 'completed'
      });

      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
      }
    }, 200);
  }, []);

  const onDropStep1 = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      simulateUpload(file, setFile1);
    }
  }, [simulateUpload]);

  const onDropStep2 = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      simulateUpload(file, setFile2);
    }
  }, [simulateUpload]);

  const dropzone1 = useDropzone({
    onDrop: onDropStep1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: false,
    noClick: isUploading || !!file1,
    noKeyboard: isUploading || !!file1,
  });

  const dropzone2 = useDropzone({
    onDrop: onDropStep2,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: false,
    noClick: isUploading || !!file2 || !file1 || file1.status !== 'completed',
    noKeyboard: isUploading || !!file2 || !file1 || file1.status !== 'completed',
  });

  const handleRemoveFile1 = () => {
    if (file1?.preview) {
      URL.revokeObjectURL(file1.preview);
    }
    setFile1(null);
  };

  const handleRemoveFile2 = () => {
    if (file2?.preview) {
      URL.revokeObjectURL(file2.preview);
    }
    setFile2(null);
  };

  const handleNext = () => {
    if (file1 && file1.status === 'completed') {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleComplete = () => {
    // Handle completion logic here
    console.log('Files uploaded:', { file1, file2 });
    // You can add API call here
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        {/* Step 1 */}
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
              currentStep >= 1
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            {file1 && file1.status === 'completed' ? (
              <CheckCircleIcon className="w-6 h-6" />
            ) : (
              <span className="text-sm font-semibold">1</span>
            )}
          </div>
          <div className={`ml-3 ${currentStep >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
            <p className="text-sm font-medium">First File</p>
            {file1 && file1.status === 'completed' && (
              <p className="text-xs text-green-600 dark:text-green-400">Uploaded</p>
            )}
          </div>
        </div>

        {/* Connector */}
        <div className={`w-24 h-0.5 mx-4 transition-all duration-300 ${
          file1 && file1.status === 'completed' ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-700'
        }`} />

        {/* Step 2 */}
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
              currentStep >= 2 && file1?.status === 'completed'
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            {file2 && file2.status === 'completed' ? (
              <CheckCircleIcon className="w-6 h-6" />
            ) : (
              <span className="text-sm font-semibold">2</span>
            )}
          </div>
          <div className={`ml-3 ${currentStep >= 2 && file1?.status === 'completed' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
            <p className="text-sm font-medium">Second File</p>
            {file2 && file2.status === 'completed' && (
              <p className="text-xs text-green-600 dark:text-green-400">Uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDropzone = (
    dropzone: ReturnType<typeof useDropzone>,
    file: UploadedFile | null,
    onRemove: () => void,
    stepNumber: number,
    isDisabled: boolean
  ) => {
    if (file && file.status === 'completed') {
      return (
        <div className="relative p-6 bg-white dark:bg-gray-800 border-2 border-green-500 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-green-100 dark:bg-green-900/30">
                <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {file.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatFileSize(file.file.size)}
                </p>
              </div>
            </div>
            <button
              onClick={onRemove}
              className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove file"
            >
              <TrashBinIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    }

    if (file && file.status === 'uploading') {
      return (
        <div className="relative p-6 bg-white dark:bg-gray-800 border-2 border-brand-500 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-brand-100 dark:bg-brand-900/30">
              <FileIcon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {file.file.name}
              </p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Uploading... {file.progress}%
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        {...dropzone.getRootProps()}
        className={`relative p-12 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
          dropzone.isDragActive
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 scale-105'
            : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-brand-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...dropzone.getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <div className={`mb-6 flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${
            dropzone.isDragActive
              ? 'bg-brand-500 text-white scale-110'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}>
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {dropzone.isDragActive ? 'Drop your file here' : `Upload File ${stepNumber}`}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md">
            Drag and drop your file here, or click to browse
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Supported formats: PDF, Excel (.xlsx, .xls), CSV
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            File Upload
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Upload your files in two simple steps
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          {/* Step 1 Content */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Step 1: Upload First File
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please upload your first file to continue
                </p>
              </div>
              {renderDropzone(dropzone1, file1, handleRemoveFile1, 1, isUploading || !!file1)}
              
              {file1 && file1.status === 'completed' && (
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleNext}
                    size="md"
                    className="flex items-center gap-2"
                  >
                    Continue to Step 2
                    <ArrowRightIcon className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2 Content */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Step 2: Upload Second File
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Please upload your second file to complete the process
                </p>
              </div>
              {renderDropzone(dropzone2, file2, handleRemoveFile2, 2, isUploading || !!file2 || !file1 || file1.status !== 'completed')}
              
              <div className="flex justify-between mt-6">
                <Button
                  onClick={handleBack}
                  size="md"
                  variant="outline"
                >
                  Back
                </Button>
                {file2 && file2.status === 'completed' && (
                  <Button
                    onClick={handleComplete}
                    size="md"
                    className="flex items-center gap-2"
                  >
                    Complete Upload
                    <CheckCircleIcon className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Summary (when both files are uploaded) */}
        {file1 && file1.status === 'completed' && file2 && file2.status === 'completed' && (
          <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                  Both files uploaded successfully!
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
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
