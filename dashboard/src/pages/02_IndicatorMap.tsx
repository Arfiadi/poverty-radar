import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { District } from '../types';
import { IndonesiaChoroplethMap } from '../components/charts/IndonesiaChoroplethMap';
import { SpatialRankingBar } from '../components/charts/SpatialRankingBar';
import { TheGreatDualismBar } from '../components/charts/TheGreatDualismBar';
import { WorkingPoorScatter } from '../components/charts/WorkingPoorScatter';
import { NarrativeCallout } from '../components/common/NarrativeCallout';
import { KpiCard } from '../components/common/KpiCard';
import { PARADOXES } from '../constants/paradoxes';
import { formatPercent, formatYears, formatCurrencyMillion } from '../utils/formatters';
import { Map, BarChart3 } from 'lucide-react';

interface PageProps {
  districts: District[];
}

export const IndicatorMap: React.FC<PageProps> = ({ districts }) => {
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
      className="space-y-6"
    >
      {/* Action Header */}
      <div className="bg-surface rounded-2xl border border-slate-200/80 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-okabe-blue"></span>
            <span>Babak 2: The Geography · Eksplorasi Spasial & Dikotomi Wilayah</span>
          </div>
          <h2 className="text-xl font-extrabold text-ink-primary tracking-tight">
            Polarisasi Geografis: Peta Spasial Kepulauan & Paradoks Ketenagakerjaan
          </h2>
          <p className="text-xs text-ink-muted mt-1 max-w-2xl">
            Menyingkap ketimpangan spasial 34 provinsi melalui peta poligon interaktif dan membongkar dua paradoks mendasar: jurang kemiskinan kabupaten vs kota, serta tekanan kerja subsistensi di wilayah 3T.
          </p>
        </div>

        {/* Controls: Mode Toggle & Indicator Selector */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button
              onClick={() => setViewMode('map')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                viewMode === 'map'
                  ? 'bg-white text-okabe-blue shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Peta Spasial</span>
            </button>
            <button
              onClick={() => setViewMode('ranking')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                viewMode === 'ranking'
                  ? 'bg-white text-okabe-blue shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Peringkat 34 Provinsi</span>
            </button>
          </div>

          {/* Indicator Layer Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold text-slate-600">Pilih Indikator:</label>
            <select
              value={selectedIndicator}
              onChange={(e) => setSelectedIndicator(e.target.value as keyof District)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs bg-white text-ink-primary font-medium focus:ring-1 focus:ring-okabe-blue focus:outline-hidden"
            >
              {indicatorOptions.map(opt => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Row 1: Active Indicator KPI Cards Strip (4 Cards with Stephen Few Micro Bullet Graph) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label={`Median: ${activeOption.label}`}
          value={formatIndicatorVal(medianVal)}
          benchmarkText="Titik Tengah Distribusi (Median Wilayah)"
          contextText={`Cakupan: ${districts.length} daerah · Rentang: ${formatIndicatorVal(minVal)} s.d. ${formatIndicatorVal(maxVal)}`}
          badge={{ text: `${districts.length} Daerah`, type: "default" }}
          range={{
            min: minVal,
            max: maxVal,
            current: medianVal,
            minLabel: minRegion ? `${minRegion.kab_kota} (${formatIndicatorVal(minVal)})` : "",
            maxLabel: maxRegion ? `${maxRegion.kab_kota} (${formatIndicatorVal(maxVal)})` : "",
            unit: activeOption.unit,
          }}
        />

        <KpiCard
          label={`Capaian Tertinggi: ${activeOption.label}`}
          value={formatIndicatorVal(maxVal)}
          benchmarkText={maxRegion ? `${maxRegion.kab_kota} (${maxRegion.provinsi})` : "—"}
          contextText={`Selisih terhadap titik tengah: +${formatIndicatorVal(maxVal - medianVal)}`}
          badge={{ text: "Nilai Maksimum", type: "positive" }}
          range={{
            min: minVal,
            max: maxVal,
            current: maxVal,
            minLabel: `Min: ${formatIndicatorVal(minVal)}`,
            maxLabel: `Max: ${formatIndicatorVal(maxVal)}`,
            unit: activeOption.unit,
          }}
          accentColor="#0072B2"
        />

        <KpiCard
          label={`Capaian Terendah: ${activeOption.label}`}
          value={formatIndicatorVal(minVal)}
          benchmarkText={minRegion ? `${minRegion.kab_kota} (${minRegion.provinsi})` : "—"}
          contextText={
            disparityRatio !== null
              ? `Rasio kesenjangan: ${disparityRatio.toFixed(1)}x lipat`
              : `Rentang disparitas absolut: ${formatIndicatorVal(disparitySpan)}`
          }
          badge={{ text: "Nilai Minimum", type: "warning" }}
          range={{
            min: minVal,
            max: maxVal,
            current: minVal,
            minLabel: `Min: ${formatIndicatorVal(minVal)}`,
            maxLabel: `Max: ${formatIndicatorVal(maxVal)}`,
            unit: activeOption.unit,
          }}
          accentColor="#D55E00"
        />

        <KpiCard
          label="Disparitas Antardaerah"
          value={disparityRatio !== null ? `${disparityRatio.toFixed(2)}x Lipat` : formatIndicatorVal(disparitySpan)}
          benchmarkText={`Rentang Spasial: ${formatIndicatorVal(disparitySpan)}`}
          contextText={
            minRegion && maxRegion
              ? `Kesenjangan antara ${minRegion.kab_kota} dan ${maxRegion.kab_kota}`
              : "Variasi sebaran indikator antardaerah"
          }
          badge={{
            text: disparityRatio && disparityRatio >= 3.0 ? "Disparitas Tinggi" : "Kesenjangan Spasial",
            type: disparityRatio && disparityRatio >= 3.0 ? "warning" : "default",
          }}
          range={{
            min: 1.0,
            max: Math.max(disparityRatio || 1, 10.0),
            current: disparityRatio || 1.0,
            target: 1.0,
            minLabel: "1.0x (Seragam)",
            maxLabel: `${Math.max(disparityRatio || 1, 10.0).toFixed(0)}x`,
            targetLabel: "Target: 1.0x",
            unit: "x",
          }}
          accentColor="#E69F00"
        />
      </div>

      {/* Primary Spatial Visualization: Map or Ranking Bar */}
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

      {/* Dualism & Working Poor Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TheGreatDualismBar districts={districts} />
        <WorkingPoorScatter districts={districts} />
      </div>

      {/* Narrative Callout for Dualism & Working Poor */}
      <NarrativeCallout
        title="WAWASAN DUALISME SPASIAL & KERJA SUBSISTENSI"
        insight="Kabupaten menanggung kemiskinan 1.9x lebih tinggi dari kota, sementara pengangguran rendah di wilayah miskin mencerminkan kerja subsistensi bertahan hidup (r = +0.462), bukan tingginya kemakmuran ekonomi."
        evidence="Rasio P0 Kab:Kota = 1.87x; Rasio TPT Kota:Kab = 1.82x; Nduga TPAK 97.93% dengan TPT 0.00%."
      />
    </motion.div>
  );
};

export default IndicatorMap;
