# AGENTS.md

## Purpose & Scope

This repository implements **PovertyRadar SDGs: Regional Poverty Clustering and Relative Vulnerability Screening System for Indonesian Districts (514 Regency/City, BPS 2021 Data)**. The primary objective is to enable data storytelling and exploratory analysis for regional socioeconomic disparity, unsupervised profiling, and relative structural vulnerability screening aligned with **UN SDG 1: No Poverty**.

> **CRITICAL METHODOLOGICAL CONSTRAINT: STRICTLY NO SUPERVISED CLASSIFICATION**  
> Although the source dataset is named `Klasifikasi Tingkat Kemiskinan di Indonesia.csv` and contains a binary `Klasifikasi Kemiskinan` column, **this project strictly rejects supervised classification**. The binary label is dropped to prevent circular reasoning and target leakage. The analytical focus is strictly **Unsupervised Socioeconomic Clustering**, **Spatial Distribution Exploration**, and **Relative 2x2 Structural Vulnerability Screening**.

Treat the current repository, its verified notebook outputs, configuration files, and explicit user instructions as sources of truth. Do not invent project behavior, dependencies, or verification commands without evidence.

---

## Working Rules & Communication

1. **Bilingual Protocol:**
   - Explain and communicate with the user in **Bahasa Indonesia** (unless the user initiates in another language).
   - Write all code, identifiers, class names, function names, docstrings, code comments, tests, and Git commit messages in **English** (following the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) specification).
2. **Minimal Coherent Scope:**
   - Inspect the working tree and existing files before editing.
   - Make the smallest coherent change that satisfies the request. Avoid unrequested refactors, unsolicited abstractions, or changes to unrelated files.
3. **Evidence-Based Verification:**
   - Distinguish clearly between "executed and verified" vs. "not verified".
   - Never claim a run, test, or training succeeded without executing it and observing the outcome.
4. **Safety & Destructive Operations:**
   - Require explicit user confirmation before: deleting files/datasets, running `rm -rf`, modifying git branch history, force-pushing, or overwriting output artifacts.
   - `data/raw/` is strictly **read-only**. Write derived data to `data/interim/` or `data/processed/`.

---

## Repository Map

```text
PovertyRadar/
├── pyproject.toml            # Python package configuration and test runner settings
├── requirements.txt          # Universal dependencies lock for deployment & cloud
├── AGENTS.md                 # Agent working contract, domain rules, and verification standards
├── README.md                 # Project landing page, overview, quickstart, and reproducibility
├── dashboard_guide.md        # Core data visualization & storytelling guide (Knaflic & Few)
├── data/
│   ├── raw/                  # Read-only raw BPS 2021 dataset from Kaggle
│   ├── interim/              # Preprocessed data (poverty_data_cleaned.csv with anomaly tags)
│   ├── processed/            # Final clustered and scored data (poverty_clusters.csv, summary, policy matrix)
│   └── README.md             # Data dictionary and technical audit notes
├── docs/
│   ├── problem_framing_and_objectives.md  # Problem framing, research questions, scope, 2x2 matrix
│   ├── data_audit_and_understanding.md    # Full statistical audit, outliers, anomalies, correlations
│   ├── clustering_protocol.md             # Unsupervised clustering protocol, scaling, evaluation
│   ├── clustering_rationale_and_findings.md # Rationale behind empirical benchmark of 20+ models
│   ├── data_contracts.md                  # Data schema contracts and validation boundaries
│   ├── 01-sistem-kebijakan-dan-intervensi-pemerintah-indonesia-2026.md # Master sistem perencanaan & fiskal RI
│   ├── 02-desain-rekomendasi-kebijakan-berbasis-clustering-povertyradar.md # Master rekomendasi kebijakan & skrining
│   ├── development.md                     # Environment setup (Python 3.13, uv), workflows, and Git
│   ├── design.md                          # Multi-page 5-act narrative dashboard architecture
│   └── ui_brief_mockup.md                 # ASCII wireframes and visual styling brief for UI/UX
├── experiments/              # Benchmark scripts and results tracking across clustering models
├── notebooks/                # Verified reproducible exploration notebooks (01, 02, 03)
├── reports/
│   └── figures/              # 9 Official standardized publication visualization figures
├── src/
│   └── poverty_radar/        # Modular source package (loader, preprocessor, models, plots, pipeline)
└── tests/                    # Automated pytest suite (data integrity, clustering, vulnerability)
```

---

## Documentation References

Read referenced documents only when relevant to the current task:

- `README.md`: Read when understanding project goals, setup, and general architecture.
- `docs/problem_framing_and_objectives.md`: Read when working on analytical objectives, SDG 1 alignment, 2x2 matrix screening, scope definitions, or storytelling narratives.
- `docs/data_audit_and_understanding.md`: Read when inspecting variable distributions, IQR outliers, 26 multivariate anomalies, employment paradox, or correlation matrices.
- `data/README.md` & `docs/data_contracts.md`: Read when verifying column schemas, data types, boundaries, or adding new features to pipeline outputs.
- `docs/clustering_protocol.md`: Read when designing, fitting, tuning, evaluating, or profiling unsupervised clustering models.
- `docs/01-sistem-kebijakan-dan-intervensi-pemerintah-indonesia-2026.md`: Read when studying baseline national policy mechanisms, fiscal architecture, social assistance, and official regional disparity.
- `docs/02-desain-rekomendasi-kebijakan-berbasis-clustering-povertyradar.md`: Read when designing cluster-based policy interventions, 2x2 matrix operationalization, or Four-Tier Evidence Ladder.
- `docs/design.md`: Read when building, styling, or updating dashboard layouts, navigation, and interactive charts.
- `dashboard_guide.md` & `docs/ui_brief_mockup.md`: Read when designing visual components, choosing chart types, applying color palettes, or drafting wireframes.
- `docs/development.md`: Read when setting up Python environments, configuring packages, or running verification workflows.

