import React, { useState, useMemo } from 'react';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import { SessionWithFiles } from '../../types/Interfaces/interfaces';
import { useTheme } from '../../hooks/useTheme';
import { getDataGridStyles } from '../../styles/productionReportStyles';

interface FileLogsDetailPanelProps {
  sessionData: SessionWithFiles;
}

interface FileRow {
  id: string;
  filename: string;
  warehouse: string;
  rowCount: number;
  columnCount: number;
  status: string;
  uploadTimestamp: string;
  message: string;
  uploadedBy: string;
}

export const FileLogsDetailPanel: React.FC<FileLogsDetailPanelProps> = ({ sessionData }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<string | null>('last_60_days');

  // Transform files by category
  const filesByCategory = useMemo(() => {
    const categories: Record<string, FileRow[]> = {
      last_60_days: [],
      next_60_days_previous_year: [],
      open_orders: [],
    };

    let idCounter = 1;

    // Process each category
    if (sessionData.files.last_60_days) {
      sessionData.files.last_60_days.forEach((file) => {
        categories.last_60_days.push({
          id: `${sessionData.session.id}-l60d-${idCounter++}`,
          filename: file.filename,
          warehouse: file.warehouse || '-',
          rowCount: file.row_count,
          columnCount: file.column_count,
          status: file.status,
          uploadTimestamp: file.upload_timestamp,
          message: file.message,
          uploadedBy: file.uploaded_by,
        });
      });
    }

    if (sessionData.files.next_60_days_previous_year) {
      sessionData.files.next_60_days_previous_year.forEach((file) => {
        categories.next_60_days_previous_year.push({
          id: `${sessionData.session.id}-n60d-${idCounter++}`,
          filename: file.filename,
          warehouse: file.warehouse || '-',
          rowCount: file.row_count,
          columnCount: file.column_count,
          status: file.status,
          uploadTimestamp: file.upload_timestamp,
          message: file.message,
          uploadedBy: file.uploaded_by,
        });
      });
    }

    if (sessionData.files.open_orders) {
      sessionData.files.open_orders.forEach((file) => {
        categories.open_orders.push({
          id: `${sessionData.session.id}-oo-${idCounter++}`,
          filename: file.filename,
          warehouse: file.warehouse || '-',
          rowCount: file.row_count,
          columnCount: file.column_count,
          status: file.status,
          uploadTimestamp: file.upload_timestamp,
          message: file.message,
          uploadedBy: file.uploaded_by,
        });
      });
    }

    return categories;
  }, [sessionData]);

  const fileColumns = useMemo((): GridColDef[] => [
    {
      field: 'filename',
      headerName: 'File Name',
      flex: 1.2,
      minWidth: 200,
      sortable: true,
      filterable: true,
    },
    {
      field: 'warehouse',
      headerName: 'Warehouse',
      flex: 0.8,
      minWidth: 100,
      sortable: true,
      filterable: true,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'rowCount',
      headerName: 'Row Count',
      flex: 0.7,
      minWidth: 100,
      sortable: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ fontWeight: 500 }}>{params.value}</span>,
    },
    {
      field: 'columnCount',
      headerName: 'Column Count',
      flex: 0.7,
      minWidth: 120,
      sortable: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span style={{ fontWeight: 500 }}>{params.value}</span>,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      sortable: true,
      align: 'center',
      headerAlign: 'center',
      // renderCell: (params) => {
      //   const isSuccess = params.value === 'Success';
      //   return (
      //     <span
      //       style={{
      //         padding: '4px 8px',
      //         borderRadius: '4px',
      //         backgroundColor: isSuccess ? '#dcfce7' : '#fee2e2',
      //         color: isSuccess ? '#166534' : '#991b1b',
      //         fontWeight: 500,
      //         fontSize: '0.875rem',
      //       }}
      //     >
      //       {params.value}
      //     </span>
      //   );
      // },
    },
    // {
    //   field: 'uploadedBy',
    //   headerName: 'Uploaded By',
    //   flex: 0.8,
    //   minWidth: 120,
    //   sortable: true,
    //   align: 'center',
    //   headerAlign: 'center',
    // },
  ], []);

  const categoryTabs = [
    {
      key: 'last_60_days',
      label: 'Last 60 Days',
      count: filesByCategory.last_60_days.length,
    },
    {
      key: 'next_60_days_previous_year',
      label: 'Next 60 Days (Previous Year)',
      count: filesByCategory.next_60_days_previous_year.length,
    },
    {
      key: 'open_orders',
      label: 'Open Orders',
      count: filesByCategory.open_orders.length,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
      <div className="space-y-4">

        {/* Category Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {categoryTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors ${activeCategory === tab.key
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-300 dark:bg-gray-600 text-xs rounded-full px-2 py-0.5">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* File Grid */}
        {activeCategory && (
          <div style={{ width: '100%' }} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <DataGridPremium
              rows={filesByCategory[activeCategory as keyof typeof filesByCategory] || []}
              columns={fileColumns}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pagination
              disableRowSelectionOnClick
              sx={getDataGridStyles(isDark)}
              density="compact"
            />
          </div>
        )}

        {/* Empty State */}
        {!activeCategory && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Select a category to view files</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileLogsDetailPanel;
