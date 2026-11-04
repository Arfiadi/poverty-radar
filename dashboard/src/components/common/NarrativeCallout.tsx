import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface NarrativeCalloutProps {
  title?: string;
  insight: string;
  evidence?: string;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  epistemicBadge?: string;
}

export const NarrativeCallout: React.FC<NarrativeCalloutProps> = ({
  title = "TEMUAN & WAWASAN KEBIJAKAN",
  insight,
  evidence,
  className = "",
  collapsible = true,
  defaultExpanded = true,
  epistemicBadge,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  return (
    <aside 
      className={`bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 sm:p-3.5 text-ink-primary shadow-2xs transition-all ${className}`}
      aria-expanded={collapsible ? isExpanded : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-2.5 min-w-0 flex-1">
          <div className="p-1 rounded-md bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                {title}
              </span>
              {epistemicBadge && (
                <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded border bg-amber-100/90 text-amber-900 border-amber-300 font-mono">
                  {epistemicBadge}
                </span>
              )}
            </div>
            
            {(!collapsible || isExpanded) ? (
              <>
                <p className="text-xs sm:text-[12.5px] text-slate-800 leading-relaxed font-normal pt-0.5">
                  {insight}
                </p>
                {evidence && (
                  <p className="text-[11px] text-amber-950/90 font-medium italic pt-1 border-t border-amber-200/60 mt-1">
                    Bukti data: {evidence}
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-slate-600 truncate font-normal">
                {insight}
              </p>
            )}
          </div>
        </div>

        {collapsible && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-amber-800 hover:text-amber-950 hover:bg-amber-100/80 rounded-md transition-colors shrink-0"
            title={isExpanded ? "Ciutkan wawasan narasi" : "Bentangkan wawasan narasi lengkap"}
            aria-label={isExpanded ? "Ciutkan narasi" : "Bentangkan narasi"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>
    </aside>
  );
};
