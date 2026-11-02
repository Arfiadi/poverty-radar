# INSIGHT EKSPONENSIAL: DEEP SOCIOECONOMIC STORYTELLING
## Eksplorasi & Eksploitasi Mendalam 514 Kabupaten / Kota (BPS 2021)
**PovertyRadar SDGs — PENS Storytelling Semester 5**

---

## 1. Ringkasan Eksekutif & Temuan Kunci

Berdasarkan audit ekonometrika dan unsupervised learning terhadap 514 kabupaten/kota di Indonesia, kemiskinan di Indonesia bukan sekadar fenomena kekurangan uang (moneter), melainkan **kegagalan struktural konektivitas geografis, jebakan ekonomi ekstraktif (*enclave capitalism*), dan ketimpangan infrastruktur dasar**.

### Metrik Kunci Nasional:
* **Median Kemiskinan Nasional ($P_0$)**: `10.50%` (Rentang ekstrem: `2.38%` Kota Sawahlunto vs `41.66%` Kab. Intan Jaya &rarr; **Jurang 17.5x Lipat**).
* **Konsentrasi Klaster Akut ($N=62$)**: **87.1%** menumpuk di Indonesia Timur (Papua & NTT), hanya **12.9%** di Barat (seluruhnya daerah kepulauan terisolir).
* **Korelasi Terbalik Pengangguran**: Korelasi Kemiskinan vs TPT bernilai **negatif** ($r = -0.40$), sedangkan dengan TPAK bernilai **positif** ($r = +0.46$).

---

## 2. Sembilan Paradoks Sosioekonomi Indonesia

### Paradoks 1: "The Working Poor" (Pengangguran Rendah di Kantong Kemiskinan Akut)
* **Temuan**: Daerah paling miskin di Indonesia mencatat tingkat pengangguran mendekati **0.00%** dan partisipasi kerja (TPAK) $> 85\%$. Sebaliknya, kota-kota terkaya memiliki pengangguran tertinggi ($8\% - 10\%$).
* **Fakta Empiris**:
  * **Kab. Lanny Jaya & Nduga (Papua)**: Pengangguran `0.00%`, TPAK `95.7%` – `97.9%`, namun kemiskinan `37.2%` – `38.7%`.
  * **Kota Depok & Tangerang Selatan**: Pengangguran `8.60%` – `9.76%`, namun kemiskinan hanya `2.57%` – `2.58%`.
* **Narasi Storytelling**:
  > *"Menganggur adalah hak istimewa kelas menengah kota (*search unemployment*), di mana pemuda terdidik mampu menunggu lowongan kerja formal yang layak. Di pegunungan Papua dan pedalaman NTT, warga miskin tidak memiliki bantalan tabungan; mereka wajib bekerja kasar dan subsistensi setiap hari hanya agar dapur tetap mengepul."*

---

### Paradoks 2: "The Great Dualism" (Dikotomi 98 Kota vs 416 Kabupaten)
* **Temuan**: Terjadi jurang struktural ganda (*structural bifurcation*) antara wilayah administratif Kota dan Kabupaten di Indonesia.
* **Perbandingan Rata-rata**:

| Indikator | 98 Kota (Urban) | 416 Kabupaten (Rural/Agro) | Rasio / Jurang |
|---|---|---|---|
| **Tingkat Kemiskinan ($P_0$)** | **7.27%** | **13.47%** | **Kabupaten 1.8x Lebih Miskin** |
| **Pengangguran Terbuka (TPT)** | **7.98%** | **4.36%** | **Kota 1.8x Lebih Menganggur** |
| **Partisipasi Kerja (TPAK)** | 65.41% | 70.43% | Kabupaten lebih aktif bekerja |
| **Lama Sekolah (RLS)** | 10.62 tahun (SMA+) | 7.92 tahun (SMP) | Selisih 2.7 tahun pendidikan |
| **Pengeluaran Riil/Tahun** | Rp 13.55 Juta | Rp 9.55 Juta | Kota 1.4x lebih konsumtif |
| **Akses Sanitasi Layak** | 88.00% | 74.63% | Defisit 13.4% di pedesaan |

* **Narasi Storytelling**:
  > *"Indikator TPT BPS menyesatkan jika dipakai mengukur derita rakyat. Angka TPT sejatinya mengukur dinamika bursa kerja perkotaan. Kebijakan 'menciptakan lapangan kerja formal perkotaan' tidak akan pernah menyentuh 416 kabupaten yang mengalami jebakan produktivitas rendah."*

---

