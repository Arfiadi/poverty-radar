import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Search, 
  Filter, 
  CheckCircle2, 
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
  ExternalLink
} from 'lucide-react';
import { District, OLSResult, BoundaryCase } from '../types';
import { OLSCoefficientsBar } from '../components/charts/OLSCoefficientsBar';
import { TukeyBoxplot } from '../components/charts/TukeyBoxplot';
import { NarrativeCallout } from '../components/common/NarrativeCallout';
import { KpiCard } from '../components/common/KpiCard';
import { PARADOXES } from '../constants/paradoxes';

interface PageProps {
  districts: District[];
  olsResults: OLSResult[];
  boundaryCases: BoundaryCase[];
}

type PipelineStage = 'ingestion' | 'preprocessing' | 'integrity' | 'validation';

interface DataDictionaryItem {
  key: string;
  labelBps: string;
  dimension: string;
  sdgTag: string;
  dataType: string;
  unit: string;
  rangeEmpirical: string;
  role: 'feature' | 'benchmark' | 'contextual' | 'dropped';
  roleLabel: string;
  description: string;
}

const DATA_DICTIONARY: DataDictionaryItem[] = [
  {
    key: "poverty_rate_p0",
    labelBps: "Persentase Penduduk Miskin (P0)",
    dimension: "Kemiskinan Moneter",
    sdgTag: "SDG 1: No Poverty",
    dataType: "Float64",
    unit: "%",
    rangeEmpirical: "2.38% — 41.66%",
    role: "benchmark",
    roleLabel: "Validasi Eksternal",
    description: "Headcount Index BPS. Dikeluarkan dari ruang fitur K-Means untuk mencegah penalaran melingkar (circular reasoning)."
  },
  {
    key: "avg_school_years",
    labelBps: "Rata-rata Lama Sekolah Penduduk 15+ (RLS)",
    dimension: "Modal Manusia",
    sdgTag: "SDG 4: Quality Education",
    dataType: "Float64",
    unit: "Tahun",
    rangeEmpirical: "1.42 — 12.83 thn",
    role: "feature",
    roleLabel: "Fitur Model K-Means",
    description: "Proksi modal kognitif tenaga kerja terstandarisasi via RobustScaler. Spread antarklaster: 3.07 SD."
  },
  {
    key: "expenditure_per_capita",
    labelBps: "Pengeluaran Riil per Kapita Disesuaikan",
    dimension: "Standar Hidup Layak",
    sdgTag: "Paritas Daya Beli (PPP)",
    dataType: "Int64",
    unit: "Ribu Rp/Thn",
    rangeEmpirical: "Rp3,976 — Rp23,888",
    role: "feature",
    roleLabel: "Fitur Model K-Means",
    description: "Pengeluaran konsumsi riil per orang per tahun (Rp3.98 jt s.d. Rp23.89 jt). Koefisien OLS β = -0.318."
  },
  {
    key: "human_dev_index",
    labelBps: "Indeks Pembangunan Manusia (IPM)",
    dimension: "Capaian Komposit",
    sdgTag: "SDG Komposit",
    dataType: "Float64",
    unit: "Indeks (0—100)",
    rangeEmpirical: "32.84 — 87.18",
    role: "benchmark",
    roleLabel: "Validasi Eksternal",
    description: "Dikeluarkan dari klastering jarak Euclidean karena multikolinieritas ekstrem (r > 0.86) dengan komponen pembentuknya."
  },
  {
    key: "life_expectancy",
    labelBps: "Umur Harapan Hidup saat Lahir (UHH)",
    dimension: "Derajat Kesehatan",
    sdgTag: "SDG 3: Good Health",
    dataType: "Float64",
    unit: "Tahun",
    rangeEmpirical: "55.43 — 77.73 thn",
    role: "feature",
    roleLabel: "Fitur Model K-Means",
    description: "Proksi derajat kesehatan dan ketahanan fisik penduduk terstandarisasi via RobustScaler."
  },
  {
    key: "sanitation_access_pct",
    labelBps: "Akses Rumah Tangga Sanitasi Layak",
    dimension: "Layanan Dasar WASH",
    sdgTag: "SDG 6: Clean Water & San.",
    dataType: "Float64",
    unit: "%",
    rangeEmpirical: "0.00% — 99.97%",
    role: "feature",
    roleLabel: "Fitur Model K-Means",
    description: "Kloset leher angsa dan tangki septik. Pembeda sebaran paling tajam (spread 3.11 SD). Nilai 0.00% riil di Deiyai."
  },
  {
    key: "clean_water_access_pct",
    labelBps: "Akses Rumah Tangga Air Minum Layak",
    dimension: "Layanan Dasar WASH",
    sdgTag: "SDG 6: Clean Water & San.",
    dataType: "Float64",
    unit: "%",
    rangeEmpirical: "0.00% — 100.00%",
    role: "feature",
    roleLabel: "Fitur Model K-Means",
    description: "Sumber air minum terlindung/perpipaan. Nilai 0.00% riil di Mamberamo Tengah."
  },
  {
    key: "unemployment_rate_tpt",
    labelBps: "Tingkat Pengangguran Terbuka (TPT)",
    dimension: "Pasar Kerja Formal",
    sdgTag: "SDG 8: Decent Work",
    dataType: "Float64",
    unit: "%",
    rangeEmpirical: "0.00% — 13.37%",
    role: "feature",
    roleLabel: "Fitur Model K-Means",
    description: "Pembeda tajam pasar kerja formal perkotaan (tinggi) vs subsisten perdesaan (rendah). Nilai 0.00% riil di Nduga."
  },
  {
    key: "labor_participation_tpak",
    labelBps: "Tingkat Partisipasi Angkatan Kerja (TPAK)",
    dimension: "Pasar Kerja Agregat",
    sdgTag: "SDG 8: Decent Work",
    dataType: "Float64",
    unit: "%",
    rangeEmpirical: "56.39% — 97.93%",
    role: "contextual",
    roleLabel: "Atribut Kontekstual",
    description: "Dikeluarkan dari klastering untuk mencegah redundansi (r = -0.582 dengan TPT). Digunakan untuk audit fenomena Working Poor."
  },
  {
    key: "grdp_constant_million_idr",
    labelBps: "PDRB Konstan 2010 menurut Pengeluaran",
    dimension: "Skala Ekonomi Makro",
    sdgTag: "Perekonomian Riil",
    dataType: "Int64",
    unit: "Juta Rupiah",
    rangeEmpirical: "147,485 — 460,081,046",
    role: "feature",
    roleLabel: "Fitur Model (log1p)",
    description: "PDRB riil BPS berskala Juta Rupiah (Rp147 Miliar s.d. Rp460 Triliun). Ditransformasi log1p untuk menekan skewness dari +5.85 ke +0.23."
  },
  {
    key: "provinsi",
    labelBps: "Provinsi Asal Kabupaten/Kota",
    dimension: "Geografis Spasial",
    sdgTag: "Administrasi Tk. I",
    dataType: "String",
    unit: "34 Provinsi",
    rangeEmpirical: "34 Kategori",
    role: "contextual",
    roleLabel: "Atribut Kontekstual",
    description: "Unit administrasi tingkat I baseline 2021 pra-pemekaran DOB Papua. Digunakan untuk agregasi dan drilldown spasial."
  },
  {
    key: "kab_kota",
    labelBps: "Nama Kabupaten / Kota Administrasi",
    dimension: "Geografis Spasial",
    sdgTag: "Unit Analisis Tk. II",
    dataType: "String",
    unit: "514 Daerah",
    rangeEmpirical: "514 Entitas Unik",
    role: "contextual",
    roleLabel: "Atribut Kontekstual",
    description: "Unit observasi analisis: 413 Kabupaten (80.35%) dan 101 Kota (19.65%). Asterisk footnote Nduga telah dinormalisasi."
  },
  {
    key: "poverty_class_target",
    labelBps: "Klasifikasi Kemiskinan (0 / 1)",
    dimension: "Label Biner Bawaan",
    sdgTag: "Artefak Heuristik",
    dataType: "Int64",
    unit: "Kategori Biner",
    rangeEmpirical: "0 (87.94%) / 1 (12.06%)",
    role: "dropped",
    roleLabel: "Dieliminasi Total",
    description: "Bukan indikator resmi BPS. Terbukti 98.83% merupakan aturan heuristik buatan uploader Kaggle dan dibuang 100% demi mencegah target leakage."
  }
];

