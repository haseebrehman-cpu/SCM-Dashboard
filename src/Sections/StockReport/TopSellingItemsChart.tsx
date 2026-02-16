import React from 'react'
import EChart from '../../components/Charts';
import { EChartsOption } from 'echarts';
import { topItemsData } from '../../constants/ChartsConstants';
import { ChartBaseProps } from '../../types/charts';

interface FormatterParams {
  value: number | string;
}

const TopSellingItemsChart: React.FC<ChartBaseProps> = React.memo(({ isDark, colors, commonTooltip, commonGrid }) => {
  const option: EChartsOption = React.useMemo(() => ({
    title: {
      text: 'Top 20 Best-Selling Items',
      subtext: 'Ranked by total sales volume (last 60 days)',
      left: 'left',
      textStyle: { color: isDark ? '#f3f4f6' : '#111827', fontSize: 18, fontWeight: 700 },
      subtextStyle: { color: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }
    },
    tooltip: {
      ...commonTooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      textStyle: {
        fontSize: '12px',
        fontWeight: 500
      }
    },
    toolbox: {
      right: 0,
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
        width: 15,
        start: 0,
        end: 60,
        textStyle: { color: isDark ? '#9ca3af' : '#6b7280' },
        borderColor: 'transparent',
        handleSize: '80%',
        handleStyle: {
          color: isDark ? '#4b5563' : '#d1d5db',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        fillerColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
        backgroundColor: isDark ? '#1f2937' : '#f9fafb'
      },
      { type: 'inside', yAxisIndex: 0, start: 0, end: 60 }
    ],
    grid: { ...commonGrid, top: 80, bottom: 20, left: '8%' },
    xAxis: {
      type: 'value',
      axisLabel: { color: isDark ? '#9ca3af' : '#6b7280' },
      splitLine: { lineStyle: { color: isDark ? '#374151' : '#f3f4f6', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'category',
      data: topItemsData.map(item => item.name),
      axisLabel: {
        color: isDark ? '#9ca3af' : '#6b7280',
        width: 120,
        overflow: 'truncate',
        fontWeight: 500
      },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      {
        name: 'Sold Quantity',
        type: 'bar',
        barWidth: '60%',
        data: topItemsData.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: colors.palette[index % colors.palette.length],
            borderRadius: [0, 4, 4, 0]
          }
        })),
        label: {
          show: true,
          position: 'right',
          color: isDark ? '#f3f4f6' : '#374151',
          formatter: (p: unknown) => {
            const params = p as FormatterParams;
            return typeof params.value === 'number' ? params.value.toLocaleString() : String(params.value);
          },
          fontWeight: 600
        }
      }
    ]
  }), [isDark, colors, commonTooltip, commonGrid]);

  return <EChart option={option} height={400} width="100%" />;
});

export default TopSellingItemsChart