### Paradoks 3: "The Resource Curse" (Kutukan Enklave Tambang & Industri Raksasa)
* **Temuan**: Teridentifikasi **17 kabupaten di Indonesia dengan PDRB raksasa ($\ge \text{Rp } 25 \text{ Triliun}$)** namun persentase kemiskinannya tetap bertengger di atas median nasional ($12\% - 30\%$).
* **Fakta Empiris**:
  1. **Kab. Mimika (Papua - Tambang Freeport)**: PDRB **Rp 69.6 Triliun**, kemiskinan **14.17%**.
  2. **Kab. Bojonegoro (Jatim - Migas Blok Cepu)**: PDRB **Rp 65.8 Triliun**, kemiskinan **13.27%**.
  3. **Kab. Morowali (Sulteng - Hilirisasi Nikel)**: PDRB **Rp 54.9 Triliun**, kemiskinan **13.75%**.
  4. **Kab. Musi Banyuasin (Sumsel - Migas & Sawit)**: PDRB **Rp 46.1 Triliun**, kemiskinan **15.84%**.
  5. **Kab. Tuban (Jatim - Semen & Petrokimia)**: PDRB **Rp 44.0 Triliun**, kemiskinan **16.31%**.
  6. **Kab. Teluk Bintuni (Papua Barat - Kilang LNG Tangguh)**: PDRB **Rp 25.1 Triliun**, kemiskinan **29.79%**!
* **Narasi Storytelling**:
  > *"PDRB tambang dan migas adalah ilusi statistik. Nilai tambah diekspor ke luar daerah dan disedot pemilik modal modal padat (*capital-intensive*), sementara warga lokal di sekitar pagar tambang tetap buang air di sungai dan bertahan hidup di bawah garis kemiskinan."*

---

### Paradoks 4: Sanitasi Dasar vs PDRB (Infrastruktur Fisik 2.3x Lebih Kuat)
* **Temuan**: Korelasi sanitasi terhadap kemiskinan ($r = -0.56$) **2.3x lipat lebih kuat** dibanding korelasi PDRB nominal daerah ($r = -0.24$).
* **Fakta Anomali Ekstrem**:
  * **Kab. Deiyai (Papua)**: Sanitasi layak tercatat **0.00%** (P0 = 40.59%).
  * **Kab. Mamberamo Tengah (Papua)**: Air bersih layak tercatat **0.00%** (P0 = 36.76%).
* **Narasi Storytelling**:
  > *"Pemerintah kerap terobsesi mengejar pertumbuhan ekonomi agregat (PDRB). Data BPS membuktikan bahwa membangun jamban sehat dan sambungan air bersih memiliki daya ungkit 2.3x lebih nyata dalam mengangkat martabat dan kesehatan keluarga miskin dibanding mengejar angka pertumbuhan ekonomi semu."*

---

### Paradoks 5: "The Madura Disparity" (Kantong Kemiskinan Akut di Pulau Jawa)
* **Temuan**: Dari 128 kabupaten/kota di Pulau Jawa dan Bali, **hanya 3 kabupaten yang divonis Class 1 (Akut Prioritas)**: **Bangkalan, Sampang, dan Sumenep**.
* **Kesenjangan Jatim**:
  * **Kab. Sampang**: RLS hanya **4.86 tahun** (bahkan tidak tamat SD; terendah se-Pulau Jawa).
  * **Kota Surabaya**: Berjarak hanya 15 km melintasi Jembatan Suramadu, RLS mencapai **10.50 tahun** dan kemiskinan hanya **5.23%**.
* **Narasi Storytelling**:
  > *"Jembatan fisik Suramadu berhasil menghubungkan beton Surabaya dan Madura, namun gagal menjembatani jurang pendidikan dan sanitasi selama lebih dari satu dekade."*

---

### Paradoks 6: Klaster 3T Tersembunyi di Indonesia Barat (Kepulauan Nias & Mentawai)
* **Temuan**: Kemiskinan akut bukan murni batas dikotomi barat vs timur. Sebanyak **8 kabupaten di Indonesia Barat** terjerumus ke Class 1 Akut.
* **Fakta**: Seluruh Kepulauan Nias (Nias, Nias Selatan, Nias Utara, Nias Barat) dan Mentawai memiliki rata-rata sanitasi **38.9%** dan RLS **6.4 tahun**, identik dengan profil kepulauan di Maluku dan Papua.
* **Narasi**: Faktor keterisolasian laut (*archipelagic isolation*) adalah variabel penentu kerentanan yang melintasi garis bujur barat-timur.

---

### Paradoks 7: "The Educated Poor" (Sekolah Tinggi Tanpa Serapan Pasar Kerja)
* **Temuan**: Terdeteksi 6 kabupaten di Indonesia Timur dengan Rata-rata Lama Sekolah setara tamatan SMP hingga SMA ($8.2 - 9.2 \text{ tahun}$), namun angka kemiskinannya tetap kritis di kisaran **27% – 38%**.
* **Contoh Kasus**:
  * **Kab. Supiori (Papua)**: RLS **8.87 tahun**, namun kemiskinan **37.91%**!
  * **Kab. Waropen (Papua)**: RLS **9.21 tahun**, namun kemiskinan **29.85%**!
  * **Kab. Teluk Bintuni**: RLS **8.22 tahun**, namun kemiskinan **29.79%**!
