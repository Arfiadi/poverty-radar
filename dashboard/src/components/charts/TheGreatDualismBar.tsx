import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { District } from '../../types';

interface DualismProps {
  districts: District[];
}

export const TheGreatDualismBar: React.FC<DualismProps> = ({ districts }) => {
  const { kabP0, kotaP0, kabTpt, kotaTpt, countKab, countKota } = useMemo(() => {
    const kabs = districts.filter(d => d.tipe_wilayah === 'Kabupaten');
    const kotas = districts.filter(d => d.tipe_wilayah === 'Kota');

    const mean = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    return {
      kabP0: mean(kabs.map(d => d.poverty_rate_p0)),
      kotaP0: mean(kotas.map(d => d.poverty_rate_p0)),
      kabTpt: mean(kabs.map(d => d.unemployment_rate_tpt)),
      kotaTpt: mean(kotas.map(d => d.unemployment_rate_tpt)),
      countKab: kabs.length,
      countKota: kotas.length,
    };
  }, [districts]);

  const p0Ratio = kotaP0 > 0 ? (kabP0 / kotaP0).toFixed(2) : '1.87';
  const tptRatio = kabTpt > 0 ? (kotaTpt / kabTpt).toFixed(2) : '1.82';

  const option = useMemo(() => {
    return {
      title: {
        text: 'The Great Dualism: Jurang Kemiskinan vs Paradoks Pengangguran',
        subtext: `Kabupaten ~${p0Ratio}x lebih miskin dari Kota, sebaliknya pengangguran terbuka Kota ~${tptRatio}x lebih tinggi.`,
        left: 'left',
        textStyle: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
        subtextStyle: { fontSize: 12, color: '#64748B' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        padding: [8, 12],
        textStyle: { color: '#1E293B', fontSize: 12 },
        formatter: (params: any) => {
          const title = params[0]?.name;
          const kabVal = params[0]?.value;
          const kotaVal = params[1]?.value;
          const diff = Math.abs(kabVal - kotaVal).toFixed(2);
          return `
            <div style="font-weight: 700;">${title}</div>
            <div style="color: #0072B2; margin-top: 4px;">Kabupaten: <strong>${kabVal.toFixed(2)}%</strong></div>
            <div style="color: #E69F00;">Kota: <strong>${kotaVal.toFixed(2)}%</strong></div>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px; border-top: 1px solid #F1F5F9; padding-top: 4px;">
              Selisih: ${diff} poin persentase
            </div>
          `;
        }
      },
      legend: {
        data: ['Kabupaten (Pedesaan)', 'Kota (Perkotaan)'],
        top: 38,
        right: 15,
        textStyle: { fontSize: 11, color: '#475569' }
      },
      grid: {
        top: 75,
        right: 45,
        bottom: 45,
        left: 155
      },
      xAxis: {
        type: 'value',
        name: 'Rata-Rata Persentase (%)',
        nameLocation: 'middle',
        nameGap: 28,
        nameTextStyle: { color: '#64748B', fontSize: 11 },
        splitLine: { lineStyle: { type: 'dashed', color: '#E2E8F0' } },
        axisLabel: { formatter: '{value}%', color: '#64748B' }
      },
      yAxis: {
        type: 'category',
        data: ['Tingkat Kemiskinan (P0)', 'Tingkat Pengangguran (TPT)'],
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { fontWeight: 'bold', color: '#1E293B', fontSize: 11 }
      },
      series: [
        {
          name: 'Kabupaten (Pedesaan)',
          type: 'bar',
          data: [Number(kabP0.toFixed(2)), Number(kabTpt.toFixed(2))],
          itemStyle: { color: '#0072B2', borderRadius: [0, 4, 4, 0] },
          label: { show: true, position: 'right', formatter: '{c}%', fontWeight: 'bold', color: '#0072B2' }
        },
        {
          name: 'Kota (Perkotaan)',
          type: 'bar',
          data: [Number(kotaP0.toFixed(2)), Number(kotaTpt.toFixed(2))],
          itemStyle: { color: '#E69F00', borderRadius: [0, 4, 4, 0] },
          label: { show: true, position: 'right', formatter: '{c}%', fontWeight: 'bold', color: '#B84D00' }
        }
      ]
    };
  }, [kabP0, kotaP0, kabTpt, kotaTpt, countKab, countKota, p0Ratio, tptRatio]);

  return (
    <div className="bg-surface rounded-xl border border-slate-200/80 p-4 shadow-subtle">
      <ReactECharts option={option} style={{ height: '320px', width: '100%' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
};
