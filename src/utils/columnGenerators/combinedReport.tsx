import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { CombinedReportRow } from '../../types/combinedReport';
import { allContainers } from '../../mockData/combinedReportMock';

interface ColumnConfig {
  isDark: boolean;
  /** Dynamic container column keys from API (e.g. "C-81 2025-11-29 2026-03-07 3"). When provided, used instead of allContainers. */
  containerKeys?: string[];
}

/** Parse container key "C-81 2025-11-29 2026-03-07 3" - last segment is days left (0 = delivered) */
function parseContainerStatus(key: string): 'Delivered' | number {
  const parts = key.trim().split(/\s+/);
  const last = parts[parts.length - 1];
  const n = parseInt(last ?? "0", 10);
  return isNaN(n) ? 0 : n === 0 ? "Delivered" : n;
}

export const generateCombinedReportColumns = ({ isDark, containerKeys }: ColumnConfig): GridColDef[] => {
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
      headerName: 'Current Date',
      width: 130,
      renderHeader: () => <div style={headerStyle}>Upload Date</div>,
      renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
        <div style={cellStyle}>{params.value}</div>
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
    }
    // {
    //   field: 'itemTitle',
    //   headerName: 'Item Title',
    //   width: 280,
    //   renderHeader: () => <div style={headerStyle}>Item Title</div>,
    //   renderCell: (params: GridRenderCellParams<CombinedReportRow>) => (
    //     <div style={cellStyle}>{params.value}</div>
    //   ),
    // },
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

  // Dynamic container columns - from API containerKeys or fallback to mock allContainers
  const containerColumns: GridColDef[] = [];

  const createContainerColumn = (columnKey: string, status: 'Delivered' | number) => ({
    field: columnKey,
    headerName: columnKey,
    width: 250,
    type: 'number' as const,
    headerAlign: 'right' as const,
    align: 'right' as const,
    renderHeader: () => (
      <div style={{ ...headerStyle, textAlign: 'right', fontSize: '11px' }}>
        {columnKey}
      </div>
    ),
    renderCell: (params: GridRenderCellParams<CombinedReportRow>) => {
      const value = params.value as number;
      const color = status === 'Delivered'
        ? (isDark ? '#12b76a' : '#039855')
        : (isDark ? '#f79009' : '#dc6803');
      return (
        <div style={{ ...cellStyle, fontWeight: '600', color }}>
          {value?.toLocaleString() || 0}
        </div>
      );
    },
  });

  if (containerKeys?.length) {
    containerKeys.forEach(key => {
      containerColumns.push(createContainerColumn(key, parseContainerStatus(key)));
    });
  } else {
    const addFromMock = (containers: { containerNumber: string; shipmentDate: string; arrivalDate: string; status: 'Delivered' | number }[]) => {
      containers.forEach(c => {
        const columnKey = `${c.containerNumber} ${c.shipmentDate} ${c.arrivalDate} ${c.status}`;
        containerColumns.push(createContainerColumn(columnKey, c.status));
      });
    };
    addFromMock(allContainers.CA);
    addFromMock(allContainers.DE);
    addFromMock(allContainers.UK);
    addFromMock(allContainers.US);
  }

  // Summary columns
  const summaryColumns: GridColDef[] = [
    {
      field: 'CA_Containers_Overall_Qty',
      headerName: 'CA Containers Overall Qty',
      width: 250,
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
      width: 250,
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
      width: 250,
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
      width: 250,
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
      width: 250,
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
      width: 250,
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
      width: 250,
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
      width: 250,
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
