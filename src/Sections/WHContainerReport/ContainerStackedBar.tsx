import React from 'react'
import EChart from '../../components/Charts';
import { EChartsOption, BarSeriesOption } from 'echarts';
import { containerLoadData } from '../../mockData/containerLoadAnalysisMock';
import { ChartBaseProps } from '../../types/charts';

const ContainerStackedBar: React.FC<ChartBaseProps> = React.memo(({ isDark, colors, commonTooltip, commonGrid }) => {
  const option: EChartsOption = React.useMemo(() => {
    const containers = Array.from(new Set(containerLoadData.map(d => d.containerNumber)));
    const categories = Array.from(new Set(containerLoadData.map(d => d.categoryName)));

    const series: BarSeriesOption[] = categories.map((category, index) => {
      const isTop = index === categories.length - 1;

      return {
        name: category,
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        barWidth: '40%',
        data: containers.map(container => {
          const item = containerLoadData.find(d => d.containerNumber === container && d.categoryName === category);
          return item ? item.value : 0;
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
          dataView: {
            title: 'Data',
            readOnly: false,
            lang: ['Data View', 'Close', 'Update'],
            iconStyle: { borderColor: isDark ? '#9ca3af' : '#6b7280' }
          },
          magicType: {
            type: ['line', 'bar', 'stack'],
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
          end: 100
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
          textStyle: { color: isDark ? '#9ca3af' : '#6b7280' }
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
          fontFamily: 'Inter, sans-serif'
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
  }, [isDark, colors, commonTooltip, commonGrid]);

  return <EChart option={option} height={550} width="100%" />;
});

export default ContainerStackedBar
