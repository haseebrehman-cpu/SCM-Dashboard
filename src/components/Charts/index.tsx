'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export interface EChartProps {
  option: echarts.EChartsCoreOption;
  height?: number | string;
  width?: number | string;
  renderer?: 'canvas' | 'svg';
  className?: string;
  onEvents?: {
    [eventName: string]: (params: any) => void;
  };
}

export default function EChart({ option, height = 300, width = '100%', renderer = 'canvas', className, onEvents }: EChartProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const existing = instanceRef.current ?? echarts.getInstanceByDom(chartRef.current);
    const chart = existing ?? echarts.init(chartRef.current, undefined, { renderer });
    instanceRef.current = chart;
    chart.setOption(option, { notMerge: true, lazyUpdate: true });

    if (onEvents) {
      Object.entries(onEvents).forEach(([eventName, handler]) => {
        chart.off(eventName);
        chart.on(eventName, handler);
      });
    }

    setTimeout(() => {
      if (chart && !chart.isDisposed()) {
        chart.resize();
      }
    }, 0);

    const handleResize = () => {
      if (chart && !chart.isDisposed()) {
        chart.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (chartRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(chartRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      // Clean up event handlers
      if (onEvents && chart && !chart.isDisposed()) {
        Object.keys(onEvents).forEach((eventName) => {
          chart.off(eventName);
        });
      }

      if (chart && !chart.isDisposed()) {
        chart.dispose();
      }
      instanceRef.current = null;
    };
  }, [option, renderer, onEvents]);

  return (
    <div
      ref={chartRef}
      className={className}
      style={{
        width: width === '100%' ? '100%' : typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        minWidth: 0,
        minHeight: 0
      }}
    />
  );
}
