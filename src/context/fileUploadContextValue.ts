import { createContext } from 'react';

export interface FileLogEntry {
  id: number;
  fileName: string;
  warehouse: string;
  uploadedDate: string;
  uploadedBy: string;
  fileSize: string;
  fileSizeBytes: number;
  status: 'completed' | 'processing' | 'failed';
  fileType: string;
  stepNumber: number;
  file: File;
  rowCount?: number;
  columnCount : number
}

export interface FileUploadContextType {
  fileLogs: FileLogEntry[];
  addFileLogs: (files: File[], stepNumber: number) => void;
  clearFileLogs: () => void;
  removeFileLog: (id: number) => void;
  removeFileLogs: (ids: number[]) => void;
}

export const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);
