import React, { createContext, useContext, useState, useCallback } from 'react';

export interface FileLogEntry {
  id: number;
  fileName: string;
  uploadedDate: string;
  uploadedBy: string;
  fileSize: string;
  fileSizeBytes: number;
  status: 'completed' | 'processing' | 'failed';
  fileType: string;
  stepNumber: number;
  file: File;
}

interface FileUploadContextType {
  fileLogs: FileLogEntry[];
  addFileLogs: (files: File[], stepNumber: number) => void;
  clearFileLogs: () => void;
  removeFileLog: (id: number) => void;
}

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

export const FileUploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fileLogs, setFileLogs] = useState<FileLogEntry[]>([]);

  const getFileExtension = (fileName: string): string => {
    return fileName.split('.').pop()?.toLowerCase() || 'unknown';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getCurrentUser = (): string => {
    // Use secure sessionStorage instead of localStorage for user data
    // In production, this should come from a secure JWT token or API call
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      if (!userEmail) {
        // Return a generic identifier if no user is logged in
        const authToken = sessionStorage.getItem('auth_token');
        return authToken ? 'authenticated_user' : 'guest_user';
      }
      return userEmail;
    } catch {
      return 'guest_user';
    }
  };

  const addFileLogs = useCallback((files: File[], stepNumber: number) => {
    const newLogs = files.map((file, index) => ({
      id: Date.now() + index,
      fileName: file.name,
      uploadedDate: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
      uploadedBy: getCurrentUser(),
      fileSize: formatFileSize(file.size),
      fileSizeBytes: file.size,
      status: 'processing' as const,
      fileType: getFileExtension(file.name),
      stepNumber,
      file,
    }));

    setFileLogs((prevLogs) => {
      // Check for duplicates and update status if already exists
      const updatedLogs = [...prevLogs];
      
      newLogs.forEach((newLog) => {
        const existingIndex = updatedLogs.findIndex(
          (log) => log.fileName === newLog.fileName && log.stepNumber === newLog.stepNumber
        );
        
        if (existingIndex === -1) {
          updatedLogs.push(newLog);
        } else {
          // Update status to completed after a delay
          setTimeout(() => {
            setFileLogs((logs) =>
              logs.map((log) =>
                log.id === newLog.id ? { ...log, status: 'completed' as const } : log
              )
            );
          }, 2000);
        }
      });

      return updatedLogs;
    });
  }, []);

  const clearFileLogs = useCallback(() => {
    setFileLogs([]);
  }, []);

  const removeFileLog = useCallback((id: number) => {
    setFileLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
  }, []);

  const value: FileUploadContextType = {
    fileLogs,
    addFileLogs,
    clearFileLogs,
    removeFileLog,
  };

  return (
    <FileUploadContext.Provider value={value}>
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUploadLogs = (): FileUploadContextType => {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error('useFileUploadLogs must be used within FileUploadProvider');
  }
  return context;
};
