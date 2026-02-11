import { useContext } from 'react';
import { FileUploadContext, type FileUploadContextType } from '../context/fileUploadContextValue';

/**
 * Custom hook to access file upload logs context
 * Separated from context provider file to support Fast Refresh
 */
export const useFileUploadLogs = (): FileUploadContextType => {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error('useFileUploadLogs must be used within FileUploadProvider');
  }
  return context;
};