---

## Data Science & Modeling Integrity

Apply these non-negotiable rules for any data processing, feature engineering, or modeling tasks:

1. **Target Leakage & Circular Reasoning Prevention:**
   - Drop `poverty_class_target` from all feature vectors to prevent target leakage in supervised learning.
   - Do NOT include `poverty_rate_p0` in distance-based clustering feature sets to prevent circular reasoning and tautological evaluation. $P_0$ is reserved strictly for post-clustering evaluation and comparative profiling across clusters.
2. **Multicollinearity & Double-Counting Rule:**
   - Do NOT combine composite `human_dev_index` (HDI) with its constituent sub-indices (`expenditure_per_capita`, `avg_school_years`, `life_expectancy`) in distance-based clustering (e.g., K-Means).
   - HDI has high correlation with its components ($r > 0.86$); including both artificially inflates the human development weight by 2-3x over WASH and employment variables. Keep HDI as an external context benchmark.
3. **Outlier & Anomaly Policy (Strictly DO NOT DROP):**
   - 26 multivariate anomalies detected via Isolation Forest (`contamination=0.05`) represent real, extreme geographic disparity:
     - Remote 3T Deprivation: Nduga, Lanny Jaya, Mamberamo Tengah, Tambrauw, Intan Jaya, etc.
     - Megapolitan Centers: Jakarta Pusat, Jakarta Selatan, Bandung, etc.
   - **Never drop these observations.** Dropping 3T regions violates SDG 1 ("Leave No One Behind").
   - Handle outliers through robust mathematical transformations: apply `log1p` on skewed PDRB (reduces skewness from +5.85 to +0.23) and use `RobustScaler` (median & IQR based) or carefully calibrated `StandardScaler`.
4. **Employment Paradox Awareness:**
   - Recognize that Labor Force Participation (TPAK) correlates positively with poverty ($r = +0.462$) because subsistence agrarian/informal work is mandatory for survival in impoverished rural areas.
   - Open Unemployment (TPT) correlates negatively with poverty ($r = -0.401$) because open unemployment is an urban phenomenon among educated workers who can afford job searches.
5. **Reproducibility:**
   - Fix all random seeds (`random_state=42`) across K-Means, PCA, Isolation Forest, and any sampling logic.
   - Avoid hardcoding machine-specific paths; always use relative `pathlib.Path` rooted at the repository directory.

---

## Dashboard & Visualization Constraints

Refer to `dashboard_guide.md` for full layout and storytelling principles (Knaflic, Few, Desbarats). Enforce these project-specific hard constraints:

1. **STRICT PROHIBITION — Radar / Spider Charts:** Never use Radar/Spider charts to compare cluster profiles or socioeconomic indicators. Use **Small Multiples Bar Charts** or a **Heatmap Matrix** instead.
2. **Boxplot Storytelling Constraint:** Do NOT use boxplots on primary storytelling screens. Use **Jittered Strip Plots with median lines** instead (restrict boxplots strictly to technical methodology audit views).
3. **Color Palette Accessibility:** Strictly use the **Okabe-Ito Colorblind-Safe Palette** (`#0072B2` Dark Blue, `#D55E00` Vermillion/Amber, `#999999` Neutral Gray).

---

## Verification & Testing Standards

1. **Repository-Native Verification Commands:**
   - Run notebook verification headless via command line:
     ```powershell
     jupyter nbconvert --to notebook --execute notebooks/01_data_audit_and_understanding.ipynb
     ```
   - Run standalone Python validation scripts:
     ```powershell
     python -c "import pandas as pd; df = pd.read_csv('data/interim/poverty_data_cleaned.csv'); assert len(df) == 514; print('Data integrity pass!')"
     ```
2. **Notebook Integrity:**
   - Never edit raw `.ipynb` JSON strings directly; use `nbformat` or automated runners.
   - Keep notebooks clean and idempotent: "Restart & Run All" must succeed with exit code 0.
3. **Definition of Done for Each Change:**
   - The code/document fulfills explicit scope requirements.
   - Existing verified behavior is preserved without regression.
   - Git diff is strictly limited to relevant files.
   - Verification commands executed with observed results documented.

---

## Completion Report Protocol

At the end of every non-trivial task, summarize:
1. **Implemented Changes:** What was changed and why.
2. **Verification Performed:** Exact commands executed and their output.
3. **Unverified / Blocked Items:** Any checks that were skipped or not executable, with reasons.
4. **Next Actions / Risks:** Remaining limitations or suggested follow-ups.

