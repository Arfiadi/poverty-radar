# UI Design Brief & Wireframe Specification
## PovertyRadar SDGs Interactive Dashboard Mockup

**Target Audiens Dokumen:** Desainer UI / Rekan Tim Pembuat Mockup (Figma, Canva, Penpot, Adobe XD, Tailwind CSS)  
**Dokumen Induk Fungsional:** [`docs/design.md`](file:///d:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/docs/design.md) *(Master Design Specification & Engineering Guardrails)*  
**Standar Desain:** *Storytelling with Data* (Knaflic) · *Information Dashboard Design* (Few) · *Practical Dashboards* (Desbarats)  
**Versi:** 3.0 (Streamlined Visual Wireframe Sheet) | 31 Oktober 2026  

---

### 1. Ringkasan Desain & Tujuan Produk
* **Nama Produk:** **PovertyRadar SDGs: Sistem Pemetaan Klaster dan Skrining Kerentanan Kemiskinan Daerah Indonesia**
* **Fokus Isu:** UN SDG 1 — *No Poverty* (Tanpa Kemiskinan).
* **Fungsi Utama:** Communication & Analytical Exploration Dashboard untuk menyajikan disparitas sosio-ekonomi 514 kabupaten/kota tanpa bias *one-size-fits-all*.
* **Penegasan Model:** **Murni Unsupervised Clustering & Skrining Kuadran 2x2 (TIDAK ADA Supervised Classification)**.

---

### 2. Spesifikasi Kanvas & Sistem Grid

```text
┌─────────────────┬──────────────────────────────────────────────────────────────────────┐
│  POVERTYRADAR   │  TOP BAR (Tinggi: 60–68 px)                                          │
│  SDGs           │  [Judul Halaman] | Chip: 514 Observasi · 34 Provinsi | Reset Filters │
│  (Sidebar       ├──────────────────────────────────────────────────────────────────────┤
│   Sticky        │  CONTENT AREA (Padding: 24–32 px, Grid 12 Kolom, Gutter: 16–24 px)   │
│   224–240 px)   │                                                                      │
│  [1] Landscape  │  [Row 1: KPI Cards Strip (4 Kolom pada Desktop, 2 pada Tablet)]     │
│  [2] Map/Expl.  ├───────────────────────────────────┬──────────────────────────────────┤
│  [3] Profiles   │                                   │                                  │
│  [4] Priority   │   [Visual Primer: 60–65% Lebar]   │   [Visual Sekunder: 35–40%]      │
│  [5] Method     │                                   │                                  │
│                 ├───────────────────────────────────┴──────────────────────────────────┤
│  Footer:        │   💡 CALLOUT BOX: [1–2 Kalimat Insight Ringkas Tanpa Overclaim]      │
│  BPS 2021 Data  ├──────────────────────────────────────────────────────────────────────┤
│  Status: Verified│   [Tabel Interaktif / Drill-Down Panel / Data Exporter]              │
└─────────────────┴──────────────────────────────────────────────────────────────────────┘
```

* **Target Resolusi Acuan:** Desktop fluid `1440 × 900 px` (aspek rasio ~16:10). Wajib aman pada layar laptop `1366 × 768 px` tanpa terpotong.
* **Sidebar Kiri (Sticky):** Lebar tetap `224–240 px` (menciut ke `200–216 px` pada resolusi $1024–1279\text{ px}$, dan menjadi menu drawer/hamburger pada $< 768\text{ px}$).
* **Grid Konten:** 12 kolom sejajar dengan *gutter* `16–24 px`.

---

### 3. Design System & Style Guide

#### A. Token Warna Terstandarisasi
* **Canvas Background:** `#F8FAFC` (Slate sangat terang, bersih dan tidak silau).
* **Card Surface:** `#FFFFFF` (Putih bersih dengan `border: 1px solid #E2E8F0` dan `border-radius: 8–12px`). **Dilarang menggunakan drop-shadow tebal**.
* **Teks Utama (*Ink*):** `#1E293B` (Slate gelap, rasio kontras $> 7:1$).
* **Teks Sekunder (*Muted*):** `#64748B` (Abu-abu netral).
* **Aksen Tunggal Kritis (SDG 1 Red):** `#E5243B` (HANYA untuk penekanan wilayah miskin ekstrem atau Kuadran I Prioritas Utama).
* **Palet Klaster Ramah Buta Warna (Okabe-Ito Colorblind-Safe):**
  * Klaster 1 (Perkotaan Modern): `#0072B2` (Dark Blue)
  * Klaster 2 (Kabupaten Penyangga): `#E69F00` (Warm Amber)
  * Klaster 3 (Perdesaan Agraris): `#009E73` (Teal Green)
  * Klaster 4 (Wilayah 3T Deprivasi): `#D55E00` (Vermillion)

#### B. Tipografi (Sans-Serif Modern)
* **Font Family:** `Inter`, `Plus Jakarta Sans`, atau font sans-serif sistem.
* **Hierarki Ukuran:**
  * Judul Halaman: `24–28 px` | Bold
  * Subheading / Insight: `16–18 px` | Semi-bold
  * KPI Big Number: `32–36 px` | Bold
  * Body / Axis Label: `12–14 px` | Regular
  * Microcopy / Annotation: `11–12 px` | Medium

#### C. Format Baku Kartu KPI (Zero Bare Numbers)
Setiap kartu metrik wajib memuat 4 lapisan konteks:
1. Label Metrik (`13 px`, Muted Gray `#64748B`).
2. Angka Utama (`32–36 px` Bold `#1E293B`, dibulatkan maks 2 desimal, runtime-calculated).
3. Pembanding / Delta Benchmark (`12 px`, misal: `▲ +0.32% vs Median Target SDG 1 (10.14%)`).
4. Konteks Sebaran Ekstrem (`11 px`, misal: `Rentang: 2.38% (Sawahlunto) – 41.66% (Intan Jaya)`).

---

### 4. Wireframe Layout & Komponen per Halaman

> [!NOTE]
> **Rujukan Narasi Analitis:**  
> Untuk penjelasan mendalam mengenai alur cerita 5 babak, pertanyaan analitis, dan justifikasi kebijakan setiap halaman, lihat [`docs/design.md#7-storyboard--spesifikasi-5-halaman-dashboard`](file:///d:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/docs/design.md#7-storyboard--spesifikasi-5-halaman-dashboard).

#### Halaman 01: Poverty Landscape (Lanskap Makro Kemiskinan)
* **Tujuan Visual:** Menggugah audiens akan lebarnya jurang disparitas kemiskinan antardaerah (rentang 17.5x lipat).
* **Tata Letak Komponen:**
  * *Atas (12 Kolom):* 4 Kartu KPI Strip (Observasi: 514, Median $P_0$: 10.46%, Titik Terendah: 2.38%, Titik Tertinggi: 41.66%).
  * *Tengah Kiri (5 Kolom):* Histogram Distribusi $P_0$ (16:9) dengan garis putus-putus Median Nasional (10.46%).
  * *Tengah Kanan (7 Kolom):* Jittered Strip Plot 6 Kepulauan dengan garis median tebal per pulau (menonjolkan tingginya Maluku & Papua).
  * *Bawah (12 Kolom):* Tabel Leaderboard Top-10 Kabupaten Termiskin vs Top-10 Tersejahtera.

#### Halaman 02: Poverty & Indicator Map (Peta Spasial & Indikator Pilihan)
* **Tujuan Visual:** Eksplorasi geografis, jurang disparitas desa-kota, dan paradoks kerja subsisten.
* **Tata Letak Komponen:**
  * *Toolbar Kontrol:* Dropdown Indikator + Filter Pulau/Provinsi + Search Bar Kabupaten/Kota.
  * *Visual Utama (8 Kolom):* Choropleth Spatial Map 34 Provinsi.
    * *Fallback State:* Tampilkan **Horizontal Bar Chart Ranking** jika layer GeoJSON belum tervalidasi.
  * *Panel Samping (4 Kolom):* Panel detail wilayah terpilih (nilai indikator, peringkat, deviasi vs median).
  * *Bawah (12 Kolom - Split 2 Kolom):*
    * Kolom 1 (6 Kolom): Horizontal Bar Chart Disparitas Kabupaten (`13.5%`) vs Kota (`7.2%`).
    * Kolom 2 (6 Kolom): Scatterplot Paradoks Kerja TPAK vs Kemiskinan ($r = +0.462$).

#### Halaman 03: Regional Profiles (Profil Klaster Sosial-Ekonomi)
* **Tujuan Visual:** Membedah perbedaan konfigurasi defisit fasilitas dasar antarklaster (**STRICTLY NO RADAR CHART**).
* **Tata Letak Komponen:**
  * *Header:* Chip diagnostik model empiris ($k=4$, Silhouette = $0.2028$, Davies-Bouldin = $1.4522$, ARI = $0.9873$).
  * *Visual Utama (8 Kolom):*
    * Mode Tab 1: **Small Multiples Bar Charts (Z-Score)** (4 panel kecil horizontal bar per klaster).
    * Mode Tab 2: **Heatmap Matrix Divergen** (28 sel: Biru = Unggul, Vermillion = Defisit).
  * *Panel Samping (4 Kolom):* 4 Kartu Arketipe Persona Klaster (Modern Urban, Penyangga Mapan, Agraris Rentan, 3T Deprivasi).
  * *Bawah (12 Kolom):* Jittered Strip Plot sebaran $P_0$ antarklaster beranotasi uji ANOVA ($F=155.94, p<0.001$).

#### Halaman 04: Priority & Implications (Prioritas Intervensi & Matriks Kuadran)
* **Tujuan Visual:** Skrining wilayah prioritas tindakan berbasis matriks ortogonal 2x2.
* **Tata Letak Komponen:**
  * *Visual Utama (7 Kolom, Rasio ~1:1):* Scatterplot Kuadran 2x2.
    * **Sumbu X:** Kemiskinan Moneter Aktual ($P_0$ %, Median = 10.46%).
    * **Sumbu Y:** Indeks Kerentanan Fasilitas Dasar ($V_{struc}$, Median = 0.2721).
    * Titik data diwarnai berdasarkan 4 Kuadran (Kuadran I Vermillion, II Amber, III Blue, IV Navy).
  * *Panel Kanan (5 Kolom):* Kartu Arah Kebijakan Terpilih (menampilkan instrumen APBN/TKD dan instansi pengampu dari `policy_recommendations_matrix.csv`).
  * *Bawah (12 Kolom):* Tabel Daftar Skrining Interaktif dengan tombol **`Ekspor daftar skrining`**.

#### Halaman 05: Methodology & Data Quality (Metodologi & Mutu Data)
* **Tujuan Visual:** Menjamin transparansi akademis dan batas metodologi di hadapan dosen penguji.
* **Tata Letak Komponen:**
  * *Atas (12 Kolom):* Banner Penegasan "Murni Unsupervised Clustering, No Target Leakage, Bukan Ground Truth BPS".
  * *Tengah Kiri (6 Kolom):* Verifikasi Angka BPS 2021 & Dokumentasi Nilai Nol (Deiyai, Mamberamo Tengah, Nduga).
  * *Tengah Kanan (6 Kolom):* Visualisasi Teknis Boxplot Tukey 1.5x IQR (Khusus telaah statistik 36 pencilan).
  * *Bawah (12 Kolom):* Tabel Kamus Data Interaktif dan Tombol Unduh Dataset Interim Bersih.

---

### 5. Aturan Decluttering untuk Desainer UI / Frontend
1. **No 3D / No Gradient Overload:** Hindari elemen 3D, bayangan tebal, atau gradasi warna berlebihan.
2. **Minimalist Gridlines:** Garis grid grafik dibuat abu-abu samar (`#E2E8F0`).
3. **Direct Labels:** Tampilkan angka penting langsung pada visual, jangan memaksa pengguna menebak dari legenda.
4. **Defensive States:** Pastikan mockup mencakup tampilan *Loading skeleton*, *Empty result* (+ tombol Reset), dan *GeoJSON fallback*.
