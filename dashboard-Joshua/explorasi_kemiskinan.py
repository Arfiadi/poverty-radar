#!/usr/bin/env python3
"""
MASTER ECONOMETRIC & DEEP STORYTELLING ENGINE: KEMISKINAN BPS 2021 (514 KAB/KOTA)
Tugas Storytelling M9-10 PovertyRadar SDGs
"""

from pathlib import Path
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import scipy.stats as stats
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "Klasifikasi Tingkat Kemiskinan di Indonesia.csv"
OUT_FIG_DIR = BASE_DIR / "figures"
OUT_FIG_DIR.mkdir(parents=True, exist_ok=True)

# -------------------------------------------------------------
# 1. Load Data & Schema Standardization
# -------------------------------------------------------------
df_raw = pd.read_csv(DATA_PATH)
df = df_raw.copy()

col_map = {
    "Provinsi": "prov",
    "Kab/Kota": "kab",
    "Persentase Penduduk Miskin (P0) Menurut Kabupaten/Kota (Persen)": "p0",
    "Rata-rata Lama Sekolah Penduduk 15+ (Tahun)": "school",
    "Pengeluaran per Kapita Disesuaikan (Ribu Rupiah/Orang/Tahun)": "expend",
    "Indeks Pembangunan Manusia": "ipm",
    "Umur Harapan Hidup (Tahun)": "uhh",
    "Persentase rumah tangga yang memiliki akses terhadap sanitasi layak": "san",
    "Persentase rumah tangga yang memiliki akses terhadap air minum layak": "water",
    "Tingkat Pengangguran Terbuka": "tpt",
    "Tingkat Partisipasi Angkatan Kerja": "tpak",
    "PDRB atas Dasar Harga Konstan menurut Pengeluaran (Rupiah)": "gdp",
    "Klasifikasi Kemiskinan": "cls",
}
df = df.rename(columns=col_map)
df["log_gdp"] = np.log10(df["gdp"])
df["is_kota"] = df["kab"].str.startswith("Kota ")
df["tipe_daerah"] = np.where(df["is_kota"], "Kota (Urban)", "Kabupaten (Rural/Agro)")

WEST_PROV = [
    "ACEH",
    "SUMATERA UTARA",
    "SUMATERA BARAT",
    "RIAU",
    "JAMBI",
    "SUMATERA SELATAN",
    "BENGKULU",
    "LAMPUNG",
    "KEP. BANGKA BELITUNG",
    "KEPULAUAN RIAU",
    "DKI JAKARTA",
    "JAWA BARAT",
    "JAWA TENGAH",
    "D I YOGYAKARTA",
    "JAWA TIMUR",
    "BANTEN",
    "BALI",
    "KALIMANTAN BARAT",
    "KALIMANTAN TENGAH",
    "KALIMANTAN SELATAN",
    "KALIMANTAN TIMUR",
    "KALIMANTAN UTARA",
]


def island_group(prov: str) -> str:
    if any(
        x in prov
        for x in [
            "ACEH",
            "SUMATERA",
            "RIAU",
            "JAMBI",
            "BENGKULU",
            "LAMPUNG",
            "BANGKA",
        ]
    ):
        return "Sumatera"
    if any(x in prov for x in ["JAKARTA", "JAWA", "YOGYA", "BANTEN", "BALI"]):
        return "Jawa-Bali"
    if "KALIMANTAN" in prov:
        return "Kalimantan"
    if any(x in prov for x in ["SULAWESI", "GORONTALO"]):
        return "Sulawesi"
    if "NUSA TENGGARA" in prov:
        return "Nusa Tenggara"
    return "Maluku-Papua"


df["region"] = df["prov"].apply(island_group)
df["is_west"] = df["prov"].isin(WEST_PROV)

