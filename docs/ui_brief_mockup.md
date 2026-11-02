# UI Design Brief & Wireframe Companion Sheet
## PovertyRadar SDGs Interactive Dashboard Mockup

> **Tujuan Dokumen:** Lembar panduan tata letak (*wireframe layout*), spesifikasi spasial kanvas, dan diagram purwarupa ASCII untuk desainer UI dan pengembang frontend.  
> **Dokumen Induk Fungsional & Style Guide:** 👉 [`docs/design.md`](design.md) *(Master Design Specification, Color Tokens, Typography, & Engineering Guardrails)*  
> **Standar Desain:** *Storytelling with Data* (Knaflic) · *Information Dashboard Design* (Few) · *Practical Dashboards* (Desbarats)  
> **Versi Dokumen:** 4.1 (Penyelarasan Wireframe Terintegrasi 9 Paradoks & Case-Study Pins) | November 2026  

---

### 1. Spesifikasi Kanvas Global & Sistem Grid 12 Kolom

```text
┌─────────────────┬────────────────────────────────────────────────────────────────────────┐
│  POVERTYRADAR   │  TOP BAR (Tinggi: 60–68 px)                                            │
│  SDGs           │  [Judul Halaman Aktif] | Chip: 514 Daerah · 34 Prov | [Reset Filters] │
│  (Sidebar       ├────────────────────────────────────────────────────────────────────────┤
│   Sticky        │  CONTENT AREA (Padding: 24–32 px, Grid 12 Kolom, Gutter: 16–24 px)     │
│   224–240 px)   │                                                                        │
│  [1] Landscape  │  [Row 1: KPI Cards Strip (3–4 Kolom Desktop, 2 Tablet, 1 Mobile)]      │
│  [2] Map/Expl.  ├────────────────────────────────────┬───────────────────────────────────┤
│  [3] Profiles   │                                    │                                   │
│  [4] Priority   │   [Visual Primer: 60–65% / 7–8 Col]│   [Visual Sekunder: 35–40% / 4–5] │
│  [5] Method     │                                    │                                   │
│                 ├────────────────────────────────────┴───────────────────────────────────┤
│  Footer:        │   💡 CALLOUT BOX: [1–2 Kalimat Insight Naratif Knaflic Tanpa Overclaim]│
│  BPS 2021 Data  ├────────────────────────────────────────────────────────────────────────┤
│  Status: Valid  │   [Tabel Interaktif / Drill-Down Panel / Tombol Ekspor Daftar Skrining]│
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

* **Resolusi Acuan Utama:** Desktop fluid `1440 × 900 px` (aspek rasio ~16:10). Wajib aman pada layar laptop `1366 × 768 px` tanpa pemotongan elemen (*no horizontal overflow*).
* **Sidebar Kiri (Sticky):** Lebar tetap `224–240 px` (laptop: `200–216 px`; mobile: drawer/hamburger $< 768\text{ px}$).
* **Grid Konten:** 12 kolom sejajar dengan *gutter* `16–24 px` dan *padding* kontainer `24–32 px`.

---

### 2. Rujukan Cepat Desain Visual (Design Tokens Quick Reference)

> [!NOTE]
> Panduan lengkap mengenai kontras rasio, hierarki tipografi, aturan *no bare numbers*, dan prinsip *neutral-plus-single-accent* didokumentasikan secara terpusat pada [`docs/design.md#5-sistem-visual-warna--aksesibilitas`](design.md#5-sistem-visual-warna--aksesibilitas).

