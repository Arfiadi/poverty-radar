import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, Database, HelpCircle } from 'lucide-react';
import { District, OLSResult, BoundaryCase } from '../types';
import { OLSCoefficientsBar } from '../components/charts/OLSCoefficientsBar';
import { TukeyBoxplot } from '../components/charts/TukeyBoxplot';
import { NarrativeCallout } from '../components/common/NarrativeCallout';
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
  const [activeTab, setActiveTab] = useState<'boundaries' | 'kaggle' | 'ols'>('ols');

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
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-emerald-400 mb-1">
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

      {/* 3 Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
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

          <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto shadow-inner">
            <code>
              Class 1 (Miskin) &lt;=&gt; (poverty_rate_p0 &gt; 20.0%) OR (expenditure_per_capita &lt;= 6,250,000 AND sanitation_access_pct &lt;= 56.0%)
            </code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Tingkat Kecocokan</span>
              <div className="text-lg font-bold text-okabe-blue mt-0.5">98.83% Cocok</div>
              <p className="text-[11px] text-slate-500 mt-0.5">508 dari 514 observasi identik</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Implikasi Ilmiah</span>
              <div className="text-lg font-bold text-amber-700 mt-0.5">Bukan Ground Truth</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Aturan buatan uploader Kaggle</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Keputusan Metodologi</span>
              <div className="text-lg font-bold text-emerald-700 mt-0.5">Label Didrop 100%</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Mencegah circular reasoning</p>
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
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                    {b.value.toFixed(2)}{b.unit}
                  </span>
                </div>
                <div className="text-[11px] text-okabe-blue font-semibold">
                  Indikator: {b.variable_label}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {b.context}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Outlier Inspection: Tukey 1.5x IQR Boxplot */}
      <TukeyBoxplot districts={districts} />

      {/* Data Dictionary & Verification Summary */}
      <div className="bg-surface rounded-xl border border-slate-200/80 p-5 shadow-subtle text-xs space-y-3">
        <div className="flex items-center space-x-2 text-slate-800 font-bold">
          <Database className="w-4 h-4 text-okabe-blue" />
          <span>Kamus Data Singkat &amp; Standar Transformasi Fitur</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Semua 7 fitur masukan klastering distandarisasi menggunakan <code>RobustScaler</code> (berbasis median dan IQR) untuk menahan distorsi dari 26 anomali multivariat tanpa membuang satu pun kabupaten dari dataset. PDRB ditransformasikan dengan <code>log1p</code> untuk mereduksi kemencengan dari +5.85 menjadi +0.23.
        </p>
      </div>
    </motion.div>
  );
};
