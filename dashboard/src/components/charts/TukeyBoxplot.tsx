import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { District } from '../../types';

interface BoxplotProps {
  districts: District[];
}

export const TukeyBoxplot: React.FC<BoxplotProps> = ({ districts }) => {
  const option = useMemo(() => {
    const p0Vals = districts.map(d => d.poverty_rate_p0).sort((a, b) => a - b);
    const n = p0Vals.length;

    const q1 = p0Vals[Math.floor(n * 0.25)];
    const median = p0Vals[Math.floor(n * 0.5)];
    const q3 = p0Vals[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    const lowerWhisker = Math.max(p0Vals[0], q1 - 1.5 * iqr);
    const upperWhisker = Math.min(p0Vals[n - 1], q3 + 1.5 * iqr);

    // Identify Tukey outliers (points > upperWhisker or < lowerWhisker)
    const outliers = districts
      .filter(d => d.poverty_rate_p0 > upperWhisker || d.poverty_rate_p0 < lowerWhisker)
      .map(d => [0, d.poverty_rate_p0, `${d.tipe_wilayah} ${d.kab_kota} (${d.provinsi})`]);

    return {
      title: {
        text: 'Inspeksi Outlier Teknis: Boxplot Tukey 1.5x IQR (Metodologi Audit)',
        subtext: `Q1: ${q1.toFixed(2)}%, Median: ${median.toFixed(2)}%, Q3: ${q3.toFixed(2)}%, IQR: ${iqr.toFixed(2)}%. Sebanyak ${outliers.length} daerah teridentifikasi sebagai pencilan matematis namun DIPERTAHANKAN demi prinsip SDG 1.`,
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
          if (params.seriesType === 'boxplot') {
            return `
              <div style="font-weight: 700;">Statistik Distribusi Tukey (P0 %)</div>
              <div style="border-top: 1px solid #F1F5F9; margin-top: 4px; padding-top: 4px;">
                <div>Batas Atas Whisker: <strong>${upperWhisker.toFixed(2)}%</strong></div>
                <div>Kuartil 3 (Q3): <strong>${q3.toFixed(2)}%</strong></div>
                <div>Median: <strong>${median.toFixed(2)}%</strong></div>
                <div>Kuartil 1 (Q1): <strong>${q1.toFixed(2)}%</strong></div>
                <div>Batas Bawah Whisker: <strong>${lowerWhisker.toFixed(2)}%</strong></div>
              </div>
            `;
          } else {
            return `
              <div style="font-weight: 700;">${params.value[2]}</div>
              <div style="color: #D55E00; margin-top: 2px;">Kemiskinan P0: <strong>${params.value[1]}%</strong> (Pencilan Luar Whisker)</div>
            `;
          }
        }
      },
      grid: {
        top: 65,
        right: 40,
        bottom: 30,
        left: 60
      },
      xAxis: {
        type: 'category',
        data: ['Distribusi Kemiskinan Moneter (P0 %)'],
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { fontWeight: 'bold', color: '#1E293B', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        name: 'Persentase Kemiskinan P0 (%)',
        splitLine: { lineStyle: { type: 'dashed', color: '#E2E8F0' } },
        axisLabel: { formatter: '{value}%', color: '#64748B' }
      },
      series: [
        {
          name: 'Boxplot Tukey',
          type: 'boxplot',
          data: [[lowerWhisker, q1, median, q3, upperWhisker]],
          itemStyle: {
            borderColor: '#0072B2',
            borderWidth: 2,
            color: 'rgba(0, 114, 178, 0.15)'
          }
        },
        {
          name: 'Pencilan (Outliers)',
          type: 'scatter',
          data: outliers,
          itemStyle: {
            color: '#D55E00',
            opacity: 0.8
          },
          symbolSize: 8
        }
      ]
    };
  }, [districts]);

  return (
    <div className="bg-surface rounded-xl border border-slate-200/80 p-4 shadow-subtle">
      <ReactECharts option={option} style={{ height: '340px', width: '100%' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
};
