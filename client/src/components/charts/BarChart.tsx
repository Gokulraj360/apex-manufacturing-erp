'use client';

import React, { useState, useMemo, useRef } from 'react';

export interface BarChartSeries {
  key: string;
  name: string;
  color: string;
}

export interface BarChartProps {
  data: Record<string, any>[];
  series: BarChartSeries[];
  xAxisKey?: string;
  mode?: 'grouped' | 'stacked';
  height?: number;
  title?: string;
  subtitle?: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, key: string) => string;
  showGrid?: boolean;
  targetLine?: {
    value: number;
    label: string;
    color?: string;
  };
}

export function BarChart({
  data,
  series,
  xAxisKey = 'label',
  mode = 'grouped',
  height = 260,
  title,
  subtitle,
  yAxisFormatter = (v) => v.toLocaleString(),
  tooltipFormatter = (v) => v.toLocaleString(),
  showGrid = true,
  targetLine,
}: BarChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const viewBoxWidth = 800;
  const viewBoxHeight = height;
  const padding = { top: 20, right: 30, bottom: 45, left: 60 };
  const chartWidth = viewBoxWidth - padding.left - padding.right;
  const chartHeight = viewBoxHeight - padding.top - padding.bottom;

  // Compute maximum Y value
  const maxY = useMemo(() => {
    let max = 0;
    data.forEach((d) => {
      if (mode === 'stacked') {
        const sum = series.reduce((acc, s) => acc + Number(d[s.key] ?? 0), 0);
        if (sum > max) max = sum;
      } else {
        series.forEach((s) => {
          const val = Number(d[s.key] ?? 0);
          if (val > max) max = val;
        });
      }
    });

    if (targetLine && targetLine.value > max) {
      max = targetLine.value;
    }

    return max === 0 ? 100 : max * 1.15; // 15% head room
  }, [data, series, mode, targetLine]);

  // Y-axis tick intervals (5 ticks)
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      ticks.push((i * maxY) / (count - 1));
    }
    return ticks;
  }, [maxY]);

  const getY = (val: number) => {
    return padding.top + chartHeight - (val / maxY) * chartHeight;
  };

  const getHeight = (val: number) => {
    return (val / maxY) * chartHeight;
  };

  // Bar slot measurements
  const slotWidth = chartWidth / (data.length || 1);
  const groupPadding = slotWidth * 0.22; // gap between groups
  const availableGroupWidth = slotWidth - groupPadding;

  const barWidth =
    mode === 'grouped'
      ? Math.max(8, availableGroupWidth / series.length - 3)
      : Math.max(16, availableGroupWidth);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current || data.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const scaleX = viewBoxWidth / rect.width;
    const svgX = clientX * scaleX;

    const relativeX = svgX - padding.left;
    const index = Math.floor(relativeX / slotWidth);

    if (index >= 0 && index < data.length) {
      setHoverIndex(index);
    } else {
      setHoverIndex(null);
    }
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
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {s.name}
              </span>
            </div>
          ))}
          {targetLine && (
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-0.5 border-t-2 border-dashed"
                style={{ borderColor: targetLine.color || '#ef4444' }}
              />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {targetLine.label}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div ref={containerRef} className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
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

          {/* Target Line if provided */}
          {targetLine && (
            <g>
              <line
                x1={padding.left}
                y1={getY(targetLine.value)}
                x2={padding.left + chartWidth}
                y2={getY(targetLine.value)}
                stroke={targetLine.color || '#ef4444'}
                strokeWidth="1.75"
                strokeDasharray="4 3"
              />
              <text
                x={padding.left + chartWidth - 6}
                y={getY(targetLine.value) - 6}
                textAnchor="end"
                className="fill-red-500 text-[10px] font-bold"
              >
                {targetLine.label}: {yAxisFormatter(targetLine.value)}
              </text>
            </g>
          )}

          {/* Render Bars */}
          {data.map((d, index) => {
            const slotStartX = padding.left + index * slotWidth;
            const groupStartX = slotStartX + groupPadding / 2;
            const isHovered = hoverIndex === index;

            return (
              <g key={`slot-${index}`}>
                {/* Hover Background Highlight Column */}
                {isHovered && (
                  <rect
                    x={slotStartX}
                    y={padding.top}
                    width={slotWidth}
                    height={chartHeight}
                    className="fill-slate-100/60 dark:fill-slate-800/40 rounded-lg transition-colors"
                  />
                )}

                {/* Grouped Mode */}
                {mode === 'grouped' &&
                  series.map((s, sIndex) => {
                    const val = Number(d[s.key] ?? 0);
                    const bHeight = getHeight(val);
                    const x = groupStartX + sIndex * (barWidth + 3);
                    const y = padding.top + chartHeight - bHeight;

                    return (
                      <rect
                        key={`bar-${s.key}-${index}`}
                        x={x}
                        y={y}
                        width={barWidth}
                        height={Math.max(bHeight, 2)}
                        rx={3}
                        ry={3}
                        fill={s.color}
                        className={`transition-all duration-200 ${
                          isHovered ? 'brightness-110 filter drop-shadow-sm' : 'opacity-90'
                        }`}
                      />
                    );
                  })}

                {/* Stacked Mode */}
                {mode === 'stacked' && (() => {
                  let accumulatedHeight = 0;
                  return series.map((s, sIndex) => {
                    const val = Number(d[s.key] ?? 0);
                    const bHeight = getHeight(val);
                    const x = groupStartX;
                    const y = padding.top + chartHeight - accumulatedHeight - bHeight;
                    accumulatedHeight += bHeight;

                    const isTop = sIndex === series.length - 1;

                    return (
                      <rect
                        key={`stacked-${s.key}-${index}`}
                        x={x}
                        y={y}
                        width={barWidth}
                        height={Math.max(bHeight, 2)}
                        rx={isTop ? 3 : 0}
                        ry={isTop ? 3 : 0}
                        fill={s.color}
                        className={`transition-all duration-200 ${
                          isHovered ? 'brightness-110' : 'opacity-90'
                        }`}
                      />
                    );
                  });
                })()}

                {/* X Axis Label */}
                <text
                  x={slotStartX + slotWidth / 2}
                  y={padding.top + chartHeight + 22}
                  textAnchor="middle"
                  className={`text-[11px] transition-colors ${
                    isHovered
                      ? 'fill-blue-600 dark:fill-blue-400 font-bold'
                      : 'fill-slate-400 dark:fill-slate-500 font-medium'
                  }`}
                >
                  {d[xAxisKey]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activeItem && hoverIndex !== null && (
          <div
            className="absolute z-20 pointer-events-none transition-all duration-75"
            style={{
              left: `${((padding.left + (hoverIndex + 0.5) * slotWidth) / viewBoxWidth) * 100}%`,
              top: '10px',
              transform:
                hoverIndex > data.length / 2
                  ? 'translate(-105%, 0)'
                  : 'translate(5%, 0)',
            }}
          >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-3 min-w-[170px] text-xs">
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
                          className="w-2 h-2 rounded-sm"
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

                {mode === 'stacked' && (
                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>Total:</span>
                    <span>
                      {tooltipFormatter(
                        series.reduce((sum, s) => sum + Number(activeItem[s.key] ?? 0), 0),
                        'total',
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
