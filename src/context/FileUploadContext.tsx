import React, { useState, useCallback } from 'react';

import { FileUploadContext, type FileLogEntry, type FileUploadContextType } from './fileUploadContextValue';

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
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      if (!userEmail) {
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
        const text = await file.text();
        const lines = text.trim().split('\n');
        return Math.max(0, lines.length - 1);
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        const arrayBuffer = await file.arrayBuffer();
        const XLSX = await import('xlsx');
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (worksheet['!ref']) {
          const range = XLSX.utils.decode_range(worksheet['!ref']);
          return Math.max(0, range.e.r);
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
          const existingIndex = updatedLogs.findIndex(
            (log) => log.fileName === newLog.fileName && log.stepNumber === newLog.stepNumber
          );

          if (existingIndex === -1) {
            updatedLogs.push(newLog);
          } else {
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
