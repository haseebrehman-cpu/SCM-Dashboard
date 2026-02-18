import PurchaseOrder from "../Sections/PurchaseOrderGrid/PurchaseOrder";
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../context/ThemeContext';

// Mock the dependencies
jest.mock('../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
  }),
}));

jest.mock('../hooks/useInlineEdit', () => ({
  useInlineEdit: () => ({
    editedData: null,
    isEditing: false,
    startEdit: jest.fn(),
    saveEdit: jest.fn(),
    cancelEdit: jest.fn(),
    updateEditedData: jest.fn(),
  }),
}));

jest.mock('../utils/columnGenerators/purchaseOrder', () => ({
  generatePurchaseOrderColumns: jest.fn(() => [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'containerName', headerName: 'Container Name', width: 150 },
    { field: 'containerNumber', headerName: 'Container Number', width: 150 },
    { field: 'deliveryStatus', headerName: 'Status', width: 120 },
  ]),
}));

jest.mock('@mui/x-data-grid-premium', () => ({
  DataGridPremium: ({ label, rows }: { label: string; rows: { id: number | string; containerName: string }[] }) => (
    <div data-testid="data-grid" data-label={label}>
      <div data-testid="grid-row-count">{rows.length}</div>
      {rows.map((row) => (
        <div key={row.id} data-testid={`row-${row.id}`}>
          {row.containerName}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('../Sections/ProductionReport/ProductionReportHeader', () => ({
  ProductionReportHeader: ({ onUploadClick, isShowUpload }: { onUploadClick: () => void; isShowUpload: boolean }) => (
    <button
      data-testid="upload-button"
      onClick={onUploadClick}
      style={{ display: isShowUpload ? 'block' : 'none' }}
    >
      Upload
    </button>
  ),
}));

jest.mock('../Sections/ProductionReport/FileUploadDialog', () => ({
  FileUploadDialog: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="file-upload-dialog">
      <button data-testid="close-dialog" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

jest.mock('../styles/productionReportStyles', () => ({
  getDataGridStyles: () => ({}),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe("Purchase Order Report", () => {
  test('Renders the Purchase Order Grid with label', () => {
    render(<PurchaseOrder />, { wrapper: Wrapper });

    const dataGrid = screen.getByTestId('data-grid');
    expect(dataGrid).toBeInTheDocument();
    expect(dataGrid).toHaveAttribute('data-label', 'Purchase Order Report');
  });

  test('Renders the Upload button', () => {
    render(<PurchaseOrder />);

    const uploadButton = screen.getByTestId('upload-button');
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toHaveTextContent('Upload')
  })

  test('Open FileUploadDialog when Upload Button is clicked', async () => {
    const user = userEvent.setup();
    render(<PurchaseOrder />);

    const uploadButton = screen.getByTestId('upload-button')
    await user.click(uploadButton);
    await waitFor(() => {
      const fileUploadDialog = screen.getByTestId('file-upload-dialog')
      expect(fileUploadDialog).toBeInTheDocument();
    })
  })


  test('Close FilesUploadDialog when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<PurchaseOrder />);

    const uploadButton = screen.getByTestId('upload-button');
    await user.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByTestId('file-upload-dialog')).toBeInTheDocument();
    })

    const closeButton = screen.getByTestId('close-dialog');
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('file-upload-dialog')).not.toBeInTheDocument();
    })
  })

  test('Render the Production Report Header', () => {
    render(<PurchaseOrder />);

    const productionReportHeader = screen.getByTestId('upload-button')
    expect(productionReportHeader).toBeInTheDocument()
  })

})