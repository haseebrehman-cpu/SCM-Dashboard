import { GridColDef } from '@mui/x-data-grid';

/**
 * This file is kept for potential future use or backward compatibility.
 * Session-level columns are now generated directly in FileLogsGrid.tsx
 * File-level columns are generated in FileLogsDetailPanel.tsx
 */

// Helper function to format step type for display
export const formatStepType = (stepType: string): string => {
  return stepType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Kept for backward compatibility
export const generateSessionColumns = (): GridColDef[] => [];

export default {
  formatStepType,
  generateSessionColumns,
};
