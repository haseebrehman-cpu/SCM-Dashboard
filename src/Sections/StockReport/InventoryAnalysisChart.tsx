import React from 'react'
import EChart from '../../components/Charts';
import { EChartsOption, BarSeriesOption, LineSeriesOption } from 'echarts';
import { ChartBaseProps } from '../../types/charts';
import { RegionalSummaryItem } from '../../types/Interfaces/interfaces';

interface InventoryAnalysisChartProps extends ChartBaseProps {
  data: RegionalSummaryItem[];
}

const InventoryAnalysisChart: React.FC<InventoryAnalysisChartProps> = React.memo(({ isDark, colors, commonTooltip, commonGrid, data }) => {

  const warehouseStockData = React.useMemo(() => {
    const grouped: Record<string, { category: string, sold: Record<string, number>, available: Record<string, number> }> = {};

    data.forEach(item => {
      const normalizedCategory = item.category_name.trim().toUpperCase();
      if (!grouped[normalizedCategory]) {
        grouped[normalizedCategory] = {
          category: normalizedCategory,
          sold: {},
          available: {}
        };
      }
      grouped[normalizedCategory].sold[item.warehouse_code] = item.sold_last_60_days;
      grouped[normalizedCategory].available[item.warehouse_code] = item.total_available;
    });

    return Object.values(grouped);
  }, [data]);

  const categories = React.useMemo(() => warehouseStockData.map(item => item.category), [warehouseStockData]);

  const option: EChartsOption = React.useMemo(() => {
    const warehouses = ['UK', 'US', 'CA', 'DE'];
    const series: (BarSeriesOption | LineSeriesOption)[] = [];
    warehouses.forEach((wh, index) => {
      // Stack 1: Sold  
      series.push({
        name: wh,
        type: 'bar',
        stack: 'Sold',
        data: warehouseStockData.map(item => (item.sold as Record<string, number>)[wh] || 0),
        itemStyle: {
          color: colors.palette[index % colors.palette.length],
          borderRadius: index === warehouses.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0],
        },
        tooltip: { valueFormatter: (value: unknown) => `${String(value)} (Last 60 days sold qty)` }
      });
      // Stack 2: Available
      series.push({
        name: wh,
        type: 'bar',
        stack: 'Available',
        data: warehouseStockData.map(item => (item.available as Record<string, number>)[wh] || 0),
        itemStyle: {
          color: colors.palette[index % colors.palette.length],
          opacity: 0.5,
          borderRadius: index === warehouses.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0],
        },
        tooltip: { valueFormatter: (value: unknown) => `${String(value)} (Available current day)` }
      });
    });

    // Overall Summary Metrics
    series.push({
      name: 'All WH Stock',
      type: 'line',
      smooth: true,
      data: warehouseStockData.map(item =>
        Object.values(item.available as Record<string, number>).reduce((acc, curr) => acc + curr, 0)
      ),
      itemStyle: { color: isDark ? '#10b981' : '#059669' },
      symbol: 'circle',
      symbolSize: 8,
      tooltip: { valueFormatter: (value: unknown) => `${String(value)} (Total Available)` }
    });

    series.push({
      name: 'Overall last 60 days sales',
      type: 'line',
      smooth: true,
      data: warehouseStockData.map(item =>
        Object.values(item.sold as Record<string, number>).reduce((acc, curr) => acc + curr, 0)
      ),
      itemStyle: { color: isDark ? '#f59e0b' : '#d97706' },
      symbol: 'diamond',
      symbolSize: 8,
      tooltip: { valueFormatter: (value: unknown) => `${String(value)} (Total Sold - Last 60 Days)` }
    });

    return {
      title: {
        text: 'Regional Warehouse Inventory & Last 60-Day Sales Analysis',
        subtext: 'Comparison by Warehouse per Category',
        left: 'left',
        textStyle: { color: isDark ? '#f3f4f6' : '#111827', fontSize: 18, fontWeight: 700 },
        subtextStyle: { color: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }
      },
      legend: {
        top: 50,
        right: 0,
        textStyle: { color: isDark ? '#9ca3af' : '#6b7280' },
        data: [...warehouses, 'All WH Stock', 'Overall last 60 days sales'],
        itemGap: 20
      },
      toolbox: {
        right: 0,
        feature: {
          saveAsImage: { title: 'Save' },
          magicType: { type: ['line', 'bar'], title: { stack: 'Stack' } },
          restore: { title: 'Restore' }
        },
        iconStyle: { borderColor: isDark ? '#9ca3af' : '#6b7280' }
      },
      tooltip: {
        ...commonTooltip,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        textStyle: {
          fontSize: 12,
          fontWeight: 500
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: categories.length > 20 ? (20 / categories.length) * 100 : 100,
          height: 20,
          bottom: 10,
          borderColor: 'transparent',
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          fillerColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
          handleStyle: { color: colors.primary },
          textStyle: { color: isDark ? '#9ca3af' : '#6b7280' }
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 0,
          end: categories.length > 20 ? (20 / categories.length) * 100 : 100,
        }
      ],
      grid: { ...commonGrid, top: 110, bottom: 60, left: '5%', right: '5%' },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          interval: 0,
          rotate: 45,
          fontWeight: 500,
          fontSize: 10
        },
        axisLine: { lineStyle: { color: isDark ? '#374151' : '#e5e7eb' } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        name: 'Quantity',
        nameTextStyle: { color: isDark ? '#9ca3af' : '#6b7280', padding: [0, 20, 0, 0] },
        axisLabel: { color: isDark ? '#9ca3af' : '#6b7280' },
        splitLine: { lineStyle: { color: isDark ? '#374151' : '#f3f4f6', type: 'dashed' } }
      },
      series
    };
  }, [isDark, colors, commonTooltip, commonGrid, categories, warehouseStockData]);

  return <EChart option={option} height={600} width="100%" />;
});

export default InventoryAnalysisChart;
