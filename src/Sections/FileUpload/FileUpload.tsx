import React from "react";
import { CheckCircleIcon } from "../../icons";
import { StepIndicator } from "../../components/FileUpload/StepIndicator";
import { useFileUpload } from "../../hooks/useFileUpload";
import { FileUploadStep } from "./FileUploadStep";
import { useMultiStepUpload } from "../../hooks/useMultiStepUpload";
import ProcessModal from "./ProcessModal";
import Header from "./Header";

const FileUpload: React.FC = () => {

  const {
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
  } = useFileUpload();

  const {
    currentStep,
    handleNext,
    handleBack,
    handleComplete,
    showSuccessModal,
    closeSuccessModal,
    sessionId,
  } = useMultiStepUpload();

  const handleUploadStep1 = (files: File[]) => {
    registerFiles(files, setFile1, 1);
  };

  const handleUploadStep2 = (files: File[]) => {
    registerFiles(files, setFile2, 2);
  };

  const handleUploadStep3 = (files: File[]) => {
    registerFiles(files, setFile3, 3);
  };

  const handleRemoveFile1 = () => handleRemoveFile(file1, setFile1);
  const handleRemoveFile2 = () => handleRemoveFile(file2, setFile2);
  const handleRemoveFile3 = () => handleRemoveFile(file3, setFile3);

  const resetAllFiles = () => {
    setFile1(null);
    setFile2(null);
    setFile3(null);
  };

  const allFilesCompleted =
    file1?.status === "completed" &&
    file2?.status === "completed" &&
    file3?.status === "completed";

  return (
    <div className="flex items-center justify-center py-2 px-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <Header />

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          file1Status={file1?.status}
          file2Status={file2?.status}
          file3Status={file3?.status}
        />

        <ProcessModal
          showSuccessModal={showSuccessModal}
          closeSuccessModal={closeSuccessModal}
          sessionId={sessionId}
        />        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-3 md:p-4 border border-gray-200 dark:border-gray-700">
          {currentStep === 1 && (
            <FileUploadStep
              stepNumber={1}
              file={file1}
              isUploading={isUploading}
              previousFile={null}
              formatFileSize={formatFileSize}
              onUpload={handleUploadStep1}
              onRemove={handleRemoveFile1}
              onNext={() => handleNext(1, file1)}
              showBackButton={false}
            />
          )}

          {currentStep === 2 && (
            <FileUploadStep
              stepNumber={2}
              file={file2}
              isUploading={isUploading}
              previousFile={file1}
              formatFileSize={formatFileSize}
              onUpload={handleUploadStep2}
              onRemove={handleRemoveFile2}
              onNext={() => handleNext(2, file2)}
              onBack={handleBack}
              showBackButton={true}
            />
          )}

          {currentStep === 3 && (
            <FileUploadStep
              stepNumber={3}
              file={file3}
              isUploading={isUploading}
              previousFile={file2}
              formatFileSize={formatFileSize}
              onUpload={handleUploadStep3}
              onRemove={handleRemoveFile3}
              onComplete={() =>
                handleComplete(file1, file2, file3, resetAllFiles, setIsUploading)
              }
              onBack={handleBack}
              showBackButton={true}
              isLastStep={true}
            />
          )}
        </div>

        {/* Success Summary */}
        {allFilesCompleted && (
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
