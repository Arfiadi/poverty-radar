import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { District } from '../../types';

interface HistogramProps {
  districts: District[];
}

export const DistributionHistogram: React.FC<HistogramProps> = ({ districts }) => {
  const { binLabels, counts, nationalMedian, medianBinLabel } = useMemo(() => {
    const binSize = 3;
    const maxVal = 42;
    const bins: number[] = [];
    for (let b = 0; b <= maxVal; b += binSize) {
      bins.push(b);
    }

    const binCounts = new Array(bins.length - 1).fill(0);
    const labels: string[] = [];

    for (let i = 0; i < bins.length - 1; i++) {
      labels.push(`${bins[i]}–${bins[i + 1]}%`);
    }

    districts.forEach(d => {
      const val = d.poverty_rate_p0;
      for (let i = 0; i < bins.length - 1; i++) {
        if (val >= bins[i] && (i === bins.length - 2 ? val <= bins[i + 1] : val < bins[i + 1])) {
          binCounts[i]++;
          break;
        }
      }
    });

    const p0Sorted = districts.map(d => d.poverty_rate_p0).sort((a, b) => a - b);
    const mid = Math.floor(p0Sorted.length / 2);
    const med = p0Sorted.length % 2 !== 0 ? p0Sorted[mid] : (p0Sorted[mid - 1] + p0Sorted[mid]) / 2;
    const finalMedian = med || 10.46;

    // Determine bin containing median dynamically
    let medianBin = labels[0] || '0–3%';
    for (let i = 0; i < bins.length - 1; i++) {
      if (finalMedian >= bins[i] && (i === bins.length - 2 ? finalMedian <= bins[i + 1] : finalMedian < bins[i + 1])) {
        medianBin = labels[i];
        break;
      }
    }

    return { binLabels: labels, counts: binCounts, nationalMedian: finalMedian, medianBinLabel: medianBin };
  }, [districts]);

  const option = useMemo(() => {
    return {
      title: {
        text: 'Distribusi Frekuensi Kemiskinan Moneter (P0 %)',
        subtext: 'Sebaran menceng ke kanan (right-skewed) dengan ekor panjang kemiskinan ekstrem.',
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
          const item = params[0];
          return `
            <div style="font-weight: 700;">Interval: ${item.name}</div>
            <div style="color: #0072B2; margin-top: 4px;">Jumlah: <strong>${item.value} Kabupaten/Kota</strong></div>
            <div style="font-size: 11px; color: #64748B;">Porsi: ${((item.value / (districts.length || 1)) * 100).toFixed(1)}% dari total</div>
          `;
        }
      },
      grid: {
        top: 65,
        right: 25,
        bottom: 35,
        left: 45
      },
      xAxis: {
        type: 'category',
        data: binLabels,
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { color: '#64748B', fontSize: 10, interval: 0, rotate: 25 }
      },
      yAxis: {
        type: 'value',
        name: 'Jumlah Daerah',
        nameTextStyle: { color: '#64748B', fontSize: 11 },
        splitLine: { lineStyle: { color: '#F1F5F9' } },
        axisLabel: { color: '#64748B', fontSize: 11 }
      },
      series: [
        {
          name: 'Frekuensi Daerah',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: '#0072B2',
            borderRadius: [4, 4, 0, 0]
          },
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            label: {
              formatter: `Median: ${nationalMedian.toFixed(2)}%`,
              position: 'insideEndTop',
              color: '#D55E00',
              fontWeight: 'bold',
              fontSize: 10,
              backgroundColor: '#FFF5EB',
              padding: [2, 6],
              borderRadius: 4
            },
            lineStyle: {
              type: 'dashed',
              color: '#D55E00',
              width: 1.8
            },
            data: [
              { xAxis: medianBinLabel }
            ]
          }
        }
      ]
    };
  }, [binLabels, counts, nationalMedian, medianBinLabel, districts.length]);

  return (
    <div className="bg-surface rounded-xl border border-slate-200/80 p-4 shadow-subtle">
      <ReactECharts option={option} style={{ height: '360px', width: '100%' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
};
