import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowRightIcon, CheckCircleIcon } from '../../icons';
import Button from '../../components/ui/button/Button';
import { UploadZone } from '../../components/FileUpload/UploadZone';
import { FILE_ACCEPT_TYPES, STEP_CONFIG } from '../../constants/fileUpload';
import { FileUploadStepProps } from '../../types/Interfaces/interfaces';



export const FileUploadStep: React.FC<FileUploadStepProps> = ({
  stepNumber,
  file,
  isUploading,
  previousFile,
  formatFileSize,
  onUpload,
  onRemove,
  onNext,
  onBack,
  onComplete,
  showBackButton = false,
  showNextButton = true,
  isLastStep = false,
}) => {
  const stepConfig = STEP_CONFIG[stepNumber];

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const filesToUpload = stepConfig.multiple ? acceptedFiles : [acceptedFiles[0]];
        onUpload(filesToUpload);
      }
    },
    [onUpload, stepConfig.multiple]
  );

  const isPreviousStepComplete = stepNumber === 1 || (previousFile?.status === 'completed');
  const isDisabled = isUploading || !!file || !isPreviousStepComplete;

  const dropzone = useDropzone({
    onDrop,
    accept: FILE_ACCEPT_TYPES,
    multiple: stepConfig.multiple,
    noClick: isDisabled,
    noKeyboard: isDisabled,
  });

  const isCurrentStepComplete = file?.status === 'completed';
  const nextButtonLabel =
    isLastStep && isUploading ? 'Validating Files' : stepConfig.nextButtonText;

  return (
    <div className="space-y-2">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {stepConfig.title}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {stepConfig.description}
        </p>
      </div>

      <UploadZone
        dropzone={dropzone}
        file={file}
        onRemove={onRemove}
        isDisabled={isDisabled}
        formatFileSize={formatFileSize}
      />

      <div className="flex justify-between mt-2">
        {showBackButton && (
          <Button onClick={onBack} size="sm" variant="outline">
            Back
          </Button>
        )}

        {!showBackButton && <div />}

        {isCurrentStepComplete && showNextButton && (
          <Button
            onClick={isLastStep ? onComplete : onNext}
            size="sm"
            className="flex items-center gap-2"
          >
            {nextButtonLabel}
            {isLastStep ? (
              isUploading ? (
                <span className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircleIcon className="w-4 h-4" />
              )
            ) : (
              <ArrowRightIcon className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
