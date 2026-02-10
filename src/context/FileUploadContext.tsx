import React, { createContext, useContext, useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

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
  rowCount?: number;
}

interface FileUploadContextType {
  fileLogs: FileLogEntry[];
  addFileLogs: (files: File[], stepNumber: number) => void;
  clearFileLogs: () => void;
  removeFileLog: (id: number) => void;
  removeFileLogs: (ids: number[]) => void;
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

  const getRowCountFromFile = async (file: File): Promise<number> => {
    try {
      const fileType = getFileExtension(file.name);

      if (fileType === 'csv') {
        // For CSV files, count the lines (excluding header)
        const text = await file.text();
        const lines = text.trim().split('\n');
        return Math.max(0, lines.length - 1); // Subtract 1 for header row
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        // For Excel files, use XLSX library to parse the file
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Get the range and calculate row count
        // The !ref property contains the range like "A1:Z100"
        if (worksheet['!ref']) {
          const range = XLSX.utils.decode_range(worksheet['!ref']);
          // Subtract 1 for header row
          return Math.max(0, range.e.r); // e.r is the last row index (0-based)
        }
        return 0;
      }
      return 0;
    } catch (error) {
      console.error('Error counting rows:', error);
      return 0;
    }
  };

  const addFileLogs = useCallback((files: File[], stepNumber: number) => {
    // Create initial logs with processing status
    const createInitialLogs = async () => {
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substr(2, 9);

      const newLogs = await Promise.all(
        files.map(async (file, index) => {
          const rowCount = await getRowCountFromFile(file);
          return {
            id: parseInt(`${timestamp}${index}${randomSuffix.charCodeAt(0)}`),
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
            rowCount,
          };
        })
      );

      setFileLogs((prevLogs) => {
        const updatedLogs = [...prevLogs];

        newLogs.forEach((newLog) => {
          // Only add if the same file hasn't been added for this step
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
                  log.id === updatedLogs[existingIndex].id ? { ...log, status: 'completed' as const } : log
                )
              );
            }, 2000);
          }
        });

        return updatedLogs;
      });
    };

    createInitialLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFileLogs = useCallback(() => {
    setFileLogs([]);
  }, []);

  const removeFileLog = useCallback((id: number) => {
    setFileLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
  }, []);

  const removeFileLogs = useCallback((ids: number[]) => {
    setFileLogs((prevLogs) => prevLogs.filter((log) => !ids.includes(log.id)));
  }, []);

  const value: FileUploadContextType = {
    fileLogs,
    addFileLogs,
    clearFileLogs,
    removeFileLog,
    removeFileLogs,
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
