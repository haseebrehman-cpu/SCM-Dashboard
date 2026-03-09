import React from 'react';
import EChart from '../../components/Charts';
import { EChartsOption } from 'echarts';
import { ChartBaseProps } from '../../types/charts';
import { InTransitVolumeData } from '../../types/Interfaces/interfaces';
import { Skeleton } from '@mui/material';

interface HeatmapDataParams {
  data: [number, number, number | string];
}

interface RegionalCategoryPreferenceProps extends ChartBaseProps {
  data?: InTransitVolumeData[];
  isLoading?: boolean;
}

const RegionalCategoryPreference: React.FC<RegionalCategoryPreferenceProps> = React.memo(({ isDark, colors, commonTooltip, commonGrid, data = [], isLoading }) => {
  const option: EChartsOption = React.useMemo(() => {
    // Process and aggregate data by Region and Category
    const aggregatedMap = new Map<string, number>();
    const regionSet = new Set<string>();
    const categorySet = new Set<string>();

    data.forEach(item => {
      const region = item.container_region || 'Unknown';
      const category = item.category_name || 'Other';
      const key = `${region}|${category}`;
      aggregatedMap.set(key, (aggregatedMap.get(key) || 0) + item.total_intransit_quantity);
      regionSet.add(region);
      categorySet.add(category);
    });

    const regions = Array.from(regionSet).sort();
    const categories = Array.from(categorySet).sort();

    const heatmapData: [number, number, number | string][] = [];
    regions.forEach((region, rIdx) => {
      categories.forEach((category, cIdx) => {
        const val = aggregatedMap.get(`${region}|${category}`);
        heatmapData.push([rIdx, cIdx, val !== undefined ? val : '-']);
      });
    });

    const maxVal = Math.max(...Array.from(aggregatedMap.values()), 1);

    return {
      title: {
        text: 'Regional Category Preferences',
        subtext: 'What categories ship to which regions in what volumes?',
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
        right: 20,
        top: 0,
        feature: {
          saveAsImage: {
            title: 'Save',
            iconStyle: { borderColor: isDark ? '#9ca3af' : '#6b7280' }
          },
          dataZoom: {
            title: { zoom: 'Zoom', back: 'Reset' },
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
        position: 'top',
        formatter: (params: unknown) => {
          const p = params as HeatmapDataParams;
          const [regionIdx, categoryIdx, value] = p.data;
          return `
            <div style="font-family: Inter, sans-serif; padding: 4px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${regions[regionIdx]} - ${categories[categoryIdx]}</div>
              <div style="display: flex; justify-content: space-between; gap: 20px;">
                <span>Volume:</span>
                <span style="font-weight: 700;">${value.toLocaleString()} items</span>
              </div>
            </div>
          `;
        },
        backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        textStyle: { color: isDark ? '#f3f4f6' : '#111827' }
      },
      grid: {
        ...commonGrid,
        top: 100,
        bottom: 120,
        left: '4%',
        right: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: regions,
        name: 'Container Region',
        nameLocation: 'middle',
        nameGap: 45,
        nameTextStyle: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif'
        },
        splitArea: { show: true },
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: 11,
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          margin: 10
        },
        axisLine: { lineStyle: { color: isDark ? '#374151' : '#e5e7eb' } }
      },
      yAxis: {
        type: 'category',
        data: categories,
        name: 'Product Category',
        nameLocation: 'middle',
        nameGap: 140,
        nameTextStyle: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif'
        },
        splitArea: { show: true },
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: 11,
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          margin: 15
        },
        axisLine: { lineStyle: { color: isDark ? '#374151' : '#e5e7eb' } }
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0],
          yAxisIndex: [0],
          start: 0,
          end: 30 // Default state for mouse/pinch zoom
        },
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          bottom: 50,
          height: 20,
          start: 0,
          end: 100, // Show all regions
          borderColor: 'transparent',
          fillerColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
          handleStyle: { color: colors.primary },
          textStyle: { color: isDark ? '#9ca3af' : '#6b7280' }
        },
        {
          type: 'slider',
          show: true,
          yAxisIndex: [0],
          left: 10,
          width: 20,
          start: 0,
          end: 50, // Show half categories
          borderColor: 'transparent',
          fillerColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
          handleStyle: { color: colors.primary },
          textStyle: { color: 'transparent' }
        }
      ],
      visualMap: {
        min: 0,
        max: maxVal,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        itemWidth: 15,
        itemHeight: 250,
        text: ['High Volume', 'Low Volume'],
        textStyle: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif'
        },
        inRange: {
          color: isDark
            ? ['rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 1)']
            : ['#eef2ff', '#4f46e5']
        }
      },
      series: [
        {
          name: 'Category Preference',
          type: 'heatmap',
          data: heatmapData,
          progressive: 1000,
          animation: false,
          label: {
            show: heatmapData.length < 500,
            formatter: (params: unknown) => {
              const p = params as HeatmapDataParams;
              return p.data[2].toString();
            },
            fontSize: 10,
            fontWeight: 500,
            color: isDark ? '#fff' : '#111827'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(0, 0, 0, 0.4)',
              borderWidth: 2,
              borderColor: isDark ? '#fff' : colors.primary
            }
          }
        }
      ]
    };
  }, [isDark, colors, commonTooltip, commonGrid, data]);

  if (isLoading) {
    return <Skeleton variant="rectangular" height={600} width="100%" sx={{ borderRadius: 1 }} />;
  }

  return <EChart option={option} height={800} width="100%" />;
});

export default RegionalCategoryPreference;
