# PovertyRadar SDGs: Interactive Storytelling Dashboard

Dashboard interaktif berbasis web untuk eksplorasi disparitas spasial, profiling klaster sosioekonomi tanpa supervisi (*unsupervised*), dan skrining kerentanan struktural relatif bagi 514 kabupaten/kota di Indonesia (Data BPS 2021).

Dikembangkan sebagai implementasi arsitektur **Hybrid Python + React** (Versi 2) dengan standar visual editorial kelas publikasi (*Financial Times* / *The Economist*), prinsip *Storytelling with Data* (Cole Nussbaumer Knaflic), dan aturan *Dashboard Design* (Stephen Few).

---

## 🏛️ Arsitektur Sistem

```
PovertyRadar/
├── src/poverty_radar/          # Python Engine: Pemodelan klaster, PCA, skrining 2x2, audit OLS
├── scripts/
│   └── export_dashboard_payload.py # Jembatan data: serialize CSV & matriks ke payload JSON statis
└── dashboard/                  # Client-Side Application (React 18 + Vite + TypeScript)
    ├── public/data/            # Single source of truth JSON payloads (read-only)
    │   ├── poverty_districts.json    # 514 kabupaten/kota terpetakan lengkap
    │   ├── cluster_summary.json      # Karakteristik 4 persona klaster
    │   ├── policy_matrix.json        # 8 portofolio intervensi APBN/APBD
    │   ├── ols_coefficients.json     # Standardized beta OLS multivariat
    │   ├── boundary_cases.json       # Verifikasi 0.00% 3T
    │   └── national_benchmarks.json  # Median nasional & rasio disparitas
    └── src/
        ├── components/charts/  # Visualisasi Apache ECharts (Strip plot, Small multiples, 2x2, dll.)
        ├── components/common/  # Komponen UI: KPI Cards (Desbarats), Callouts, Data Table
        ├── components/layout/  # Sidebar (5 Babak Narasi), TopBar, Filter Global
        ├── constants/          # Palet Okabe-Ito, paradoks sosioekonomi, benchmark
        ├── hooks/              # Data fetching in-memory & filtering instan (<1ms)
        ├── pages/              # 5 Halaman Narasi (Babak 1 s.d. Babak 5)
        └── store/              # State management global (Zustand)
```

---

## 🚀 Panduan Memulai Cepat (Quickstart)

### Prasyarat
- **Node.js**: v18.0.0 atau lebih baru (direkomendasikan Node.js v20/v22 LTS)
- **npm**: v9.0.0 atau lebih baru
- **Python**: 3.10+ dengan `uv` (hanya diperlukan jika ingin memperbarui payload data dari model)

### 1. Menjalankan Dashboard (Development Mode)
```bash
cd dashboard
npm install
npm run dev
```
Buka browser pada alamat: `http://127.0.0.1:5173` (atau port yang dimunculkan Vite di terminal).

### 2. Membangun untuk Produksi (Production Build)
```bash
npm run build
npm run preview
```
Artefak produksi akan dibuat di direktori `dashboard/dist/`.

### 3. Memperbarui Payload Data dari Python
Jika terdapat pembaruan data atau analisis di sisi Python:
```bash
# Dari root direktori PovertyRadar
uv run python scripts/export_dashboard_payload.py
```
Skrip ini akan memvalidasi integritas 514 kabupaten/kota dan mengekspor 6 file JSON ke `dashboard/public/data/` dalam waktu kurang dari 2 detik.

---

## 📊 Struktur 5 Babak Narasi (*Storytelling Architecture*)

1. **Babak 1 — Bentang Disparitas Nasional (`/`)**:
   - 3 KPI Card berstandar Nick Desbarats (*No Bare Numbers*): Median $P_0 = 10.46\%$, Rasio Disparitas $17.5\times$ (Sawahlunto vs Intan Jaya), Akut Timur $86.9\%$.
   - *Archipelago Jittered Strip Plot*: Sebaran 514 daerah di 6 pulau besar dengan garis median regional.
   - *Distribution Histogram*: Kontur kemiringan positif (*right-skewed*) kemiskinan Indonesia.
   - Papan Peringkat Ekstrem & Tabel Data Interaktif 514 daerah.

