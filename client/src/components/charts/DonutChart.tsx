'use client';

import React, { useState, useMemo } from 'react';

export interface DonutSlice {
  name: string;
  value: number;
  color: string;
  description?: string;
}

export interface DonutChartProps {
  data: DonutSlice[];
  height?: number;
  title?: string;
  subtitle?: string;
  centerLabel?: string;
  centerValue?: string;
  centerSubtext?: string;
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
}

export function DonutChart({
  data,
  height = 260,
  title,
  subtitle,
  centerLabel,
  centerValue,
  centerSubtext,
  valueFormatter = (v) => v.toLocaleString(),
  showLegend = true,
}: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = useMemo(() => {
    return data.reduce((sum, d) => sum + d.value, 0);
  }, [data]);

  // Geometry
  const size = height;
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size * 0.44;
  const innerRadius = size * 0.28;

  // Compute angles for each slice
  const slices = useMemo(() => {
    if (total === 0) return [];

    let currentAngle = -Math.PI / 2; // start from 12 o'clock

    return data.map((d, index) => {
      const percentage = (d.value / total) * 100;
      const sliceAngle = (d.value / total) * (Math.PI * 2);
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      // Outer arc
      const x1 = cx + outerRadius * Math.cos(startAngle);
      const y1 = cy + outerRadius * Math.sin(startAngle);
      const x2 = cx + outerRadius * Math.cos(endAngle);
      const y2 = cy + outerRadius * Math.sin(endAngle);

      // Inner arc
      const x3 = cx + innerRadius * Math.cos(endAngle);
      const y3 = cy + innerRadius * Math.sin(endAngle);
      const x4 = cx + innerRadius * Math.cos(startAngle);
      const y4 = cy + innerRadius * Math.sin(startAngle);

      const largeArc = sliceAngle > Math.PI ? 1 : 0;

      // Path
      const pathData = [
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z',
      ].join(' ');

      return {
        ...d,
        percentage,
        pathData,
        index,
      };
    });
  }, [data, total, cx, cy, outerRadius, innerRadius]);

  const activeSlice = hoveredIndex !== null ? slices[hoveredIndex] : null;

  return (
    <div className="w-full bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm transition-colors">
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      )}

      {/* Chart Layout: Donut on Left, Legend on Right */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* SVG Donut Visual */}
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="overflow-visible select-none">
            {slices.map((s, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <path
                  key={`slice-${i}`}
                  d={s.pathData}
                  fill={s.color}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                    opacity: hoveredIndex !== null && !isHovered ? 0.6 : 1,
                    filter: isHovered ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))' : 'none',
                  }}
                />
              );
            })}
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            {activeSlice ? (
              <>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  {activeSlice.name}
                </span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                  {activeSlice.percentage.toFixed(1)}%
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {valueFormatter(activeSlice.value)}
                </span>
              </>
            ) : (
              <>
                {centerLabel && (
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                    {centerLabel}
                  </span>
                )}
                {centerValue && (
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                    {centerValue}
                  </span>
                )}
                {centerSubtext && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {centerSubtext}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Legend List */}
        {showLegend && (
          <div className="flex-1 w-full space-y-2">
            {slices.map((s, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <div
                  key={`legend-${i}`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                    isHovered
                      ? 'bg-slate-100 dark:bg-slate-800 shadow-sm'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-md shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {s.name}
                      </span>
                      {s.description && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          {s.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right pl-3 shrink-0">
                    <div className="font-bold text-slate-900 dark:text-white font-mono">
                      {valueFormatter(s.value)}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {s.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
