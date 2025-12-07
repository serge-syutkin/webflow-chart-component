import React, { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import './style.css';

Chart.register(DoughnutController, ArcElement, Tooltip);

interface RoundChartProps {
  value?: number;
  chartColor?: string;
  baseColor?: string;
  chartType?: 'Doughnut' | 'Pie';
  angle?: '180' | '360';
  caption?: string;
  sourceText?: string;
  sourceLink?: any; // Webflow link prop type
  mainText?: string;
}

export const RoundChart: React.FC<RoundChartProps> = ({
  value = 75,
  chartColor = '#007bff',
  baseColor = '#e9ecef',
  chartType = 'Doughnut',
  angle = '360',
  caption = '% of customers who use channels in a single transaction',
  sourceText = 'Bloomberg',
  sourceLink = { href: '#' },
  mainText = '75',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Helper to resolve CSS variables
    const resolveColor = (color: string) => {
      if (color.startsWith('var(')) {
        const varName = color.match(/--[a-zA-Z0-9-]+/)?.[0];
        if (varName) {
          return getComputedStyle(containerRef.current!).getPropertyValue(varName).trim();
        }
      }
      return color;
    };

    const resolvedChartColor = resolveColor(chartColor);
    const resolvedBaseColor = resolveColor(baseColor);

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const data = {
      datasets: [
        {
          data: [value, 100 - value],
          backgroundColor: [resolvedChartColor, resolvedBaseColor],
          borderWidth: 0,
        },
      ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: chartType === 'Doughnut' ? '70%' : '0%',
        rotation: angle === '180' ? -90 : 0,
        circumference: angle === '180' ? 180 : 360,
        tooltips: {
            enabled: false,
        },
    };

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options,
    });

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [value, chartColor, baseColor, chartType, angle]);

  return (
    <div className="chart-container" ref={containerRef}>
      <div>
        <div className="chart-wrapper" style={{ aspectRatio: angle === '180' ? '2 / 1' : '1 / 1' }}>
            <canvas ref={canvasRef}></canvas>
            <div className={`center-text ${angle === '180' ? 'bottom' : ''}`} style={{ fontSize: '3em' }}>
                {mainText || `${value}`}
            </div>
        </div>
      </div>
      <div>
        <div className="caption-text">{caption}</div>
        <div className="source-text">
            <a href={sourceLink?.href}>{sourceText}</a>
        </div>
      </div>
    </div>
  );
};