export const MethodologyAudit: React.FC<PageProps> = ({
  districts,
  olsResults,
  boundaryCases,
}) => {
  const [activeStage, setActiveStage] = useState<PipelineStage>('ingestion');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'feature' | 'benchmark' | 'contextual' | 'dropped'>('all');

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

  const STAGES: { id: PipelineStage; stepNum: string; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'ingestion',
      stepNum: '01',
      title: 'Data Understanding & Kamus Data',
      subtitle: 'Integritas 514 Daerah BPS 2021, 13 Variabel & Nilai Batas 0.00%',
      icon: Database
    },
    {
      id: 'preprocessing',
      stepNum: '02',
      title: 'Audit Distribusi & Preprocessing',
      subtitle: 'Skewness log1p, Tukey Boxplot Outlier, 26 Anomali & RobustScaler',
      icon: Scale
    },
    {
      id: 'integrity',
      stepNum: '03',
      title: 'Integritas Sains Data & Anti-Leakage',
      subtitle: 'Dekonstruksi Label 98.8%, Zero Target Leakage & Isolasi Variabel',
      icon: ShieldCheck
    },
    {
      id: 'validation',
      stepNum: '04',
      title: 'Pemodelan Dual-Engine & Ekonometrika',
      subtitle: 'Diagnostik K-Means k=4, Formula V_struc & Regresi OLS β',
      icon: Layers
    }
  ];

  const currentStageIndex = STAGES.findIndex(s => s.id === activeStage);

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
            Alur berurutan dari data mentah BPS 2021, mitigasi bias matematis, hingga pembuktian ekonometrika (UN SDG 1).
          </p>
        </div>
      </div>

      {/* Row 1: 4 Data Science & Integrity Audit KPI Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Integritas Target Leakage"
          value="0% Kebocoran"
          benchmarkText="100% Label Biner Bawaan Dibuang"
          contextText="Menolak klasifikasi terawasi artifisial · Murni Unsupervised K-Means"
          badge={{ text: "Metodologi Valid", type: "positive" }}
          accentColor="#009E73"
        />

        <KpiCard
          label="Dekonstruksi Label Kaggle"
          value="98.83% Cocok"
          benchmarkText="508 dari 514 Daerah Identik Formula"
          contextText="Formula deterministik sederhana merekonstruksi 98.83% label bawaan uploader"
          badge={{ text: "Verifikasi Heuristik", type: "critical" }}
          accentColor="#0072B2"
        />

        <KpiCard
          label="Stabilitas Partisi Klaster"
          value="ARI = 0.9803"
          benchmarkText="Adjusted Rand Index (k = 4)"
          contextText="Mengukur ketahanan partisi K-Means terhadap perturbasi acak 20 multi-seed"
          badge={{ text: "Stabilitas Tinggi", type: "positive" }}
          accentColor="#009E73"
        />

        <KpiCard
          label="Daya Jelas Model OLS (R²)"
          value="R² = 51.64%"
          benchmarkText="R² Terkoreksi: 51.07% (p < 0.001)"
          contextText="6 indikator struktural dasar menjelaskan mayoritas variasi kemiskinan moneter"
          badge={{ text: "Ekonometrika Solid", type: "default" }}
          accentColor="#0F172A"
        />
      </div>

      {/* Pipeline Stepper: 4 Sequential Flow Stages */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-2 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5">
          {STAGES.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeStage === s.id;
            const isCompleted = idx < currentStageIndex;

            return (
              <button
                key={s.id}
                onClick={() => setActiveStage(s.id)}
                className={`flex items-start space-x-2.5 p-2.5 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-slate-50/80 text-slate-700 hover:bg-slate-100/90 border border-slate-200/60'
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200/60'
                }`}
              >
                <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${
                  isActive ? 'bg-white/15 text-white' : isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isActive ? 'text-amber-400' : 'text-slate-400'
                    }`}>
                      Tahap {s.stepNum}
                    </span>
                    {isCompleted && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    )}
                  </div>
                  <h3 className={`text-xs font-bold truncate mt-0.5 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {s.title}
                  </h3>
                  <p className={`text-[10.5px] truncate mt-0.5 font-medium ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                    {s.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Flow Content Container */}
      <AnimatePresence mode="wait">
        {/* TAHAP 1: DATA UNDERSTANDING & KAMUS DATA */}
        {activeStage === 'ingestion' && (
          <motion.div
            key="stage-ingestion"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* Stage Sub-header */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-okabe-blue">
                  Tahap 01 · Data Ingestion &amp; Understanding
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                  Metadata Resmi, Integritas Sensus BPS 2021, &amp; Kamus 13 Indikator
                </h3>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  514 Daerah · 0 Missing Values
                </span>
              </div>
            </div>

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
                  Header mentah mencantumkan "(Rupiah)", namun nilai riil BPS berskala Juta Rupiah (Jakarta Pusat Rp460 Triliun, Tambrauw Rp147 Miliar).
                </p>
              </div>
            </div>

            {/* Interactive Data Dictionary Table */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                    Kamus Data Terstandar (13 Variabel Sensus Sosio-Ekonomi)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Inventaris variabel semantik, satuan baku, rentang nilai empiris lapangan, dan peran metodologis.
                  </p>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari indikator..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-okabe-blue w-40 sm:w-48 transition"
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
                      className={`px-2 py-0.5 rounded transition ${roleFilter === 'dropped' ? 'bg-white text-okabe-vermillion shadow-2xs font-bold' : 'text-slate-600'}`}
                    >
                      Dieliminasi (1)
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-[10.5px] uppercase font-bold text-slate-500">
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
                              ? 'bg-red-50 text-okabe-vermillion border-red-200'
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
          </motion.div>
        )}

        {/* TAHAP 2: AUDIT DISTRIBUSI & PREPROCESSING */}
        {activeStage === 'preprocessing' && (
          <motion.div
            key="stage-preprocessing"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* Stage Sub-header */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-okabe-blue">
                  Tahap 02 · Preprocessing &amp; Distribusi Data
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                  Koreksi Skewness PDRB log1p, Deteksi Outlier Tukey Boxplot, &amp; Standarisasi RobustScaler
                </h3>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-okabe-blue border border-blue-200">
                  Skewness: +5.85 → +0.23
                </span>
              </div>
            </div>

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
                <div className="inline-flex items-center space-x-1.5 text-xs text-slate-600 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  <span>36 Pencilan Atas (&gt; 26.47%)</span>
                </div>
              </div>

              {/* Chart Component */}
              <TukeyBoxplot districts={districts} />

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Min (Bawah)</span>
                  <strong className="text-xs text-slate-900 font-mono">2.38%</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Kuartil 1 (Q1)</span>
                  <strong className="text-xs text-slate-900 font-mono">7.15%</strong>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-[10px] text-okabe-blue block font-semibold">Median Nasional</span>
                  <strong className="text-xs text-okabe-blue font-mono font-bold">10.46%</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Kuartil 3 (Q3)</span>
                  <strong className="text-xs text-slate-900 font-mono">14.89%</strong>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                  <span className="text-[10px] text-amber-800 block font-semibold">Batas Atas Whisker</span>
                  <strong className="text-xs text-amber-900 font-mono">26.47%</strong>
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
          </motion.div>
        )}

        {/* TAHAP 3: INTEGRITAS SAINS DATA & ANTI-LEAKAGE */}
        {activeStage === 'integrity' && (
          <motion.div
            key="stage-integrity"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* Stage Sub-header */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-okabe-blue">
                  Tahap 03 · Metodologi &amp; Integritas Ilmiah
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                  Dekonstruksi Label Kaggle 98.83%, Zero Target Leakage &amp; Mitigasi Multikolinearitas
                </h3>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  100% Lolos Audit Integritas
                </span>
              </div>
            </div>

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
                  Class 1 (Miskin) &lt;=&gt; (poverty_rate_p0 &gt; 20.0%) OR (expenditure_per_capita &lt;= 6,250 AND sanitation_access_pct &lt;= 56.0%)
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
                  <li><strong>Eksklusi TPAK:</strong> Korelasi $r = -0.582$ dengan TPT; mempertahankan keduanya mereduksi Silhouette sebesar ~10%.</li>
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
          </motion.div>
        )}

        {/* TAHAP 4: PEMODELAN DUAL-ENGINE & VALIDASI EKONOMETRIKA */}
        {activeStage === 'validation' && (
          <motion.div
            key="stage-validation"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* Stage Sub-header */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-okabe-blue">
                  Tahap 04 · Pemodelan &amp; Validasi Inferensial
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                  Benchmark K-Means (k=4), Formulasi V_struc 2x2, &amp; Regresi Multivariat OLS (β)
                </h3>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ANOVA F = 155.94 (p &lt; 0.001)
                </span>
              </div>
            </div>

            {/* Engine A: K-Means Benchmark Diagnostics */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                    Engine A: Diagnostik Benchmark Pemilihan Jumlah Klaster (k = 4)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Titik infleksi kurva Elbow (WCSS) dan pembongkaran ilusi matematis k=3 ("The Giant Blob").
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-okabe-blue">
                  Empirical Optimum
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Koefisien Siluet</span>
                  <div className="text-base font-extrabold text-okabe-blue mt-0.5">0.2028</div>
                  <span className="text-[9.5px] text-slate-500 block mt-0.5">Kontinum Gradasi Alami</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Davies-Bouldin (DBI)</span>
                  <div className="text-base font-extrabold text-amber-700 mt-0.5">1.4522</div>
                  <span className="text-[9.5px] text-slate-500 block mt-0.5">Separasi Antarklaster</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Adjusted Rand (ARI)</span>
                  <div className="text-base font-extrabold text-emerald-700 mt-0.5">0.9803</div>
                  <span className="text-[9.5px] text-slate-500 block mt-0.5">Stabilitas 20 Multi-Seed</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Validasi Inferensial</span>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">p &lt; 0.001</div>
                  <span className="text-[9.5px] text-slate-500 block mt-0.5">ANOVA F = 155.94</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[11.5px] text-slate-700 leading-relaxed">
                <strong className="text-slate-900 font-bold block mb-0.5">Pembongkaran Ilusi Matematis k = 3:</strong>
                Meskipun k=3 memiliki Silhouette sedikit lebih tinggi (0.2863), pola tersebut menumpuk 322 daerah (62.6% Indonesia) ke dalam 1 klaster raksasa seragam. Pada k=4, kelompok 322 daerah tersebut terurai proporsional menjadi Klaster 2 (Penyangga Mapan, N=187) dan Klaster 3 (Agraris Rentan, N=216) yang memiliki disparitas sanitasi (Δ = 12.38%) dan derajat kesehatan (Δ = 3.72 tahun).
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flow Footer Stepper Navigation Bar */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200/80 px-4 py-3 shadow-2xs">
        <div>
          {currentStageIndex > 0 ? (
            <button
              onClick={() => setActiveStage(STAGES[currentStageIndex - 1].id)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali: Tahap {STAGES[currentStageIndex - 1].stepNum}</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Awal Alur Metodologi</span>
          )}
        </div>

        <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
          Tahap <strong>{currentStageIndex + 1}</strong> dari <strong>4</strong> · {STAGES[currentStageIndex].title}
        </div>

        <div>
          {currentStageIndex < STAGES.length - 1 ? (
            <button
              onClick={() => setActiveStage(STAGES[currentStageIndex + 1].id)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-okabe-blue text-white hover:bg-blue-700 shadow-2xs transition"
            >
              <span>Lanjut ke Tahap {STAGES[currentStageIndex + 1].stepNum}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Selesai Seluruh Alur Audit</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MethodologyAudit;
