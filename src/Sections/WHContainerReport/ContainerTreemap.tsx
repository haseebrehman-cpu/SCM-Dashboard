import React from 'react'
import EChart from '../../components/Charts';
import { EChartsOption, TreemapSeriesOption } from 'echarts';
import { containerLoadData } from '../../mockData/containerLoadAnalysisMock';
import { ChartBaseProps } from '../../types/charts';

interface TreemapNode {
  name: string;
  value?: number;
  children?: TreemapNode[];
}

interface TreemapFormatterParams {
  name: string;
  value: number;
  treePathInfo: {
    name: string;
    dataIndex: number;
    value: number;
  }[];
}

const ContainerTreemap: React.FC<ChartBaseProps> = React.memo(({ isDark, commonTooltip }) => {
  const option: EChartsOption = React.useMemo(() => {
    // Group data by Container Number
    const groupedData = containerLoadData.reduce((acc, curr) => {
      if (!acc[curr.containerNumber]) {
        acc[curr.containerNumber] = {
          name: curr.containerNumber,
          children: []
        };
      }
      acc[curr.containerNumber].children?.push({
        name: curr.categoryName,
        value: curr.value
      });
      return acc;
    }, {} as Record<string, TreemapNode>);

    const data = Object.values(groupedData);

    const series: TreemapSeriesOption[] = [
      {
        name: 'Container Volume',
        type: 'treemap',
        top: 110,
        bottom: 30,
        left: 0,
        right: 0,
        leafDepth: 1,
        visualDimension: 0,
        visualMin: 0,
        visualMax: 2000,
        breadcrumb: {
          show: true,
          bottom: 0,
          height: 22,
          itemStyle: {
            color: 'transparent',
            borderWidth: 0,
            textStyle: {
              color: isDark ? '#9ca3af' : '#6b7280',
              fontSize: 11,
              fontFamily: 'Inter, sans-serif'
            }
          }
        },
        label: {
          show: true,
          formatter: '{b}\n{c}',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif'
        },
        upperLabel: {
          show: true,
          height: 28,
          color: isDark ? '#f3f4f6' : '#111827',
          fontWeight: 700,
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          padding: [0, 10]
        },
        itemStyle: {
          borderColor: isDark ? '#1f2937' : '#fff',
          borderWidth: 2,
          gapWidth: 4
        },
        levels: [
          {
            itemStyle: {
              borderColor: isDark ? '#111827' : '#f9fafb',
              borderWidth: 0,
              gapWidth: 10
            },
            upperLabel: {
              show: false
            }
          },
          {
            itemStyle: {
              borderColor: isDark ? '#1f2937' : '#fff',
              borderWidth: 4,
              gapWidth: 4
            },
            upperLabel: {
              show: true
            }
          },
          {
            colorSaturation: [0.3, 0.5],
            itemStyle: {
              borderWidth: 2,
              gapWidth: 2,
              borderColorSaturation: 0.6
            }
          }
        ],
        data: data
      }
    ];

    return {
      title: {
        text: 'Volume Distribution by Container',
        subtext: 'Drill-down: Click container to see detailed breakdown',
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
          restore: {
            title: 'Restore',
            iconStyle: { borderColor: isDark ? '#9ca3af' : '#6b7280' }
          }
        }
      },
      tooltip: {
        ...commonTooltip,
        formatter: (params: unknown) => {
          const p = params as TreemapFormatterParams;
          const value = p.value;
          const name = p.name;
          const treePathInfo = p.treePathInfo;
          const path = treePathInfo ? treePathInfo.slice(1).map(node => node.name).join(' > ') : name;

          return `
            <div style="font-family: Inter, sans-serif; padding: 4px;">
              <div style="font-weight: 700; font-size: 13px; margin-bottom: 8px; color: ${isDark ? '#f3f4f6' : '#111827'};">
                ${path}
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 20px;">
                <span style="color: ${isDark ? '#9ca3af' : '#6b7280'}; font-size: 12px;">Volume</span>
                <span style="font-weight: 700; color: ${isDark ? '#f3f4f6' : '#111827'}; font-size: 13px;">${value.toLocaleString()}</span>
              </div>
            </div>
          `;
        }
      },
      series: series
    };
  }, [isDark, commonTooltip]);

  return <EChart option={option} height={550} width="100%" />;
});

export default ContainerTreemap

