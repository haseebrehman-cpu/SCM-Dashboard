import { useMemo, useCallback } from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { useTheme } from '../../context/ThemeContext';
import { DataGridHeader } from '../../components/DataGrid/DataGridHeader';
import { IconButton, Button } from '@mui/material';
import { TrashBinIcon, DownloadIcon } from '../../icons';
import { useFileUploadLogs } from '../../context/FileUploadContext';
import { exportToCsv } from '../../utils/exportToCsv';
import { exportToPng } from '../../utils/exportToPng';

const FileLogsGrid = () => {  
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { fileLogs, removeFileLog } = useFileUploadLogs();

  const handleDelete = useCallback((id: number) => {
    removeFileLog(id);
  }, [removeFileLog]);

  const handleDownload = useCallback((id: number) => {
    const log = fileLogs.find(l => l.id === id);
    if (log) {
      // Create download link for the file
      const url = URL.createObjectURL(log.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = log.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [fileLogs]);

  const columns: GridColDef[] = useMemo(
    () => {

      return [
      {
        field: 'fileName',
        headerName: 'File Name',
        flex: 1.2,
        minWidth: 180,
        sortable: true,
        filterable: true,
        headerAlign: 'center',
        align: 'left',
        renderHeader: () => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>File Name</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
      },
      {
        field: 'uploadedDate',
        headerName: 'Upload Date',
        flex: 0.9,
        minWidth: 140,
        sortable: true,
        filterable: true,
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>Upload Date</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
      },
      {
        field: 'uploadedBy',
        headerName: 'Uploaded By',
        flex: 0.9,
        minWidth: 140,
        sortable: true,
        filterable: true,
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>Uploaded By</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
      },
      {
        field: 'fileSize',
        headerName: 'File Size',
        flex: 0.8,
        minWidth: 100,
        sortable: true,
        filterable: true,
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>File Size</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
      },
      {
        field: 'fileType',
        headerName: 'Type',
        flex: 0.7,
        minWidth: 70,
        sortable: true,
        filterable: true,
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>Type</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
      },
      {
        field: 'stepNumber',
        headerName: 'Step',
        flex: 0.6,
        minWidth: 60,
        sortable: true,
        filterable: true,
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>Step</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.9,
        minWidth: 130,
        sortable: true,
        filterable: true,
        headerAlign: 'center',
        align: 'center',
        renderHeader: () => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>Status</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
          </div>
        ),
        renderCell: (params) => {
     
          return (
            <div
              style={{
                padding: '0 12px',
                borderRadius: '6px',
                backgroundColor: params.value === 'completed' ? (isDark ? '#10b981' : '#059669') : params.value === 'processing' ? (isDark ? '#f59e0b' : '#d97706') : (isDark ? '#ef4444' : '#dc2626'),
                color: '#fff',
                fontWeight: 500,
                fontSize: '0.875rem',
                textTransform: 'capitalize',
                display: 'inline-block',
              }}
            >
              {params.value}
            </div>
          );
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        flex: 0.7,
        minWidth: 100,
        sortable: false,
        filterable: false,
        headerAlign: 'center',
        align: 'center',
        getActions: (params) => [
          <GridActionsCellItem
            key="download"
            icon={
              <IconButton size="small" title="Download">
                <DownloadIcon className="w-4 h-4" />
              </IconButton>
            }
            label="Download"
            onClick={() => handleDownload(params.id as number)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={
              <IconButton size="small" title="Delete">
                <TrashBinIcon className="w-4 h-4" />
              </IconButton>
            }
            label="Delete"
            onClick={() => handleDelete(params.id as number)}
          />,
        ],
      },
    ];
    },
    [isDark, handleDelete, handleDownload]
  );

  return (
    <div className="w-full max-w-full overflow-hidden mt-2">
      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <DataGridHeader title="File Upload Logs" />
          <div className="flex items-center gap-2">
            <Button variant="contained" onClick={() => exportToCsv(fileLogs, `File-Upload-Logs-${new Date().toISOString().split('T')[0]}.csv`)}>Export to CSV</Button>
            <Button variant="contained" onClick={() => exportToPng(fileLogs, `File-Upload-Logs-${new Date().toISOString().split('T')[0]}.png`)}>Export to PNG</Button>
          </div>
        </div>

        {/* DataGrid */}
        <DataGrid
          rows={fileLogs}
          columns={columns}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          autoHeight
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            backgroundColor: 'transparent',
            width: '100%',
            '& .MuiDataGrid-main': {
              backgroundColor: 'transparent',
            },
            '& .MuiDataGrid-container--top [role=row]': {
              backgroundColor: 'transparent',
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: 'transparent',
            },
            '& .MuiDataGrid-row': {
              backgroundColor: 'transparent !important',
            },
            '& .MuiDataGrid-cell': {
              borderColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
              backgroundColor: 'transparent',
              '& .MuiDataGrid-cellContent': {
                color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
              },
            },
            '& .MuiDataGrid-columnHeaders': {
              borderColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
              backgroundColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'transparent',
              fontWeight: 600,
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              color: isDark ? 'rgb(255, 255, 255)' : 'rgb(31 41 55)',
              fontWeight: 600,
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: isDark ? 'rgb(31 41 55)' : 'rgb(229 231 235)',
              backgroundColor: 'transparent',
            },
            '& .MuiTablePagination-root': {
              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
            },
            '& .MuiIconButton-root': {
              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05) !important' : 'rgba(0, 0, 0, 0.04) !important',
            },
            '& .MuiDataGrid-selectedRowCount': {
              color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgb(31 41 55)',
            },
            '& .MuiDataGrid-columnSeparator': {
              color: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgb(229 231 235)',
            },
            '& .MuiDataGrid-sortIcon': {
              color: isDark ? '#000' : 'rgb(107 114 128)',
            },
            '& .MuiDataGrid-menuIconButton': {
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
            },
            '& .MuiDataGrid-iconButtonContainer': {
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
            },
            '& .MuiDataGrid-columnHeader .MuiIconButton-root': {
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107 114 128)',
            },
          }}
        />
      </div>
    </div>
  );
};

export default FileLogsGrid;