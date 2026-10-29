"""
Visualization module providing publication-ready charts for presentation slides and reports.
PovertyRadar SDGs - Following Storytelling with Data (SWD) principles.
"""

from pathlib import Path
from typing import Optional, List
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, adjusted_rand_score
from sklearn.decomposition import PCA

from poverty_radar.config import (
    CLUSTER_PALETTE,
    CLUSTER_LABELS,
    FEATURE_COLS,
    SEED,
    FIGURES_DIR
)


def set_chart_style():
    """Apply consistent styling across all charts."""
    plt.style.use('seaborn-v0_8-whitegrid')
    plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
    plt.rcParams['font.family'] = 'sans-serif'
    plt.rcParams['axes.edgecolor'] = '#CCCCCC'
    plt.rcParams['axes.linewidth'] = 0.8


def plot_elbow_and_silhouette(X_scaled: np.ndarray, save_path: Optional[Path] = None) -> plt.Figure:
    """Figure 08 (Slide 8): 2-panel Elbow WCSS & Silhouette Score across k in [2..7]."""
    set_chart_style()
    k_range = list(range(2, 8))
    inertia_km = []
    sil_km = []

    for k in k_range:
        km = KMeans(n_clusters=k, init='k-means++', n_init=25, random_state=SEED).fit(X_scaled)
        inertia_km.append(km.inertia_)
        sil_km.append(silhouette_score(X_scaled, km.labels_))

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6.2), dpi=300)
    fig.suptitle('Penentuan Jumlah Klaster Optimal (k = 4): Titik Kompromi Elbow & Keseimbangan Wilayah',
                 fontsize=14, fontweight='bold', x=0.04, y=0.98, ha='left')

    # Panel 1: Elbow
    ax1.plot(k_range, inertia_km, marker='o', markersize=8, color='#0072B2', linewidth=2.5)
    ax1.axvline(x=4, color='#D55E00', linestyle='--', linewidth=1.5, alpha=0.85)
    ax1.scatter([4], [inertia_km[2]], color='#D55E00', s=140, zorder=5, edgecolor='black', linewidth=1.2)
    ax1.annotate('Titik Belok Optimal (k = 4)\nPenurunan varians melandai tegas',
                 xy=(4, inertia_km[2]), xytext=(4.3, 1380),
                 fontsize=9.5, fontweight='bold', color='#D55E00',
                 arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=0.15', color='#D55E00', lw=1.2),
                 bbox=dict(boxstyle='round,pad=0.3', facecolor='#FFF5EB', edgecolor='#D55E00', alpha=0.9))
    ax1.set_title('1. Evaluasi Inersia WCSS (Metode Elbow)\nPenurunan inersia melambat dari 18.6% ke 9.0% setelah k = 4',
                  fontsize=11.5, fontweight='bold', loc='left', pad=12)
    ax1.set_xlabel('Jumlah Klaster (k)', fontsize=10.5, fontweight='bold')
    ax1.set_ylabel('Inersia / WCSS (Dalam Klaster)', fontsize=10.5, fontweight='bold')
    ax1.set_xticks(k_range)
    ax1.grid(True, linestyle=':', alpha=0.5)

    # Panel 2: Silhouette
    ax2.plot(k_range, sil_km, marker='s', markersize=8, color='#0072B2', linewidth=2.5)
    ax2.axvline(x=4, color='#D55E00', linestyle='--', linewidth=1.5, alpha=0.85)
    ax2.scatter([4], [sil_km[2]], color='#D55E00', s=140, zorder=5, edgecolor='black', linewidth=1.2)
    ax2.scatter([3], [sil_km[1]], color='#999999', s=90, zorder=4)
    ax2.annotate('k = 3 (0.286): Skor tinggi tetapi\ndaerah 3T tertelan kelompok agraris\n(Partisi timpang: 322 vs 158 vs 34)',
                 xy=(3, sil_km[1]), xytext=(2.2, 0.22),
                 fontsize=8.5, fontweight='bold', color='#555555',
                 arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=-0.15', color='#777777', lw=1.0),
                 bbox=dict(boxstyle='round,pad=0.3', facecolor='#F5F5F5', edgecolor='#CCCCCC', alpha=0.9))
    ax2.annotate('k = 4 (0.203): Kompromi Terbaik\nMemisahkan 3T ekstrem (33 daerah)\nsecara mandiri & seimbang',
                 xy=(4, sil_km[2]), xytext=(4.3, 0.235),
                 fontsize=8.5, fontweight='bold', color='#D55E00',
                 arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=-0.12', color='#D55E00', lw=1.2),
                 bbox=dict(boxstyle='round,pad=0.3', facecolor='#FFF5EB', edgecolor='#D55E00', alpha=0.9))
    ax2.set_title('2. Evaluasi Separasi Siluet (Silhouette Score)\nk = 4 menjaga keseimbangan antara separasi dan keterwakilan wilayah',
                  fontsize=11.5, fontweight='bold', loc='left', pad=12)
    ax2.set_xlabel('Jumlah Klaster (k)', fontsize=10.5, fontweight='bold')
    ax2.set_ylabel('Rata-rata Silhouette Score', fontsize=10.5, fontweight='bold')
    ax2.set_xticks(k_range)
    ax2.set_ylim(0.16, 0.31)
    ax2.grid(True, linestyle=':', alpha=0.5)

    plt.tight_layout()
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    return fig