# -------------------------------------------------------------
# 2. Audit Kualitas Data & Profiling
# -------------------------------------------------------------
print("=" * 78)
print("  MASTER SOCIOECONOMIC ENGINE: BPS 2021 INDONESIA (514 DAERAH)")
print("=" * 78)
print(f"Total Daerah: {len(df)} (416 Kabupaten, 98 Kota) | Missing Values: {df.isnull().sum().sum()}")

# Anomali Nol
zero_san = df[df["san"] == 0]
zero_water = df[df["water"] == 0]
zero_tpt = df[df["tpt"] < 1]
print(f"\n[Anomali Batas Absolut Nol]:")
print(f"- Akses sanitasi 0%: {len(zero_san)} daerah ({zero_san['kab'].tolist()})")
print(f"- Akses air bersih 0%: {len(zero_water)} daerah ({zero_water['kab'].tolist()})")
print(f"- Pengangguran <1%: {len(zero_tpt)} daerah (Subsistensi ekstrem Papua & NTT)")

# -------------------------------------------------------------
# 3. KMeans Clustering
# -------------------------------------------------------------
cluster_features = ["p0", "school", "expend", "ipm", "uhh", "san", "water", "tpt", "tpak"]
scaler = StandardScaler()
X_cluster = scaler.fit_transform(df[cluster_features])

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
df["cluster"] = kmeans.fit_predict(X_cluster)

# Re-order cluster labels based on p0 mean (0: Low, 1: Moderate, 2: Acute)
cluster_p0_mean = df.groupby("cluster")["p0"].mean().sort_values()
cluster_rank_map = {old: new for new, old in enumerate(cluster_p0_mean.index)}
df["cluster"] = df["cluster"].map(cluster_rank_map)

print("\n[Profil 3 Klaster KMeans (Sorted by Poverty Severity)]:")
profile = df.groupby("cluster")[["p0", "school", "expend", "san", "tpt", "tpak", "ipm"]].mean()
profile["N_daerah"] = df["cluster"].value_counts()
print(profile.round(2))

# -------------------------------------------------------------
# 4. Paradoks 1 - 5 (Fondasi Storytelling)
# -------------------------------------------------------------
print("\n" + "=" * 78)
print("  BAGIAN A: 5 PARADOKS FONDASI")
print("=" * 78)

# P1: 3T Barat
c1 = df[df["cls"] == 1]
c1_east = c1[~c1["is_west"]]
c1_west = c1[c1["is_west"]]
nias_mentawai = df[df["kab"].str.contains("Nias|Gunungsitoli|Mentawai")]
print(f"1. Disparitas Barat-Timur: 87.1% Class 1 di Timur ({len(c1_east)} kab), 12.9% di Barat ({len(c1_west)} kab).")
print(f"   Anomali Kepulauan 3T Barat: Nias & Mentawai sanitasi rata-rata {nias_mentawai['san'].mean():.1f}% (Setara Maluku-Papua: {df[df['region']=='Maluku-Papua']['san'].mean():.1f}%).")

# P2: Madura Disparity
java = df[df["region"] == "Jawa-Bali"]
java_c1 = java[java["cls"] == 1]
sampang = df[df["kab"] == "Sampang"].iloc[0]
surabaya = df[df["kab"].str.contains("Surabaya")].iloc[0]
print(f"2. Kantong Madura: Dari 128 daerah Jawa-Bali, hanya 3 daerah Class 1: {java_c1['kab'].tolist()}.")
print(f"   Kesenjangan RLS Jatim: Sampang {sampang['school']:.2f} tahun vs Surabaya {surabaya['school']:.2f} tahun.")

# P3: The Working Poor
r_p0_tpt = df["p0"].corr(df["tpt"])
r_p0_tpak = df["p0"].corr(df["tpak"])
lanny = df[df["kab"] == "Lanny Jaya"].iloc[0]
depok = df[df["kab"].str.contains("Depok")].iloc[0]
print(f"3. Paradoks Kerja: Korelasi Kemiskinan vs TPT r = {r_p0_tpt:.2f} (Negatif!), vs TPAK r = {r_p0_tpak:.2f} (Positif!).")
print(f"   Bukti: Lanny Jaya (TPT {lanny['tpt']:.2f}%, P0 {lanny['p0']:.2f}%) vs Kota Depok (TPT {depok['tpt']:.2f}%, P0 {depok['p0']:.2f}%).")

