import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { District } from '../../types';
import { CLUSTER_COLORS } from '../../constants/okabeItoPalette';

interface StripPlotProps {
  districts: District[];
  onSelectDistrict?: (district: District) => void;
}

export const ArchipelagoStripPlot: React.FC<StripPlotProps> = ({ districts }) => {
  const islands = useMemo(() => [
    "Jawa",
    "Sumatera",
    "Kalimantan",
    "Sulawesi",
    "Bali & Nusa Tenggara",
    "Maluku & Papua"
  ], []);

  // Compute medians per island
  const islandMedians = useMemo(() => {
    const medians: Record<string, number> = {};
    islands.forEach(isl => {
      const p0List = districts.filter(d => d.region_pulau === isl).map(d => d.poverty_rate_p0).sort((a, b) => a - b);
      if (p0List.length > 0) {
        const mid = Math.floor(p0List.length / 2);
        medians[isl] = p0List.length % 2 !== 0 ? p0List[mid] : (p0List[mid - 1] + p0List[mid]) / 2;
      } else {
        medians[isl] = 0;
      }
    });
    return medians;
  }, [districts, islands]);

  const option = useMemo(() => {
    // Generate jittered scatter points
    const seriesData = districts.map((d, i) => {
      const baseIdx = islands.indexOf(d.region_pulau);
      if (baseIdx === -1) return null;
      // Deterministic pseudo-random jitter between -0.22 and +0.22 based on index
      const pseudoJitter = ((Math.sin(i * 12.9898 + d.poverty_rate_p0) * 43758.5453) % 1) * 0.44 - 0.22;
      return {
        value: [d.poverty_rate_p0, baseIdx + pseudoJitter],
        rawDistrict: d,
        itemStyle: {
          color: CLUSTER_COLORS[d.cluster_id] || "#0072B2",
          opacity: 0.85
        }
      };
    }).filter(Boolean);

    // Median markers as vertical line segments for each island
    const medianLines = islands.map((isl, idx) => {
      const medVal = islandMedians[isl] || 0;
      return [
        { coord: [medVal, idx - 0.3], lineStyle: { color: '#0F172A', width: 3 } },
        { coord: [medVal, idx + 0.3] }
      ];
    });

    return {
      title: {
        text: 'Sebaran Kemiskinan Moneter (P0) di 6 Kawasan Kepulauan Besar',
        subtext: 'Titik mewakili 514 kabupaten/kota. Garis hitam tebal menandakan median regional masing-masing pulau.',
        left: 'left',
        textStyle: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
        subtextStyle: { fontSize: 11, color: '#64748B' }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [8, 12],
        textStyle: { color: '#1E293B', fontSize: 12 },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-radius: 8px;',
        formatter: (params: any) => {
          const d: District = params.data.rawDistrict;
          if (!d) return '';
          return `
            <div style="font-weight: 700; margin-bottom: 2px;">${d.tipe_wilayah} ${d.kab_kota}</div>
            <div style="color: #64748B; font-size: 11px; margin-bottom: 4px;">${d.provinsi} · ${d.region_pulau}</div>
            <div style="display: flex; justify-content: space-between; gap: 12px; margin-top: 4px; border-top: 1px solid #F1F5F9; padding-top: 4px;">
              <span>Tingkat Kemiskinan (P0):</span>
              <strong style="color: #0F172A;">${d.poverty_rate_p0.toFixed(2)}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 12px;">
              <span>Klaster:</span>
              <span style="color: ${CLUSTER_COLORS[d.cluster_id]}; font-weight: 600;">${d.cluster_name.split(':')[0]}</span>
            </div>
          `;
        }
      },
      grid: {
        top: 65,
        right: 30,
        bottom: 45,
        left: 130
      },
      xAxis: {
        type: 'value',
        name: 'Kemiskinan P0 (%)',
        nameLocation: 'middle',
        nameGap: 26,
        nameTextStyle: { fontSize: 11, fontWeight: 'bold', color: '#475569' },
        min: 0,
        max: 43,
        splitLine: { lineStyle: { type: 'dashed', color: '#E2E8F0' } },
        axisLabel: { formatter: '{value}%', color: '#64748B' }
      },
      yAxis: {
        type: 'value',
        min: -0.5,
        max: islands.length - 0.5,
        interval: 1,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#F1F5F9' } },
        axisLabel: {
          color: '#1E293B',
          fontWeight: 600,
          fontSize: 11,
          formatter: (val: number) => {
            const idx = Math.round(val);
            if (idx >= 0 && idx < islands.length) {
              const isl = islands[idx];
              const med = islandMedians[isl];
              return `${isl}\n(Med: ${med?.toFixed(1)}%)`;
            }
            return '';
          }
        }
      },
      series: [
        {
          name: 'Daerah',
          type: 'scatter',
          symbolSize: 7,
          data: seriesData,
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            lineStyle: { type: 'solid', color: '#0F172A', width: 3 },
            data: medianLines
          }
        }
      ]
    };
  }, [districts, islands, islandMedians]);

  return (
    <div className="bg-surface rounded-xl border border-slate-200/80 p-4 shadow-subtle">
      <ReactECharts option={option} style={{ height: '360px', width: '100%' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
};
