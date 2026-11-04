import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { District, ClusterSummary } from '../types';
import { SmallMultiplesZScore } from '../components/charts/SmallMultiplesZScore';
import { CLUSTERS } from '../constants/benchmarks';
import { formatPercent, formatYears, formatCurrencyMillion } from '../utils/formatters';
import { Filter, RotateCcw } from 'lucide-react';

interface PageProps {
  districts: District[];
  allDistricts?: District[];
  clusterSummary: ClusterSummary[];
}

export const RegionalProfiles: React.FC<PageProps> = ({ districts, allDistricts, clusterSummary }) => {
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);

  const baselineDistricts = allDistricts && allDistricts.length > 0 ? allDistricts : districts;
  const isFiltered = districts.length < baselineDistricts.length;

  // Compute national means for mathematically unbiased baseline delta comparison (mean vs mean)
  const getMean = (key: keyof District): number => {
    const vals = baselineDistricts
      .map(d => d[key] as number)
      .filter(v => typeof v === 'number');
    if (!vals.length) return 0;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const natMeanP0 = getMean('poverty_rate_p0');
  const natMeanSan = getMean('sanitation_access_pct');
  const natMeanRls = getMean('avg_school_years');
  const natMeanExp = getMean('expenditure_per_capita');

  const CLUSTER_SUBTITLES: Record<number, string> = {
    0: "Modal manusia & konsumsi tertinggi; pengangguran terbuka perkotaan",
    1: "Kemandirian penyangga baik; akses sarana dasar mendekati standar",
    2: "Mayoritas agraris; penyerapan subsistensi rentan defisit sanitasi",
    3: "Deprivasi ganda akut: isolasi 3T, sanitasi 31.2% & kemiskinan ekstrem",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-3.5"
    >
      {/* Editorial Header & Interactive Reset Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            Arketipe Profil Daerah: 4 Tipologi Klaster Sosio-Ekonomi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Pengelompokan tanpa pengawasan (K-Means, k=4) terhadap 7 indikator struktural dasar (P0 dievaluasi eksternal).
          </p>
        </div>

        {selectedClusterId !== null && (
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setSelectedClusterId(null)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
              title="Reset sorotan klaster ke semua data"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Sorotan</span>
            </button>
          </div>
        )}
      </div>

      {/* 4 Clean Executive Cluster Archetype Cards (High Data-Ink, Clickable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CLUSTERS.map((c) => {
          const summary = clusterSummary.find(s => s.cluster_id === c.id);
          const cDistricts = districts.filter(d => d.cluster_id === c.id);
          const hasData = cDistricts.length > 0;
          const isSelected = selectedClusterId === c.id;

          const totalRegions = isFiltered ? cDistricts.length : (summary?.total_regions ?? c.count);
          const pctNational = isFiltered 
            ? (districts.length > 0 ? (cDistricts.length / districts.length) * 100 : 0)
            : (summary?.pct_of_national ?? Number(((c.count / 514) * 100).toFixed(1)));

          const meanP0 = isFiltered
            ? (hasData ? cDistricts.reduce((a, b) => a + b.poverty_rate_p0, 0) / cDistricts.length : 0)
            : (summary?.poverty_rate_p0_mean ?? (hasData ? cDistricts.reduce((a, b) => a + b.poverty_rate_p0, 0) / cDistricts.length : 0));
          const meanRls = isFiltered
            ? (hasData ? cDistricts.reduce((a, b) => a + b.avg_school_years, 0) / cDistricts.length : 0)
            : (summary?.avg_school_years_mean ?? (hasData ? cDistricts.reduce((a, b) => a + b.avg_school_years, 0) / cDistricts.length : 0));
          const meanSan = isFiltered
            ? (hasData ? cDistricts.reduce((a, b) => a + b.sanitation_access_pct, 0) / cDistricts.length : 0)
            : (summary?.sanitation_access_pct_mean ?? (hasData ? cDistricts.reduce((a, b) => a + b.sanitation_access_pct, 0) / cDistricts.length : 0));
          const meanExp = isFiltered
            ? (hasData ? cDistricts.reduce((a, b) => a + b.expenditure_per_capita, 0) / cDistricts.length : 0)
            : (summary?.expenditure_per_capita_mean ?? (hasData ? cDistricts.reduce((a, b) => a + b.expenditure_per_capita, 0) / cDistricts.length : 0));

          const deltaP0 = meanP0 - natMeanP0;
          const deltaSan = meanSan - natMeanSan;
          const deltaRls = meanRls - natMeanRls;
          const deltaExp = meanExp - natMeanExp;

          return (
            <div 
              key={c.id}
              onClick={() => setSelectedClusterId(isSelected ? null : c.id)}
              className={`bg-white rounded-xl border p-3.5 shadow-2xs transition-all cursor-pointer flex flex-col justify-between ${
                isSelected 
                  ? 'ring-2 ring-slate-900 border-slate-900 shadow-sm' 
                  : 'border-slate-200/80 hover:border-slate-300 hover:shadow-subtle'
              }`}
              style={{ borderTop: `3px solid ${c.color}` }}
            >
              <div>
                {/* Header: Cluster ID & Region Count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Klaster {c.id + 1}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-900 text-white font-mono">
                        Fokus
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-100">
                    N={totalRegions} ({pctNational.toFixed(0)}%)
                  </span>
                </div>

                {/* Cluster Name & Subtitle */}
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1 leading-snug">
                  {c.name.split(':')[1]?.trim() || c.name}
                </h3>
                <p className="text-[10.5px] text-slate-500 mt-1 leading-normal line-clamp-2">
                  {CLUSTER_SUBTITLES[c.id]}
                </p>
              </div>

              {!hasData ? (
                <div className="mt-3 pt-2 border-t border-slate-100 text-center py-2 text-[11px] text-slate-400">
                  Tidak ada daerah terfilter
                </div>
              ) : (
                /* Clean High Data-Ink Metrics (Clean typography, no 16 colored box pills) */
                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
                  {/* Metric 1: Kemiskinan Moneter P0 */}
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] text-slate-500">Kemiskinan P0:</span>
                    <div className="flex items-baseline space-x-1.5">
                      <strong className="text-xs font-extrabold text-slate-900 tabular-nums">
                        {formatPercent(meanP0)}
                      </strong>
                      <span className={`text-[10px] font-mono font-semibold ${deltaP0 > 0 ? 'text-okabe-vermillion' : 'text-emerald-700'}`}>
                        {deltaP0 >= 0 ? '+' : ''}{deltaP0.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Metric 2: Akses Sanitasi Layak */}
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] text-slate-500">Akses Sanitasi:</span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-xs font-semibold text-slate-800 tabular-nums">
                        {formatPercent(meanSan)}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold ${deltaSan >= 0 ? 'text-emerald-700' : 'text-okabe-vermillion'}`}>
                        {deltaSan >= 0 ? '+' : ''}{deltaSan.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Metric 3: Rata-Rata Lama Sekolah */}
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] text-slate-500">Lama Sekolah (RLS):</span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-xs font-semibold text-slate-800 tabular-nums">
                        {formatYears(meanRls)}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold ${deltaRls >= 0 ? 'text-emerald-700' : 'text-okabe-vermillion'}`}>
                        {deltaRls >= 0 ? '+' : ''}{deltaRls.toFixed(1)}th
                      </span>
                    </div>
                  </div>

                  {/* Metric 4: Pengeluaran Riil */}
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] text-slate-500">Pengeluaran Riil:</span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-xs font-semibold text-slate-800 tabular-nums">
                        {formatCurrencyMillion(meanExp)}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold ${deltaExp >= 0 ? 'text-emerald-700' : 'text-okabe-vermillion'}`}>
                        {deltaExp >= 0 ? '+' : ''}Rp{(deltaExp / 1000).toFixed(1)}jt
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Visual Profiling Centerpiece: Small Multiples Z-Score */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Profil Standar Z-Score 7 Indikator Struktural terhadap Rata-Rata Nasional (Z = 0)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Nilai Z &gt; 0 menunjukkan keunggulan di atas rata-rata nasional; Z &lt; 0 menunjukkan defisit fasilitas/modal dasar.
            </p>
          </div>

          {selectedClusterId !== null && (
            <div className="inline-flex items-center space-x-1 text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              <Filter className="w-3 h-3 text-okabe-blue" />
              <span>Fokus: Klaster {selectedClusterId + 1}</span>
            </div>
          )}
        </div>

        <SmallMultiplesZScore 
          districts={districts} 
          allDistricts={allDistricts} 
          selectedClusterId={selectedClusterId}
        />
      </div>
    </motion.div>
  );
};

export default RegionalProfiles;
