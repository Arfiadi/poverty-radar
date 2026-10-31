# PovertyRadar SDGs: Data Contracts & Schema Validation

## DOKUMEN KONTRAK DATA, SKEMA VALIDASI, & INTEGRITAS PIPELINE
**Versi:** 2.0 (Synchronized Technical Contract) | 31 Oktober 2026  
**Dokumen Pendamping Semantik:** [`data/README.md`](file:///d:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/data/README.md) *(Kamus Data Semantik Bisnis, Definisi Indikator, & Catatan Lapangan)*  
**Tujuan Dokumen:** Menetapkan spesifikasi teknis, aturan tipe data, batas nilai sah (*value constraints*), serta invarian integritas yang harus dipenuhi oleh setiap tahap pemrosesan data (dari *Raw* ke *Interim* hingga *Processed*). Untuk definisi operasional dan catatan kualitas indikator BPS, rujuk berkas `data/README.md`.

---

## 1. Arsitektur Pipeline & Kebijakan Hak Akses

Data bergerak melalui 3 tahapan direktori dengan aturan ketat:

```text
data/raw/ (Read-Only)
   │
   ▼ [Sanitasi whitespace, normalisasi entitas, audit nol 3T, dropping label biner]
data/interim/ (Internal Olahan)
   │  └── poverty_data_cleaned.csv (514 rows, 16 cols, terisi anomaly score)
   ▼ [Standardisasi fitur, K-Means clustering, kalkulasi matriks kerentanan 2x2]
data/processed/ (Siap Pakai untuk Dashboard)
      └── poverty_clusters.csv (514 rows, terisi cluster_id & vulnerability_quadrant)
```

### Kebijakan Hak Akses Berkas
1. **`data/raw/` (STRICTLY READ-ONLY):**
   * Berkas mentah `Klasifikasi Tingkat Kemiskinan di Indonesia.csv` tidak boleh dimodifikasi, ditimpa, atau dihapus oleh skrip apa pun.
2. **`data/interim/` (Read-Write untuk Preprocessing):**
   * Menampung data yang telah dibersihkan, diselaraskan tipe datanya, dan ditandai status anomalinya.
3. **`data/processed/` (Read-Write untuk Modeling Output):**
   * Menampung dataset final yang siap dibaca oleh aplikasi dashboard interaktif.

---

## 2. Invarian Integritas Sistem (System Invariants)

Setiap tahapan eksekusi pipeline wajib memvalidasi invarian berikut:

1. **Invarian Jumlah Baris:** Jumlah baris **wajib tepat 514 baris** (mewakili seluruh kabupaten/kota di 34 provinsi Indonesia tahun 2021). Tidak boleh ada baris yang hilang akibat filter atau penghapusan outlier.
2. **Invarian Keunikan Entitas:** Kombinasi `provinsi` dan `kab_kota` harus memiliki 514 nilai unik (0 duplikasi entitas).
3. **Invarian Kelengkapan (*Zero Missing*):** Jumlah nilai kosong (*null* / *NaN* / *None*) wajib sama dengan **0** di seluruh kolom.
4. **Invarian Anti-Leakage:** Kolom biner bawaan `Klasifikasi Kemiskinan` (`poverty_class_target`) **dilarang muncul** pada `data/interim/` maupun `data/processed/`.

---

## 3. Kontrak Skema Berkas Terstandar (`data/interim/poverty_data_cleaned.csv`)

| Nama Kolom | Tipe Data Pandas | Nilai Boleh Null? | Batas Nilai (*Constraints*) | Penjelasan & Aturan Bisnis |
| :--- | :---: | :---: | :---: | :--- |
| `provinsi` | `object` (str) | Tidak | 34 Provinsi Unik | Nama provinsi resmi BPS (uppercase). |
| `kab_kota` | `object` (str) | Tidak | 514 Nama Unik | Nama kabupaten/kota bersih tanpa karakter asterisk. |
| `tipe_wilayah` | `object` (str) | Tidak | `['Kabupaten', 'Kota']` | Klasifikasi unit administrasi (413 Kab, 101 Kota). |
| `region_pulau` | `object` (str) | Tidak | 6 Kawasan Kepulauan | `Sumatera`, `Jawa`, `Bali & Nusa Tenggara`, `Kalimantan`, `Sulawesi`, `Maluku & Papua`. |
| `poverty_rate_p0` | `float64` | Tidak | $0.0 \le x \le 100.0$ | Persentase penduduk miskin riil BPS 2021. |
| `avg_school_years` | `float64` | Tidak | $0.0 \le x \le 20.0$ | Rata-rata lama sekolah (tahun). |
| `expenditure_per_capita` | `int64` | Tidak | $x > 0$ | Pengeluaran riil per kapita per tahun (Ribu Rupiah). |
| `human_dev_index` | `float64` | Tidak | $0.0 \le x \le 100.0$ | Indeks Pembangunan Manusia (IPM). |
| `life_expectancy` | `float64` | Tidak | $40.0 \le x \le 90.0$ | Umur Harapan Hidup saat lahir (tahun). |
| `sanitation_access_pct` | `float64` | Tidak | $0.0 \le x \le 100.0$ | Akses sanitasi layak (%) — *nilai 0.00% sah untuk Deiyai*. |
| `clean_water_access_pct` | `float64` | Tidak | $0.0 \le x \le 100.0$ | Akses air minum layak (%) — *nilai 0.00% sah untuk Mamberamo Tengah*. |
| `unemployment_rate_tpt` | `float64` | Tidak | $0.0 \le x \le 100.0$ | Tingkat Pengangguran Terbuka (%) — *nilai 0.00% sah untuk Nduga & Lanny Jaya*. |
| `labor_participation_tpak`| `float64`| Tidak | $0.0 \le x \le 100.0$ | Tingkat Partisipasi Angkatan Kerja (%). |
| `grdp_constant_million_idr`| `int64` | Tidak | $x > 0$ | PDRB konstan riil dalam skala **Juta Rupiah**. |
| `is_multivariate_anomaly` | `bool` | Tidak | `True` / `False` | Hasil deteksi Isolation Forest (`True` sebanyak 26). |
| `anomaly_score` | `float64` | Tidak | $-0.5 \le x \le 0.5$ | Skor keputusan kontinu dari Isolation Forest. |

---

## 4. Kontrak Skema Berkas Akhir (`data/processed/poverty_clusters.csv`)

Berkas processed mewarisi seluruh kolom interim di atas ditambah atribut keluaran pemodelan (total 21 kolom):

| Nama Kolom Tambahan | Tipe Data Pandas | Nilai Boleh Null? | Batas Nilai (*Constraints*) | Penjelasan & Aturan Bisnis |
| :--- | :---: | :---: | :---: | :--- |
| `cluster_id` | `int64` | Tidak | $0 \le x < 4$ | ID numerik hasil K-Means ($k=4$: 0, 1, 2, 3). |
| `cluster_name` | `object` (str) | Tidak | 4 Nama Persona Resmi | `Klaster 1: Perkotaan Modern & Formal`, `Klaster 2: Kabupaten Penyangga Mapan`, `Klaster 3: Perdesaan Agraris Rentan`, `Klaster 4: Wilayah 3T Deprivasi Akut`. |
| `vulnerability_score` | `float64` | Tidak | $0.0 \le x \le 1.0$ | Indeks Kerentanan Struktural Relatif ($V_{struc}$) komposit 4 defisit dasar. |
| `vulnerability_quadrant`| `object` (str) | Tidak | 4 Nilai Kuadran Resmi | `Kuadran I (Prioritas Utama)`, `Kuadran II (Kerentanan Tersembunyi)`, `Kuadran III (Kantong Kemiskinan Daya Beli)`, `Kuadran IV (Wilayah Terbina/Mapan)`. |
| `log_pdrb` | `float64` | Tidak | $x > 0$ | Transformasi $\ln(1 + \text{PDRB})$ untuk normalisasi sebaran PDRB riil. |

### 4.1 Spesifikasi Komputasi Indeks Kerentanan Struktural Relatif ($V_{\text{struc}}$)

Indeks Kerentanan Struktural Relatif ($V_{\text{struc}}$) merupakan instrumen skrining nonmoneter komposit berskala $[0, 1]$ yang merefleksikan keparahan defisit fasilitas dasar dan modal manusia di 514 kabupaten/kota:

1. **Empat Dimensi Defisit Struktural:**
   * **Defisit Sanitasi:** $\text{Def}_{\text{san}} = 100.0 - \text{sanitation\_access\_pct}$
   * **Defisit Air Minum:** $\text{Def}_{\text{wat}} = 100.0 - \text{clean\_water\_access\_pct}$
   * **Defisit Pendidikan:** $\text{Def}_{\text{edu}} = \max(\text{avg\_school\_years}) - \text{avg\_school\_years}$
   * **Defisit Kesehatan:** $\text{Def}_{\text{hlt}} = \max(\text{life\_expectancy}) - \text{life\_expectancy}$

2. **Normalisasi Min-Max:**
   Setiap defisit dinormalisasi secara independen ke rentang $[0, 1]$ menggunakan `MinMaxScaler`:
   $$\text{Def}_m^{\text{norm}} = \frac{\text{Def}_m - \min(\text{Def}_m)}{\max(\text{Def}_m) - \min(\text{Def}_m)}, \quad m \in \{\text{san, wat, edu, hlt}\}$$

3. **Agregasi Bobot Setara (Equal-Weighted Mean 25%):**
   $$V_{\text{struc}} = \frac{1}{4} \left( \text{Def}_{\text{san}}^{\text{norm}} + \text{Def}_{\text{wat}}^{\text{norm}} + \text{Def}_{\text{edu}}^{\text{norm}} + \text{Def}_{\text{hlt}}^{\text{norm}} \right)$$

4. **Ambang Batas Median Nasional (Screening Cut-off):**
   * $\text{Median}(V_{\text{struc}}) = \mathbf{0.2720}$ (pembulatan 4 desimal dari nilai eksak $0.27195$; atau $\mathbf{0.272}$ pada konfigurasi kode `src/poverty_radar/config.py`).
   * Wilayah dengan $V_{\text{struc}} \ge 0.2720$ diklasifikasikan memiliki tingkat kerentanan fasilitas dasar tinggi (Kuadran I atau Kuadran II).

### Kontrak Berkas Ringkasan Klaster (`data/processed/poverty_cluster_summary.csv`)
* **Jumlah Baris:** Tepat 4 baris (mewakili 4 klaster).
* **Kolom:** Memuat metrik agregat per klaster (`total_regions`, `pct_of_national`, `total_kabupaten`, `total_kota`, `dominant_region_pulau`, serta `mean` dan `median` untuk seluruh indikator numerik).
* **Integritas:** Total penjumlahan `total_regions` wajib tepat 514 baris.

### Kontrak Berkas Matriks Rekomendasi Kebijakan (`data/processed/policy_recommendations_matrix.csv`)
* **Jumlah Baris:** Tepat 8 baris (4 baris kategori `cluster` + 4 baris kategori `quadrant`).
* **Jumlah Kolom:** Tepat 13 kolom acuan kebijakan terstruktur:
  `category_type`, `id`, `code`, `name`, `n_regions`, `pct_regions`, `poverty_range`, `deficit_profile`, `working_hypothesis`, `primary_policy_track`, `fiscal_instruments`, `lead_agencies`, `direct_evidence_required`.
* **Integritas:**
  - `category_type` hanya bernilai `cluster` atau `quadrant`.
  - Zero null values (100% lengkap tanpa nilai kosong).
  - Konsistensi jumlah daerah: $\sum n_{\text{regions}} (\text{cluster}) = 514$ dan $\sum n_{\text{regions}} (\text{quadrant}) = 514$.

---

## 5. Prosedur Uji Validasi Otomatis (Sanity Checks)

Sebelum berkas olahan disimpan, skrip pemrosesan wajib menjalankan pengujian validasi assertions berikut:

```python
import pandas as pd

def validate_interim_data(df: pd.DataFrame) -> None:
    # 1. Row count validation
    assert len(df) == 514, f"Expected 514 rows, got {len(df)}"
    
    # 2. Entity uniqueness
    assert df.duplicated(subset=['provinsi', 'kab_kota']).sum() == 0, "Duplicate regions found!"
    
    # 3. Missing values check
    assert df.isnull().sum().sum() == 0, "Null values detected in dataset!"
    
    # 4. Anti-leakage target check
    assert 'poverty_class_target' not in df.columns, "Target leakage column found in interim data!"
    
    # 5. Numeric boundary validation
    assert (df['poverty_rate_p0'] >= 0.0).all() and (df['poverty_rate_p0'] <= 100.0).all()
    assert (df['sanitation_access_pct'] >= 0.0).all() and (df['sanitation_access_pct'] <= 100.0).all()
    assert (df['clean_water_access_pct'] >= 0.0).all() and (df['clean_water_access_pct'] <= 100.0).all()
    assert (df['grdp_constant_million_idr'] > 0).all()
    
    # 6. Anomaly tagging validation
    assert df['is_multivariate_anomaly'].sum() == 26, "Expected exactly 26 anomalies"
    
    print("All Data Contract assertions passed successfully!")
```

