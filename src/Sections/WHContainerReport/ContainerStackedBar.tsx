import React from 'react';
import EChart from '../../components/Charts';
import { EChartsOption, BarSeriesOption } from 'echarts';
import { ChartBaseProps } from '../../types/charts';
import { Skeleton } from '@mui/material';
import { InTransitVolumeData } from '../../types/Interfaces/interfaces';

interface ContainerStackedBarProps extends ChartBaseProps {
  data?: InTransitVolumeData[];
  isLoading?: boolean;
}

interface BarTooltipParams {
  marker: string;
  seriesName: string;
  value: number;
  axisValue: string;
}

const ContainerStackedBar: React.FC<ContainerStackedBarProps> = ({ isDark, colors, commonTooltip, commonGrid, data = [], isLoading }) => {
  const option: EChartsOption = React.useMemo(() => {
    // Map container to its region for easy lookup
    const containerRegionMap = new Map<string, string>();
    data.forEach(d => containerRegionMap.set(d.container_name, d.container_region));

    const containers = Array.from(new Set(data.map(d => d.container_name)));
    const categories = Array.from(new Set(data.map(d => d.category_name)));

    const series: BarSeriesOption[] = categories.map((category, index) => {
      const isTop = index === categories.length - 1;

      return {
        name: category,
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        barWidth: '40%',
        data: containers.map(container => {
          const item = data.find(d => d.container_name === container && d.category_name === category);
          return item ? item.total_intransit_quantity : 0;
        }),
        itemStyle: {
          color: colors.palette[index % colors.palette.length],
          borderRadius: isTop ? [4, 4, 0, 0] : [0, 0, 0, 0]
        }
      };
    });

    return {
      title: {
        text: 'Total In-Transit Volume per Container',
        subtext: 'Distribution by Product Category',
        left: 'left',
        textStyle: {
          color: isDark ? '#f3f4f6' : '#111827',
          fontSize: 18,
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif'
        },
        subtextStyle: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: 12,
          fontFamily: 'Inter, sans-serif'
        }
      },
      toolbox: {
        right: 10,
        feature: {
          saveAsImage: {
            title: 'Save',
            iconStyle: { borderColor: isDark ? '#9ca3af' : '#6b7280' }
          },
          magicType: {
            type: ['line', 'bar'],
            title: { line: 'Line', bar: 'Bar', stack: 'Stack' },
            iconStyle: { borderColor: isDark ? '#9ca3af' : '#6b7280' }
          },
          restore: {
            title: 'Restore',
            iconStyle: { borderColor: isDark ? '#9ca3af' : '#6b7280' }
          }
        }
      },
      tooltip: {
        ...commonTooltip,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        padding: [12, 16],
        borderRadius: 8,
        borderWidth: 1,
        borderColor: isDark ? '#374151' : '#e5e7eb',
        textStyle: {
          color: isDark ? '#f3f4f6' : '#111827',
          fontSize: 12,
          fontFamily: 'Inter, sans-serif'
        },
        formatter: (params: unknown) => {
          const tooltipParams = params as BarTooltipParams[];
          const containerName = tooltipParams[0].axisValue;
          const region = containerRegionMap.get(containerName) || 'Unknown';
          let res = `<div style="font-weight: 700; margin-bottom: 8px;">${containerName} (${region})</div>`;
          tooltipParams.forEach((item) => {
            if (item.value > 0) {
              res += `<div style="display: flex; justify-content: space-between; gap: 20px;">
                <span>${item.marker} ${item.seriesName}</span>
                <span style="font-weight: 700;">${item.value.toLocaleString()}</span>
              </div>`;
            }
          });
          return res;
        }
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        bottom: 10,
        left: 'center',
        textStyle: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif'
        },
        icon: 'circle',
        itemGap: 15,
        pageIconColor: isDark ? '#9ca3af' : '#6b7280',
        pageTextStyle: { color: isDark ? '#9ca3af' : '#6b7280' }
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 0,
          end: 50
        },
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          bottom: 45,
          height: 15,
          borderColor: 'transparent',
          fillerColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
          handleStyle: { color: colors.primary },
          textStyle: { color: isDark ? '#9ca3af' : '#6b7280' },
          start: 0,
          end: 50
        }
      ],
      grid: {
        ...commonGrid,
        top: 100,
        bottom: 110,
        left: '5%',
        right: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: containers,
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          rotate: 45,
          fontSize: 11,
          fontWeight: 500,
          margin: 15,
          fontFamily: 'Inter, sans-serif',
          formatter: (value: string) => {
            const region = containerRegionMap.get(value);
            return region ? `${value}\n(${region})` : value;
          }
        },
        axisLine: { lineStyle: { color: isDark ? '#374151' : '#e5e7eb' } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        name: 'Total Quantity',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif'
        },
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif'
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#374151' : '#f3f4f6',
            type: 'dashed'
          }
        },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series: series
    };
  }, [isDark, colors, commonTooltip, commonGrid, data]);

  if (isLoading) {
    return <Skeleton variant="rectangular" height={550} width="100%" sx={{ borderRadius: 1 }} />;
  }

  return <EChart option={option} height={550} width="100%" />;
};


export default ContainerStackedBar
