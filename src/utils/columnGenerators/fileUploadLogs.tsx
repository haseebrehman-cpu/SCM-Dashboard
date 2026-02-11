import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { TrashBinIcon } from '../../icons';

interface LogColumnParams {
  handleDelete: (id: number) => void;
  deleteButtonIds: Set<number>;
}

const renderHeaderWithIcon = (label: string) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
    <span>{label}</span>
    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
  </div>
);

export const generateFileLogColumns = ({
  handleDelete,
  deleteButtonIds
}: LogColumnParams): GridColDef[] => [
    {
      field: 'fileName',
      headerName: 'File Name',
      flex: 1.2,
      minWidth: 180,
      sortable: true,
      filterable: true,
      headerAlign: 'center',
      align: 'left',
      renderHeader: () => renderHeaderWithIcon('File Name'),
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
      renderHeader: () => renderHeaderWithIcon('Upload Date'),
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
      renderHeader: () => renderHeaderWithIcon('Uploaded By'),
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 0.9,
      minWidth: 140,
      sortable: true,
      filterable: true,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => renderHeaderWithIcon('Start Date'),
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 0.9,
      minWidth: 140,
      sortable: true,
      filterable: true,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => renderHeaderWithIcon('End Date'),
    },
    {
      field: 'rowCount',
      headerName: 'Row Count',
      flex: 0.7,
      minWidth: 100,
      sortable: true,
      filterable: true,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => renderHeaderWithIcon('Row Count'),
      renderCell: (params) => {
        const rowCount = params.row.rowCount;
        return <span style={{ fontWeight: 500 }}>{rowCount !== undefined && rowCount !== null ? rowCount : '-'}</span>;
      },
    },
    {
      field: 'stepNumber',
      headerName: 'Step',
      flex: 0.7,
      minWidth: 80,
      sortable: true,
      filterable: true,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => renderHeaderWithIcon('Step'),
      renderCell: (params) => {
        const stepNumber = params.value;
        return <span>{`Step ${stepNumber}`}</span>;
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
      getActions: (params) => {
        // Only show delete button for the first Step 1 file of each date group
        if (!deleteButtonIds.has(params.id as number)) {
          return [];
        }

        return [
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
        ];
      },
    },
  ];
