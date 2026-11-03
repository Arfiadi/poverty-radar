import React from 'react';
import { Filter, RotateCcw, X } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';
import { ISLAND_REGIONS, CLUSTERS, QUADRANTS } from '../../constants/benchmarks';
import { CLUSTER_COLORS } from '../../constants/okabeItoPalette';

export const GlobalFilterBar: React.FC = () => {
  const {
    selectedIsland,
    setSelectedIsland,
    selectedCluster,
    setSelectedCluster,
    selectedQuadrant,
    setSelectedQuadrant,
    searchQuery,
    setSearchQuery,
    activeCasePin,
    setActiveCasePin,
    resetFilters,
    hasActiveFilters,
  } = useFilterStore();

  const isFiltered = hasActiveFilters();

  const activeClusterObj = selectedCluster !== 'all' ? CLUSTERS.find(c => c.id === selectedCluster) : null;
  const activeQuadrantObj = selectedQuadrant !== 'all' ? QUADRANTS.find(q => q.id === selectedQuadrant) : null;

  return (
    <div className="bg-surface/90 backdrop-blur-xs border-b border-slate-200/80 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs transition-all">
      {/* Left: Dropdown Selectors */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-1.5 text-slate-400 font-medium">
          <Filter className="w-3.5 h-3.5 text-okabe-blue" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Filter Global:</span>
        </div>

        {/* 1. Island Dropdown */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="filter-island" className="text-[11px] font-semibold text-slate-500">Pulau:</label>
          <select
            id="filter-island"
            value={selectedIsland}
            onChange={(e) => setSelectedIsland(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-ink-primary font-medium focus:outline-hidden focus:bg-white focus:border-okabe-blue focus:ring-1 focus:ring-okabe-blue transition-all"
          >
            {ISLAND_REGIONS.map((island) => (
              <option key={island} value={island}>
                {island}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Cluster Dropdown */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="filter-cluster" className="text-[11px] font-semibold text-slate-500">Klaster:</label>
          <select
            id="filter-cluster"
            value={selectedCluster === 'all' ? 'all' : selectedCluster.toString()}
            onChange={(e) => setSelectedCluster(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-ink-primary font-medium focus:outline-hidden focus:bg-white focus:border-okabe-blue focus:ring-1 focus:ring-okabe-blue transition-all"
          >
            <option value="all">Semua Klaster</option>
            {CLUSTERS.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                Klaster {c.id + 1} ({c.shortName})
              </option>
            ))}
          </select>
        </div>

        {/* 3. Quadrant Dropdown */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="filter-quadrant" className="text-[11px] font-semibold text-slate-500">Kuadran:</label>
          <select
            id="filter-quadrant"
            value={selectedQuadrant}
            onChange={(e) => setSelectedQuadrant(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-ink-primary font-medium focus:outline-hidden focus:bg-white focus:border-okabe-blue focus:ring-1 focus:ring-okabe-blue transition-all"
          >
            <option value="all">Semua Kuadran</option>
            {QUADRANTS.map((q) => (
              <option key={q.id} value={q.id}>
                {q.code} · {q.label.split(':')[1]?.trim() || q.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Active Filter Badges & Reset Button */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Active Island Badge */}
        {selectedIsland !== 'Semua Wilayah' && (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-okabe-blue border border-blue-200">
            <span>Pulau: {selectedIsland}</span>
            <button
              onClick={() => setSelectedIsland('Semua Wilayah')}
              className="hover:text-blue-900 rounded-full p-0.5 focus:outline-hidden"
              title="Hapus filter pulau"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Active Cluster Badge */}
        {activeClusterObj && (
          <span
            className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
            style={{
              backgroundColor: `${CLUSTER_COLORS[activeClusterObj.id]}15`,
              color: CLUSTER_COLORS[activeClusterObj.id],
              borderColor: `${CLUSTER_COLORS[activeClusterObj.id]}40`
            }}
          >
            <span>Klaster {activeClusterObj.id + 1}: {activeClusterObj.shortName}</span>
            <button
              onClick={() => setSelectedCluster('all')}
              className="rounded-full p-0.5 focus:outline-hidden hover:opacity-75"
              title="Hapus filter klaster"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Active Quadrant Badge */}
        {activeQuadrantObj && (
          <span
            className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
            style={{
              backgroundColor: activeQuadrantObj.bgTint,
              color: activeQuadrantObj.color,
              borderColor: `${activeQuadrantObj.color}40`
            }}
          >
            <span>{activeQuadrantObj.code}</span>
            <button
              onClick={() => setSelectedQuadrant('all')}
              className="rounded-full p-0.5 focus:outline-hidden hover:opacity-75"
              title="Hapus filter kuadran"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Active Search Query Badge */}
        {searchQuery.trim() !== '' && (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span>Pencarian: &ldquo;{searchQuery}&rdquo;</span>
            <button
              onClick={() => setSearchQuery('')}
              className="hover:text-slate-900 rounded-full p-0.5 focus:outline-hidden"
              title="Hapus pencarian"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Active Case Pin Badge */}
        {activeCasePin !== 'none' && (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span>Pin: {activeCasePin === 'resource_curse' ? 'Kutukan Tambang' : 'Disparitas Madura'}</span>
            <button
              onClick={() => setActiveCasePin('none')}
              className="hover:text-amber-950 rounded-full p-0.5 focus:outline-hidden"
              title="Matikan pin studi kasus"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Explicit Reset Button when any filter is active */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors shadow-2xs"
            title="Kembalikan semua filter ke kondisi awal (Esc)"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reset Semua Filter</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default GlobalFilterBar;
