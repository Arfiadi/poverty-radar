import React, { useState, useEffect, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { District } from '../../types';
import { ClusterBadge, QuadrantBadge } from '../common/Badge';
import { formatPercent, formatYears, formatCurrencyMillion } from '../../utils/formatters';
import { MapPin, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface IndonesiaMapProps {
  districts: District[];
  indicator: keyof District;
  indicatorLabel: string;
  unit: string;
}

interface ProvinceStats {
  provinceName: string;
  avgValue: number;
  minValue: number;
  maxValue: number;
  minDistrict: string;
  maxDistrict: string;
  kabCount: number;
  kotaCount: number;
  totalCount: number;
  dominantCluster: number;
  districts: District[];
}

export const IndonesiaChoroplethMap: React.FC<IndonesiaMapProps> = ({
  districts,
  indicator,
  indicatorLabel,
  unit,
}) => {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  // Load GeoJSON and register with ECharts once
  useEffect(() => {
    // Check if already registered
    if (echarts.getMap('indonesia')) {
      setMapLoaded(true);
      return;
    }

    fetch('/data/indonesia-provinces.geojson')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(geoJson => {
        echarts.registerMap('indonesia', geoJson);
        setMapLoaded(true);
      })
      .catch(err => {
        console.error('Gagal memuat peta GeoJSON Indonesia:', err);
        setLoadError(true);
      });
  }, []);

  // Compute stats per province
  const provinceStatsMap = useMemo(() => {
    const map = new Map<string, District[]>();
    districts.forEach(d => {
      const list = map.get(d.provinsi) || [];
      list.push(d);
      map.set(d.provinsi, list);
    });

    const stats: Record<string, ProvinceStats> = {};
    map.forEach((distList, prov) => {
      const vals = distList.map(d => ({ val: d[indicator] as number, name: d.kab_kota }))
        .filter(item => typeof item.val === 'number' && !isNaN(item.val));

      if (vals.length === 0) return;

      const sum = vals.reduce((acc, curr) => acc + curr.val, 0);
      const avg = sum / vals.length;

      let min = vals[0];
      let max = vals[0];
      vals.forEach(v => {
        if (v.val < min.val) min = v;
        if (v.val > max.val) max = v;
      });

      const kabCount = distList.filter(d => d.tipe_wilayah === 'Kabupaten').length;
      const kotaCount = distList.filter(d => d.tipe_wilayah === 'Kota').length;

      // Dominant cluster
      const clusterCounts: Record<number, number> = {};
      distList.forEach(d => {
        clusterCounts[d.cluster_id] = (clusterCounts[d.cluster_id] || 0) + 1;
      });
      let dominantClust = 0;
      let maxCount = -1;
      Object.entries(clusterCounts).forEach(([cid, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantClust = Number(cid);
        }
      });

      stats[prov] = {
        provinceName: prov,
        avgValue: Number(avg.toFixed(2)),
        minValue: Number(min.val.toFixed(2)),
        maxValue: Number(max.val.toFixed(2)),
        minDistrict: min.name,
        maxDistrict: max.name,
        kabCount,
        kotaCount,
        totalCount: distList.length,
        dominantCluster: dominantClust,
        districts: distList.sort((a, b) => (Number(b[indicator]) || 0) - (Number(a[indicator]) || 0))
      };
    });

    return stats;
  }, [districts, indicator]);

  // Min and Max for color scale
  const { minRange, maxRange, isNegativeMetric } = useMemo(() => {
    const avgs = Object.values(provinceStatsMap).map(s => s.avgValue);
    if (avgs.length === 0) return { minRange: 0, maxRange: 100, isNegativeMetric: false };

    const min = Math.min(...avgs);
    const max = Math.max(...avgs);

    // Negative metric (e.g. poverty, unemployment) where high values are bad
    const isNegative = indicator === 'poverty_rate_p0' || indicator === 'unemployment_rate_tpt';

    return {
      minRange: Math.floor(min),
      maxRange: Math.ceil(max),
      isNegativeMetric: isNegative
    };
  }, [provinceStatsMap, indicator]);

  const activeProvinceDetail = selectedProvince ? provinceStatsMap[selectedProvince] : null;

  // ECharts Option
  const option = useMemo(() => {
    const data = Object.values(provinceStatsMap).map(s => ({
      name: s.provinceName,
      value: s.avgValue,
      minValue: s.minValue,
      maxValue: s.maxValue,
      minDistrict: s.minDistrict,
      maxDistrict: s.maxDistrict,
      kabCount: s.kabCount,
      kotaCount: s.kotaCount,
      totalCount: s.totalCount,
      dominantCluster: s.dominantCluster
    }));

    // Color gradient based on metric type
    // If negative metric: Low = Blue (#0072B2), High = Vermillion (#D55E00)
    // If positive metric: Low = Vermillion (#D55E00), High = Blue (#0072B2)
    const colorScale = isNegativeMetric
      ? ['#0072B2', '#56B4E9', '#F0E442', '#E69F00', '#D55E00']
      : ['#D55E00', '#E69F00', '#F0E442', '#56B4E9', '#0072B2'];

    return {
      backgroundColor: 'transparent',
      title: {
        text: `Peta Spasial Indonesia: Distribusi ${indicatorLabel} per Provinsi`,
        subtext: `Klik pada poligon provinsi untuk memeriksa disparitas internal ${unit ? `(${unit})` : ''}`,
        left: 'left',
        top: 0,
        textStyle: { fontSize: 14, fontWeight: 'bold', color: '#0F172A' },
        subtextStyle: { fontSize: 11, color: '#64748B' }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: '#FFFFFF',
        borderColor: '#CBD5E1',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: { color: '#0F172A', fontSize: 12 },
        formatter: (params: any) => {
          if (!params.data) return params.name;
          const d = params.data;
          return `
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px;">
              <div style="font-size: 13px; font-weight: 700; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 6px;">
                ${d.name}
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #64748B;">Rata-rata:</span>
                <span style="font-weight: 700; color: #0284C7; font-family: 'JetBrains Mono', monospace;">${d.value}${unit}</span>
              </div>
              <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
                Disparitas Internal:
                <br/>• Terendah: <b>${d.minDistrict}</b> (${d.minValue}${unit})
                <br/>• Tertinggi: <b>${d.maxDistrict}</b> (${d.maxValue}${unit})
              </div>
              <div style="font-size: 11px; color: #64748B; border-top: 1px dashed #E2E8F0; padding-top: 4px; margin-top: 4px;">
                Cakupan: ${d.kabCount} Kabupaten, ${d.kotaCount} Kota
              </div>
              <div style="font-size: 10px; color: #94A3B8; font-style: italic; margin-top: 4px;">
                💡 Klik untuk membuka rincian daerah
              </div>
            </div>
          `;
        }
      },
      visualMap: {
        min: minRange,
        max: maxRange,
        text: ['Tinggi', 'Rendah'],
        realtime: true,
        calculable: true,
        orient: 'horizontal',
        left: 'right',
        bottom: 10,
        inRange: {
          color: colorScale
        },
        textStyle: {
          fontSize: 10,
          color: '#64748B'
        }
      },
      series: [
        {
          name: indicatorLabel,
          type: 'map',
          map: 'indonesia',
          roam: true,
          zoom: 1.18,
          center: [118, -2.5],
          aspectScale: 0.9,
          emphasis: {
            label: {
              show: true,
              fontSize: 10,
              fontWeight: 'bold',
              color: '#0F172A'
            },
            itemStyle: {
              areaColor: '#FDE047',
              borderColor: '#0F172A',
              borderWidth: 1.5,
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.15)'
            }
          },
          select: {
            label: { show: true, color: '#0F172A', fontWeight: 'bold' },
            itemStyle: {
              areaColor: '#FBBF24',
              borderColor: '#0284C7',
              borderWidth: 2
            }
          },
          itemStyle: {
            borderColor: '#94A3B8',
            borderWidth: 0.8,
            areaColor: '#E2E8F0'
          },
          data: data
        }
      ]
    };
  }, [provinceStatsMap, indicatorLabel, unit, isNegativeMetric, minRange, maxRange]);

  const onChartClick = (params: any) => {
    if (params.name) {
      setSelectedProvince(params.name);
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Container Card */}
      <div className="bg-surface rounded-2xl border border-slate-200/80 p-5 shadow-subtle relative">
        {/* Helper Instructions Pill */}
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-okabe-blue" />
            <span>Peta Poligon 34 Provinsi Indonesia · Navigasi: Scroll untuk Zoom, Drag untuk Geser</span>
          </div>
          {selectedProvince && (
            <button
              onClick={() => setSelectedProvince(null)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Pilihan Provinsi</span>
            </button>
          )}
        </div>

        {/* ECharts Map Display */}
        {mapLoaded ? (
          <div className="h-[440px] w-full">
            <ReactECharts
              option={option}
              style={{ height: '100%', width: '100%' }}
              onEvents={{ click: onChartClick }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        ) : loadError ? (
          <div className="h-[360px] flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <div className="text-center p-6 text-slate-500 text-xs">
              <Info className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Peta Poligon GeoJSON Tidak Dapat Dimuat</p>
              <p className="mt-1">Gunakan tab "Peringkat Batang 34 Provinsi" di atas sebagai representasi spasial alternatif.</p>
            </div>
          </div>
        ) : (
          <div className="h-[440px] flex items-center justify-center bg-slate-50 rounded-xl animate-pulse">
            <span className="text-xs font-semibold text-slate-500">Memuat Poligon Peta Geospasial Indonesia...</span>
          </div>
        )}
      </div>

      {/* Selected Province Inspector Drawer / Detail Box */}
      {activeProvinceDetail && (
        <div className="bg-white rounded-2xl border-2 border-okabe-blue/30 p-5 shadow-md transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-okabe-blue">
                Inspektur Disparitas Wilayah
              </div>
              <h3 className="text-lg font-extrabold text-ink-primary">
                PROVINSI {activeProvinceDetail.provinceName}
              </h3>
              <p className="text-xs text-slate-500">
                Total {activeProvinceDetail.totalCount} Daerah ({activeProvinceDetail.kabCount} Kabupaten, {activeProvinceDetail.kotaCount} Kota)
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xs text-slate-500">Rata-Rata {indicatorLabel}</div>
                <div className="text-xl font-black text-okabe-blue font-mono">
                  {activeProvinceDetail.avgValue}{unit}
                </div>
              </div>
              <button
                onClick={() => setSelectedProvince(null)}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 border border-slate-200 rounded"
              >
                ✕ Tutup
              </button>
            </div>
          </div>

          {/* District List Grid */}
          <div className="text-xs font-semibold text-slate-700 mb-2">
            Sebaran Kabupaten/Kota di {activeProvinceDetail.provinceName} (Diurutkan Tertinggi ke Terendah):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1">
            {activeProvinceDetail.districts.map(d => (
              <div
                key={d.kab_kota}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-okabe-blue/50 transition flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <span className="font-bold text-slate-800 truncate text-xs">{d.kab_kota}</span>
                  <span className="text-xs text-slate-500 shrink-0 font-medium">{d.tipe_wilayah}</span>
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs text-slate-500">{indicatorLabel}:</span>
                  <span className="font-mono font-bold text-xs text-ink-primary">
                    {Number(d[indicator])?.toFixed(2)}{unit}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                  <ClusterBadge clusterId={d.cluster_id} />
                  <QuadrantBadge quadrantName={d.vulnerability_quadrant} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