| Kategori Token | Nama Token | Nilai Hex | Penggunaan Antarmuka | Standar Aksesibilitas |
| :--- | :--- | :---: | :--- | :--- |
| **Permukaan** | Canvas Background | `#F8FAFC` | Latar belakang seluruh halaman (slate sangat terang). | Latar netral rendah silau |
| **Permukaan** | Card Surface | `#FFFFFF` | Kontainer kartu chart (`border: 1px solid #E2E8F0`, radius `8–12px`). | Permukaan kontras |
| **Tipografi** | Text Ink Primary | `#1E293B` | Judul, angka KPI, dan label aktif. | Rasio kontras $> 11:1$ (WCAG AAA) |
| **Tipografi** | Text Muted / Secondary | `#475569` | Label metrik sekunder, teks sumbu, dan garis referensi halus. | Rasio kontras $> 5.0:1$ (WCAG AA) |
| **Aksen Kritis** | SDG 1 Red | `#E5243B` | Aksen tunggal penekanan kemiskinan ekstrem / badge resmi. | Aksen tunggal pre-atentif |
| **Klaster 1** | Perkotaan Modern | `#0072B2` | Okabe-Ito Dark Blue (78 daerah / 15.2%). | Ramah buta warna |
| **Klaster 2** | Penyangga Mapan | `#E69F00` | Okabe-Ito Warm Amber (187 daerah / 36.4%). | Ramah buta warna |
| **Klaster 3** | Agraris Rentan | `#009E73` | Okabe-Ito Teal Green (216 daerah / 42.0%). | Ramah buta warna |
| **Klaster 4** | 3T Deprivasi Akut | `#D55E00` | Okabe-Ito Vermillion (33 daerah / 6.4%). | Khusus elemen non-teks / KPI $\ge 24\text{px}$ |

> [!IMPORTANT]
> **Pemisahan Semantik Palet Klaster vs Kuadran 2x2:**  
> Warna Okabe-Ito di atas dialokasikan **khusus untuk 4 Klaster Sosio-Ekonomi**. Pada Matriks Kuadran 2x2 (Halaman 4), batas 4 kuadran menggunakan **arsir zona latar belakang lembut (*subtle background zone tinting*)**, sementara titik sebaran tetap membawa warna Klaster aslinya agar pengguna tidak mengalami disorientasi kognitif visual.

---

### 3. Wireframe & Spesifikasi Komponen 5 Halaman

#### Halaman 01: Poverty Landscape (The Hook — Skala Makro & Disparitas 17.50x)
* **Pertanyaan Analitis:** *Seberapa parah jurang disparitas kemiskinan antardaerah di Indonesia, dan di mana konsentrasi terbesarnya?*
* **Alokasi Grid & Wireframe:**

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ACTION HERO: Lanskap Kemiskinan Daerah BPS 2021: Di Balik Median Nasional 10.46%,      │
│              Tersembunyi Jurang Ketimpangan Ekstrem 17.50x Lipat Antardaerah           │
├───────────────────────────────────┬────────────────────────────────┬───────────────────┤
│ [KPI 1: BENCHMARK NASIONAL]       │ [KPI 2: RASIO EKSTREM (17.5x)] │ [KPI 3: TIMUR]    │
│ Median P0: 10.46%                 │ 17.50x Lipat Disparitas        │ 86.9% di Timur    │
│ Rentang: 2.38% s.d. 41.66%        │ Sawahlunto vs Intan Jaya       │ 53 dari 61 kantong│
│ 514 Kabupaten/Kota · 34 Provinsi  │ Aksen Kritis: #D55E00          │ Barat: 13.1% (8)  │
├───────────────────────────────────┴────────────────────────────────┴───────────────────┤
│ HISTOGRAM DISTRIBUSI P0 (5 Kolom) │ JITTERED STRIP PLOT 6 KEPULAUAN (7 Kolom)          │
│ • Sumbu X: Persentase P0 (%)      │ • Sumbu Y: 6 Kawasan Kepulauan Besar               │
│ • Garis Putus: Median 10.46%      │ • 514 Titik Sebaran Daerah + Garis Median Tebal    │
│ • Right-skewed distribution       │ • Anotasi Panah: Anomali Barat (Nias & Mentawai)   │
├───────────────────────────────────┴────────────────────────────────────────────────────┤
│ 💡 INSIGHT KUNCI: Angka median nasional 10.46% menutupi jurang disparitas ekstrem      │
│    17.50x lipat (Sawahlunto 2.38% vs Intan Jaya 41.66%). Sebanyak 86.9% kantong akut   │
│    (53 dari 61) menumpuk di Kawasan Timur, sementara kawasan barat menyumbang 13.1%.   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LEADERBOARD KEMISKINAN (12 Kolom): Top-10 Kabupaten Tertinggi vs Top-10 Terendah       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

