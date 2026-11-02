"""
Export canonical processed data and statistical benchmarks to JSON payloads
for the PovertyRadar SDGs React + Vite frontend dashboard.
"""

from pathlib import Path
import json
import pandas as pd
import numpy as np
import statsmodels.api as sm

REPO_DIR = Path(__file__).resolve().parents[1]
DATA_PROCESSED_DIR = REPO_DIR / "data" / "processed"
DATA_INTERIM_DIR = REPO_DIR / "data" / "interim"
FRONTEND_DATA_DIR = REPO_DIR / "dashboard" / "public" / "data"


def export_all():
    print(f"Creating output directory: {FRONTEND_DATA_DIR}")
    FRONTEND_DATA_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Load Data
    clusters_path = DATA_PROCESSED_DIR / "poverty_clusters.csv"
    summary_path = DATA_PROCESSED_DIR / "poverty_cluster_summary.csv"
    policy_path = DATA_PROCESSED_DIR / "policy_recommendations_matrix.csv"

    assert clusters_path.exists(), f"Missing {clusters_path}"
    assert summary_path.exists(), f"Missing {summary_path}"
    assert policy_path.exists(), f"Missing {policy_path}"

    df_clusters = pd.read_csv(clusters_path)
    df_summary = pd.read_csv(summary_path)
    df_policy = pd.read_csv(policy_path)

    # Integrity assertions
    assert len(df_clusters) == 514, f"Expected 514 rows, got {len(df_clusters)}"
    assert df_clusters.isnull().sum().sum() == 0, "Null values detected in poverty_clusters.csv"
    assert "poverty_class_target" not in df_clusters.columns, "Target leakage detected!"

    # 2. National Benchmarks
    p0 = df_clusters["poverty_rate_p0"]
    min_idx = p0.idxmin()
    max_idx = p0.idxmax()

    # Acute poverty pockets (P0 >= 20%)
    acute_mask = df_clusters["poverty_rate_p0"] >= 20.0
    total_acute = int(acute_mask.sum())
    eastern_regions = ["Maluku & Papua", "Bali & Nusa Tenggara"]
    eastern_acute = int(df_clusters[acute_mask]["region_pulau"].isin(eastern_regions).sum())
    western_acute = total_acute - eastern_acute
    assert eastern_acute + western_acute == total_acute, "Acute pockets partition mismatch!"

    def format_region_name(tipe: str, name: str) -> str:
        return name if name.lower().startswith(tipe.lower()) else f"{tipe} {name}"

    benchmarks = {
        "n_regions": len(df_clusters),
        "n_provinces": int(df_clusters["provinsi"].nunique()),
        "median_p0": round(float(p0.median()), 2),
        "mean_p0": round(float(p0.mean()), 2),
        "min_p0": round(float(p0.min()), 2),
        "min_p0_region": format_region_name(df_clusters.loc[min_idx, "tipe_wilayah"], df_clusters.loc[min_idx, "kab_kota"]),
        "min_p0_province": df_clusters.loc[min_idx, "provinsi"],
        "max_p0": round(float(p0.max()), 2),
        "max_p0_region": format_region_name(df_clusters.loc[max_idx, "tipe_wilayah"], df_clusters.loc[max_idx, "kab_kota"]),
        "max_p0_province": df_clusters.loc[max_idx, "provinsi"],
        "disparity_ratio": round(float(p0.max() / p0.min()), 2),
        "total_acute_pockets": total_acute,
        "eastern_acute_count": eastern_acute,
        "eastern_acute_pct": round(float(eastern_acute / total_acute * 100), 1),
        "western_acute_count": western_acute,
        "western_acute_pct": round(float(western_acute / total_acute * 100), 1),
        "median_v_struc": round(float(df_clusters["vulnerability_score"].median()), 4),
        "dualism_kab_p0": round(float(df_clusters[df_clusters["tipe_wilayah"] == "Kabupaten"]["poverty_rate_p0"].mean()), 2),
        "dualism_kota_p0": round(float(df_clusters[df_clusters["tipe_wilayah"] == "Kota"]["poverty_rate_p0"].mean()), 2),
        "dualism_kab_tpt": round(float(df_clusters[df_clusters["tipe_wilayah"] == "Kabupaten"]["unemployment_rate_tpt"].mean()), 2),
        "dualism_kota_tpt": round(float(df_clusters[df_clusters["tipe_wilayah"] == "Kota"]["unemployment_rate_tpt"].mean()), 2),
    }

    # 3. OLS Standardized Coefficients (Beta)
    feature_cols = [
        "expenditure_per_capita",
        "sanitation_access_pct",
        "log_pdrb",
        "labor_participation_tpak",
        "avg_school_years",
        "unemployment_rate_tpt"
    ]
    # Compute standardized variables (Z-score)
    X_std = (df_clusters[feature_cols] - df_clusters[feature_cols].mean()) / df_clusters[feature_cols].std()
    y_std = (df_clusters["poverty_rate_p0"] - df_clusters["poverty_rate_p0"].mean()) / df_clusters["poverty_rate_p0"].std()
    X_std = sm.add_constant(X_std)
    ols_model = sm.OLS(y_std, X_std).fit()

    feature_labels = {
        "expenditure_per_capita": "Pengeluaran Riil per Kapita",
        "sanitation_access_pct": "Akses Sanitasi Layak",
        "log_pdrb": "PDRB (Skala Logaritmik)",
        "labor_participation_tpak": "Tingkat Partisipasi Kerja (TPAK)",
        "avg_school_years": "Rata-rata Lama Sekolah (RLS)",
        "unemployment_rate_tpt": "Tingkat Pengangguran Terbuka (TPT)"
    }

    ols_results = []
    for col in feature_cols:
        beta_val = float(ols_model.params[col])
        t_val = float(ols_model.tvalues[col])
        p_val = float(ols_model.pvalues[col])
        ols_results.append({
            "feature": col,
            "label": feature_labels[col],
            "beta": round(beta_val, 3),
            "t_stat": round(t_val, 2),
            "p_val": p_val,
            "significance": "***" if p_val < 0.001 else ("**" if p_val < 0.01 else ("*" if p_val < 0.05 else "ns"))
        })
    # Sort by absolute beta descending
    ols_results.sort(key=lambda x: abs(x["beta"]), reverse=True)

    # 4. Extreme Boundary Cases (0.00% verification in 3T regions)
    boundary_cases = [
        {
            "region": "Kab. Deiyai",
            "province": "PAPUA",
            "variable": "sanitation_access_pct",
            "variable_label": "Akses Sanitasi Layak",
            "value": 0.0,
            "unit": "%",
            "p0": 40.59,
            "context": "Wilayah pedalaman pegunungan Papua dengan keterisolasian topografi ekstrem; rumah tangga mengandalkan sanitasi alamiah terbuka."
        },
        {
            "region": "Kab. Mamberamo Tengah",
            "province": "PAPUA",
            "variable": "clean_water_access_pct",
            "variable_label": "Akses Air Minum Terlindung",
            "value": 0.0,
            "unit": "%",
            "p0": 36.76,
            "context": "Sumber air mengandalkan aliran sungai mentah permukaan hutan hujan tanpa infrastruktur perpipaan PDAM maupun sumur bor terlindung."
        },
        {
            "region": "Kab. Nduga",
            "province": "PAPUA",
            "variable": "unemployment_rate_tpt",
            "variable_label": "Pengangguran Terbuka (TPT)",
            "value": 0.0,
            "unit": "%",
            "p0": 37.18,
            "tpak": 97.93,
            "context": "Warga wajib bekerja subsistensi harian (kebun/hutan) demi bertahan hidup; ketiadaan pasar kerja formal membuat konsep menganggur mencari kerja tidak berlaku."
        }
    ]

    # 5. Kaggle Reverse-Engineering Rule Metrics (Page 5 Tab 2)
    # Rule: Class 1 if (P0 > 20.0%) OR (expenditure <= 6250 Ribu Rp AND sanitation <= 56.0%)
    raw_path = REPO_DIR / "data" / "raw" / "Klasifikasi Tingkat Kemiskinan di Indonesia.csv"
    assert raw_path.exists(), f"Missing raw dataset: {raw_path}"
    df_raw = pd.read_csv(raw_path)
    p0_raw = df_raw["Persentase Penduduk Miskin (P0) Menurut Kabupaten/Kota (Persen)"]
    exp_raw = df_raw["Pengeluaran per Kapita Disesuaikan (Ribu Rupiah/Orang/Tahun)"]
    san_raw = df_raw["Persentase rumah tangga yang memiliki akses terhadap sanitasi layak"]
    actual_class = df_raw["Klasifikasi Kemiskinan"] == 1

    rule_pred = (p0_raw > 20.0) | ((exp_raw <= 6250) & (san_raw <= 56.0))
    matches = int((rule_pred == actual_class).sum())
    kaggle_reconstruction_pct = round(matches / len(df_raw) * 100, 2)
    assert matches == 508, f"Expected 508 matches, got {matches}"

    kaggle_rule_info = {
        "formula": "Class 1 <=> (P0 > 20.0%) OR (Pengeluaran <= Rp6.25 Juta AND Sanitasi <= 56.0%)",
        "accuracy_pct": kaggle_reconstruction_pct,
        "matched_regions": matches,
        "total_regions": len(df_raw),
        "conclusion": "Label biner Kaggle terbukti merupakan aturan heuristik deterministik sederhana, bukan ground truth BPS, memvalidasi penolakan model klasifikasi terawasi."
    }

    # 6. Export to JSON
    with open(FRONTEND_DATA_DIR / "national_benchmarks.json", "w", encoding="utf-8") as f:
        json.dump(benchmarks, f, indent=2)
    with open(FRONTEND_DATA_DIR / "ols_coefficients.json", "w", encoding="utf-8") as f:
        json.dump(ols_results, f, indent=2)
    with open(FRONTEND_DATA_DIR / "boundary_cases.json", "w", encoding="utf-8") as f:
        json.dump(boundary_cases, f, indent=2)
    with open(FRONTEND_DATA_DIR / "kaggle_rule_info.json", "w", encoding="utf-8") as f:
        json.dump(kaggle_rule_info, f, indent=2)

    df_clusters.to_json(FRONTEND_DATA_DIR / "poverty_districts.json", orient="records", indent=2)
    df_summary.to_json(FRONTEND_DATA_DIR / "cluster_summary.json", orient="records", indent=2)
    df_policy.to_json(FRONTEND_DATA_DIR / "policy_matrix.json", orient="records", indent=2)

    print("Success: All JSON payloads exported to", FRONTEND_DATA_DIR)
    print(f"Districts: {len(df_clusters)} rows")
    print(f"Cluster Summary: {len(df_summary)} rows")
    print(f"Policy Matrix: {len(df_policy)} rows")
    print(f"OLS Standardized Betas: {len(ols_results)} features")


if __name__ == "__main__":
    export_all()
