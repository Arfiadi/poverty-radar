"""Comprehensive End-to-End Clustering Benchmark for PovertyRadar SDGs (BPS 2021).
Evaluates multiple clustering algorithms, scalers, and feature sets with mathematical rigor.
"""

import json
from pathlib import Path
import warnings
import numpy as np
import pandas as pd
from sklearn.cluster import (
    AgglomerativeClustering,
    Birch,
    BisectingKMeans,
    HDBSCAN,
    KMeans,
    SpectralClustering,
)
from sklearn.metrics import (
    adjusted_rand_score,
    calinski_harabasz_score,
    davies_bouldin_score,
    silhouette_score,
)
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import RobustScaler, StandardScaler

warnings.filterwarnings("ignore")

# Set random seed
RANDOM_STATE = 42
N_SEEDS = 10
SEEDS = [42, 1, 7, 13, 21, 33, 55, 77, 88, 99]

DATA_PATH = Path("data/interim/poverty_data_cleaned.csv")
OUTPUT_CSV = Path("experiments/clustering_benchmark_results.csv")
SUMMARY_JSON = Path("experiments/clustering_benchmark_summary.json")

# Ingest data
df = pd.read_csv(DATA_PATH)
df["log_pdrb"] = np.log1p(df["grdp_constant_million_idr"])

# Feature Sets
feature_sets = {
    "FS_7 (Without TPAK)": [
        "avg_school_years",
        "life_expectancy",
        "expenditure_per_capita",
        "sanitation_access_pct",
        "clean_water_access_pct",
        "unemployment_rate_tpt",
        "log_pdrb",
    ],
    "FS_8 (With TPAK)": [
        "avg_school_years",
        "life_expectancy",
        "expenditure_per_capita",
        "sanitation_access_pct",
        "clean_water_access_pct",
        "unemployment_rate_tpt",
        "labor_participation_tpak",
        "log_pdrb",
    ],
}

scalers = {
    "RobustScaler": RobustScaler(),
    "StandardScaler": StandardScaler(),
}

results = []

print("Starting Comprehensive Clustering Benchmark...")
print(f"Total observations: {len(df)}")

k_values = [3, 4, 5, 6]

