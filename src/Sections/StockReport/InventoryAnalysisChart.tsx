import React from 'react'
import EChart from '../../components/Charts';
import { EChartsOption, BarSeriesOption } from 'echarts';
import { warehouseStockData } from '../../constants/ChartsConstants';
import { ChartBaseProps } from '../../types/charts';

const InventoryAnalysisChart: React.FC<ChartBaseProps> = React.memo(({ isDark, colors, commonTooltip, commonGrid }) => {
  const categories = warehouseStockData.map(item => item.category);

  const option: EChartsOption = React.useMemo(() => {
    const warehouses = ['UK', 'US', 'CA', 'DE'];
    const series: BarSeriesOption[] = [];
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
        tooltip: { valueFormatter: (value: unknown) => `${String(value)} (Last 6 days sold qty)` }
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

    return {
      title: {
        text: 'Inventory WH Stock & Last 60 Days Sales Analysis',
        subtext: 'Comparison by Warehouse per Category',
        left: 'left',
        textStyle: { color: isDark ? '#f3f4f6' : '#111827', fontSize: 18, fontWeight: 700 },
        subtextStyle: { color: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }
      },
      legend: {
        top: 50,
        right: 0,
        textStyle: { color: isDark ? '#9ca3af' : '#6b7280' },
        data: warehouses,
        itemGap: 20
      },
      toolbox: {
        right: 0,
        feature: {
          saveAsImage: { title: 'Save' },
          magicType: { type: ['stack'], title: { stack: 'Stack' } }
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
      grid: { ...commonGrid, top: 100, bottom: 30, left: '5%', right: '5%' },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { color: isDark ? '#9ca3af' : '#6b7280', interval: 0, rotate: 0, fontWeight: 500 },
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
  }, [isDark, colors, commonTooltip, commonGrid, categories]);

  return <EChart option={option} height={400} width="100%" />;
});

export default InventoryAnalysisChart