def plot_algorithm_comparison_barchart(save_path: Optional[Path] = None) -> plt.Figure:
    """Figure 09 (Slide 10): Bar chart comparing K-Means vs Bisecting, GMM, Agglomerative at k=4."""
    set_chart_style()
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6.6), dpi=300)

    models = ['K-Means\n(Algoritma Terpilih)', 'Bisecting\nK-Means', 'GMM\n(Gaussian Mixture)', 'Agglomerative\n(Ward Linkage)']
    sil_scores = [0.203, 0.197, 0.183, 0.173]
    dbi_scores = [1.452, 1.454, 1.470, 1.490]
    colors = ['#0072B2', '#9E9E9E', '#9E9E9E', '#9E9E9E']
    edge_colors = ['#004C75', '#757575', '#757575', '#757575']

    # Panel 1: Silhouette
    bars1 = ax1.bar(models, sil_scores, color=colors, edgecolor=edge_colors, width=0.52, linewidth=1.5, zorder=3)
    for i, bar in enumerate(bars1):
        val = sil_scores[i]
        if i == 0:
            ax1.text(bar.get_x() + bar.get_width()/2, val + 0.008, f"{val:.3f}\n(Terbaik)", 
                     ha='center', va='bottom', fontsize=12, fontweight='bold', color='#0072B2')
        else:
            ax1.text(bar.get_x() + bar.get_width()/2, val + 0.008, f"{val:.3f}", 
                     ha='center', va='bottom', fontsize=11, color='#424242')
    ax1.set_xlim(-0.65, 3.65)
    ax1.set_ylim(0, 0.26)
    ax1.set_ylabel('Silhouette Score', fontsize=12, fontweight='bold')
    ax1.set_title('1. Separasi Antar-Klaster: Silhouette Score\n(Skor Semakin Tinggi = Pemisahan Semakin Baik)', 
                  fontsize=13, fontweight='bold', pad=15, loc='left')
    ax1.grid(axis='y', linestyle=':', alpha=0.6, zorder=0)
    ax1.grid(axis='x', visible=False)
    ax1.spines['top'].set_visible(False)
    ax1.spines['right'].set_visible(False)

    # Panel 2: Davies-Bouldin
    bars2 = ax2.bar(models, dbi_scores, color=colors, edgecolor=edge_colors, width=0.52, linewidth=1.5, zorder=3)
    for i, bar in enumerate(bars2):
        val = dbi_scores[i]
        if i == 0:
            ax2.text(bar.get_x() + bar.get_width()/2, val + 0.045, f"{val:.3f}\n(Terbaik)", 
                     ha='center', va='bottom', fontsize=12, fontweight='bold', color='#0072B2')
        else:
            ax2.text(bar.get_x() + bar.get_width()/2, val + 0.045, f"{val:.3f}", 
                     ha='center', va='bottom', fontsize=11, color='#424242')
    ax2.set_xlim(-0.65, 3.65)
    ax2.set_ylim(0, 1.85)
    ax2.set_ylabel('Davies-Bouldin Index (DBI)', fontsize=12, fontweight='bold')
    ax2.set_title('2. Kepadatan Dalam Klaster: Davies-Bouldin Index\n(Skor Semakin Rendah = Klaster Semakin Kompak & Homogen)', 
                  fontsize=13, fontweight='bold', pad=15, loc='left')
    ax2.grid(axis='y', linestyle=':', alpha=0.6, zorder=0)
    ax2.grid(axis='x', visible=False)
    ax2.spines['top'].set_visible(False)
    ax2.spines['right'].set_visible(False)

    fig.text(0.06, 0.96, 'Perbandingan Algoritma pada k = 4: K-Means Unggul dalam Separasi dan Kepadatan', 
             fontsize=15, fontweight='bold', ha='left')
    fig.text(0.06, 0.90, 'K-Means mencatat separasi terbaik (Silhouette 0.203) sekaligus klaster paling padat (DBI 1.452) di antara 4 algoritma yang diuji', 
             fontsize=12, color='#333333', ha='left')

    plt.subplots_adjust(top=0.78, bottom=0.14, left=0.06, right=0.98, wspace=0.24)
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    return fig


