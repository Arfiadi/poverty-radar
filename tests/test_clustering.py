"""
Unit tests for unsupervised clustering engine and persona standards.
"""

import pytest
import numpy as np
import pandas as pd

from poverty_radar.config import CLUSTER_LABELS
from poverty_radar.data.preprocessor import get_feature_matrix
from poverty_radar.models.clustering import RegionalClusterer


def test_cluster_counts_and_personas(processed_df):
    """Verify exact cluster counts and standardized persona names."""
    expected_counts = {
        0: 78,   # Klaster 1: Perkotaan Modern & Formal
        1: 187,  # Klaster 2: Kabupaten Penyangga Mapan
        2: 216,  # Klaster 3: Perdesaan Agraris Rentan
        3: 33    # Klaster 4: Wilayah 3T Deprivasi Akut
    }
    actual_counts = processed_df['cluster_id'].value_counts().to_dict()
    assert actual_counts == expected_counts, f"Cluster distribution mismatch: {actual_counts}"

    # Verify cluster naming
    for cid, name in CLUSTER_LABELS.items():
        assert (processed_df.loc[processed_df['cluster_id'] == cid, 'cluster_name'] == name).all()


def test_cluster_expenditure_monotonicity(processed_df):
    """Verify that cluster IDs [0, 1, 2, 3] follow strictly decreasing economic affluence."""
    mean_expenditures = processed_df.groupby('cluster_id')['expenditure_per_capita'].mean()
    assert mean_expenditures[0] > mean_expenditures[1], "Cluster 0 must have higher expenditure than Cluster 1"
    assert mean_expenditures[1] > mean_expenditures[2], "Cluster 1 must have higher expenditure than Cluster 2"
    assert mean_expenditures[2] > mean_expenditures[3], "Cluster 2 must have higher expenditure than Cluster 3"


def test_clustering_reproducibility(cleaned_df):
    """Verify determinism of RegionalClusterer with fixed seed 42."""
    X_scaled, _ = get_feature_matrix(cleaned_df)
    model1 = RegionalClusterer(n_clusters=4, random_state=42).fit(X_scaled, df_context=cleaned_df)
    labels1 = model1.predict(X_scaled)

    model2 = RegionalClusterer(n_clusters=4, random_state=42).fit(X_scaled, df_context=cleaned_df)
    labels2 = model2.predict(X_scaled)

    assert np.array_equal(labels1, labels2), "Cluster assignments must be 100% deterministic"


def test_compute_cluster_summary_output(processed_df):
    """Verify compute_cluster_summary generates proper schema and exact totals."""
    from poverty_radar.models.clustering import compute_cluster_summary
    df_summary = compute_cluster_summary(processed_df)
    assert len(df_summary) == 4, f"Expected 4 clusters, got {len(df_summary)}"
    assert df_summary['total_regions'].sum() == 514
    assert set(df_summary['cluster_name']) == set(CLUSTER_LABELS.values())
    assert df_summary['poverty_rate_p0_median'].iloc[0] < df_summary['poverty_rate_p0_median'].iloc[3]

