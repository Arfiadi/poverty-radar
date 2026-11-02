import { useState, useEffect } from 'react';
import { District, ClusterSummary, PolicyRecommendation, OLSResult, NationalBenchmarks, BoundaryCase } from '../types';

interface DashboardDataState {
  districts: District[];
  clusterSummary: ClusterSummary[];
  policyMatrix: PolicyRecommendation[];
  olsResults: OLSResult[];
  benchmarks: NationalBenchmarks | null;
  boundaryCases: BoundaryCase[];
  loading: boolean;
  error: string | null;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardDataState>({
    districts: [],
    clusterSummary: [],
    policyMatrix: [],
    olsResults: [],
    benchmarks: null,
    boundaryCases: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [
          districtsRes,
          clusterSummaryRes,
          policyMatrixRes,
          olsRes,
          benchmarksRes,
          boundaryRes,
        ] = await Promise.all([
          fetch('/data/poverty_districts.json'),
          fetch('/data/cluster_summary.json'),
          fetch('/data/policy_matrix.json'),
          fetch('/data/ols_coefficients.json'),
          fetch('/data/national_benchmarks.json'),
          fetch('/data/boundary_cases.json'),
        ]);

        if (!districtsRes.ok) throw new Error('Gagal memuat poverty_districts.json');

        const [
          districts,
          clusterSummary,
          policyMatrix,
          olsResults,
          benchmarks,
          boundaryCases,
        ] = await Promise.all([
          districtsRes.json(),
          clusterSummaryRes.json(),
          policyMatrixRes.json(),
          olsRes.json(),
          benchmarksRes.json(),
          boundaryRes.json(),
        ]);

        setData({
          districts,
          clusterSummary,
          policyMatrix,
          olsResults,
          benchmarks,
          boundaryCases,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
        setData(prev => ({ ...prev, loading: false, error: err.message || 'Gagal memuat data' }));
      }
    };

    loadAll();
  }, []);

  return data;
};
