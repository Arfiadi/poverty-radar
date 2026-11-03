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

export interface ActNavItem {
  id: number;
  step: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  narrativeTheme: string;
  focusSummary: string;
}

export const ACT_NAV_ITEMS: ActNavItem[] = [
  {
    id: 0,
    step: "01",
    label: "01. Lanskap Makro",
    sub: "The Hook · Disparitas 17.5x",
    icon: BarChart3,
    narrativeTheme: "Lanskap Makro Kemiskinan Daerah",
    focusSummary: "Jurang ekstrem 17.5x & konsentrasi 86.9% kantong akut di Kawasan Timur.",
  },
  {
    id: 1,
    step: "02",
    label: "02. Peta & Indikator",
    sub: "The Geography · Dualisme",
    icon: MapPin,
    narrativeTheme: "Polarisasi Spasial 34 Provinsi",
    focusSummary: "Dikotomi The Great Dualism & anomali kerja The Working Poor di wilayah 3T.",
  },
  {
    id: 2,
    step: "03",
    label: "03. Profil Klaster",
    sub: "The Archetypes · 4 Persona",
    icon: Layers,
    narrativeTheme: "Arketipe 4 Klaster Sosio-Ekonomi",
    focusSummary: "Konfigurasi defisit fasilitas dasar (sanitasi, air, RLS) bebas target leakage.",
  },
  {
    id: 3,
    step: "04",
    label: "04. Matriks & Prioritas",
    sub: "The Action · Skrining 2x2",
    icon: SlidersHorizontal,
    narrativeTheme: "Matriks Skrining Kerentanan 2x2",
    focusSummary: "Penapisan portofolio intervensi & penyorotan studi kasus kutukan tambang.",
  },
  {
    id: 4,
    step: "05",
    label: "05. Metodologi & Data",
    sub: "The Integrity · OLS & Audit",
    icon: ShieldCheck,
    narrativeTheme: "Integritas & Audit Metodologi",
    focusSummary: "Verifikasi batas 0.00% 3T, dekonstruksi label Kaggle, & koefisien baku OLS.",
  },
];

export const Sidebar: React.FC = () => {
  const { activeAct, setActiveAct } = useFilterStore();
  const currentActItem = ACT_NAV_ITEMS[activeAct] || ACT_NAV_ITEMS[0];

  return (
    <aside 
      className="w-60 min-w-[240px] max-w-[240px] bg-surface border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 z-40 select-none overflow-y-auto"
      aria-label="Navigasi Utama Alur Cerita PovertyRadar"
    >
      {/* Top Block: Brand Header & Narrative Stepper Navigation */}
      <div>
        {/* Brand Header */}
        <div className="px-5 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-okabe-blue flex items-center justify-center text-white shadow-sm shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm tracking-tight text-ink-primary">PovertyRadar</span>
                <span className="bg-sdg text-white font-mono text-[9px] font-bold px-1 py-0.5 rounded leading-none shrink-0">SDG 1</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight font-medium truncate mt-0.5">
                Skrining Kerentanan Daerah
              </p>
            </div>
          </div>
        </div>

        {/* Narrative Navigation Section with Vertical Timeline Stepper */}
        <div className="px-3 pt-4 pb-2">
          <div className="px-2.5 pb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
            <span>Alur Cerita 5 Babak</span>
            <span className="text-[10px] font-mono text-slate-500 font-semibold">5 Babak</span>
          </div>

          {/* Stepper Container with Continuous Vertical Track */}
          <nav className="relative space-y-1.5" aria-label="Daftar Babak Cerita">
            {/* Continuous Vertical Rail Line */}
            <div 
              className="absolute left-[21px] top-3.5 bottom-3.5 w-0.5 bg-slate-200 z-0 pointer-events-none" 
              aria-hidden="true" 
            />

            {ACT_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeAct === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveAct(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative z-10 w-full text-left p-2 rounded-xl flex items-center space-x-2.5 transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-100/95 text-okabe-blue shadow-2xs'
                      : 'hover:bg-slate-50/90 text-ink-primary'
                  }`}
                >
                  {/* Step Node Indicator */}
                  <div
                    className={`w-6.5 h-6.5 rounded-full flex items-center justify-center shrink-0 font-mono text-[10px] font-bold transition-all ${
                      isActive
                        ? 'bg-okabe-blue text-white ring-4 ring-okabe-blue/15 shadow-xs'
                        : 'bg-white border-2 border-slate-300 text-slate-600 group-hover:border-slate-400 group-hover:text-slate-800'
                    }`}
                  >
                    {item.step}
                  </div>

                  {/* Text Information (WCAG 2.1 AA Compliant: text-slate-600 contrast > 5.5:1) */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-okabe-blue' : 'text-slate-500 group-hover:text-slate-700'}`} />
                      <span className={`text-xs font-bold leading-tight truncate ${isActive ? 'text-okabe-blue' : 'text-ink-primary group-hover:text-okabe-blue'}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className={`text-[11px] leading-tight truncate mt-0.5 ${isActive ? 'text-slate-700 font-semibold' : 'text-slate-600 font-medium'}`}>
                      {item.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Middle & Bottom Block: Narrative Progress Tracker & Official Footer */}
      <div className="space-y-3 pb-3">
        {/* Narrative Progress & Context Tracker (Eliminates dead whitespace) */}
        <div className="mx-3 p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Progres Alur
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-okabe-blue">
              Babak {activeAct + 1}/5
            </span>
          </div>

          {/* Micro Progress Track Bar */}
          <div 
            className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden" 
            role="progressbar" 
            aria-valuenow={activeAct + 1} 
            aria-valuemin={1} 
            aria-valuemax={5}
            aria-label={`Progres alur cerita babak ${activeAct + 1} dari 5`}
          >
            <div
              className="bg-okabe-blue h-full rounded-full transition-all duration-300"
              style={{ width: `${((activeAct + 1) / 5) * 100}%` }}
            />
          </div>

          {/* Active Stage Narrative Context */}
          <div className="pt-0.5">
            <div className="text-[11px] font-bold text-ink-primary leading-tight">
              {currentActItem.narrativeTheme}
            </div>
            <p className="text-[10px] text-slate-600 leading-snug mt-1">
              {currentActItem.focusSummary}
            </p>
          </div>
        </div>

        {/* Sidebar Footer Metadata (Official & Non-defensive) */}
        <div className="mx-3 p-3 border-t border-slate-100 bg-slate-50/60 rounded-xl">
          <div className="flex items-center space-x-2 text-xs text-slate-700">
            <Database className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="font-semibold text-[11px]">Basis Data: BPS Susenas 2021</span>
          </div>
          <p className="text-[10px] text-slate-600 pl-5.5 leading-snug mt-0.5">
            514 Daerah · Disparitas Spasial Multidimensi
          </p>
        </div>
      </div>
    </aside>
  );
};
