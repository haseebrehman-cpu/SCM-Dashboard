import React from 'react'
import EChart from '../../components/Charts';
import { EChartsOption } from 'echarts';
import { topItemsData } from '../../constants/ChartsConstants';
import { ChartBaseProps } from '../../types/charts';

interface FormatterParams {
  value: number | string;
}

const TopSellingItemsChart: React.FC<ChartBaseProps> = React.memo(({ isDark, commonTooltip, commonGrid }) => {
  // Generate warehouse stock data for each item (60-80% more than sold quantity)
  const itemsWithStock = topItemsData.map(item => ({
    ...item,
    whStock: Math.round(item.value * (1.2 + Math.random() * 0.4))
  }));

  const option: EChartsOption = React.useMemo(() => ({
    title: {
      text: 'Top 20 Best-Selling Items',
      subtext: 'Comparing sold quantity vs warehouse stock (last 60 days)',
      left: 'left',
      textStyle: { color: isDark ? '#f3f4f6' : '#111827', fontSize: 18, fontWeight: 700 },
      subtextStyle: { color: isDark ? '#9ca3af' : '#6b7280', fontSize: 11 },
      top: 10
    },
    tooltip: {
      ...commonTooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: {
        fontSize: '13px',
        fontWeight: 500,
        color: isDark ? '#f3f4f6' : '#111827'
      },
      padding: [8, 12]
    },
    toolbox: {
      right: 20,
      top: 20,
      feature: {
        saveAsImage: { title: 'Save' },
        magicType: { type: ['line', 'bar'], title: { line: 'Line', bar: 'Bar' } },
        restore: { title: 'Restore' }
      },
      iconStyle: { borderColor: isDark ? '#9ca3af' : '#6b7280' }
    },
    dataZoom: [
      {
        type: 'slider',
        yAxisIndex: 0,
        left: 10,
        width: 12,
        start: 0,
        end: 60,
        textStyle: { color: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 },
        borderColor: 'transparent',
        handleSize: '80%',
        handleStyle: {
          color: isDark ? '#6366f1' : '#4f46e5',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowOffsetX: 0,
          shadowOffsetY: 2
        },
        fillerColor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
        backgroundColor: 'transparent'
      },
      { type: 'inside', yAxisIndex: 0, start: 0, end: 60 }
    ],
    legend: {
      top: 50,
      left: 'left',
      textStyle: {
        color: isDark ? '#d1d5db' : '#4b5563',
        fontSize: 12,
        fontWeight: 500
      },
      itemGap: 20,
      padding: [5, 0]
    },
    grid: { ...commonGrid, top: 110, bottom: 20, left: '12%', right: '8%' },
    xAxis: {
      type: 'value',
      axisLabel: { color: isDark ? '#9ca3af' : '#6b7280', fontSize: 11 },
      splitLine: { lineStyle: { color: isDark ? '#2d3748' : '#f0f1f3', type: 'solid', width: 0.5 } },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'category',
      data: itemsWithStock.map(item => item.name),
      axisLabel: {
        color: isDark ? '#d1d5db' : '#374151',
        width: 130,
        overflow: 'truncate',
        fontWeight: 500,
        fontSize: 12
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    },
    series: [
      {
        name: 'Sold Quantity',
        type: 'bar',
        barGap: '30%',
        barWidth: '35%',
        data: itemsWithStock.map((item) => ({
          value: item.value,
          itemStyle: {
            color: isDark ? '#6366f1' : '#3b82f6',
            borderRadius: [0, 3, 3, 0],
            shadowColor: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(59, 130, 246, 0.2)',
            shadowOffsetX: 0,
            shadowOffsetY: 2
          }
        })),
        label: {
          show: true,
          position: 'right',
          color: isDark ? '#e5e7eb' : '#374151',
          formatter: (p: unknown) => {
            const params = p as FormatterParams;
            return typeof params.value === 'number' ? params.value.toLocaleString() : String(params.value);
          },
          fontWeight: 600,
          fontSize: 11,
          distance: 8
        }
      },
      {
        name: 'WH Stock',
        type: 'line',
        barWidth: '35%',
        data: itemsWithStock.map((item) => ({
          value: item.whStock,
          itemStyle: {
            color: isDark ? '#8b5cf6' : '#8b5cf6',
            borderRadius: [0, 3, 3, 0],
            shadowColor: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
            shadowBlur: 4,
            shadowOffsetX: 0,
            shadowOffsetY: 2,
          }
        })),
        label: {
          show: true,
          position: 'right',
          color: isDark ? '#e5e7eb' : '#374151',
          formatter: (p: unknown) => {
            const params = p as FormatterParams;
            return typeof params.value === 'number' ? params.value.toLocaleString() : String(params.value);
          },
          fontWeight: 600,
          fontSize: 11,
          distance: 8
        }
      }
    ]
  }), [isDark, commonTooltip, commonGrid, itemsWithStock]);

  return <EChart option={option} height={400} width="100%" />;
});

export default TopSellingItemsChart
