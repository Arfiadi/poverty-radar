# Dataset Indikator Kemiskinan dan Sosial-Ekonomi Kabupaten/Kota di Indonesia

Dokumentasi ini menjelaskan spesifikasi, struktur, kamus data, serta catatan kualitas data untuk dataset indikator kemiskinan dan sosial-ekonomi kabupaten/kota di Indonesia.

---

## 1. Informasi Umum

| Atribut | Keterangan |
| :--- | :--- |
| **File Mentah** | `Klasifikasi Tingkat Kemiskinan di Indonesia.csv` (`data/raw/`) |
| **File Olahan/Interim** | `poverty_data_cleaned.csv` (`data/interim/`) |
| **File Olahan Final** | `poverty_clusters.csv` & `poverty_cluster_summary.csv` (`data/processed/`) |
| **Sumber Data** | Publikasi Publik BPS RI via [Kaggle Dataset oleh ldausl](https://www.kaggle.com/datasets/ldausl/klasifikasi-tingkat-kemiskinan-di-indonesia) |
| **Tahun / Periode Data** | 2021 (Kondisi 34 Provinsi) |
| **Tingkat Agregasi** | Kabupaten/Kota (Wilayah Administratif Tingkat II) |
| **Jumlah Observasi** | 514 baris (413 Kabupaten dan 101 Kota/Kota Administrasi) |
| **Jumlah Kolom** | 13 kolom (file mentah) / 16 kolom (file interim) |
| **Format File** | Comma-Separated Values (CSV), UTF-8 encoding |

### Aset Tambahan: Dataset Mandiri BPS 2023 (Standalone Companion)

Selain data baseline 2021 di atas, repositori ini memuat aset data mandiri hasil ekstraksi resmi BPS RI 2023:
* **File Mentah:** 5 publikasi resmi PDF di `data/raw/bps_2023/` (katalog lengkap: [README.md](file:///d:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/data/raw/bps_2023/README.md)).
* **Harmonisasi Wilayah:** `crosswalk_wilayah_34_38_provinsi.csv` (`data/interim/`) memetakan 34 provinsi baseline ke 38 provinsi pasca-pemekaran DOB Papua.
* **Dataset Standalone 2023:** `poverty_data_2023_standalone.csv` (`data/interim/`), mencakup 514 kabupaten/kota (21 kolom, 0 missing values).

> **Catatan Batasan:** Aset data 2023 bersifat mandiri untuk perbandingan/referensi masa depan dan tidak mengubah baseline 2021 maupun model clustering utama proyek PovertyRadar.

---

## 2. Cakupan Wilayah

Dataset mencakup 100% wilayah administratif tingkat II di Indonesia pada baseline tahun 2021 (sebelum pemekaran 4 provinsi baru di wilayah Papua pada akhir 2022):

* **Total Provinsi:** 34 Provinsi
* **Total Kabupaten/Kota:** 514 Wilayah
  * **Kabupaten:** 413 wilayah
  * **Kota / Kota Administrasi:** 101 wilayah (termasuk 5 kota administrasi dan 1 kabupaten administrasi di DKI Jakarta)

---

## 3. Kamus Data (Data Dictionary)

Berikut adalah rincian seluruh variabel yang terdapat di dalam dataset:

| No | Nama Kolom Asli | Nama Kolom Standar | Tipe Data | Satuan | Rentang Nilai (Min — Max) | Deskripsi Variabel |
| :-: | :--- | :--- | :-: | :-: | :---: | :--- |
| 1 | `Provinsi` | `provinsi` | String | - | 34 Provinsi | Nama provinsi tempat kabupaten/kota berada. |
| 2 | `Kab/Kota` | `kab_kota` | String | - | 514 Wilayah | Nama wilayah administratif kabupaten atau kota. |
| 3 | `Persentase Penduduk Miskin (P0) Menurut Kabupaten/Kota (Persen)` | `poverty_rate_p0` | Float | Persen (%) | 2.38% — 41.66% | *Headcount Index* ($P_0$): Persentase penduduk yang memiliki rata-rata pengeluaran per kapita per bulan di bawah Garis Kemiskinan (GK) BPS. |
| 4 | `Rata-rata Lama Sekolah Penduduk 15+ (Tahun)` | `avg_school_years` | Float | Tahun | 1.42 — 12.83 | Rata-rata jumlah tahun yang telah dihabiskan oleh penduduk usia 15 tahun ke atas dalam menempuh pendidikan formal. |
| 5 | `Pengeluaran per Kapita Disesuaikan (Ribu Rupiah/Orang/Tahun)` | `expenditure_per_capita` | Integer | Ribu Rp/Orang/Tahun | 3,976 — 23,888 | Pengeluaran riil per kapita disesuaikan per tahun yang distandardisasi dengan paritas daya beli (*Purchasing Power Parity* / PPP). Nilai setara Rp3,98 juta s.d. Rp23,89 juta per orang per tahun. |
| 6 | `Indeks Pembangunan Manusia` | `human_dev_index` | Float | Indeks (0 — 100) | 32.84 — 87.18 | Indeks komposit capaian pembangunan manusia berbasis tiga dimensi dasar: umur panjang dan hidup sehat (UHH), pengetahuan (RLS & HLS), serta standar hidup layak (pengeluaran per kapita). |
| 7 | `Umur Harapan Hidup (Tahun)` | `life_expectancy` | Float | Tahun | 55.43 — 77.73 | Rata-rata perkiraan banyak tahun yang dapat ditempuh oleh seseorang sejak lahir (*Angka Harapan Hidup saat Lahir* / AHH). |
| 8 | `Persentase rumah tangga yang memiliki akses terhadap sanitasi layak` | `sanitation_access_pct` | Float | Persen (%) | 0.00% — 99.97% | Proporsi rumah tangga yang menggunakan fasilitas sanitasi milik sendiri atau bersama dengan kloset leher angsa dan tempat pembuangan akhir tinja ke tangki septik atau SPAL. |
| 9 | `Persentase rumah tangga yang memiliki akses terhadap air minum layak` | `clean_water_access_pct` | Float | Persen (%) | 0.00% — 100.00% | Proporsi rumah tangga dengan sumber air minum utama terlindung (ledeng/perpipaan, sumur bor/pompa, sumur terlindung, mata air terlindung, atau air hujan). |
| 10 | `Tingkat Pengangguran Terbuka` | `unemployment_rate_tpt` | Float | Persen (%) | 0.00% — 13.37% | Persentase angkatan kerja yang menganggur (tidak bekerja dan sedang mencari pekerjaan, mempersiapkan usaha, atau merasa tidak mungkin mendapatkan pekerjaan). |
| 11 | `Tingkat Partisipasi Angkatan Kerja` | `labor_participation_tpak` | Float | Persen (%) | 56.39% — 97.93% | Persentase penduduk usia kerja (15 tahun ke atas) yang aktif secara ekonomi (termasuk yang sedang bekerja maupun yang menganggur). |
| 12 | `PDRB atas Dasar Harga Konstan menurut Pengeluaran (Rupiah)` | `grdp_constant_million_idr` | Integer | Juta Rupiah (Riil BPS) | 147,485 — 460,081,046 | Produk Domestik Regional Bruto (PDRB) atas dasar harga konstan menurut pengeluaran. Label header mencantumkan `(Rupiah)`, namun satuan angka riil BPS adalah **Juta Rupiah** (Rp147 miliar s.d. Rp460 triliun). |
| 13 | `Klasifikasi Kemiskinan` | `poverty_class_target` | Integer | Kategori Biner (0/1) | 0 atau 1 | Label biner dari dataset sumber: `0` = Rendah/Sedang (452 wilayah / 87.94%), `1` = Tinggi (62 wilayah / 12.06%). **Catatan:** Kolom ini **tidak digunakan** karena proyek PovertyRadar SDGs murni berbasis *Unsupervised Clustering* dan pemetaan deskriptif (*No Supervised Classification*). |

---

### Variabel Tambahan pada File Terstandar (`data/interim/poverty_data_cleaned.csv`)

| Nama Kolom | Tipe Data | Kategori Nilai | Deskripsi |
| :--- | :---: | :--- | :--- |
| `tipe_wilayah` | String | `Kabupaten` (413), `Kota` (101) | Klasifikasi tipe wilayah administratif yang diekstraksi dari awalan nama daerah. |
| `region_pulau` | String | `Sumatera`, `Jawa`, `Bali & Nusa Tenggara`, `Kalimantan`, `Sulawesi`, `Maluku & Papua` | Pengelompokan wilayah geografis berdasarkan kepulauan besar di Indonesia. |
| `is_multivariate_anomaly` | Boolean | `True` (26), `False` (488) | Penanda anomali multivariat hasil deteksi Isolation Forest (`contamination=0.05`). |
| `anomaly_score` | Float | Kontinu ($-0.201$ s.d. $+0.165$) | Skor kejanggalan multidimensi dari Isolation Forest (skor semakin negatif = anomali lebih ekstrem). |

---

## 4. Kualitas Data & Catatan Teknis (Data Quality Notes)

1. **Kelengkapan Nilai (*Missing Values*):**
   * Tidak ditemukan nilai kosong (*null* atau *NaN*) di seluruh baris dan kolom (`0 missing values`).
2. **Duplikasi (*Duplicates*):**
   * Tidak ditemukan duplikasi baris penuh maupun duplikasi pasangan entitas (`provinsi`, `kab_kota`).
3. **Sanitasi *Whitespace* & Karakter Khusus:**
   * Kolom `Tingkat Partisipasi Angkatan Kerja` pada file mentah memuat *trailing/leading whitespace* (misalnya `' 71.15 '`), yang telah disanitasi menjadi numerik bersih pada file interim.
   * Entitas `Nduga *` (Papua) pada file mentah memuat karakter asterisk `*` (residu catatan kaki BPS terkait estimasi wilayah khusus), yang telah dibersihkan menjadi `Nduga`.
4. **Catatan Nilai Batas Nol (0.00%):**
   * Nilai `0.00%` tercatat pada beberapa indikator wilayah:
     * Akses sanitasi layak: Kabupaten Deiyai (0.00%).
     * Akses air minum layak: Kabupaten Mamberamo Tengah (0.00%).
     * Tingkat Pengangguran Terbuka (TPT): Kabupaten Nduga (0.00%) dan Kabupaten Lanny Jaya (0.00%).
   * Nilai tersebut merupakan cerminan kondisi faktual di daerah 3T (Tertinggal, Terdepan, Terluar) Papua berdasarkan survei Susenas/Sakernas BPS, bukan nilai hilang (*missing*) sistemik.
5. **Koreksi Semantik Satuan PDRB:**
   * Kolom PDRB mencantumkan nilai tertinggi `460,081,046` (Kota Jakarta Pusat) dan terendah `147,485` (Kabupaten Tambrauw).
   * Dalam metodologi akuntansi regional BPS, angka tersebut berskala **Juta Rupiah** (sehingga nilai Jakarta Pusat adalah Rp460 triliun, bukan Rp460 juta atau Rp460 ribu).
6. **Karakteristik Label `Klasifikasi Kemiskinan` & Penegasan Non-Klasifikasi:**
   * Distribusi kelas sangat tidak seimbang (*class imbalance*): Kelas 0 sebanyak 87.94% dan Kelas 1 sebanyak 12.06%.
   * Mayoritas Kelas 1 adalah wilayah dengan persentase kemiskinan $P_0 \ge 20\%$. Terdapat beberapa inkonsistensi batas pelabelan bawaan (misalnya Kabupaten Merauke dengan $P_0 = 10.16\%$ berlabel 1, sedangkan Kabupaten Jayawijaya dengan $P_0 = 37.09\%$ berlabel 0).
   * **Keputusan Proyek:** Kolom ini **dikeluarkan / diabaikan sepenuhnya** dari analisis modeling. Proyek PovertyRadar SDGs **TIDAK melakukan pemodelan klasifikasi terawasi (*supervised classification*)**, melainkan berfokus penuh pada **pemetaan deskriptif spasial**, **unsupervised clustering profil sosial-ekonomi daerah**, dan **skrining kerentanan struktural relatif**.
7. **Deteksi Anomali Multivariat & Kebijakan Do Not Drop:**
   * Diterapkan algoritma *Isolation Forest* (`contamination=0.05`, `random_state=42`) pada seluruh indikator numerik, mendeteksi 26 daerah anomali multidimensi yang terbagi dalam dua kutub: daerah 3T terpencil (Nduga, Lanny Jaya, Mamberamo Tengah, dll.) dan pusat megapolitan (Jakarta Selatan, Bandung, dll.).
   * Seluruh 26 anomali **dipertahankan (Do Not Drop)** agar tidak menghilangkan representasi daerah paling rentan (SDG 1), dengan penambahan kolom flag `is_multivariate_anomaly` dan `anomaly_score`.

---

## 5. Kamus Data Berkas Akhir (`data/processed/poverty_clusters.csv`)

Berkas processed merupakan dataset final 514 kabupaten/kota (21 kolom) yang di-generate secara otomatis oleh `poverty_radar.pipeline` untuk dikonsumsi oleh tim dashboard:

| No | Nama Kolom | Tipe Data | Kategori / Rentang | Deskripsi & Aturan Bisnis |
| :-: | :--- | :---: | :---: | :--- |
| 1 | `provinsi` | String | 34 Provinsi | Nama provinsi resmi BPS. |
| 2 | `kab_kota` | String | 514 Wilayah | Nama resmi kabupaten/kota (bersih tanpa tanda asterisk). |
| 3 | `tipe_wilayah` | String | `Kabupaten`, `Kota` | Kategori wilayah administrasi (413 Kabupaten, 101 Kota). |
| 4 | `region_pulau` | String | 6 Kawasan | `Sumatera`, `Jawa`, `Bali & Nusa Tenggara`, `Kalimantan`, `Sulawesi`, `Maluku & Papua`. |
| 5 | `cluster_id` | Integer | `0, 1, 2, 3` | ID numerik hasil pemodelan K-Means ($k=4$). |
| 6 | `cluster_name` | String | 4 Persona Resmi | Label persona terstandarisasi:<br>• `Klaster 1: Perkotaan Modern & Formal`<br>• `Klaster 2: Kabupaten Penyangga Mapan`<br>• `Klaster 3: Perdesaan Agraris Rentan`<br>• `Klaster 4: Wilayah 3T Deprivasi Akut` |
| 7 | `vulnerability_score` | Float | $0.0210 \le x \le 0.9536$ | Indeks Kerentanan Struktural Relatif ($V_{struc}$): rerata terstandardisasi 4 defisit fasilitas dasar (sanitasi, air minum, RLS, UHH). |
| 8 | `vulnerability_quadrant` | String | 4 Kuadran Kebijakan | Segmentasi kuadran kartesius ($P_0$ vs $V_{struc}$):<br>• `Kuadran I (Prioritas Utama)` ($P_0 \ge \text{med}, V_{struc} \ge \text{med}$)<br>• `Kuadran II (Kerentanan Tersembunyi)` ($P_0 < \text{med}, V_{struc} \ge \text{med}$)<br>• `Kuadran III (Kantong Kemiskinan Daya Beli)` ($P_0 \ge \text{med}, V_{struc} < \text{med}$)<br>• `Kuadran IV (Wilayah Terbina/Mapan)` ($P_0 < \text{med}, V_{struc} < \text{med}$) |
| 9 | `poverty_rate_p0` | Float | $2.38\% \le x \le 41.66\%$ | Persentase kemiskinan moneter aktual BPS 2021. |
| 10 | `avg_school_years` | Float | $1.42 \le x \le 12.83$ | Rata-rata lama sekolah penduduk usia 25+ (tahun). |
| 11 | `expenditure_per_capita` | Integer | $3,976 \le x \le 23,888$ | Pengeluaran riil per kapita disesuaikan (Ribu Rp/orang/tahun). |
| 12 | `human_dev_index` | Float | $32.84 \le x \le 87.18$ | Indeks Pembangunan Manusia (IPM). |
| 13 | `life_expectancy` | Float | $55.43 \le x \le 77.73$ | Umur Harapan Hidup saat lahir (tahun). |
| 14 | `sanitation_access_pct` | Float | $0.00\% \le x \le 99.97\%$ | Akses rumah tangga terhadap sanitasi layak (%). |
| 15 | `clean_water_access_pct` | Float | $0.00\% \le x \le 100.00\%$ | Akses rumah tangga terhadap air minum layak (%). |
| 16 | `unemployment_rate_tpt` | Float | $0.00\% \le x \le 13.37\%$ | Tingkat Pengangguran Terbuka (%). |
| 17 | `labor_participation_tpak`| Float | $56.39\% \le x \le 97.93\%$ | Tingkat Partisipasi Angkatan Kerja (%). |
| 18 | `grdp_constant_million_idr`| Integer | $147,485 \le x \le 460,081,046$ | PDRB riil ADHK dalam satuan Juta Rupiah. |
| 19 | `log_pdrb` | Float | $11.89 \le x \le 19.95$ | Transformasi $\ln(1 + \text{PDRB})$ untuk mereduksi skewness. |
| 20 | `is_multivariate_anomaly` | Boolean | `True` (26), `False` (488) | Flag wilayah anomali multidimensi (Isolation Forest). |
| 21 | `anomaly_score` | Float | $-0.201 \le x \le 0.165$ | Skor keputusan kontinu Isolation Forest. |

---

## 6. Kamus Data Berkas Ringkasan Klaster (`data/processed/poverty_cluster_summary.csv`)

Berkas ringkasan 4 baris yang menyajikan metrik agregat per klaster untuk mempermudah tim dashboard membuat kartu KPI dan visualisasi perbandingan profil tanpa perlu menghitung agregasi ulang di *front-end*:

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :---: | :--- |
| `cluster_id` | Integer | ID klaster (0 s.d. 3). |
| `cluster_name` | String | Nama persona klaster resmi. |
| `total_regions` | Integer | Jumlah kabupaten/kota dalam klaster (78, 187, 216, 33). |
| `pct_of_national` | Float | Persentase wilayah terhadap total nasional 514 daerah. |
| `total_kabupaten` | Integer | Jumlah unit Kabupaten. |
| `total_kota` | Integer | Jumlah unit Kota. |
| `dominant_region_pulau` | String | Kawasan pulau dengan jumlah daerah terbanyak dalam klaster. |
| `poverty_rate_p0_mean` / `median` / `min` / `max` | Float | Rerata, median, minimum, dan maksimum tingkat kemiskinan ($P_0$). |
| `vulnerability_score_mean` / `median` | Float | Rerata dan median skor kerentanan struktural ($V_{struc}$). |
| `human_dev_index_mean` / `median` | Float | Rerata dan median IPM. |
| `expenditure_per_capita_mean` / `median` | Integer | Rerata dan median pengeluaran per kapita (Ribu Rp). |
| `avg_school_years_mean` / `median` | Float | Rerata dan median RLS (tahun). |
| `life_expectancy_mean` / `median` | Float | Rerata dan median UHH (tahun). |
| `sanitation_access_pct_mean` / `median` | Float | Rerata dan median akses sanitasi layak (%). |
| `clean_water_access_pct_mean` / `median` | Float | Rerata dan median akses air minum layak (%). |
| `unemployment_rate_tpt_mean` / `median` | Float | Rerata dan median TPT (%). |
| `labor_participation_tpak_mean` / `median` | Float | Rerata dan median TPAK (%). |
| `grdp_constant_million_idr_median` | Integer | Median PDRB riil konstan (Juta Rp). |

---

### File Matriks Rekomendasi Kebijakan (`data/processed/policy_recommendations_matrix.csv`)

File tabel acuan terstruktur (8 baris × 13 kolom) yang memuat rekomendasi kebijakan terperinci untuk 4 Klaster Sosio-Ekonomi dan 4 Kuadran Skrining Kerentanan Relatif yang diekstraksi dari Dokumen Master Kebijakan (`docs/02-desain-rekomendasi-kebijakan-berbasis-clustering-povertyradar.md`).

| Kolom | Tipe Data | Deskripsi |
| :--- | :---: | :--- |
| `category_type` | String | Tipe kategori (`cluster` atau `quadrant`). |
| `id` | String | Identifier unik (`cluster_0` s.d. `cluster_3`, `quadrant_1` s.d. `quadrant_4`). |
| `code` | String | Kode singkatan (`K1` s.d. `K4`, `Q1` s.d. `Q4`). |
| `name` | String | Nama resmi tampilan klaster / kuadran. |
| `n_regions` | Integer | Jumlah kabupaten/kota anggota ($N$). |
| `pct_regions` | Float | Persentase terhadap total nasional (%). |
| `poverty_range` | String | Rentang dan karakteristik tingkat kemiskinan moneter ($P_0$). |
| `deficit_profile` | String | Profil defisit struktural empiris teramati. |
| `working_hypothesis` | String | Hipotesis mekanisme kerja sosio-ekonomi yang perlu diverifikasi lapangan. |
| `primary_policy_track` | String | Jalur intervensi kebijakan utama. |
| `fiscal_instruments` | String | Rekomendasi instrumen fiskal & sumber pendanaan (DAK, DAU, Dana Desa, Otsus). |
| `lead_agencies` | String | Instansi penanggung jawab teknis (OPD / Kementerian). |
| `direct_evidence_required` | String | Syarat verifikasi bukti empiris langsung sebelum penetapan belanja anggaran. |

---

## 7. Nilai Acuan Nasional (*Benchmark Reference Lines*) untuk Dashboard

Gunakan angka referensi nasional berikut saat membuat kartu KPI makro dan garis potong visualisasi:

* **Tingkat Kemiskinan ($P_0$):**
  * *Rata-rata Nasional:* **12.32%**
  * *Median Nasional (Garis Potong Kuadran):* **10.46%**
  * *Titik Minimum:* **2.38%** (Kota Sawahlunto, Sumatera Barat)
  * *Titik Maksimum:* **41.66%** (Kabupaten Intan Jaya, Papua)
  * *Rasio Disparitas Ekstrem:* **17.5x**
* **Indeks Kerentanan Struktural Relatif ($V_{struc}$):**
  * *Median Nasional (Garis Potong Kuadran):* **0.2721**
  * *Titik Minimum:* **0.0210** (Kota Yogyakarta)
  * *Titik Maksimum:* **0.9536** (Kabupaten Nduga)
* **Distribusi Kuadran 2x2:**
  * *Kuadran I (Prioritas Utama):* **162 wilayah (31.5%)**
  * *Kuadran II (Kerentanan Tersembunyi):* **95 wilayah (18.5%)**
  * *Kuadran III (Kantong Kemiskinan Daya Beli):* **95 wilayah (18.5%)**
  * *Kuadran IV (Wilayah Terbina/Mapan):* **162 wilayah (31.5%)**