def plot_multiseed_robustness(X_scaled: np.ndarray, baseline_labels: np.ndarray, save_path: Optional[Path] = None) -> plt.Figure:
    """Figure 02 (Slide 11): Multi-seed ARI stability test across 20 iterations."""
    set_chart_style()
    seeds = list(range(1, 21))
    ari_scores = [
        adjusted_rand_score(baseline_labels, KMeans(n_clusters=4, init='k-means++', n_init=10, random_state=s).fit_predict(X_scaled))
        for s in seeds
    ]
    mean_ari = np.mean(ari_scores)

    fig, ax = plt.subplots(figsize=(11, 4.8), dpi=300)
    ax.axhspan(0.85, 1.02, color='#EBF7EE', alpha=0.8, zorder=1, label='Zona Ketahanan Diterima (ARI >= 0.85)')
    ax.plot(seeds, ari_scores, marker='o', color='#0072B2', linewidth=2, markersize=7, zorder=3, label='Skor ARI Tiap Seed')
    ax.axhline(0.85, color='#D55E00', linestyle='--', linewidth=1.5, zorder=2, label='Batas Minimum Kriteria (0.85)')
    ax.axhline(mean_ari, color='#009E73', linestyle='-', linewidth=2, zorder=2, label=f'Rata-rata Konsistensi: {mean_ari*100:.3f}%')

    ax.annotate(f'Konsistensi Partisi = {mean_ari*100:.2f}%\nKlaster terbukti stabil & objektif',
                xy=(13, ari_scores[12]), xytext=(13.2, 0.95),
                fontsize=9.5, fontweight='bold', color='#0072B2',
                bbox=dict(boxstyle='round,pad=0.3', facecolor='white', edgecolor='#0072B2', alpha=0.95))

    ax.set_title('Uji Ketahanan Multi-Seed: Konsistensi Klaster Mencapai 98.0% di 20 Iterasi Acak\nHasil pengelompokan terbukti bukan kebetulan matematis inisialisasi awal',
                 fontsize=12, fontweight='bold', loc='left', pad=12)
    ax.set_xlabel('Iterasi Random Seed (1 s.d. 20)', fontsize=10.5, fontweight='bold')
    ax.set_ylabel('Adjusted Rand Index (ARI)', fontsize=10.5, fontweight='bold')
    ax.set_xticks(seeds)
    ax.set_ylim(0.75, 1.03)
    ax.legend(loc='lower right', frameon=True, facecolor='white')
    ax.grid(True, linestyle=':', alpha=0.4)

    plt.tight_layout()
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    return fig


