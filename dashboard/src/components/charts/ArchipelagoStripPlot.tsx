import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { District } from '../../types';
import { CLUSTER_COLORS } from '../../constants/okabeItoPalette';

interface StripPlotProps {
  districts: District[];
  onSelectDistrict?: (district: District) => void;
}

interface IslandStat {
  name: string;
  count: number;
  median: number;
  min: number;
  max: number;
  p25: number;
  p75: number;
}

export const ArchipelagoStripPlot: React.FC<StripPlotProps> = ({ districts }) => {
  // 'combined' = Clean Dot Runway + Range Whisker + Median
  // 'summary'  = Pure Knaflic Range Bar & Median Whisker (Zero Clutter)
  const [viewMode, setViewMode] = useState<'combined' | 'summary'>('combined');

  // Compute stats and rank islands descending by median poverty
  const islandStats = useMemo<IslandStat[]>(() => {
    const rawIslands = [
      "Maluku & Papua",
      "Bali & Nusa Tenggara",
      "Sulawesi",
      "Jawa",
      "Sumatera",
      "Kalimantan"
    ];

    return rawIslands.map(name => {
      const p0List = districts
        .filter(d => d.region_pulau === name)
        .map(d => d.poverty_rate_p0)
        .sort((a, b) => a - b);

      if (p0List.length === 0) {
        return { name, count: 0, median: 0, min: 0, max: 0, p25: 0, p75: 0 };
      }

      const n = p0List.length;
      const mid = Math.floor(n / 2);
      const median = n % 2 !== 0 ? p0List[mid] : (p0List[mid - 1] + p0List[mid]) / 2;
      const p25 = p0List[Math.floor(n * 0.25)];
      const p75 = p0List[Math.floor(n * 0.75)];

      return {
        name,
        count: n,
        median,
        min: p0List[0],
        max: p0List[n - 1],
        p25,
        p75
      };
    }).sort((a, b) => b.median - a.median); // Highest median on top
  }, [districts]);

  // Ranked island names (from index 0 at top to bottom)
  // For ECharts category Y-axis: bottom-to-top, so reverse for display
  const yAxisCategories = useMemo(() => {
    return [...islandStats].reverse().map(s => s.name);
  }, [islandStats]);

  const statsMap = useMemo(() => {
    const map = new Map<string, IslandStat>();
    islandStats.forEach(s => map.set(s.name, s));
    return map;
  }, [islandStats]);

  const option = useMemo(() => {
    const nIslands = yAxisCategories.length;
    const nationalMedian = 10.46;

    // 1. Min-Max Range Lines for each island track
    const rangeLinesData: any[] = [];
    // 2. IQR (P25 - P75) Core Box Lines
    const iqrLinesData: any[] = [];
    // 3. Median Markers
    const medianPointsData: any[] = [];

    yAxisCategories.forEach((islName, yIdx) => {
      const stat = statsMap.get(islName);
      if (!stat || stat.count === 0) return;

      // Min-Max whisker line
      rangeLinesData.push([
        { coord: [stat.min, yIdx] },
        { coord: [stat.max, yIdx] }
      ]);

      // IQR Core band
      iqrLinesData.push([
        { coord: [stat.p25, yIdx] },
        { coord: [stat.p75, yIdx] }
      ]);

      // Median Marker
      const isExtreme = stat.median >= 20.0;
      medianPointsData.push({
        name: stat.name,
        value: [stat.median, yIdx],
        stat,
        itemStyle: {
          color: isExtreme ? '#D55E00' : '#0F172A',
          borderColor: '#FFFFFF',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'top',
          distance: 6,
          formatter: `${stat.median.toFixed(1)}%`,
          fontSize: 11,
          fontWeight: 'bold',
          color: isExtreme ? '#D55E00' : '#1E293B',
        }
      });
    });

    // 4. Clamped District Scatter Points (Strictly within row bounds, max jitter +-0.12)
    const scatterPointsData = districts.map((d, i) => {
      const yIdx = yAxisCategories.indexOf(d.region_pulau);
      if (yIdx === -1) return null;

      // Clamped deterministic pseudo-jitter strictly within [-0.12, +0.12]
      // Row gap is 1.0, so this leaves 0.76 of clear margin between rows!
      const pseudoJitter = ((Math.sin(i * 12.9898 + d.poverty_rate_p0) * 43758.5453) % 1) * 0.24 - 0.12;

      return {
        name: d.kab_kota,
        value: [d.poverty_rate_p0, yIdx + pseudoJitter],
        rawDistrict: d,
        itemStyle: {
          color: CLUSTER_COLORS[d.cluster_id] || '#0072B2',
          opacity: 0.65,
          borderColor: '#FFFFFF',
          borderWidth: 0.5,
        },
        symbolSize: 6,
      };
    }).filter(Boolean);

    const seriesList: any[] = [
      // Whisker: Min - Max Range
      {
        name: 'Rentang Min-Maks',
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        z: 2,
        lineStyle: {
          color: '#CBD5E1',
          width: 3,
          cap: 'round',
        },
        silent: true,
        data: rangeLinesData,
      },
      // Core Bar: IQR (P25 - P75)
      {
        name: 'Rentang IQR (50% Tengah)',
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        z: 3,
        lineStyle: {
          color: '#94A3B8',
          width: 8,
          cap: 'round',
        },
        silent: true,
        data: iqrLinesData,
      },
      // Median Points with Direct Text Label
      {
        name: 'Median Regional',
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        z: 5,
        symbol: 'diamond',
        symbolSize: 14,
        data: medianPointsData,
        tooltip: {
          formatter: (params: any) => {
            const s: IslandStat = params.data?.stat;
            if (!s) return '';
            return `
              <div style="font-weight: 700; margin-bottom: 2px;">Kawasan ${s.name}</div>
              <div style="color: #64748B; font-size: 11px; margin-bottom: 4px;">Total: ${s.count} Kabupaten/Kota</div>
              <div style="border-top: 1px solid #F1F5F9; padding-top: 4px; font-size: 11px;">
                <div>Median: <strong style="color: #D55E00;">${s.median.toFixed(2)}%</strong></div>
                <div>IQR (P25–P75): <strong>${s.p25.toFixed(2)}% – ${s.p75.toFixed(2)}%</strong></div>
                <div>Rentang Ekstrem: <strong>${s.min.toFixed(2)}% – ${s.max.toFixed(2)}%</strong></div>
              </div>
            `;
          }
        }
      }
    ];

    // Conditionally include individual district dots in 'combined' mode
    if (viewMode === 'combined') {
      seriesList.push({
        name: 'Kabupaten/Kota',
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        z: 4,
        data: scatterPointsData,
        tooltip: {
          formatter: (params: any) => {
            const d: District = params.data?.rawDistrict;
            if (!d) return '';
            return `
              <div style="font-weight: 700;">${d.tipe_wilayah} ${d.kab_kota}</div>
              <div style="color: #64748B; font-size: 11px;">${d.provinsi} · ${d.region_pulau}</div>
              <div style="border-top: 1px solid #F1F5F9; margin-top: 4px; padding-top: 4px; font-size: 11px;">
                <div>Kemiskinan P0: <strong style="color: #D55E00;">${d.poverty_rate_p0.toFixed(2)}%</strong></div>
                <div>Klaster: <strong style="color: ${CLUSTER_COLORS[d.cluster_id]};">${d.cluster_name.split(':')[0]}</strong></div>
              </div>
            `;
          }
        }
      });
    }

    return {
      title: {
        text: 'Disparitas Kemiskinan Moneter (P0) di 6 Kawasan Kepulauan Besar',
        subtext: 'Kawasan Timur menampung konsentrasi sebaran kemiskinan tertinggi di tanah air.',
        left: 'left',
        textStyle: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
        subtextStyle: { fontSize: 12, color: '#64748B' }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: '#1E293B', fontSize: 12 },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-radius: 8px;',
      },
      grid: {
        top: 65,
        right: 40,
        bottom: 45,
        left: 145
      },
      xAxis: {
        type: 'value',
        name: 'Kemiskinan P0 (%)',
        nameLocation: 'middle',
        nameGap: 26,
        nameTextStyle: { fontSize: 11, fontWeight: 'bold', color: '#475569' },
        min: 0,
        max: 43.5,
        splitLine: { lineStyle: { type: 'dashed', color: '#E2E8F0' } },
        axisLabel: { formatter: '{value}%', color: '#64748B' },
      },
      yAxis: {
        type: 'category',
        data: yAxisCategories,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: '#F1F5F9' } },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(248, 250, 252, 0.7)', 'rgba(255, 255, 255, 0.3)']
          }
        },
        axisLabel: {
          color: '#1E293B',
          fontWeight: 700,
          fontSize: 11,
          formatter: (isl: string) => {
            const stat = statsMap.get(isl);
            if (!stat) return isl;
            return `{title|${isl}}\n{sub|(N=${stat.count} · Med: ${stat.median.toFixed(1)}%)}`;
          },
          rich: {
            title: { fontWeight: 'bold', color: '#1E293B', fontSize: 11, lineHeight: 14 },
            sub: { color: '#64748B', fontSize: 10, lineHeight: 14 }
          }
        }
      },
      series: [
        ...seriesList,
        // National Median Benchmark Reference Line (Runs vertically across all lanes)
        {
          name: 'Baseline Nasional',
          type: 'line',
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            lineStyle: { type: 'dashed', color: '#DC2626', width: 1.5 },
            data: [
              {
                xAxis: nationalMedian,
                label: {
                  formatter: 'Median RI: 10.46%',
                  position: 'end',
                  color: '#DC2626',
                  fontSize: 10,
                  fontWeight: 'bold',
                }
              }
            ]
          }
        }
      ]
    };
  }, [districts, yAxisCategories, statsMap, viewMode]);

  return (
    <div className="bg-surface rounded-xl border border-slate-200/80 p-4 shadow-subtle">
      {/* View Mode Toggle (Explanatory Knaflic vs Combined Dot View) */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Tampilan Distribusi Regional
          </span>
        </div>
        <div className="flex items-center space-x-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('combined')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'combined'
                ? 'bg-white text-ink-primary shadow-xs'
                : 'text-slate-600 hover:text-ink-primary'
            }`}
          >
            Sebaran Titik
          </button>
          <button
            onClick={() => setViewMode('summary')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'summary'
                ? 'bg-white text-ink-primary shadow-xs'
                : 'text-slate-600 hover:text-ink-primary'
            }`}
          >
            Ringkas (Knaflic IQR)
          </button>
        </div>
      </div>

      <ReactECharts
        option={option}
        style={{ height: '370px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};