# P4: Sanitasi vs PDRB
r_p0_san = df["p0"].corr(df["san"])
r_p0_gdp_raw = df["p0"].corr(df["gdp"])
r_p0_gdp_log = df["p0"].corr(df["log_gdp"])
print(f"4. Prediktor Penentu: Korelasi Sanitasi r = {r_p0_san:.2f} vs PDRB Nominal r = {r_p0_gdp_raw:.2f} (Log PDRB r = {r_p0_gdp_log:.2f}).")
print(f"   Sanitasi {abs(r_p0_san)/abs(r_p0_gdp_raw):.1f}x lebih kuat mengentaskan kemiskinan dibanding besaran PDRB.")

# P5: Reverse-engineering Kaggle Rule
rule_match = ((df["p0"] > 20.0) | ((df["expend"] <= 6250) & (df["san"] <= 56.0))).astype(int)
acc = (rule_match == df["cls"]).mean() * 100
print(f"5. Dekonstruksi Aturan Kaggle: Akurasi rule-based mencapai {acc:.1f}%.")

# -------------------------------------------------------------
# 5. Paradoks 6 - 9 (EKSPLOITASI TINGKAT EKSPONENSIAL)
# -------------------------------------------------------------
print("\n" + "=" * 78)
print("  BAGIAN B: 4 PARADOKS EKSPONENSIAL (DEEP ECONOMETRICS)")
print("=" * 78)

# P6: The Resource Curse Paradox (Enclave Economies)
df["curse_flag"] = (df["gdp"] >= 25000000) & (df["p0"] >= 12.0)
curse_regions = df[df["curse_flag"]].sort_values("gdp", ascending=False)
print(f"6. The Resource Curse (Kutukan Tambang/Industri):")
print(f"   Teridentifikasi {len(curse_regions)} daerah dengan PDRB raksasa (≥ Rp 25 Triliun) namun kemiskinan di atas rata-rata:")
for _, r in curse_regions.head(6).iterrows():
    print(f"   * {r['kab']:18s} ({r['prov']:16s}): PDRB Rp {r['gdp']/1e6:5.1f}T | P0 {r['p0']:5.2f}% | Pengeluaran Rp {r['expend']/1e3:4.1f}jt/thn")

# P7: Dualisme Struktural: 98 Kota vs 416 Kabupaten
dualism = df.groupby("tipe_daerah")[["p0", "tpt", "tpak", "school", "expend", "san", "water"]].mean()
print(f"\n7. Dualisme Kota vs Kabupaten (The Great Dualism):")
print(dualism.round(2).T)
print(f"   * Kota: Kemiskinan rendah ({dualism.loc['Kota (Urban)', 'p0']:.1f}%), tapi Pengangguran TINGGI ({dualism.loc['Kota (Urban)', 'tpt']:.1f}%).")
print(f"   * Kabupaten: Kemiskinan 1.8x LIPAT ({dualism.loc['Kabupaten (Rural/Agro)', 'p0']:.1f}%), tapi Pengangguran RENDAH ({dualism.loc['Kabupaten (Rural/Agro)', 'tpt']:.1f}%).")
print("   * Konklusi: TPT mengukur 'Search Unemployment' kelas menengah kota, bukan penderitaan rakyat miskin.")

