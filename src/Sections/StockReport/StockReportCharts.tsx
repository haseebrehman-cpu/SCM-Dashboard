import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import InventoryAnalysisChart from './InventoryAnalysisChart';
import AbandonedItemsChart from './AbandonedItemsChart';
import TopSellingItemsChart from './TopSellingItemsChart';
import { ChartColors, ChartGrid, ChartTooltip } from '../../types/charts';
import { useTopSellingChart, useRegionalSummaryChart, useCategoryDistributionChart, ChartFilters } from '../../api/stockReportCharts';
import { Skeleton, Box } from '@mui/material';

interface StockReportChartsProps {
  filters?: ChartFilters;
}

const StockReportCharts = ({ filters }: StockReportChartsProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data: topSellingResponse, isLoading: isTopSellingLoading } = useTopSellingChart(filters);
  const { data: regionalSummaryResponse, isLoading: isRegionalSummaryLoading } = useRegionalSummaryChart(filters);
  const { data: categoryDistributionResponse, isLoading: isCategoryDistributionLoading } = useCategoryDistributionChart(filters);

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

  const renderChart = (isLoading: boolean, component: React.ReactNode, height: number = 400) => {
    if (isLoading) {
      return (
        <Box sx={{ height, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Skeleton variant="text" sx={{ width: '40%', fontSize: '1.5rem' }} />
          <Skeleton variant="text" sx={{ width: '25%', fontSize: '1rem' }} />
          <Skeleton variant="rectangular" height={height - 80} sx={{ borderRadius: 1 }} />
        </Box>
      );
    }
    return component;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Inventory vs Sales Analysis */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
        {renderChart(isRegionalSummaryLoading,
          <InventoryAnalysisChart
            isDark={isDark}
            colors={colors}
            commonTooltip={commonTooltip}
            commonGrid={commonGrid}
            data={regionalSummaryResponse?.data || []}
          />
        )}
      </div>

      {/* Abandoned Items Chart */}
      <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
        {renderChart(isCategoryDistributionLoading,
          <AbandonedItemsChart
            isDark={isDark}
            colors={colors}
            commonTooltip={commonTooltip}
            data={categoryDistributionResponse?.data || []}
          />
        )}
      </div>

      {/* Top Best-Selling Items */}
      <div className="col-span-1 lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
        {renderChart(isTopSellingLoading,
          <TopSellingItemsChart
            isDark={isDark}
            colors={colors}
            commonTooltip={commonTooltip}
            commonGrid={commonGrid}
            data={topSellingResponse?.data || []}
          />
        )}
      </div>
    </div>
  );
};

export default StockReportCharts;