#### Halaman 02: Poverty & Indicator Map (The Geography — The Great Dualism & The Working Poor)
* **Pertanyaan Analitis:** *Bagaimana wajah ketimpangan geografis kabupaten vs kota, dan mengapa angka pengangguran tidak berkorelasi lurus dengan kemiskinan?*
* **Alokasi Grid & Wireframe:**

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOOLBAR FILTER: [Layer: P0 % / Sanitasi / Air / Pengeluaran / TPT / TPAK] | [Provinsi] │
├───────────────────────────────────────────────────┬────────────────────────────────────┤
│ ACTION TITLE: Konsentrasi Spasial: Polarisasi     │ PANEL DETAIL INDIKATOR (4 Kolom)   │
│ Poros Barat vs Wilayah Kepulauan & Pegunungan     │ • Identitas Kabupaten/Kota Aktif   │
│ PETA CHOROPLETH SPASIAL 34 PROVINSI (8 Kolom)     │ • Nilai Indikator Terpilih         │
│ • Poligon 514 daerah berbasis GeoJSON teroptimasi │ • Deviasi terhadap Median Nasional │
│ • Tooltip Informatif (Nama, Nilai, Satuan, Posisi)│ • Klaster & Kuadran Skrining 2x2   │
│ • DEFENSIVE FALLBACK: Ranking Bar Chart Spasial   │ • Status Anomali Multivariat       │
├───────────────────────────────────────────────────┴────────────────────────────────────┤
│ ACTION TITLE: The Great Dualism: Kabupaten ~1.9x  │ ACTION TITLE: The Working Poor     │
│ Lebih Miskin, Namun Kota ~1.8x Lebih Menganggur   │ Tekanan Kerja Subsistensi di 3T    │
│ GROUPED BAR CHART KOMPARATIF (6 Kolom)            │ SCATTERPLOT REGRESI TPAK vs P0 (6) │
│ • Kemiskinan: Kab 13.51% vs Kota 7.22% (1.87x)    │ • Korelasi positif r = +0.462      │
│ • Pengangguran: Kota 7.92% vs Kab 4.36% (1.82x)   │ • Anotasi: Nduga vs Kota Depok     │
├───────────────────────────────────────────────────┴────────────────────────────────────┤
│ 💡 INSIGHT KUNCI: Kabupaten mencatatkan kemiskinan rata-rata 13.51% (~1.9x kota),      │
│    namun kota mencatat pengangguran 7.92% (~1.8x kabupaten). Di daerah 3T miskin,      │
│    warga wajib bekerja subsistensi harian demi bertahan hidup sehingga TPT mendekati    │
│    0.00%, sedangkan pengangguran kota didominasi angkatan kerja terdidik (search unemp)│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

#### Halaman 03: Regional Profiles (The Archetypes — Faktor Materiil Layanan Dasar)
* **Pertanyaan Analitis:** *Apa karakteristik setiap kelompok daerah dan apa yang membedakannya?*
* **Alokasi Grid & Wireframe:**

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER DIAGNOSTIK & REFLEKSI: [k=4] · [Silhouette: 0.2028 (Kontinum Gradasi Alami)]   │
│ [Davies-Bouldin: 1.4522] · [Stabilitas Multi-Seed ARI: 0.9803 (Partisi Stabil)]        │
├───────────────────────────────────────────────────┬────────────────────────────────────┤
│ ACTION TITLE: Profil 4 Arketipe: Defisit Layanan  │ 4 KARTU PERSONA KLASTER (4 Kolom)  │
│ Dasar Beriringan Erat dengan Disparitas Klaster   │ • Klaster 1: Perkotaan (78 / 15.2%)│
│ VISUAL PROFIL (8 Kolom): [Small Multiples / Heat] │ • Klaster 2: Penyangga (187/ 36.4%)│
│ • 7 Fitur Standar Z-Score (Zero Baseline)         │ • Klaster 3: Agraris (216 / 42.0%) │
│ • RLS, UHH, Sanitasi, Air, Pengeluaran, TPT, PDRB │ • Klaster 4: 3T Akut (33 / 6.4%)   │
│ • STRICTLY FORBIDDEN: Radar / Spider Chart        │ • Komposisi persentase kab vs kota │
├───────────────────────────────────────────────────┴────────────────────────────────────┤
│ 💡 INSIGHT KUNCI: Pada telaah bivariat, defisit sanitasi layak (r = -0.56) dan air     │
│    bersih (r = -0.42) beriringan kuat dengan tingginya kemiskinan mendampingi PDRB     │
│    nominal (r = -0.24) yang sangat menceng. Namun pada telaah multivariat OLS,         │
│    sanitasi (β = -0.209) dan log PDRB (β = -0.197) berkontribusi komplementer.         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ VALIDASI INFERENSIAL EKSTERNAL (12 Kolom): Jittered Strip Plot P0 Antarklaster         │
│ Uji Beda Rata-Rata: ANOVA F = 155.94 (p < 0.001) | Kruskal-Wallis H = 167.52           │
│ *Catatan: Signifikansi sejalan dengan korelasi bawaan fitur masukan terhadap P0.       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

