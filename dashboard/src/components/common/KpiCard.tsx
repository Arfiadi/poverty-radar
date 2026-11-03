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
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
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
  onClick,
  className = '',
  isActive = false,
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

  const fullTooltip = `${label}: ${value} ${unit || ''} | ${benchmarkText}${contextText ? ' · ' + contextText : ''}`;

  return (
    <article
      onClick={onClick}
      title={fullTooltip}
      className={`bg-surface rounded-xl p-3 sm:p-3.5 shadow-2xs transition-all flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:shadow-subtle hover:-translate-y-0.5' : 'hover:shadow-subtle'
      } ${
        isActive 
          ? 'border-2 border-okabe-blue ring-2 ring-okabe-blue/20 bg-blue-50/20' 
          : 'border border-slate-200/90'
      } ${className}`}
      role={onClick ? "button" : "region"}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      aria-label={`${label}: ${value} ${unit || ''}`}
    >
      <dl className="flex flex-col justify-between h-full space-y-1.5 m-0">
        {/* Top Header: Label + Optional Micro Badge */}
        <div className="flex items-center justify-between gap-2">
          <dt className="text-[11px] font-bold tracking-wider uppercase text-slate-500 leading-tight truncate">
            {label}
          </dt>
          {badge && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 leading-none ${getBadgeStyle()}`}>
              {badge.text}
            </span>
          )}
        </div>

        {/* Row 2: Main KPI Big Number & Benchmark Comparison */}
        <dd className="m-0">
          <div className="flex items-baseline justify-between gap-1.5">
            <div className="flex items-baseline space-x-1 min-w-0">
              <span
                className="text-xl sm:text-2xl font-extrabold tracking-tight tabular-nums font-mono leading-none"
                style={{ color: accentColor || '#0F172A' }}
              >
                {value}
              </span>
              {unit && <span className="text-xs font-semibold text-slate-500 truncate">{unit}</span>}
            </div>
            <span 
              className="text-[11px] font-medium text-slate-500 truncate max-w-[52%] text-right shrink-0" 
              title={benchmarkText}
            >
              {benchmarkText}
            </span>
          </div>
        </dd>

        {/* Row 3: Slim Micro Bullet Graph (If range is provided) */}
        {range && progressPct !== null ? (
          <dd className="m-0 pt-0.5" aria-hidden="true">
            <div
              className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={range.current}
              aria-valuemin={range.min}
              aria-valuemax={range.max}
            >
              <div
                className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-300"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: accentColor || '#0072B2',
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
            <div className="flex justify-between items-center text-[10px] text-slate-600 mt-1 font-mono leading-none">
              <span className="truncate max-w-[45%]" title={range.minLabel || `${range.min}`}>
                {range.minLabel || `${range.min}${range.unit || ''}`}
              </span>
              {range.targetLabel && (
                <span className="text-red-700 font-semibold px-1 shrink-0" title={range.targetLabel}>
                  {range.targetLabel}
                </span>
              )}
              <span className="truncate max-w-[45%] text-right" title={range.maxLabel || `${range.max}`}>
                {range.maxLabel || `${range.max}${range.unit || ''}`}
              </span>
            </div>
          </dd>
        ) : (
          contextText && (
            <dd className="m-0 text-[10px] text-slate-600 truncate" title={contextText}>
              {contextText}
            </dd>
          )
        )}
      </dl>
    </article>
  );
};
