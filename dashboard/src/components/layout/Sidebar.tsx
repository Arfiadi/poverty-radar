import React from 'react';
import { 
  BarChart3, 
  MapPin, 
  Layers, 
  SlidersHorizontal, 
  ShieldCheck, 
  Compass,
  Database
} from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';

export const ACT_NAV_ITEMS = [
  { id: 0, label: "01. Lanskap Makro", sub: "The Hook — Disparitas 17.5x", icon: BarChart3 },
  { id: 1, label: "02. Peta & Indikator", sub: "The Geography — Dualisme", icon: MapPin },
  { id: 2, label: "03. Profil Klaster", sub: "The Archetypes — 4 Persona", icon: Layers },
  { id: 3, label: "04. Matriks & Prioritas", sub: "The Action — Skrining 2x2", icon: SlidersHorizontal },
  { id: 4, label: "05. Metodologi & Data", sub: "The Integrity — OLS & Audit", icon: ShieldCheck },
];

export const Sidebar: React.FC = () => {
  const { activeAct, setActiveAct } = useFilterStore();

  return (
    <aside className="w-60 min-w-[240px] max-w-[240px] bg-surface border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div>
        <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-okabe-blue flex items-center justify-center text-white shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm tracking-tight text-ink-primary">PovertyRadar</span>
                <span className="bg-sdg text-white font-mono text-[9px] font-bold px-1 py-0.5 rounded leading-none">SDG 1</span>
              </div>
              <p className="text-[10px] text-ink-muted leading-tight font-medium">BPS 2021 Socioeconomic Radar</p>
            </div>
          </div>
        </div>

        {/* Narrative Navigation Section */}
        <div className="px-3 py-4">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Alur Cerita 5 Babak
          </div>
          <nav className="space-y-1">
            {ACT_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeAct === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveAct(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center space-x-3 transition-all duration-150 ${
                    isActive
                      ? "bg-slate-100/90 text-okabe-blue font-bold shadow-xs border-l-3 border-okabe-blue"
                      : "text-ink-muted hover:text-ink-primary hover:bg-slate-50 font-medium"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-okabe-blue" : "text-slate-400"}`} />
                  <div className="truncate">
                    <div className="text-xs leading-tight truncate">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">{item.sub}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer Metadata */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60">
        <div className="flex items-center space-x-2 text-[11px] text-ink-muted">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium">Data: BPS 2021 (N=514)</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 leading-snug">
          Unsupervised Clustering · Bebas Target Leakage
        </p>
      </div>
    </aside>
  );
};
