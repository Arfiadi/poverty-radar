import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, Database, HelpCircle } from 'lucide-react';
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

export const MethodologyAudit: React.FC<PageProps> = ({
  districts,
  olsResults,
  boundaryCases,
}) => {
  const [activeTab, setActiveTab] = useState<'principles' | 'ols' | 'kaggle' | 'boundaries'>('ols');

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
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
            <span>Transparansi Metodologi &amp; Validasi Pemodelan Ilmiah</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumentasi pembuktian penolakan label biner buatan, pencegahan target leakage, dan validitas model statistik.
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
          contextText="Formula deterministik sederhana terbukti merekonstruksi label bawaan uploader"
          badge={{ text: "Terbukti Heuristik", type: "critical" }}
          accentColor="#0072B2"
        />

        <KpiCard
          label="Stabilitas Partisi Klaster"
          value="ARI = 0.9803"
          benchmarkText="Adjusted Rand Index (k = 4)"
          contextText="Mengukur ketahanan partisi K-Means terhadap perturbasi acak multi-seed"
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

      {/* 4 Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('ols')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'ols'
              ? 'bg-okabe-blue text-white shadow-xs'
              : 'bg-surface text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tab 1: Ekonometrika Multivariat OLS (β)
        </button>
        <button
          onClick={() => setActiveTab('kaggle')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'kaggle'
              ? 'bg-okabe-blue text-white shadow-xs'
              : 'bg-surface text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tab 2: Dekonstruksi Label Kaggle (98.8%)
        </button>
        <button
          onClick={() => setActiveTab('boundaries')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'boundaries'
              ? 'bg-okabe-blue text-white shadow-xs'
              : 'bg-surface text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tab 3: Verifikasi Nilai Batas 0.00% 3T
        </button>
        <button
          onClick={() => setActiveTab('principles')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'principles'
              ? 'bg-okabe-blue text-white shadow-xs'
              : 'bg-surface text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Tab 4: Validasi Klastering &amp; Formulasi V_struc
        </button>
      </div>

      {/* Tab 1: Multivariat OLS Standardized Beta Coefficients */}
      {activeTab === 'ols' && (
        <div className="space-y-4">
          <OLSCoefficientsBar olsResults={olsResults} />
          <NarrativeCallout
            title="WAWASAN KOEFISIEN BAKU OLS MULTIVARIAT"
            insight={PARADOXES.olsStandardizedBeta.insightCallout}
            evidence={PARADOXES.olsStandardizedBeta.evidence}
          />
        </div>
      )}

      {/* Tab 2: Reverse-Engineering Dekonstruksi Label Kaggle */}
      {activeTab === 'kaggle' && (
        <div className="bg-surface rounded-xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div>
            <h3 className="text-sm font-bold text-ink-primary">
              Dekonstruksi Reverse-Engineering Formula Heuristik Label Kaggle
            </h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Tim peneliti membuktikan secara matematis bahwa kolom label bawaan <code>Klasifikasi Kemiskinan</code> pada berkas mentah 
              dapat direkonstruksi sempurna sebesar <strong>98.83% (508 dari 514 daerah)</strong> hanya dengan rumus deterministik logika biner berikut:
            </p>
          </div>

          <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto shadow-inner space-y-1">
            <code>
              Class 1 (Miskin) &lt;=&gt; (poverty_rate_p0 &gt; 20.0%) OR (expenditure_per_capita &lt;= 6,250 [Ribu Rp] AND sanitation_access_pct &lt;= 56.0%)
            </code>
            <p className="text-[10px] text-slate-400 font-sans">
              *Catatan Satuan: Kolom <code>expenditure_per_capita</code> pada dataset mentah BPS bersatuan <strong>ribu rupiah per kapita disetahunkan</strong> (&le; 6.250 ribu = &le; Rp6,25 Juta/tahun).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-400 text-xs uppercase font-bold">Tingkat Kecocokan</span>
              <div className="text-lg font-bold text-okabe-blue mt-0.5">98.83% Cocok</div>
              <p className="text-xs text-slate-500 mt-0.5">508 observasi terbukti identik</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-400 text-xs uppercase font-bold">Implikasi Ilmiah</span>
              <div className="text-lg font-bold text-amber-700 mt-0.5">Bukan Ground Truth</div>
              <p className="text-xs text-slate-500 mt-0.5">Aturan buatan uploader Kaggle</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-400 text-xs uppercase font-bold">Keputusan Metodologi</span>
              <div className="text-lg font-bold text-emerald-700 mt-0.5">Label Didrop 100%</div>
              <p className="text-xs text-slate-500 mt-0.5">Mencegah circular reasoning</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Extreme Boundary Cases Verification */}
      {activeTab === 'boundaries' && (
        <div className="bg-surface rounded-xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div>
            <h3 className="text-sm font-bold text-ink-primary">
              Verifikasi Faktual Nilai Batas Lapangan Ekstrem (0.00%) di Wilayah 3T
            </h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Angka 0.00% pada variabel tertentu bukan merupakan kesalahan pengetikan (*not data entry error*), melainkan fakta keterisolasian fisik faktual:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {boundaryCases.map(b => (
              <div key={b.region} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink-primary">{b.region}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                    {b.value.toFixed(2)}{b.unit}
                  </span>
                </div>
                <div className="text-xs text-okabe-blue font-semibold">
                  Indikator: {b.variable_label}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {b.context}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Model Validation & Structural Vulnerability Formulation */}
      {activeTab === 'principles' && (
        <div className="space-y-4">
          {/* Top Row: Clustering Diagnostics & V_struc Mathematical Formulation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Box 1: K-Means Clustering Validation Metrics */}
            <div className="bg-surface rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-3.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-okabe-blue"></span>
                  <h3 className="text-sm font-bold text-ink-primary">
                    Validasi Diagnostik Model Klastering (k = 4)
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-okabe-blue border border-blue-200">
                  Unsupervised K-Means
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Pemilihan <strong>k = 4 klaster</strong> didasarkan pada optimasi multikriteria dari 20+ eksperimen pemodelan:
              </p>
              
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Koefisien Siluet</span>
                  <div className="text-base font-extrabold text-okabe-blue mt-0.5">0.2028</div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Struktur Riil Manifold</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Davies-Bouldin</span>
                  <div className="text-base font-extrabold text-amber-700 mt-0.5">1.4522</div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Rasio Separasi Klaster</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Adjusted Rand (ARI)</span>
                  <div className="text-base font-extrabold text-emerald-700 mt-0.5">0.9803</div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Stabilitas Multi-Seed</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-slate-600">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Protokol Fitur Klastering &amp; Penskalaan:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                  <li><strong>7 Fitur Input:</strong> Sanitasi, Air Minum, RLS, UHH, TPAK, TPT, dan log1p(PDRB).</li>
                  <li><strong>Penskalaan Robust:</strong> Menggunakan <code>RobustScaler</code> (Median &amp; IQR) untuk meredam pencilan 3T tanpa membuang baris data.</li>
                  <li><strong>Anti-Multikolinearitas:</strong> IPM komposit ($r &gt; 0.86$) dan kemiskinan moneter $P_0$ tidak disertakan dalam kalkulasi jarak Euclidean.</li>
                </ul>
              </div>
            </div>

            {/* Box 2: Structural Vulnerability Index (V_struc) Formulation */}
            <div className="bg-surface rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-3.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h3 className="text-sm font-bold text-ink-primary">
                    Formulasi Indeks Kerentanan Struktural (V_struc)
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Ambang Batas: 0.2720
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                $V_{`\\text{struc}`}$ mengukur intensitas defisit sarana dasar &amp; modal manusia secara objektif, bebas dari ketergantungan metrik moneter:
              </p>

              <div className="p-3 bg-slate-900 text-slate-100 font-mono text-[11px] rounded-lg overflow-x-auto shadow-inner space-y-1">
                <div className="text-amber-400 font-semibold">
                  V_struc = 0.25 × (D̃_sanitasi + D̃_air + D̃_RLS + D̃_UHH)
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-1">
                  Di mana masing-masing defisit dinormalisasi Min-Max ke rentang [0, 1] terhadap 514 daerah:
                </div>
                <div className="text-[10px] text-slate-300">
                  • D̃_sanitasi = MinMax(100% - Akses Sanitasi Layak) [Bobot 25%]<br />
                  • D̃_air = MinMax(100% - Akses Air Minum Layak) [Bobot 25%]<br />
                  • D̃_RLS = MinMax(max(RLS) - Rata-rata Lama Sekolah) [Bobot 25%]<br />
                  • D̃_UHH = MinMax(max(UHH) - Usia Harapan Hidup) [Bobot 25%]
                </div>
              </div>

              <div className="bg-amber-50/80 p-3 rounded-lg border border-amber-200 text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Kriteria Ambang Skrining Matriks 2x2:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900">
                  • <strong>V_struc ≥ 0.2720 (Median Nasional):</strong> Kerentanan struktural tinggi (Kuadran I &amp; II). Memerlukan intervensi modal fisik DAK &amp; sarana dasar.<br />
                  • <strong>V_struc &lt; 0.2720:</strong> Kerentanan struktural rendah (Kuadran III &amp; IV). Fasilitas dasar memadai, intervensi difokuskan pada stimulus daya beli &amp; padat karya.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Row: Design Principles & Unsupervised Integrity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-2.5 text-xs">
              <div className="flex items-center space-x-2 text-ink-primary font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-sm">Mengapa Radar / Spider Chart Dilarang</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed">
                <li>
                  <strong>Axis-Order Bias:</strong> Luas area poligon radar chart berubah drastis hanya dengan mengubah urutan sumbu, menghasilkan ilusi visual yang membiaskan persepsi pengambil kebijakan (Knaflic, Few).
                </li>
                <li>
                  <strong>Asumsi Hubungan Melingkar Semu:</strong> Radar chart dirancang untuk dimensi melingkar (arah kompas, siklus jam). Menghubungkan variabel independen (sanitasi, RLS, pengeluaran) memunculkan keterkaitan geometris fiktif.
                </li>
                <li>
                  <strong>Solusi Terpilih:</strong> Menggunakan <em>Small Multiples Bar Charts (Z-Score)</em> yang memiliki garis acuan nol nasional dan <em>Matriks Diverging Heatmap 28 Sel</em>.
                </li>
              </ul>
            </div>

            <div className="bg-surface rounded-xl border border-slate-200/80 p-5 shadow-subtle space-y-2.5 text-xs">
              <div className="flex items-center space-x-2 text-ink-primary font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-sm">Filosofi Zero Target Leakage &amp; SDG 1</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed">
                <li>
                  <strong>Penolakan Klasifikasi Supervised:</strong> Label biner Kaggle dibuang 100% untuk mencegah penalaran melingkar (*circular reasoning*), karena terbukti merupakan formula artifisial.
                </li>
                <li>
                  <strong>Eksklusi P0 dari Fitur Klastering:</strong> Tingkat kemiskinan moneter $P_0$ tidak disertakan dalam ruang fitur K-Means, melainkan difungsikan murni untuk profil evaluasi pasca-klastering.
                </li>
                <li>
                  <strong>Prinsip "Leave No One Behind":</strong> 26 anomali ekstrim wilayah 3T tidak dibuang, melainkan ditransformasikan dengan <code>log1p</code> pada PDRB dan diskalakan via <code>RobustScaler</code> (berbasis median &amp; IQR).
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible: Tukey 1.5x IQR Boxplot Outlier Inspection */}
      <details className="group bg-surface rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-subtle text-xs transition-all">
        <summary className="cursor-pointer font-bold text-slate-800 flex justify-between items-center select-none text-xs">
          <span className="flex items-center space-x-2">
            <span>📊 Audit Distribusi &amp; Deteksi Pencilan (Tukey 1.5x IQR Boxplot)</span>
          </span>
          <span className="text-slate-400 text-xs transition-transform group-open:rotate-180">▼</span>
        </summary>
        <div className="mt-4 pt-3 border-t border-slate-100">
          <TukeyBoxplot districts={districts} />
        </div>
      </details>

      {/* Collapsible: Data Dictionary & Transformation Standards */}
      <details className="group bg-surface rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-subtle text-xs transition-all">
        <summary className="cursor-pointer font-bold text-slate-800 flex justify-between items-center select-none text-xs">
          <span className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-okabe-blue" />
            <span>Kamus Data &amp; Standar Transformasi Fitur (7 Indikator Struktural)</span>
          </span>
          <span className="text-slate-400 text-xs transition-transform group-open:rotate-180">▼</span>
        </summary>
        <div className="mt-3 pt-3 border-t border-slate-100 text-slate-600 leading-relaxed space-y-2">
          <p>
            Semua 7 fitur masukan klastering distandarisasi menggunakan <code>RobustScaler</code> (berbasis median dan IQR) untuk menahan distorsi dari 26 anomali multivariat tanpa membuang satu pun kabupaten dari dataset.
          </p>
          <p>
            PDRB riil konstan ditransformasikan dengan <code>log1p</code> untuk mereduksi kemencengan dari +5.85 menjadi +0.23, menjaga stabilitas matematis algoritma berbasis jarak Euclidean.
          </p>
        </div>
      </details>
    </motion.div>
  );
};

export default MethodologyAudit;
