import React from 'react';

export interface KpiRange {
  min: number;
  max: number;
  current: number;
  target?: number;
  minLabel?: string;
  maxLabel?: string;
  targetLabel?: string;
  unit?: string;
}

export interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  benchmarkText: string;
  contextText?: string;
  badge?: {
    text: string;
    type?: 'default' | 'critical' | 'positive' | 'warning' | 'filter';
  };
  range?: KpiRange;
  accentColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  unit,
  benchmarkText,
  contextText,
  badge,
  range,
  accentColor,
}) => {
  const getBadgeStyle = () => {
    switch (badge?.type) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200/80';
      case 'positive':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'filter':
        return 'bg-blue-50 text-okabe-blue border-blue-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Compute progress percentage for micro bullet graph
  const rangeSpan = range ? range.max - range.min : 0;
  const progressPct = range && rangeSpan > 0
    ? Math.min(Math.max(((range.current - range.min) / rangeSpan) * 100, 0), 100)
    : null;

  const targetPct = range && range.target !== undefined && rangeSpan > 0
    ? Math.min(Math.max(((range.target - range.min) / rangeSpan) * 100, 0), 100)
    : null;

  return (
    <article
      className="bg-surface rounded-xl border border-slate-200/90 p-4 shadow-subtle hover:shadow-card transition-shadow flex flex-col justify-between h-full"
      role="region"
      aria-label={`${label}: ${value} ${unit || ''}`}
    >
      <dl className="flex flex-col justify-between h-full space-y-2.5 m-0">
        {/* Top Header: Label + Optional Badge */}
        <div className="flex items-start justify-between gap-2">
          <dt className="text-xs font-bold tracking-wide uppercase text-slate-700 leading-snug">
            {label}
          </dt>
          {badge && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded border shrink-0 ${getBadgeStyle()}`}>
              {badge.text}
            </span>
          )}
        </div>

        {/* Main KPI Big Number (Tabular format, JetBrains/Mono styling) */}
        <dd className="m-0 my-0.5">
          <div className="flex items-baseline space-x-1.5">
            <span
              className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums font-mono"
              style={{ color: accentColor || '#0F172A' }}
            >
              {value}
            </span>
            {unit && <span className="text-xs font-semibold text-slate-600">{unit}</span>}
          </div>
        </dd>

        {/* Stephen Few Micro Bullet Graph (If range is provided) */}
        {range && progressPct !== null && (
          <dd className="m-0 py-1" aria-hidden="true">
            <div
              className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={range.current}
              aria-valuemin={range.min}
              aria-valuemax={range.max}
            >
              <div
                className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-300"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: accentColor || '#0F172A',
                }}
              />
              {targetPct !== null && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-red-600 z-10 rounded-full"
                  style={{ left: `calc(${targetPct}% - 2px)` }}
                  title={range.targetLabel || `Target: ${range.target}`}
                />
              )}
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 mt-1 font-mono">
              <span className="truncate max-w-[42%]" title={range.minLabel || `${range.min}`}>
                {range.minLabel || `${range.min}${range.unit || ''}`}
              </span>
              {range.targetLabel && (
                <span className="text-red-700 font-semibold px-1 shrink-0" title={range.targetLabel}>
                  {range.targetLabel}
                </span>
              )}
              <span className="truncate max-w-[42%] text-right" title={range.maxLabel || `${range.max}`}>
                {range.maxLabel || `${range.max}${range.unit || ''}`}
              </span>
            </div>
          </dd>
        )}

        {/* Bottom Context & Benchmark (WCAG AA Compliant: text-slate-600 & text-slate-700, no clipping) */}
        <dd className="m-0 border-t border-slate-100 pt-2 space-y-1">
          <div className="text-xs font-semibold text-slate-700 leading-snug">
            {benchmarkText}
          </div>
          {contextText && (
            <div className="text-xs text-slate-600 leading-relaxed">
              {contextText}
            </div>
          )}
        </dd>
      </dl>
    </article>
  );
};