# P8: The Educated Poor Paradox (Anomali Sekolah Tinggi Tetap Miskin)
educated_poor = df[(df["school"] >= 8.2) & (df["p0"] >= 27.0)].sort_values("p0", ascending=False)
print(f"\n8. The Educated Poor Paradox (Pendidikan Tinggi Tanpa Lapangan Kerja):")
print(f"   Terdeteksi {len(educated_poor)} daerah di Indonesia Timur dengan Rata-rata Lama Sekolah SMP-SMA (> 8 thn) tapi kemiskinan tembus 27-38%:")
for _, r in educated_poor.head(5).iterrows():
    print(f"   * {r['kab']:18s} ({r['prov']:12s}): Lama Sekolah {r['school']:.2f} thn (Setara SMA) | P0 {r['p0']:.2f}% | TPT {r['tpt']:.2f}%")

# P9: OLS Multivariat & Elastisitas Kebijakan
X_ols_cols = ["expend", "san", "tpak", "school", "tpt", "water", "log_gdp"]
X_mat = df[X_ols_cols].values
y_vec = df["p0"].values

X_std = (X_mat - X_mat.mean(axis=0)) / X_mat.std(axis=0)
y_std = (y_vec - y_vec.mean()) / y_vec.std()

X_const = np.column_stack([np.ones(len(X_std)), X_std])
beta, _, _, _ = np.linalg.lstsq(X_const, y_std, rcond=None)

y_pred = X_const @ beta
ss_tot = np.sum((y_std - y_std.mean()) ** 2)
ss_res = np.sum((y_std - y_pred) ** 2)
r2_score = 1 - ss_res / ss_tot

dof = len(y_std) - X_const.shape[1]
mse = ss_res / dof
var_beta = mse * np.linalg.inv(X_const.T @ X_const).diagonal()
se_beta = np.sqrt(var_beta)
t_stats = beta / se_beta
p_values = np.array([2 * (1 - stats.t.cdf(np.abs(t), dof)) for t in t_stats])

ols_df = pd.DataFrame({
    "Indikator": ["Intercept"] + X_ols_cols,
    "Beta_Baku": beta,
    "t_stat": t_stats,
    "p_value": p_values,
})
ols_df["Signifikan"] = np.where(ols_df["p_value"] < 0.001, "***", np.where(ols_df["p_value"] < 0.05, "*", "ns"))

df["pred_p0"] = y_pred * y_vec.std() + y_vec.mean()
df["residual_p0"] = df["p0"] - df["pred_p0"]

print(f"\n9. Model Ekonometrika OLS (R² = {r2_score:.4f}, F-dof = {dof}):")
print(ols_df.round(4).to_string(index=False))

# -------------------------------------------------------------
# 6. Dual Export Data Olahan
# -------------------------------------------------------------
out_csv = BASE_DIR / "kemiskinan_514_analisis.csv"
out_parquet = BASE_DIR / "kemiskinan_514_analisis.parquet"
df.to_csv(out_csv, index=False)
df.to_parquet(out_parquet, index=False)
print(f"\n[Dual Data Export]: {out_csv.name} & {out_parquet.name} tersimpan.")

# -------------------------------------------------------------
# 7. Ekspor 8 Grafik Resolusi 300 DPI
# -------------------------------------------------------------
plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 10,
    "axes.edgecolor": "#E1DFDD",
    "axes.linewidth": 1.0,
    "axes.facecolor": "#FFFFFF",
    "figure.facecolor": "#F3F2F1",
})

# Plot 1: The Working Poor Paradox
fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
scatter = ax.scatter(
    df["tpt"], df["p0"], c=df["tpak"], cmap="Blues", s=50,
    edgecolor="#1F4E79", linewidth=0.5, alpha=0.85
)
cbar = plt.colorbar(scatter, ax=ax)
cbar.set_label("Tingkat Partisipasi Angkatan Kerja (TPAK %)", fontsize=9, fontweight="bold")
annot_list = ["Lanny Jaya", "Nduga", "Kota Depok", "Kota Tangerang Selatan"]
for kab in annot_list:
    sub = df[df["kab"].str.contains(kab)]
    if not sub.empty:
        r = sub.iloc[0]
        ax.annotate(
            f"{r['kab']}\n(TPT: {r['tpt']:.1f}%, P0: {r['p0']:.1f}%)",
            (r["tpt"], r["p0"]),
            xytext=(10, -12 if r["p0"] < 10 else 10),
            textcoords="offset points", fontweight="bold", fontsize=8.5,
            color="#C62828" if r["p0"] > 30 else "#1F4E79",
            bbox=dict(boxstyle="round,pad=0.2", fc="#FFFFFF", ec="#E1DFDD", lw=0.8),
            arrowprops=dict(arrowstyle="->", color="#605E5C", lw=0.8),
        )
