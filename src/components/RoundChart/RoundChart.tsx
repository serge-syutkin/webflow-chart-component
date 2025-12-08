import React, { useEffect, useRef, useState } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import './style.css';

// Custom plugin for rounded caps
const roundedCaps = {
  id: 'roundedCaps',
  afterDraw: (chart: Chart) => {
    if (chart.config.options?.plugins?.roundedCaps?.disabled) {
      return;
    }
    const ctx = chart.ctx;
    chart.getDatasetMeta(0).data.forEach((arc, index) => {
      if (index > 0) return; // Only apply to the first data point (the active value)

      const { x, y, startAngle, endAngle, outerRadius, innerRadius } = arc;
      const arcThickness = outerRadius - innerRadius;
      const capRadius = arcThickness / 2;
      const angleMid = startAngle + (endAngle - startAngle) / 2;

      // Don't draw caps if the arc is a full circle
      if (endAngle - startAngle >= Math.PI * 2 - 0.01) {
          return;
      }
      
      ctx.save();
      ctx.fillStyle = (chart.data.datasets[0].backgroundColor as string[])[index];

      // Draw start cap
      const startX = x + Math.cos(startAngle) * (innerRadius + capRadius);
      const startY = y + Math.sin(startAngle) * (innerRadius + capRadius);
      ctx.beginPath();
      ctx.arc(startX, startY, capRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw end cap
      const endX = x + Math.cos(endAngle) * (innerRadius + capRadius);
      const endY = y + Math.sin(endAngle) * (innerRadius + capRadius);
      ctx.beginPath();
      ctx.arc(endX, endY, capRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  },
};

Chart.register(DoughnutController, ArcElement, Tooltip, roundedCaps);

interface RoundChartProps {
  value?: number;
  chartColor?: string;
  baseColor?: string;
  chartType?: 'Doughnut' | 'Pie';
  angle?: '180' | '360';
  borderStyle?: 'Default' | 'Rounded';
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
  borderStyle = 'Default',
  caption = '% of customers who use channels in a single transaction',
  sourceText = 'Bloomberg',
  sourceLink = { href: '#' },
  mainText = '75',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '0px 0px -25% 0px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isIntersecting || !canvasRef.current || !containerRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

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
        plugins: {
            roundedCaps: {
                disabled: chartType !== 'Doughnut' || borderStyle !== 'Rounded'
            }
        }
    };

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isIntersecting, value, chartColor, baseColor, chartType, angle, borderStyle]);

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
      <div className="text-container">
        <div className="caption-text">{caption}</div>
        <div className="source-text">
            {sourceLink?.href && sourceLink.href !== '#' ? (
                <a href={sourceLink.href}>{sourceText}</a>
            ) : (
                <span>{sourceText}</span>
            )}
        </div>
      </div>
    </div>
  );
};