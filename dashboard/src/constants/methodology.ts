import React from 'react';
import { Database, Scale, ShieldCheck, Layers } from 'lucide-react';

export type PipelineStageId = 'ingestion' | 'preprocessing' | 'integrity' | 'validation';

export interface DataDictionaryItem {
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

export interface MacroStageInfo {
  id: PipelineStageId;
  stepNum: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  tagColor: string;
  objective: string;
  inputData: string;
  methodology: string;
  verifiedOutput: string;
  deepDiveLabel: string;
}

export const DATA_DICTIONARY: DataDictionaryItem[] = [
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
    key: "water_access_pct",
    labelBps: "Akses Sumber Air Minum Layak",
    dimension: "Layanan Dasar WASH",
    sdgTag: "SDG 6: Clean Water & San.",
    dataType: "Float64",
    unit: "%",
    rangeEmpirical: "0.00% — 99.99%",
    role: "feature",
    roleLabel: "Fitur Model K-Means",
    description: "Akses air leding/perpipaan/mata air terlindung. Nilai 0.00% terbukti riil di Intan Jaya (topografi tebing karst)."
  },
  {
    key: "unemployment_rate_tpt",
    labelBps: "Tingkat Pengangguran Terbuka (TPT)",
    dimension: "Ketenagakerjaan",
    sdgTag: "SDG 8: Decent Work",
    dataType: "Float64",
    unit: "%",
    rangeEmpirical: "0.25% — 13.06%",
    role: "feature",
    roleLabel: "Fitur Model K-Means",
    description: "Proksi friksi pasar kerja perkotaan. Menghasilkan paradoks kemiskinan: r = -0.401 dengan tingkat kemiskinan."
  },
  {
    key: "labor_force_particip_tpak",
    labelBps: "Tingkat Partisipasi Angkatan Kerja (TPAK)",
    dimension: "Ketenagakerjaan",
    sdgTag: "SDG 8: Decent Work",
    dataType: "Float64",
    unit: "%",
    rangeEmpirical: "54.76% — 93.63%",
    role: "contextual",
    roleLabel: "Atribut Kontekstual",
    description: "Dikeluarkan dari klastering K-Means demi menghindari redundansi dengan TPT (korelasi r = -0.582). r = +0.462 terhadap P0."
  },
  {
    key: "grdp_constant_million_idr",
    labelBps: "PDRB Atas Dasar Harga Konstan (ADHK 2010)",
    dimension: "Kapasitas Fiskal & Makro",
    sdgTag: "SDG 8: Economic Growth",
    dataType: "Float64",
    unit: "Juta Rupiah",
    rangeEmpirical: "Rp147.6 Rb — Rp460.1 Jt",
    role: "feature",
    roleLabel: "Fitur Model K-Means (log1p)",
    description: "Output agregat ekonomi daerah. Ditransformasikan via ln(1+x) untuk mereduksi skewness dari +5.85 menjadi +0.23."
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

export const MACRO_STAGES: MacroStageInfo[] = [
  {
    id: 'ingestion',
    stepNum: '01',
    title: 'Data Ingestion & Understanding',
    subtitle: 'Metadata Sensus BPS 2021, Audit Nilai Batas 0.00% 3T, & Kamus Data 13 Variabel',
    icon: Database,
    tag: '514 Daerah Lengkap · 0 Missing Values',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    objective: 'Verifikasi kelengkapan 514 daerah BPS 2021, standardisasi satuan semantik PDRB, dan validasi fisik nilai batas 0.00% wilayah 3T.',
    inputData: '514 Kabupaten/Kota (34 Provinsi), 13 indikator mentah BPS 2021 (validasi silang SIRUSA cocok 100%).',
    methodology: 'Audit nilai hilang (0 NaN), koreksi semantik PDRB (skala Juta Rp), dan konfirmasi geografis nilai 0.00% sanitasi/air di Papua.',
    verifiedOutput: 'Dataset mentah bersih 514 baris utuh (100% data retention) dengan 13 variabel terstandardisasi.',
    deepDiveLabel: 'Kamus Data 13 Indikator, Pencarian Interaktif, & Audit Batas 0.00% Wilayah 3T'
  },
  {
    id: 'preprocessing',
    stepNum: '02',
    title: 'Audit Distribusi & Preprocessing',
    subtitle: 'Koreksi Skewness PDRB log1p, Tukey Boxplot Outlier, Preservasi 26 Anomali, & RobustScaler',
    icon: Scale,
    tag: 'Skewness PDRB: +5.85 → +0.23',
    tagColor: 'bg-blue-50 text-okabe-blue border-blue-200',
    objective: 'Mengatasi disparitas skala ekonomi ekstrem antardaerah tanpa membuang daerah tertinggal (mandat UN SDG 1).',
    inputData: '7 fitur sosio-ekonomi kontinu dengan rentang skala yang berbeda drastis.',
    methodology: 'Transformasi ln(1 + PDRB), deteksi 26 anomali Isolation Forest (c=0.05), dan penskalaan RobustScaler (Median & IQR).',
    verifiedOutput: 'Skewness PDRB turun dari +5.85 ke +0.23 (simetris); 26 anomali dipertahankan 100% (0 baris dihapus).',
    deepDiveLabel: 'Audit Skewness log1p, Diagram Tukey Boxplot P0, & Protokol RobustScaler'
  },
  {
    id: 'integrity',
    stepNum: '03',
    title: 'Integritas Sains Data & Anti-Leakage',
    subtitle: 'Dekonstruksi Label 98.83%, Zero Target Leakage, Isolasi Variabel, & Larangan Radar Chart',
    icon: ShieldCheck,
    tag: '100% Bebas Kebocoran Target',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    objective: 'Mencegah penalaran melingkar (circular reasoning) dan menolak klasifikasi terawasi artifisial.',
    inputData: 'Kolom label biner bawaan Kaggle (Klasifikasi Kemiskinan 0/1), angka kemiskinan P0, dan IPM.',
    methodology: 'Reverse-engineering aljabar label biner, eliminasi total label bawaan, isolasi P0 & IPM dari fitur jarak, serta larangan radar chart.',
    verifiedOutput: 'Label bawaan terbukti 98.83% formula heuristik; model beroperasi 100% murni unsupervised clustering.',
    deepDiveLabel: 'Bukti Forensik Formula Kaggle 98.83%, Matriks Isolasi Variabel, & 4 Pilar Integritas'
  },
  {
    id: 'validation',
    stepNum: '04',
    title: 'Pemodelan Dual-Engine & Ekonometrika',
    subtitle: 'Klastering K-Means k=4, Formula Skrining Kerentanan V_struc 2x2, & Regresi Multivariat OLS',
    icon: Layers,
    tag: 'Stabilitas ARI = 0.9803 · OLS R² = 51.64%',
    tagColor: 'bg-slate-900 text-white border-slate-700',
    objective: 'Membentuk tipologi objektif wilayah dan memvalidasi signifikansi determinan sosio-ekonomi secara ekonometrika.',
    inputData: '7 fitur terstandarisasi RobustScaler untuk 514 daerah, dilengkapi benchmark eksternal P0 dan IPM.',
    methodology: 'K-Means k=4 (20 multi-seed), matriks skrining kerentanan 2x2 (V_struc bobot setara 25%), dan regresi multivariat OLS.',
    verifiedOutput: '4 klaster tipologi wilayah stabil (ARI = 0.9803) dan model OLS dengan R² = 51.64% (p < 0.001).',
    deepDiveLabel: 'Diagnostik Benchmark k=4 vs k=3, Formula Matematis V_struc, & Grafik Koefisien OLS β'
  }
];
