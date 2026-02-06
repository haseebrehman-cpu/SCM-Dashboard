import toast from 'react-hot-toast';
import { logger } from './logger';

export interface FileUploadOptions {
  stepNumber: number;
  onProgress?: (progress: number) => void;
  abortSignal?: AbortSignal;
}

export interface FileUploadResult {
  id: string;
  fileName: string;
  url: string;
  size: number;
  uploadedAt: string;
}

/**
 * File Upload Service
 * Handles file uploads with validation and error handling
 */
export const fileUploadService = {
  /**
   * Upload a single file with validation
   */
  async uploadFile(
    file: File,
    options: FileUploadOptions
  ): Promise<FileUploadResult> {
    logger.debug('Starting file upload', { fileName: file.name });

    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > 100 * 1024 * 1024) {
      throw new Error('File size exceeds 100MB limit');
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `File type not allowed. Allowed types: PDF, XLS, XLSX, CSV`
      );
    }

    // Validate warehouse code
    const fileNameParts = file.name.split('_');
    const warehousePrefix = fileNameParts[0]?.toUpperCase();
    if (!['UK', 'US', 'DE', 'CA'].includes(warehousePrefix || '')) {
      throw new Error(
        'File name must start with warehouse code (UK, US, DE, CA)'
      );
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('stepNumber', String(options.stepNumber));

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || '';
      const authToken = sessionStorage.getItem('auth_token');

      const response = await fetch(`${baseURL}/upload`, {
        method: 'POST',
        body: formData,
        signal: options.abortSignal,
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Upload failed: ${response.statusText}`
        );
      }

      const result = await response.json();
      logger.info('File uploaded successfully', { fileName: file.name });
      toast.success(`${file.name} uploaded successfully`);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      logger.error('File upload failed', error as Error, {
        fileName: file.name,
        stepNumber: options.stepNumber,
      });
      toast.error(message);
      throw error;
    }
  },

  /**
   * Upload multiple files sequentially
   */
  async uploadMultipleFiles(
    files: File[],
    options: Omit<FileUploadOptions, 'onProgress'>
  ): Promise<FileUploadResult[]> {
    const results: FileUploadResult[] = [];
    const total = files.length;

    logger.info('Starting multiple file upload', { count: total });

    for (let i = 0; i < files.length; i++) {

      try {
        const result = await this.uploadFile(files[i], {
          ...options,
          onProgress: (p) => {
            const overallProgress = Math.round(((i + p / 100) / total) * 100);
            logger.debug('Upload progress', { progress: overallProgress });
          },
        });
        results.push(result);
      } catch (error) {
        logger.error(
          `Failed to upload ${files[i].name}`,
          error as Error
        );
        // Continue with other files even if one fails
      }
    }

    logger.info('Multiple file upload completed', {
      successful: results.length,
      failed: total - results.length,
    });

    return results;
  },

  /**
   * Cancel an ongoing upload
   */
  cancelUpload(abortController: AbortController): void {
    abortController.abort();
    logger.info('Upload cancelled');
    toast.error('Upload cancelled');
  },
};
