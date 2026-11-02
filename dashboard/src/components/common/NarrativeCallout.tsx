import React from 'react';
import { Lightbulb } from 'lucide-react';

interface NarrativeCalloutProps {
  title?: string;
  insight: string;
  evidence?: string;
  className?: string;
}

export const NarrativeCallout: React.FC<NarrativeCalloutProps> = ({
  title = "TEMUAN & WAWASAN KEBIJAKAN",
  insight,
  evidence,
  className = "",
}) => {
  return (
    <div className={`bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-start space-x-3 text-ink-primary shadow-2xs ${className}`}>
      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
        <Lightbulb className="w-4 h-4" />
      </div>
      <div className="space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center space-x-2">
          <span>💡 {title}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          {insight}
        </p>
        {evidence && (
          <p className="text-xs text-amber-900/90 font-medium italic pt-1">
            Bukti empiris: {evidence}
          </p>
        )}
      </div>
    </div>
  );
};