def plot_pca_2d(df: pd.DataFrame, save_path: Optional[Path] = None) -> plt.Figure:
    """Figure 03: 2D PCA spatial projection with clean annotations and bottom legend."""
    set_chart_style()
    fig, ax = plt.subplots(figsize=(12, 7.2), dpi=300)

    for cid in [0, 1, 2, 3]:
        sub = df[df['cluster_id'] == cid]
        ax.scatter(sub['pca_1'], sub['pca_2'],
                   color=CLUSTER_PALETTE[cid],
                   label=f"{CLUSTER_LABELS[cid]} (N={len(sub)})",
                   alpha=0.75, s=60, edgecolor='white', linewidth=0.6, zorder=3)

    ax.axvline(0, color='#333333', linestyle='-', linewidth=1.5, alpha=0.85, zorder=2)
    ax.axhline(0, color='#333333', linestyle='-', linewidth=1.5, alpha=0.85, zorder=2)
    ax.set_xlim(-9.2, 6.2)
    ax.set_ylim(-3.0, 2.5)

    benchmarks = [
        ('Kota Jakarta Pusat', (3.72, -1.25), (4.5, -0.6), 'left'),
        ('Kota Surabaya', (3.63, -1.48), (4.4, -2.0), 'left'),
        ('Banyumas', (0.81, -0.72), (1.4, -1.4), 'left'),
        ('Nias', (-3.61, -1.84), (-3.2, -2.5), 'center'),
        ('Nduga', (-5.80, -2.02), (-6.8, -2.6), 'center'),
        ('Intan Jaya', (-7.50, -1.72), (-8.3, -0.9), 'center')
    ]
    for name, (px, py), (tx, ty), ha_align in benchmarks:
        ax.scatter(px, py, color='black', s=90, zorder=6, edgecolor='white', linewidth=1.8)
        ax.annotate(name, xy=(px, py), xytext=(tx, ty),
                    fontsize=9.5, fontweight='bold', color='#111111', ha=ha_align,
                    bbox=dict(boxstyle='round,pad=0.25', facecolor='#FFFFFF', edgecolor='#AAAAAA', alpha=0.95),
                    arrowprops=dict(arrowstyle='->', color='#333333', lw=1.3, shrinkA=3, shrinkB=3),
                    zorder=7)

    ax.annotate('Pembangunan Manusia & Layanan Tinggi ➔',
                xy=(5.9, 0.12), fontsize=10, fontweight='bold', color='#0072B2', ha='right',
                bbox=dict(boxstyle='square,pad=0.25', facecolor='#F0F7FC', edgecolor='none', alpha=0.9))
    ax.annotate('⬅ Deprivasi Sarana Kritis',
                xy=(-9.0, 0.12), fontsize=10, fontweight='bold', color='#D55E00', ha='left',
                bbox=dict(boxstyle='square,pad=0.25', facecolor='#FDF3F0', edgecolor='none', alpha=0.9))
    ax.annotate('▲ Kapasitas PDRB & Pasar Kerja Modern',
                xy=(0.15, 2.3), fontsize=10, fontweight='bold', color='#222222', ha='left',
                bbox=dict(boxstyle='square,pad=0.25', facecolor='#F5F5F5', edgecolor='none', alpha=0.9))

    ax.set_title('Pemetaan 2D Sosio-Ekonomi: 4 Tipologi Daerah Terpisah Tegas pada Ruang Pembangunan\n'
                 'PC1 merefleksikan modal manusia & fasilitas dasar (47.9%), PC2 merefleksikan skala ekonomi & pasar kerja (21.5%)',
                 fontsize=12, fontweight='bold', pad=15, loc='left', color='#111111')
    ax.set_xlabel('Komponen Utama 1 (PC1: Modal Manusia & Akses Fasilitas Dasar)', fontsize=11, fontweight='bold', labelpad=8)
    ax.set_ylabel('Komponen Utama 2 (PC2: Skala Kapasitas Ekonomi & Pasar Kerja)', fontsize=11, fontweight='bold', labelpad=8)

    sns.despine(ax=ax, top=True, right=True)
    ax.grid(True, linestyle=':', alpha=0.4, zorder=1)
    ax.legend(loc='upper center', bbox_to_anchor=(0.5, -0.11), ncol=2, frameon=True, facecolor='white', framealpha=0.95, edgecolor='#CCCCCC', fontsize=9.5)

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    return fig