#### Halaman 04: Priority & Implications (The Call to Action — Matriks 2x2 & Case-Study Pins)
* **Pertanyaan Analitis:** *Wilayah mana yang layak dianalisis lebih lanjut berdasarkan kondisi yang teramati?*
* **Alokasi Grid & Wireframe:**

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOOLBAR STUDI KASUS: [Semua Daerah (514)] | [Pin: Kutukan Sumber Daya (17 Daerah)]     │
│                      [Pin: Disparitas Madura (4 Kab Madura vs Ring-1 Jatim)]           │
├───────────────────────────────────────────────────┬────────────────────────────────────┤
│ ACTION TITLE: Matriks Skrining Kerentanan 2x2:    │ PANEL ARAH KEBIJAKAN (5 Kolom)     │
│ Penapisan 514 Daerah Menuju Portofolio Intervensi │ • Identitas Kuadran / Daerah Aktif │
│ SCATTERPLOT KUADRAN 2x2 (7 Kolom, Rasio 1:1)      │ • Status Penapisan & Tingkat Risiko│
│ Sumbu Y: Indeks Kerentanan Struktural V_struc     │ • Menu Rekomendasi APBN & TKD      │
│          (Garis Potong Median = 0.2720)           │ • OPD Pengampu & K/L Terkait       │
│ Sumbu X: Kemiskinan Moneter P0 (%)                │ • Rujukan policy_matrix.csv        │
│          (Garis Potong Median = 10.46%)           │ • Tombol: [Ekspor Daftar Skrining] │
│                                                   │                                    │
│ [Kuadran II: 95 Daerah] │ [Kuadran I: 162 Daerah] │ CATATAN INTERAKSI PIN:             │
│ (Kerentanan Tersembunyi)│ (Prioritas Beban Ganda) │ Titik target membesar + kontras,   │
│ ────────────────────────┼──────────────────────── │ titik non-target meredup (op. 0.15)│
│ [Kuadran IV: 162 Daerah]│ [Kuadran III: 95 Daerah]│                                    │
│ (Wilayah Mapan)         │ (Kantong Daya Beli)     │                                    │
├───────────────────────────────────────────────────┴────────────────────────────────────┤
│ 💡 INSIGHT KUNCI: Kuadran I (162 daerah) memerlukan intervensi ganda (infrastruktur    │
│    dasar + bansos). Kuadran II (95 daerah) rawan luput karena P0 tampak rendah meski   │
│    fasilitas dasar kritis. Pin Kutukan Sumber Daya menyingkap daerah kaya migas/tambang│
│    (Mimika, Bojonegoro) yang terdistorsi enclave economy tanpa serapan lokal memadai.  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TABEL DAFTAR SKRINING TERFILTER (12 Kolom) + Tombol [Ekspor Daftar Skrining CSV]       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

