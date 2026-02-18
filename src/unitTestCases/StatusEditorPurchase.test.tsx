import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusEditor } from '../Sections/PurchaseOrderGrid/StatusEditor';
import { ReactNode, ChangeEvent } from 'react';

interface MockSelectProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}

interface MockMenuItemProps {
  value: string;
  children: ReactNode;
}

jest.mock('@mui/material', () => ({
  Select: ({ value, onChange, children, ...props }: MockSelectProps) => (
    <select
      data-testid="status-select"
      value={value}
      onChange={(e) => onChange({ target: { value: e.target.value } } as ChangeEvent<HTMLSelectElement>)}
      {...props}
    >
      {children}
    </select>
  ),
  MenuItem: ({ value, children }: MockMenuItemProps) => (
    <option value={value} data-testid={`menu-item-${value}`}>
      {children}
    </option>
  ),
}));

describe('StatusEditor Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('Renders the StatusEditor component with select dropdown', () => {
    render(
      <StatusEditor
        value="Delivered"
        onChange={mockOnChange}
        isDark={false}
      />
    );

    const select = screen.getByTestId('status-select');
    expect(select).toBeInTheDocument();
  });

  test('Displays both "Delivered" and "In Transit" options', () => {
    render(
      <StatusEditor
        value="Delivered"
        onChange={mockOnChange}
        isDark={false}
      />
    );

    const deliveredOption = screen.getByTestId('menu-item-Delivered');
    const inTransitOption = screen.getByTestId('menu-item-InTransit');

    expect(deliveredOption).toBeInTheDocument();
    expect(inTransitOption).toBeInTheDocument();
    expect(deliveredOption).toHaveTextContent('Delivered');
    expect(inTransitOption).toHaveTextContent('In Transit');
  });

  test('Renders with initial value "Delivered"', () => {
    render(
      <StatusEditor
        value="Delivered"
        onChange={mockOnChange}
        isDark={false}
      />
    );

    const select = screen.getByTestId('status-select') as HTMLSelectElement;
    expect(select.value).toBe('Delivered');
  });

  test('Renders with initial value "InTransit"', () => {
    render(
      <StatusEditor
        value="InTransit"
        onChange={mockOnChange}
        isDark={false}
      />
    );

    const select = screen.getByTestId('status-select') as HTMLSelectElement;
    expect(select.value).toBe('InTransit');
  });

  test('Calls onChange when a different status is selected', async () => {
    const user = userEvent.setup();
    render(
      <StatusEditor
        value="Delivered"
        onChange={mockOnChange}
        isDark={false}
      />
    );

    const select = screen.getByTestId('status-select');
    await user.selectOptions(select, 'InTransit');

    expect(mockOnChange).toHaveBeenCalled();
  });

  test('Works with light theme (isDark=false)', () => {
    const { container } = render(
      <StatusEditor
        value="Delivered"
        onChange={mockOnChange}
        isDark={false}
      />
    );

    const wrapper = container.querySelector('div');
    expect(wrapper).toBeInTheDocument();
  });

  test('Works with dark theme (isDark=true)', () => {
    const { container } = render(
      <StatusEditor
        value="InTransit"
        onChange={mockOnChange}
        isDark={true}
      />
    );

    const wrapper = container.querySelector('div');
    expect(wrapper).toBeInTheDocument();
  });

  test('Maintains correct styling structure', () => {
    const { container } = render(
      <StatusEditor
        value="Delivered"
        onChange={mockOnChange}
        isDark={false}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle('display: flex');
    expect(wrapper).toHaveStyle('alignItems: center');
    expect(wrapper).toHaveStyle('height: 100%');
    expect(wrapper).toHaveStyle('width: 100%');
  });
});