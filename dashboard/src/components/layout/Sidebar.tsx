import React from 'react';
import { 
  BarChart3, 
  MapPin, 
  Layers, 
  SlidersHorizontal, 
  ShieldCheck, 
  Compass,
  PanelLeftClose,
  PanelLeftOpen
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
    label: "Lanskap Makro",
    sub: "Disparitas 17.5x",
    icon: BarChart3,
    narrativeTheme: "Lanskap Makro Kemiskinan Daerah",
    focusSummary: "Jurang ekstrem 17.5x & konsentrasi 86.9% kemiskinan kritis di Kawasan Timur.",
  },
  {
    id: 1,
    step: "02",
    label: "Peta & Indikator",
    sub: "Sebaran Spasial",
    icon: MapPin,
    narrativeTheme: "Polarisasi Spasial 34 Provinsi",
    focusSummary: "Dikotomi perdesaan-perkotaan & karakteristik kerja di wilayah 3T.",
  },
  {
    id: 2,
    step: "03",
    label: "Profil Klaster",
    sub: "4 Tipologi Daerah",
    icon: Layers,
    narrativeTheme: "Arketipe 4 Klaster Sosio-Ekonomi",
    focusSummary: "Mengelompokkan 514 daerah berdasarkan kesamaan 7 indikator struktural.",
  },
  {
    id: 3,
    step: "04",
    label: "Matriks & Prioritas",
    sub: "Prioritas 2x2",
    icon: SlidersHorizontal,
    narrativeTheme: "Matriks Skrining Kerentanan 2x2",
    focusSummary: "Pemetaan prioritas intervensi & analisis daerah tambang skala besar.",
  },
  {
    id: 4,
    step: "05",
    label: "Metodologi & Data",
    sub: "Validasi & Audit",
    icon: ShieldCheck,
    narrativeTheme: "Integritas & Audit Metodologi",
    focusSummary: "Verifikasi batas 0.00% 3T, dekonstruksi label Kaggle, & koefisien baku OLS.",
  },
];

