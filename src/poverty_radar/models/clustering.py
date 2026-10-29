"""
Unsupervised clustering and spatial PCA projection module.
PovertyRadar SDGs
"""

from typing import Dict, Optional, Tuple
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

from poverty_radar.config import SEED, CLUSTER_LABELS


class RegionalClusterer:
    """
    K-Means clustering engine for Indonesian regional socio-economic profiling.
    Automatically re-indexes clusters by expenditure hierarchy to ensure
    consistent cluster personas (Cluster 0: Modern Urban -> Cluster 3: 3T Acute Deprivation).
    """

    def __init__(self, n_clusters: int = 4, random_state: int = SEED):
        self.n_clusters = n_clusters
        self.random_state = random_state
        self.kmeans: Optional[KMeans] = None
        self.pca: Optional[PCA] = None
        self.cluster_mapping: Dict[int, int] = {}
        self.is_fitted: bool = False

    def fit(self, X_scaled: np.ndarray, df_context: Optional[pd.DataFrame] = None) -> "RegionalClusterer":
        """
        Fit K-Means model on scaled 7-dimensional space and establish ordinal cluster mapping.
        """
        self.kmeans = KMeans(
            n_clusters=self.n_clusters,
            init="k-means++",
            n_init=25,
            random_state=self.random_state
        )
        raw_labels = self.kmeans.fit_predict(X_scaled)

        # Establish ordered mapping based on expenditure per capita if available
        if df_context is not None and "expenditure_per_capita" in df_context.columns:
            temp_df = pd.DataFrame({
                "raw_label": raw_labels,
                "expenditure": df_context["expenditure_per_capita"].values
            })
            sorted_raw_ids = (
                temp_df.groupby("raw_label")["expenditure"]
                .mean()
                .sort_values(ascending=False)
                .index.tolist()
            )
            self.cluster_mapping = {old_id: new_id for new_id, old_id in enumerate(sorted_raw_ids)}
        else:
            self.cluster_mapping = {i: i for i in range(self.n_clusters)}

        # Fit 2D PCA for spatial projection
        self.pca = PCA(n_components=2, random_state=self.random_state)
        self.pca.fit(X_scaled)

        self.is_fitted = True
        return self

    def predict(self, X_scaled: np.ndarray) -> np.ndarray:
        """
        Predict ordered cluster IDs for input features.
        """
        if not self.is_fitted:
            raise RuntimeError("RegionalClusterer must be fitted before predict.")
        raw_preds = self.kmeans.predict(X_scaled)
        return np.array([self.cluster_mapping[r] for r in raw_preds])

    def transform_pca(self, X_scaled: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Transform scaled features into 2D PCA coordinate space (PC1, PC2).
        """
        if not self.is_fitted:
            raise RuntimeError("RegionalClusterer must be fitted before transform_pca.")
        X_pca = self.pca.transform(X_scaled)
        return X_pca[:, 0], X_pca[:, 1]

    def assign_clusters_to_dataframe(self, df: pd.DataFrame, X_scaled: np.ndarray) -> pd.DataFrame:
        """
        Convenience method to enrich DataFrame with cluster_id, cluster_name, pca_1, and pca_2.
        """
        df_out = df.copy()
        cluster_ids = self.predict(X_scaled)
        pca_1, pca_2 = self.transform_pca(X_scaled)

        df_out["cluster_id"] = cluster_ids
        df_out["cluster_name"] = df_out["cluster_id"].map(CLUSTER_LABELS)
        df_out["pca_1"] = pca_1
        df_out["pca_2"] = pca_2

        return df_out

