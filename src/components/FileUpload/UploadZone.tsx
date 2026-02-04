import React from 'react';
import { CheckCircleIcon, FileIcon, TrashBinIcon } from '../../icons';
import { UploadedFile } from './types';

interface UploadZoneProps {
  dropzone: any;
  file: UploadedFile | null;
  onRemove: () => void;
  isDisabled: boolean;
  formatFileSize: (bytes: number) => string;
}

/**
 * UploadZone Component
 * Single Responsibility: Handles the dropzone UI and file display
 */
export const UploadZone: React.FC<UploadZoneProps> = ({
  dropzone,
  file,
  onRemove,
  isDisabled,
  formatFileSize,
}) => {
  // Completed state
  if (file && file.status === 'completed') {
    return (
      <div className="relative p-6 bg-white dark:bg-gray-800 border-2 border-green-500 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-green-100 dark:bg-green-900/30">
              <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {file.files.length === 1 ? '1 file uploaded' : `${file.files.length} files uploaded`}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Total size: {formatFileSize(file.files.reduce((total, f) => total + f.size, 0))}
              </p>
              <ul className="mt-2 space-y-1 max-h-32 overflow-auto pr-1">
                {file.files.map((f, idx) => (
                  <li key={`${f.name}-${f.lastModified}-${idx}`} className="text-xs text-gray-600 dark:text-gray-300 truncate">
                    {f.name} ({formatFileSize(f.size)})
                  </li>
                ))}
              </ul>
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

  // Uploading state
  if (file && file.status === 'uploading') {
    return (
      <div className="relative p-6 bg-white dark:bg-gray-800 border-2 border-brand-500 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-brand-100 dark:bg-brand-900/30">
            <FileIcon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Uploading {file.files.length === 1 ? '1 file' : `${file.files.length} files`}...
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Uploading... {file.progress}%</p>
              <ul className="mt-2 space-y-1 max-h-24 overflow-auto pr-1">
                {file.files.map((f, idx) => (
                  <li key={`${f.name}-${f.lastModified}-${idx}`} className="text-xs text-gray-600 dark:text-gray-300 truncate">
                    {f.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  return (
    <div
      {...dropzone.getRootProps()}
      className={`relative p-6 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
        dropzone.isDragActive
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 scale-105'
          : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-brand-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...dropzone.getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center">
        <div
          className={`mb-3 flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
            dropzone.isDragActive
              ? 'bg-brand-500 text-white scale-110'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
          {dropzone.isDragActive ? 'Drop your file here' : 'Upload Files'}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 max-w-md">
          Drag and drop your file here, or click to browse
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">PDF, Excel (.xlsx, .xls), CSV</p>
      </div>
    </div>
  );
};
