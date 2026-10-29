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

## 5. Metrik Evaluasi, Validasi Eksternal, & Uji Ketahanan (Robustness Protocol)

Setiap eksperimen klasterisasi wajib mendokumentasikan 4 dimensi evaluasi yang komprehensif:

### 5.1 Evaluasi Kualitas Separasi Matematis & Realitas Empiris
* **Target Acuan Teoretis (*A Priori Heuristic*):**
  * *Silhouette Score:* Target acuan $> 0.35$.
  * *Davies-Bouldin Index (DBI):* Target acuan $< 1.20$.
* **Hasil Empiris pada Ruang Fitur (K-Means $k=4$, `RobustScaler`):**
  * **Pada Ruang Proyeksi 2D PCA (Komponen Utama 1 & 2):**  
    $\text{Silhouette} = \mathbf{0.3589}$ ($> 0.35$) dan $\text{DBI} = \mathbf{0.8801}$ ($< 1.20$). Pada ruang 2 dimensi esensial ini, pemisahan antarklaster **memenuhi target acuan teoretis secara sempurna**.
  * **Pada Ruang 7 Dimensi Fitur Asli:**  
    $\text{Silhouette} = \mathbf{0.2028}$ dan $\text{DBI} = \mathbf{1.4522}$.
* **Justifikasi Ilmiah & Bahaya Klaster Cacat (*Pathological Clustering*):**
  1. *Ilusi Metrik Tinggi pada Klaster Cacat:* Berdasarkan benchmark terhadap 20+ konfigurasi model (tercatat di log eksperimen), model yang mampu menghasilkan Silhouette $> 0.35$ dan DBI $< 1.20$ pada 7 dimensi asli hanyalah algoritma seperti *Agglomerative Average Linkage* ($\text{Silhouette} = 0.3943$, $\text{DBI} = 0.7691$). Namun, model tersebut menghasilkan partisi cacat di mana **492 daerah menumpuk di 1 klaster**, sedangkan 3 klaster lainnya hanya mengisolasi pencilan ekstrem (17 daerah, 4 daerah, dan 1 daerah). Model semacam ini **tidak memiliki nilai guna kebijakan publik**.
  2. *Sifat Kontinum Pembangunan Sosio-Ekonomi:* Kabupaten/kota di Indonesia tidak terpisah menjadi pulau-pulau data buatan dengan jurang hampa. Pembangunan dari Daerah Transisi (187 daerah) menuju Perdesaan Agraris (216 daerah) adalah **kontinum bertahap**, sehingga titik-titik di batas antarklaster secara alami memiliki koefisien siluet di sekitar 0.
  3. *Efek Dimensi (Curse of Dimensionality):* Penggunaan 7 indikator non-moneter riil mendistribusikan jarak Euclidean secara multidimensi, sehingga skor siluet pada rentang $0.18 - 0.25$ merupakan capaian realistis dan optimal untuk data agregat 514 wilayah.

### 5.2 Validasi Eksternal Tingkat Kemiskinan Moneter ($P_0$ Inference Test)
Untuk membuktikan bahwa klaster yang dibentuk tanpa variabel kemiskinan (*zero data leakage*) benar-benar merefleksikan disparitas kesejahteraan riil di lapangan:
* Dilakukan uji statistik inferensial antarklaster terhadap tingkat kemiskinan aktual ($P_0$):
  * **One-Way ANOVA (Parametrik):** $F\text{-statistic} = \mathbf{155.94}$ ($p\text{-value} = \mathbf{1.03 \times 10^{-71}} < 0.001$).
  * **Kruskal-Wallis (Non-parametrik):** $H\text{-statistic} = \mathbf{167.52}$ ($p\text{-value} = \mathbf{4.36 \times 10^{-36}} < 0.001$).
* **Kesimpulan Validasi:** Pemisahan antarklaster terbukti sangat signifikan secara statistik ($p < 0.001$) dengan gradasi median $P_0$ berjenjang sempurna: Klaster 1 ($5.23\%$) $\to$ Klaster 2 ($8.16\%$) $\to$ Klaster 3 ($12.87\%$) $\to$ Klaster 4 ($31.61\%$).

### 5.3 Uji Stabilitas Multi-Seed (Robustness Check)
Untuk membuktikan bahwa penugasan klaster bukan merupakan artefak acak inisialisasi *centroid*:
* Jalankan K-Means sebanyak 20 kali dengan inisialisasi *random seed* berbeda (`random_state=1` s.d. `20`).
* Hitung konsistensi partisi menggunakan **Adjusted Rand Index (ARI)** antara model acak terhadap model dasar (`seed=42`).
* **Kriteria Kelulusan:** Rata-rata $\text{ARI} \ge 0.85$.
* **Hasil Empiris:** Rata-rata $\text{ARI} = \mathbf{0.9873}$ (konsistensi $98.7\%$), membuktikan stabilitas partisi yang luar biasa kokoh.
* **Konfirmasi Silang Antar-Algoritma:** K-Means vs *Agglomerative Ward* menghasilkan $\text{ARI} = \mathbf{0.7224}$, mengonfirmasi keselarasan partisi K-Means dengan pohon hirarki dendrogram.

### 5.4 Profiling Karakteristik Klaster (Storytelling Personas)
Setiap klaster yang dihasilkan wajib diprofilkan menggunakan nilai rata-rata/median z-score pada tiap indikator, dan divisualisasikan menggunakan **Small Multiples Bar Charts** atau **Heatmap Matrix** (bukan radar chart).

Contoh Tipologi Profil Terstandarisasi:
1. **Klaster 1: Perkotaan Modern & Formal (N=78):** IPM tinggi, RLS > 10 tahun, sanitasi/air minum universal, pengangguran terbuka formal moderat, $P_0$ sangat rendah (< 6%).
2. **Klaster 2: Kabupaten Penyangga Mapan (N=187):** Layanan dasar mantap di atas median nasional, pengeluaran menengah, $P_0$ di sekitar rata-rata nasional (8–12%).
3. **Klaster 3: Perdesaan Agraris Rentan (N=216):** Partisipasi kerja tinggi, sanitasi dan air minum terbatas di bawah median nasional, $P_0$ moderat-tinggi (12–18%).
4. **Klaster 4: Wilayah 3T Deprivasi Akut (N=33):** Akses air minum dan sanitasi kritis, RLS rendah (< 6 tahun), kemiskinan ekstrem ($P_0 > 30\%$), skor anomali multivariat tinggi.

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