def plot_cluster_heatmap(df: pd.DataFrame, X_scaled: np.ndarray, save_path: Optional[Path] = None) -> plt.Figure:
    """Figure 04: Heatmap Matrix with RdBu colormap (Red = Critical Deficit, Blue = Superior)."""
    set_chart_style()
    z_df = pd.DataFrame(X_scaled, columns=FEATURE_COLS)
    z_df['cluster_name'] = df['cluster_name']

    ordered_names = [CLUSTER_LABELS[i] for i in range(4)]
    z_summary = z_df.groupby('cluster_name').mean().reindex(ordered_names)

    z_summary_display = z_summary.rename(columns={
        'avg_school_years': 'Lama Sekolah\n(RLS)',
        'life_expectancy': 'Harapan Hidup\n(UHH)',
        'expenditure_per_capita': 'Pengeluaran\nRiil / Kapita',
        'sanitation_access_pct': 'Akses Sanitasi\nLayak',
        'clean_water_access_pct': 'Akses Air\nMinum Layak',
        'unemployment_rate_tpt': 'Pengangguran\nTerbuka (TPT)',
        'log_pdrb': 'Skala PDRB\n(Nilai Log1p)'
    })

    fig, ax = plt.subplots(figsize=(12.5, 5.8), dpi=300)
    sns.heatmap(
        z_summary_display,
        annot=True,
        fmt='+.2f',
        cmap='RdBu',
        center=0,
        vmin=-2.6,
        vmax=1.6,
        cbar=True,
        cbar_kws={'label': 'Z-Score Deviasi Relatif', 'shrink': 0.85},
        linewidths=1.5,
        linecolor='white',
        annot_kws={'size': 11, 'weight': 'bold'},
        ax=ax
    )

    ax.set_title('Profil Tipologi Klaster: Jurang Fasilitas Dasar Memisahkan Wilayah 3T dari Daerah Lain\n'
                 'Nilai Z-Score relatif terhadap median nasional (Warna Merah = Defisit Kritis, Biru = Capaian Unggul)',
                 fontsize=12.5, fontweight='bold', pad=18, loc='left')
    ax.set_ylabel('')
    plt.xticks(rotation=0, fontsize=10.5, fontweight='bold', ha='center')
    plt.yticks(fontsize=10.5, fontweight='bold')

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    return fig