* **Narasi Storytelling**:
  > *"Pendidikan adalah syarat perlu (*necessary condition*), namun bukan syarat cukup (*sufficient condition*). Di pulau-pulau terpencil, warga bersekolah hingga tamat SMP/SMA, namun karena ketiadaan industri dan pasar kerja formal bernilai tambah, ijazah mereka tidak tertransformasi menjadi daya beli."*

---

### Paradoks 8: Dekonstruksi Reverse-Engineering Label Kaggle
* **Temuan**: Label biner `Klasifikasi Kemiskinan` pada dataset terbukti merupakan hasil aturan deterministik sederhana (*rule-based heuristic*):
  $$\text{Class 1} \iff (P_0 > 20.0\%) \lor (\text{Pengeluaran} \le 6.25 \text{ juta} \land \text{Sanitasi} \le 56.0\%)$$
* **Akurasi Model**: Formula di atas menghasilkan akurasi rekonstruksi **98.8%** terhadap 514 baris data BPS.

---

### Paradoks 9: Ekonometrika Multivariat OLS & Elastisitas Relatif
Model Regresi Linier Berganda ($R^2 = 0.5180$, $F\text{-statistic } p < 0.0001$):

$$\hat{y}_{P0} = -0.317(\text{Pengeluaran}) - 0.209(\text{Sanitasi}) + 0.183(\text{TPAK}) - 0.197(\text{Log PDRB}) - 0.118(\text{Sekolah}) + 0.093(\text{TPT})$$

| Indikator Penjelas | Koefisien Beta Baku ($\beta$) | $t\text{-stat}$ | $p\text{-value}$ | Keterangan Signifikansi |
|---|---|---|---|---|
| **Pengeluaran Riil (Daya Beli)** | **-0.3167** | **-5.82** | **< 0.0001** | Efek proteksi kemiskinan paling dominan |
| **Akses Sanitasi Layak** | **-0.2090** | **-4.66** | **< 0.0001** | Variabel fisik terkuat menurunkan kemiskinan |
| **Log10 PDRB Riil** | -0.1970 | -4.30 | < 0.0001 | Signifikan elastisitas non-linear |
| **Tingkat Partisipasi Kerja (TPAK)** | **+0.1826** | **+4.44** | **< 0.0001** | Jebakan kerja subsistensi (Positif signifikan!) |
| **Lama Sekolah (RLS)** | -0.1182 | -2.36 | 0.0186 | Efek moderat jangka panjang |
| **Pengangguran Terbuka (TPT)** | +0.0928 | +2.04 | 0.0415 | Lemah; bukan pemicu utama kemiskinan |
| **Akses Air Minum Layak** | +0.0507 | +1.30 | 0.1949 | Tidak signifikan jika sanitasi sudah masuk |

---

## 3. Matriks Rekomendasi Kebijakan (Policy Action Matrix)

1. **Dekoupling Alokasi Dana dari Target TPT**:
   * Hentikan program pelatihan kewirausahaan instan berbasis target TPT di 416 kabupaten.
   * Ganti dengan program mekanisasi pertanian rakyat, pengolahan pascapanen, dan jaminan harga jual komoditas subsistensi (*safety-net pricing*).
2. **Moratorium Pajak Infrastruktur Sanitasi Berbasis PDRB Tambang**:
   * Mewajibkan daerah *Resource Curse* (Mimika, Morowali, Bojonegoro, Bintuni) mengunci minimal 15% dari Dana Bagi Hasil (DBH) migas/tambang secara khusus untuk **Universal Access Sanitasi & Air Bersih**.
3. **Koridor Integrasi Madura-Surabaya**:
   * Jangan hanya membangun konektivitas fisik. Bangun Balai Latihan Vokasi industri manufaktur langsung di Bangkalan dan Sampang dengan jaminan penyerapan di kawasan industri Gresik dan Surabaya.

---

## 4. Galeri Visual 300 DPI Pendukung Presentasi

Semua grafik telah digenerate di direktori `dashboard-Joshua/figures/`:
1. `1_working_poor_paradox.png`: Scatter Plot TPAK vs TPT dengan kode warna P0.
2. `2_madura_disparity.png`: Bar chart disparitas kemiskinan Madura vs Surabaya.
3. `3_sanitation_vs_pdrb.png`: Regresi ganda Sanitasi vs PDRB terhadap kemiskinan.
4. `4_correlation_heatmap.png`: Matriks korelasi 10 indikator sosioekonomi.
5. `5_resource_curse_enclave.png`: Scatter plot PDRB jumbo vs kemiskinan tinggi (Mimika/Morowali).
6. `6_kota_vs_kabupaten_dualism.png`: Boxplot ganda disparitas struktural 98 Kota vs 416 Kabupaten.
7. `7_policy_elasticity_ols.png`: Horizontal bar chart koefisien elastisitas $\beta$ baku regresi OLS.
8. `8_educated_poor_anomaly.png`: Anomali lama sekolah tinggi tanpa lapangan kerja di pulau terpencil.
