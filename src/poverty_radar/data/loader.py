"""
Data loading and schema validation module.
PovertyRadar SDGs - BPS 2021 Dataset
"""

from pathlib import Path
from typing import Optional
import pandas as pd

from poverty_radar.config import (
    RAW_DATA_PATH,
    CLEANED_DATA_PATH,
    PROCESSED_DATA_PATH,
    PROCESSED_SUMMARY_PATH
)

COLUMN_RENAME_MAP = {
    'Provinsi': 'provinsi',
    'Kab/Kota': 'kab_kota',
    'Persentase Penduduk Miskin (P0) Menurut Kabupaten/Kota (Persen)': 'poverty_rate_p0',
    'Rata-rata Lama Sekolah Penduduk 15+ (Tahun)': 'avg_school_years',
    'Pengeluaran per Kapita Disesuaikan (Ribu Rupiah/Orang/Tahun)': 'expenditure_per_capita',
    'Indeks Pembangunan Manusia': 'human_dev_index',
    'Umur Harapan Hidup (Tahun)': 'life_expectancy',
    'Persentase rumah tangga yang memiliki akses terhadap sanitasi layak': 'sanitation_access_pct',
    'Persentase rumah tangga yang memiliki akses terhadap air minum layak': 'clean_water_access_pct',
    'Tingkat Pengangguran Terbuka': 'unemployment_rate_tpt',
    'Tingkat Partisipasi Angkatan Kerja': 'labor_participation_tpak',
    'PDRB atas Dasar Harga Konstan menurut Pengeluaran (Rupiah)': 'grdp_constant_million_idr',
    'Klasifikasi Kemiskinan': 'poverty_class_target'
}


def load_raw_data(filepath: Optional[Path] = None) -> pd.DataFrame:
    """
    Load raw BPS dataset from data/raw/ and perform baseline ingestion assertions.
    """
    path = filepath or RAW_DATA_PATH
    if not path.exists():
        raise FileNotFoundError(f"Raw data file not found at: {path}")

    df = pd.read_csv(path)
    if len(df) != 514:
        raise ValueError(f"Expected 514 districts/cities in raw dataset, found {len(df)}")
    
    return df


def load_cleaned_data(filepath: Optional[Path] = None) -> pd.DataFrame:
    """
    Load cleaned interim data from data/interim/ with anomaly tags.
    """
    path = filepath or CLEANED_DATA_PATH
    if not path.exists():
        raise FileNotFoundError(f"Cleaned interim data not found at: {path}")

    df = pd.read_csv(path)
    if len(df) != 514:
        raise ValueError(f"Expected 514 rows in interim dataset, found {len(df)}")
    
    return df


def load_processed_data(filepath: Optional[Path] = None) -> pd.DataFrame:
    """
    Load final clustered and scored data from data/processed/.
    """
    path = filepath or PROCESSED_DATA_PATH
    if not path.exists():
        raise FileNotFoundError(f"Processed dataset not found at: {path}")

    df = pd.read_csv(path)
    if len(df) != 514:
        raise ValueError(f"Expected 514 rows in processed dataset, found {len(df)}")
    
    return df


def load_cluster_summary(filepath: Optional[Path] = None) -> pd.DataFrame:
    """
    Load 4-cluster aggregate summary table from data/processed/.
    """
    path = filepath or PROCESSED_SUMMARY_PATH
    if not path.exists():
        raise FileNotFoundError(f"Cluster summary dataset not found at: {path}")

    df = pd.read_csv(path)
    if len(df) != 4:
        raise ValueError(f"Expected 4 cluster rows in summary dataset, found {len(df)}")
    
    return df