def plot_cluster_small_multiples(df: pd.DataFrame, X_scaled: np.ndarray, save_path: Optional[Path] = None) -> plt.Figure:
    """Figure 04 (Slide 12): 2x2 grid of horizontal bar charts decomposing cluster profiles."""
    set_chart_style()
    z_df = pd.DataFrame(X_scaled, columns=FEATURE_COLS)
    z_df['cluster_id'] = df['cluster_id']
    z_mean = z_df.groupby('cluster_id').mean()

    feature_display_names = [
        'Lama Sekolah (RLS)',
        'Harapan Hidup (UHH)',
        'Pengeluaran per Kapita',
        'Akses Sanitasi Layak',
        'Akses Air Minum Layak',
        'Pengangguran (TPT)',
        'Skala PDRB (Log1p)'
    ]

    fig, axes = plt.subplots(2, 2, figsize=(14, 8.2), dpi=300, sharex=True)
    fig.suptitle('Dekomposisi Profil Klaster: Perbandingan Deviasi 7 Indikator terhadap Median Nasional\n'
                 'Batang biru menunjukkan capaian di atas median nasional; batang oranye menunjukkan defisit relatif.',
                 fontsize=13, fontweight='bold', x=0.05, y=0.98, ha='left')

    subtitles = {
        0: 'Modal Manusia & Daya Beli Tertinggi, Pasar Kerja Formal Kompetitif',
        1: 'Infrastruktur Dasar Mantap & Derajat Kesehatan Stabil di Atas Median',
        2: 'Serapan Kerja Informal Tinggi, Defisit Sanitasi Lingkungan & Kesehatan',
        3: 'Krisis Air Minum & Sanitasi Akut, Keterisolasian Fasilitas Pendidikan'
    }

    y_pos = np.arange(len(FEATURE_COLS))

    for cid, ax in enumerate(axes.flat):
        vals = z_mean.loc[cid, FEATURE_COLS].values
        bar_colors = ['#0072B2' if v >= 0 else '#D55E00' for v in vals]
        
        bars = ax.barh(y_pos, vals, color=bar_colors, height=0.6, edgecolor='none', zorder=3)
        ax.axvline(0, color='black', linewidth=1.2, zorder=4)
        ax.set_yticks(y_pos)
        ax.set_yticklabels(feature_display_names, fontsize=9.5)
        ax.invert_yaxis()
        ax.set_xlim(-3.2, 2.0)
        ax.grid(axis='x', linestyle=':', alpha=0.6, zorder=0)

        # Direct labeling
        for i, val in enumerate(vals):
            offset = 0.08 if val >= 0 else -0.08
            ha = 'left' if val >= 0 else 'right'
            ax.text(val + offset, i, f'{val:+.2f}', va='center', ha=ha, fontsize=9, fontweight='bold', color='#222222')

        counts = (df['cluster_id'] == cid).sum()
        ax.set_title(f"{CLUSTER_LABELS[cid]} (N={counts})\n{subtitles[cid]}",
                     fontsize=10.5, fontweight='bold', pad=8, loc='center')

    plt.tight_layout()
    plt.subplots_adjust(top=0.90, hspace=0.28)
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    return fig


def plot_p0_stripplot(df: pd.DataFrame, save_path: Optional[Path] = None) -> plt.Figure:
    """Figure 05 (Slide 13): Jittered Strip Plot showing natural ordinal separation of P0."""
    set_chart_style()
    fig, ax = plt.subplots(figsize=(11, 5.2), dpi=300)

    sns.stripplot(
        data=df,
        x='cluster_id',
        y='poverty_rate_p0',
        palette=CLUSTER_PALETTE,
        hue='cluster_id',
        legend=False,
        size=5.5,
        jitter=0.25,
        alpha=0.6,
        edgecolor='none',
        ax=ax
    )

    medians = df.groupby('cluster_id')['poverty_rate_p0'].median()
    for cid, med in medians.items():
        ax.hlines(y=med, xmin=cid - 0.35, xmax=cid + 0.35, color='black', linewidth=3, zorder=5)
        ax.text(cid, med + 1.2, f'Median: {med:.1f}%', ha='center', fontsize=9.5, fontweight='bold',
                bbox=dict(boxstyle='round,pad=0.2', facecolor='white', edgecolor='#CCCCCC', alpha=0.9))

    med_nat = df['poverty_rate_p0'].median()
    ax.axhline(med_nat, color='#7F7F7F', linestyle='--', linewidth=1.5, zorder=2)
    ax.text(3.45, med_nat + 0.8, f'Median Nasional: {med_nat:.2f}%',
            color='#555555', fontsize=9.5, fontweight='bold', ha='right')

    ax.set_title('Validasi Eksternal: Distribusi Kemiskinan Aktual (P0)\n'
                 'Klaster memisahkan kemiskinan secara alami tanpa variabel P0 (ANOVA F = 155.9, p < 0.001)',
                 fontsize=12, fontweight='bold', pad=15, loc='left')
    ax.set_xlabel('Tipologi Klaster Sosio-Ekonomi', fontsize=10.5, fontweight='bold', labelpad=8)
    ax.set_ylabel('Persentase Penduduk Miskin (P0 %)', fontsize=10.5, fontweight='bold')
    ax.set_xticks([0, 1, 2, 3])
    ax.set_xticklabels([
        'Klaster 1 (N=78)\nPerkotaan Modern & Formal',
        'Klaster 2 (N=187)\nKabupaten Penyangga Mapan',
        'Klaster 3 (N=216)\nPerdesaan Agraris Rentan',
        'Klaster 4 (N=33)\nWilayah 3T Deprivasi Akut'
    ], fontsize=9.0)
    ax.grid(axis='y', linestyle=':', alpha=0.5)

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    return fig


