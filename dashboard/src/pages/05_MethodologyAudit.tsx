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
      className="space-y-6"
    >
      {/* Integrity Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-elevated">
        <div className="flex items-start space-x-3.5">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
              <span>Scientific Rigor &amp; Anti-Target-Leakage</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Integritas Metodologi: Murni Unsupervised, Nol Kebocoran Target, &amp; Dekonstruksi Model Biner
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-3xl">
              Proyek PovertyRadar SDGs secara tegas menolak pemodelan klasifikasi terawasi (*supervised classification*). 
              Kolom label biner bawaan dataset dibuang karena bukan merupakan *ground truth* resmi BPS, melainkan aturan heuristik sederhana yang memicu penalaran melingkar (*circular reasoning*).
            </p>
          </div>
        </div>
      </div>

      {/* Row 1: 4 Data Science & Integrity Audit KPI Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Integritas Target Leakage"
          value="0% Kebocoran"
          benchmarkText="100% Label Biner Bawaan Dibuang"
          contextText="Menolak klasifikasi terawasi artifisial · Murni Unsupervised K-Means"
          badge={{ text: "Metodologi Valid", type: "positive" }}
          range={{
            min: 0,
            max: 100,
            current: 0,
            target: 0,
            minLabel: "0% (Bebas)",
            maxLabel: "100%",
            targetLabel: "Target: 0%",
            unit: "%",
          }}
          accentColor="#009E73"
        />

        <KpiCard
          label="Dekonstruksi Label Kaggle"
          value="98.83% Cocok"
          benchmarkText="508 dari 514 Daerah Identik Formula"
          contextText="Formula deterministik sederhana terbukti merekonstruksi label bawaan uploader"
          badge={{ text: "Terbukti Heuristik", type: "critical" }}
          range={{
            min: 0,
            max: 100,
            current: 98.83,
            minLabel: "0%",
            maxLabel: "100%",
            unit: "%",
          }}
          accentColor="#0072B2"
        />

        <KpiCard
          label="Stabilitas Partisi Klaster"
          value="ARI = 0.9803"
          benchmarkText="Adjusted Rand Index (k = 4)"
          contextText="Mengukur ketahanan partisi K-Means terhadap perturbasi acak multi-seed"
          badge={{ text: "Stabilitas Tinggi", type: "positive" }}
          range={{
            min: 0.0,
            max: 1.0,
            current: 0.9803,
            target: 1.0,
            minLabel: "0.0",
            maxLabel: "1.0",
            targetLabel: "Maks: 1.0",
          }}
          accentColor="#009E73"
        />

        <KpiCard
          label="Daya Jelas Model OLS (R²)"
          value="R² = 51.64%"
          benchmarkText="R² Terkoreksi: 51.07% (p < 0.001)"
          contextText="6 indikator struktural dasar menjelaskan mayoritas variasi kemiskinan moneter"
          badge={{ text: "Ekonometrika Solid", type: "default" }}
          range={{
            min: 0,
            max: 100,
            current: 51.64,
            minLabel: "0%",
            maxLabel: "100%",
            unit: "%",
          }}
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
          Tab 4: Prinsip Visualisasi &amp; Nol Target Leakage
        </button>
      </div>

      {/* Tab 1: Multivariat OLS Standardized Beta Coefficients */}
      {activeTab === 'ols' && (
        <div className="space-y-4">
          <OLSCoefficientsBar olsResults={olsResults} />
          <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start space-x-2.5">
            <span className="font-bold shrink-0 text-amber-800">[Asosiasi Statistik]:</span>
            <span className="leading-relaxed">
              Koefisien regresi terstandarisasi baku (β) merepresentasikan estimasi <strong>asosiasi multivariat linier relatif</strong> dalam kondisi <em>ceteris paribus</em>, bukan hubungan sebab-akibat deterministik langsung (*correlation does not imply causation*). Seluruh variabel dianalisis dalam kerangka komparasi struktural.
            </span>
          </div>
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

          <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto shadow-inner">
            <code>
              Class 1 (Miskin) &lt;=&gt; (poverty_rate_p0 &gt; 20.0%) OR (expenditure_per_capita &lt;= 6,250,000 AND sanitation_access_pct &lt;= 56.0%)
            </code>
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

      {/* Tab 4: Design Principles & Unsupervised Integrity */}
      {activeTab === 'principles' && (
        <div className="bg-surface rounded-xl border border-slate-200/80 p-6 shadow-subtle space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-ink-primary">
              Standar Desain Visual &amp; Filosofi Unsupervised Learning
            </h3>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Dokumentasi resmi mengenai pilihan arsitektur visual dan batasan metodologis yang diterapkan pada sistem PovertyRadar SDGs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-ink-primary font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Mengapa Radar / Spider Chart Dilarang</span>
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

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-ink-primary font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Filosofi Zero Target Leakage &amp; SDG 1</span>
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
