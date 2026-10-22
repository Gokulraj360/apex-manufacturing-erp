'use client';

import React, { useState, useMemo, useRef } from 'react';

export interface LineChartSeries {
  key: string;
  name: string;
  color: string; // e.g. '#3b82f6' or 'rgb(59, 130, 246)'
  strokeWidth?: number;
  isDashed?: boolean;
}

export interface LineChartProps {
  data: Record<string, any>[];
  series: LineChartSeries[];
  xAxisKey?: string;
  height?: number;
  title?: string;
  subtitle?: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, key: string) => string;
  showGrid?: boolean;
  showArea?: boolean;
}

export function LineChart({
  data,
  series,
  xAxisKey = 'label',
  height = 260,
  title,
  subtitle,
  yAxisFormatter = (v) => v.toLocaleString(),
  tooltipFormatter = (v) => v.toLocaleString(),
  showGrid = true,
  showArea = true,
}: LineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Layout dimensions for SVG viewBox
  const viewBoxWidth = 800;
  const viewBoxHeight = height;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = viewBoxWidth - padding.left - padding.right;
  const chartHeight = viewBoxHeight - padding.top - padding.bottom;

  // Calculate Y-axis domain
  const { minY, maxY } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    data.forEach((d) => {
      series.forEach((s) => {
        const val = Number(d[s.key] ?? 0);
        if (val < min) min = val;
        if (val > max) max = val;
      });
    });

    if (min === Infinity || max === -Infinity) {
      return { minY: 0, maxY: 100 };
    }

    // Give 10% breathing room on top and round min to 0 if positive
    const effectiveMin = min >= 0 ? 0 : min * 1.1;
    const effectiveMax = max * 1.1;
    return { minY: effectiveMin, maxY: effectiveMax };
  }, [data, series]);

  // Y-axis tick intervals (5 ticks)
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      ticks.push(minY + (i * (maxY - minY)) / (count - 1));
    }
    return ticks;
  }, [minY, maxY]);

  // Coordinate conversion helpers
  const getX = (index: number) => {
    if (data.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    if (maxY === minY) return padding.top + chartHeight / 2;
    return padding.top + chartHeight - ((val - minY) / (maxY - minY)) * chartHeight;
  };

  // Generate SVG path strings
  const paths = useMemo(() => {
    return series.map((s) => {
      if (data.length === 0) return { line: '', area: '', color: s.color, key: s.key, points: [] };

      const points = data.map((d, i) => ({
        x: getX(i),
        y: getY(Number(d[s.key] ?? 0)),
      }));

      // Generate smooth cubic bezier curve
      let linePath = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? 0 : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }

      // Close path for gradient area
      const bottomY = padding.top + chartHeight;
      const areaPath = `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;

      return { line: linePath, area: areaPath, color: s.color, key: s.key, points };
    });
  }, [data, series, minY, maxY]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current || data.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const scaleX = viewBoxWidth / rect.width;
    const svgX = clientX * scaleX;

    // Find closest data point
    let closestIndex = 0;
    let closestDist = Infinity;
    data.forEach((_, i) => {
      const x = getX(i);
      const dist = Math.abs(x - svgX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });

    setHoverIndex(closestIndex);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const activeItem = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div className="w-full bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm transition-colors">
      {/* Chart Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          {title && (
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div ref={containerRef} className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {series.map((s) => (
              <linearGradient
                key={`grad-${s.key}`}
                id={`grad-${s.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          {/* Background Grid Lines */}
          {showGrid &&
            yTicks.map((tick, i) => {
              const y = getY(tick);
              return (
                <g key={`grid-${i}`}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + chartWidth}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800/80"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  {/* Y Axis Labels */}
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono"
                  >
                    {yAxisFormatter(tick)}
                  </text>
                </g>
              );
            })}

          {/* Area Gradients */}
          {showArea &&
            paths.map((p) => (
              <path
                key={`area-${p.key}`}
                d={p.area}
                fill={`url(#grad-${p.key})`}
                className="transition-opacity duration-300"
              />
            ))}

          {/* Data Lines */}
          {paths.map((p) => (
            <path
              key={`line-${p.key}`}
              d={p.line}
              fill="none"
              stroke={p.color}
              strokeWidth={series.find((s) => s.key === p.key)?.strokeWidth || 2.5}
              strokeDasharray={series.find((s) => s.key === p.key)?.isDashed ? '4 4' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            // Show every Nth label if too many items
            const step = Math.ceil(data.length / 8);
            if (i % step !== 0 && i !== data.length - 1) return null;

            const x = getX(i);
            const y = padding.top + chartHeight + 22;
            const isHovered = hoverIndex === i;

            return (
              <text
                key={`x-label-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                className={`text-[11px] transition-colors ${
                  isHovered
                    ? 'fill-blue-600 dark:fill-blue-400 font-bold'
                    : 'fill-slate-400 dark:fill-slate-500 font-medium'
                }`}
              >
                {d[xAxisKey]}
              </text>
            );
          })}

          {/* Hover Crosshair & Dots */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + chartHeight}
                stroke="currentColor"
                className="text-slate-300 dark:text-slate-700"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              {paths.map((p) => {
                const pt = p.points?.[hoverIndex];
                if (!pt) return null;
                return (
                  <g key={`dot-${p.key}`}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="6"
                      fill={p.color}
                      className="opacity-25"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="3.5"
                      fill="#ffffff"
                      stroke={p.color}
                      strokeWidth="2.5"
                    />
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activeItem && hoverIndex !== null && (
          <div
            className="absolute z-20 pointer-events-none transition-all duration-75"
            style={{
              left: `${(getX(hoverIndex) / viewBoxWidth) * 100}%`,
              top: '10px',
              transform:
                hoverIndex > data.length / 2
                  ? 'translate(-105%, 0)'
                  : 'translate(5%, 0)',
            }}
          >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-3 min-w-[150px] text-xs">
              <div className="font-semibold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-100 dark:border-slate-800 mb-2">
                {activeItem[xAxisKey]}
              </div>
              <div className="space-y-1.5">
                {series.map((s) => {
                  const val = Number(activeItem[s.key] ?? 0);
                  return (
                    <div key={s.key} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="text-slate-500 dark:text-slate-400">
                          {s.name}:
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {tooltipFormatter(val, s.key)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
