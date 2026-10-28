# PovertyRadar SDGs: Unsupervised Clustering Protocol

## DOKUMEN PROTOKOL PEMODELAN KLASTER SOSIO-EKONOMI DAERAH
**Versi:** 1.0  
**Tanggal:** 28 Oktober 2026  
**Mata Kuliah:** Presentasi Data dan Storytelling  
**Tujuan Dokumen:** Menetapkan standar pemilihan fitur, pra-pemrosesan (*scaling*), penentuan jumlah klaster optimal, metrik evaluasi matematis, serta interpretasi profil klaster untuk memastikan pemodelan bebas kebocoran target (*target leakage*), bebas redundansi multikolinearitas, dan memiliki reliabilitas tinggi.

---

## 1. Landasan Metodologis & Larangan Target Leakage

Dalam proyek PovertyRadar SDGs, pemodelan klaster dirancang untuk mengidentifikasi **tipologi struktural sosio-ekonomi daerah secara murni tanpa supervisi (*unsupervised learning*)**.

### 1.1 Aturan Non-Supervisi & Pemisahan Variabel
1. **Eliminasi Label Biner:** Kolom `poverty_class_target` (0/1) dari dataset mentah dilarang keras dimasukkan ke dalam model, baik sebagai fitur maupun target.
2. **Eksklusi Persentase Kemiskinan ($P_0$):** Kolom `poverty_rate_p0` **dikeluarkan dari vektor fitur klastering**.
   * *Justifikasi:* Jika $P_0$ disertakan saat klastering, algoritma hanya akan mengelompokkan daerah berdasarkan "miskin vs kaya", bukan berdasarkan "akar permasalahan struktural". $P_0$ diposisikan sebagai variabel pembanding eksternal (*benchmark*) pasca-klaster untuk melihat variasi kemiskinan di dalam tiap tipe daerah.
3. **Pencegahan Multikolinearitas Komposit IPM:** Indikator `human_dev_index` (IPM) dikeluarkan dari vektor fitur pelatihan jarak Euclidean karena berkorelasi $> 0.86$ dengan RLS, UHH, dan pengeluaran. Memasukkan IPM akan melipatgandakan bobot dimensi pembangunan manusia secara artifisial.

---

## 2. Seleksi Fitur & Matriks Rekayasa Input

Model klaster dilatih menggunakan **vektor 7 hingga 8 fitur independen** yang mencakup empat pilar pembangunan daerah:

| Pilar Pembangunan | Fitur Model | Nama Kolom Standar | Skala Asli | Transformasi Matematika |
| :--- | :--- | :--- | :---: | :---: |
| **Modal Manusia** | Rata-rata Lama Sekolah | `avg_school_years` | Tahun (1.42 — 12.83) | Standarisasi |
| **Derajat Kesehatan**| Umur Harapan Hidup | `life_expectancy` | Tahun (55.43 — 77.73) | Standarisasi |
| **Standar Hidup** | Pengeluaran Riil per Kapita| `expenditure_per_capita`| Ribu Rp (3.98M — 23.89M)| Standarisasi |
| **Layanan Dasar** | Akses Sanitasi Layak | `sanitation_access_pct` | % (0.00% — 99.97%) | Standarisasi |
| **Layanan Dasar** | Akses Air Minum Layak | `clean_water_access_pct` | % (0.00% — 100.00%) | Standarisasi |
| **Pasar Kerja** | Tingkat Pengangguran Terbuka | `unemployment_rate_tpt` | % (0.00% — 13.37%) | Standarisasi |
| **Skala Ekonomi** | PDRB Konstan 2010 | `grdp_constant_million_idr`| Juta Rp (147M — 460T) | $\log(1 + x)$ $\rightarrow$ Standarisasi |
| *Opsional (Uji)* | Partisipasi Angkatan Kerja | `labor_participation_tpak`| % (56.39% — 97.93%) | Standarisasi |

---

## 3. Protokol Pra-Pemrosesan & Pemilihan Scaler

### 3.1 Normalisasi Skewness PDRB
Sebelum diskalakan, variabel PDRB riil **wajib ditransformasi** menggunakan logaritma natural plus satu:
$$x_{\text{pdrb\_log}} = \log(1 + x_{\text{pdrb}})$$
Transformasi ini telah terbukti menekan *skewness* dari **+5.85** menjadi **+0.23**.

### 3.2 Pemilihan Algoritma Penskalaan (Scaler Selection)
Data sosio-ekonomi Indonesia memiliki 26 anomali multivariat ekstrem (daerah 3T di satu sisi dan megapolitan Jakarta di sisi lain). Oleh karena itu:
* **Pilihan Utama (Direkomendasikan): `RobustScaler`**
  Menstandarkan fitur dengan menghapus median dan menskalakan data berdasarkan rentang interkuartil ($IQR = Q_3 - Q_1$):
  $$z = \frac{x - \text{median}(x)}{IQR}$$
  *Keunggulan:* Tidak terdistorsi oleh nilai ekstrem wilayah 3T maupun PDRB Jakarta Pusat, sehingga separasi klaster pada kelompok mayoritas kabupaten/kota tetap tajam.
