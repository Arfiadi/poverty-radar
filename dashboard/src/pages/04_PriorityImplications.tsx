import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Building, Briefcase } from 'lucide-react';
import { District, PolicyRecommendation } from '../types';
import { VulnerabilityMatrix2x2 } from '../components/charts/VulnerabilityMatrix2x2';
import { DataTable } from '../components/common/DataTable';
import { NarrativeCallout } from '../components/common/NarrativeCallout';
import { KpiCard } from '../components/common/KpiCard';
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
  const activePolicy = selectedQuadrantCode === 'ALL'
    ? null
    : (policyMatrix.find(p => p.code === selectedQuadrantCode) || null);

  const handleSelectQuadrant = (code: string) => {
    setSelectedQuadrantCode(code);
    if (activeCasePin !== 'none') {
      setActiveCasePin('none');
    }
  };

  const handleSelectDistrict = (d: District) => {
    setSelectedDistrict(d);
    if (d.vulnerability_quadrant.startsWith('Kuadran I')) {
      setSelectedQuadrantCode('Q1');
    } else if (d.vulnerability_quadrant.startsWith('Kuadran II')) {
      setSelectedQuadrantCode('Q2');
    } else if (d.vulnerability_quadrant.startsWith('Kuadran III')) {
      setSelectedQuadrantCode('Q3');
    } else if (d.vulnerability_quadrant.startsWith('Kuadran IV')) {
      setSelectedQuadrantCode('Q4');
    }
  };

  // Filtered districts for table based on selected quadrant
  const displayedDistricts = React.useMemo(() => {
    if (selectedQuadrantCode === 'ALL') return districts;
    const qMap: Record<string, string> = {
      Q1: 'Kuadran I',
      Q2: 'Kuadran II',
      Q3: 'Kuadran III',
      Q4: 'Kuadran IV',
    };
    const prefix = qMap[selectedQuadrantCode];
    return prefix ? districts.filter(d => d.vulnerability_quadrant.startsWith(prefix)) : districts;
  }, [districts, selectedQuadrantCode]);

  const quadrantStats = React.useMemo(() => {
    const q1 = districts.filter(d => d.vulnerability_quadrant.startsWith('Kuadran I')).length;
    const q2 = districts.filter(d => d.vulnerability_quadrant.startsWith('Kuadran II')).length;
    const q3 = districts.filter(d => d.vulnerability_quadrant.startsWith('Kuadran III')).length;
    const q4 = districts.filter(d => d.vulnerability_quadrant.startsWith('Kuadran IV')).length;
    const total = districts.length || 514;
    return {
      q1: { count: q1, pct: (q1 / total) * 100 },
      q2: { count: q2, pct: (q2 / total) * 100 },
      q3: { count: q3, pct: (q3 / total) * 100 },
      q4: { count: q4, pct: (q4 / total) * 100 },
    };
  }, [districts]);

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
            Matriks Skrining Kerentanan 2x2: Penapisan Daerah Menuju Portofolio Kebijakan
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
            Semua Daerah
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

      {/* Row 1: 4 Interactive Quadrant KPI Cards Strip (Click-to-Filter) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Kuadran I: Prioritas Beban Ganda"
          value={`${quadrantStats.q1.count} Daerah (${quadrantStats.q1.pct.toFixed(1)}%)`}
          benchmarkText="Kriteria: P0 ≥ 10.46% & V_struc ≥ 0.272"
          contextText="Kemiskinan konsumsi tinggi & defisit fisik parah · Prioritas DAK Fisik & Bansos"
          badge={{
            text: selectedQuadrantCode === 'Q1' ? "Aktif Terpilih" : "Prioritas Utama",
            type: selectedQuadrantCode === 'Q1' ? "filter" : "critical",
          }}
          range={{
            min: 0,
            max: districts.length || 514,
            current: quadrantStats.q1.count,
            minLabel: "0",
            maxLabel: `${districts.length} daerah`,
            unit: " daerah",
          }}
          accentColor="#D55E00"
          onClick={() => handleSelectQuadrant(selectedQuadrantCode === 'Q1' ? 'ALL' : 'Q1')}
          isActive={selectedQuadrantCode === 'Q1'}
        />

        <KpiCard
          label="Kuadran II: Kerentanan Tersembunyi"
          value={`${quadrantStats.q2.count} Daerah (${quadrantStats.q2.pct.toFixed(1)}%)`}
          benchmarkText="Kriteria: P0 < 10.46% & V_struc ≥ 0.272"
          contextText="Moneter tampak aman, sanitasi/air rapuh · Intervensi preventif infrastruktur dasar"
          badge={{
            text: selectedQuadrantCode === 'Q2' ? "Aktif Terpilih" : "Rentan Fisik",
            type: selectedQuadrantCode === 'Q2' ? "filter" : "warning",
          }}
          range={{
            min: 0,
            max: districts.length || 514,
            current: quadrantStats.q2.count,
            minLabel: "0",
            maxLabel: `${districts.length} daerah`,
            unit: " daerah",
          }}
          accentColor="#E69F00"
          onClick={() => handleSelectQuadrant(selectedQuadrantCode === 'Q2' ? 'ALL' : 'Q2')}
          isActive={selectedQuadrantCode === 'Q2'}
        />

        <KpiCard
          label="Kuadran III: Kantong Daya Beli"
          value={`${quadrantStats.q3.count} Daerah (${quadrantStats.q3.pct.toFixed(1)}%)`}
          benchmarkText="Kriteria: P0 ≥ 10.46% & V_struc < 0.272"
          contextText="Fasilitas dasar baik, daya beli lemah · Stimulus pasar kerja & padat karya"
          badge={{
            text: selectedQuadrantCode === 'Q3' ? "Aktif Terpilih" : "Defisit Moneter",
            type: selectedQuadrantCode === 'Q3' ? "filter" : "default",
          }}
          range={{
            min: 0,
            max: districts.length || 514,
            current: quadrantStats.q3.count,
            minLabel: "0",
            maxLabel: `${districts.length} daerah`,
            unit: " daerah",
          }}
          accentColor="#CC79A7"
          onClick={() => handleSelectQuadrant(selectedQuadrantCode === 'Q3' ? 'ALL' : 'Q3')}
          isActive={selectedQuadrantCode === 'Q3'}
        />

        <KpiCard
          label="Kuadran IV: Wilayah Terbina / Mapan"
          value={`${quadrantStats.q4.count} Daerah (${quadrantStats.q4.pct.toFixed(1)}%)`}
          benchmarkText="Kriteria: P0 < 10.46% & V_struc < 0.272"
          contextText="Layanan dasar lengkap & konsumsi stabil · Perluasan kemandirian fiskal PAD"
          badge={{
            text: selectedQuadrantCode === 'Q4' ? "Aktif Terpilih" : "Wilayah Mapan",
            type: selectedQuadrantCode === 'Q4' ? "filter" : "positive",
          }}
          range={{
            min: 0,
            max: districts.length || 514,
            current: quadrantStats.q4.count,
            minLabel: "0",
            maxLabel: `${districts.length} daerah`,
            unit: " daerah",
          }}
          accentColor="#0072B2"
          onClick={() => handleSelectQuadrant(selectedQuadrantCode === 'Q4' ? 'ALL' : 'Q4')}
          isActive={selectedQuadrantCode === 'Q4'}
        />
      </div>

      {/* Grid: 2x2 Scatterplot (7-Col) & Policy Recommendation Panel (5-Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <VulnerabilityMatrix2x2
            districts={districts}
            activeCasePin={activeCasePin}
            activeQuadrantCode={selectedQuadrantCode}
            onSelectDistrict={handleSelectDistrict}
          />
        </div>

        {/* Policy Guidance & Quadrant Lookup Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-surface rounded-xl border border-slate-200/80 p-5 shadow-subtle h-full flex flex-col justify-between">
            <div>
              {/* Quadrant Selector Tabs */}
              <div className="flex items-center space-x-1 pb-3 border-b border-slate-100">
                <button
                  onClick={() => handleSelectQuadrant('ALL')}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-bold text-center transition-all ${
                    selectedQuadrantCode === 'ALL'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua
                </button>
                {QUADRANTS.map(q => (
                  <button
                    key={q.code}
                    onClick={() => handleSelectQuadrant(q.code)}
                    className={`flex-1 py-1.5 px-1.5 rounded-lg text-xs font-bold text-center transition-all ${
                      selectedQuadrantCode === q.code
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {q.code} <span className="text-xs opacity-75">({q.count})</span>
                  </button>
                ))}
              </div>

              {/* Quadrant Policy Content */}
              {activePolicy ? (
                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Rekomendasi Kebijakan Terpadu ({activePolicy.code})
                    </span>
                    <h3 className="text-sm font-extrabold text-ink-primary mt-0.5 leading-snug">
                      {activePolicy.name}
                    </h3>
                  </div>

                  <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2.5">
                    {/* 1. Akar Masalah */}
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <div>
                        <strong className="text-slate-800">Akar Masalah:</strong>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{activePolicy.working_hypothesis}</p>
                      </div>
                    </div>

                    {/* 2. Jalur Intervensi Utama */}
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-okabe-blue shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">Jalur Intervensi Utama:</strong>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{activePolicy.primary_policy_track}</p>
                      </div>
                    </div>

                    {/* 3. Rekomendasi Alokasi APBN/DAK */}
                    <div className="flex items-start space-x-2">
                      <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">Rekomendasi Alokasi APBN &amp; DAK:</strong>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{activePolicy.fiscal_instruments}</p>
                      </div>
                    </div>

                    {/* Accordion: Detail Regulasi & OPD Pelaksana */}
                    <details className="mt-2 group border border-slate-200 rounded-lg bg-white overflow-hidden text-xs transition-all">
                      <summary className="px-3 py-2 cursor-pointer font-semibold text-slate-700 hover:text-slate-900 flex justify-between items-center select-none bg-slate-50/60">
                        <span className="flex items-center space-x-1.5">
                          <Building className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Lihat Detail Regulasi &amp; OPD Pelaksana</span>
                        </span>
                        <span className="text-slate-400 text-xs transition-transform group-open:rotate-180">▼</span>
                      </summary>
                      <div className="p-3 border-t border-slate-200 space-y-2 text-slate-600 leading-relaxed bg-white">
                        <div>
                          <strong className="text-slate-800">OPD &amp; K/L Pengampu:</strong>
                          <p className="mt-0.5 text-slate-700">{activePolicy.lead_agencies}</p>
                        </div>
                        <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                          Rujukan: Kerangka Kerja Penapisan SDGs Kemendagri &amp; Bappenas 2026.
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Penapisan Portofolio Kebijakan Nasional
                    </span>
                    <h3 className="text-sm font-extrabold text-ink-primary mt-0.5 leading-snug">
                      Matriks Relatif 2x2: Diferensiasi Portofolio Intervensi
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Penapisan memisahkan kemiskinan moneter konsumsi (Sumbu X) dan defisit fasilitas fisik (Sumbu Y). Pilih tab kuadran (Q1–Q4) untuk menelaah intervensi spesifik tiap kelompok.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {QUADRANTS.map(q => (
                      <button
                        key={q.code}
                        onClick={() => handleSelectQuadrant(q.code)}
                        className="text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: q.color }}></span>
                          <span className="font-bold text-slate-800 text-xs">{q.code}</span>
                          <span className="text-xs text-slate-400 font-normal">({q.count})</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-1 line-clamp-1">{q.label.split(':')[1]?.trim()}</p>
                      </button>
                    ))}
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
                <div className="mt-1 text-xs text-slate-600">
                  Provinsi: {selectedDistrict.provinsi} | P0: {selectedDistrict.poverty_rate_p0.toFixed(2)}% | V_struc: {selectedDistrict.vulnerability_score.toFixed(4)} | {selectedDistrict.vulnerability_quadrant}
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
            ? "29 daerah tambang jumbo (PDRB ≥ Rp 25 Triliun) mengalami paradoks kemiskinan di atas median nasional akibat distorsi enclave economy ekstraktif yang minim menyerap tenaga kerja lokal."
            : (activeCasePin === 'madura'
                ? "Hanya terpisah 5.4 km Suramadu, Surabaya berpendidikan tinggi dan sejahtera, sementara Madura terjebak kemiskinan hingga 23.8% akibat defisit modal manusia dan sanitasi."
                : "Matriks 2x2 mendiferensiasikan intervensi: wilayah beban ganda (Kuadran I) wajib memadukan bansos tunai dan belanja modal fisik, sedangkan daerah defisit moneter murni cukup perluasan kerja formal dan subsidi.")
        }
        evidence={
          activeCasePin === 'resource_curse'
            ? PARADOXES.resourceCurse.evidence
            : (activeCasePin === 'madura' ? PARADOXES.maduraDisparity.evidence : "N_Kuadran_I = 162 daerah, Kuadran II = 95 daerah, Kuadran III = 95 daerah, Kuadran IV = 162 daerah.")
        }
      />

      {/* Filtered Screening Table */}
      <DataTable
        districts={displayedDistricts}
        title={
          selectedQuadrantCode === 'ALL'
            ? "Daftar Skrining Wilayah Penapisan Kebijakan (Semua Daerah)"
            : `Daftar Skrining Wilayah Penapisan Kebijakan (${selectedQuadrantCode} · ${displayedDistricts.length} Daerah)`
        }
        subtitle="Data tersaring yang siap diekspor ke format CSV untuk analisis Bappeda."
        defaultSortField="vulnerability_score"
        defaultSortAsc={false}
      />
    </motion.div>
  );
};

export default PriorityImplications;
