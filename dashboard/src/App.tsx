import React, { Suspense, lazy } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import { useFilteredDistricts } from './hooks/useFilteredDistricts';
import { useFilterStore } from './store/useFilterStore';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { SkeletonCard, EmptyResultState, SmallSampleWarning } from './components/common/DefensiveStates';

// Dynamic code-splitting with React.lazy
const PovertyLandscape = lazy(() => import('./pages/01_PovertyLandscape'));
const IndicatorMap = lazy(() => import('./pages/02_IndicatorMap'));
const RegionalProfiles = lazy(() => import('./pages/03_RegionalProfiles'));
const PriorityImplications = lazy(() => import('./pages/04_PriorityImplications'));
const MethodologyAudit = lazy(() => import('./pages/05_MethodologyAudit'));

const PageLoadingFallback: React.FC = () => (
  <div className="space-y-6">
    <SkeletonCard height="h-24" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SkeletonCard height="h-32" />
      <SkeletonCard height="h-32" />
      <SkeletonCard height="h-32" />
    </div>
    <SkeletonCard height="h-96" />
  </div>
);

export const App: React.FC = () => {
  const { districts, clusterSummary, policyMatrix, olsResults, benchmarks, boundaryCases, loading, error } = useDashboardData();
  const { activeAct, isSidebarCollapsed } = useFilterStore();
  const filteredDistricts = useFilteredDistricts(districts);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-canvas">
        <div className={`${isSidebarCollapsed ? 'w-[56px] min-w-[56px] max-w-[56px]' : 'w-[180px] min-w-[180px] max-w-[180px]'} bg-surface border-r border-slate-200/80 p-4 hidden md:block transition-all duration-300`}>
          <SkeletonCard height="h-64" />
        </div>
        <div className="flex-1 p-8 space-y-6">
          <SkeletonCard height="h-20" />
          <div className="grid grid-cols-3 gap-4">
            <SkeletonCard height="h-32" />
            <SkeletonCard height="h-32" />
            <SkeletonCard height="h-32" />
          </div>
          <SkeletonCard height="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas p-6">
        <div className="bg-surface border border-red-200 p-6 rounded-xl max-w-md w-full text-center space-y-3">
          <div className="text-red-500 font-bold text-lg">Gagal Memuat Data</div>
          <p className="text-sm text-slate-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  const renderActiveAct = () => {
    if (filteredDistricts.length === 0) {
      return <EmptyResultState />;
    }

    let pageComponent;
    switch (activeAct) {
      case 0:
        pageComponent = <PovertyLandscape districts={filteredDistricts} benchmarks={benchmarks} />;
        break;
      case 1:
        pageComponent = <IndicatorMap districts={filteredDistricts} allDistricts={districts} />;
        break;
      case 2:
        pageComponent = (
          <RegionalProfiles
            districts={filteredDistricts}
            allDistricts={districts}
            clusterSummary={clusterSummary}
          />
        );
        break;
      case 3:
        pageComponent = (
          <PriorityImplications 
            districts={filteredDistricts} 
            allDistricts={districts}
            policyMatrix={policyMatrix} 
          />
        );
        break;
      case 4:
        pageComponent = (
          <MethodologyAudit
            districts={districts}
            filteredDistricts={filteredDistricts}
            olsResults={olsResults}
            boundaryCases={boundaryCases}
          />
        );
        break;
      default:
        pageComponent = <PovertyLandscape districts={filteredDistricts} benchmarks={benchmarks} />;
    }

    return (
      <Suspense fallback={<PageLoadingFallback />}>
        {pageComponent}
      </Suspense>
    );
  };

  return (
    <div className="flex min-h-screen bg-canvas text-ink-primary">
      {/* Sticky Left Sidebar (180px) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar totalDistricts={districts.length} filteredCount={filteredDistricts.length} />

        <main className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 max-w-[1600px] w-full mx-auto space-y-3">
          <SmallSampleWarning count={filteredDistricts.length} />
          {renderActiveAct()}
        </main>

        {/* Global Footer */}
        <footer className="py-6 px-8 border-t border-slate-200/80 bg-surface/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">PovertyRadar SDGs</span>
            <span>·</span>
            <span>Sistem Klastering &amp; Skrining Kerentanan Relatif Daerah</span>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Sumber Data: BPS Susenas &amp; Sakernas 2021
          </div>
        </footer>
      </div>
    </div>
  );
};