def plot_vulnerability_matrix_2x2(df: pd.DataFrame, save_path: Optional[Path] = None) -> plt.Figure:
    """Figure 06 (Slide 14): 2x2 Relative Structural Vulnerability Screening Matrix."""
    set_chart_style()
    fig, ax = plt.subplots(figsize=(13, 8.2), dpi=300)

    med_p0 = df['poverty_rate_p0'].median()
    med_v  = df['vulnerability_score'].median()

    quad_palette = {
        'Kuadran I (Prioritas Utama)': '#D55E00',
        'Kuadran II (Kerentanan Tersembunyi)': '#E69F00',
        'Kuadran III (Kantong Kemiskinan Daya Beli)': '#CC79A7',
        'Kuadran IV (Wilayah Terbina/Mapan)': '#0072B2'
    }

    sns.scatterplot(
        data=df,
        x='poverty_rate_p0',
        y='vulnerability_score',
        hue='vulnerability_quadrant',
        palette=quad_palette,
        alpha=0.75,
        s=55,
        edgecolor='white',
        linewidth=0.6,
        legend=False,
        ax=ax
    )

    ax.axvline(med_p0, color='#333333', linestyle='--', linewidth=1.3, alpha=0.85)
    ax.axhline(med_v, color='#333333', linestyle='--', linewidth=1.3, alpha=0.85)

    ax.text(med_p0 + 0.35, 0.68, f'Median P0: {med_p0:.2f}%\n(Garis Pemisah Kemiskinan)', 
            fontsize=8.5, color='#333333', fontweight='bold', va='center',
            bbox=dict(boxstyle='square,pad=0.25', facecolor='white', edgecolor='#B0B0B0', alpha=0.9))

    ax.text(43.2, med_v + 0.015, f'Median V_struc: {med_v:.3f} (Pemisah Kerentanan)', 
            fontsize=8.5, color='#333333', fontweight='bold', ha='right', va='bottom',
            bbox=dict(boxstyle='square,pad=0.25', facecolor='white', edgecolor='#B0B0B0', alpha=0.9))

    box_q1 = dict(boxstyle='round,pad=0.5', facecolor='#FFF5EB', edgecolor='#D55E00', linewidth=1.3, alpha=0.95)
    box_q2 = dict(boxstyle='round,pad=0.5', facecolor='#FFFDF0', edgecolor='#E69F00', linewidth=1.3, alpha=0.95)
    box_q3 = dict(boxstyle='round,pad=0.5', facecolor='#FAF0F5', edgecolor='#CC79A7', linewidth=1.3, alpha=0.95)
    box_q4 = dict(boxstyle='round,pad=0.5', facecolor='#F0F7FA', edgecolor='#0072B2', linewidth=1.3, alpha=0.95)

    ax.text(1.0, 1.01, 
            'KUADRAN II: KERENTANAN TERSEMBUNYI\n'
            '• 95 Daerah (18.5%) | P0 < 10.5% | V_struc ≥ 0.27\n'
            '• Akar: Sanitasi & air minum rapuh\n'
            '• Aksi: Penguatan sarana dasar preventif\n'
            '  guna mencegah kerentanan jatuh miskin',
            fontsize=8.5, fontweight='bold', color='#B84D00', bbox=box_q2, va='top')

    ax.text(12.0, 1.01, 
            'KUADRAN I: PRIORITAS UTAMA (BEBAN GANDA)\n'
            '• 162 Daerah (31.5%) | P0 ≥ 10.5% | V_struc ≥ 0.27\n'
            '• Akar: Kemiskinan struktural +\n'
            '  krisis parah infrastruktur & SDM\n'
            '• Aksi: Rehabilitasi darurat terpadu\n'
            '  (Bansos tunai + sarana fisik)',
            fontsize=8.5, fontweight='bold', color='#B33000', bbox=box_q1, va='top')

    ax.text(1.0, 0.01, 
            'KUADRAN IV: WILAYAH TERBINA / MAPAN\n'
            '• 162 Daerah (31.5%) | P0 < 10.5% | V_struc < 0.27\n'
            '• Karakteristik: Infrastruktur & ekonomi kuat\n'
            '• Aksi: Rujukan pertumbuhan & inovasi regional',
            fontsize=8.5, fontweight='bold', color='#004C7A', bbox=box_q4, va='bottom')

    ax.text(27.0, 0.01, 
            'KUADRAN III: KANTONG KEMISKINAN DAYA BELI\n'
            '• 95 Daerah (18.5%) | P0 ≥ 10.5% | V_struc < 0.27\n'
            '• Akar: Sarana dasar memadai, namun daya beli & kerja terbatas\n'
            '• Aksi: Padat karya tunai, stimulus UMKM, & bantuan daya beli',
            fontsize=8.5, fontweight='bold', color='#8A3B66', bbox=box_q3, va='bottom')

    benchmark_points = [
        ('Kab. Nduga', 37.18, 0.9557, (31.0, 0.95), '#D55E00'),
        ('Kab. Intan Jaya', 41.66, 0.7600, (35.0, 0.63), '#D55E00'),
        ('Kab. Sampang', 23.76, 0.2589, (18.5, 0.16), '#CC79A7'),
        ('Kota Surabaya', 5.23, 0.1205, (1.8, 0.23), '#0072B2'),
        ('Kab. Lebak', 10.29, 0.4418, (4.0, 0.53), '#E69F00'),
    ]
    for name, px, py, (tx, ty), col in benchmark_points:
        ax.annotate(
            f'{name}\n(P0: {px:.1f}%)',
            xy=(px, py),
            xytext=(tx, ty),
            fontsize=8,
            fontweight='bold',
            color='#222222',
            bbox=dict(boxstyle='square,pad=0.25', facecolor='white', edgecolor=col, alpha=0.9),
            arrowprops=dict(arrowstyle='->', connectionstyle='arc3,rad=0.15', color='#444444', lw=1.0)
        )

    ax.set_title('Matriks Skrining Kerentanan 2x2: Menyaring Intervensi Berdasarkan Akar Kebutuhan Riil\n'
                 'Diferensiasi intervensi darurat (Kuadran I), perlindungan preventif (Kuadran II), dan stimulus ekonomi (Kuadran III)',
                 fontsize=12.5, fontweight='bold', pad=15, loc='left')
    ax.set_xlabel('Tingkat Kemiskinan Aktual (P0 %)', fontsize=10.5, fontweight='bold')
    ax.set_ylabel('Indeks Kerentanan Struktural Relatif (V_struc)', fontsize=10.5, fontweight='bold')
    ax.set_xlim(0.2, 43.8)
    ax.set_ylim(-0.02, 1.05)
    ax.grid(True, linestyle=':', alpha=0.35)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    plt.tight_layout()
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    return fig

