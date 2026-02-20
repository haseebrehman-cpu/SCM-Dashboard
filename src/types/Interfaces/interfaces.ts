import { StepNumber } from "../../constants/fileUpload";

export interface FileInSession {
  filename: string;
  warehouse: string | null;
  row_count: number;
  column_count: number;
  status: string;
  upload_timestamp: string;
  message: string;
  uploaded_by: string;
}

export interface SessionInfo {
  id: number;
  datetime_folder: string;
  upload_timestamp: string;
  total_files: number;
  status: string;
  message: string;
  uploaded_by: string;
}

export interface SessionWithFiles {
  session: SessionInfo;
  files: {
    last_60_days: FileInSession[];
    next_60_days_previous_year: FileInSession[];
    open_orders: FileInSession[];
  };
}

export interface LatestUploadSessionResponse {
  success: boolean;
  total_sessions: number;
  sessions: SessionWithFiles[];
}

// Keep for backward compatibility
export interface OldLatestUploadSessionResponse {
  success: boolean;
  session: {
    id: number;
    datetime_folder: string;
    upload_timestamp: string;
    total_files: number;
    status: string;
    message: string;
    uploaded_by: string;
  };
  files: {
    filename: string;
    step_type: "last_60_days" | "next_60_days_previous_year" | "open_orders";
    warehouse: string | null;
    row_count: number;
    column_count: number;
    status: string;
    upload_timestamp: string;
    message: string;
    uploaded_by: string;
  }[];
}

export interface ScmUploadPayload {
  last_60_days: File[];
  next_60_days_previous_year: File[];
  open_orders: File[];
}

export interface ScmUploadSuccess {
  success: true;
  message: string;
  details?: unknown;
}

export interface ScmUploadError {
  success: false;
  message: string;
  details?: unknown;
}

export interface UploadedFile {
  files: File[];
  previews: string[];
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export interface UseMultiStepUploadReturn {
  currentStep: StepNumber;
  canProceedToNextStep: (step: StepNumber, file: UploadedFile | null) => boolean;
  handleNext: (step: StepNumber, file: UploadedFile | null) => void;
  handleBack: () => void;
  handleComplete: (
    file1: UploadedFile | null,
    file2: UploadedFile | null,
    file3: UploadedFile | null,
    resetCallback: () => void,
    setUploading: (value: boolean) => void,
  ) => void;
  isStepComplete: (file: UploadedFile | null) => boolean;
}

export interface UseMultiStepUploadReturn {
  currentStep: StepNumber;
  canProceedToNextStep: (step: StepNumber, file: UploadedFile | null) => boolean;
  handleNext: (step: StepNumber, file: UploadedFile | null) => void;
  handleBack: () => void;
  handleComplete: (
    file1: UploadedFile | null,
    file2: UploadedFile | null,
    file3: UploadedFile | null,
    resetCallback: () => void,
    setUploading: (value: boolean) => void,
  ) => void;
  isStepComplete: (file: UploadedFile | null) => boolean;
}

export interface ApiFileLogRow {
  id: number;
  fileName: string;
  stepType?: string;
  stepNumber?: number;
  warehouse: string;
  rowCount?: number;
  columnCount?: number;
  status: string;
  uploadedDate: string;
  uploadedBy: string;
  sessionId?: number;
}

export interface FileUploadStepProps {
  stepNumber: StepNumber;
  file: UploadedFile | null;
  isUploading: boolean;
  previousFile: UploadedFile | null;
  formatFileSize: (bytes: number) => string;
  onUpload: (files: File[]) => void;
  onRemove: () => void;
  onNext?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
  showBackButton?: boolean;
  showNextButton?: boolean;
  isLastStep?: boolean;
}