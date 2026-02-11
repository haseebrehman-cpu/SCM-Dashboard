import { useMemo, useCallback } from 'react';
import { useFileUploadLogs } from '../context/FileUploadContext';

export const useFileLogActions = () => {
  const { fileLogs, removeFileLogs } = useFileUploadLogs();

  const handleDelete = useCallback((id: number) => {
    const logToDelete = fileLogs.find(log => log.id === id);
    if (!logToDelete) return;

    // Find all logs with the same uploadedDate
    const logsToDelete = fileLogs.filter(log => log.uploadedDate === logToDelete.uploadedDate);
    const idsToDelete = logsToDelete.map(log => log.id);

    if (idsToDelete.length > 0) {
      if (window.confirm(`Are you sure you want to delete ${idsToDelete.length} files uploaded on ${logToDelete.uploadedDate}?`)) {
        removeFileLogs(idsToDelete);
      }
    }
  }, [fileLogs, removeFileLogs]);

  const deleteButtonIds = useMemo(() => {
    const ids = new Set<number>();
    const datesWithButton = new Set<string>();

    fileLogs.forEach((log) => {
      // Logic: Only show delete button for the first Step 1 file of each date group
      // This allows grouping deletion by date
      if (log.stepNumber === 1 && !datesWithButton.has(log.uploadedDate)) {
        ids.add(log.id);
        datesWithButton.add(log.uploadedDate);
      }
    });

    return ids;
  }, [fileLogs]);

  return {
    fileLogs,
    handleDelete,
    deleteButtonIds
  };
};
