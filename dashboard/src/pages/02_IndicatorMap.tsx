import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { District } from '../types';
import { IndonesiaChoroplethMap } from '../components/charts/IndonesiaChoroplethMap';
import { SpatialRankingBar } from '../components/charts/SpatialRankingBar';
import { TheGreatDualismBar } from '../components/charts/TheGreatDualismBar';
import { WorkingPoorScatter } from '../components/charts/WorkingPoorScatter';
import { formatPercent, formatYears, formatCurrencyMillion } from '../utils/formatters';
import { Map, BarChart3, Split, ChevronDown, Layers } from 'lucide-react';

interface PageProps {
  districts: District[];
}

export const IndicatorMap: React.FC<PageProps> = ({ districts }) => {
  const [activeSubTab, setActiveSubTab] = useState<'spatial' | 'paradox'>('spatial');
  const [selectedIndicator, setSelectedIndicator] = useState<keyof District>('poverty_rate_p0');
  const [viewMode, setViewMode] = useState<'map' | 'ranking'>('map');

  const indicatorOptions = [
    { key: 'poverty_rate_p0', label: 'Tingkat Kemiskinan Moneter (P0)', unit: '%' },
    { key: 'sanitation_access_pct', label: 'Akses Sanitasi Layak', unit: '%' },
    { key: 'clean_water_access_pct', label: 'Akses Air Bersih Terlindung', unit: '%' },
    { key: 'avg_school_years', label: 'Rata-rata Lama Sekolah (RLS)', unit: ' thn' },
    { key: 'expenditure_per_capita', label: 'Pengeluaran Riil per Kapita', unit: ' Ribu Rp/thn' },
    { key: 'unemployment_rate_tpt', label: 'Tingkat Pengangguran Terbuka (TPT)', unit: '%' },
    { key: 'labor_participation_tpak', label: 'Tingkat Partisipasi Kerja (TPAK)', unit: '%' },
  ];

  const activeOption = indicatorOptions.find(o => o.key === selectedIndicator) || indicatorOptions[0];

  // Dynamic summary statistics for active indicator
  const validDistricts = districts.filter(d => typeof d[selectedIndicator] === 'number');
  const sortedByIndicator = [...validDistricts].sort((a, b) => (a[selectedIndicator] as number) - (b[selectedIndicator] as number));
  const minRegion = sortedByIndicator[0] || null;
  const maxRegion = sortedByIndicator[sortedByIndicator.length - 1] || null;

  const minVal = minRegion ? (minRegion[selectedIndicator] as number) : 0;
  const maxVal = maxRegion ? (maxRegion[selectedIndicator] as number) : 0;

  let medianVal = 0;
  if (sortedByIndicator.length > 0) {
    const mid = Math.floor(sortedByIndicator.length / 2);
    medianVal = sortedByIndicator.length % 2 !== 0
      ? (sortedByIndicator[mid][selectedIndicator] as number)
      : (((sortedByIndicator[mid - 1][selectedIndicator] as number) + (sortedByIndicator[mid][selectedIndicator] as number)) / 2);
  }

  const disparitySpan = maxVal - minVal;
  const disparityRatio = (minVal > 0 && maxVal > 0) ? (maxVal / minVal) : null;

  // Policy thresholds for active indicator
  const THRESHOLD_MAP: Record<string, {
    criticalLabel: string;
    criticalRule: string;
    isCritical: (v: number) => boolean;
    primeLabel: string;
    primeRule: string;
    isPrime: (v: number) => boolean;
  }> = {
    poverty_rate_p0: {
      criticalLabel: "Kemiskinan Kritis",
      criticalRule: "P0 ≥ 20.0%",
      isCritical: (v) => v >= 20.0,
      primeLabel: "Target RPJMN Tercapai",
      primeRule: "P0 ≤ 7.0%",
      isPrime: (v) => v <= 7.0,
    },
    sanitation_access_pct: {
      criticalLabel: "Defisit Sanitasi Kritis",
      criticalRule: "Akses < 60.0%",
      isCritical: (v) => v < 60.0,
      primeLabel: "Standar Layak Terpenuhi",
      primeRule: "Akses ≥ 80.0% (SPM)",
      isPrime: (v) => v >= 80.0,
    },
    clean_water_access_pct: {
      criticalLabel: "Defisit Air Terlindung",
      criticalRule: "Akses < 60.0%",
      isCritical: (v) => v < 60.0,
      primeLabel: "Akses Air Terlindung Baik",
      primeRule: "Akses ≥ 80.0%",
      isPrime: (v) => v >= 80.0,
    },
    avg_school_years: {
      criticalLabel: "Di Bawah Tamat SD",
      criticalRule: "RLS < 7.0 Tahun",
      isCritical: (v) => v < 7.0,
      primeLabel: "Tuntas Wajib Belajar",
      primeRule: "RLS ≥ 9.0 Tahun (SMP)",
      isPrime: (v) => v >= 9.0,
    },
    expenditure_per_capita: {
      criticalLabel: "Daya Beli Rendah",
      criticalRule: "< Rp8,5 Jt/thn",
      isCritical: (v) => v < 8500,
      primeLabel: "Konsumsi Mapan",
      primeRule: "≥ Rp12,0 Jt/thn",
      isPrime: (v) => v >= 12000,
    },
    unemployment_rate_tpt: {
      criticalLabel: "Pengangguran Tinggi",
      criticalRule: "TPT ≥ 7.0%",
      isCritical: (v) => v >= 7.0,
      primeLabel: "Pasar Kerja Stabil",
      primeRule: "TPT < 4.5%",
      isPrime: (v) => v < 4.5,
    },
    labor_participation_tpak: {
      criticalLabel: "Tekanan Subsistensi Tinggi",
      criticalRule: "TPAK ≥ 75.0%",
      isCritical: (v) => v >= 75.0,
      primeLabel: "Struktur Formal Seimbang",
      primeRule: "TPAK < 68.0%",
      isPrime: (v) => v < 68.0,
    },
  };

  const activeThreshold = THRESHOLD_MAP[selectedIndicator as string] || THRESHOLD_MAP['poverty_rate_p0'];
  const criticalCount = validDistricts.filter(d => activeThreshold.isCritical(d[selectedIndicator] as number)).length;
  const criticalPct = validDistricts.length > 0 ? (criticalCount / validDistricts.length) * 100 : 0;
  const primeCount = validDistricts.filter(d => activeThreshold.isPrime(d[selectedIndicator] as number)).length;
  const primePct = validDistricts.length > 0 ? (primeCount / validDistricts.length) * 100 : 0;

  const formatIndicatorVal = (v: number): string => {
    if (selectedIndicator === 'expenditure_per_capita') return formatCurrencyMillion(v);
    if (selectedIndicator === 'avg_school_years') return formatYears(v);
    return formatPercent(v);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-3.5"
    >
      {/* 1. Page Header: Title on Left, Global Mode Tabs on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            {activeSubTab === 'spatial'
              ? "Sebaran Spasial & Disparitas Indikator Daerah"
              : "Dua Paradoks Sosio-Ekonomi: PDRB, Ketenagakerjaan, & Kemiskinan"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {activeSubTab === 'spatial'
              ? "Eksplorasi geospasial 514 kabupaten–kota di 34 provinsi berdasarkan capaian indikator struktural."
              : "Menelaah anomali struktural: kesenjangan kabupaten vs kota dan paradoks tenaga kerja agraris."}
          </p>
        </div>

        {/* Global Mode Switcher Pill */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 shrink-0 self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setActiveSubTab('spatial')}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'spatial'
                ? 'bg-white text-okabe-blue shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Sebaran Spasial</span>
          </button>
          <button
            onClick={() => setActiveSubTab('paradox')}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeSubTab === 'paradox'
                ? 'bg-white text-okabe-vermillion shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Dua Paradoks</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'spatial' ? (
        <div className="space-y-3">
          {/* 2. Integrated Indicator Control & Micro-KPI Deck */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            {/* Top Toolbar: Indicator Selector & View Mode Switcher */}
            <div className="px-3.5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700 flex items-center space-x-1 shrink-0">
                  <Layers className="w-3.5 h-3.5 text-okabe-blue" />
                  <span>Pilih Indikator:</span>
                </span>
                <div className="relative">
                  <select
                    value={selectedIndicator}
                    onChange={(e) => setSelectedIndicator(e.target.value as keyof District)}
                    aria-label="Pilih Indikator Spasial"
                    className="appearance-none bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-okabe-blue/20 focus:border-okabe-blue focus:outline-hidden cursor-pointer shadow-2xs"
                  >
                    {indicatorOptions.map(opt => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* View Mode Toggle: Peta vs Peringkat */}
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs self-end sm:self-auto">
                <button
                  onClick={() => setViewMode('map')}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === 'map'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Tampilan Peta Geospasial 34 Provinsi"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Peta Geospasial</span>
                </button>
                <button
                  onClick={() => setViewMode('ranking')}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === 'ranking'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Tampilan Peringkat Bar Horizontal"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Peringkat Daerah</span>
                </button>
              </div>
            </div>

            {/* Bottom KPI Strip: 4 Dynamic Metric Columns */}
            <div className="p-3 grid grid-cols-2 md:grid-cols-4 gap-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Metric 1: Median Nasional */}
              <div className="pt-1 md:pt-0 md:px-2 first:px-0">
                <span className="text-[11px] font-medium text-slate-500 block">Median Nasional</span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-base font-extrabold text-slate-900 tabular-nums">
                    {formatIndicatorVal(medianVal)}
                  </span>
                </div>
                <span className="text-[10.5px] text-slate-400 block mt-0.5 truncate">
                  Titik tengah 514 daerah
                </span>
              </div>

              {/* Metric 2: Defisit Kritis */}
              <div className="pt-2 md:pt-0 md:px-3">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-okabe-vermillion"></span>
                  <span className="text-[11px] font-semibold text-slate-700">{activeThreshold.criticalLabel}</span>
                </div>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-base font-extrabold text-okabe-vermillion tabular-nums">
                    {criticalCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    ({criticalPct.toFixed(1)}%)
                  </span>
                </div>
                <span className="text-[10.5px] text-slate-400 block mt-0.5 truncate font-mono">
                  Kriteria: {activeThreshold.criticalRule}
                </span>
              </div>

              {/* Metric 3: Capaian Standar */}
              <div className="pt-2 md:pt-0 md:px-3">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="text-[11px] font-semibold text-slate-700">{activeThreshold.primeLabel}</span>
                </div>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-base font-extrabold text-emerald-700 tabular-nums">
                    {primeCount}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    ({primePct.toFixed(1)}%)
                  </span>
                </div>
                <span className="text-[10.5px] text-slate-400 block mt-0.5 truncate font-mono">
                  Standar: {activeThreshold.primeRule}
                </span>
              </div>

              {/* Metric 4: Rasio Disparitas */}
              <div className="pt-2 md:pt-0 md:px-3 last:pr-0">
                <span className="text-[11px] font-medium text-slate-500 block">Rasio Disparitas Wilayah</span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-base font-extrabold text-okabe-blue tabular-nums">
                    {disparityRatio !== null ? `${disparityRatio.toFixed(1)}x` : formatIndicatorVal(disparitySpan)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {disparityRatio !== null ? "Lipat" : ""}
                  </span>
                </div>
                <span className="text-[10.5px] text-slate-400 block mt-0.5 truncate" title={minRegion && maxRegion ? `${minRegion.kab_kota} vs ${maxRegion.kab_kota}` : ''}>
                  {minRegion && maxRegion ? `${minRegion.kab_kota.replace(/^(Kabupaten|Kota)\s+/, '')} ↔ ${maxRegion.kab_kota.replace(/^(Kabupaten|Kota)\s+/, '')}` : `Rentang: ${formatIndicatorVal(disparitySpan)}`}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Primary Hero Visualization (Choropleth Map or Ranking Bar) */}
          <div>
            {viewMode === 'map' ? (
              <IndonesiaChoroplethMap
                districts={districts}
                indicator={selectedIndicator}
                indicatorLabel={activeOption.label}
                unit={activeOption.unit}
              />
            ) : (
              <SpatialRankingBar
                districts={districts}
                indicator={selectedIndicator}
                indicatorLabel={activeOption.label}
                unit={activeOption.unit}
              />
            )}
          </div>
        </div>
      ) : (
        /* Mode B: Dua Paradoks Sosio-Ekonomi */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TheGreatDualismBar districts={districts} />
          <WorkingPoorScatter districts={districts} />
        </div>
      )}
    </motion.div>
  );
};

export default IndicatorMap;
