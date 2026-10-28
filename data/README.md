# Dataset Indikator Kemiskinan dan Sosial-Ekonomi Kabupaten/Kota di Indonesia

Dokumentasi ini menjelaskan spesifikasi, struktur, kamus data, serta catatan kualitas data untuk dataset indikator kemiskinan dan sosial-ekonomi kabupaten/kota di Indonesia.

---

## 1. Informasi Umum

| Atribut | Keterangan |
| :--- | :--- |
| **File Mentah** | `Klasifikasi Tingkat Kemiskinan di Indonesia.csv` (`data/raw/`) |
| **File Olahan/Interim** | `poverty_data_cleaned.csv` (`data/interim/`) |
| **Sumber Data** | Publikasi Publik BPS RI via [Kaggle Dataset oleh ldausl](https://www.kaggle.com/datasets/ldausl/klasifikasi-tingkat-kemiskinan-di-indonesia) |
| **Tahun / Periode Data** | 2021 (Kondisi 34 Provinsi) |
| **Tingkat Agregasi** | Kabupaten/Kota (Wilayah Administratif Tingkat II) |
| **Jumlah Observasi** | 514 baris (413 Kabupaten dan 101 Kota/Kota Administrasi) |
| **Jumlah Kolom** | 13 kolom (file mentah) / 16 kolom (file interim) |
| **Format File** | Comma-Separated Values (CSV), UTF-8 encoding |

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

