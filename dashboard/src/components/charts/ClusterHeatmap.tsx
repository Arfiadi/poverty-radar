import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { District } from '../../types';

interface HeatmapProps {
  districts: District[];
}

export const ClusterHeatmap: React.FC<HeatmapProps> = ({ districts }) => {
  const features = useMemo(() => [
    { key: 'sanitation_access_pct', label: 'Sanitasi' },
    { key: 'clean_water_access_pct', label: 'Air Bersih' },
    { key: 'avg_school_years', label: 'Lama Sekolah' },
    { key: 'expenditure_per_capita', label: 'Pengeluaran' },
    { key: 'life_expectancy', label: 'UHH Hidup' },
    { key: 'log_pdrb', label: 'Log-PDRB' },
    { key: 'unemployment_rate_tpt', label: 'TPT' },
  ], []);

  const clusterLabels = [
    "Klaster 1 (Perkotaan)",
    "Klaster 2 (Penyangga)",
    "Klaster 3 (Agraris)",
    "Klaster 4 (3T Akut)"
  ];

  // Compute z-scores for 28 cells [featureIdx, clusterIdx, zScore]
  const data = useMemo(() => {
    const s: Record<string, { mean: number; std: number }> = {};
    features.forEach(f => {
      const vals = districts.map(d => Number(d[f.key as keyof District]));
      const mean = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
      const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (vals.length || 1);
      s[f.key] = { mean, std: Math.sqrt(variance) || 1 };
    });

    const matrix: [number, number, number][] = [];
    for (let c = 0; c < 4; c++) {
      const cDistricts = districts.filter(d => d.cluster_id === c);
      features.forEach((f, fIdx) => {
        const cVals = cDistricts.map(d => Number(d[f.key as keyof District]));
        const cMean = cVals.length ? cVals.reduce((a, b) => a + b, 0) / cVals.length : 0;
        const z = (cMean - s[f.key].mean) / s[f.key].std;
        matrix.push([fIdx, 3 - c, Number(z.toFixed(2))]); // invert Y so Klaster 1 is on top
      });
    }
    return matrix;
  }, [districts, features]);

  const option = useMemo(() => {
    return {
      title: {
        text: 'Matriks Karakteristik Klaster (28 Sel Z-Score Divergen)',
        subtext: 'Biru = Di atas rata-rata nasional (Unggul), Oranye/Merah = Di bawah rata-rata (Defisit kritis).',
        left: 'left',
        textStyle: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
        subtextStyle: { fontSize: 11, color: '#64748B' }
      },
      tooltip: {
        position: 'top',
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        padding: [8, 12],
        textStyle: { color: '#1E293B', fontSize: 12 },
        formatter: (params: any) => {
          const fName = features[params.value[0]].label;
          const cName = clusterLabels[3 - params.value[1]];
          const zVal = params.value[2];
          return `
            <div style="font-weight: 700;">${cName}</div>
            <div style="color: #64748B; font-size: 11px;">Indikator: ${fName}</div>
            <div style="margin-top: 4px; border-top: 1px solid #F1F5F9; padding-top: 4px;">
              Z-Score: <strong>${zVal > 0 ? '+' : ''}${zVal} SD</strong>
            </div>
          `;
        }
      },
      grid: {
        top: 65,
        right: 35,
        bottom: 40,
        left: 155
      },
      xAxis: {
        type: 'category',
        data: features.map(f => f.label),
        splitArea: { show: true },
        axisLabel: { color: '#1E293B', fontWeight: 600, fontSize: 11 }
      },
      yAxis: {
        type: 'category',
        data: [...clusterLabels].reverse(),
        splitArea: { show: true },
        axisLabel: { color: '#1E293B', fontWeight: 600, fontSize: 11 }
      },
      visualMap: {
        min: -2.8,
        max: 1.8,
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        inRange: {
          color: ['#D55E00', '#FDE047', '#F8FAFC', '#38BDF8', '#0072B2']
        },
        text: ['+1.8σ Unggul', '-2.8σ Defisit'],
        textStyle: { color: '#64748B', fontSize: 10 }
      },
      series: [
        {
          name: 'Z-Score Karakteristik',
          type: 'heatmap',
          data: data,
          label: {
            show: true,
            formatter: (p: any) => `${p.value[2] > 0 ? '+' : ''}${p.value[2]}`,
            color: '#0F172A',
            fontWeight: 'bold',
            fontSize: 11
          },
          itemStyle: {
            borderColor: '#FFFFFF',
            borderWidth: 2
          }
        }
      ]
    };
  }, [data, features]);

  return (
    <div className="bg-surface rounded-xl border border-slate-200/80 p-4 shadow-subtle">
      <ReactECharts option={option} style={{ height: '360px', width: '100%' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
};
