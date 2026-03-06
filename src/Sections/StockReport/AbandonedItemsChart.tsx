import React from 'react'
import EChart from '../../components/Charts';
import { EChartsOption } from 'echarts';
import { ChartBaseProps } from '../../types/charts';
import { CategoryDistributionItem } from '../../types/Interfaces/interfaces';

interface AbandonedItemsChartProps extends ChartBaseProps {
  data: CategoryDistributionItem[];
}

interface PieFormatterParams {
  name: string;
  value: number;
  percent: number;
  color: string;
  data: CategoryDistributionItem;
}

const AbandonedItemsChart: React.FC<AbandonedItemsChartProps> = React.memo(({ isDark, colors, commonTooltip, data }) => {
  // Filter out items with 0 stock to make the chart cleaner
  const filteredData = React.useMemo(() => data.filter(item => item.total_available > 0), [data]);

  const option: EChartsOption = React.useMemo(() => ({
    title: {
      text: 'Top 20 Abandoned Items by Available Inventory',
      subtext: 'Items with available stock and details',
      left: 'left',
      top: 'top',
      textStyle: { color: isDark ? '#f3f4f6' : '#111827', fontSize: 18, fontWeight: 700 },
      subtextStyle: { color: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }
    },
    tooltip: {
      trigger: 'item',
      ...commonTooltip,
      formatter: (p: unknown) => {
        const params = p as PieFormatterParams;
        return `<div class="font-semibold mb-1 text-base">${params.name}</div>
                 <div class="flex flex-col gap-1">
                   <div class="flex items-center gap-2">
                     <span class="w-2 h-2 rounded-full" style="background-color:${params.color}"></span>
                     <span class="text-sm">Available Stock:</span>
                     <span class="text-sm font-bold text-blue-500">${params.value.toLocaleString()}</span>
                   </div>
                   <div class="text-xs text-gray-500 ml-4">Last 60 Days Sales: ${params.data.total_sold_quantity.toLocaleString()}</div>
                 </div>`;
      }
    },
    legend: {
      type: 'scroll',
      show: true,
      orient: 'vertical',
      right: -25,
      top: 60,
      bottom: 20,
      itemGap: 10,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: isDark ? '#9ca3af' : '#6b7280', fontSize: 11 },
      pageIconColor: isDark ? '#6366f1' : '#4f46e5',
      pageTextStyle: { color: isDark ? '#9ca3af' : '#6b7280' }
    },
    toolbox: {
      show: true,
      top: 0,
      right: 10,
      feature: {
        saveAsImage: { show: true, title: 'Save' },
        restore: { title: 'Restore' }
      },
      iconStyle: { borderColor: isDark ? '#9ca3af' : '#6b7280' }
    },
    series: [
      {
        name: 'Stock Distribution',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '60%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: isDark ? '#1f2937' : '#fff',
          borderWidth: 2
        },
        label: { show: false, position: 'center' },
        emphasis: {
          scale: true,
          scaleSize: 10,
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: isDark ? '#f3f4f6' : '#111827'
          }
        },
        labelLine: { show: false },
        data: filteredData.map((item, index) => ({
          ...item,
          value: item.total_available,
          name: item.item_number,
          itemStyle: { color: colors.palette[index % colors.palette.length] }
        }))
      }
    ]
  }), [isDark, colors, commonTooltip, filteredData]);

  return <EChart option={option} height={400} width="100%" />;
});

export default AbandonedItemsChart
