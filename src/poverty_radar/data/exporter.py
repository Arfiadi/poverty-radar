"""
Dashboard payload exporter module.
PovertyRadar SDGs - Exports processed datasets, statistical benchmarks,
and econometric OLS coefficients to JSON for the frontend dashboard.
"""

import json
import logging
from pathlib import Path
from typing import Optional
import pandas as pd
import statsmodels.api as sm

from poverty_radar.config import (
    RAW_DATA_PATH,
    PROCESSED_DATA_PATH,
    PROCESSED_SUMMARY_PATH,
    PROCESSED_POLICY_MATRIX_PATH,
    FRONTEND_DATA_DIR,
)

logger = logging.getLogger("poverty_radar.exporter")


def export_dashboard_payloads(target_dir: Optional[Path] = None) -> None:
    """
    Export canonical processed data and statistical benchmarks to JSON payloads
    for the PovertyRadar SDGs React + Vite frontend dashboard.
    """
    out_dir = target_dir or FRONTEND_DATA_DIR
    out_dir.mkdir(parents=True, exist_ok=True)
    logger.info("Exporting dashboard JSON payloads to: %s", out_dir)

    # 1. Load Data
    if not PROCESSED_DATA_PATH.exists():
        raise FileNotFoundError(f"Missing {PROCESSED_DATA_PATH}")
    if not PROCESSED_SUMMARY_PATH.exists():
        raise FileNotFoundError(f"Missing {PROCESSED_SUMMARY_PATH}")
    if not PROCESSED_POLICY_MATRIX_PATH.exists():
        raise FileNotFoundError(f"Missing {PROCESSED_POLICY_MATRIX_PATH}")

    df_clusters = pd.read_csv(PROCESSED_DATA_PATH)
    df_summary = pd.read_csv(PROCESSED_SUMMARY_PATH)
    df_policy = pd.read_csv(PROCESSED_POLICY_MATRIX_PATH)

    # Integrity assertions
    assert len(df_clusters) == 514, f"Expected 514 rows, got {len(df_clusters)}"
    assert df_clusters.isnull().sum().sum() == 0, "Null values detected in poverty_clusters.csv"
    assert "poverty_class_target" not in df_clusters.columns, "Target leakage detected!"

    # 2. National Benchmarks
    p0 = df_clusters["poverty_rate_p0"]
    min_idx = p0.idxmin()
    max_idx = p0.idxmax()

    acute_mask = df_clusters["poverty_rate_p0"] >= 20.0
    total_acute = int(acute_mask.sum())
    eastern_regions = ["Maluku & Papua", "Bali & Nusa Tenggara"]
    eastern_acute = int(df_clusters[acute_mask]["region_pulau"].isin(eastern_regions).sum())
    western_acute = total_acute - eastern_acute
    assert eastern_acute + western_acute == total_acute, "Acute pockets partition mismatch!"

    def format_region_name(tipe: str, name: str) -> str:
        return name if name.lower().startswith(tipe.lower()) else f"{tipe} {name}"

    min_reg = format_region_name(
        str(df_clusters.loc[min_idx, "tipe_wilayah"]),
        str(df_clusters.loc[min_idx, "kab_kota"])
    )
    max_reg = format_region_name(
        str(df_clusters.loc[max_idx, "tipe_wilayah"]),
        str(df_clusters.loc[max_idx, "kab_kota"])
    )

    kab_mask = df_clusters["tipe_wilayah"] == "Kabupaten"
    kota_mask = df_clusters["tipe_wilayah"] == "Kota"

    benchmarks = {
        "n_regions": len(df_clusters),
        "n_provinces": int(df_clusters["provinsi"].nunique()),
        "median_p0": round(float(p0.median()), 2),
        "mean_p0": round(float(p0.mean()), 2),
        "min_p0": round(float(p0.min()), 2),
        "min_p0_region": min_reg,
        "min_p0_province": str(df_clusters.loc[min_idx, "provinsi"]),
        "max_p0": round(float(p0.max()), 2),
        "max_p0_region": max_reg,
        "max_p0_province": str(df_clusters.loc[max_idx, "provinsi"]),
        "disparity_ratio": round(float(p0.max() / p0.min()), 2),
        "total_acute_pockets": total_acute,
        "eastern_acute_count": eastern_acute,
        "eastern_acute_pct": round(float(eastern_acute / total_acute * 100), 1),
        "western_acute_count": western_acute,
        "western_acute_pct": round(float(western_acute / total_acute * 100), 1),
        "median_v_struc": round(float(df_clusters["vulnerability_score"].median()), 4),
        "dualism_kab_p0": round(float(df_clusters[kab_mask]["poverty_rate_p0"].mean()), 2),
        "dualism_kota_p0": round(float(df_clusters[kota_mask]["poverty_rate_p0"].mean()), 2),
        "dualism_kab_tpt": round(float(df_clusters[kab_mask]["unemployment_rate_tpt"].mean()), 2),
        "dualism_kota_tpt": round(float(df_clusters[kota_mask]["unemployment_rate_tpt"].mean()), 2),
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
    x_sub = df_clusters[feature_cols]
    x_std = (x_sub - x_sub.mean()) / x_sub.std()
    y_sub = df_clusters["poverty_rate_p0"]
    y_std = (y_sub - y_sub.mean()) / y_sub.std()
    x_std = sm.add_constant(x_std)
    ols_model = sm.OLS(y_std, x_std).fit()

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
        if p_val < 0.001:
            sig = "***"
        elif p_val < 0.01:
            sig = "**"
        elif p_val < 0.05:
            sig = "*"
        else:
            sig = "ns"

        ols_results.append({
            "feature": col,
            "label": feature_labels[col],
            "beta": round(beta_val, 3),
            "t_stat": round(t_val, 2),
            "p_val": p_val,
            "significance": sig
        })
    ols_results.sort(key=lambda x: abs(x["beta"]), reverse=True)

    # 4. Extreme Boundary Cases
    boundary_cases = [
        {
            "region": "Kab. Deiyai",
            "province": "PAPUA",
            "variable": "sanitation_access_pct",
            "variable_label": "Akses Sanitasi Layak",
            "value": 0.0,
            "unit": "%",
            "p0": 40.59,
            "context": (
                "Wilayah pedalaman pegunungan Papua dengan keterisolasian topografi ekstrem; "
                "rumah tangga mengandalkan sanitasi alamiah terbuka."
            )
        },
        {
            "region": "Kab. Mamberamo Tengah",
            "province": "PAPUA",
            "variable": "clean_water_access_pct",
            "variable_label": "Akses Air Minum Terlindung",
            "value": 0.0,
            "unit": "%",
            "p0": 36.76,
            "context": (
                "Sumber air mengandalkan aliran sungai mentah permukaan hutan hujan tanpa "
                "infrastruktur perpipaan PDAM maupun sumur bor terlindung."
            )
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
            "context": (
                "Warga wajib bekerja subsistensi harian (kebun/hutan) demi bertahan hidup; "
                "ketiadaan pasar kerja formal membuat konsep menganggur mencari kerja tidak berlaku."
            )
        }
    ]

    # 5. Kaggle Reverse-Engineering Rule Metrics
    if not RAW_DATA_PATH.exists():
        raise FileNotFoundError(f"Missing raw dataset: {RAW_DATA_PATH}")
    df_raw = pd.read_csv(RAW_DATA_PATH)
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
        "conclusion": (
            "Label biner Kaggle merupakan aturan heuristik deterministik sederhana, "
            "bukan ground truth BPS, memvalidasi penolakan model klasifikasi terawasi."
        )
    }

    # 6. Save JSON files
    with open(out_dir / "national_benchmarks.json", "w", encoding="utf-8") as f:
        json.dump(benchmarks, f, indent=2)
    with open(out_dir / "ols_coefficients.json", "w", encoding="utf-8") as f:
        json.dump(ols_results, f, indent=2)
    with open(out_dir / "boundary_cases.json", "w", encoding="utf-8") as f:
        json.dump(boundary_cases, f, indent=2)
    with open(out_dir / "kaggle_rule_info.json", "w", encoding="utf-8") as f:
        json.dump(kaggle_rule_info, f, indent=2)

    df_clusters.to_json(out_dir / "poverty_districts.json", orient="records", indent=2)
    df_summary.to_json(out_dir / "cluster_summary.json", orient="records", indent=2)
    df_policy.to_json(out_dir / "policy_matrix.json", orient="records", indent=2)

    logger.info("All dashboard payloads successfully written to: %s", out_dir)