2. **Babak 2 — Paradoks Spasial & Dimensi Kesejahteraan (`/indikator`)**:
   - Pemilih Dimensi Kesejahteraan (Pengeluaran, Air Bersih, Sanitasi, RLS, TPAK, TPT, PDRB).
   - *The Great Dualism*: Komparasi Kabupaten ($13.51\%$) vs Kota ($7.22\%$).
   - *The Working Poor Paradox*: Korelasi paradoks positif TPAK vs $P_0$ ($r = +0.462$).

3. **Babak 3 — Profil Klaster Sosioekonomi (`/klaster`)**:
   - Diagnostik Tanpa Supervisi: Evaluasi K-Means ($k=4$) vs Hierarchical & DBSCAN.
   - *Small Multiples Z-Score Bar Charts* & *Divergent Heatmap Matrix* 28 sel.
   - 4 Kartu Persona Klaster:
     - Klaster 0: *Agraris Tradisional & Perdesaan Tertinggal* (248 daerah, 48.2%)
     - Klaster 1: *Urban Maju & Pusat Jasa/Industri* (133 daerah, 25.9%)
     - Klaster 2: *Industrialis Menengah & Transisi* (74 daerah, 14.4%)
     - Klaster 3: *Deprivasi Multidimensi 3T* (59 daerah, 11.5%)

4. **Babak 4 — Skrining Kerentanan & Matriks Kebijakan (`/kebijakan`)**:
   - *Interactive 2x2 Relative Vulnerability Matrix*: $P_0$ Aktual vs Indeks Kerentanan Struktural Relatif ($V_{\text{struc}}$).
   - Tombol Pin Studi Kasus Paradoks (*Kutukan Tambang, Disparitas Madura, Kemiskinan Tersembunyi, Wilayah Maju*).
   - Portofolio Kebijakan Spesifik Kuadran & Klaster berbasis regulasi APBN/APBD (DAU/DAK, PKH, BPNT).
   - Ekspor Hasil Skrining Terfilter ke CSV.

5. **Babak 5 — Audit Metodologi & Transparansi Sains (`/metodologi`)**:
   - Spanduk Anti-Kebocoran Target (*Zero Target Leakage*): Mengapa label biner Kaggle digugurkan.
   - Tab 1: Dekonstruksi Aturan Heuristik Kaggle (98.83% akurasi dari aturan deterministik sederhana).
   - Tab 2: Regresi Multivariat OLS (Standardized $\beta$, signifikansi statistik $p < 0.001$).
   - Tab 3: Verifikasi Kasus Batas 0.00% (Daerah 3T di Papua).
   - Audit Pencilan: *Tukey Boxplot* 1.5x IQR (36 pencilan multivariate dipertahankan demi prinsip *Leave No One Behind*).

---

## 🎨 Standar Desain & Pencegahan "AI Slop"

- **Palet Warna Ramah Buta Warna (Okabe-Ito)**:
  - Klaster 0: Amber (`#E69F00`)
  - Klaster 1: Dark Blue (`#0072B2`)
  - Klaster 2: Green (`#009E73`)
  - Klaster 3: Vermillion / Terracotta (`#D55E00`)
  - Aksentuasi Kuadran: Reddish Purple (`#CC79A7`) & Sky Blue (`#56B4E9`)
- **Tipografi**: `Plus Jakarta Sans` (editorial sans-serif) dan `JetBrains Mono` (`tabular-nums` untuk angka statistik).
- **Zero Radar Chart & Zero Boxplot on Primary Screens**: Mengikuti aturan AGENTS.md.
- **Standar Epistemik**: Label `[Fakta Terverifikasi]` vs `[Asosiasi Statistik]` diterapkan secara eksplisit; korelasi tidak pernah diklaim sebagai kausalitas.
- **Aksesibilitas Kontras**: Rasio kontras teks minimal 4.5:1 (WCAG 2.1 AA).