export const Sidebar: React.FC = () => {
  const { activeAct, setActiveAct, isSidebarCollapsed, toggleSidebar } = useFilterStore();

  return (
    <aside 
      className={`bg-surface border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 z-40 select-none overflow-y-auto transition-all duration-300 ease-in-out ${
        isSidebarCollapsed 
          ? 'w-[56px] min-w-[56px] max-w-[56px]' 
          : 'w-[180px] min-w-[180px] max-w-[180px]'
      }`}
      aria-label="Navigasi Utama Alur Cerita PovertyRadar"
    >
      {/* Top Block: Brand Header & Refined Stepper Navigation */}
      <div>
        {isSidebarCollapsed ? (
          /* Collapsed Mini Header: Compass Icon */
          <div className="py-3.5 border-b border-slate-100 flex flex-col items-center">
            <div 
              className="w-7 h-7 rounded-lg bg-[#0B3B60] flex items-center justify-center text-white shadow-xs"
              title="PovertyRadar - Skrining Kerentanan Daerah"
            >
              <Compass className="w-3.5 h-3.5" />
            </div>
          </div>
        ) : (
          /* Expanded Brand Header: Compact & Lean */
          <div className="px-2.5 pt-3.5 pb-2.5 border-b border-slate-100 flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#0B3B60] flex items-center justify-center text-white shadow-xs shrink-0">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-extrabold text-[13px] tracking-tight text-slate-900 leading-tight truncate">
                PovertyRadar
              </h1>
              <p className="text-[9.5px] text-slate-500 font-medium leading-tight mt-0.5 truncate">
                Skrining Daerah
              </p>
            </div>
          </div>
        )}

        {/* Narrative Stepper Navigation */}
        {isSidebarCollapsed ? (
          /* Collapsed Rail Stepper */
          <div className="py-4 px-1.5">
            <nav className="relative space-y-3 flex flex-col items-center" aria-label="Daftar Babak Cerita">
              {/* Centered Vertical Rail Line */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-0.5 bg-slate-200 z-0 pointer-events-none" 
                aria-hidden="true" 
              />

              {ACT_NAV_ITEMS.map((item) => {
                const isActive = activeAct === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveAct(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    title={`Babak ${item.step}: ${item.label}\n${item.sub}`}
                    className={`group relative z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-[#DCEDFC] shadow-2xs'
                        : 'hover:bg-slate-100 text-ink-primary'
                    }`}
                  >
                    <div
                      className={`w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 font-mono text-[10px] font-bold transition-all ${
                        isActive
                          ? 'bg-okabe-blue text-white shadow-xs ring-2 ring-white/90'
                          : 'bg-white border border-slate-300 text-slate-700 group-hover:border-slate-400 group-hover:text-slate-900'
                      }`}
                    >
                      {item.step}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        ) : (
          /* Expanded Stepper Navigation */
          <div className="px-1.5 pt-3 pb-2">
            <nav className="relative space-y-1.5" aria-label="Daftar Babak Cerita">
              {/* Continuous Vertical Rail Line: centered behind 22px node (1.5*4 = 6px padding + 11px radius = 17px) */}
              <div 
                className="absolute left-[17px] top-3.5 bottom-3.5 w-0.5 bg-slate-200 z-0 pointer-events-none" 
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
                    className={`group relative z-10 w-full text-left px-1.5 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-[#DCEDFC] shadow-2xs'
                        : 'hover:bg-slate-50/80 text-ink-primary'
                    }`}
                  >
                    {/* Step Node Indicator (01 - 05) */}
                    <div
                      className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 font-mono text-[10px] font-bold transition-all ${
                        isActive
                          ? 'bg-okabe-blue text-white shadow-xs ring-2 ring-white/90'
                          : 'bg-white border border-slate-300 text-slate-700 group-hover:border-slate-400 group-hover:text-slate-900'
                      }`}
                    >
                      {item.step}
                    </div>

                    {/* Text Information Block */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center space-x-1">
                        <Icon 
                          className={`w-3 h-3 shrink-0 transition-colors ${
                            isActive 
                              ? 'text-okabe-blue' 
                              : 'text-slate-600 group-hover:text-slate-900'
                          }`} 
                        />
                        <span className="text-[11.5px] font-bold text-slate-900 leading-tight truncate">
                          {item.label}
                        </span>
                      </div>

                      <div className={`text-[9.5px] leading-tight truncate ${
                        isActive 
                          ? 'text-slate-700 font-semibold' 
                          : 'text-slate-500 font-normal group-hover:text-slate-600'
                      }`}>
                        {item.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Sidebar Footer: UN SDG 1 Mandate & Collapse Toggle */}
      {isSidebarCollapsed ? (
        /* Collapsed Footer: Compact SDG 1 Icon + Expand Toggle Button */
        <div className="p-2 border-t border-slate-100 bg-slate-50/60 mt-auto flex flex-col items-center space-y-1.5">
          <img 
            src="/sdg-1-no-poverty.png" 
            alt="SDG 1: No Poverty" 
            className="w-7 h-7 rounded-md shadow-2xs object-cover" 
            title="SDG 1: No Poverty (Tanpa Kemiskinan)"
          />
          <button
            onClick={toggleSidebar}
            title="Perluas Sidebar"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
            aria-label="Perluas Sidebar"
          >
            <PanelLeftOpen className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Expanded Footer: Official UN SDG 1 Badge & Label + Collapse Toggle Button */
        <div className="p-2 px-2.5 border-t border-slate-100 bg-slate-50/60 mt-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <img 
              src="/sdg-1-no-poverty.png" 
              alt="SDG 1: No Poverty" 
              className="w-7 h-7 rounded-md shadow-2xs shrink-0 object-cover" 
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[10.5px] text-slate-900 leading-tight">
                SDG 1
              </p>
              <p className="text-[9px] text-slate-500 font-medium leading-tight truncate">
                Tanpa Kemiskinan
              </p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            title="Ciutkan Sidebar ke Mode Ikon"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0"
            aria-label="Ciutkan Sidebar"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
};
