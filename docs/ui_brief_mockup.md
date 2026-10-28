# UI Design Brief & Wireframe Specification
## PovertyRadar SDGs Interactive Dashboard Mockup

**Target Audiens Dokumen:** Desainer UI / Rekan Tim Pembuat Mockup (Figma, Canva, Penpot, Adobe XD)  
**Mata Kuliah:** Presentasi Data dan Storytelling  
**Standar Desain:** Mengikuti Kaidah Desain Visual Cole Nussbaumer Knaflic, Stephen Few, dan Nick Desbarats  
**Versi:** 2.1 (Enhanced with Wireframes & Mockup Values) | 28 Oktober 2026  

---

### 1. Ringkasan Proyek & Tujuan Dashboard
* **Nama Produk:** **PovertyRadar SDGs: Sistem Pemetaan Klaster dan Skrining Kerentanan Kemiskinan Daerah Indonesia**
* **Fokus Isu:** SDG 1 — *No Poverty* (Tanpa Kemiskinan).
* **Klasifikasi Dashboard:** **Communication & Analytical Exploration Dashboard** (Media bercerita data terarah mengenai ketimpangan antardaerah di Indonesia, sekaligus sarana eksplorasi mandiri profil sosial-ekonomi 514 kabupaten/kota).
* **Penegasan Model:** **TIDAK ADA pemodelan klasifikasi terawasi (*No Supervised Classification*)**. Model analitis murni *Unsupervised Clustering* profil sosial-ekonomi dan matriks skrining kerentanan.

---

### 2. Spesifikasi Kanvas & Layout Global
* **Target Resolusi:** Desktop Web Viewport standar (**1440 × 900 px** atau **1920 × 1080 px**).
* **Struktur Navigasi:**
  * **Sidebar Kiri (Lebar: ~260 px):** Memuat Logo PovertyRadar SDGs, status dataset (BPS 2021), 5 menu navigasi halaman utama, dan link dokumentasi.
  * **Kanvas Konten Kanan (Lebar: ~1180 px):** Area visualisasi dengan margin konsisten (padding 32px), mengikuti layout grid 12 kolom sejajar.
* **Hierarki Pola Baca:** Mengadopsi **F-Pattern & Top-Left Anchor**. Angka KPI paling penting dan kesimpulan narasi utama selalu ditempatkan di **sudut kiri atas (*Top-Left*)**.

---

### 3. Design System & Style Guide

#### A. Palet Warna (Neutral Base + Single Red Accent)
* **Canvas Background:** `#F8FAFC` (Slate sangat terang, bersih dan tidak silau).
* **Card Surface:** `#FFFFFF` (Putih bersih dengan border abu-abu sangat tipis `1px solid #E2E8F0`). **Hindari drop-shadow tebal**.
* **Teks Utama:** `#1E293B` (Slate gelap berdaya kontras tinggi).
* **Teks Sekunder / Keterangan:** `#64748B` (Muted gray).
* **Aksen Utama Kritis (SDG 1 Red):** `#E5243B` (HANYA digunakan untuk penekanan wilayah miskin ekstrem dan Kuadran I Prioritas Kritis).
* **Aksen Pendukung (SDG 6 Water Blue):** `#26BDE2` (digunakan terbatas untuk akses air minum dan sanitasi).
* **Palet Klaster (Okabe-Ito Colorblind-Safe):**
  * Klaster 1: Navy Blue (`#0072B2`)
  * Klaster 2: Warm Amber / Orange (`#E69F00`)
  * Klaster 3: Teal Green (`#009E73`)
  * Klaster 4: Vermillion (`#D55E00`)

#### B. Tipografi (Sans-Serif Modern & Scannable)
* **Font Family:** *Inter*, *Plus Jakarta Sans*, atau *Open Sans*.
* **Hirarki Ukuran:**
  * Page Title: 24–28 px | Bold
  * Section Subheading: 18–20 px | Semi-bold
  * KPI Big Number: 32–36 px | Bold
  * Body / Axis / Tooltip: 12–14 px | Regular
  * Microcopy / Annotation: 11–12 px | Medium

#### C. Format Baku Kartu KPI (No Bare Numbers)
Setiap kartu KPI wajib memuat:
1. Label Metrik (13px, Muted Gray).
2. Nilai Utama (32px Bold, dibulatkan maks 1 desimal).
3. Benchmark & Delta (12px, misal: `▲ +1.8% vs Median Nasional (10.5%)`).
4. Konteks Ekstrem (11px, misal: `Rentang: 2.4% – 41.7%`).

---

### 4. Storyboard & Wireframe Spesifik (5 Halaman Utama)

