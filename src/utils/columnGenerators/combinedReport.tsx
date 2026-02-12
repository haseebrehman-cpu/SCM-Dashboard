import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { CombinedReportRow } from '../../types/combinedReport';
import { allContainers } from '../../mockData/combinedReportMock';

interface ColumnConfig {
  isDark: boolean;
}

export const generateCombinedReportColumns = ({ isDark }: ColumnConfig): GridColDef[] => {
  const headerStyle = {
    color: isDark ? '#98a2b3' : '#475467', // gray-400 : gray-600
    fontWeight: '600',
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  const cellStyle = {
    color: isDark ? '#f2f4f7' : '#1d2939', // gray-100 : gray-800
    fontSize: '13px',
  };


  // Base columns
  const baseColumns: GridColDef[] = [
    {
      field: 'uploadDate',
      headerName: 'Upload Date',
      width: 130,
      renderHeader: () => <div style={headerStyle}>Upload Date</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={cellStyle}>{params.value}</div>
      ),
    },
    {
      field: 'dataFrom',
      headerName: 'Data From',
      width: 150,
      renderHeader: () => <div style={headerStyle}>Data From</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '600' }}>{params.value}</div>
      ),
    },
    {
      field: 'categoryName',
      headerName: 'Category',
      width: 180,
      renderHeader: () => <div style={headerStyle}>Category Name</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '600' }}>{params.value}</div>
      ),
    },
    {
      field: 'itemNumber',
      headerName: 'Item Number',
      width: 140,
      renderHeader: () => <div style={headerStyle}>Item Number</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontFamily: 'monospace' }}>{params.value}</div>
      ),
    },
    {
      field: 'itemTitle',
      headerName: 'Item Title',
      width: 280,
      renderHeader: () => <div style={headerStyle}>Item Title</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={cellStyle}>{params.value}</div>
      ),
    },
  ];

  // Sales columns (Last 60 Days)
  const salesColumns: GridColDef[] = [
    {
      field: 'CA_Last_60_Days_Sale',
      headerName: 'CA Last 60 Days Sale',
      width: 170,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>CA Last 60 Days Sale</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '600' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'DE_Last_60_Days_Sale',
      headerName: 'DE Last 60 Days Sale',
      width: 170,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>DE Last 60 Days Sale</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '600' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'UK_Last_60_Days_Sale',
      headerName: 'UK Last 60 Days Sale',
      width: 170,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>UK Last 60 Days Sale</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '600' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'US_Last_60_Days_Sale',
      headerName: 'US Last 60 Days Sale',
      width: 170,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>US Last 60 Days Sale</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '600' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
  ];

  // Warehouse Data columns
  const warehouseColumns: GridColDef[] = [
    {
      field: 'CA_WH_Data',
      headerName: 'CA WH Data',
      width: 140,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>CA WH Data</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '600', color: isDark ? '#12b76a' : '#039855' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'DE_WH_Data',
      headerName: 'DE WH Data',
      width: 140,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>DE WH Data</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '600', color: isDark ? '#12b76a' : '#039855' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'UK_WH_Data',
      headerName: 'UK WH Data',
      width: 140,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>UK WH Data</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '600', color: isDark ? '#12b76a' : '#039855' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'US_WH_Data',
      headerName: 'US WH Data',
      width: 140,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>US WH Data</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '600', color: isDark ? '#12b76a' : '#039855' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
  ];

  // Dynamic container columns
  const containerColumns: GridColDef[] = [];

  // Add CA containers
  allContainers.CA.forEach(container => {
    const columnKey = `${container.containerNumber} ${container.shipmentDate} ${container.arrivalDate} ${container.status}`;
    containerColumns.push({
      field: columnKey,
      headerName: columnKey,
      width: 220,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => (
        <div style={{ ...headerStyle, textAlign: 'right', fontSize: '11px' }}>
          {columnKey}
        </div>
      ),
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => {
        const value = params.value as number;
        const color = container.status === 'Delivered'
          ? (isDark ? '#12b76a' : '#039855')
          : (isDark ? '#f79009' : '#dc6803');
        return (
          <div style={{ ...cellStyle, fontWeight: '600', color }}>
            {value?.toLocaleString() || 0}
          </div>
        );
      },
    });
  });

  // Add DE containers
  allContainers.DE.forEach(container => {
    const columnKey = `${container.containerNumber} ${container.shipmentDate} ${container.arrivalDate} ${container.status}`;
    containerColumns.push({
      field: columnKey,
      headerName: columnKey,
      width: 200,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => (
        <div style={{ ...headerStyle, textAlign: 'right', fontSize: '11px' }}>
          {columnKey}
        </div>
      ),
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => {
        const value = params.value as number;
        const color = container.status === 'Delivered'
          ? (isDark ? '#12b76a' : '#039855')
          : (isDark ? '#f79009' : '#dc6803');
        return (
          <div style={{ ...cellStyle, fontWeight: '600', color }}>
            {value?.toLocaleString() || 0}
          </div>
        );
      },
    });
  });

  // Add UK containers
  allContainers.UK.forEach(container => {
    const columnKey = `${container.containerNumber} ${container.shipmentDate} ${container.arrivalDate} ${container.status}`;
    containerColumns.push({
      field: columnKey,
      headerName: columnKey,
      width: 200,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => (
        <div style={{ ...headerStyle, textAlign: 'right', fontSize: '11px' }}>
          {columnKey}
        </div>
      ),
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => {
        const value = params.value as number;
        const color = container.status === 'Delivered'
          ? (isDark ? '#12b76a' : '#039855')
          : (isDark ? '#f79009' : '#dc6803');
        return (
          <div style={{ ...cellStyle, fontWeight: '600', color }}>
            {value?.toLocaleString() || 0}
          </div>
        );
      },
    });
  });

  // Add US containers
  allContainers.US.forEach(container => {
    const columnKey = `${container.containerNumber} ${container.shipmentDate} ${container.arrivalDate} ${container.status}`;
    containerColumns.push({
      field: columnKey,
      headerName: columnKey,
      width: 200,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => (
        <div style={{ ...headerStyle, textAlign: 'right', fontSize: '11px' }}>
          {columnKey}
        </div>
      ),
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => {
        const value = params.value as number;
        const color = container.status === 'Delivered'
          ? (isDark ? '#12b76a' : '#039855')
          : (isDark ? '#f79009' : '#dc6803');
        return (
          <div style={{ ...cellStyle, fontWeight: '600', color }}>
            {value?.toLocaleString() || 0}
          </div>
        );
      },
    });
  });

  // Summary columns
  const summaryColumns: GridColDef[] = [
    {
      field: 'CA_Containers_Overall_Qty',
      headerName: 'CA Containers Overall Qty',
      width: 200,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>CA Containers Overall Qty</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '700', fontSize: '14px' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'CA_Containers_Intransit_Qty',
      headerName: 'CA Containers Intransit Qty',
      width: 200,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>CA Containers Intransit Qty</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '700', fontSize: '14px', color: isDark ? '#f79009' : '#dc6803' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'DE_Containers_Overall_Qty',
      headerName: 'DE Containers Overall Qty',
      width: 200,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>DE Containers Overall Qty</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '700', fontSize: '14px' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'DE_Containers_Intransit_Qty',
      headerName: 'DE Containers Intransit Qty',
      width: 200,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>DE Containers Intransit Qty</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '700', fontSize: '14px', color: isDark ? '#f79009' : '#dc6803' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'US_Containers_Overall_Qty',
      headerName: 'US Containers Overall Qty',
      width: 200,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>US Containers Overall Qty</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '700', fontSize: '14px' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'US_Containers_Intransit_Qty',
      headerName: 'US Containers Intransit Qty',
      width: 200,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>US Containers Intransit Qty</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '700', fontSize: '14px', color: isDark ? '#f79009' : '#dc6803' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'UK_Containers_Overall_Qty',
      headerName: 'UK Containers Overall Qty',
      width: 200,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>UK Containers Overall Qty</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '700', fontSize: '14px' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
    {
      field: 'UK_Containers_Intransit_Qty',
      headerName: 'UK Containers Intransit Qty',
      width: 200,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      renderHeader: () => <div style={{ ...headerStyle, textAlign: 'right' }}>UK Containers Intransit Qty</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={{ ...cellStyle, fontWeight: '700', fontSize: '14px', color: isDark ? '#f79009' : '#dc6803' }}>
          {params.value?.toLocaleString()}
        </div>
      ),
    },
  ];

  return [
    ...baseColumns,
    ...salesColumns,
    ...warehouseColumns,
    ...containerColumns,
    ...summaryColumns,
  ];
};
