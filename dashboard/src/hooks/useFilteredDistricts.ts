import { useMemo } from 'react';
import { District } from '../types';
import { useFilterStore } from '../store/useFilterStore';

export const useFilteredDistricts = (districts: District[]): District[] => {
  const {
    selectedIsland,
    selectedProvince,
    searchQuery,
    p0Range,
  } = useFilterStore();

  return useMemo(() => {
    if (!districts || districts.length === 0) return [];

    return districts.filter((d) => {
      // 1. Island Filter (Geographic Scope)
      if (selectedIsland !== 'Semua Wilayah' && d.region_pulau !== selectedIsland) {
        return false;
      }

      // 2. Province Filter
      if (selectedProvince !== 'Semua Provinsi' && d.provinsi !== selectedProvince) {
        return false;
      }

      // 3. P0 Range
      if (d.poverty_rate_p0 < p0Range[0] || d.poverty_rate_p0 > p0Range[1]) {
        return false;
      }

      // 4. Search Query (Tolerant & case-insensitive)
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
    searchQuery,
    p0Range,
  ]);
};
