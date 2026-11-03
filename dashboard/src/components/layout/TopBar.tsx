import React, { useEffect, useRef } from 'react';
import { RotateCcw, Search, Sparkles, Filter } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';
import { ACT_NAV_ITEMS } from './Sidebar';
import { ISLAND_REGIONS, CLUSTERS, QUADRANTS } from '../../constants/benchmarks';

interface TopBarProps {
  totalDistricts: number;
  filteredCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({ totalDistricts, filteredCount }) => {
  const { 
    activeAct, 
    searchQuery, 
    setSearchQuery, 
    selectedIsland,
    setSelectedIsland,
    selectedCluster,
    setSelectedCluster,
    selectedQuadrant,
    setSelectedQuadrant,
    resetFilters, 
    hasActiveFilters,
    activeCasePin,
    setActiveCasePin
  } = useFilterStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentItem = ACT_NAV_ITEMS[activeAct] || ACT_NAV_ITEMS[0];
  const isFiltered = hasActiveFilters();

  // Keyboard shortcuts: '/' to focus search, 'Escape' to reset filters
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur();
        } else if (isFiltered) {
          resetFilters();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFiltered, resetFilters]);

  return (
    <header className="h-[52px] bg-surface/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-5 flex items-center justify-between gap-3 select-none">
      {/* Left: Current Act Title & Scope Count */}
      <div className="flex items-center space-x-2.5 min-w-0 shrink-0">
        <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight truncate">
          {currentItem.label}
        </h1>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 shrink-0 border border-slate-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
          {filteredCount} / {totalDistricts} Daerah
        </span>
        {activeCasePin !== 'none' && (
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
            <Sparkles className="w-2.5 h-2.5 mr-1 text-amber-600" />
            Pin: {activeCasePin === 'resource_curse' ? 'Tambang' : 'Madura'}
            <button 
              onClick={() => setActiveCasePin('none')}
              className="ml-1 hover:text-amber-950 font-bold"
              title="Matikan Pin"
            >
              ×
            </button>
          </span>
        )}
      </div>

      {/* Center: Compact Global Filter Dropdowns */}
      <div className="hidden lg:flex items-center space-x-2 shrink-0">
        <div className="flex items-center space-x-1 text-slate-400 mr-0.5">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
        </div>

        {/* 1. Island Filter */}
        <select
          value={selectedIsland}
          onChange={(e) => setSelectedIsland(e.target.value)}
          aria-label="Filter Pulau"
          className={`px-2 py-1 text-xs rounded-lg font-medium transition-all focus:outline-hidden ${
            selectedIsland !== 'Semua Wilayah'
              ? 'bg-blue-50 border border-okabe-blue text-okabe-blue font-semibold ring-1 ring-okabe-blue/20'
              : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {ISLAND_REGIONS.map((island) => (
            <option key={island} value={island}>
              {island === 'Semua Wilayah' ? 'Semua Pulau' : island}
            </option>
          ))}
        </select>

        {/* 2. Cluster Filter */}
        <select
          value={selectedCluster === 'all' ? 'all' : selectedCluster.toString()}
          onChange={(e) => setSelectedCluster(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          aria-label="Filter Klaster"
          className={`px-2 py-1 text-xs rounded-lg font-medium transition-all focus:outline-hidden ${
            selectedCluster !== 'all'
              ? 'bg-blue-50 border border-okabe-blue text-okabe-blue font-semibold ring-1 ring-okabe-blue/20'
              : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <option value="all">Semua Klaster</option>
          {CLUSTERS.map((c) => (
            <option key={c.id} value={c.id.toString()}>
              Klaster {c.id + 1} ({c.shortName})
            </option>
          ))}
        </select>

        {/* 3. Quadrant Filter */}
        <select
          value={selectedQuadrant}
          onChange={(e) => setSelectedQuadrant(e.target.value)}
          aria-label="Filter Kuadran"
          className={`px-2 py-1 text-xs rounded-lg font-medium transition-all focus:outline-hidden ${
            selectedQuadrant !== 'all'
              ? 'bg-blue-50 border border-okabe-blue text-okabe-blue font-semibold ring-1 ring-okabe-blue/20'
              : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <option value="all">Semua Kuadran</option>
          {QUADRANTS.map((q) => (
            <option key={q.id} value={q.id}>
              {q.code} · {q.label.split(':')[1]?.trim() || q.label}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Quick Search Box & Reset Action */}
      <div className="flex items-center space-x-2 shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari daerah ('/')"
            className="w-36 sm:w-44 lg:w-48 pl-7.5 pr-6 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-ink-primary placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-okabe-blue focus:ring-1 focus:ring-okabe-blue transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-ink-primary font-bold"
              title="Hapus pencarian"
            >
              ×
            </button>
          )}
        </div>

        {/* Reset Filter Action */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors shadow-2xs shrink-0"
            title="Kembalikan semua filter ke kondisi awal (Esc)"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </header>
  );
};
