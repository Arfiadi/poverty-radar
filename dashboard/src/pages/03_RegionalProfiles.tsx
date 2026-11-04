import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { District, ClusterSummary } from '../types';
import { SmallMultiplesZScore } from '../components/charts/SmallMultiplesZScore';
import { ClusterHeatmap } from '../components/charts/ClusterHeatmap';
import { CLUSTERS } from '../constants/benchmarks';
import { PARADOXES } from '../constants/paradoxes';
import { formatPercent, formatYears, formatCurrencyMillion } from '../utils/formatters';

interface PageProps {
  districts: District[];
  allDistricts?: District[];
  clusterSummary: ClusterSummary[];
}

export const RegionalProfiles: React.FC<PageProps> = ({ districts, allDistricts, clusterSummary }) => {
  const [viewMode, setViewMode] = useState<'small_multiples' | 'heatmap'>('small_multiples');

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Editorial Headline Strip */}
      <div className="pb-0.5">
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
          Arketipe Profil Daerah: 4 Tipologi Klaster Sosio-Ekonomi
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Mengelompokkan 514 daerah berdasarkan kesamaan 7 indikator struktural.
        </p>
      </div>

      {/* 4 Cluster Persona Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CLUSTERS.map((c) => {
          const summary = clusterSummary.find(s => s.cluster_id === c.id);
          const cDistricts = districts.filter(d => d.cluster_id === c.id);
          const hasData = cDistricts.length > 0;

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
              className="bg-surface rounded-xl border border-slate-200/80 p-4 shadow-subtle flex flex-col justify-between"
              style={{ borderTop: `3px solid ${c.color}` }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Klaster {c.id + 1}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    N = {totalRegions} ({pctNational.toFixed(1)}%)
                  </span>
                </div>
                <h3 className="text-sm font-bold text-ink-primary mt-1.5 leading-snug">{c.name.split(':')[1]?.trim() || c.name}</h3>
              </div>

              {!hasData ? (
                <div className="mt-4 pt-4 border-t border-slate-100 text-center py-4 text-xs text-slate-400">
                  <p className="font-semibold text-slate-500">Tidak Ada Wilayah Terfilter</p>
                  <p className="text-[10px] text-slate-400 mt-1">Klaster ini tidak memiliki perwakilan pada seleksi saat ini.</p>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center gap-1">
                    <span className="text-slate-500 font-medium">Kemiskinan P0:</span>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <strong className="text-sm font-bold tabular-nums text-ink-primary">{formatPercent(meanP0)}</strong>
                      <span 
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${deltaP0 > 0 ? 'bg-red-50 text-red-700 border-red-200/80' : 'bg-emerald-50 text-emerald-800 border-emerald-200/80'}`}
                        title={`Deviasi ${deltaP0 >= 0 ? '+' : ''}${deltaP0.toFixed(1)}% vs Rata-Rata Nasional (${formatPercent(natMeanP0)})`}
                      >
                        {deltaP0 >= 0 ? '+' : ''}{deltaP0.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-1">
                    <span className="text-slate-500 font-medium">Akses Sanitasi:</span>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <span className="tabular-nums font-semibold text-slate-700">{formatPercent(meanSan)}</span>
                      <span 
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${deltaSan >= 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80' : 'bg-red-50 text-red-700 border-red-200/80'}`}
                        title={`Deviasi ${deltaSan >= 0 ? '+' : ''}${deltaSan.toFixed(1)}% vs Rata-Rata Nasional (${formatPercent(natMeanSan)})`}
                      >
                        {deltaSan >= 0 ? '+' : ''}{deltaSan.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-1">
                    <span className="text-slate-500 font-medium">Rata-Rata RLS:</span>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <span className="tabular-nums font-semibold text-slate-700">{formatYears(meanRls)}</span>
                      <span 
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${deltaRls >= 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80' : 'bg-red-50 text-red-700 border-red-200/80'}`}
                        title={`Deviasi ${deltaRls >= 0 ? '+' : ''}${deltaRls.toFixed(1)} thn vs Rata-Rata Nasional (${formatYears(natMeanRls)})`}
                      >
                        {deltaRls >= 0 ? '+' : ''}{deltaRls.toFixed(1)}th
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-1">
                    <span className="text-slate-500 font-medium">Pengeluaran:</span>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <span className="tabular-nums font-semibold text-slate-700">{formatCurrencyMillion(meanExp)}</span>
                      <span 
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${deltaExp >= 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80' : 'bg-red-50 text-red-700 border-red-200/80'}`}
                        title={`Deviasi ${deltaExp >= 0 ? '+' : ''}Rp${(deltaExp / 1000).toFixed(1)}jt vs Rata-Rata Nasional`}
                      >
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

      {/* Visual Profiling View Switcher & Chart */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">
              Perbandingan 7 Indikator Struktural terhadap Titik Tengah Nasional (N=514 Daerah)
            </h3>
            <p className="text-[10.5px] text-slate-500 mt-0.5">
              Klaster 4 mencatatkan deprivasi ganda sarana dasar (sanitasi 31.2% &amp; air 52.7%), sedangkan Klaster 1 memiliki cakupan layanan dasar di atas 92% beriringan dengan tantangan pengangguran terbuka perkotaan.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setViewMode('small_multiples')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'small_multiples'
                  ? 'bg-okabe-blue text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Kisi Diagram Batang (Z-Score)
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'heatmap'
                  ? 'bg-okabe-blue text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Matriks Heatmap (28 Sel)
            </button>
          </div>
        </div>

        {viewMode === 'small_multiples' ? (
          <SmallMultiplesZScore districts={districts} allDistricts={allDistricts} />
        ) : (
          <ClusterHeatmap districts={districts} allDistricts={allDistricts} />
        )}
      </div>
    </motion.div>
  );
};

export default RegionalProfiles;
