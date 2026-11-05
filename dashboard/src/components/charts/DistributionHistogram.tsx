import React, { useMemo, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { District } from '../../types';
import { Download } from 'lucide-react';

interface HistogramProps {
  districts: District[];
  headerAction?: React.ReactNode;
}

const ISLAND_ORDER = [
  "Jawa",
  "Sumatera",
  "Kalimantan",
  "Sulawesi",
  "Bali & Nusa Tenggara",
  "Maluku & Papua"
] as const;

const ISLAND_COLORS: Record<string, string> = {
  "Jawa": "#0072B2",               // Okabe-Ito Dark Blue
  "Sumatera": "#56B4E9",           // Sky Blue
  "Kalimantan": "#009E73",         // Teal
  "Sulawesi": "#CC79A7",           // Reddish Purple
  "Bali & Nusa Tenggara": "#E69F00",// Amber
  "Maluku & Papua": "#D55E00",     // Vermillion
};

export const DistributionHistogram: React.FC<HistogramProps> = ({ districts, headerAction }) => {
  const { binLabels, countsByIsland, totalCounts, nationalMedian, medianBinLabel, rpjmnBinLabel } = useMemo(() => {
    const binSize = 3;
    const maxVal = 42;
    const bins: number[] = [];
    for (let b = 0; b <= maxVal; b += binSize) {
      bins.push(b);
    }

    const labels: string[] = [];
    for (let i = 0; i < bins.length - 1; i++) {
      labels.push(`${bins[i]}–${bins[i + 1]}%`);
    }

    const islandData: Record<string, number[]> = {};
    ISLAND_ORDER.forEach(isl => {
      islandData[isl] = new Array(labels.length).fill(0);
    });
    const totals = new Array(labels.length).fill(0);

    districts.forEach(d => {
      const val = d.poverty_rate_p0;
      const isl = d.region_pulau;
      for (let i = 0; i < bins.length - 1; i++) {
        const isLast = i === bins.length - 2;
        if (val >= bins[i] && (isLast ? val <= bins[i + 1] : val < bins[i + 1])) {
          if (islandData[isl]) {
            islandData[isl][i]++;
          }
          totals[i]++;
          break;
        }
      }
    });

    const p0Sorted = districts.map(d => d.poverty_rate_p0).sort((a, b) => a - b);
    const mid = Math.floor(p0Sorted.length / 2);
    const med = p0Sorted.length % 2 !== 0 ? p0Sorted[mid] : (p0Sorted[mid - 1] + p0Sorted[mid]) / 2;
    const finalMedian = med || 10.46;

    let medianBin = labels[0] || '0–3%';
    let rpjmnBin = labels[2] || '6–9%';

    for (let i = 0; i < bins.length - 1; i++) {
      const isLast = i === bins.length - 2;
      if (finalMedian >= bins[i] && (isLast ? finalMedian <= bins[i + 1] : finalMedian < bins[i + 1])) {
        medianBin = labels[i];
      }
      if (7.0 >= bins[i] && (isLast ? 7.0 <= bins[i + 1] : 7.0 < bins[i + 1])) {
        rpjmnBin = labels[i];
      }
    }

    return {
      binLabels: labels,
      countsByIsland: islandData,
      totalCounts: totals,
      nationalMedian: finalMedian,
      medianBinLabel: medianBin,
      rpjmnBinLabel: rpjmnBin,
    };
  }, [districts]);

  const option = useMemo(() => {
    const series = ISLAND_ORDER.map((island, idx) => {
      const isLast = idx === ISLAND_ORDER.length - 1;
      return {
        name: island,
        type: 'bar',
        stack: 'total',
        barCategoryGap: '0%', // Menempel antar bin (zero-gap true statistical histogram)
        data: countsByIsland[island],
        itemStyle: {
          color: ISLAND_COLORS[island],
          borderColor: '#FFFFFF',
          borderWidth: 0.5,
        },
        emphasis: {
          focus: 'series',
        },
        ...(isLast ? {
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            data: [
              {
                xAxis: rpjmnBinLabel,
                lineStyle: { type: 'dashed', color: '#059669', width: 1.5 },
                label: {
                  formatter: 'RPJMN: 7.0%',
                  position: 'insideEndTop',
                  color: '#059669',
                  fontSize: 10,
                  fontWeight: 'bold',
                  backgroundColor: '#ECFDF5',
                  padding: [2, 5],
                  borderRadius: 4,
                  distance: 6,
                }
              },
              {
                xAxis: medianBinLabel,
                lineStyle: { type: 'dashed', color: '#D55E00', width: 1.5 },
                label: {
                  formatter: 'Median: 10.46%',
                  position: 'insideEndTop',
                  color: '#D55E00',
                  fontSize: 10,
                  fontWeight: 'bold',
                  backgroundColor: '#FFF7ED',
                  padding: [2, 5],
                  borderRadius: 4,
                  distance: 6,
                }
              }
            ]
          }
        } : {})
      };
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        padding: [8, 12],
        textStyle: { color: '#1E293B', fontSize: 11 },
        formatter: (params: any) => {
          let total = 0;
          let breakdown = '';
          params.forEach((p: any) => {
            const val = Number(p.value) || 0;
            total += val;
            if (val > 0) {
              breakdown += `
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 2px;">
                  <span style="color: ${p.color}; font-weight: 600;">● ${p.seriesName}</span>
                  <strong style="color: #0F172A;">${val} daerah</strong>
                </div>
              `;
            }
          });
          const pct = ((total / (districts.length || 1)) * 100).toFixed(1);
          return `
            <div style="font-weight: 700; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 4px;">
              Interval Kemiskinan: ${params[0]?.name || ''}
            </div>
            <div style="font-weight: 700; color: #0072B2; margin-bottom: 4px;">
              Total Frekuensi: ${total} Daerah (${pct}%)
            </div>
            ${breakdown}
          `;
        }
      },
      legend: {
        data: [...ISLAND_ORDER],
        top: 2,
        right: 0,
        textStyle: { fontSize: 10, color: '#475569', fontWeight: 500 },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 8,
      },
      grid: {
        top: 32,
        right: 15,
        bottom: 24,
        left: 36,
      },
      xAxis: {
        type: 'category',
        data: binLabels,
        splitLine: { show: false },
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisTick: { alignWithLabel: true },
        axisLabel: {
          color: '#64748B',
          fontSize: 10,
          interval: 1,
          formatter: (_val: string, idx: number) => `${idx * 3}%`,
        }
      },
      yAxis: {
        type: 'value',
        name: 'Jumlah Daerah',
        nameTextStyle: { color: '#64748B', fontSize: 10 },
        splitLine: { show: false },
        axisLabel: { color: '#64748B', fontSize: 10 },
      },
      series,
    };
  }, [binLabels, countsByIsland, medianBinLabel, rpjmnBinLabel, districts.length]);

  const echartsRef = useRef<any>(null);

  const handleExportImage = () => {
    const chart = echartsRef.current?.getEchartsInstance();
    if (!chart) return;
    const url = chart.getDataURL({
      pixelRatio: 2,
      backgroundColor: '#FFFFFF',
    });
    const a = document.createElement('a');
    a.href = url;
    a.download = `histogram-sebaran-kemiskinan-kepulauan.png`;
    a.click();
  };

  return (
    <div 
      className="bg-surface rounded-xl border border-slate-200/90 p-2.5 sm:p-3 shadow-subtle flex flex-col justify-between h-full"
      role="region"
      aria-label="Histogram Distribusi Frekuensi Kemiskinan Moneter dan Komposisi Kepulauan"
    >
      {/* Chart Header & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-1.5 shrink-0">
        <div>
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            Distribusi Frekuensi Kemiskinan Nasional &amp; Komposisi Kepulauan
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Histogram agregat 514 daerah (interval 3%) dengan segmentasi 6 gugus pulau vs acuan median &amp; sasaran RPJMN
          </p>
        </div>

        <div className="flex items-center space-x-1.5 self-end sm:self-auto shrink-0">
          {headerAction}
          <button
            onClick={handleExportImage}
            className="inline-flex items-center space-x-1 px-2.5 py-0.5 text-xs font-semibold rounded-md border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Unduh visualisasi grafik (PNG)"
            aria-label="Unduh grafik PNG"
          >
            <Download className="w-3 h-3" />
            <span>Ekspor PNG</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div 
        className="w-full flex-1 min-h-[295px] relative flex flex-col justify-center" 
        role="img" 
        aria-label="Histogram distribusi frekuensi tingkat kemiskinan 514 daerah di Indonesia dengan perincian komposisi kepulauan."
      >
        <ReactECharts 
          ref={echartsRef}
          option={option} 
          style={{ height: '100%', minHeight: '295px', width: '100%' }} 
          opts={{ renderer: 'canvas' }} 
          notMerge={true}
        />

        {/* Screen reader summary table */}
        <div className="sr-only">
          <h4>Frekuensi Daerah per Interval Kemiskinan</h4>
          <table>
            <thead>
              <tr>
                <th scope="col">Interval Kemiskinan</th>
                <th scope="col">Total Frekuensi</th>
              </tr>
            </thead>
            <tbody>
              {binLabels.map((lbl, idx) => (
                <tr key={lbl}>
                  <td>{lbl}</td>
                  <td>{totalCounts[idx]} daerah</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
