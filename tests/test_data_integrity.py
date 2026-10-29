"""
Unit tests for data contracts, integrity, and target leakage prevention.
"""

import pytest
import pandas as pd
from poverty_radar.config import FEATURE_COLS, EXCLUDED_COLS


def test_row_count_and_nulls(processed_df):
    """Ensure exactly 514 districts and zero null values."""
    assert len(processed_df) == 514, f"Expected 514 districts, got {len(processed_df)}"
    assert processed_df.isnull().sum().sum() == 0, "Found null values in processed dataset"


def test_no_geographic_duplicates(processed_df):
    """Ensure every regency/city is uniquely identifiable by province and name."""
    dups = processed_df.duplicated(subset=['provinsi', 'kab_kota']).sum()
    assert dups == 0, f"Found {dups} duplicate regency/city entries"


def test_target_leakage_absence(processed_df):
    """Ensure unverified binary target is completely absent from dataset."""
    assert 'poverty_class_target' not in processed_df.columns, "Target leakage: poverty_class_target detected!"


def test_feature_ranges_and_types(processed_df):
    """Ensure socioeconomic variables fall within valid real-world bounds."""
    assert (processed_df['poverty_rate_p0'] >= 0).all() and (processed_df['poverty_rate_p0'] <= 100).all()
    assert (processed_df['sanitation_access_pct'] >= 0).all() and (processed_df['sanitation_access_pct'] <= 100).all()
    assert (processed_df['clean_water_access_pct'] >= 0).all() and (processed_df['clean_water_access_pct'] <= 100).all()
    assert (processed_df['unemployment_rate_tpt'] >= 0).all() and (processed_df['unemployment_rate_tpt'] <= 100).all()
    assert (processed_df['avg_school_years'] >= 1.0).all() and (processed_df['avg_school_years'] <= 20.0).all()
    assert (processed_df['life_expectancy'] >= 45.0).all() and (processed_df['life_expectancy'] <= 85.0).all()


def test_cluster_summary_contract():
    """Ensure cluster summary file exists, has 4 clusters, and exact region total of 514."""
    from poverty_radar.data.loader import load_cluster_summary
    df_sum = load_cluster_summary()
    assert len(df_sum) == 4, f"Expected 4 cluster summary rows, found {len(df_sum)}"
    assert df_sum['total_regions'].sum() == 514, "Sum of cluster regions must equal 514"
    assert df_sum.isnull().sum().sum() == 0, "Summary table must have zero null values"
    assert 'dominant_region_pulau' in df_sum.columns, "dominant_region_pulau missing from summary"

