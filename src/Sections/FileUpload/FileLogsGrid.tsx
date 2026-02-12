import { useMemo } from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useTheme } from '../../hooks/useTheme';
import { DataGridHeader } from '../../components/DataGrid/DataGridHeader';
import { Button } from '@mui/material';
import { exportToCsv } from '../../utils/exportToCsv';
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

  const handleExport = () => {
    exportToCsv(
      fileLogs,
      `File-Upload-Logs-${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  return (
    <div className="w-full max-w-full overflow-hidden mt-2">
      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <DataGridHeader title="File Upload Logs" />
          <div className="flex items-center gap-2">
            <Button
              variant="contained"
              onClick={handleExport}
              sx={{ borderRadius: '20px', fontSize: '12px' }}
            >
              Export to CSV
            </Button>
          </div>
        </div>

        <DataGridPro
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
        />
      </div>
    </div>
  );
});

FileLogsGrid.displayName = 'FileLogsGrid';

export default FileLogsGrid;