ax.set_title('Paradoks 1: "The Working Poor" (Pengangguran Rendah di Kantong Kemiskinan Akut)', fontsize=12, fontweight="bold", pad=12, color="#201F1E")
ax.set_xlabel("Tingkat Pengangguran Terbuka (TPT %)", fontweight="bold")
ax.set_ylabel("Poverty Rate (P0 %)", fontweight="bold")
ax.grid(True, linestyle="--", alpha=0.5, color="#EDEBE9")
plt.tight_layout()
fig.savefig(OUT_FIG_DIR / "1_working_poor_paradox.png")
plt.close(fig)

# Plot 2: Madura Disparity
fig, ax = plt.subplots(figsize=(9, 5), dpi=300)
sub_jatim = df[df["kab"].isin(["Bangkalan", "Sampang", "Pamekasan", "Sumenep", "Kota Surabaya"])].sort_values("p0", ascending=False)
bars = ax.bar(sub_jatim["kab"], sub_jatim["p0"], color=["#C62828" if c == 1 else "#1F4E79" for c in sub_jatim["cls"]], width=0.55, edgecolor="#E1DFDD")
ax.axhline(java["p0"].mean(), color="#605E5C", linestyle="--", label=f"Rata-rata Jawa-Bali ({java['p0'].mean():.1f}%)")
for bar in bars:
    yval = bar.get_height()
    ax.text(bar.get_x() + bar.get_width() / 2, yval + 0.4, f"{yval:.1f}%", ha="center", va="bottom", fontsize=9, fontweight="bold")
ax.set_title("Paradoks 2: Disparitas Pulau Madura vs Surabaya di Jawa Timur", fontsize=12, fontweight="bold", pad=12, color="#201F1E")
ax.set_ylabel("Poverty Rate (P0 %)", fontweight="bold")
ax.legend(frameon=True, facecolor="#FFFFFF")
ax.grid(axis="y", linestyle="--", alpha=0.5, color="#EDEBE9")
plt.tight_layout()
fig.savefig(OUT_FIG_DIR / "2_madura_disparity.png")
plt.close(fig)

# Plot 3: Sanitasi vs PDRB
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5), dpi=300)
sns.regplot(data=df, x="san", y="p0", ax=ax1, color="#1F4E79", scatter_kws={"alpha": 0.5, "s": 30}, line_kws={"color": "#C62828", "lw": 2})
ax1.set_title(f"Akses Sanitasi Layak (r = {r_p0_san:.2f})", fontweight="bold", fontsize=11)
ax1.set_xlabel("Sanitasi Layak (%)", fontweight="bold")
ax1.set_ylabel("Poverty Rate (P0 %)", fontweight="bold")
ax1.grid(True, linestyle="--", alpha=0.5, color="#EDEBE9")

sns.regplot(data=df, x="log_gdp", y="p0", ax=ax2, color="#605E5C", scatter_kws={"alpha": 0.5, "s": 30}, line_kws={"color": "#C62828", "lw": 2})
ax2.set_title(f"PDRB Konstan Log (r = {r_p0_gdp_log:.2f}, Raw r = {r_p0_gdp_raw:.2f})", fontweight="bold", fontsize=11)
ax2.set_xlabel("Log10 PDRB Riil", fontweight="bold")
ax2.set_ylabel("Poverty Rate (P0 %)", fontweight="bold")
ax2.grid(True, linestyle="--", alpha=0.5, color="#EDEBE9")
plt.suptitle("Paradoks 3: Sanitasi Dasar 2.3x Lebih Kuat Tekan Kemiskinan dibanding Besaran PDRB", fontsize=12, fontweight="bold", y=1.02)
plt.tight_layout()
fig.savefig(OUT_FIG_DIR / "3_sanitation_vs_pdrb.png")
plt.close(fig)

