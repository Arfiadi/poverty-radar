import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { District } from '../../types';
import { CLUSTER_COLORS } from '../../constants/okabeItoPalette';

interface WorkingPoorProps {
  districts: District[];
}

export const WorkingPoorScatter: React.FC<WorkingPoorProps> = ({ districts }) => {
  const option = useMemo(() => {
    const data = districts.map(d => ({
      value: [d.labor_participation_tpak, d.poverty_rate_p0],
      rawDistrict: d,
      itemStyle: {
        color: CLUSTER_COLORS[d.cluster_id] || '#0072B2',
        opacity: 0.85
      }
    }));

    return {
      title: {
        text: 'The Working Poor: Tekanan Kerja Subsistensi vs Kemiskinan',
        subtext: 'Korelasi positif r = +0.462. Di perdesaan 3T, warga miskin wajib bekerja harian untuk bertahan hidup.',
        left: 'left',
        textStyle: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
        subtextStyle: { fontSize: 11, color: '#64748B' }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        padding: [8, 12],
        textStyle: { color: '#1E293B', fontSize: 12 },
        formatter: (params: any) => {
          const d: District = params.data?.rawDistrict;
          if (!d) return '';
          return `
            <div style="font-weight: 700;">${d.tipe_wilayah} ${d.kab_kota}</div>
            <div style="color: #64748B; font-size: 11px;">${d.provinsi}</div>
            <div style="border-top: 1px solid #F1F5F9; margin-top: 4px; padding-top: 4px;">
              <div>TPAK: <strong>${d.labor_participation_tpak.toFixed(2)}%</strong></div>
              <div>Kemiskinan P0: <strong style="color: #D55E00;">${d.poverty_rate_p0.toFixed(2)}%</strong></div>
              <div>Pengangguran TPT: <strong>${d.unemployment_rate_tpt.toFixed(2)}%</strong></div>
            </div>
          `;
        }
      },
      grid: {
        top: 65,
        right: 30,
        bottom: 45,
        left: 55
      },
      xAxis: {
        type: 'value',
        name: 'Partisipasi Kerja (TPAK %)',
        nameLocation: 'middle',
        nameGap: 26,
        nameTextStyle: { color: '#64748B', fontSize: 11, fontWeight: 'bold' },
        min: 55,
        max: 100,
        splitLine: { lineStyle: { type: 'dashed', color: '#E2E8F0' } },
        axisLabel: { formatter: '{value}%', color: '#64748B' }
      },
      yAxis: {
        type: 'value',
        name: 'Tingkat Kemiskinan (P0 %)',
        nameLocation: 'middle',
        nameGap: 36,
        nameTextStyle: { color: '#64748B', fontSize: 11, fontWeight: 'bold' },
        min: 0,
        max: 43,
        splitLine: { lineStyle: { color: '#F1F5F9' } },
        axisLabel: { formatter: '{value}%', color: '#64748B' }
      },
      series: [
        {
          name: 'Daerah',
          type: 'scatter',
          symbolSize: 7,
          data: data,
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            label: {
              formatter: 'Garis Tren Positif (r = +0.462)',
              position: 'insideEndTop',
              color: '#0072B2',
              fontWeight: 'bold',
              fontSize: 10
            },
            lineStyle: {
              type: 'dashed',
              color: '#0072B2',
              width: 1.8
            },
            data: [
              [
                { coord: [60, 6] },
                { coord: [95, 30] }
              ]
            ]
          }
        }
      ]
    };
  }, [districts]);

  return (
    <div className="bg-surface rounded-xl border border-slate-200/80 p-4 shadow-subtle">
      <ReactECharts option={option} style={{ height: '320px', width: '100%' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
};
