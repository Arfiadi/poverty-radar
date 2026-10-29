"""
Centralized Configuration & Project Constants
PovertyRadar SDGs - Indonesian Regency/City Clustering & Relative Vulnerability
"""

from pathlib import Path

# Repository root directory
REPO_DIR = Path(__file__).resolve().parents[2]

# Data directories
DATA_DIR = REPO_DIR / "data"
DATA_RAW_DIR = DATA_DIR / "raw"
DATA_INTERIM_DIR = DATA_DIR / "interim"
DATA_PROCESSED_DIR = DATA_DIR / "processed"

# Reports & figures directories
REPORTS_DIR = REPO_DIR / "reports"
FIGURES_DIR = REPORTS_DIR / "figures"

# Canonical file paths
RAW_DATA_PATH = DATA_RAW_DIR / "Klasifikasi Tingkat Kemiskinan di Indonesia.csv"
CLEANED_DATA_PATH = DATA_INTERIM_DIR / "poverty_data_cleaned.csv"
PROCESSED_DATA_PATH = DATA_PROCESSED_DIR / "poverty_clusters.csv"
PROCESSED_SUMMARY_PATH = DATA_PROCESSED_DIR / "poverty_cluster_summary.csv"

# Global reproducibility seed
SEED = 42

# 7 Clustering feature columns (Strictly NO target leakage, NO composite HDI)
FEATURE_COLS = [
    "avg_school_years",
    "life_expectancy",
    "expenditure_per_capita",
    "sanitation_access_pct",
    "clean_water_access_pct",
    "unemployment_rate_tpt",
    "log_pdrb"
]

# Excluded columns policy
EXCLUDED_COLS = [
    "poverty_rate_p0",           # Reserved strictly for post-clustering external validation & screening
    "poverty_class_target",      # Dropped: unverified binary classification label
    "labor_participation_tpak",  # Dropped: subsistence informal labor paradox
    "human_dev_index"            # Dropped: multicollinearity with sub-indices
]

# Standardized 4 cluster personas
CLUSTER_LABELS = {
    0: "Klaster 1: Perkotaan Modern & Formal",
    1: "Klaster 2: Kabupaten Penyangga Mapan",
    2: "Klaster 3: Perdesaan Agraris Rentan",
    3: "Klaster 4: Wilayah 3T Deprivasi Akut"
}

# Colorblind-safe Okabe-Ito color palette
CLUSTER_PALETTE = [
    "#0072B2",  # Deep Blue (Klaster 1)
    "#56B4E9",  # Sky Blue (Klaster 2)
    "#E69F00",  # Amber/Yellow (Klaster 3)
    "#D55E00"   # Vermillion (Klaster 4)
]

# National screening medians
MEDIAN_NATIONAL_P0 = 10.46
MEDIAN_NATIONAL_V_STRUC = 0.272

# 2x2 Matrix screening quadrant definitions
QUADRANT_LABELS = {
    1: "Kuadran I (Prioritas Utama)",
    2: "Kuadran II (Kerentanan Tersembunyi)",
    3: "Kuadran III (Kantong Kemiskinan Daya Beli)",
    4: "Kuadran IV (Wilayah Terbina/Mapan)"
}

QUADRANT_PALETTE = {
    "Kuadran I (Prioritas Utama)": "#D55E00",
    "Kuadran II (Potensi Rentan Tersembunyi)": "#E69F00",
    "Kuadran III (Kantong Kemiskinan / Enklave)": "#CC79A7",
    "Kuadran IV (Kondisi Tangguh)": "#0072B2"
}