* **Pilihan Alternatif untuk Evaluasi Sensitivitas: `StandardScaler`**
  Menggunakan mean dan standar deviasi: $z = (x - \mu) / \sigma$.
  *Catatan:* Wajib membandingkan Silhouette Score antara kedua *scaler* sebelum menetapkan model final.

---

## 4. Algoritma Klastering & Strategi Penentuan $k$

### 4.1 Algoritma Primer & Sekunder
* **Algoritma Primer: K-Means Clustering (`sklearn.cluster.KMeans`)**
  * Konfigurasi: `init='k-means++'`, `n_init=25`, `max_iter=300`, `random_state=42`.
* **Algoritma Validasi: Agglomerative Hierarchical Clustering (`sklearn.cluster.AgglomerativeClustering`)**
  * Konfigurasi: `linkage='ward'`, metrik jarak Euclidean.
  * Digunakan untuk mengonfirmasi apakah struktur hirarkis dendrogram sejalan dengan partisi K-Means.

### 4.2 Prosedur Penentuan Jumlah Klaster ($k$) Optimal
Eksplorasi nilai $k$ diuji pada rentang $k \in [3, 7]$ menggunakan instrumen:
1. **Elbow Method (Inertia / WCSS):** Mencari titik belok laju penurunan inersia.
2. **Silhouette Analysis:** Menghitung rata-rata koefisien siluet tiap titik. Target: nilai rata-rata tertinggi, dengan syarat tidak ada klaster yang memiliki skor siluet negatif mayoritas.
3. **Davies-Bouldin Index (DBI):** Memilih $k$ yang meminimalkan rasio jarak dalam klaster vs antarklaster.
4. **Calinski-Harabasz Index (CH):** Memilih $k$ yang memaksimalkan rasio varians.
5. **Kriteria Kelayakan Storytelling:** Jumlah klaster harus menghasilkan tipologi bermakna (biasanya $k = 4$ atau $k = 5$) yang memudahkan pemangku kebijakan membedakan kelompok daerah tanpa kelebihan beban kognitif (*cognitive overload*).

---

## 5. Metrik Evaluasi & Uji Ketahanan (Robustness Protocol)

Setiap eksperimen klasterisasi wajib mendokumentasikan 3 dimensi evaluasi:

### 5.1 Evaluasi Kualitas Separasi Matematis
* **Silhouette Score:** Target $> 0.35$ (skor yang sangat baik untuk data sosio-ekonomi agregat 514 daerah).
* **Davies-Bouldin Index:** Target $< 1.20$.

### 5.2 Uji Stabilitas Multi-Seed (Robustness Check)
Untuk membuktikan bahwa klaster tidak bergantung pada inisialisasi acak:
* Jalankan K-Means sebanyak 10 kali dengan *random seeds* berbeda (`random_state=1` s.d. `10`).
* Hitung konsistensi partisi menggunakan **Adjusted Rand Index (ARI)** antara model acak terhadap model baseline (`seed=42`).
* **Kriteria Kelulusan:** Rata-rata $\text{ARI} \ge 0.85$ (menandakan stabilitas klaster tinggi).

### 5.3 Profiling Karakteristik Klaster (Storytelling Personas)
Setiap klaster yang dihasilkan wajib diprofilkan menggunakan nilai rata-rata/median z-score pada tiap indikator, dan divisualisasikan menggunakan **Small Multiples Bar Charts** atau **Heatmap Matrix** (bukan radar chart).

Contoh Tipologi Profil yang Diharapkan:
1. **Klaster A — Perkotaan Maju & Berdaya Saing Tinggi:** IPM tinggi, RLS > 10 tahun, sanitasi/air minum universal, pengangguran terbuka formal moderat, $P_0$ sangat rendah (< 6%).
2. **Klaster B — Daerah Berkembang / Transisi:** Layanan dasar moderat, pengeluaran menengah, $P_0$ di sekitar rata-rata nasional (8–12%).
3. **Klaster C — Perdesaan Agraris Subsisten:** Partisipasi kerja (TPAK) tinggi, pengangguran terbuka rendah, sanitasi cukup, $P_0$ moderat-tinggi (12–18%).
4. **Klaster D — Wilayah 3T Deprivasi Struktural Ekstrem:** Akses air minum dan sanitasi sangat minim, RLS rendah (< 6 tahun), $P_0$ sangat tinggi (> 25%), skor anomali multivariat tinggi.

---

## 6. Protokol Penyimpanan & Artefak Keluaran

Setelah klasterisasi selesai dan tervalidasi:
1. Simpan dataset hasil klasterisasi ke berkas:
   [`data/processed/poverty_clusters.csv`](file:///d:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/data/processed/poverty_clusters.csv)
2. Kolom tambahan yang wajib disertakan pada berkas luaran:
   * `cluster_id` (Integer: 0, 1, 2, ... k-1).
   * `cluster_name` (String: Label profil substantif, misal: "Perkotaan Maju", "Agraris Subsisten").
   * `vulnerability_score` (Float: Skor kerentanan struktural relatif).
   * `vulnerability_quadrant` (String: "Kuadran I", "Kuadran II", "Kuadran III", "Kuadran IV").
3. Catat konfigurasi model, hyperparameter, dan metrik evaluasi ke dalam notebook atau log eksperimen.

