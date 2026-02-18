import { useCallback, useMemo, useState } from 'react';
import { DataGridPremium } from "@mui/x-data-grid-premium";
import { useTheme } from '../../hooks/useTheme';
import { getDataGridStyles } from '../../styles/productionReportStyles';
import { generateFileLogColumns } from '../../utils/columnGenerators/fileUploadLogs';
import React from 'react';
import { useDeleteFileUploads, useLatestUploadSession } from '../../api/scmFileUpload';
import { Modal } from '../../components/ui/modal';

/**
 * FileLogsGrid Component
 * Displays a history of file uploads with bulk-deletion by date functionality.
 * Refactored to follow SRP by separating logic into custom hooks and column generators.
 */
interface ApiFileLogRow {
  id: number;
  fileName: string;
  stepNumber: number;
  warehouse: string;
  rowCount?: number;
  columnCount?: number;
  status: string;
  uploadedDate: string;
  uploadedBy: string;
}

const FileLogsGrid: React.FC = React.memo(() => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data, isLoading, refetch } = useLatestUploadSession();
  const deleteMutation = useDeleteFileUploads();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const rows: ApiFileLogRow[] = useMemo(() => {
    if (!data?.files || !data.session) return [];

    const allRows: ApiFileLogRow[] = [];
    let idCounter = 1;

    data.files.forEach((file) => {
      let stepNumber = 0;
      if (file.step_type === 'last_60_days') stepNumber = 1;
      else if (file.step_type === 'next_60_days_previous_year') stepNumber = 2;
      else if (file.step_type === 'open_orders') stepNumber = 3;

      allRows.push({
        id: idCounter++,
        fileName: file.filename,
        stepNumber,
        warehouse: file.warehouse ?? '',
        rowCount: file.row_count,
        columnCount: file.column_count,
        status: file.status,
        uploadedDate: data.session.upload_timestamp ?? file.upload_timestamp,
        uploadedBy: file.uploaded_by,
      });
    });

    return allRows;
  }, [data]);

  const deleteButtonIds = useMemo(() => {
    if (rows.length === 0) return new Set<number>();
    return new Set<number>([rows[0].id]);
  }, [rows]);

  const handleDelete = useCallback(
    () => {
      if (!data?.session) return;
      setIsDeleteModalOpen(true);
    },
    [data],
  );

  const columns = useMemo(
    () => generateFileLogColumns({ handleDelete, deleteButtonIds }),
    [handleDelete, deleteButtonIds],
  );

  return (
    <>
      <div className="relative border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 rounded-xl overflow-x-auto">
        <DataGridPremium
          label='File Upload Logs'
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
          rowBufferPx={100}
          disableRowSelectionOnClick
          sx={getDataGridStyles(isDark)}
          showToolbar
        />
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="w-full max-w-md p-6"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Delete Upload Session
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {data?.session
              ? `Are you sure you want to delete all ${data.session.total_files} uploads for session #${data.session.id}?`
              : 'Are you sure you want to delete this upload session?'}
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              No
            </button>
            <button
              type="button"
              className="px-4 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              disabled={deleteMutation.isPending || !data?.session}
              onClick={() => {
                if (!data?.session) return;
                deleteMutation.mutate(data.session.id, {
                  onSuccess: () => {
                    setIsDeleteModalOpen(false);
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