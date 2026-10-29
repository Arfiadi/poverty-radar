"""
Data preprocessing, feature engineering, and transformation module.
PovertyRadar SDGs
"""

from typing import Tuple, Optional
import numpy as np
import pandas as pd
from sklearn.preprocessing import RobustScaler, StandardScaler
from sklearn.ensemble import IsolationForest

from poverty_radar.config import SEED, FEATURE_COLS
from poverty_radar.data.loader import COLUMN_RENAME_MAP


def assign_island_region(prov: str) -> str:
    """
    Map Indonesian province name to 6 major island groups.
    """
    prov_upper = str(prov).upper()
    if any(p in prov_upper for p in ['ACEH', 'SUMATERA', 'RIAU', 'JAMBI', 'BENGKULU', 'LAMPUNG', 'BANGKA']):
        return 'Sumatera'
    elif any(p in prov_upper for p in ['JAKARTA', 'JAWA', 'BANTEN', 'YOGYAKARTA']):
        return 'Jawa'
    elif any(p in prov_upper for p in ['BALI', 'NUSA TENGGARA']):
        return 'Bali & Nusa Tenggara'
    elif 'KALIMANTAN' in prov_upper:
        return 'Kalimantan'
    elif 'SULAWESI' in prov_upper or 'GORONTALO' in prov_upper:
        return 'Sulawesi'
    elif any(p in prov_upper for p in ['MALUKU', 'PAPUA']):
        return 'Maluku & Papua'
    return 'Lainnya'


def clean_raw_data(df_raw: pd.DataFrame) -> pd.DataFrame:
    """
    Clean raw BPS dataset: rename columns, engineer regional categories,
    tag multivariate anomalies, and drop unverified binary classification target.
    """
    df = df_raw.rename(columns=COLUMN_RENAME_MAP).copy()

    # Clean text values (e.g. remove asterisk from Nduga *)
    df['kab_kota'] = df['kab_kota'].astype(str).str.replace('*', '', regex=False).str.strip()
    df['provinsi'] = df['provinsi'].astype(str).str.strip()

    # Engineer geographic helper columns
    df['tipe_wilayah'] = df['kab_kota'].apply(lambda x: 'Kota' if str(x).startswith('Kota') else 'Kabupaten')
    df['region_pulau'] = df['provinsi'].apply(assign_island_region)

    # Transform skewed GRDP / PDRB
    df['log_pdrb'] = np.log1p(df['grdp_constant_million_idr'])

    # Multivariate anomaly detection (Isolation Forest matching notebook 01)
    socio_features = [
        'avg_school_years', 'life_expectancy', 'sanitation_access_pct',
        'clean_water_access_pct', 'expenditure_per_capita',
        'labor_participation_tpak', 'unemployment_rate_tpt'
    ]
    X_socio = df[socio_features].copy()
    X_socio['log_pdrb'] = df['log_pdrb']
    
    iso_scaler = RobustScaler()
    X_iso = iso_scaler.fit_transform(X_socio)
    iso = IsolationForest(contamination=0.05, random_state=SEED)
    df['is_multivariate_anomaly'] = (iso.fit_predict(X_iso) == -1)
    df['anomaly_score'] = iso.decision_function(X_iso)

    # Strictly drop unverified classification target
    if 'poverty_class_target' in df.columns:
        df = df.drop(columns=['poverty_class_target'])

    # Standard interim column order
    interim_cols = [
        'provinsi', 'kab_kota', 'tipe_wilayah', 'region_pulau',
        'poverty_rate_p0', 'avg_school_years', 'expenditure_per_capita',
        'human_dev_index', 'life_expectancy', 'sanitation_access_pct',
        'clean_water_access_pct', 'unemployment_rate_tpt', 'labor_participation_tpak',
        'grdp_constant_million_idr', 'is_multivariate_anomaly', 'anomaly_score'
    ]
    return df[interim_cols]


def get_feature_matrix(
    df: pd.DataFrame,
    scaler: Optional[RobustScaler] = None
) -> Tuple[np.ndarray, RobustScaler]:
    """
    Extract the 7-feature matrix for distance-based clustering and scale with RobustScaler.
    Poverty rate (P0) is strictly excluded to prevent target leakage.
    """
    for col in FEATURE_COLS:
        if col not in df.columns:
            if col == 'log_pdrb' and 'grdp_constant_million_idr' in df.columns:
                df['log_pdrb'] = np.log1p(df['grdp_constant_million_idr'])
            else:
                raise KeyError(f"Required clustering feature '{col}' missing from DataFrame.")

    X = df[FEATURE_COLS].values
    if scaler is None:
        scaler = RobustScaler()
        X_scaled = scaler.fit_transform(X)
    else:
        X_scaled = scaler.transform(X)

    return X_scaled, scaler
