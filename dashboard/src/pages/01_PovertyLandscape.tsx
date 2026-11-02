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

  // Baseline national benchmarks
  const nationalMedianP0 = benchmarks?.median_p0 ?? 10.46;
  const nationalDisparityRatio = benchmarks?.disparity_ratio ?? 17.50;
  const easternAcutePct = benchmarks?.eastern_acute_pct ?? 86.9;
  const easternAcuteCount = benchmarks?.eastern_acute_count ?? 53;
  const totalAcute = benchmarks?.total_acute_pockets ?? 61;

  // Check if regional filter is currently active
  const isFilterActive = districts.length < (benchmarks?.n_regions ?? 514);

  // Compute dynamic statistics for current selection
  const sortedP0Asc = [...districts].sort((a, b) => a.poverty_rate_p0 - b.poverty_rate_p0);
  const minDistrict = sortedP0Asc[0] || null;
  const maxDistrict = sortedP0Asc[sortedP0Asc.length - 1] || null;

  let dynamicMedianP0 = nationalMedianP0;
  if (sortedP0Asc.length > 0) {
    const mid = Math.floor(sortedP0Asc.length / 2);
    dynamicMedianP0 = sortedP0Asc.length % 2 !== 0
      ? sortedP0Asc[mid].poverty_rate_p0
      : (sortedP0Asc[mid - 1].poverty_rate_p0 + sortedP0Asc[mid].poverty_rate_p0) / 2;
  }

  const dynamicDisparityRatio = (minDistrict && minDistrict.poverty_rate_p0 > 0 && maxDistrict)
    ? maxDistrict.poverty_rate_p0 / minDistrict.poverty_rate_p0
    : nationalDisparityRatio;

  const acuteDistricts = districts.filter(d => d.poverty_rate_p0 >= 20.0);
  const acuteCount = acuteDistricts.length;
  const acutePct = districts.length > 0 ? (acuteCount / districts.length) * 100 : 0;

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
            Jurang Disparitas Ekstrem {nationalDisparityRatio.toFixed(2)}x Lipat Membelah Lanskap Kemiskinan Antardaerah
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
            Data resmi BPS 2021 menyingkap polarisasi spasial yang tajam: pusat kemakmuran perkotaan di kawasan barat berbanding terbalik dengan konsentrasi deprivasi akut di kawasan kepulauan timur.
          </p>
        </div>
      </div>

      {/* Row 1: KPI Cards Strip (3 Dual-State Cards with Stephen Few Micro Bullet Graphs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          label={isFilterActive ? "Tingkat Kemiskinan Median Wilayah" : "Tingkat Kemiskinan Median Nasional"}
          value={formatPercent(isFilterActive ? dynamicMedianP0 : nationalMedianP0)}
          benchmarkText={
            isFilterActive
              ? `Baseline Nasional: ${formatPercent(nationalMedianP0)} (${dynamicMedianP0 >= nationalMedianP0 ? '+' : ''}${(dynamicMedianP0 - nationalMedianP0).toFixed(2)}% poin)`
              : `Titik tengah sebaran ${benchmarks?.n_regions ?? 514} kabupaten/kota`
          }
          contextText={
            isFilterActive
              ? `Cakupan filter aktif: ${districts.length} daerah`
              : "Sasaran RPJMN: 6.5%–7.0%"
          }
          badge={{
            text: isFilterActive ? `${districts.length} Daerah Terpilih` : "Agregat Nasional",
            type: isFilterActive ? "filter" : "default",
          }}
          range={{
            min: isFilterActive && minDistrict ? minDistrict.poverty_rate_p0 : (benchmarks?.min_p0 ?? 2.38),
            max: isFilterActive && maxDistrict ? maxDistrict.poverty_rate_p0 : (benchmarks?.max_p0 ?? 41.66),
            current: isFilterActive ? dynamicMedianP0 : nationalMedianP0,
            target: isFilterActive ? nationalMedianP0 : 6.5,
            minLabel: isFilterActive && minDistrict 
              ? `${minDistrict.kab_kota} (${formatPercent(minDistrict.poverty_rate_p0)})`
              : `${benchmarks?.min_p0_region ?? "Sawahlunto"} (2.38%)`,
            maxLabel: isFilterActive && maxDistrict 
              ? `${maxDistrict.kab_kota} (${formatPercent(maxDistrict.poverty_rate_p0)})`
              : `${benchmarks?.max_p0_region ?? "Intan Jaya"} (41.66%)`,
            targetLabel: isFilterActive ? `Ref: ${formatPercent(nationalMedianP0)}` : "Target: 6.5%",
            unit: "%",
          }}
        />

        <KpiCard
          label={isFilterActive ? "Rasio Disparitas Wilayah Terpilih" : "Rasio Disparitas Ekstrem (Max / Min)"}
          value={`${(isFilterActive ? dynamicDisparityRatio : nationalDisparityRatio).toFixed(2)}x Lipat`}
          benchmarkText={
            isFilterActive && minDistrict && maxDistrict
              ? `${minDistrict.kab_kota} (${formatPercent(minDistrict.poverty_rate_p0)}) vs ${maxDistrict.kab_kota} (${formatPercent(maxDistrict.poverty_rate_p0)})`
              : "Sawahlunto (Terendah) vs Intan Jaya (Tertinggi)"
          }
          contextText={
            isFilterActive
              ? `Rujukan disparitas nasional: ${nationalDisparityRatio.toFixed(2)}x lipat`
              : "Ketimpangan struktural ekstrem antar-wilayah"
          }
          badge={{
            text: isFilterActive 
              ? (dynamicDisparityRatio >= 5.0 ? "Disparitas Tinggi" : "Disparitas Terkendali")
              : "Ketimpangan Kritis",
            type: (isFilterActive ? dynamicDisparityRatio : nationalDisparityRatio) >= 5.0 ? "critical" : "default",
          }}
          range={{
            min: 1.0,
            max: Math.max(isFilterActive ? dynamicDisparityRatio : nationalDisparityRatio, 20.0),
            current: isFilterActive ? dynamicDisparityRatio : nationalDisparityRatio,
            target: 1.0,
            minLabel: "1.0x (Seragam)",
            maxLabel: `${Math.max(isFilterActive ? dynamicDisparityRatio : nationalDisparityRatio, 20.0).toFixed(0)}x`,
            targetLabel: "Keseimbangan: 1.0x",
            unit: "x",
          }}
          accentColor={
            (isFilterActive ? dynamicDisparityRatio : nationalDisparityRatio) >= 5.0 
              ? "#D55E00" 
              : "#0F172A"
          }
        />

        <KpiCard
          label={isFilterActive ? "Kantong Kemiskinan Akut (P0 ≥ 20%)" : "Konsentrasi Kantong Akut (P0 ≥ 20%)"}
          value={
            isFilterActive
              ? `${acuteCount} Daerah (${acutePct.toFixed(1)}%)`
              : `${easternAcutePct.toFixed(1)}% di Kawasan Timur`
          }
          benchmarkText={
            isFilterActive
              ? `Rujukan nasional: ${totalAcute} kantong akut`
              : `${easternAcuteCount} dari ${totalAcute} kantong kemiskinan akut di Timur`
          }
          contextText={
            isFilterActive
              ? (acuteCount > 0 
                  ? `${acuteCount} daerah terpilih berkategori kemiskinan kritis`
                  : "Nol daerah terpilih dengan P0 ≥ 20%")
              : "Kawasan barat menyumbang 13.1% (8 kepulauan 3T)"
          }
          badge={{
            text: isFilterActive
              ? (acuteCount > 0 ? `${acuteCount} Kantong Akut` : "Nol Kantong Akut")
              : "Polarisasi Spasial",
            type: isFilterActive 
              ? (acuteCount > 0 ? "warning" : "positive") 
              : "warning",
          }}
          range={{
            min: 0,
            max: isFilterActive ? Math.max(districts.length, 1) : 100,
            current: isFilterActive ? acuteCount : easternAcutePct,
            target: 0,
            minLabel: isFilterActive ? "0" : "0%",
            maxLabel: isFilterActive ? `${districts.length} daerah` : "100%",
            targetLabel: "Eliminasi: 0",
            unit: isFilterActive ? " daerah" : "%",
          }}
          accentColor={
            isFilterActive 
              ? (acuteCount > 0 ? "#E69F00" : "#009E73")
              : "#E69F00"
          }
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
        insight={`${easternAcutePct.toFixed(1)}% kantong kemiskinan akut terkonsentrasi di Kawasan Timur, namun profil deprivasi serupa juga muncul di kantong kepulauan terisolir barat seperti Nias dan Mentawai.`}
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
                <span>Top 10 Daerah Kemiskinan Tertinggi</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Peringkat persentase kemiskinan tertinggi pada wilayah terpilih</p>
            </div>
            <span className="text-xs font-mono bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200 font-bold">
              Kritis (&gt; 30%)
            </span>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {top10Highest.map((d, i) => (
              <div key={d.kab_kota} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-mono text-xs text-slate-400 w-5">{i + 1}.</span>
                  <span className="font-semibold text-slate-800 truncate">{d.tipe_wilayah} {d.kab_kota}</span>
                  <span className="text-xs text-slate-400">({d.provinsi})</span>
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
              <p className="text-xs text-slate-500 mt-0.5">Peringkat persentase kemiskinan terendah pada wilayah terpilih</p>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-okabe-blue px-2 py-0.5 rounded border border-blue-200 font-bold">
              Mapan (&lt; 4%)
            </span>
          </div>
          <div className="divide-y divide-slate-100 mt-2">
            {top10Lowest.map((d, i) => (
              <div key={d.kab_kota} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-mono text-xs text-slate-400 w-5">{i + 1}.</span>
                  <span className="font-semibold text-slate-800 truncate">{d.tipe_wilayah} {d.kab_kota}</span>
                  <span className="text-xs text-slate-400">({d.provinsi})</span>
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
        title="Eksplorasi Data Kabupaten / Kota" 
        subtitle="Dapat diurutkan berdasarkan indikator dan disaring melalui filter."
      />
    </motion.div>
  );
};
