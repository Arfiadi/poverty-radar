import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { District } from '../../types';

interface SpatialRankingProps {
  districts: District[];
  indicator: keyof District;
  indicatorLabel: string;
  unit: string;
}

export const SpatialRankingBar: React.FC<SpatialRankingProps> = ({
  districts,
  indicator,
  indicatorLabel,
  unit,
}) => {
  // Aggregate indicator average by Province
  const { provNames, provValues, nationalAvg } = useMemo(() => {
    const provMap: Record<string, number[]> = {};
    districts.forEach(d => {
      if (!provMap[d.provinsi]) provMap[d.provinsi] = [];
      const val = d[indicator];
      if (typeof val === 'number') provMap[d.provinsi].push(val);
    });

    const entries = Object.keys(provMap).map(prov => {
      const vals = provMap[prov];
      const avg = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
      return { prov, avg };
    });

    // Sort ascending so highest appears on top of horizontal bar
    entries.sort((a, b) => a.avg - b.avg);

    const allVals = districts.map(d => d[indicator]).filter(v => typeof v === 'number') as number[];
    const grandAvg = allVals.length ? allVals.reduce((a, b) => a + b, 0) / allVals.length : 0;

    return {
      provNames: entries.map(e => e.prov),
      provValues: entries.map(e => Number(e.avg.toFixed(2))),
      nationalAvg: Number(grandAvg.toFixed(2))
    };
  }, [districts, indicator]);

  const option = useMemo(() => {
    return {
      title: {
        text: `Ranking Rata-Rata ${indicatorLabel} Antar-Provinsi (34 Provinsi)`,
        subtext: `Fallback Geospasial: Menampilkan perbandingan nilai rata-rata wilayah provinsi (Garis putus-putus: Rata-Rata Nasional ${nationalAvg}${unit}).`,
        left: 'left',
        textStyle: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
        subtextStyle: { fontSize: 11, color: '#64748B' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        padding: [8, 12],
        textStyle: { color: '#1E293B', fontSize: 12 },
        formatter: (params: any) => {
          const item = params[0];
          return `
            <div style="font-weight: 700;">${item.name}</div>
            <div style="color: #0072B2; margin-top: 4px;">Rata-Rata: <strong>${item.value}${unit}</strong></div>
            <div style="font-size: 11px; color: #64748B;">Selisih vs Nasional: ${(item.value - nationalAvg).toFixed(2)}${unit}</div>
          `;
        }
      },
      grid: {
        top: 65,
        right: 40,
        bottom: 25,
        left: 140
      },
      xAxis: {
        type: 'value',
        name: unit,
        splitLine: { lineStyle: { type: 'dashed', color: '#E2E8F0' } },
        axisLabel: { color: '#64748B' }
      },
      yAxis: {
        type: 'category',
        data: provNames,
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { color: '#1E293B', fontSize: 10, fontWeight: 500 }
      },
      series: [
        {
          name: indicatorLabel,
          type: 'bar',
          data: provValues,
          itemStyle: {
            color: '#0072B2',
            borderRadius: [0, 3, 3, 0]
          },
          label: {
            show: true,
            position: 'right',
            formatter: `{c}${unit}`,
            fontSize: 9,
            color: '#475569'
          },
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            lineStyle: { type: 'dashed', color: '#D55E00', width: 1.8 },
            label: { formatter: `Nasional: {c}${unit}`, position: 'end', color: '#D55E00', fontSize: 10 },
            data: [{ xAxis: nationalAvg }]
          }
        }
      ]
    };
  }, [indicatorLabel, unit, provNames, provValues, nationalAvg]);

  return (
    <div className="bg-surface rounded-xl border border-slate-200/80 p-4 shadow-subtle">
      <ReactECharts option={option} style={{ height: '520px', width: '100%' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
};