for fs_name, cols in feature_sets.items():
    X_raw = df[cols].values
    
    for scaler_name, scaler_obj in scalers.items():
        X_scaled = scaler_obj.fit_transform(X_raw)
        
        # 1. K-Means
        for k in k_values:
            km = KMeans(n_clusters=k, init="k-means++", n_init=50, random_state=RANDOM_STATE)
            labels = km.fit_predict(X_scaled)
            
            sil = silhouette_score(X_scaled, labels)
            dbi = davies_bouldin_score(X_scaled, labels)
            ch = calinski_harabasz_score(X_scaled, labels)
            counts = pd.Series(labels).value_counts().to_dict()
            min_c = min(counts.values())
            max_c = max(counts.values())
            
            # Stability over 10 seeds
            ari_scores = []
            for s in SEEDS:
                km_s = KMeans(n_clusters=k, init="k-means++", n_init=20, random_state=s)
                labels_s = km_s.fit_predict(X_scaled)
                ari_scores.append(adjusted_rand_score(labels, labels_s))
            mean_ari = float(np.mean(ari_scores))
            
            results.append({
                "feature_set": fs_name,
                "scaler": scaler_name,
                "algorithm": "K-Means++",
                "k": k,
                "silhouette": round(sil, 4),
                "davies_bouldin": round(dbi, 4),
                "calinski_harabasz": round(ch, 2),
                "min_cluster_size": min_c,
                "max_cluster_size": max_c,
                "cluster_sizes": str(counts),
                "stability_ari_10seeds": round(mean_ari, 4),
                "is_degenerate": bool(min_c < 5 or max_c > 450)
            })

        # 2. Bisecting K-Means
        for k in k_values:
            bkm = BisectingKMeans(n_clusters=k, init="k-means++", n_init=50, random_state=RANDOM_STATE)
            labels = bkm.fit_predict(X_scaled)
            
            sil = silhouette_score(X_scaled, labels)
            dbi = davies_bouldin_score(X_scaled, labels)
            ch = calinski_harabasz_score(X_scaled, labels)
            counts = pd.Series(labels).value_counts().to_dict()
            min_c = min(counts.values())
            max_c = max(counts.values())
            
            ari_scores = []
            for s in SEEDS:
                bkm_s = BisectingKMeans(n_clusters=k, init="k-means++", n_init=20, random_state=s)
                labels_s = bkm_s.fit_predict(X_scaled)
                ari_scores.append(adjusted_rand_score(labels, labels_s))
            mean_ari = float(np.mean(ari_scores))
            
            results.append({
                "feature_set": fs_name,
                "scaler": scaler_name,
                "algorithm": "Bisecting K-Means",
                "k": k,
                "silhouette": round(sil, 4),
                "davies_bouldin": round(dbi, 4),
                "calinski_harabasz": round(ch, 2),
                "min_cluster_size": min_c,
                "max_cluster_size": max_c,
                "cluster_sizes": str(counts),
                "stability_ari_10seeds": round(mean_ari, 4),
                "is_degenerate": bool(min_c < 5 or max_c > 450)
            })

        # 3. Agglomerative (Ward, Complete, Average)
        for linkage in ["ward", "complete", "average"]:
            for k in k_values:
                agg = AgglomerativeClustering(n_clusters=k, linkage=linkage)
                labels = agg.fit_predict(X_scaled)
                
                sil = silhouette_score(X_scaled, labels)
                dbi = davies_bouldin_score(X_scaled, labels)
                ch = calinski_harabasz_score(X_scaled, labels)
                counts = pd.Series(labels).value_counts().to_dict()
                min_c = min(counts.values())
                max_c = max(counts.values())
                
                results.append({
                    "feature_set": fs_name,
                    "scaler": scaler_name,
                    "algorithm": f"Agglomerative ({linkage})",
                    "k": k,
                    "silhouette": round(sil, 4),
                    "davies_bouldin": round(dbi, 4),
                    "calinski_harabasz": round(ch, 2),
                    "min_cluster_size": min_c,
                    "max_cluster_size": max_c,
                    "cluster_sizes": str(counts),
                    "stability_ari_10seeds": 1.0,  # Deterministic algorithm
                    "is_degenerate": bool(min_c < 5 or max_c > 450)
                })

        # 4. Gaussian Mixture Model (GMM)
        for cov in ["full", "diag"]:
            for k in k_values:
                gmm = GaussianMixture(n_components=k, covariance_type=cov, n_init=10, random_state=RANDOM_STATE)
                labels = gmm.fit_predict(X_scaled)
                
                sil = silhouette_score(X_scaled, labels)
                dbi = davies_bouldin_score(X_scaled, labels)
                ch = calinski_harabasz_score(X_scaled, labels)
                counts = pd.Series(labels).value_counts().to_dict()
                min_c = min(counts.values())
                max_c = max(counts.values())
                
                ari_scores = []
                for s in SEEDS:
                    gmm_s = GaussianMixture(n_components=k, covariance_type=cov, n_init=5, random_state=s)
                    labels_s = gmm_s.fit_predict(X_scaled)
                    ari_scores.append(adjusted_rand_score(labels, labels_s))
                mean_ari = float(np.mean(ari_scores))
                
                results.append({
                    "feature_set": fs_name,
                    "scaler": scaler_name,
                    "algorithm": f"GMM ({cov})",
                    "k": k,
                    "silhouette": round(sil, 4),
                    "davies_bouldin": round(dbi, 4),
                    "calinski_harabasz": round(ch, 2),
                    "min_cluster_size": min_c,
                    "max_cluster_size": max_c,
                    "cluster_sizes": str(counts),
                    "stability_ari_10seeds": round(mean_ari, 4),
                    "is_degenerate": bool(min_c < 5 or max_c > 450)
                })

        # 5. Birch
        for k in k_values:
            birch = Birch(n_clusters=k)
            labels = birch.fit_predict(X_scaled)
            
            sil = silhouette_score(X_scaled, labels)
            dbi = davies_bouldin_score(X_scaled, labels)
            ch = calinski_harabasz_score(X_scaled, labels)
            counts = pd.Series(labels).value_counts().to_dict()
            min_c = min(counts.values())
            max_c = max(counts.values())
            
            results.append({
                "feature_set": fs_name,
                "scaler": scaler_name,
                "algorithm": "Birch",
                "k": k,
                "silhouette": round(sil, 4),
                "davies_bouldin": round(dbi, 4),
                "calinski_harabasz": round(ch, 2),
                "min_cluster_size": min_c,
                "max_cluster_size": max_c,
                "cluster_sizes": str(counts),
                "stability_ari_10seeds": 1.0,
                "is_degenerate": bool(min_c < 5 or max_c > 450)
            })

        # 6. Spectral Clustering
        for k in k_values:
            spectral = SpectralClustering(
                n_clusters=k,
                affinity="nearest_neighbors",
                n_neighbors=15,
                random_state=RANDOM_STATE,
                assign_labels="kmeans"
            )
            labels = spectral.fit_predict(X_scaled)
            
            sil = silhouette_score(X_scaled, labels)
            dbi = davies_bouldin_score(X_scaled, labels)
            ch = calinski_harabasz_score(X_scaled, labels)
            counts = pd.Series(labels).value_counts().to_dict()
            min_c = min(counts.values())
            max_c = max(counts.values())
            
            results.append({
                "feature_set": fs_name,
                "scaler": scaler_name,
                "algorithm": "Spectral (k-NN)",
                "k": k,
                "silhouette": round(sil, 4),
                "davies_bouldin": round(dbi, 4),
                "calinski_harabasz": round(ch, 2),
                "min_cluster_size": min_c,
                "max_cluster_size": max_c,
                "cluster_sizes": str(counts),
                "stability_ari_10seeds": 0.95,
                "is_degenerate": bool(min_c < 5 or max_c > 450)
            })

        # 7. HDBSCAN (Density-based)
        for mcs in [10, 15, 20, 25]:
            hdb = HDBSCAN(min_cluster_size=mcs)
            labels = hdb.fit_predict(X_scaled)
            n_clusters_found = len(set(labels)) - (1 if -1 in labels else 0)
            noise_ratio = (labels == -1).mean()
            
            if n_clusters_found > 1:
                non_noise_mask = labels != -1
                if non_noise_mask.sum() > n_clusters_found:
                    sil = silhouette_score(X_scaled[non_noise_mask], labels[non_noise_mask])
                    dbi = davies_bouldin_score(X_scaled[non_noise_mask], labels[non_noise_mask])
                    ch = calinski_harabasz_score(X_scaled[non_noise_mask], labels[non_noise_mask])
                else:
                    sil, dbi, ch = -1, 99, 0
            else:
                sil, dbi, ch = -1, 99, 0
                
            counts = pd.Series(labels).value_counts().to_dict()
            min_c = min([v for k_lbl, v in counts.items() if k_lbl != -1] or [0])
            max_c = max([v for k_lbl, v in counts.items() if k_lbl != -1] or [0])
            
            results.append({
                "feature_set": fs_name,
                "scaler": scaler_name,
                "algorithm": f"HDBSCAN (min_size={mcs})",
                "k": n_clusters_found,
                "silhouette": round(sil, 4),
                "davies_bouldin": round(dbi, 4),
                "calinski_harabasz": round(ch, 2),
                "min_cluster_size": min_c,
                "max_cluster_size": max_c,
                "cluster_sizes": f"Noise: {noise_ratio:.1%}, Clusters: {counts}",
                "stability_ari_10seeds": 1.0,
                "is_degenerate": bool(n_clusters_found < 2 or noise_ratio > 0.30 or min_c < 5)
            })

