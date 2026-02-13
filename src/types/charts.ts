export interface ChartColors {
  primary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  palette: string[];
}

export interface ChartTooltip {
  backgroundColor: string;
  borderColor: string;
  textStyle: {
    color: string;
  };
  padding: number[];
  extraCssText: string;
}

export interface ChartGrid {
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  top?: string | number;
  containLabel?: boolean;
}

export interface ChartBaseProps {
  isDark: boolean;
  colors: ChartColors;
  commonTooltip: ChartTooltip;
  commonGrid?: ChartGrid;
}
