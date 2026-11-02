# DESIGN SYSTEM — PovertyRadar SDGs Executive Dashboard

> Panduan acuan desain visual, arsitektur tata letak, dan token desain untuk **Indonesia Regional Poverty Dashboard** (BPS 2021 · 514 Kabupaten/Kota).

---

## 1. Filosofi & 4 Aturan Emas Pemakaian

1. **Tipografi dulu, warna kemudian**  
   Hierarki informasi dibangun melalui ukuran, bobot font (*Inter* `400`, `500`, `600`), dan kontras teks. Bila hierarki sudah tegas, warna digunakan secara minimal.
2. **Warna di data, bukan di dekorasi**  
   Latar kanvas (`#F3F2F1`), kartu (`#FFFFFF`), dan border (`#E1DFDD`) selalu netral. Warna hanya boleh muncul pada visualisasi data (sel kartogram, data bars, dan indikator alert).
3. **Maksimal satu warna alert per layar**  
   Warna merah (`--alert: #C62828` / `--alert-bg: #FDECEA`) khusus dialokasikan untuk anomali kritis dan **Class 1 (Kemiskinan Akut)**. Bila semua elemen diberi warna merah/oranye/kuning, tidak ada yang terbaca sebagai sinyal bahaya.
4. **Lolos uji grayscale (Monotonik)**  
   Skala data menggunakan palet sekuensial biru 6 kelas yang memiliki gradasi terang-gelap (*lightness*) bertingkat secara teratur. Visualisasi tetap terbaca urutan nilainya meski dicetak hitam-putih.

---

## 2. Token Desain (CSS Variables)

```css
:root {
  /* Netral */
  --bg:        #F3F2F1;
  --card:      #FFFFFF;
  --border:    #E1DFDD;
  --text:      #201F1E;
  --text-2:    #605E5C;
  --grid:      #EDEBE9;

  /* Aksen Utama */
  --accent:    #1F4E79;
  --accent-bg: #E8F0F8;

  /* Alert (Khusus Class 1 / Ambang Kritis) */
  --alert:     #C62828;
  --alert-bg:  #FDECEA;

  /* Sekuensial P0 (6 kelas, satu hue biru ColorBrewer) */
  --p0-1: #EFF3FF;  /* P0 < 7% */
  --p0-2: #C6DBEF;  /* P0 7% - 12% */
  --p0-3: #9ECAE1;  /* P0 12% - 18% */
  --p0-4: #6BAED6;  /* P0 18% - 25% */
  --p0-5: #3182BD;  /* P0 25% - 32% */
  --p0-6: #08519C;  /* P0 ≥ 32% */

  /* Metrik Sekunder (Sanitasi, Lama Sekolah) */
  --neutral-bar: #8A9BB0;

  /* Tipografi */
  --font: 'Inter', 'Segoe UI', system-ui, sans-serif;

  /* Geometri & Elevasi */
  --radius-card: 10px;
  --radius-control: 6px;
  --shadow: 0 1px 2px rgba(0, 0, 0, .06);
}
```

---

## 3. Komponen Utama

### A. Kartu Standar (`.card`)
```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow);
}
```

### B. Header Sticky (`.header-sticky`)
```css
.header-sticky {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, .8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
```

### C. Kontrol UI & Tombol
* **Dropdown Slicer & Input**: `border-radius: var(--radius-control);`, tinggi 28–30px, border `1px solid var(--border)`, latar putih.
* **Filter Reset**: Tombol outline alert `border: 1px solid var(--alert); background: var(--alert-bg); color: var(--alert);`.
* **Tab Navigasi**: Tab aktif menggunakan latar `--accent: #1F4E79` teks putih. Tab non-aktif menggunakan kartu putih border abu-abu.

### D. 4 KPI Strip
* **Proporsi**: 4 kolom seimbang (grid 4 kolom).
* **Ukuran Angka**: `font-size: 26px; font-weight: 600; line-height: 1.15;`.
* **Kategori**:
  1. *Jurang Kesenjangan Daerah*: `17.5x Lipat` (Sawahlunto vs Intan Jaya).
  2. *Konsentrasi Kemiskinan Akut*: `87% di Wilayah Timur` (Aksen alert merah `--alert`).
  3. *Paradoks "Working Poor"*: `Pengangguran < 1%` (Subsistensi ekstrem).
  4. *Faktor Kunci Pengentasan*: `Sanitasi 2.3x > PDRB` (Akses air/jamban vs kekayaan daerah).

### E. Hero Area (Grid 12-Kolom)
* **Kolom 1–8 (Hero Cartogram Map)**:
  - 1 sel = 1 kabupaten/kota.
  - Fill warna sel mengikuti 6 kelas sekuensial biru P0.
  - Border merah tebal (`stroke: var(--alert); stroke-width: 1.4px`) khusus untuk daerah Class 1 Akut.
  - Dilengkapi hoverline interaktif dan skala blok legenda.
* **Kolom 9–12 (Visual Pendukung Kanan)**:
  - *Atas*: Tier Bar linear proporsional (`#9ECAE1` hingga `#08519C`).
  - *Bawah*: Matriks Kepulauan (rata-rata P0 dan sanitasi layak per pulau, bendera alert sanitasi <45%).

### F. Executive Callouts Row (2 Kolom Seimbang)
* **Callout Kiri**: *Paradoks Ketenagakerjaan ("The Working Poor")* — Lanny Jaya/Nduga (TPT 0%, P0 ~38%) vs Depok/Tangsel (TPT 8–9%, P0 2.5%). Border samping merah alert.
* **Callout Kanan**: *Disparitas Wilayah (Anomali Pulau Madura)* — 3 dari 119 daerah Jawa yang berstatus Class 1 (Sampang RLS 4.86 tahun). Border samping aksen biru.

### G. Tabel Drilldown Memanjang (`.drill-full`)
* **Lebar Penuh (12 Kolom)**: Membentang penuh tanpa sela vertikal kosong.
* **Scrollable Kontainer**: Tinggi `380px` dengan *sticky header* warna `--accent: #1F4E79` teks putih.
* **Tipografi & Spasi**: Ukuran font dinaikkan ke **12px** dengan tinggi baris `32px` dan angka *tabular-nums*.
* **Highlight Baris**: Baris Class 1 ditandai dengan latar lembut `var(--alert-bg)` dan pill `Class 1 Akut`.

---

## 4. Struktur Berkas Implementasi

* `src/index.css`: Definisi CSS variables `:root`, utility classes (`.card`, `.header-sticky`), layout 12-kolom, dan media query responsif.
* `src/App.tsx`: Komponen React dashboard, filter slicer state, kalkulasi statistik BPS, peta kartogram, baris callout, dan tabel drilldown.
* `src/data.ts`: Data mentah 514 kabupaten/kota BPS 2021.
