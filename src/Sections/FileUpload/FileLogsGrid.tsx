import { useMemo } from 'react';
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { useTheme } from '../../hooks/useTheme';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { generateFileLogColumns } from '../../utils/columnGenerators/fileUploadLogs';
import { useFileLogActions } from '../../hooks/useFileLogActions';
import React from 'react';

/**
 * FileLogsGrid Component
 * Displays a history of file uploads with bulk-deletion by date functionality.
 * Refactored to follow SRP by separating logic into custom hooks and column generators.
 */
const FileLogsGrid: React.FC = React.memo(() => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    fileLogs,
    handleDelete,
    deleteButtonIds
  } = useFileLogActions();

  const columns = useMemo(
    () => generateFileLogColumns({ handleDelete, deleteButtonIds }),
    [handleDelete, deleteButtonIds]
  );


  return (
    <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-x-auto">
      <DataGridPremium
        label='File Upload Logs'
        rows={fileLogs}
        columns={columns}
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        pagination
        rowBufferPx={100}
        disableRowSelectionOnClick
        sx={getDataGridStyles(isDark)}
        showToolbar
      />
    </div>
  );
});


export default FileLogsGrid;