```
┌─────────────────┬──────────────────────────────────────────────────────────────────────┐
│  POVERTYRADAR   │  [Page Title: Official Page Name]                                    │
│  SDGs           │  [Subtitle Narasi / Pertanyaan Kunci 1 Kalimat]                      │
│                 ├──────────────────────────────────────────────────────────────────────┤
│  [1] Landscape  │  TOP-LEFT ANCHOR: [KPI Card 1] [KPI Card 2] [KPI Card 3] [KPI Card 4]│
│  [2] Map        ├───────────────────────────────────┬──────────────────────────────────┤
│  [3] Profiles   │                                   │                                  │
│  [4] Priority   │   [Visual Utama Kiri]             │   [Visual Pendukung Kanan]       │
│  [5] Method     │                                   │                                  │
│                 ├───────────────────────────────────┴──────────────────────────────────┤
│                 │   💡 INSIGHT KUNCI: [1-2 Kalimat Kesimpulan Utama]                    │
│  Dataset:       ├──────────────────────────────────────────────────────────────────────┤
│  BPS 2021 (34P) │   [Tabel Drill-Down / Rincian Daerah / Referensi]                    │
└─────────────────┴──────────────────────────────────────────────────────────────────────┘
```

---

#### Halaman 01: Poverty Landscape (Lanskap Makro Kemiskinan)
* **Pertanyaan Kunci yang Dijawab:** *Apa gambaran kemiskinan pada wilayah yang tercakup dan pola penting apa yang terlihat?*
* **Tujuan:** Menyadarkan audiens bahwa angka kemiskinan nasional menyembunyikan disparitas ekstrem antardaerah.
* **Layout & Komponen:**
  1. *Top-Left Anchor (Baris 4 KPI Card Berkonteks):*
     * **Rerata Nasional:** `12.3%` | Benchmark: `▲ +1.8% vs Median Nasional (10.5%)`
     * **Titik Terendah:** `2.4%` | Kota Sawahlunto, Sumatera Barat
     * **Titik Tertinggi:** `41.7%` | Kabupaten Intan Jaya, Papua (Aksen Oranye `#D55E00`)
     * **Rasio Disparitas:** `17.5x` | Lipat antara titik terendah dan tertinggi
  2. *Tengah Kanan:* Histogram Distribusi Kemiskinan ($P_0$) dengan garis putus-putus hitam vertikal di titik Median (10.5%).
  3. *Tengah Kiri:* Jittered Strip Plot (Dot Density Plot) perbandingan 6 Wilayah Kepulauan. Setiap titik mewakili 1 kabupaten/kota (514 titik transparan) dengan garis tebal penanda Median per pulau. Audiens langsung melihat kerumunan titik Papua berkumpul di atas (>25%), sedangkan Kalimantan padat di bawah (<10%) tanpa perlu memahami rumus kuartil/whisker.
  4. *Insight Callout:* *"💡 INSIGHT KUNCI: Disparitas regional sangat timpang; Maluku & Papua mencatatkan kemiskinan hampir 4x lipat dibanding Kalimantan."*
  5. *Bawah:* Tabel Interaktif Top-10 Daerah Termiskin vs Top-10 Tersejahtera.

---

#### Halaman 02: Poverty & Indicator Map (Peta Spasial & Indikator Pilihan)
* **Pertanyaan Kunci yang Dijawab:** *Di mana pola geografis atau perbedaan indikator paling terlihat?*
* **Tujuan:** Menjelajah peta geospasial tematik dan membuktikan jurang dualistik Kabupaten vs Kota serta paradoks ketenagakerjaan.
* **Layout & Komponen:**
  1. *Top Filter Bar:* Dropdown pemilihan indikator (Kemiskinan, Sanitasi, Air Minum, Pendidikan, Pengeluaran, TPAK, TPT) + Filter Pulau/Provinsi + Kotak Pencarian Daerah.
  2. *Visual Utama:* Peta Koroplet 34 Provinsi (514 poligon kabupaten/kota dengan gradasi warna teratur). Hover tooltip menampilkan: *Nama Daerah, Nilai Indikator, dan Deviasi vs Median*.
  3. *Bawah Kolom 1 (Disparitas Desa vs Kota):* Horizontal Bar Chart komparasi Kabupaten (`13.5%`) vs Kota (`7.2%`).
  4. *Bawah Kolom 2 (Paradoks Kerja):* Scatter plot TPAK vs Kemiskinan ($P_0$) dengan garis regresi positif.
  5. *Insight Callout:* *"💡 INSIGHT KUNCI: Kabupaten memiliki kemiskinan hampir 2x lipat dibanding kota. Di pedesaan miskin, partisipasi kerja tinggi karena warga wajib bekerja di sektor informal subsistensi untuk bertahan hidup."*

---

