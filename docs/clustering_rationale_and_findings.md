# PovertyRadar SDGs: Justifikasi Metodologis Klastering & Profil Sosio-Ekonomi Wilayah

**Dokumen Rujukan Teknis & Kebijakan**  
**Penulis:** Tim Analis Data PovertyRadar SDGs  
**Dataset Utama:** BPS 2021 (514 Kabupaten/Kota di 34 Provinsi)  
**Dokumen Terkait:** [`docs/clustering_protocol.md`](file:///d:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/docs/clustering_protocol.md) • [`docs/problem_framing_and_objectives.md`](file:///d:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/docs/problem_framing_and_objectives.md)

---

## 1. Justifikasi Eliminasi & Isolasi Variabel

Untuk memastikan pemodelan *unsupervised clustering* bebas bias, bebas multikolinearitas, dan memiliki daya diskriminasi optimal, empat variabel diperlakukan secara khusus:

### 1.1 Eliminasi Mutlak: `Klasifikasi Kemiskinan` (Label Biner Bawaan)
* **Pencegahan Penalaran Melingkar (*Target Leakage*):** Proyek ini menolak klasifikasi terawasi (*supervised classification*). Memprediksi status kemiskinan dari indikator pengeluaran, kesehatan, dan pendidikan yang merupakan pembentuk garis kemiskinan adalah bentuk kebocoran target yang tidak menghasilkan kebaruan wawasan kebijakan.
* **Cacat Validitas Data Lapangan:** Kolom biner bawaan bukan indikator resmi BPS, melainkan hasil penyekatan *ad-hoc* yang terbukti memuat anomali pengkategorian di wilayah Indonesia Timur. Kolom ini **dihapus sepenuhnya (*dropped*)**.

### 1.2 Isolasi Komposit: `Indeks Pembangunan Manusia (IPM)`
* **Pencegahan Multikolinearitas Ekstrem ($r > 0.86$):** IPM berkorelasi sangat tinggi dengan variabel pembangunnya: Rata-rata Lama Sekolah ($r = +0.81$), Umur Harapan Hidup ($r = +0.82$), dan Pengeluaran Riil per Kapita ($r = +0.88$). Memasukkan IPM bersama komponen pembangunnya akan melipatgandakan bobot dimensi manusia secara artifisial (*double-counting*) pada penghitungan jarak Euclidean.
* **Menghilangkan Efek Topeng (*Masking Effect*):** Dua daerah bisa memiliki skor IPM identik (misal: 68.0), namun Daerah A unggul kesehatan tetapi miskin daya beli, sedangkan Daerah B kaya daya beli tetapi sanitasi buruk. Menggunakan variabel pembangun terurai membongkar akar masalah ini secara transparan.
* **Fungsi IPM:** IPM dikeluarkan dari fitur klastering dan ditempatkan sebagai **tolok ukur validasi eksternal (*external benchmark*)** pasca-klaster.

### 1.3 Isolasi Redundansi Pasar Kerja: `Tingkat Partisipasi Angkatan Kerja (TPAK)`
* **Redundansi Ketenagakerjaan ($r = -0.582$ dengan TPT):** TPT dan TPAK merupakan dua sisi koin yang sama. Memasukkan keduanya membuat sektor ketenagakerjaan mendominasi 25% bobot fitur model K-Means.
* **Bukti Empiris Penurunan Kualitas Model:** Berdasarkan pengujian *A/B testing* 514 daerah:
  * Model dengan TPT saja (7 Fitur): **Silhouette = 0.2028 | DBI = 1.4522** *(Optimal)*.
  * Model dengan TPT + TPAK (8 Fitur): **Silhouette = 0.1821 | DBI = 1.5541** *(Merosot ~10%)*.
* **Paradoks Kesejahteraan ($r = +0.462$ dengan Kemiskinan):** Di daerah miskin dan 3T, angka TPAK tinggi bukan tanda ekonomi sehat, melainkan keterpaksaan warga usia rentan/anak untuk bekerja di sektor pertanian subsisten demi bertahan hidup (*mandatory subsistence labor*). TPT dipilih karena memiliki daya pembeda tajam antara pasar kerja formal perkotaan (8–12%) vs subsisten perdesaan (1–3%).

### 1.4 Pengeluaran Persentase Kemiskinan (`poverty_rate_p0`) dari Fitur Klastering
* **Mencegah Polarisasi Semu:** Berdasarkan uji empiris, memasukkan $P_0$ (Skenario A) menurunkan kualitas teknis (Silhouette 0.1961 vs 0.2028).
* **Membuka Deteksi Anomali 2x2:** Mengeluarkan $P_0$ dari klastering (Skenario B) memungkinkan sistem mendeteksi fenomena **Kantong Kemiskinan** (wilayah berfasilitas baik namun miskin) dan **Kerentanan Tersembunyi** (wilayah tampak tidak miskin padahal sanitasi buruk).

---

## 2. Justifikasi Pemilihan Jumlah Klaster ($k = 4$)

Pemilihan $k = 4$ adalah titik temu optimal (*sweet spot*) antara **validitas matematis kurva Elbow** dan **relevansi substantif kebijakan publik SDG 1**:

```text
Inersia K-Means (WCSS):
k=2 (1770) ───► k=3 (1379) ───► k=4 (1192) ───[Melandai / Diminishing Returns]───► k=5 (1086)
                                    ▲
                          [TITIK BELOK ELBOW]
```

### 2.1 Dekonstruksi Ilusi Matematis $k = 3$
* Secara statistik murni, $k = 3$ memiliki Silhouette Score lebih tinggi (0.2863) dan DBI lebih rendah (1.2094).
* **Kelemahan Fatal $k = 3$ (*The Giant Blob*):** Skor tinggi pada $k = 3$ merupakan ilusi yang ditarik oleh keterisolasian 34 daerah 3T ekstrem. Akibatnya, sebanyak **322 kabupaten/kota (62.6% wilayah Indonesia)** dipaksa menumpuk ke dalam satu klaster raksasa.
* Pola $k = 3$ mencampurkan kabupaten berinfrastruktur sehat di Jawa/Sumatera dengan perdesaan agraris tertinggal di pelosok luar Jawa ke dalam satu paket kebijakan seragam (*one-size-fits-all*).

### 2.2 Keunggulan Strategis $k = 4$
Pada $k = 4$, kelompok raksasa 322 daerah tersebut terurai secara proporsional menjadi dua arketipe yang berbeda nyata:

| Indikator Kunci | Klaster 2 ($N=187$) *(Penyangga Mapan)* | Klaster 3 ($N=216$) *(Agraris Rentan)* | Selisih ($\Delta$) & Makna Kebijakan |
| :--- | :---: | :---: | :--- |
| **Akses Sanitasi Layak** | **84.67%** | **72.29%** | $\Delta = 12.38\%$ (Infrastruktur sanitasi Klaster 3 tertinggal) |
| **Umur Harapan Hidup** | **71.39 tahun** | **67.67 tahun** | $\Delta = 3.72\text{ tahun}$ (Derajat kesehatan fisik Klaster 2 jauh lebih unggul) |
| **Rata-rata Lama Sekolah**| **8.34 tahun** | **8.13 tahun** | $\Delta = 0.21\text{ tahun}$ (Durasi sekolah setara: sama-sama lulusan SMP) |
| **Pengeluaran Riil / Kapita**| **Rp10,90 juta** | **Rp8,94 juta** | $\Delta = \text{Rp1,96 juta}$ (Daya beli Klaster 2 lebih mantap) |
| **Median Kemiskinan ($P_0$)** | **9.68%** | **13.13%** | Membelah garis median nasional BPS ($10.46\%$) |

* **Stabilitas Multi-Seed Teruji:** Pada pengujian 20 *random seeds*, $k = 4$ menghasilkan konsistensi penugasan **Adjusted Rand Index (ARI) = 0.9803**, jauh melampaui batas minimum reliabilitas ($0.85$).

---

## 3. Variabel Pembeda & Karakteristik Utama Tiap Klaster

Analisis matriks deviasi Z-score (`RobustScaler`, pusat $0.00 = \text{Median Nasional}$) mengungkap dinamika pembeda antarklaster:

### 3.1 Pembeda Global Berdasarkan Rentang Dispersi (*Max Spread*)
1. **Akses Sanitasi Layak (Rentang = 3.11 | $+0.54 \text{ s.d. } -2.57$):** Pembeda paling tajam pemisah kelayakan permukiman di Indonesia.
2. **Lama Sekolah / RLS (Rentang = 3.07 | $+1.40 \text{ s.d. } -1.67$):** Pembeda jurang modal manusia kognitif.
3. **Pengeluaran per Kapita (Rentang = 2.73 | $+1.40 \text{ s.d. } -1.33$):** Pembeda kapasitas daya beli riil ekonomi rumah tangga.
4. **Akses Air Minum Layak (Rentang = 2.60 | $+0.46 \text{ s.d. } -2.14$):** Pembeda ketersediaan kebutuhan pokok terlindung.
5. **Pengangguran Terbuka / TPT (Rentang = 2.02 | $+1.23 \text{ s.d. } -0.79$):** Pembeda struktur pasar tenaga kerja formal vs subsisten.

### 3.2 Asimetri Laju Penurunan Antartingkatan Klaster
Meskipun nilai seluruh variabel bergerak menurun dari Klaster 1 ke 4, faktor penentu kejatuhannya berbeda di setiap tingkatan:
* **Klaster 1 ke Klaster 2:** Kejatuhan pada **Modal Manusia & Pengeluaran** (RLS $\Delta = -1.38$; Pengeluaran $\Delta = -1.17$). Fasilitas fisik sanitasi dan kesehatan tetap bertahan mantap.
* **Klaster 2 ke Klaster 3:** Kejatuhan pada **Derajat Kesehatan & Fasilitas Sanitasi** (UHH $\Delta = -0.80$; Sanitasi $\Delta = -0.63$), sementara durasi sekolah warganya hampir identik ($\Delta = -0.12$).
* **Klaster 3 ke Klaster 4:** **Kolaps Total Infrastruktur Fisik Dasar** (Sanitasi anjlok $\Delta = -2.09$; Air Bersih anjlok $\Delta = -1.62$).

---

## 4. Penamaan Profil Klaster Berbasis Bukti (*Evidence-Based Personas*)

Penamaan dirancang agar deskriptif, mencerminkan akar masalah empiris, dan langsung dapat ditindaklanjuti dalam dokumen kebijakan:

| Klaster | Nama Persona Terpilih | Komposisi Geografis Riil | Nilai Rata-rata Lapangan (Karakteristik Kunci) |
| :---: | :--- | :--- | :--- |
| **1** | **Klaster 1: Perkotaan Modern & Formal** *(N=78)* | • **89.7% KOTA** (70 Kota, 8 Kab)<br>• 32 di Jawa, 21 di Sumatera | • RLS: **10.87 tahun** (SMA)<br>• Sanitasi: **92.35%** & Air: **97.81%**<br>• Pengeluaran: **Rp14,60 juta/tahun**<br>• TPT: **8.68%** (Tinggi: pasar kerja formal)<br>• Kemiskinan: **5.54%** |
| **2** | **Klaster 2: Kabupaten Penyangga Mapan** *(N=187)* | • **88.2% KABUPATEN** (165 Kab, 22 Kota)<br>• 74 di Jawa, 54 di Sumatera | • RLS: **8.34 tahun** (SMP)<br>• Sanitasi: **84.67%** & Air: **90.53%**<br>• UHH: **71.39 tahun** (Derajat sehat tinggi)<br>• Pengeluaran: **Rp10,90 juta/tahun**<br>• Kemiskinan: **9.68%** |
| **3** | **Klaster 3: Perdesaan Agraris Rentan** *(N=216)* | • **95.8% KABUPATEN** (207 Kab, 9 Kota)<br>• Luar Jawa dominan (73 Sumatera, 42 Sulawesi, 34 Maluku/Papua) | • RLS: **8.13 tahun** (SMP)<br>• Sanitasi: **72.29%** & Air: **80.85%**<br>• UHH: **67.67 tahun** (Anjlok di bawah median)<br>• TPT: **3.96%** (Kerja subsisten ladang)<br>• Kemiskinan: **13.13%** |
| **4** | **Klaster 4: Wilayah 3T Deprivasi Akut** *(N=33)* | • **100% KABUPATEN** (33 Kab, 0 Kota)<br>• 22 Maluku/Papua, 6 Sumatera (Nias), 4 NTT, 1 Sulawesi | • RLS: **5.26 tahun** (Tidak tamat SD)<br>• Sanitasi: **31.22%** (Krisis)<br>• Air Minum: **52.65%** (Krisis)<br>• Pengeluaran: **Rp6,01 juta/tahun**<br>• Kemiskinan: **31.39%** (Ekstrem) |

---

## 5. Analisis Lanjutan & Implikasi Kebijakan SDG 1

### 5.1 Skrining Kerentanan Relatif (Matriks Kuadran 2x2)
PovertyRadar SDGs memadukan tingkat kemiskinan aktual ($P_0$, garis potong median nasional $10.46\%$) dengan **Indeks Kerentanan Fasilitas Dasar ($V_{\text{struc}}$)**:
* **Kuadran I — Prioritas Utama ($P_0$ Tinggi, Kerentanan Tinggi, N=162):** Mayoritas anggota Klaster 4 dan sebagian Klaster 3. Membutuhkan intervensi terpadu komprehensif: stimulan bantuan sosial darurat dibarengi percepatan pembangunan fisik air dan sanitasi secara masif.
* **Kuadran II — Kerentanan Tersembunyi ($P_0$ Rendah, Kerentanan Tinggi, N=95):** Wilayah seperti Tanah Datar dan Indragiri Hilir. Kemiskinan saat ini tampak rendah namun sanitasinya buruk (<55%). Memerlukan intervensi sanitasi preventif guna mencegah kerentanan jatuh miskin saat terjadi syok ekonomi atau bencana.
* **Kuadran III — Kantong Kemiskinan Daya Beli ($P_0$ Tinggi, Kerentanan Rendah, N=95):** Wilayah seperti Biak Numfor, Sampang, dan Wonosobo. Fasilitas dasar dan pendidikan relatif memadai namun kemiskinannya tinggi. Solusi terarah: stimulus ekonomi lokal, penciptaan lapangan kerja formal, dan penguatan daya beli warga.
* **Kuadran IV — Wilayah Terbina/Mapan ($P_0$ Rendah, Kerentanan Rendah, N=162):** Mayoritas anggota Klaster 1 dan Klaster 2. Berperan menjaga stabilitas ekonomi dan menjadi model percontohan (*benchmarking*) tata kelola bagi daerah lain.

### 5.2 Validasi Signifikansi Statistik Eksternal
Meskipun $P_0$ dikeluarkan dari proses klastering, uji beda rata-rata membuktikan penugasan klaster berhasil memisahkan tingkat kemiskinan secara sangat signifikan:
* **ANOVA F-Statistic:** $F = 155.94$ ($p\text{-value} = 1.03 \times 10^{-71}$).
* **Kruskal-Wallis Non-Parametric H-Test:** $H = 167.52$ ($p\text{-value} = 4.36 \times 10^{-36}$).
* *Kesimpulan:* Klaster yang terbentuk secara murni dari 7 indikator struktural terbukti membedakan tingkat kemiskinan daerah dengan tingkat keyakinan $> 99.9\%$.

### 5.3 Ringkasan Aset Visual Terverifikasi
Seluruh visualisasi pendukung telah diaudit dan disimpan dalam resolusi publikasi 300 DPI:

| Berkas Gambar Visual | Lokasi Penyimpanan | Fokus Narasi |
| :--- | :--- | :--- |
| **Heatmap Matrix Divergen** | [`reports/figures/04_cluster_characteristics_heatmap.png`](file:///d:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/reports/figures/04_cluster_characteristics_heatmap.png) | Matriks perbandingan 28 Z-score antar-indikator (Biru = Unggul, Merah = Defisit). |
| **Small Multiples 2x2 Bar** | [`reports/figures/04_cluster_profiles_small_multiples.png`](file:///d:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/reports/figures/04_cluster_profiles_small_multiples.png) | Kartu profil persona klaster mandiri berorientasi panjang batang (*bar length*). |
| **Matriks Kuadran 2x2** | [`reports/figures/06_relative_vulnerability_matrix_2x2.png`](file:///d:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/reports/figures/06_relative_vulnerability_matrix_2x2.png) | Pemetaan sebaran 514 daerah pada 4 kuadran prioritas skrining intervensi. |