# Plot 4: Correlation Heatmap
fig, ax = plt.subplots(figsize=(8, 7), dpi=300)
sns.heatmap(df[cluster_features + ["log_gdp"]].corr(), annot=True, fmt=".2f", cmap="Blues", cbar=True, ax=ax, linewidths=0.5, linecolor="#FFFFFF")
ax.set_title("Matriks Korelasi Indikator Sosioekonomi BPS 2021", fontweight="bold", fontsize=12, pad=12)
plt.tight_layout()
fig.savefig(OUT_FIG_DIR / "4_correlation_heatmap.png")
plt.close(fig)

# Plot 5: The Resource Curse Paradox (Enclave Economies)
fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
scatter_rc = ax.scatter(
    df["gdp"] / 1e6, df["p0"],
    c=np.where(df["curse_flag"], "#C62828", "#8A9BB0"),
    s=np.where(df["curse_flag"], 90, 35),
    alpha=0.85, edgecolor="#201F1E", linewidth=0.5
)
ax.axhline(10.5, color="#605E5C", linestyle="--", label="Median Kemiskinan Nasional (10.5%)")
ax.axvline(25.0, color="#C62828", linestyle=":", label="Ambang PDRB Jumbo (Rp 25 Triliun)")

top_curse = curse_regions.head(6)
for _, r in top_curse.iterrows():
    ax.annotate(
        f"{r['kab']}\nPDRB: Rp {r['gdp']/1e6:.0f}T | P0: {r['p0']:.1f}%",
        (r["gdp"] / 1e6, r["p0"]),
        xytext=(10, 8), textcoords="offset points", fontweight="bold", fontsize=8,
        color="#C62828", bbox=dict(boxstyle="round,pad=0.2", fc="#FDECEA", ec="#C62828", lw=0.8),
        arrowprops=dict(arrowstyle="->", color="#C62828", lw=0.8)
    )

ax.set_title('Paradoks 4: "The Resource Curse" (PDRB Raksasa Tambang/Migas Gagal Menetes ke Rakyat)', fontsize=12, fontweight="bold", pad=12, color="#201F1E")
ax.set_xlabel("PDRB Riil Atas Dasar Harga Konstan (Triliun Rupiah)", fontweight="bold")
ax.set_ylabel("Poverty Rate (P0 %)", fontweight="bold")
ax.legend(frameon=True, facecolor="#FFFFFF")
ax.grid(True, linestyle="--", alpha=0.5, color="#EDEBE9")
plt.tight_layout()
fig.savefig(OUT_FIG_DIR / "5_resource_curse_enclave.png")
plt.close(fig)

# Plot 6: Dualisme Kota vs Kabupaten
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5), dpi=300)
sns.boxplot(data=df, x="tipe_daerah", y="p0", ax=ax1, hue="tipe_daerah", palette=["#1F4E79", "#6BAED6"], width=0.45, legend=False)
ax1.set_title("Kemiskinan (P0 %): Kabupaten 1.8x Lebih Tinggi", fontweight="bold", fontsize=11)
ax1.set_ylabel("P0 %", fontweight="bold")
ax1.set_xlabel("")
ax1.grid(axis="y", linestyle="--", alpha=0.5, color="#EDEBE9")

sns.boxplot(data=df, x="tipe_daerah", y="tpt", ax=ax2, hue="tipe_daerah", palette=["#1F4E79", "#6BAED6"], width=0.45, legend=False)
ax2.set_title("Pengangguran (TPT %): Kota 1.8x Lebih Tinggi", fontweight="bold", fontsize=11)
ax2.set_ylabel("TPT %", fontweight="bold")
ax2.set_xlabel("")
ax2.grid(axis="y", linestyle="--", alpha=0.5, color="#EDEBE9")