#### Halaman 03: Regional Profiles (Profil Klaster Sosial-Ekonomi)
* **Pertanyaan Kunci yang Dijawab:** *Apa karakteristik setiap kelompok daerah dan apa yang membedakannya?*
* **Tujuan:** Membuktikan secara ilmiah bahwa akar masalah kemiskinan daerah berbeda-beda melalui *Unsupervised Clustering*.
* **Layout & Komponen (CATATAN DESAIN: HINDARI RADAR / SPIDER CHART):**
  1. *Header:* Ringkasan model klaster teruji (*Silhouette Score > 0.35*).
  2. *Visual Utama (Small Multiples Horizontal Bar Charts):*
     * 3 atau 4 panel grafik batang kecil berjajar (satu panel per klaster).
     * Sumbu X = Skor Standar Deviasi (Z-Score dari -2 s.d. +2).
     * Sumbu Y = 6 Pilar Indikator (Pendidikan, Kesehatan, Sanitasi, Air, Pengeluaran, Ketenagakerjaan).
  3. *Kartu Narasi Arketipe (Data-Driven Personas):*
     * **Klaster 1:** *Perkotaan Maju Mandiri* (Z-Score positif di pendidikan & sanitasi).
     * **Klaster 2:** *Pedesaan Agraris Tertinggal Pendidikan* (TPAK tinggi, RLS rendah).
     * **Klaster 3:** *Wilayah 3T Tertinggal Ekstrem* (Sanitasi & air sangat minim).
  4. *Bawah:* Jittered Strip Plot (Dot Density Plot) sebaran kemiskinan aktual ($P_0$) pada masing-masing klaster dengan penanda garis Median per klaster (bebas dari kebingungan rumus kuartil/whisker boxplot).

---

#### Halaman 04: Priority & Implications (Prioritas Intervensi & Matriks Kuadran)
* **Pertanyaan Kunci yang Dijawab:** *Wilayah mana yang layak dianalisis lebih lanjut berdasarkan kondisi yang teramati?*
* **Tujuan:** Puncak rekomendasi kebijakan (*Call to Action*): daerah mana yang paling mendesak diintervensi beserta batas interpretasinya.
* **Layout & Komponen:**
  1. *Visual Utama (Matriks Kuadran 2x2):*
     * Scatter plot dua sumbu: Sumbu Y = Kemiskinan Aktual ($P_0$), Sumbu X = Indeks Kerentanan Struktural Relatif.
     * Dua garis referensi tegas berpotongan di median nasional masing-masing sumbu (membentuk 4 kuadran).
     * **Kuadran I (Kanan Atas / Aksen Oranye `#D55E00`):** Diberi label tebal *"Prioritas Kritis (Double Burden)"*.
     * **Kuadran II (Kanan Bawah):** *"Rentan Tersembunyi"*.
     * **Kuadran III (Kiri Atas):** *"Kantong Kemiskinan Spesifik"*.
     * **Kuadran IV (Kiri Bawah):** *"Kondisi Kuat / Resilien"*.
  2. *Panel Samping / Modal Card:* Kartu inspeksi detail kabupaten saat titik pada scatter plot diklik.

---

#### Halaman 05: Methodology & Data Quality (Metodologi & Mutu Data)
* **Pertanyaan Kunci yang Dijawab:** *Bagaimana temuan diperoleh dan apa yang tidak dapat disimpulkan?*
* **Tujuan:** Menjamin integritas akademik dan transparansi metodologi di hadapan dosen penguji.
* **Layout & Komponen:**
  1. *Kartu Bukti Validasi:* Rekonsiliasi angka BPS 2021 (Surakarta, Cilacap, Banyumas) dan penjelasan peta 34 provinsi.
  2. *Callout Banner:* "Penegasan: Proyek Ini Murni Unsupervised Clustering, Tanpa Pemodelan Klasifikasi Terawasi".
  3. *Penjelasan Nilai Nol:* Dokumentasi nilai 0.00% pada sanitasi Deiyai, air minum Mamberamo Tengah, dan TPT Nduga.
  4. *Visualisasi Teknis Outlier (Boxplot Tukey 1.5x IQR):* Boxplot dihadirkan khusus di layar ini bagi dosen/penguji teknis untuk memeriksa perhitungan batas pencilan 36 daerah secara matematis.
  5. *Akses Data:* Kamus data tabel interaktif dan tombol unduh file interim `poverty_data_cleaned.csv`.

---

### 5. Aturan Decluttering untuk Mockup
1. **No 3D / No Shadows:** Jangan gunakan efek 3 dimensi atau bayangan kartu yang tebal.
2. **Minimalist Gridlines:** Garis grid grafik dibuat abu-abu samar (`#E2E8F0`).
3. **Direct Labels:** Pasang angka/nama langsung pada ujung batang penting, jangan membuat audiens menebak-nebak via legenda terpisah.
4. **Insight Callout Box:** Tempatkan kartu kecil 1 kalimat bertanda 💡 di bawah setiap grafik utama yang merangkum poin pentingnya.
