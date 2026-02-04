/**
 * Shared types for FileUpload components
 */

export interface UploadedFile {
  files: File[];
  previews: string[];
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}
