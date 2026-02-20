import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider } from "@tanstack/react-query";
import ProductionReport from "../Sections/ProductionReport/ProductionReport";
import { useTheme } from "../hooks/useTheme";
import * as productionReportMock from "../mockData/productionReportMock";
import { queryClient } from "../lib/queryClient";

// Mock the hooks and dependencies
jest.mock("../hooks/useTheme");
jest.mock("../Sections/ProductionReport/FileUploadDialog", () => ({
  FileUploadDialog: ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) =>
    isOpen ? (
      <div data-testid="file-upload-dialog">
        <button onClick={onClose}>Close Dialog</button>
      </div>
    ) : null,
}));

interface ProductionReportHeaderProps {
  selectedWarehouse: string;
  onWarehouseChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onUploadClick: () => void;
}

jest.mock("../Sections/ProductionReport/ProductionReportHeader", () => ({
  ProductionReportHeader: ({
    selectedWarehouse,
    onWarehouseChange,
    onUploadClick,
  }: ProductionReportHeaderProps) => (
    <div data-testid="production-report-header">
      <select
        data-testid="warehouse-select"
        value={selectedWarehouse}
        onChange={onWarehouseChange}
      >
        <option value="UK">UK</option>
        <option value="US">US</option>
        <option value="EU">EU</option>
      </select>
      <button data-testid="upload-button" onClick={onUploadClick}>
        Upload
      </button>
    </div>
  ),
}));

interface DataGridPremiumProps {
  rows: Array<Record<string, unknown>>;
  columns: Array<Record<string, unknown>>;
  label: string;
}

jest.mock("@mui/x-data-grid-premium", () => ({
  DataGridPremium: ({ rows, columns, label }: DataGridPremiumProps) => (
    <div data-testid="data-grid-premium">
      <span>{label}</span>
      <div data-testid="grid-rows">{rows.length} rows</div>
      <div data-testid="grid-columns">{columns.length} columns</div>
    </div>
  ),
}));

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe("ProductionReport Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTheme.mockReturnValue({
      theme: "light",
      toggleTheme: jest.fn(),
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ProductionReport />
      </QueryClientProvider>,
    );
  };

  test("renders ProductionReport component with default warehouse", () => {
    renderComponent();
    expect(screen.getByTestId("production-report-header")).toBeInTheDocument();
    expect(screen.getByTestId("data-grid-premium")).toBeInTheDocument();
  });

  test("renders with correct initial warehouse selection (UK)", () => {
    renderComponent();
    const warehouseSelect = screen.getByTestId(
      "warehouse-select",
    ) as HTMLSelectElement;
    expect(warehouseSelect.value).toBe("UK");
  });

  test("displays DataGrid with correct label", () => {
    renderComponent();
    expect(screen.getByText("Production Remaining Report")).toBeInTheDocument();
  });

  test("handles warehouse change event", async () => {
    renderComponent();
    const warehouseSelect = screen.getByTestId("warehouse-select");

    await userEvent.selectOptions(warehouseSelect, "US");
    expect((warehouseSelect as HTMLSelectElement).value).toBe("US");
  });

  test("FileUploadDialog is not open by default", () => {
    renderComponent();
    expect(screen.queryByTestId("file-upload-dialog")).not.toBeInTheDocument();
  });

  test("opens FileUploadDialog when upload button is clicked", async () => {
    renderComponent();
    const uploadButton = screen.getByTestId("upload-button");

    await userEvent.click(uploadButton);
    expect(screen.getByTestId("file-upload-dialog")).toBeInTheDocument();
  });

  test("closes FileUploadDialog when onClose is triggered", async () => {
    renderComponent();
    const uploadButton = screen.getByTestId("upload-button");

    await userEvent.click(uploadButton);
    expect(screen.getByTestId("file-upload-dialog")).toBeInTheDocument();

    const closeButton = within(
      screen.getByTestId("file-upload-dialog"),
    ).getByText("Close Dialog");
    await userEvent.click(closeButton);
    expect(screen.queryByTestId("file-upload-dialog")).not.toBeInTheDocument();
  });

  test("renders DataGrid with correct number of rows for selected warehouse", () => {
    renderComponent();
    const ukData = productionReportMock.warehouseData.UK;
    expect(screen.getByText(`${ukData.length} rows`)).toBeInTheDocument();
  });

  test("updates DataGrid rows when warehouse changes", async () => {
    renderComponent();
    const warehouseSelect = screen.getByTestId("warehouse-select");

    const ukData = productionReportMock.warehouseData.UK;
    expect(screen.getByText(`${ukData.length} rows`)).toBeInTheDocument();

    await userEvent.selectOptions(warehouseSelect, "US");
    const usData = productionReportMock.warehouseData.US;
    expect(screen.getByText(`${usData.length} rows`)).toBeInTheDocument();
  });

  test("renders ProductionReportHeader with correct props", () => {
    renderComponent();
    const header = screen.getByTestId("production-report-header");
    expect(header).toBeInTheDocument();
    expect(screen.getByTestId("warehouse-select")).toBeInTheDocument();
    expect(screen.getByTestId("upload-button")).toBeInTheDocument();
  });

  test("uses dark theme when theme is 'dark'", () => {
    mockUseTheme.mockReturnValue({
      theme: "dark",
      toggleTheme: jest.fn(),
    });
    renderComponent();
    expect(screen.getByTestId("data-grid-premium")).toBeInTheDocument();
  });

  test("renders layout with correct CSS classes", () => {
    const { container } = renderComponent();
    const layoutDiv = container.querySelector(".relative");
    expect(layoutDiv).toHaveClass("border", "border-gray-200", "bg-white");
  });

  test("header is positioned correctly with flex and margin", () => {
    const { container } = renderComponent();
    const headerDiv = container.querySelector(".flex");
    expect(headerDiv).toHaveClass("justify-end", "my-2");
  });
});
