import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { OLSResult } from '../../types';
import { EPISTEMIC_DISCLAIMER } from '../../constants/paradoxes';

interface OLSProps {
  olsResults: OLSResult[];
}

export const OLSCoefficientsBar: React.FC<OLSProps> = ({ olsResults }) => {
  const option = useMemo(() => {
    // Reverse order so highest magnitude is on top of horizontal bar
    const sorted = [...olsResults].reverse();
    const labels = sorted.map(d => d.label);
    const betas = sorted.map(d => d.beta);

    return {
      title: {
        text: 'Koefisien Regresi Terstandarisasi Baku OLS (Multivariat)',
        subtext: `Asosiasi relatif indikator terhadap variasi persentase kemiskinan (P0). Seluruh variabel distandarisasi (Mean=0, SD=1).\n${EPISTEMIC_DISCLAIMER}`,
        left: 'left',
        textStyle: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
        subtextStyle: { fontSize: 10.5, color: '#64748B', lineHeight: 15 }
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
          const raw = sorted[item.dataIndex];
          return `
            <div style="font-weight: 700;">${raw.label}</div>
            <div style="color: ${item.color}; margin-top: 4px;">Asosiasi Relatif Baku (β): <strong>${raw.beta > 0 ? '+' : ''}${raw.beta}</strong></div>
            <div style="font-size: 11px; color: #64748B;">Nilai t: ${raw.t_stat} | p-value: ${raw.p_val < 0.001 ? '< 0.001' : raw.p_val.toFixed(4)} (${raw.significance})</div>
            <div style="font-size: 10px; color: #94A3B8; margin-top: 3px;">Asosiasi statistik linier multivariat, bukan hubungan sebab-akibat.</div>
          `;
        }
      },
      grid: {
        top: 75,
        right: 45,
        bottom: 30,
        left: 210
      },
      xAxis: {
        type: 'value',
        name: 'Koefisien Baku (β)',
        nameLocation: 'middle',
        nameGap: 24,
        splitLine: { lineStyle: { type: 'dashed', color: '#E2E8F0' } },
        axisLabel: { color: '#64748B' }
      },
      yAxis: {
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { color: '#1E293B', fontSize: 11, fontWeight: 600 }
      },
      series: [
        {
          name: 'Koefisien Baku (β)',
          type: 'bar',
          data: betas.map((b, i) => ({
            value: b,
            itemStyle: {
              color: b < 0 ? '#0072B2' : '#D55E00',
              borderRadius: b < 0 ? [3, 0, 0, 3] : [0, 3, 3, 0]
            },
            label: {
              show: true,
              position: b < 0 ? 'left' : 'right',
              formatter: `${b > 0 ? '+' : ''}${b} ${sorted[i].significance}`,
              fontWeight: 'bold',
              fontSize: 10,
              color: b < 0 ? '#0072B2' : '#D55E00'
            }
          })),
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            lineStyle: { type: 'solid', color: '#0F172A', width: 1.5 },
            data: [{ xAxis: 0 }]
          }
        }
      ]
    };
  }, [olsResults]);

  return (
    <div className="bg-surface rounded-xl border border-slate-200/80 p-4 shadow-subtle">
      <ReactECharts option={option} style={{ height: '330px', width: '100%' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
};
