import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  Building, 
  Briefcase, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  ShieldAlert, 
  Target,
  LayoutGrid,
  Table,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { District, PolicyRecommendation } from '../types';
import { VulnerabilityMatrix2x2 } from '../components/charts/VulnerabilityMatrix2x2';
import { DataTable } from '../components/common/DataTable';
import { PolicyBriefModal } from '../components/modals/PolicyBriefModal';
import { PlanningCycleModal } from '../components/modals/PlanningCycleModal';
import { useFilterStore } from '../store/useFilterStore';
import { QUADRANTS } from '../constants/benchmarks';
import { formatPercent, formatYears, formatCurrencyMillion } from '../utils/formatters';

interface PageProps {
  districts: District[];
  allDistricts?: District[];
  policyMatrix: PolicyRecommendation[];
}

export const PriorityImplications: React.FC<PageProps> = ({ 
  districts, 
  allDistricts = districts,
  policyMatrix 
}) => {
  const { 
    selectedQuadrant, 
    setSelectedQuadrant, 
    activeCasePin, 
    setActiveCasePin 
  } = useFilterStore();
  const [activeView, setActiveView] = useState<'matrix' | 'table'>('matrix');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [isPolicyBriefOpen, setIsPolicyBriefOpen] = useState<boolean>(false);
  const [isPlanningCycleOpen, setIsPlanningCycleOpen] = useState<boolean>(false);

  // Derive active quadrant code ('ALL' | 'Q1' | 'Q2' | 'Q3' | 'Q4') from global store
  const selectedQuadrantCode = useMemo(() => {
    if (!selectedQuadrant || selectedQuadrant === 'all') return 'ALL';
    const found = QUADRANTS.find(q => q.id === selectedQuadrant);
    return found ? found.code : 'ALL';
  }, [selectedQuadrant]);

  // Compute dynamic benchmarks from all available districts
  const medianP0 = useMemo(() => {
    if (!allDistricts || allDistricts.length === 0) return 10.46;
    const sorted = [...allDistricts].map(d => d.poverty_rate_p0).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }, [allDistricts]);

  const medianVStruc = useMemo(() => {
    if (!allDistricts || allDistricts.length === 0) return 0.2720;
    const sorted = [...allDistricts].map(d => d.vulnerability_score).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }, [allDistricts]);

  // Active policy recommendation item from matrix based on quadrant
  const activePolicy = selectedQuadrantCode === 'ALL'
    ? null
    : (policyMatrix.find(p => p.code === selectedQuadrantCode) || null);

  // Synchronize case pin with selected district & quadrant
  useEffect(() => {
    if (activeCasePin === 'barito_kuala') {
      const q2 = QUADRANTS.find(q => q.code === 'Q2');
      if (q2) setSelectedQuadrant(q2.id);
      const bk = districts.find(d => d.kab_kota.toLowerCase().includes('barito kuala'));
      if (bk) setSelectedDistrict(bk);
    } else if (activeCasePin === 'madura') {
      const q1 = QUADRANTS.find(q => q.code === 'Q1');
      if (q1) setSelectedQuadrant(q1.id);
      const sp = districts.find(d => d.kab_kota.toLowerCase().includes('sampang'));
      if (sp) setSelectedDistrict(sp);
    } else if (activeCasePin === 'resource_curse') {
      setSelectedQuadrant('all');
      const mm = districts.find(d => d.kab_kota.toLowerCase().includes('mimika'));
      if (mm) setSelectedDistrict(mm);
    }
  }, [activeCasePin, districts, setSelectedQuadrant]);

  const handleSelectQuadrant = (code: string) => {
    if (code === 'ALL') {
      setSelectedQuadrant('all');
    } else {
      const found = QUADRANTS.find(q => q.code === code);
      if (found) {
        setSelectedQuadrant(found.id);
      }
    }
    if (activeCasePin !== 'none') {
      setActiveCasePin('none');
    }
  };

  const handleSelectDistrict = (d: District) => {
    setSelectedDistrict(d);
    const found = QUADRANTS.find(q => q.id === d.vulnerability_quadrant || d.vulnerability_quadrant.startsWith(q.id.split('(')[0]));
    if (found) {
      setSelectedQuadrant(found.id);
    }
  };

  // Policy recommendation for the selected district (for modal)
  const selectedDistrictPolicy = useMemo(() => {
    if (!selectedDistrict) return activePolicy;
    let code = 'Q1';
    if (selectedDistrict.vulnerability_quadrant.startsWith('Kuadran I ')) code = 'Q1';
    else if (selectedDistrict.vulnerability_quadrant.startsWith('Kuadran II ')) code = 'Q2';
    else if (selectedDistrict.vulnerability_quadrant.startsWith('Kuadran III ')) code = 'Q3';
    else if (selectedDistrict.vulnerability_quadrant.startsWith('Kuadran IV ')) code = 'Q4';
    return policyMatrix.find(p => p.code === code) || null;
  }, [selectedDistrict, activePolicy, policyMatrix]);

  // Filtered districts for table based on selected quadrant
  const displayedDistricts = useMemo(() => {
    if (selectedQuadrantCode === 'ALL') return districts;
    const qMap: Record<string, string> = {
      Q1: 'Kuadran I ',
      Q2: 'Kuadran II ',
      Q3: 'Kuadran III ',
      Q4: 'Kuadran IV ',
    };
    const prefix = qMap[selectedQuadrantCode];
    return prefix ? districts.filter(d => d.vulnerability_quadrant.startsWith(prefix)) : districts;
  }, [districts, selectedQuadrantCode]);

  const quadrantStats = useMemo(() => {
    const base = allDistricts && allDistricts.length > 0 ? allDistricts : districts;
    const q1 = base.filter(d => d.vulnerability_quadrant.startsWith('Kuadran I ')).length;
    const q2 = base.filter(d => d.vulnerability_quadrant.startsWith('Kuadran II ')).length;
    const q3 = base.filter(d => d.vulnerability_quadrant.startsWith('Kuadran III ')).length;
    const q4 = base.filter(d => d.vulnerability_quadrant.startsWith('Kuadran IV ')).length;
    const total = base.length || 514;
    return {
      q1: { count: q1, pct: (q1 / total) * 100 },
      q2: { count: q2, pct: (q2 / total) * 100 },
      q3: { count: q3, pct: (q3 / total) * 100 },
      q4: { count: q4, pct: (q4 / total) * 100 },
    };
  }, [allDistricts, districts]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-3.5"
    >
      {/* Editorial Header & Top Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            {activeView === 'matrix'
              ? "Matriks Skrining Kerentanan 2x2: Pemetaan Prioritas Kebijakan"
              : "Daftar Skrining Daerah & Advokasi Kebijakan (514 Kab/Kota)"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {activeView === 'matrix'
              ? "Diferensiasi intervensi fiskal memadukan kemiskinan konsumsi (P0) dan defisit fasilitas fisik (V_struc)."
              : "Daftar rincian 514 kabupaten–kota siap tindak lanjut, draf policy brief, dan pengusulan DAK/APBD."}
          </p>
        </div>

        {/* Action Controls: Sub-Tab Toggle & SIPD-RI Modal CTA */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            <button
              onClick={() => setActiveView('matrix')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                activeView === 'matrix'
                  ? 'bg-white text-okabe-vermillion shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Matriks Skrining 2x2</span>
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                activeView === 'table'
                  ? 'bg-white text-okabe-blue shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tabel Daerah</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-mono">
                {displayedDistricts.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsPlanningCycleOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-all"
            title="Buka panduan resmi 10 langkah penerjemahan data analitik ke dokumen perencanaan RKPD & APBD"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Panduan Alur SIPD-RI</span>
          </button>
        </div>
      </div>

      {activeView === 'matrix' ? (
        <div className="space-y-3">
          {/* Rebalanced Split Grid: 8 Columns for 2x2 Matrix & 4 Columns for Executive Action Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 8 Columns: Hero 2x2 Scatterplot Canvas */}
            <div className="lg:col-span-8 flex flex-col space-y-2.5">
              {/* Preset Quick Case-Study Pins Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-white rounded-xl border border-slate-200/80 px-3 py-2 shadow-2xs">
                <div className="flex items-center space-x-1 text-xs text-slate-600 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Studi Kasus Prioritas:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    onClick={() => {
                      setActiveCasePin('none');
                      setSelectedQuadrant('all');
                      setSelectedDistrict(null);
                    }}
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${
                      activeCasePin === 'none'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Semua (514)
                  </button>
                  <button
                    onClick={() => setActiveCasePin('barito_kuala')}
                    className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                      activeCasePin === 'barito_kuala'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100'
                    }`}
                    title="Kuadran II: Moneter Aman, Sanitasi Kritis (P0 5.1% vs Sanitasi 55.3%)"
                  >
                    Barito Kuala (Q2)
                  </button>
                  <button
                    onClick={() => setActiveCasePin('madura')}
                    className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                      activeCasePin === 'madura'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100'
                    }`}
                    title="Kuadran I: 4 Kab. Madura Terisolasi (P0 15–24%) vs Kota Surabaya (P0 5.2%) Pembanding Suramadu"
                  >
                    Madura (Q1)
                  </button>
                  <button
                    onClick={() => setActiveCasePin('resource_curse')}
                    className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                      activeCasePin === 'resource_curse'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100'
                    }`}
                    title="Anomali PDRB Tambang/Migas Jumbo (≥Rp25T) vs Kemiskinan di Atas Median (29 Daerah, cth: Mimika, Morowali)"
                  >
                    Tambang Jumbo
                  </button>
                </div>
              </div>

              {/* The 2x2 Scatterplot Component */}
              <VulnerabilityMatrix2x2
                districts={allDistricts}
                activeCasePin={activeCasePin}
                activeQuadrantCode={selectedQuadrantCode}
                onSelectDistrict={handleSelectDistrict}
              />

              {/* Compact District Inspector Pill (appears when district is clicked) */}
              {selectedDistrict && (
                <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-okabe-blue shrink-0"></span>
                    <div>
                      <div className="flex items-baseline space-x-1.5">
                        <strong className="text-xs font-bold text-slate-900">
                          {selectedDistrict.tipe_wilayah} {selectedDistrict.kab_kota}
                        </strong>
                        <span className="text-[11px] text-slate-500">({selectedDistrict.provinsi})</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-slate-600 mt-0.5 font-mono">
                        <span>P0: <strong className="text-slate-900">{selectedDistrict.poverty_rate_p0.toFixed(2)}%</strong></span>
                        <span>V_struc: <strong className="text-slate-900">{selectedDistrict.vulnerability_score.toFixed(3)}</strong></span>
                        <span>Sanitasi: <strong className="text-slate-900">{selectedDistrict.sanitation_access_pct.toFixed(1)}%</strong></span>
                        <span>Air: <strong className="text-slate-900">{selectedDistrict.clean_water_access_pct.toFixed(1)}%</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setIsPolicyBriefOpen(true)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-okabe-blue text-white hover:bg-blue-700 shadow-2xs transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Draf Policy Brief</span>
                    </button>
                    <button
                      onClick={() => setSelectedDistrict(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
                      title="Tutup penelusuran daerah"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Columns: Single Unified Executive Policy Action Panel (Zero Box-in-a-Box) */}
            <div className="lg:col-span-4 flex flex-col justify-between bg-white rounded-xl border border-slate-200/80 p-4 shadow-subtle space-y-3.5">
              <div className="space-y-3">
                {/* Quadrant Selector Segmented Tabs */}
                <div className="grid grid-cols-5 gap-1">
                  <button
                    onClick={() => handleSelectQuadrant('ALL')}
                    className={`py-1.5 px-0.5 rounded-lg text-[11px] font-bold text-center transition-all ${
                      selectedQuadrantCode === 'ALL'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Semua
                    <span className="block text-[9.5px] font-normal opacity-80">514</span>
                  </button>
                  {QUADRANTS.map(q => {
                    const stats = q.code === 'Q1' ? quadrantStats.q1 : q.code === 'Q2' ? quadrantStats.q2 : q.code === 'Q3' ? quadrantStats.q3 : quadrantStats.q4;
                    return (
                      <button
                        key={q.code}
                        onClick={() => handleSelectQuadrant(q.code)}
                        className={`py-1.5 px-0.5 rounded-lg text-[11px] font-bold text-center transition-all ${
                          selectedQuadrantCode === q.code
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {q.code}
                        <span className="block text-[9.5px] font-normal opacity-80">{stats.count}</span>
                      </button>
                    );
                  })}
                </div>

                {activePolicy ? (
                  /* Active Quadrant Details (Clean Structured Layout, No Nested Boxes) */
                  <div className="space-y-3">
                    {/* Header: Name and Status */}
                    <div className="border-b border-slate-100 pb-2.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded font-mono text-white" style={{
                          backgroundColor: selectedQuadrantCode === 'Q1' ? '#0072B2' : selectedQuadrantCode === 'Q2' ? '#E69F00' : selectedQuadrantCode === 'Q3' ? '#D55E00' : '#009E73'
                        }}>
                          {activePolicy.code}
                        </span>
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {activePolicy.name}
                        </h3>
                      </div>
                    </div>

                    {/* Subtle Structural Diagnosis Banner (No Redundancy with Fiscal Pillar) */}
                    <div className="border-l-3 border-amber-500 bg-amber-50/50 pl-2.5 pr-2 py-1.5 rounded-r text-[11px] leading-relaxed text-slate-700">
                      <strong className="text-slate-900 block font-semibold">Diagnosis Struktural Utama:</strong>
                      {selectedQuadrantCode === 'Q2' && "Kerentanan Tersembunyi: Kemiskinan konsumsi rendah menyamarkan defisit fasilitas fisik (sanitasi 44.7% belum layak)."}
                      {selectedQuadrantCode === 'Q3' && "Kantong Daya Beli Rendah: Sarana fisik telah memadai, namun kapasitas konsumsi riil dan penyerapan off-taker terbatas."}
                      {selectedQuadrantCode === 'Q1' && "Prioritas Beban Ganda: Kemiskinan konsumsi tinggi beriringan dengan keterbelakangan fasilitas fisik dasar."}
                      {selectedQuadrantCode === 'Q4' && "Wilayah Terbina: Indikator modal manusia dan infrastruktur telah melampaui median nasional."}
                    </div>

                    {/* Structured Policy Pillars */}
                    <div className="space-y-2 text-xs">
                      {/* Pillar 1: Jalur Intervensi Utama */}
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-slate-800 flex items-center space-x-1">
                          <Target className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Jalur Intervensi Pokok:</span>
                        </span>
                        <p className="text-[11.5px] text-slate-600 pl-4.5 leading-relaxed">
                          {activePolicy.primary_policy_track}
                        </p>
                      </div>

                      {/* Pillar 2: Penyelarasan Fiskal Statuter */}
                      <div className="space-y-0.5 pt-1.5 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-800 flex items-center space-x-1">
                          <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                          <span>Penyelarasan Fiskal (UU 1/2022 HKPD):</span>
                        </span>
                        <p className="text-[11.5px] text-slate-600 pl-4.5 leading-relaxed">
                          {activePolicy.fiscal_instruments}
                        </p>
                      </div>

                      {/* Pillar 3: Standar Verifikasi Lapangan */}
                      <div className="space-y-0.5 pt-1.5 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-800 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-okabe-blue" />
                          <span>Syarat Verifikasi Bukti Langsung:</span>
                        </span>
                        <p className="text-[11.5px] text-slate-600 pl-4.5 leading-relaxed">
                          {activePolicy.direct_evidence_required}
                        </p>
                      </div>

                      {/* Lead Agencies Tags */}
                      <div className="pt-1.5 border-t border-slate-100">
                        <span className="text-[10.5px] text-slate-400 block font-medium">OPD Pengampu:</span>
                        <p className="text-[11px] text-slate-700 font-medium mt-0.5">
                          {activePolicy.lead_agencies}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Overview State when 'Semua' is selected */
                  <div className="space-y-2.5 py-1">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Matriks 2x2 memisahkan 514 daerah berdasarkan persilangan garis median nasional: <strong>P0 ({medianP0.toFixed(2)}%)</strong> dan <strong>V_struc ({medianVStruc.toFixed(3)})</strong>.
                    </p>
                    <div className="space-y-1.5 text-xs">
                      {QUADRANTS.map(q => (
                        <div
                          key={q.code}
                          onClick={() => handleSelectQuadrant(q.code)}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer border border-slate-100 transition-all"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: q.color }}></span>
                            <span className="font-bold text-slate-900">{q.code}</span>
                            <span className="text-slate-600 text-[11px]">{q.label.split(':')[1]?.trim()}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">({q.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Direct CTAs at bottom of panel */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <button
                  onClick={() => setIsPolicyBriefOpen(true)}
                  className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-okabe-blue text-white hover:bg-blue-700 shadow-2xs transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{selectedDistrict ? `Buka Draf Brief: ${selectedDistrict.kab_kota}` : "Buka Templat Draf Policy Brief"}</span>
                </button>
                <button
                  onClick={() => setIsPlanningCycleOpen(true)}
                  className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pelajari Siklus Perencanaan RKPD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Width 514 District Screening Grid */
        <DataTable
          districts={displayedDistricts}
          title={
            selectedQuadrantCode === 'ALL'
              ? "Daftar Skrining & Prioritas Intervensi (Semua Daerah)"
              : `Daftar Skrining & Prioritas Intervensi (${selectedQuadrantCode} · ${displayedDistricts.length} Daerah)`
          }
          subtitle="Daftar wilayah siap tindak lanjut. Klik nama daerah untuk memilih, atau klik tombol Draf Brief untuk membuka templat advokasi Bappeda & DPRD."
          defaultSortField="vulnerability_score"
          defaultSortAsc={false}
          onSelectDistrict={handleSelectDistrict}
          selectedDistrictKey={selectedDistrict ? `${selectedDistrict.provinsi}-${selectedDistrict.kab_kota}` : undefined}
          onActionClick={(d) => {
            setSelectedDistrict(d);
            setIsPolicyBriefOpen(true);
          }}
          actionLabel="Draf Brief →"
        />
      )}

      {/* Policy Brief Modal Dialog */}
      <PolicyBriefModal
        district={selectedDistrict}
        policy={selectedDistrictPolicy}
        isOpen={isPolicyBriefOpen}
        onClose={() => setIsPolicyBriefOpen(false)}
      />

      {/* Statutory 10-Step Planning Cycle Guide Modal */}
      <PlanningCycleModal
        isOpen={isPlanningCycleOpen}
        onClose={() => setIsPlanningCycleOpen(false)}
      />
    </motion.div>
  );
};

export default PriorityImplications;
