import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Modal } from '../../components/ui/modal';
import Button from '../../components/ui/button/Button';
import { UploadZone } from '../../components/FileUpload/UploadZone';
import { UploadedFile } from '../../components/FileUpload/types';
import { showToast } from '../../utils/toastNotification';
import { CheckCircleIcon } from '../../icons';
import IosShareIcon from '@mui/icons-material/IosShare';
interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (file: File) => void;
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const simulateUpload = useCallback(
    (files: File[]) => {
      setIsUploading(true);
      const previews = files.map((file) => URL.createObjectURL(file));
      // showToast.success('File upload started...');

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFile({
          files,
          previews,
          progress,
          status: progress < 100 ? 'uploading' : 'completed',
        });

        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          showToast.success('File uploaded successfully');
        }
      }, 150);
    },
    []
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        simulateUpload(acceptedFiles);
      }
    },
    [simulateUpload]
  );

  const handleRemoveFile = () => {
    if (file?.previews) {
      file.previews.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    }
    setFile(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading || (file?.status === 'completed'),
  });

  const handleClose = () => {
    handleRemoveFile();
    onClose();
  };

  const handleConfirmUpload = () => {
    if (file && file.files.length > 0) {
      if (onUpload) {
        onUpload(file.files[0]);
      }
      handleClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col  max-w-xl w-[600px] mx-auto p-10">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Upload Production Report
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Please upload your production report file (CSV)
          </p>
        </div>

        <div className="mb-6">
          <UploadZone
            dropzone={{ getRootProps, getInputProps, isDragActive }}
            file={file}
            onRemove={handleRemoveFile}
            isDisabled={isUploading || (file?.status === 'completed')}
            formatFileSize={formatFileSize}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmUpload}
            disabled={!file || file.status !== 'completed' || isUploading}
            startIcon={file?.status === 'completed' ? <CheckCircleIcon className="w-4 h-4" /> : <IosShareIcon sx={{ fontSize: '14px' }} />}
          >
            {file?.status === 'completed' ? 'Confirm Upload' : 'Upload'}
          </Button>
        </div>
      </div>
    </Modal >
  );
};