#### Halaman 05: Methodology & Data Quality (The Integrity — Nilai Batas & Koefisien OLS Baku)
* **Pertanyaan Analitis:** *Bagaimana temuan diperoleh dan apa yang tidak dapat disimpulkan?*
* **Alokasi Grid & Wireframe:**

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ BANNER INTEGRITAS: Murni Unsupervised Clustering · Zero Target Leakage · Non-Ground BPS│
│ TAB NAVIGASI: [Tab 1: Nilai Batas 0% 3T] [Tab 2: Dekonstruksi Kaggle] [Tab 3: OLS (β)] │
├───────────────────────────────────────────────────┬────────────────────────────────────┤
│ TAB 1: TRANSPARANSI NILAI BATAS LAPANGAN (6 Kolom)│ INSPEKSI OUTLIER TEKNIS (6 Kolom)  │
│ • Verifikasi Nilai 0.00% 3T (Deiyai, Mamberamo,   │ • Boxplot Tukey 1.5x IQR           │
│   Nduga) sebagai potret faktual lapangan          │ • Sebaran 36 pencilan kemiskinan   │
│ • Verifikasi silang data BPS Susenas/Sakernas 2021│ • Efektivitas Log1p PDRB (+0.23)   │
├───────────────────────────────────────────────────┴────────────────────────────────────┤
│ TAB 2: DEKONSTRUKSI REVERSE-ENGINEERING LABEL KAGGLE (12 Kolom)                        │
│ • Formula Heuristik: Class 1 <-> (P0 > 20%) v (Pengeluaran <= 6.25 Juta ^ Sanitasi <= 56)│
│ • Akurasi Rekonstruksi Formula: 98.8% (508 dari 514 daerah identik secara matematis)   │
│ • Dasar empiris penolakan supervised learning demi mencegah circular reasoning         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TAB 3: KOEFISIEN REGRESI TERSTANDARISASI BAKU OLS (12 Kolom)                           │
│ • Horizontal Bar: Pengeluaran (-0.317), Sanitasi (-0.209), Log-PDRB (-0.197),          │
│   TPAK (+0.183), RLS (-0.118), TPT (+0.093)                                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 💡 INSIGHT KUNCI: Nilai ekstrem 0.00% di wilayah 3T diverifikasi sebagai fakta empiris │
│    geografis, bukan galat input data. Label biner Kaggle dibongkar sebagai aturan       │
│    heuristik deterministik sederhana (98.8% cocok), membenarkan secara ilmiah          │
│    penolakan model klasifikasi terawasi demi mencegah target leakage.                  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ KAMUS DATA & AKSES DATASET (12 Kolom): Tabel Kamus Data Interaktif + Unduh CSV Interim │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 4. Checklist Kepatuhan Antarmuka bagi Pengembang Frontend

1. **Aturan Sudut Kiri Atas (*Top-Left Anchor*):** Tempatkan metrik paling krusial dan kesimpulan utama di sudut kiri atas setiap layar (*Hero Headline & KPI Strip*).
2. **Prinsip 3 Detik – 30 Detik – 3 Menit:**
   - 3 detik: Menangkap pesan utama melalui Action Headline & KPI Big Number.
   - 30 detik: Memahami perbandingan melalui chart beranotasi garis referensi median dan label rasio.
   - 3 menit: Mengeksplorasi tabel rincian daerah, filter multi-level, dan toolbar *Case-Study Pins*.
3. **Pemisahan Semantik Warna Klaster vs Kuadran:**
   - Palet Okabe-Ito (`#0072B2`, `#E69F00`, `#009E73`, `#D55E00`) digunakan khusus untuk **4 Klaster Sosio-Ekonomi**.
   - Kuadran 2x2 menggunakan **arsir zona latar belakang lembut (*subtle zone tinting*)**, bukan mengubah warna titik data menjadi identik dengan nama klaster.
4. **Kepatuhan Aksesibilitas Kontras (WCAG 2.1 Level AA):**
   - Teks sekunder/muted wajib menggunakan Slate 600 (`#475569`, kontras $> 5.0:1$).
   - Warna Vermillion (`#D55E00`) hanya dialokasikan untuk elemen non-teks atau angka KPI berukuran besar ($\ge 24\text{px}$ bold). Teks peringatan kecil menggunakan warna kontras tinggi (`#991B1B` atau `#9E3A00`).
5. **Defensive States Mandatori:**
   - Sediakan *Skeleton Loading* saat memuat visualisasi.
   - Sediakan *Empty Result State* yang ramah dengan tombol `Reset filters` jika filter menghasilkan 0 baris.
   - Sediakan *GeoJSON Fallback Mode* otomatis ke *Ranking Bar Chart Spasial 34 Provinsi* jika poligon GeoJSON belum siap atau gagal dimuat.
6. **Dilarang Menampilkan Angka Telanjang (*No Bare Numbers*):**
   - Setiap kartu KPI wajib memuat label metrik, angka terformat dinamis (runtime), benchmark pembanding nasional, dan konteks sebaran wilayah.
7. **Label Tombol Ekspor Data:**
   - Tombol unduhan data pada Halaman 4 wajib berlabel **`Ekspor daftar skrining`** (bukan `Daftar penerima bansos`).
