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
  process_data: boolean;
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

export interface TopSellingItemsData {
  item_number: string;
  total_sold: number;
}

export interface TopSellingItemsResponse {
  success: boolean;
  chart: string;
  total_records: number;
  data: TopSellingItemsData[];
}

export interface RegionalSummaryItem {
  category_name: string;
  warehouse_code: string;
  total_available: number;
  sold_last_60_days: number;
}

export interface RegionalSummaryResponse {
  success: boolean;
  chart: "regional_summary";
  total_records: number;
  data: RegionalSummaryItem[];
}

export interface CategoryDistributionItem {
  item_number: string;
  warehouse_count: number;
  total_available: number;
  total_sold_quantity: number;
}

export interface CategoryDistributionResponse {
  success: boolean;
  chart: "category_distribution";
  total_records: number;
  data: CategoryDistributionItem[];
}

export interface StockKpisData {
  total_stock: number;
  total_sold: number;
  abandoned_items_count: number;
  sku_count: number;
}

export interface StockKpisResponse {
  success: boolean;
  chart: "kpis";
  data: StockKpisData;
}

export interface ContainerKpisData {
  total_containers: number;
  intransit_containers: number;
  delivered_containers: number;
  total_intransit_quantity: number;
}

export interface ContainerKpisResponse {
  success: boolean;
  chart: "kpis";
  data: ContainerKpisData;
}

export interface InTransitVolumeData {
  container_name: string;
  category_name: string;
  container_region: string;
  total_intransit_quantity: number;
}

export interface InTransitVolumeResponse {
  success: boolean;
  chart: string;
  total_records: number;
  data: InTransitVolumeData[];
}

export interface FilterOptionsResponse {
  success: boolean;
  table: string;
  filter_options: {
    category: string[];
    item_number: string[];
    warehouse: string[];
    container_name?: string[];
    sku?: string[];
  };
  active_filters: Record<string, string[]>;
  message: string
}

// Stock report API response (table=stock)
export interface StockReportApiRow {
  id: number;
  warehouse_code: string;
  category_name: string;
  item_number: string;
  item_title: string;
  sold_quantity: number;
  available: number;
  upload_date: string;
}

export interface StockReportApiResponse {
  success: boolean;
  table: string;
  message: string;
  pagination: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  data: StockReportApiRow[];
}

export interface CancelRunningReportResponse {
  success: boolean;
  message: string
}

// Container report API response (table=container)
export interface ContainerReportApiRow {
  id: number;
  warehouse_code: string | null;
  category_name: string;
  item_number: string;
  container_name: string;
  intransit_quantity: number;
  container_region: string;
  container_number: number;
  departure_date: string;
  arrival_date: string;
  left_days: number;
  upload_date: string;
}

export interface ContainerReportApiResponse {
  success: boolean;
  table: string;
  message: string;
  pagination: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  data: ContainerReportApiRow[];
}

// Combined report API response (table=combined)
// Note: API does not return id; rows are identified by index
export interface CombinedReportApiRow {
  upload_date: string;
  category_name: string;
  item_number: string;
  item_title: string;
  [key: string]: string | number | unknown;
}

export interface CombinedReportApiResponse {
  success: boolean;
  table: string;
  message: string;
  pagination: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  data: CombinedReportApiRow[];
  container_report?: boolean;
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
  uploadedToday: boolean;
  todayUploadErrorMessage: string | null;
  restrictDailyUpload: boolean;
  setRestrictDailyUpload: (value: boolean) => void;
}
export interface ProductionRemainingRow {
  id?: number;
  warehouse_region: string;
  category_name: string;
  item_number: string;
  item_number_old: string | null;
  item_title: string;
  [key: string]: string | number | null | undefined;
}

export interface ProductionRemainingApiResponse {
  success: boolean;
  warehouse_region: string;
  table: string;
  total_records: number;
  message: string;
  data: ProductionRemainingRow[];
  production_remaining_report?: boolean;
}

export interface ProductionRemainingLoadResponse {
  success: boolean;
  message: string;
  details?: {
    session_id: number;
    csv_suffix: string;
    row_counts: Record<string, number>;
    saved_files: string[];
    saved_tables: string[];
  };
}


export interface ProductionRemainingUploadFileResponse {
  success: boolean;
  message: string;
  summary?: {
    input_rows: number;
    bad_rows: number;
    forecast_columns: string[];
    invalid_cells: number;
    duplicates_removed: number;
    upsert_cells: number;
    failed_cells: number;
    updated_by: string | null;
  };
}