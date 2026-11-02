import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Building, Briefcase } from 'lucide-react';
import { District, PolicyRecommendation } from '../types';
import { VulnerabilityMatrix2x2 } from '../components/charts/VulnerabilityMatrix2x2';
import { DataTable } from '../components/common/DataTable';
import { NarrativeCallout } from '../components/common/NarrativeCallout';
import { useFilterStore } from '../store/useFilterStore';
import { QUADRANTS } from '../constants/benchmarks';
import { PARADOXES } from '../constants/paradoxes';

interface PageProps {
  districts: District[];
  policyMatrix: PolicyRecommendation[];
}

export const PriorityImplications: React.FC<PageProps> = ({ districts, policyMatrix }) => {
  const { activeCasePin, setActiveCasePin } = useFilterStore();
  const [selectedQuadrantCode, setSelectedQuadrantCode] = useState<string>('Q1');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  // Active policy recommendation item from matrix
  const activePolicy = policyMatrix.find(p => p.code === selectedQuadrantCode) || policyMatrix[4];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Action Header */}
      <div className="bg-surface rounded-2xl border border-slate-200/80 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-okabe-vermillion"></span>
            <span>Babak 4: The Call to Action · Matriks 2x2 & Penapisan Portofolio</span>
          </div>
          <h2 className="text-xl font-extrabold text-ink-primary tracking-tight">
            Matriks Skrining Kerentanan 2x2: Penapisan 514 Daerah Menuju Portofolio Kebijakan
          </h2>
          <p className="text-xs text-ink-muted mt-1 max-w-2xl">
            Memadukan kemiskinan moneter aktual (P0) dan indeks kerentanan fasilitas dasar (V_struc) dengan garis median nasional untuk diferensiasi intervensi spesifik.
          </p>
        </div>

        {/* Case-Study Pins Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveCasePin('none')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCasePin === 'none'
                ? 'bg-white text-ink-primary shadow-xs'
                : 'text-slate-600 hover:text-ink-primary'
            }`}
          >
            Semua (514)
          </button>
          <button
            onClick={() => setActiveCasePin('resource_curse')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeCasePin === 'resource_curse'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-amber-800'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Pin: Kutukan Tambang</span>
          </button>
          <button
            onClick={() => setActiveCasePin('madura')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeCasePin === 'madura'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-amber-800'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Pin: Disparitas Madura</span>
          </button>
        </div>
      </div>

      {/* Grid: 2x2 Scatterplot (7-Col) & Policy Recommendation Panel (5-Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <VulnerabilityMatrix2x2
            districts={districts}
            activeCasePin={activeCasePin}
            onSelectDistrict={(d) => setSelectedDistrict(d)}
          />
        </div>

        {/* Policy Guidance & Quadrant Lookup Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-surface rounded-xl border border-slate-200/80 p-5 shadow-subtle h-full flex flex-col justify-between">
            <div>
              {/* Quadrant Selector Tabs */}
              <div className="flex items-center space-x-1 pb-3 border-b border-slate-100">
                {QUADRANTS.map(q => (
                  <button
                    key={q.code}
                    onClick={() => setSelectedQuadrantCode(q.code)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-all ${
                      selectedQuadrantCode === q.code
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {q.code}
                  </button>
                ))}
              </div>

              {/* Quadrant Policy Content */}
              {activePolicy && (
                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Rekomendasi Kebijakan Terpadu
                    </span>
                    <h3 className="text-sm font-extrabold text-ink-primary mt-0.5 leading-snug">
                      {activePolicy.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {activePolicy.working_hypothesis}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-okabe-blue shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">Jalur Intervensi Utama:</strong>
                        <p className="text-slate-600 mt-0.5">{activePolicy.primary_policy_track}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">Instrumen Fiskal (APBN &amp; TKD):</strong>
                        <p className="text-slate-600 mt-0.5">{activePolicy.fiscal_instruments}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Building className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">OPD &amp; K/L Pengampu:</strong>
                        <p className="text-slate-600 mt-0.5">{activePolicy.lead_agencies}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Selected District Callout if Clicked */}
            {selectedDistrict && (
              <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-okabe-blue">
                    Terpilih: {selectedDistrict.tipe_wilayah} {selectedDistrict.kab_kota}
                  </span>
                  <button 
                    onClick={() => setSelectedDistrict(null)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Tutup
                  </button>
                </div>
                <div className="mt-1 text-[11px] text-slate-600">
                  Provinsi: {selectedDistrict.provinsi} | P0: {selectedDistrict.poverty_rate_p0.toFixed(2)}% | V_struc: {selectedDistrict.vulnerability_score.toFixed(4)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Narrative Callout for Active Pin or General Action */}
      <NarrativeCallout
        title={activeCasePin === 'resource_curse' ? "ANOMALI KUTUKAN SUMBER DAYA" : (activeCasePin === 'madura' ? "ANOMALI DISPARITAS MADURA" : "PENAPISAN BEBAN GANDA KUADRAN I")}
        insight={
          activeCasePin === 'resource_curse'
            ? PARADOXES.resourceCurse.insightCallout
            : (activeCasePin === 'madura'
                ? PARADOXES.maduraDisparity.insightCallout
                : "Kuadran I (162 daerah / 31.5%) mencakup wilayah yang menanggung beban ganda: kemiskinan moneter konsumsi tinggi sekaligus ketiadaan sarana air dan sanitasi dasar. Penanganan di wilayah ini menuntut konvergensi ganda antara bantalan sosial tunai (PKH/BLT) dan belanja modal fisik infrastruktur dasar.")
        }
        evidence={
          activeCasePin === 'resource_curse'
            ? PARADOXES.resourceCurse.evidence
            : (activeCasePin === 'madura' ? PARADOXES.maduraDisparity.evidence : "N_Kuadran_I = 162 daerah, seluruhnya memerlukan intervensi simultan.")
        }
      />

      {/* Filtered Screening Table */}
      <DataTable
        districts={districts}
        title="Daftar Skrining Wilayah Penapisan Kebijakan"
        subtitle="Data tersaring yang siap diekspor ke format CSV untuk analisis Bappeda."
        defaultSortField="vulnerability_score"
        defaultSortAsc={false}
      />
    </motion.div>
  );
};
