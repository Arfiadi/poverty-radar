import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { District, ClusterSummary } from '../types';
import { SmallMultiplesZScore } from '../components/charts/SmallMultiplesZScore';
import { ClusterHeatmap } from '../components/charts/ClusterHeatmap';
import { NarrativeCallout } from '../components/common/NarrativeCallout';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Header & Model Diagnostics Bar */}
      <div className="bg-surface rounded-2xl border border-slate-200/80 p-6 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-okabe-teal"></span>
              <span>Babak 3: The Archetypes · Profil 4 Klaster Sosio-Ekonomi</span>
            </div>
            <h2 className="text-xl font-extrabold text-ink-primary tracking-tight">
              Arketipe Profil Daerah: Konfigurasi Defisit Layanan Dasar Bebas Target Leakage
            </h2>
            <p className="text-xs text-ink-muted mt-1 max-w-2xl">
              Model Unsupervised K-Means membagi daerah ke dalam 4 persona berdasarkan 7 indikator struktural dasar (tanpa menyertakan P0 pada fitur klaster).
            </p>
          </div>

          {/* Model Diagnostics Pill Badges */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-bold">
              k = 4 Klaster
            </span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
              Silhouette: <strong>0.2028</strong>
            </span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
              DBI: <strong>1.4522</strong>
            </span>
            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
              Stabilitas ARI: 0.9803
            </span>
          </div>
        </div>

        {/* Kaufman & Rousseeuw Methodological Reflection (Collapsible Accordion) */}
        <details className="mt-3 group border border-slate-200/80 rounded-xl bg-slate-50/60 overflow-hidden transition-all text-xs">
          <summary className="flex items-center justify-between px-3.5 py-2 cursor-pointer font-semibold text-slate-600 hover:text-slate-900 select-none">
            <span>📖 Catatan Metodologi &amp; Evaluasi Siluet (Kaufman &amp; Rousseeuw)</span>
            <span className="text-slate-400 text-xs transition-transform group-open:rotate-180">▼</span>
          </summary>
          <div className="px-3.5 pb-3 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-2.5">
            <strong>Refleksi Kejujuran Ilmiah (Kaufman &amp; Rousseeuw, 1990):</strong> Nilai Silhouette 0.2028 mencerminkan realitas empiris bahwa disparitas sosial-ekonomi daerah Indonesia membentuk kontinum gradasi alami, bukan klaster bola yang terpisah mutlak. Oleh karena itu, klastering difungsikan secara tepat sebagai instrumen diskretisasi tipologi profiling yang stabil (ARI 0.9803).
          </div>
        </details>
      </div>

      {/* 4 Cluster Persona Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CLUSTERS.map((c) => {
          const summary = clusterSummary.find(s => s.cluster_id === c.id);
          const cDistricts = districts.filter(d => d.cluster_id === c.id);
          const totalRegions = summary?.total_regions ?? c.count;
          const pctNational = summary?.pct_of_national ?? Number(((c.count / 514) * 100).toFixed(1));
          const meanP0 = summary?.poverty_rate_p0_mean ?? (cDistricts.length ? cDistricts.reduce((a, b) => a + b.poverty_rate_p0, 0) / cDistricts.length : 0);
          const meanRls = summary?.avg_school_years_mean ?? (cDistricts.length ? cDistricts.reduce((a, b) => a + b.avg_school_years, 0) / cDistricts.length : 0);
          const meanSan = summary?.sanitation_access_pct_mean ?? (cDistricts.length ? cDistricts.reduce((a, b) => a + b.sanitation_access_pct, 0) / cDistricts.length : 0);
          const meanExp = summary?.expenditure_per_capita_mean ?? (cDistricts.length ? cDistricts.reduce((a, b) => a + b.expenditure_per_capita, 0) / cDistricts.length : 0);

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

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500 font-medium">Kemiskinan P0:</span>
                  <strong className="text-sm font-bold tabular-nums text-ink-primary">{formatPercent(meanP0)}</strong>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500 font-medium">Akses Sanitasi:</span>
                  <span className="tabular-nums font-semibold text-slate-700">{formatPercent(meanSan)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500 font-medium">Rata-Rata RLS:</span>
                  <span className="tabular-nums font-semibold text-slate-700">{formatYears(meanRls)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500 font-medium">Pengeluaran:</span>
                  <span className="tabular-nums font-semibold text-slate-700">{formatCurrencyMillion(meanExp)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Profiling View Switcher & Chart */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('small_multiples')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'small_multiples'
                ? 'bg-okabe-blue text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Small Multiples Bar Charts (Z-Score)
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

        {viewMode === 'small_multiples' ? (
          <SmallMultiplesZScore districts={districts} allDistricts={allDistricts} />
        ) : (
          <ClusterHeatmap districts={districts} allDistricts={allDistricts} />
        )}
      </div>

      {/* Narrative Callout: Differentiated Root Causes */}
      <NarrativeCallout
        title="DIFERENSIASI AKAR MASALAH ANTAR-KLASTER"
        insight="Profil empat klaster membuktikan akar kemiskinan bervariasi: Klaster 4 lumpuh akibat defisit sanitasi dan isolasi fisik, sedangkan Klaster 3 terhambat rendahnya produktivitas agraris dan modal manusia."
        evidence="Klaster 4 (Sanitasi 22.8%, RLS 5.8 thn, P0 30.6%) vs Klaster 3 (Sanitasi 63.8%, RLS 7.5 thn, P0 12.8%) vs Klaster 1 (P0 5.4%, Sanitasi 85.9%)."
      />
    </motion.div>
  );
};

export default RegionalProfiles;
