"""
End-to-End Pipeline Runner for PovertyRadar SDGs.
Executes raw ingestion -> interim cleaning -> clustering -> vulnerability screening -> reports/figures generation.
"""

import logging
from pathlib import Path
import pandas as pd
import numpy as np

from poverty_radar.config import (
    RAW_DATA_PATH,
    CLEANED_DATA_PATH,
    PROCESSED_DATA_PATH,
    FIGURES_DIR
)
from poverty_radar.data.loader import load_raw_data
from poverty_radar.data.preprocessor import clean_raw_data, get_feature_matrix
from poverty_radar.models.clustering import RegionalClusterer
from poverty_radar.models.vulnerability import VulnerabilityScorer
from poverty_radar.visualization.plots import (
    plot_elbow_and_silhouette,
    plot_algorithm_comparison_barchart,
    plot_multiseed_robustness,
    plot_pca_2d,
    plot_cluster_heatmap,
    plot_cluster_small_multiples,
    plot_p0_stripplot,
    plot_vulnerability_matrix_2x2
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("poverty_radar.pipeline")


FINAL_COLUMN_ORDER = [
    'provinsi', 'kab_kota', 'tipe_wilayah', 'region_pulau',
    'cluster_id', 'cluster_name',
    'vulnerability_score', 'vulnerability_quadrant',
    'poverty_rate_p0', 'avg_school_years', 'expenditure_per_capita',
    'human_dev_index', 'life_expectancy', 'sanitation_access_pct',
    'clean_water_access_pct', 'unemployment_rate_tpt', 'labor_participation_tpak',
    'grdp_constant_million_idr', 'log_pdrb',
    'is_multivariate_anomaly', 'anomaly_score'
]


def run_pipeline(generate_figures: bool = True) -> pd.DataFrame:
    """
    Run complete deterministic pipeline from raw BPS dataset to final processed dataset and figures.
    """
    logger.info("Step 1: Loading raw dataset...")
    df_raw = load_raw_data(RAW_DATA_PATH)
    logger.info("Raw data loaded: %d rows.", len(df_raw))

    logger.info("Step 2: Cleaning and engineering interim features...")
    df_clean = clean_raw_data(df_raw)
    CLEANED_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    df_clean.to_csv(CLEANED_DATA_PATH, index=False)
    logger.info("Cleaned interim data saved to %s", CLEANED_DATA_PATH)

    logger.info("Step 3: Extracting scaled feature matrix (RobustScaler)...")
    X_scaled, scaler = get_feature_matrix(df_clean)

    logger.info("Step 4: Fitting RegionalClusterer (K-Means k=4)...")
    clusterer = RegionalClusterer(n_clusters=4)
    clusterer.fit(X_scaled, df_context=df_clean)
    df_clustered = clusterer.assign_clusters_to_dataframe(df_clean, X_scaled)

    logger.info("Step 5: Computing Relative Structural Vulnerability (V_struc)...")
    scorer = VulnerabilityScorer()
    df_final = scorer.assign_quadrants(df_clustered)

    logger.info("Step 6: Enforcing Data Contracts & Column Order...")
    assert len(df_final) == 514, f"Integrity check failed: Expected 514 rows, found {len(df_final)}"
    assert df_final.isnull().sum().sum() == 0, "Integrity check failed: Null values detected!"
    assert 'poverty_class_target' not in df_final.columns, "Leakage check failed: poverty_class_target present!"

    df_out = df_final[FINAL_COLUMN_ORDER].copy()
    PROCESSED_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    df_out.to_csv(PROCESSED_DATA_PATH, index=False)
    logger.info("Processed dataset successfully saved to: %s", PROCESSED_DATA_PATH)

    if generate_figures:
        logger.info("Step 7: Generating publication figures in reports/figures/...")
        FIGURES_DIR.mkdir(parents=True, exist_ok=True)

        plot_elbow_and_silhouette(X_scaled, save_path=FIGURES_DIR / "08_pemilihan_jumlah_klaster_elbow.png")
        plot_algorithm_comparison_barchart(save_path=FIGURES_DIR / "09_perbandingan_algoritma_clustering.png")
        plot_multiseed_robustness(X_scaled, df_out['cluster_id'].values, save_path=FIGURES_DIR / "02_multiseed_robustness_ari.png")
        
        # Add PCA columns to df_out for plotting
        pca_1, pca_2 = clusterer.transform_pca(X_scaled)
        df_plot = df_out.copy()
        df_plot['pca_1'] = pca_1
        df_plot['pca_2'] = pca_2

        plot_pca_2d(df_plot, save_path=FIGURES_DIR / "03_pca_cluster_projection_2d.png")
        plot_cluster_heatmap(df_plot, X_scaled, save_path=FIGURES_DIR / "04_cluster_characteristics_heatmap.png")
        plot_cluster_small_multiples(df_plot, X_scaled, save_path=FIGURES_DIR / "04_cluster_profiles_small_multiples.png")
        plot_p0_stripplot(df_plot, save_path=FIGURES_DIR / "05_poverty_distribution_stripplot.png")
        plot_vulnerability_matrix_2x2(df_plot, save_path=FIGURES_DIR / "06_relative_vulnerability_matrix_2x2.png")
        logger.info("All presentation figures successfully generated.")

    logger.info("Pipeline execution complete! 100%% verified.")
    return df_out


if __name__ == "__main__":
    run_pipeline(generate_figures=True)

