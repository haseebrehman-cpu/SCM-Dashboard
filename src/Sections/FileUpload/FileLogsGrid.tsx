import { useMemo, useState } from 'react';
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import { useTheme } from '../../hooks/useTheme';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import React from 'react';
import { useDeleteFileUploads, useLatestUploadSession } from '../../api/scmFileUpload';
import { Modal } from '../../components/ui/modal';
import { FileLogsDetailPanel } from './FileLogsDetailPanel';
import { IconButton } from '@mui/material';
import { TrashBinIcon } from '../../icons';

/**
 * FileLogsGrid Component
 * Displays upload sessions in a hierarchical grid with expandable detail rows.
 * Main grid shows session-level data, detail rows show file categories and their files.
 */

const FileLogsGrid: React.FC = React.memo(() => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data, isLoading, refetch } = useLatestUploadSession();
  const deleteMutation = useDeleteFileUploads();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

  // Transform sessions data for the main grid
  const rows = useMemo(() => {
    if (!data?.sessions || data.sessions.length === 0) return [];

    return data.sessions.map((session) => ({
      id: session.session.id,
      uploadTimestamp: session.session.upload_timestamp,
      totalFilesProcessed: session.session.total_files,
      status: session.session.status === 'Success' ? 'Success' : 'Failed',
      message: session.session.message,
      uploadedBy: session.session.uploaded_by,
      sessionData: session, // Stored full session data for detail panel
    }));
  }, [data]);

  const columns = useMemo((): GridColDef[] => {
    return [
      {
        field: 'uploadTimestamp',
        headerName: 'Upload Timestamp',
        flex: 1.2,
        minWidth: 180,
        sortable: true,
        filterable: true,
      },
      {
        field: 'totalFilesProcessed',
        headerName: 'Total Files Processed',
        flex: 0.8,
        minWidth: 200,
        sortable: true,
        filterable: true,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.7,
        minWidth: 100,
        sortable: true,
        filterable: true,
        align: 'center',
        headerAlign: 'center',
        // renderCell: (params) => {
        //   const status = params.value;
        //   const isSuccess = status === 'Success';
        //   return (
        //     <span
        //       style={{
        //         padding: '1px 8px',
        //         borderRadius: '4px',
        //         backgroundColor: isSuccess ? '#dcfce7' : '#fee2e2',
        //         color: isSuccess ? '#166534' : '#991b1b',
        //         fontWeight: 500,
        //       }}
        //     >
        //       {status}
        //     </span>
        //   );
        // },
      },
      {
        field: 'message',
        headerName: 'Message',
        flex: 1.5,
        minWidth: 200,
        sortable: false,
        filterable: true,
      },
      {
        field: 'uploadedBy',
        headerName: 'Uploaded By',
        flex: 0.8,
        minWidth: 120,
        sortable: true,
        filterable: true,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'actions',
        headerName: 'Action',
        flex: 0.6,
        minWidth: 80,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <IconButton
            size="small"
            title="Delete Session"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSessionId(params.row.id);
              setIsDeleteModalOpen(true);
            }}
          >
            <TrashBinIcon className="w-4 h-4" />
          </IconButton>
        ),
      },
    ];
  }, []);

  return (
    <>
      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-x-auto">
        <DataGridPremium
          rows={rows}
          columns={columns}
          loading={isLoading || deleteMutation.isPending}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pagination
          checkboxSelection
          keepNonExistentRowsSelected
          rowBufferPx={100}
          sx={getDataGridStyles(isDark, "auto")}
          showToolbar
          getDetailPanelHeight={() => 'auto'}
          getDetailPanelContent={({ row }) => (
            <FileLogsDetailPanel sessionData={row.sessionData} />
          )}
          slotProps={{
            toolbar: {
              printOptions: { disableToolbarButton: true },
              excelOptions: { disableToolbarButton: true },
              csvOptions: { disableToolbarButton: false },
            }
          }}
        />
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSessionId(null);
        }}
        className="w-full max-w-md p-6"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Delete Upload Session
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            'Are you sure you want to delete this upload session?
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedSessionId(null);
              }}
            >
              No
            </button>
            <button
              type="button"
              className="px-4 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              disabled={deleteMutation.isPending || !selectedSessionId}
              onClick={() => {
                if (!selectedSessionId) return;
                deleteMutation.mutate(selectedSessionId, {
                  onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedSessionId(null);
                    refetch();
                  },
                });
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default FileLogsGrid;