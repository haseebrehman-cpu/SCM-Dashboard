import React from 'react'
import EChart from '../../components/Charts';
import { EChartsOption } from 'echarts';
import { abandonedData } from '../../constants/ChartsConstants';
import { ChartBaseProps } from '../../types/charts';

interface PieFormatterParams {
  name: string;
  value: number;
  percent: number;
  color: string;
}

const AbandonedItemsChart: React.FC<ChartBaseProps> = React.memo(({ isDark, colors, commonTooltip }) => {
  const option: EChartsOption = React.useMemo(() => ({
    title: {
      text: 'Abandoned Items',
      subtext: 'Distribution by Category',
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
        return `<div class="font-semibold mb-1">${params.name}</div>
                 <div class="flex items-center gap-2">
                   <span class="w-2 h-2 rounded-full" style="background-color:${params.color}"></span>
                   <span class="text-sm">WH Stock:</span>
                   <span class="text-sm">${params.value.toLocaleString()}</span>
                   <span class="text-xs text-gray-500">(${params.percent}%)</span>
                 </div>`;
      }
    },
    legend: {
      show: true,
      orient: 'vertical',
      right: 0,
      top: 'middle',
      itemGap: 10,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: isDark ? '#9ca3af' : '#6b7280' }
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true, title: 'Save' },
      },
      iconStyle: { borderColor: isDark ? '#9ca3af' : '#6b7280' }
    },
    series: [
      {
        name: 'Abandoned Items',
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
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
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#f3f4f6' : '#111827'
          }
        },
        labelLine: { show: false },
        data: abandonedData.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: colors.palette[index % colors.palette.length] }
        }))
      }
    ]
  }), [isDark, colors, commonTooltip]);

  return <EChart option={option} height={400} width="100%" />;
});

export default AbandonedItemsChart
