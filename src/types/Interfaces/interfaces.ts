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

export interface PurchaseOrderData {
  id: number;
  container_name: string;
  reference_container: string;
  container_number: string;
  container_region: string;
  departure_date: string;
  arrival_date: string | null;
  delivery_status: string | null;
  modified_by: string;
  upload_date: string
}

export interface LatestUploadSessionResponse {
  success: boolean;
  total_sessions: number;
  sessions: SessionWithFiles[];
}

export interface PurchaseOrderReportResponse {
  success: boolean;
  message: string;
  total_records: number;
  data: PurchaseOrderData[]
}

export interface PurchaseOrderBulkUpdateDetailRow {
  container_name: string | null;
  reference_container: string | null;
  container_region: string | null;
  arrival_date: string | null;
  status: "updated" | "not_found" | "skipped";
  rows_affected?: number;
  reason?: string;
}

export interface PurchaseOrderBulkUpdateSuccessResponse {
  success: true;
  message: string;
  summary?: Record<string, unknown>;
  total_csv_rows: number;
  updated: number;
  not_found: number;
  skipped: number;
  details: PurchaseOrderBulkUpdateDetailRow[];
}

export interface PurchaseOrderBulkUpdateErrorResponse {
  success: false;
  message: string;
  expected_columns?: string[];
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
  status: "uploading" | "completed" | "error";
}

export interface UseMultiStepUploadReturn {
  currentStep: StepNumber;
  canProceedToNextStep: (
    step: StepNumber,
    file: UploadedFile | null,
  ) => boolean;
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
  isUploadSuccess: boolean;
  showSuccessModal: boolean;
  closeSuccessModal: () => void;
  sessionId: number | null;
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
