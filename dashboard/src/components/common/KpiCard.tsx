import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  benchmarkText: string;
  contextText?: string;
  badge?: {
    text: string;
    type?: 'default' | 'critical' | 'positive' | 'warning';
  };
  accentColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  benchmarkText,
  contextText,
  badge,
  accentColor,
}) => {
  const getBadgeStyle = () => {
    switch (badge?.type) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200/80';
      case 'positive':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-slate-200/80 p-4 shadow-subtle hover:shadow-card transition-shadow flex flex-col justify-between">
      {/* Top Header: Label + Optional Badge */}
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold tracking-wide uppercase text-ink-muted leading-tight">
          {label}
        </span>
        {badge && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getBadgeStyle()}`}>
            {badge.text}
          </span>
        )}
      </div>

      {/* Main KPI Big Number (Tabular format, no jitter) */}
      <div className="my-2">
        <div 
          className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums"
          style={{ color: accentColor || '#0F172A' }}
        >
          {value}
        </div>
      </div>

      {/* Bottom Context & National Benchmark (No Bare Numbers) */}
      <div className="space-y-0.5 border-t border-slate-100 pt-2">
        <div className="text-xs font-medium text-slate-600 truncate">
          {benchmarkText}
        </div>
        {contextText && (
          <div className="text-[11px] text-slate-400 truncate">
            {contextText}
          </div>
        )}
      </div>
    </div>
  );
};
