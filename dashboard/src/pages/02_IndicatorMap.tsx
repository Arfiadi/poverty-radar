import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { District } from '../types';
import { IndonesiaChoroplethMap } from '../components/charts/IndonesiaChoroplethMap';
import { SpatialRankingBar } from '../components/charts/SpatialRankingBar';
import { TheGreatDualismBar } from '../components/charts/TheGreatDualismBar';
import { WorkingPoorScatter } from '../components/charts/WorkingPoorScatter';
import { NarrativeCallout } from '../components/common/NarrativeCallout';
import { PARADOXES } from '../constants/paradoxes';
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
    { key: 'expenditure_per_capita', label: 'Pengeluaran Riil per Kapita', unit: ' Rp' },
    { key: 'unemployment_rate_tpt', label: 'Tingkat Pengangguran Terbuka (TPT)', unit: '%' },
    { key: 'labor_participation_tpak', label: 'Tingkat Partisipasi Kerja (TPAK)', unit: '%' },
  ];

  const activeOption = indicatorOptions.find(o => o.key === selectedIndicator) || indicatorOptions[0];

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
        title="WAWASAN THE GREAT DUALISM & THE WORKING POOR"
        insight={`${PARADOXES.greatDualism.insightCallout} ${PARADOXES.workingPoor.insightCallout}`}
        evidence={PARADOXES.workingPoor.evidence}
      />
    </motion.div>
  );
};