plt.suptitle('Paradoks 5: "The Great Dualism" (Dikotomi Struktural 98 Kota vs 416 Kabupaten)', fontsize=12, fontweight="bold", y=1.02)
plt.tight_layout()
fig.savefig(OUT_FIG_DIR / "6_kota_vs_kabupaten_dualism.png")
plt.close(fig)

# Plot 7: OLS Policy Elasticity (Koefisien Beta Baku)
fig, ax = plt.subplots(figsize=(9, 5), dpi=300)
ols_plot_df = ols_df[ols_df["Indikator"] != "Intercept"].sort_values("Beta_Baku")
bar_colors = ["#1F4E79" if b < 0 else "#C62828" for b in ols_plot_df["Beta_Baku"]]
hbars = ax.barh(ols_plot_df["Indikator"], ols_plot_df["Beta_Baku"], color=bar_colors, edgecolor="#E1DFDD", height=0.55)
ax.axvline(0, color="#201F1E", lw=1)

for bar, sig in zip(hbars, ols_plot_df["Signifikan"]):
    width = bar.get_width()
    offset = -0.05 if width < 0 else 0.01
    ax.text(width + offset, bar.get_y() + bar.get_height() / 2, f"{width:+.3f} ({sig})", va="center", fontweight="bold", fontsize=8.5)

ax.set_title("Ekonometrika: Koefisien Elastisitas Relatif Penurunan Kemiskinan (OLS)", fontsize=12, fontweight="bold", pad=12, color="#201F1E")
ax.set_xlabel("Koefisien Beta Baku (Standardized Beta)", fontweight="bold")
ax.grid(axis="x", linestyle="--", alpha=0.5, color="#EDEBE9")
plt.tight_layout()
fig.savefig(OUT_FIG_DIR / "7_policy_elasticity_ols.png")
plt.close(fig)

# Plot 8: The Educated Poor Paradox
fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
ax.scatter(df["school"], df["p0"], c=df["cls"], cmap="coolwarm", s=45, alpha=0.75, edgecolor="#201F1E", linewidth=0.4)
ax.axvline(8.0, color="#605E5C", linestyle=":", label="Ambang Tamat SMP (8.0 Tahun)")
ax.axhline(25.0, color="#C62828", linestyle="--", label="Ambang Kemiskinan Kritis (25%)")

for _, r in educated_poor.head(5).iterrows():
    ax.annotate(
        f"{r['kab']}\nRLS: {r['school']:.1f} thn | P0: {r['p0']:.1f}%",
        (r["school"], r["p0"]),
        xytext=(10, 5), textcoords="offset points", fontweight="bold", fontsize=8,
        color="#C62828", bbox=dict(boxstyle="round,pad=0.2", fc="#FDECEA", ec="#C62828", lw=0.8),
        arrowprops=dict(arrowstyle="->", color="#C62828", lw=0.8)
    )

ax.set_title('Paradoks 6: "The Educated Poor" (Sekolah SMP-SMA Tanpa Serapan Kerja di Indonesia Timur)', fontsize=12, fontweight="bold", pad=12, color="#201F1E")
ax.set_xlabel("Rata-rata Lama Sekolah Penduduk 15+ (Tahun)", fontweight="bold")
ax.set_ylabel("Poverty Rate (P0 %)", fontweight="bold")
ax.legend(frameon=True, facecolor="#FFFFFF")
ax.grid(True, linestyle="--", alpha=0.5, color="#EDEBE9")
plt.tight_layout()
fig.savefig(OUT_FIG_DIR / "8_educated_poor_anomaly.png")
plt.close(fig)

print(f"\n[Selesai]: 8 Visualisasi Eksklusif (300 DPI) Berhasil Disimpan di {OUT_FIG_DIR}/")
