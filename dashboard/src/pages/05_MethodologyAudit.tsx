import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Search, 
  Filter, 
  CheckCircle2, 
  Check,
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Scale, 
  ShieldCheck, 
  Layers, 
  SlidersHorizontal,
  FileCheck,
  Target,
  BarChart3,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  BookOpen,
  Info,
  Terminal,
  GitBranch,
  HelpCircle
} from 'lucide-react';
import { District, OLSResult, BoundaryCase } from '../types';
import { OLSCoefficientsBar } from '../components/charts/OLSCoefficientsBar';
import { TukeyBoxplot } from '../components/charts/TukeyBoxplot';
import { NarrativeCallout } from '../components/common/NarrativeCallout';
import { KpiCard } from '../components/common/KpiCard';
import { PARADOXES } from '../constants/paradoxes';
import { exportDistrictsToCSV } from '../utils/csvExport';
import { 
  DATA_DICTIONARY, 
  MACRO_STAGES, 
  PipelineStageId 
} from '../constants/methodology';

interface PageProps {
  districts: District[];
  filteredDistricts?: District[];
  olsResults: OLSResult[];
  boundaryCases: BoundaryCase[];
}

export const MethodologyAudit: React.FC<PageProps> = ({
  districts,
  filteredDistricts,
  olsResults,
  boundaryCases,
}) => {
  // State for active stage tab
  const [activeStage, setActiveStage] = useState<PipelineStageId>('ingestion');
  
  // State for details-on-demand deep dive toggle (per active stage)
  const [showDeepDive, setShowDeepDive] = useState<boolean>(true);
  
  // State for Data Dictionary search & role filter
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'feature' | 'benchmark' | 'contextual' | 'dropped'>('all');

  const currentStageIndex = MACRO_STAGES.findIndex(s => s.id === activeStage);
  const currentStage = MACRO_STAGES[currentStageIndex];

  // Dynamic calculation of Tukey distribution metrics on 514 districts
  const { p0OutlierCount, upperWhiskerVal, q1Val, medianVal, q3Val, minVal } = useMemo(() => {
    const vals = districts.map(d => d.poverty_rate_p0).sort((a, b) => a - b);
    const n = vals.length;
    if (n === 0) return { p0OutlierCount: 35, upperWhiskerVal: 26.50, q1Val: 7.15, medianVal: 10.46, q3Val: 14.89, minVal: 2.38 };
    const q1 = vals[Math.floor(n * 0.25)];
    const med = vals[Math.floor(n * 0.5)];
    const q3 = vals[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    const lower = Math.max(vals[0], q1 - 1.5 * iqr);
    const upper = Math.min(vals[n - 1], q3 + 1.5 * iqr);
    const count = vals.filter(v => v > upper || v < lower).length;
    return { p0OutlierCount: count, upperWhiskerVal: upper, q1Val: q1, medianVal: med, q3Val: q3, minVal: vals[0] };
  }, [districts]);

  // Filtered Data Dictionary items
  const filteredDictionary = useMemo(() => {
    return DATA_DICTIONARY.filter(item => {
      const matchesSearch = 
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.labelBps.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dimension.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || item.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [searchQuery, roleFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Editorial Headline Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-0.5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            Transparansi Metodologi, Audit Data, &amp; Validasi Pemodelan Ilmiah
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Alur analitis 514 daerah BPS 2021: ingesti data dan verifikasi metadata, penskalaan distribusi robust, seleksi fitur bebas kebocoran target, dan klastering tipologi tervalidasi ekonometrika.
          </p>
        </div>
      </div>

      {/* Consistent National Baseline Notice Banner (F-P5-14) */}
      {filteredDistricts && filteredDistricts.length < districts.length && (
        <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between text-xs text-okabe-blue">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-okabe-blue shrink-0" />
            <span>
              <strong>Penegakan Baseline Nasional Konsisten:</strong> Seluruh metrik audit metodologi, sebaran Tukey boxplot, dan diagnostik model beroperasi pada <strong>514 baseline nasional lengkap</strong>. Filter global aktif Anda ({filteredDistricts.length} daerah) tetap berlaku di Halaman 1–4.
            </span>
          </div>
        </div>
      )}

      {/* Row 1: 4 Data Science & Integrity Audit KPI Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Cakupan Observasi Nasional */}
        <KpiCard
          label="Cakupan Observasi Nasional"
          value="514 Daerah (100%)"
          benchmarkText="0 Nilai Hilang (0 NaN)"
          badge={{ text: "Agregat BPS 2021", type: "positive" }}
          accentColor="#009E73"
        />

        {/* KPI 2: Stabilitas Partisi Klaster */}
        <KpiCard
          label="Stabilitas Partisi Klaster"
          value="ARI = 0.9803"
          benchmarkText="Adjusted Rand Index (k = 4)"
          badge={{ text: "Stabilitas Tinggi", type: "positive" }}
          accentColor="#0072B2"
        />

        {/* KPI 3: Validasi Eksternal (P0) */}
        <KpiCard
          label="Validasi Eksternal (P0)"
          value="ANOVA F = 155.94"
          benchmarkText="Signifikan p < 0.001 (η² = 0.48)"
          badge={{ text: "Tolok Ukur Bebas", type: "default" }}
          accentColor="#D55E00"
        />

        {/* KPI 4: Daya Asosiasi Model OLS */}
        <KpiCard
          label="Daya Asosiasi Model OLS"
          value="R² = 51.64%"
          benchmarkText="R² Terkoreksi: 51.07% (p < 0.001)"
          badge={{ text: "Ekonometrika OLS", type: "default" }}
          accentColor="#0F172A"
        />
      </div>

      {/* Horizontal Stepper Tabs Strip: Tanpa card penampung, garis penyambung tajam & jelas */}
      <div className="relative py-1">
        {/* Continuous Horizontal Connecting Rail Line (Base Track: Sharp & High Contrast) */}
        <div 
          className="absolute left-[12.5%] right-[12.5%] top-1/2 -translate-y-1/2 h-[2.5px] bg-slate-300 pointer-events-none hidden lg:block z-0"
          aria-hidden="true" 
        />

        {/* Active Progress Connector Line: Okabe Blue filling between completed & active stages */}
        <div 
          className="absolute left-[12.5%] top-1/2 -translate-y-1/2 h-[2.5px] bg-okabe-blue transition-all duration-300 pointer-events-none hidden lg:block z-0"
          style={{
            width: `${(currentStageIndex / (MACRO_STAGES.length - 1)) * 75}%`
          }}
          aria-hidden="true" 
        />

        <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 relative z-10" aria-label="Tab Tahapan Metodologi" role="tablist">
          {MACRO_STAGES.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeStage === s.id;
            const isCompleted = idx < currentStageIndex;

            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${s.id}`}
                id={`tab-${s.id}`}
                title={s.title}
                onClick={() => setActiveStage(s.id)}
                className={`group relative text-left p-2.5 sm:p-3 rounded-xl flex items-center space-x-2.5 transition-all duration-200 border ${
                  isActive
                    ? 'bg-white border-2 border-okabe-blue shadow-md shadow-blue-500/10 ring-2 ring-okabe-blue/20'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs text-slate-700'
                }`}
              >
                {/* Active Indicator Top Accent */}
                {isActive && (
                  <span 
                    className="absolute -top-[2px] inset-x-4 h-[3px] bg-okabe-blue rounded-full pointer-events-none" 
                    aria-hidden="true"
                  />
                )}

                {/* Step Node Indicator (01 - 04) */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-mono text-[11px] font-black transition-all ${
                    isActive
                      ? 'bg-okabe-blue text-white shadow-xs ring-2 ring-blue-100'
                      : isCompleted
                      ? 'bg-emerald-600 text-white shadow-2xs ring-2 ring-emerald-100'
                      : 'bg-slate-100 border border-slate-300 text-slate-500 group-hover:border-slate-400 group-hover:text-slate-800'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    s.stepNum
                  )}
                </div>

                {/* Text Block */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <Icon 
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isActive 
                          ? 'text-okabe-blue' 
                          : 'text-slate-400 group-hover:text-slate-700'
                      }`} 
                    />
                    <span className={`text-[12px] sm:text-[12.5px] leading-tight break-words line-clamp-1 ${
                      isActive 
                        ? 'font-black text-slate-900 tracking-tight' 
                        : 'font-bold text-slate-700 group-hover:text-slate-900'
                    }`}>
                      {s.shortTitle}
                    </span>
                  </div>

                  <div className={`text-[10px] font-mono leading-tight break-words line-clamp-1 mt-0.5 ${
                    isActive 
                      ? 'text-okabe-blue font-bold' 
                      : 'text-slate-400 group-hover:text-slate-600 font-medium'
                  }`}>
                    {s.tag}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Stage Panel: Only 1 Active Stage Rendered (Zero Excessive Vertical Scroll) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          id={`panel-${activeStage}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeStage}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="space-y-4"
        >
          {/* Active Stage Overview Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-blue-50 text-okabe-blue shrink-0 mt-0.5">
                  <currentStage.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-okabe-blue">
                      Tahap {currentStage.stepNum}
                    </span>
                    <span className="text-slate-300 text-xs">·</span>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.2 rounded border ${currentStage.tagColor}`}>
                      {currentStage.tag}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
                    {currentStage.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {currentStage.subtitle}
                  </p>
                </div>
              </div>

              {/* Toggle Button for Details-on-Demand */}
              <button
                onClick={() => setShowDeepDive(!showDeepDive)}
                className={`inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 shadow-2xs ${
                  showDeepDive 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/80'
                }`}
                aria-expanded={showDeepDive}
              >
                {showDeepDive ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tutup Rincian Teknis</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-okabe-blue" />
                    <span>Buka Rincian Teknis</span>
                  </>
                )}
              </button>
            </div>

            {/* Macro Triad Matrix: Input -> Method -> Output */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800 text-[11px]">
                  <Target className="w-3.5 h-3.5 text-okabe-blue shrink-0" />
                  <span>1. Masalah &amp; Tujuan</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {currentStage.objective}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800 text-[11px]">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>2. Metode &amp; Algoritma</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {currentStage.methodology}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>3. Output Tervalidasi</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {currentStage.verifiedOutput}
                </p>
              </div>
            </div>
          </div>

          {/* Deep-Dive Drawer for Active Stage */}
          <AnimatePresence>
            {showDeepDive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                {/* --- TAHAP 01 DEEP DIVE: KAMUS DATA & AUDIT 3T --- */}
                {activeStage === 'ingestion' && (
                  <div className="space-y-4">
                    {/* 3 Metric Provenance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cakupan Geografis</span>
                        <div className="text-base font-extrabold text-slate-900">514 Kabupaten / Kota</div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          413 Kabupaten (80.35%) dan 101 Kota (19.65%) di 34 Provinsi. 100% lengkap mewakili baseline nasional pra-pemekaran Papua.
                        </p>
                      </div>

                      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Verifikasi Silang BPS 2021</span>
                        <div className="text-base font-extrabold text-emerald-700">100% Identik SIRUSA</div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Kota Surakarta (P0 9.40%, IPM 82.62) dan Cilacap (P0 11.67%, IPM 70.42) terbukti cocok sempurna dengan publikasi resmi BPS 2021.
                        </p>
                      </div>

                      <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Koreksi Semantik PDRB</span>
                        <div className="text-base font-extrabold text-okabe-blue">Skala Juta Rupiah</div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Header mentah mencantumkan "(Rupiah)", namun nilai riil BPS berskala Juta Rupiah (Jakarta Pusat Rp460,1 Triliun, Tambrauw Rp147,5 Miliar).
                        </p>
                      </div>
                    </div>

                    {/* Interactive Data Dictionary Table */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
                        <div>
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                            Kamus Data Terstandar (13 Indikator Sosio-Ekonomi BPS)
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Inventaris variabel semantik, satuan baku, rentang nilai empiris lapangan, dan peran metodologis.
                          </p>
                        </div>

                        {/* Filter & Search Bar + Export CSV Action */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => exportDistrictsToCSV(districts, 'poverty_data_cleaned_bps_2021')}
                            className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition"
                            title="Unduh seluruh 514 baris dataset bersih BPS 2021 (CSV)"
                          >
                            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Unduh Dataset Bersih (CSV)</span>
                          </button>

                          <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              aria-label="Cari indikator pada kamus data"
                              placeholder="Cari indikator..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-okabe-blue w-36 sm:w-44 transition"
                            />
                          </div>

                          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-[11px] font-semibold">
                            <button
                              onClick={() => setRoleFilter('all')}
                              className={`px-2 py-0.5 rounded transition ${roleFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
                            >
                              Semua (13)
                            </button>
                            <button
                              onClick={() => setRoleFilter('feature')}
                              className={`px-2 py-0.5 rounded transition ${roleFilter === 'feature' ? 'bg-white text-okabe-blue shadow-2xs font-bold' : 'text-slate-600'}`}
                            >
                              Fitur Model (7)
                            </button>
                            <button
                              onClick={() => setRoleFilter('benchmark')}
                              className={`px-2 py-0.5 rounded transition ${roleFilter === 'benchmark' ? 'bg-white text-amber-800 shadow-2xs font-bold' : 'text-slate-600'}`}
                            >
                              Benchmark (2)
                            </button>
                            <button
                              onClick={() => setRoleFilter('dropped')}
                              className={`px-2 py-0.5 rounded transition ${roleFilter === 'dropped' ? 'bg-white text-[#9E3A00] shadow-2xs font-bold' : 'text-slate-600'}`}
                            >
                              Dieliminasi (1)
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto max-h-80 overflow-y-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <caption className="sr-only">Kamus Data 13 Indikator Sosio-Ekonomi BPS 2021</caption>
                          <thead className="sticky top-0 z-10">
                            <tr className="border-b border-slate-200 bg-slate-50 text-[10.5px] uppercase font-bold text-slate-500">
                              <th className="py-2.5 px-3">Nama Kolom Teknis</th>
                              <th className="py-2.5 px-3">Label Indikator BPS</th>
                              <th className="py-2.5 px-3">Dimensi &amp; Pilar SDG</th>
                              <th className="py-2.5 px-3">Satuan</th>
                              <th className="py-2.5 px-3">Rentang Empiris</th>
                              <th className="py-2.5 px-3">Peran Metodologis</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {filteredDictionary.map((item) => (
                              <tr key={item.key} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-2.5 px-3 font-mono font-semibold text-slate-900 text-[11px]">
                                  {item.key}
                                </td>
                                <td className="py-2.5 px-3 font-medium text-slate-800">
                                  {item.labelBps}
                                </td>
                                <td className="py-2.5 px-3 text-slate-600">
                                  <span className="font-semibold text-slate-900 block">{item.dimension}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{item.sdgTag}</span>
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                                  {item.unit}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-800 font-medium">
                                  {item.rangeEmpirical}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                                    item.role === 'feature'
                                      ? 'bg-blue-50 text-okabe-blue border-blue-200'
                                      : item.role === 'benchmark'
                                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                                      : item.role === 'dropped'
                                      ? 'bg-red-50 text-[#9E3A00] border-red-200 font-bold'
                                      : 'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}>
                                    {item.roleLabel}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Special Audit: 3T Extreme Boundary Cases (0.00%) */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-3">
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                          Audit Khusus Nilai Batas Lapangan Ekstrem (0.00%) di Wilayah 3T Papua
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          Angka 0.00% pada variabel berikut bukan kesalahan pengetikan (*clerical error*), melainkan cerminan faktual isolasi geografis:
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {boundaryCases.map(b => (
                          <div key={b.region} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-900">{b.region}</span>
                              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                                {b.value.toFixed(2)}{b.unit}
                              </span>
                            </div>
                            <div className="text-[11px] text-okabe-blue font-semibold">
                              Indikator: {b.variable_label} (P0: {b.p0.toFixed(2)}%)
                            </div>
                            <p className="text-[11.5px] text-slate-600 leading-relaxed">
                              {b.context}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAHAP 02 DEEP DIVE: PREPROCESSING & DISTRIBUSI --- */}
                {activeStage === 'preprocessing' && (
                  <div className="space-y-4">
                    {/* Skewness Correction & log1p banner */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-3">
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                        Normalisasi Kemencengan Ekstrem PDRB Makro via Transformasi log1p
                      </h3>
                      <p className="text-[11.5px] text-slate-600 leading-relaxed">
                        PDRB riil konstan 2010 memiliki koefisien kemiringan (*skewness*) awal sebesar <strong>+5.85</strong> karena PDRB Kota Jakarta Pusat (Rp460,08 Triliun) mencapai <strong>52 kali lipat</strong> dari median nasional (Rp8,81 Triliun). Tanpa koreksi, algoritma K-Means berbasis jarak Euclidean akan terdistorsi 100% oleh skala PDRB Jakarta.
                      </p>
                      <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <code>x_log_pdrb = ln(1 + grdp_constant_million_idr)</code>
                        <span className="text-slate-300 text-[11px] font-sans">
                          Hasil: Skewness turun dari <strong>+5.85</strong> menjadi <strong>+0.23</strong> (distribusi simetris normal).
                        </span>
                      </div>
                    </div>

                    {/* Direct Embedded Tukey Boxplot Outlier Inspection */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div>
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                            Audit Outlier Univariat: Diagram Distribusi Tukey Boxplot (P0 Kemiskinan Moneter)
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Evaluasi sebaran 514 daerah berbasis rentang interkuartil (1.5x IQR) untuk mengidentifikasi kantong kemiskinan kritis.
                          </p>
                        </div>
                        <div className="inline-flex items-center space-x-1.5 text-xs text-slate-700 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          <span className="font-bold">{p0OutlierCount} Pencilan Atas (&gt; {upperWhiskerVal.toFixed(2)}%)</span>
                        </div>
                      </div>

                      {/* Chart Component */}
                      <TukeyBoxplot districts={districts} />

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center text-xs">
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-semibold">Min (Bawah)</span>
                          <strong className="text-xs text-slate-900 font-mono">{minVal.toFixed(2)}%</strong>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-semibold">Kuartil 1 (Q1)</span>
                          <strong className="text-xs text-slate-900 font-mono">{q1Val.toFixed(2)}%</strong>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                          <span className="text-[10px] text-okabe-blue block font-semibold">Median Nasional</span>
                          <strong className="text-xs text-okabe-blue font-mono font-bold">{medianVal.toFixed(2)}%</strong>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-semibold">Kuartil 3 (Q3)</span>
                          <strong className="text-xs text-slate-900 font-mono">{q3Val.toFixed(2)}%</strong>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                          <span className="text-[10px] text-amber-800 block font-semibold">Batas Atas Whisker</span>
                          <strong className="text-xs text-amber-900 font-mono">{upperWhiskerVal.toFixed(2)}%</strong>
                        </div>
                      </div>
                    </div>

                    {/* 26 Multivariate Anomalies & RobustScaler Protocol */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Isolation Forest Card */}
                      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                            26 Anomali Multivariat Isolation Forest (Prinsip SDG 1)
                          </h3>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            Contamination: 0.05
                          </span>
                        </div>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed">
                          Deteksi multivariat menemukan 26 observasi ekstrim pada 2 kutub: <strong>Kutub 3T Tertinggal</strong> (Nduga, Intan Jaya, Mamberamo Tengah) dan <strong>Kutub Megapolitan</strong> (Jakarta Pusat, Jakarta Selatan).
                        </p>
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs">
                          <strong className="block font-bold">Kebijakan Mutlak: Strictly DO NOT DROP</strong>
                          Menghapus daerah 3T melanggar etika mandat UN SDG 1 (<em>"Leave No One Behind"</em>). Seluruh 514 daerah dipertahankan penuh melalui penskalaan robust.
                        </div>
                      </div>

                      {/* RobustScaler Card */}
                      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                            Protokol Penskalaan: RobustScaler vs StandardScaler
                          </h3>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-okabe-blue border border-blue-200">
                            Median &amp; IQR
                          </span>
                        </div>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed">
                          Menggunakan rumus standarisasi <code>z = (x - median) / IQR</code>. Berbeda dengan StandardScaler yang memakai mean dan varians yang rentan terdistorsi oleh 26 anomali, RobustScaler memastikan titik pusat klaster stabil bagi 488 kabupaten mayoritas.
                        </p>
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-mono">
                          <span>Median P0 = 10.46% · IQR P0 = 7.74%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAHAP 03 DEEP DIVE: ANTI-LEAKAGE & KAGGLE DECONSTRUCTION --- */}
                {activeStage === 'integrity' && (
                  <div className="space-y-4">
                    {/* Reverse-Engineering Kaggle Label Banner */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-3">
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                          Dekonstruksi Reverse-Engineering Formula Heuristik Label Kaggle
                        </h3>
                        <p className="text-[11.5px] text-slate-600 mt-1 leading-relaxed">
                          Tim peneliti membuktikan secara matematis bahwa kolom label bawaan <code>Klasifikasi Kemiskinan</code> pada berkas mentah 
                          dapat direkonstruksi sempurna sebesar <strong>98.83% (508 dari 514 daerah)</strong> hanya dengan rumus deterministik logika biner sederhana berikut:
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto shadow-inner space-y-1">
                        <code>
                          Class 1 (Miskin) &lt;=&gt; (poverty_rate_p0 &gt; 20.0%) OR (expenditure_per_capita &le; 6,250 AND sanitation_access_pct &le; 56.0%)
                        </code>
                        <p className="text-[10px] text-slate-400 font-sans">
                          *Catatan: <code>expenditure_per_capita</code> bersatuan ribu rupiah disetahunkan (&le; 6.250 ribu = &le; Rp6,25 Juta/tahun).
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Tingkat Kecocokan</span>
                          <div className="text-base font-extrabold text-okabe-blue mt-0.5">98.83% Cocok</div>
                          <p className="text-[11px] text-slate-500 mt-0.5">508 observasi terbukti identik formula</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Implikasi Ilmiah</span>
                          <div className="text-base font-extrabold text-amber-700 mt-0.5">Bukan Ground Truth</div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Aturan buatan uploader Kaggle</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Keputusan Metodologi</span>
                          <div className="text-base font-extrabold text-emerald-700 mt-0.5">Label Didrop 100%</div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Mencegah circular reasoning</p>
                        </div>
                      </div>
                    </div>

                    {/* 4 Pillars of Data Science Integrity (2x2 Grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                      {/* Card 1: Zero Target Leakage */}
                      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>1. Zero Target Leakage &amp; Tanpa Supervisi</span>
                          </div>
                          <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Passed
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Penolakan mutlak terhadap model klasifikasi biner untuk mencegah kebocoran target:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] pl-1 leading-relaxed">
                          <li><strong>Label Biner Dibuang 100%:</strong> Kolom <code>Klasifikasi Kemiskinan</code> dieliminasi penuh.</li>
                          <li><strong>Eksklusi P0 dari Fitur:</strong> Kemiskinan moneter $P_0$ hanya dipakai sebagai tolok ukur pengujian eksternal independen.</li>
                        </ul>
                      </div>

                      {/* Card 2: Multikolinearitas */}
                      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>2. Pencegahan Multikolinearitas (IPM &amp; TPAK)</span>
                          </div>
                          <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Passed
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Menghindari pembobotan ganda (*double-counting*) dalam jarak Euclidean:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] pl-1 leading-relaxed">
                          <li><strong>Eksklusi IPM Komposit:</strong> Korelasi r &gt; 0.86 dengan komponennya akan menggelembungkan bobot modal manusia hingga 3x lipat dibanding sanitasi/air.</li>
                          <li><strong>Eksklusi TPAK dari Klaster:</strong> Korelasi $r = -0.582$ dengan TPT; mempertahankan keduanya mereduksi Silhouette. TPAK dimodelkan pada OLS.</li>
                        </ul>
                      </div>

                      {/* Card 3: Mandat SDG 1 */}
                      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>3. Preservasi 26 Anomali (Leave No One Behind)</span>
                          </div>
                          <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Passed
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Kepatuhan etis terhadap mandat UN SDG 1:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] pl-1 leading-relaxed">
                          <li><strong>0 Baris Dihapus:</strong> Anomali 3T mencerminkan fakta empiris disparitas nyata kepulauan dan pegunungan.</li>
                          <li><strong>RobustScaler:</strong> Menjaga stabilitas partisi tanpa mengorbankan keterwakilan daerah paling terisolir.</li>
                        </ul>
                      </div>

                      {/* Card 4: Larangan Spider Chart */}
                      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>4. Larangan Radar / Spider Chart</span>
                          </div>
                          <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Passed
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          Kepatuhan visualisasi Stephen Few &amp; Cole Knaflic:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] pl-1 leading-relaxed">
                          <li><strong>Axis-Order Bias:</strong> Luas poligon radar berubah drastis hanya dengan menukar posisi sumbu.</li>
                          <li><strong>Solusi Standar:</strong> Digantikan secara baku oleh Small Multiples Z-Score batang dengan garis acuan $Z=0$.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAHAP 04 DEEP DIVE: K-MEANS, BENCHMARK, LIMITASI & REPRODUKSIBILITAS --- */}
                {activeStage === 'validation' && (
                  <div className="space-y-4">
                    {/* Benchmark 160 Model & Pemilihan K-Means k=4 */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                            Engine A: Seleksi Benchmark 160 Model &amp; Rasional Ilmiah Pemilihan Klaster k = 4
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Audit komparasi terhadap 160 model klastering (123 valid) lintas kombinasi algoritma, scaler, dan jumlah k.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-okabe-blue">
                          Viabilitas Kebijakan
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Total Model Diuji</span>
                          <div className="text-base font-extrabold text-slate-900 mt-0.5">160 Model</div>
                          <span className="text-[9.5px] text-slate-500 block mt-0.5">123 Model Non-Degenerate</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Juara Komposit Algoritmik</span>
                          <div className="text-base font-extrabold text-amber-700 mt-0.5">Agglomerative k=3</div>
                          <span className="text-[9.5px] text-slate-500 block mt-0.5">Sil 0.3129 · Blob 388 Daerah (75.5%)</span>
                        </div>
                        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
                          <span className="text-[9.5px] uppercase font-bold text-okabe-blue block">Model Terpilih (Kebijakan)</span>
                          <div className="text-base font-extrabold text-okabe-blue mt-0.5">K-Means k=4</div>
                          <span className="text-[9.5px] text-slate-600 block mt-0.5">Sil 0.2028 · 4 Klaster Berimbang</span>
                        </div>
                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                          <span className="text-[9.5px] uppercase font-bold text-emerald-800 block">Stabilitas Multi-Seed</span>
                          <div className="text-base font-extrabold text-emerald-700 mt-0.5">ARI = 0.9803</div>
                          <span className="text-[9.5px] text-slate-600 block mt-0.5">Uji 20 Perturbasi Seed Acak</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[11.5px] text-slate-700 leading-relaxed space-y-1">
                        <strong className="text-slate-900 font-bold block">
                          Transparansi Metodologi: Mengapa K-Means k=4 Dipilih dibanding Juara Algoritmik Agglomerative k=3?
                        </strong>
                        <p>
                          Meskipun Agglomerative complete k=3 mencatat skor Silhouette tertinggi (0.3129), model tersebut menghasilkan <em>degenerate cluster</em> di mana <strong>388 daerah (75.5% Indonesia)</strong> menumpuk ke dalam 1 klaster raksasa tunggal tanpa membedakan profil kabupaten berkembang vs tertinggal.
                        </p>
                        <p>
                          Sebaliknya, K-Means k=4 dipilih atas dasar <strong>pertimbangan viabilitas kebijakan (policy actionability)</strong>: partisi menghasilkan ukuran yang berimbang dan actionable (Klaster 1: 78, Klaster 2: 187, Klaster 3: 216, Klaster 4: 33 daerah), memisahkan Klaster 2 Penyangga Mapan dari Klaster 3 Agraris Rentan dengan disparitas sanitasi nyata (Δ = 12.38 poin persentase) dan derajat kesehatan UHH (Δ = 3.72 tahun), sekaligus memiliki stabilitas perturbasi seed yang sangat tinggi (ARI = 0.9803).
                        </p>
                      </div>

                      {/* Validasi Eksternal P0 Box */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">Validasi Inferensial Eksternal (ANOVA Kemiskinan Moneter P0):</span>
                          <p className="text-slate-600 text-[11px]">
                            P0 tidak dimasukkan ke dalam pembentukan klaster. Uji beda rata-rata membuktikan 4 klaster memisahkan gradasi kemiskinan secara signifikan:
                          </p>
                        </div>
                        <div className="font-mono text-xs font-bold text-okabe-blue bg-white px-2.5 py-1 rounded border border-slate-200 shrink-0">
                          F = 155.94 (p &lt; 0.001, η² = 0.478) · Rata-rata P0: 6.59% → 10.01% → 13.66% → 29.47%
                        </div>
                      </div>
                    </div>

                    {/* Engine B: Mathematical Formulation of V_struc */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                            Engine B: Formulasi Objektif Indeks Kerentanan Struktural Relatif (V_struc)
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Instrumen skrining fasilitas dasar non-moneter yang dinormalisasi Min-Max [0, 1] dengan bobot setara 25%.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-okabe-blue border border-blue-200">
                          Ambang: 0.2720
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl shadow-inner space-y-1">
                        <div className="text-amber-400 font-bold text-sm">
                          V_struc = 0.25 × ( D̃_sanitasi + D̃_air + D̃_RLS + D̃_UHH )
                        </div>
                        <p className="text-[10.5px] text-slate-300 font-sans mt-1">
                          Di mana masing-masing komponen defisit dihitung: D_san = (100 - Sanitasi), D_air = (100 - Air), D_RLS = (Max_RLS - RLS), D_UHH = (Max_UHH - UHH), lalu dinormalisasi Min-Max.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="font-bold text-slate-900 block">Sumbu X: Kemiskinan Moneter Aktual (P0)</span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            Garis potong median nasional: <strong>10.46%</strong>. Mengukur kedaruratan daya beli konsumsi jangka pendek.
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="font-bold text-slate-900 block">Sumbu Y: Kerentanan Fasilitas Dasar (V_struc)</span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            Garis potong median nasional: <strong>0.2720</strong>. Mengukur kedaruratan infrastruktur fisik publik jangka panjang.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Engine C: Multivariate OLS Econometrics */}
                    <div className="space-y-3">
                      <OLSCoefficientsBar olsResults={olsResults} />
                      <NarrativeCallout
                        title="WAWASAN KOEFISIEN BAKU OLS MULTIVARIAT"
                        insight={PARADOXES.olsStandardizedBeta.insightCallout}
                        evidence={PARADOXES.olsStandardizedBeta.evidence}
                      />
                    </div>

                    {/* Limitasi Ilmiah & Apa yang Tidak Dapat Disimpulkan (F-P5-10) */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-3">
                      <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                            Limitasi Metodologi: Batasan Analitis &amp; Apa yang Tidak Dapat Disimpulkan
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Kepatuhan terhadap standar kejujuran ilmiah dan pencegahan overclaiming analitis.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-900 block">1. Data Potong Lintang Tunggal (Cross-Section 2021)</span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Dataset BPS 2021 merupakan potret satu titik waktu (*single cross-section*). Koefisien OLS mengindikasikan <strong>asosiasi statistik kovariansi linier</strong> ceteris paribus, bukan pembuktian kausalitas deterministik langsung dan bukan ramalan masa depan.
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-900 block">2. Bahaya Falasi Ekologis (Ecological Fallacy)</span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Karakteristik yang teramati pada tingkat agregat wilayah kabupaten/kota tidak serta-merta mencerminkan setiap individu warga di dalamnya. Dashboard ini adalah instrumen skrining portofolio makro regional, bukan penentu kelayakan bansos perorangan.
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-900 block">3. Relativitas Sampel Skrining V_struc</span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Normalisasi Min-Max pada indeks kerentanan <span className="font-mono font-bold">V_struc</span> bersifat <strong>relatif terhadap distribusi 514 daerah Indonesia tahun 2021</strong>. Nilai indeks berfungsi untuk membandingkan prioritas relatif antardaerah saat ini, bukan skor absolut antar-tahun.
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-900 block">4. Varians Residu OLS yang Belum Terjelaskan (48.36%)</span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Dengan R² = 51.64%, model OLS menjelaskan separuh variasi kemiskinan moneter. Masih terdapat <strong>48.36% variasi residual</strong> yang dipengaruhi faktor struktural lain di luar 6 indikator (seperti konektivitas logistik maritim dan topografi pegunungan).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reproduksibilitas & Lineage Data Sains (F-P5-11) */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center space-x-2">
                          <Terminal className="w-4 h-4 text-okabe-blue shrink-0" />
                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                            Protokol Reproduksibilitas &amp; Data Lineage
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Deterministic Seed = 42
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-2.5 bg-slate-900 text-slate-200 font-mono rounded-lg space-y-1 text-[11px]">
                          <span className="text-amber-400 font-bold block text-[10px] uppercase">1. Eksekusi Pipeline</span>
                          <code>python -m poverty_radar.pipeline</code>
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5">Memproses raw data hingga final output</p>
                        </div>

                        <div className="p-2.5 bg-slate-900 text-slate-200 font-mono rounded-lg space-y-1 text-[11px]">
                          <span className="text-emerald-400 font-bold block text-[10px] uppercase">2. Uji Otomatis Pytest</span>
                          <code>pytest tests/test_dashboard_payload.py</code>
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5">Verifikasi kontrak JSON &amp; rekonsiliasi</p>
                        </div>

                        <div className="p-2.5 bg-slate-900 text-slate-200 font-mono rounded-lg space-y-1 text-[11px]">
                          <span className="text-blue-400 font-bold block text-[10px] uppercase">3. Silsilah Data (Lineage)</span>
                          <span className="text-[10.5px] text-slate-300 block font-sans">
                            data/raw → data/interim → data/processed → public/data/
                          </span>
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5">Arsitektur data terisolasi &amp; idempotent</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sequential Step Navigation Footer: Allows seamless next/previous stage movement */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200/80 px-4 py-3 shadow-2xs">
            <div>
              {currentStageIndex > 0 ? (
                <button
                  onClick={() => setActiveStage(MACRO_STAGES[currentStageIndex - 1].id)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Tahap Sebelumnya: {MACRO_STAGES[currentStageIndex - 1].shortTitle}</span>
                </button>
              ) : (
                <span className="text-xs text-slate-400 font-medium">Awal Alur Metodologi</span>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
              Tahap <strong>{currentStageIndex + 1}</strong> dari <strong>4</strong> · {currentStage.shortTitle}
            </div>

            <div>
              {currentStageIndex < MACRO_STAGES.length - 1 ? (
                <button
                  onClick={() => setActiveStage(MACRO_STAGES[currentStageIndex + 1].id)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-okabe-blue text-white hover:bg-blue-700 shadow-2xs transition"
                >
                  <span>Lanjut: Tahap {MACRO_STAGES[currentStageIndex + 1].stepNum} · {MACRO_STAGES[currentStageIndex + 1].shortTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai Seluruh Alur</span>
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default MethodologyAudit;
