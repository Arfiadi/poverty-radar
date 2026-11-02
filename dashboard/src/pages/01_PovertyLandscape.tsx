import React from 'react';
import { motion } from 'framer-motion';
import { District, NationalBenchmarks } from '../types';
import { KpiCard } from '../components/common/KpiCard';
import { NarrativeCallout } from '../components/common/NarrativeCallout';
import { ArchipelagoStripPlot } from '../components/charts/ArchipelagoStripPlot';
import { DistributionHistogram } from '../components/charts/DistributionHistogram';
import { DataTable } from '../components/common/DataTable';
import { PARADOXES } from '../constants/paradoxes';
import { formatPercent } from '../utils/formatters';

interface PageProps {
  districts: District[];
  benchmarks: NationalBenchmarks | null;
}

export const PovertyLandscape: React.FC<PageProps> = ({ districts, benchmarks }) => {
  // Compute dynamic leaderboard (Top 10 highest P0 vs Top 10 lowest P0)
  const sortedByP0 = [...districts].sort((a, b) => b.poverty_rate_p0 - a.poverty_rate_p0);
  const top10Highest = sortedByP0.slice(0, 10);
  const top10Lowest = [...districts].sort((a, b) => a.poverty_rate_p0 - b.poverty_rate_p0).slice(0, 10);

  // Dynamic values
  const medianP0 = benchmarks?.median_p0 ?? 10.46;
  const disparityRatio = benchmarks?.disparity_ratio ?? 17.50;
  const easternAcutePct = benchmarks?.eastern_acute_pct ?? 86.9;
  const easternAcuteCount = benchmarks?.eastern_acute_count ?? 53;
  const totalAcute = benchmarks?.total_acute_pockets ?? 61;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Action Hero Banner */}
      <div className="bg-surface rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-subtle relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-sdg"></span>
            <span>Babak 1: The Hook · Lanskap Makro Kemiskinan Daerah</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight leading-snug">
            Di Balik Angka Median Nasional {medianP0.toFixed(2)}%, Tersembunyi Jurang Disparitas Ekstrem {disparityRatio.toFixed(2)}x Lipat Antardaerah
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
            Eksplorasi data resmi BPS 2021 di 514 kabupaten/kota menyingkap bahwa kemiskinan moneter di Indonesia tidak terdistribusi secara seragam, 
            melainkan terpolarisasi sangat tajam antara pusat kemakmuran perkotaan di kawasan barat dan deprivasi akut di kawasan kepulauan timur.
          </p>
        </div>
      </div>

      {/* Row 1: KPI Cards Strip (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          label="Tingkat Kemiskinan Median Nasional"
          value={formatPercent(medianP0)}
          benchmarkText="Rentang: 2.38% (Sawahlunto) s.d. 41.66% (Intan Jaya)"
          contextText="514 Kabupaten/Kota · 34 Provinsi BPS 2021"
          badge={{ text: "Benchmark Nasional", type: "default" }}
        />
        <KpiCard
          label="Rasio Disparitas Ekstrem (Max / Min)"
          value={`${disparityRatio.toFixed(2)}x Lipat`}
          benchmarkText="Sawahlunto (Terendah) vs Intan Jaya (Tertinggi)"
          contextText="SDG 1: Ketimpangan struktural 17.5x antar-wilayah"
          badge={{ text: "Ketimpangan Kritis", type: "critical" }}
          accentColor="#D55E00"
        />
        <KpiCard
          label="Konsentrasi Kantong Akut (P0 ≥ 20%)"
          value={`${easternAcutePct.toFixed(1)}% di Kawasan Timur`}
          benchmarkText={`${easternAcuteCount} dari ${totalAcute} kantong kemiskinan akut di Timur`}
          contextText="Kawasan barat menyumbang 13.1% (8 daerah 3T terisolir)"
          badge={{ text: "Polarisasi Spasial", type: "warning" }}
          accentColor="#E69F00"
        />
      </div>

      {/* Row 2: Charts Grid (Histogram 5-Col & Strip Plot 7-Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <DistributionHistogram districts={districts} />
        </div>
        <div className="lg:col-span-7">
          <ArchipelagoStripPlot districts={districts} />
        </div>
      </div>

      {/* Row 3: Narrative Insight Callout (Knaflic Style) */}
      <NarrativeCallout
        title="WAWASAN DISPARITAS REGIONAL & ANOMALI BARAT"
        insight={`Angka rata-rata nasional kerap menyesatkan kebijakan jika diasumsikan mewakili seluruh daerah. Sebanyak ${easternAcutePct.toFixed(1)}% kantong kemiskinan ekstrem menumpuk di Maluku, Papua, dan NTT. Namun demikian, kemiskinan bukan semata batas bujur timur-barat: wilayah terisolir seperti Kepulauan Nias dan Mentawai di Sumatera memperlihatkan profil kerentanan yang menyerupai kawasan timur.`}
        evidence={PARADOXES.westernAnomaly.evidence}
      />

      {/* Row 4: Top 10 Extreme Leaderboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Top 10 Highest P0 */}
        <div className="bg-surface rounded-xl border border-slate-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <span>Top 10 Kabupaten Kemiskinan Tertinggi</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Seluruhnya berlokasi di Papua dan Nusa Tenggara</p>
            </div>
            <span className="text-[10px] font-mono bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200 font-bold">
              Kritis (&gt; 30%)
            </span>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {top10Highest.map((d, i) => (
              <div key={d.kab_kota} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-mono text-[11px] text-slate-400 w-4">{i + 1}.</span>
                  <span className="font-semibold text-slate-800 truncate">{d.tipe_wilayah} {d.kab_kota}</span>
                  <span className="text-[10px] text-slate-400">({d.provinsi})</span>
                </div>
                <span className="font-bold font-mono text-red-600 text-xs tabular-nums">
                  {formatPercent(d.poverty_rate_p0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Lowest P0 */}
        <div className="bg-surface rounded-xl border border-slate-200/80 p-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-okabe-blue uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-okabe-blue"></span>
                <span>Top 10 Daerah Kemiskinan Terendah</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Didominasi kota otonom pusat jasa & industri</p>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-okabe-blue px-2 py-0.5 rounded border border-blue-200 font-bold">
              Mapan (&lt; 4%)
            </span>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {top10Lowest.map((d, i) => (
              <div key={d.kab_kota} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-mono text-[11px] text-slate-400 w-4">{i + 1}.</span>
                  <span className="font-semibold text-slate-800 truncate">{d.tipe_wilayah} {d.kab_kota}</span>
                  <span className="text-[10px] text-slate-400">({d.provinsi})</span>
                </div>
                <span className="font-bold font-mono text-okabe-blue text-xs tabular-nums">
                  {formatPercent(d.poverty_rate_p0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: Detailed Data Table */}
      <DataTable 
        districts={districts} 
        title="Eksplorasi Detail 514 Kabupaten / Kota" 
        subtitle="Dapat diurutkan berdasarkan indikator dan disaring melalui filter global."
      />
    </motion.div>
  );
};
