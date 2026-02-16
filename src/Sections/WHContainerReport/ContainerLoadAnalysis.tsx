import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import ContainerStackedBar from './ContainerStackedBar';
import { ChartColors, ChartGrid, ChartTooltip } from '../../types/charts';
import ContainerTreemap from './ContainerTreemap';
import RegionalCategoryPreference from './RegionalCategoryPreference';

const ContainerLoadAnalysis: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const colors: ChartColors = React.useMemo(() => ({
    primary: '#6366f1',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    palette: [
      '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
      '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'
    ]
  }), []);

  const commonTooltip: ChartTooltip = React.useMemo(() => ({
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderColor: isDark ? '#374151' : '#e5e7eb',
    textStyle: { color: isDark ? '#f3f4f6' : '#111827' },
    padding: [8, 12],
    extraCssText: 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border-radius: 8px;'
  }), [isDark]);

  const commonGrid: ChartGrid = React.useMemo(() => ({
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  }), []);

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Container Stacked Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
          <ContainerStackedBar
            isDark={isDark}
            colors={colors}
            commonTooltip={commonTooltip}
            commonGrid={commonGrid}
          />
        </div>

        {/* Container Treemap Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
          <ContainerTreemap
            isDark={isDark}
            colors={colors}
            commonTooltip={commonTooltip}
          />
        </div>
      </div>

      {/* Regional Category Preference Heatmap */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
        <RegionalCategoryPreference
          isDark={isDark}
          colors={colors}
          commonTooltip={commonTooltip}
          commonGrid={commonGrid}
        />
      </div>
    </div>
  );
};

export default ContainerLoadAnalysis;
