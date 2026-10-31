# UI Design Brief & Wireframe Companion Sheet
## PovertyRadar SDGs Interactive Dashboard Mockup

> **Tujuan Dokumen:** Lembar panduan tata letak (*wireframe layout*), spesifikasi spasial kanvas, dan diagram purwarupa ASCII untuk desainer UI dan pengembang frontend (Figma, Canva, Streamlit, Tailwind CSS).  
> **Dokumen Induk Fungsional & Style Guide:** 👉 [`docs/design.md`](file:///d:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/docs/design.md) *(Master Design Specification, Color Tokens, Typography, & Engineering Guardrails)*  
> **Standar Desain:** *Storytelling with Data* (Knaflic) · *Information Dashboard Design* (Few) · *Practical Dashboards* (Desbarats)  
> **Versi Dokumen:** 4.0 (Dedicated Wireframe Companion) | 31 Oktober 2026  

---

### 1. Spesifikasi Kanvas Global & Sistem Grid 12 Kolom

```text
┌─────────────────┬────────────────────────────────────────────────────────────────────────┐
│  POVERTYRADAR   │  TOP BAR (Tinggi: 60–68 px)                                            │
│  SDGs           │  [Judul Halaman Aktif] | Chip: 514 Daerah · 34 Prov | [Reset Filters] │
│  (Sidebar       ├────────────────────────────────────────────────────────────────────────┤
│   Sticky        │  CONTENT AREA (Padding: 24–32 px, Grid 12 Kolom, Gutter: 16–24 px)     │
│   224–240 px)   │                                                                        │
│  [1] Landscape  │  [Row 1: KPI Cards Strip (4 Kolom Desktop, 2 Tablet, 1 Mobile)]        │
│  [2] Map/Expl.  ├────────────────────────────────────┬───────────────────────────────────┤
│  [3] Profiles   │                                    │                                   │
│  [4] Priority   │   [Visual Primer: 60–65% / 7–8 Col]│   [Visual Sekunder: 35–40% / 4–5] │
│  [5] Method     │                                    │                                   │
│                 ├────────────────────────────────────┴───────────────────────────────────┤
│  Footer:        │   💡 CALLOUT BOX: [1–2 Kalimat Insight Naratif Knaflic Tanpa Overclaim]│
│  BPS 2021 Data  ├────────────────────────────────────────────────────────────────────────┤
│  Status: Valid  │   [Tabel Interaktif / Drill-Down Panel / Tombol Ekspor CSV]           │
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

* **Resolusi Acuan Utama:** Desktop fluid `1440 × 900 px` (aspek rasio ~16:10). Wajib aman pada layar laptop `1366 × 768 px` tanpa pemotongan elemen (*no horizontal overflow*).
* **Sidebar Kiri (Sticky):** Lebar tetap `224–240 px` (laptop: `200–216 px`; mobile: drawer/hamburger $< 768\text{ px}$).
* **Grid Konten:** 12 kolom sejajar dengan *gutter* `16–24 px` dan *padding* kontainer `24–32 px`.

---

### 2. Rujukan Cepat Desain Visual (Design Tokens Quick Reference)

> [!NOTE]
> Panduan lengkap mengenai kontras rasio, hirarki tipografi, aturan *no bare numbers*, dan prinsip *neutral-plus-single-accent* didokumentasikan secara terpusat pada [`docs/design.md#5-sistem-visual-warna--aksesibilitas`](file:///d:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/docs/design.md#5-sistem-visual-warna--aksesibilitas).

| Kategori Token | Nama Token | Nilai Hex | Penggunaan Antarmuka |
| :--- | :--- | :---: | :--- |
| **Permukaan** | Canvas Background | `#F8FAFC` | Latar belakang seluruh halaman (slate sangat terang). |
| **Permukaan** | Card Surface | `#FFFFFF` | Kontainer kartu chart (`border: 1px solid #E2E8F0`, radius `8–12px`). |
| **Tipografi** | Text Ink Primary | `#1E293B` | Judul, angka KPI, dan label aktif (rasio kontras $> 7:1$). |
| **Tipografi** | Text Muted | `#64748B` | Label metrik sekunder, teks sumbu, dan garis referensi halus. |
| **Aksen Kritis** | SDG 1 Red | `#E5243B` | Aksen tunggal penekanan wilayah miskin ekstrem / Kuadran I. |
| **Klaster 1** | Perkotaan Modern | `#0072B2` | Okabe-Ito Dark Blue. |
| **Klaster 2** | Penyangga Mapan | `#E69F00` | Okabe-Ito Warm Amber. |
| **Klaster 3** | Agraris Rentan | `#009E73` | Okabe-Ito Teal Green. |
| **Klaster 4** | 3T Deprivasi Akut | `#D55E00` | Okabe-Ito Vermillion. |

---

### 3. Wireframe & Spesifikasi Komponen 5 Halaman

#### Halaman 01: Poverty Landscape (Lanskap Makro Kemiskinan)
* **Pertanyaan Analitis:** *Apa gambaran kemiskinan pada wilayah yang tercakup dan pola penting apa yang terlihat?*
* **Alokasi Grid & Wireframe:**

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [KPI 1: 514 Daerah]   [KPI 2: Median 10.46%]   [KPI 3: Min 2.38%]   [KPI 4: Max 41.66%]│
├────────────────────────────────────┬───────────────────────────────────────────────────┤
│ HISTOGRAM SEBARAN P0 (5 Kolom)     │ JITTERED STRIP PLOT 6 KEPULAUAN (7 Kolom)         │
│ • Sumbu X: Persentase P0 (%)       │ • Sumbu Y: 6 Kawasan Kepulauan Besar              │
│ • Garis Putus: Median 10.46%       │ • 514 Titik Sebaran Daerah + Garis Median Tebal   │
│ • Right-skewed distribution        │ • Menonjolkan jurang ketimpangan Maluku & Papua   │
├────────────────────────────────────┴───────────────────────────────────────────────────┤
│ 💡 INSIGHT: Disparitas mencapai 17.5x lipat antara Kota Sawahlunto (2.38%) dan         │
│    Kabupaten Intan Jaya (41.66%). Mayoritas wilayah terkonsentrasi di rentang 7–15%.   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TABEL LEADERBOARD (12 Kolom): Top-10 Kabupaten Termiskin vs Top-10 Daerah Tersejahtera │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

#### Halaman 02: Poverty & Indicator Map (Peta Spasial & Indikator Pilihan)
* **Pertanyaan Analitis:** *Di mana pola geografis atau perbedaan indikator paling terlihat?*
* **Alokasi Grid & Wireframe:**

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOOLBAR: [Pilih Indikator: P0 / Sanitasi / Air / RLS / TPT / TPAK] | [Filter Provinsi]  │
├───────────────────────────────────────────────────┬────────────────────────────────────┤
│ PETA CHOROPLETH SPASIAL 34 PROVINSI (8 Kolom)     │ PANEL DETAIL WILAYAH (4 Kolom)     │
│ • Visualisasi poligon 514 kabupaten/kota          │ • Nama Kabupaten/Kota Terpilih     │
│ • Skala warna sekuensial terstandarisasi          │ • Nilai Indikator Aktif + Satuan   │
│ • Hover Tooltip: Nama daerah, nilai, benchmark    │ • Peringkat Nasional & Deviasi     │
│ • FALLBACK: Horizontal Bar Chart Ranking          │ • Persona Klaster & Kuadran Skrining│
├───────────────────────────────────────────────────┴────────────────────────────────────┤
│ 💡 INSIGHT: Kabupaten mencatatkan kemiskinan rata-rata 13.51% (hampir 2x lipat kota).  │
│    Di pedesaan, TPAK tinggi (+0.462) menandakan keterpaksaan kerja subsisten bertahan. │
├───────────────────────────────────┬────────────────────────────────────────────────────┤
│ DISPARITAS KAB VS KOTA (6 Kolom)  │ PARADOKS KETENAGAKERJAAN (6 Kolom)                 │
│ Horizontal Bar: Kab 13.5% vs Kota │ Scatterplot: TPAK vs P0 (Regresi Positif r=+0.462) │
└───────────────────────────────────┴────────────────────────────────────────────────────┘
```

---

#### Halaman 03: Regional Profiles (Profil Klaster Sosial-Ekonomi)
* **Pertanyaan Analitis:** *Apa karakteristik setiap kelompok daerah dan apa yang membedakannya?*
* **Alokasi Grid & Wireframe:**

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER DIAGNOSTIK: [k=4] · [Silhouette: 0.2028] · [DBI: 1.4522] · [Stabilitas ARI: 0.9803]│
├───────────────────────────────────────────────────┬────────────────────────────────────┤
│ PROFIL PEMBEDA KLASTER (8 Kolom)                  │ 4 KARTU PERSONA KLASTER (4 Kolom)  │
│ [Tab 1: Small Multiples Bar] [Tab 2: Heatmap 28]  │ • Klaster 1: Perkotaan Modern (78) │
│ • Sumbu Z-score deviasi terhadap median nasional  │ • Klaster 2: Penyangga Mapan (187) │
│ • Bar horizontal: RLS, UHH, Sanitasi, Air,        │ • Klaster 3: Agraris Rentan (216)  │
│   Pengeluaran, TPT, Log-PDRB                      │ • Klaster 4: 3T Deprivasi Akut (33)│
│ • STRICTLY FORBIDDEN: Radar / Spider Chart        │ • Komposisi persentase kab vs kota │
├───────────────────────────────────────────────────┴────────────────────────────────────┤
│ 💡 INSIGHT: Akses sanitasi layak (rentang Z=3.11) dan RLS (Z=3.07) adalah pembeda       │
│    paling tajam antarkelompok. Klaster 4 mengalami kolaps infrastruktur sanitasi/air.  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ VALIDASI INFERENSIAL EKSTERNAL (12 Kolom): Jittered Strip Plot P0 Antarklaster         │
│ Uji Signifikansi Pemisahan Kemiskinan: ANOVA F = 155.94 (p < 0.001) | KW H = 167.52    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

#### Halaman 04: Priority & Implications (Prioritas Intervensi & Matriks Kuadran)
* **Pertanyaan Analitis:** *Wilayah mana yang layak dianalisis lebih lanjut berdasarkan kondisi yang teramati?*
* **Alokasi Grid & Wireframe:**

```text
┌───────────────────────────────────────────────────┬────────────────────────────────────┐
│ MATRIKS SKRINING KUADRAN 2x2 (7 Kolom, Rasio 1:1) │ PANEL ARAH KEBIJAKAN (5 Kolom)     │
│ Sumbu Y: Indeks Kerentanan Struktural V_struc     │ • Menampilkan profil kuadran aktif │
│          (Garis Potong Median = 0.2720)           │ • Kuadran I: Prioritas Beban Ganda │
│ Sumbu X: Kemiskinan Moneter P0 (%)                │ • Kuadran II: Kerentanan Tersembunyi│
│          (Garis Potong Median = 10.46%)           │ • Kuadran III: Kantong Daya Beli   │
│                                                   │ • Kuadran IV: Terbina / Mapan      │
│ [K-II: 95 Kab/Kota]    │ [K-I: 162 Kab/Kota]      │ • Rekomendasi Menu APBN & TKD      │
│ ───────────────────────┼───────────────────────── │ • Instansi Pelaksana (OPD & K/L)   │
│ [K-IV: 162 Kab/Kota]   │ [K-III: 95 Kab/Kota]     │ • Rujukan policy_matrix.csv        │
├───────────────────────────────────────────────────┴────────────────────────────────────┤
│ 💡 INSIGHT: Kuadran II memuat 95 daerah berfasilitas kritis meski P0 tampak rendah.    │
│    Di Kuadran III (95 daerah), fasilitas dasar baik namun daya beli tertekan.          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TABEL DAFTAR SKRINING TERFILTER (12 Kolom) + Tombol [Ekspor Daftar Skrining CSV]       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

#### Halaman 05: Methodology & Data Quality (Metodologi & Mutu Data)
* **Pertanyaan Analitis:** *Bagaimana temuan diperoleh dan apa yang tidak dapat disimpulkan?*
* **Alokasi Grid & Wireframe:**

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ BANNER INTEGRITAS: Murni Unsupervised Clustering · Zero Target Leakage · Non-Ground BPS│
├───────────────────────────────────────────────────┬────────────────────────────────────┤
│ AUDIT MUTU DATA & NILAI BATAS (6 Kolom)           │ INSPEKSI OUTLIER TEKNIS (6 Kolom)  │
│ • Verifikasi BPS 2021 (Surakarta, Cilacap)        │ • Boxplot Tukey 1.5x IQR           │
│ • Penjelasan Nilai 0.00% 3T (Deiyai, Mamberamo)   │ • Sebaran 36 pencilan kemiskinan   │
│ • Koreksi Satuan PDRB menjadi Juta Rupiah         │ • Bukti efektivitas Log1p PDRB     │
├───────────────────────────────────────────────────┴────────────────────────────────────┤
│ KAMUS DATA & AKSES DATASET (12 Kolom): Tabel Kamus Data Interaktif + Unduh CSV Interim │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 4. Checklist Kepatuhan Antarmuka bagi Pengembang Frontend

1. **Aturan Sudut Kiri Atas (*Top-Left Anchor*):** Tempatkan metrik paling krusial dan kesimpulan utama di sudut kiri atas setiap layar.
2. **Prinsip 3 Detik – 30 Detik – 3 Menit:**
   - 3 detik: Menangkap pesan utama melalui Headline & KPI Big Number.
   - 30 detik: Memahami perbandingan melalui chart beranotasi garis referensi median.
   - 3 menit: Mengeksplorasi tabel rincian daerah dan filter multi-level.
3. **Defensive States Mandatori:** Sediakan *Skeleton Loading*, *Empty Result State* (+ tombol Reset), dan *GeoJSON Fallback Mode* pada seluruh komponen visual.
4. **Dilarang Menampilkan Angka Telanjang (*No Bare Numbers*):** Setiap kartu KPI wajib memuat label metrik, angka terformat, benchmark pembanding, dan rentang ekstrem.
