import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { District } from '../../types';
import { CLUSTER_COLORS } from '../../constants/okabeItoPalette';

interface SmallMultiplesProps {
  districts: District[];
  allDistricts?: District[];
}

export const SmallMultiplesZScore: React.FC<SmallMultiplesProps> = ({ districts, allDistricts }) => {
  const features = useMemo(() => [
    { key: 'sanitation_access_pct', label: 'Sanitasi Layak' },
    { key: 'clean_water_access_pct', label: 'Air Terlindung' },
    { key: 'avg_school_years', label: 'Lama Sekolah (RLS)' },
    { key: 'expenditure_per_capita', label: 'Pengeluaran Riil' },
    { key: 'life_expectancy', label: 'Harapan Hidup (UHH)' },
    { key: 'log_pdrb', label: 'Log-PDRB' },
    { key: 'unemployment_rate_tpt', label: 'Pengangguran (TPT)' },
  ], []);

  // Compute baseline mean & std using full national dataset (anchors Z=0 to national population)
  const baselineDistricts = (allDistricts && allDistricts.length > 0) ? allDistricts : districts;
  const stats = useMemo(() => {
    const s: Record<string, { mean: number; std: number }> = {};
    features.forEach(f => {
      const vals = baselineDistricts.map(d => Number(d[f.key as keyof District]));
      const mean = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
      const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (vals.length || 1);
      s[f.key] = { mean, std: Math.sqrt(variance) || 1 };
    });
    return s;
  }, [baselineDistricts, features]);

  // Compute z-scores for each of the 4 clusters against the anchored national baseline
  const clusterZScores = useMemo(() => {
    const res: Record<number, number[]> = { 0: [], 1: [], 2: [], 3: [] };
    for (let c = 0; c < 4; c++) {
      const cDistricts = districts.filter(d => d.cluster_id === c);
      features.forEach(f => {
        const cVals = cDistricts.map(d => Number(d[f.key as keyof District]));
        const cMean = cVals.length ? cVals.reduce((a, b) => a + b, 0) / cVals.length : stats[f.key].mean;
        const z = (cMean - stats[f.key].mean) / stats[f.key].std;
        res[c].push(Number(z.toFixed(2)));
      });
    }
    return res;
  }, [districts, features, stats]);

  // Dynamic cluster legend with runtime counts
  const clusterNames = useMemo(() => {
    const baseNames = [
      "Klaster 1: Perkotaan Modern & Formal",
      "Klaster 2: Kab. Penyangga Mapan",
      "Klaster 3: Perdesaan Agraris Rentan",
      "Klaster 4: Wilayah 3T Deprivasi Akut"
    ];
    return baseNames.map((name, c) => {
      const cDistricts = districts.filter(d => d.cluster_id === c);
      return `${name} (N=${cDistricts.length})`;
    });
  }, [districts]);

  const option = useMemo(() => {
    const featureLabels = features.map(f => f.label);

    return {
      title: {
        text: 'Profil Pembeda 4 Klaster Sosio-Ekonomi: Small Multiples Bar Charts (Z-Score)',
        subtext: 'Deviasi terstandarisasi (Z-Score) tiap indikator terhadap acuan rata-rata populasi nasional (Z = 0, N=514).',
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
          const zVal = item.value;
          const status = zVal >= 0 ? 'Di atas rata-rata nasional' : 'Di bawah rata-rata nasional (Defisit)';
          return `
            <div style="font-weight: 700;">${item.name}</div>
            <div style="color: ${item.color}; margin-top: 4px;">Z-Score: <strong>${zVal > 0 ? '+' : ''}${zVal} SD</strong></div>
            <div style="font-size: 11px; color: #64748B;">Status: ${status}</div>
          `;
        }
      },
      legend: {
        data: clusterNames,
        top: 42,
        right: 10,
        textStyle: { fontSize: 10, color: '#475569' }
      },
      grid: [
        { left: 130, right: '55%', top: 85, height: '36%' },
        { left: '60%', right: 30, top: 85, height: '36%' },
        { left: 130, right: '55%', top: '56%', height: '36%' },
        { left: '60%', right: 30, top: '56%', height: '36%' },
      ],
      xAxis: [0, 1, 2, 3].map(i => ({
        gridIndex: i,
        type: 'value',
        min: -3.0,
        max: 2.2,
        splitLine: { lineStyle: { type: 'dashed', color: '#E2E8F0' } },
        axisLabel: { formatter: '{value}σ', fontSize: 10, color: '#64748B' }
      })),
      yAxis: [
        { gridIndex: 0, type: 'category', data: featureLabels, axisLabel: { fontSize: 10, fontWeight: 600, color: '#1E293B' } },
        { gridIndex: 1, type: 'category', data: featureLabels, show: false },
        { gridIndex: 2, type: 'category', data: featureLabels, axisLabel: { fontSize: 10, fontWeight: 600, color: '#1E293B' } },
        { gridIndex: 3, type: 'category', data: featureLabels, show: false }
      ],
      series: [0, 1, 2, 3].map(c => {
        const color = CLUSTER_COLORS[c];
        return {
          name: clusterNames[c],
          type: 'bar',
          xAxisIndex: c,
          yAxisIndex: c,
          data: clusterZScores[c].map(val => ({
            value: val,
            itemStyle: {
              color: color,
              borderRadius: val >= 0 ? [0, 3, 3, 0] : [3, 0, 0, 3]
            }
          })),
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            lineStyle: { type: 'solid', color: '#0F172A', width: 1.5 },
            data: [{ xAxis: 0 }]
          }
        };
      })
    };
  }, [clusterNames, clusterZScores, features]);

  return (
    <div className="bg-surface rounded-xl border border-slate-200/80 p-4 shadow-subtle">
      <ReactECharts option={option} style={{ height: '480px', width: '100%' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
};
