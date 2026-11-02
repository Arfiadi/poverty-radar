"""
Unit tests for dashboard JSON payloads and audit reconciliation.
Validates F-01, F-02, F-03, F-04, F-05, F-06, F-12, F-15 findings.
"""

from pathlib import Path
import json
import pytest
import pandas as pd

REPO_DIR = Path(__file__).resolve().parents[1]
FRONTEND_DATA_DIR = REPO_DIR / "dashboard" / "public" / "data"


def test_national_benchmarks_reconciliation():
    bench_file = FRONTEND_DATA_DIR / "national_benchmarks.json"
    assert bench_file.exists(), "national_benchmarks.json missing"
    with open(bench_file, "r", encoding="utf-8") as f:
        bench = json.load(f)

    assert bench["total_acute_pockets"] == 61
    assert bench["eastern_acute_count"] == 53
    assert bench["eastern_acute_pct"] == 86.9
    assert bench["western_acute_count"] == 8
    assert bench["western_acute_pct"] == 13.1
    assert bench["eastern_acute_count"] + bench["western_acute_count"] == bench["total_acute_pockets"]
    assert bench["min_p0_region"] == "Kota Sawah Lunto"


def test_kaggle_rule_info():
    kaggle_file = FRONTEND_DATA_DIR / "kaggle_rule_info.json"
    assert kaggle_file.exists(), "kaggle_rule_info.json missing"
    with open(kaggle_file, "r", encoding="utf-8") as f:
        krule = json.load(f)

    assert krule["matched_regions"] == 508
    assert krule["total_regions"] == 514
    assert krule["accuracy_pct"] == 98.83


def test_districts_island_mapping():
    dist_file = FRONTEND_DATA_DIR / "poverty_districts.json"
    assert dist_file.exists(), "poverty_districts.json missing"
    with open(dist_file, "r", encoding="utf-8") as f:
        districts = json.load(f)

    assert len(districts) == 514
    valid_islands = {"Jawa", "Sumatera", "Kalimantan", "Sulawesi", "Bali & Nusa Tenggara", "Maluku & Papua"}
    for d in districts:
        assert d["region_pulau"] in valid_islands, f"Invalid region_pulau: {d['region_pulau']}"

    # Verify counts per island match expected distribution
    counts = {isl: sum(1 for d in districts if d["region_pulau"] == isl) for isl in valid_islands}
    assert counts["Bali & Nusa Tenggara"] == 41
    assert counts["Maluku & Papua"] == 63
    assert sum(counts.values()) == 514


def test_ols_coefficients_exact():
    ols_file = FRONTEND_DATA_DIR / "ols_coefficients.json"
    assert ols_file.exists(), "ols_coefficients.json missing"
    with open(ols_file, "r", encoding="utf-8") as f:
        ols = json.load(f)

    betas = {item["feature"]: item["beta"] for item in ols}
    assert betas["expenditure_per_capita"] == -0.318
    assert betas["sanitation_access_pct"] == -0.190
    assert betas["log_pdrb"] == -0.190
    assert betas["labor_participation_tpak"] == 0.179
    assert betas["avg_school_years"] == -0.113
    assert betas["unemployment_rate_tpt"] == 0.100


def test_resource_curse_count():
    df = pd.read_csv(REPO_DIR / "data" / "processed" / "poverty_clusters.csv")
    rc = df[(df["grdp_constant_million_idr"] >= 25_000_000) & (df["poverty_rate_p0"] >= 10.46)]
    assert len(rc) == 29
