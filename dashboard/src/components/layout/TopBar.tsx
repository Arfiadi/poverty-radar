import React, { useEffect, useRef } from 'react';
import { RotateCcw, Search, Sparkles } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';
import { ACT_NAV_ITEMS } from './Sidebar';

interface TopBarProps {
  totalDistricts: number;
  filteredCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({ totalDistricts, filteredCount }) => {
  const { 
    activeAct, 
    searchQuery, 
    setSearchQuery, 
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
    <header className="h-16 min-h-[64px] bg-surface/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Active Page Header Title */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-sm font-bold text-ink-primary tracking-tight">
            {currentItem.label} <span className="text-slate-600 font-medium">| {currentItem.sub}</span>
          </h1>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
              {filteredCount} dari {totalDistricts} Daerah Terpilih
            </span>
            {activeCasePin !== 'none' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                <Sparkles className="w-2.5 h-2.5 mr-1 text-amber-600" />
                Pin: {activeCasePin === 'resource_curse' ? 'Kutukan Tambang' : 'Disparitas Madura'}
                <button 
                  onClick={() => setActiveCasePin('none')}
                  className="ml-1.5 hover:text-amber-950 font-bold"
                  title="Matikan Pin"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Global Actions: Search Bar & Reset Filters */}
      <div className="flex items-center space-x-3">
        {/* Instant Tolerant Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Kab / Kota (tekan '/')"
            className="w-56 pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-ink-primary placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-okabe-blue focus:ring-1 focus:ring-okabe-blue transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-ink-primary"
            >
              ×
            </button>
          )}
        </div>

        {/* Explicit Reset Filters Button */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 transition-colors shadow-2xs"
            title="Kembalikan semua filter ke kondisi standar (Esc)"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </header>
  );
};