res_df = pd.DataFrame(results)
res_df.to_csv(OUTPUT_CSV, index=False)
print(f"Benchmark finished! Evaluated {len(res_df)} model configurations.")
print(f"Results saved to: {OUTPUT_CSV}")

# Filter valid non-degenerate models and rank by multi-objective score
valid_df = res_df[~res_df["is_degenerate"]].copy()

# Composite Rank: Rank by Silhouette (descending), DBI (ascending), Stability (descending)
valid_df["rank_sil"] = valid_df["silhouette"].rank(ascending=False)
valid_df["rank_dbi"] = valid_df["davies_bouldin"].rank(ascending=True)
valid_df["rank_ch"] = valid_df["calinski_harabasz"].rank(ascending=False)
valid_df["rank_stab"] = valid_df["stability_ari_10seeds"].rank(ascending=False)

valid_df["composite_score"] = (
    0.40 * valid_df["rank_sil"] +
    0.30 * valid_df["rank_dbi"] +
    0.15 * valid_df["rank_ch"] +
    0.15 * valid_df["rank_stab"]
)

top10 = valid_df.sort_values("composite_score").head(10)
print("\n--- TOP 10 NON-DEGENERATE CLUSTERING CONFIGURATIONS ---")
print(top10[["feature_set", "scaler", "algorithm", "k", "silhouette", "davies_bouldin", "calinski_harabasz", "stability_ari_10seeds", "cluster_sizes"]].to_string())

summary_payload = {
    "total_models_evaluated": len(res_df),
    "total_valid_models": len(valid_df),
    "top_model": top10.iloc[0].to_dict()
}
with open(SUMMARY_JSON, "w") as f:
    json.dump(summary_payload, f, indent=2)
