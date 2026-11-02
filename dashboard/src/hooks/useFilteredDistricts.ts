import { useMemo } from 'react';
import { District } from '../types';
import { useFilterStore } from '../store/useFilterStore';

export const useFilteredDistricts = (districts: District[]): District[] => {
  const {
    selectedIsland,
    selectedProvince,
    selectedCluster,
    selectedQuadrant,
    searchQuery,
    p0Range,
    activeCasePin,
  } = useFilterStore();

  return useMemo(() => {
    if (!districts || districts.length === 0) return [];

    return districts.filter((d) => {
      // 1. Case Study Pin Filter (Takes highest contextual priority if active)
      if (activeCasePin === 'resource_curse') {
        const isResourceCurse = d.grdp_constant_million_idr >= 25_000_000 && d.poverty_rate_p0 >= 10.46;
        if (!isResourceCurse) return false;
      } else if (activeCasePin === 'madura') {
        const maduraKab = ['Bangkalan', 'Sampang', 'Pamekasan', 'Sumenep', 'Kota Surabaya'];
        const isMaduraTarget = maduraKab.some(name => d.kab_kota.toLowerCase().includes(name.toLowerCase()));
        if (!isMaduraTarget) return false;
      }

      // 2. Island Filter
      if (selectedIsland !== 'Semua Wilayah' && d.region_pulau !== selectedIsland) {
        return false;
      }

      // 3. Province Filter
      if (selectedProvince !== 'Semua Provinsi' && d.provinsi !== selectedProvince) {
        return false;
      }

      // 4. Cluster Filter
      if (selectedCluster !== 'all' && d.cluster_id !== selectedCluster) {
        return false;
      }

      // 5. Quadrant Filter
      if (selectedQuadrant !== 'all' && d.vulnerability_quadrant !== selectedQuadrant) {
        return false;
      }

      // 6. P0 Range
      if (d.poverty_rate_p0 < p0Range[0] || d.poverty_rate_p0 > p0Range[1]) {
        return false;
      }

      // 7. Search Query (Tolerant & case-insensitive)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${d.tipe_wilayah} ${d.kab_kota}`.toLowerCase();
        const provName = d.provinsi.toLowerCase();
        if (!fullName.includes(q) && !provName.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [
    districts,
    selectedIsland,
    selectedProvince,
    selectedCluster,
    selectedQuadrant,
    searchQuery,
    p0Range,
    activeCasePin,
  ]);
};
