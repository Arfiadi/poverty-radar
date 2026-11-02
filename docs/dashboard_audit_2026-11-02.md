# Audit Dashboard PovertyRadar SDGs

**Tanggal audit:** 2 November 2026  
**Snapshot commit:** `a0c0f77` — `feat(dashboard): add interactive 34-province choropleth map with district inspector on Act 2`  
**Objek audit:** `dashboard/` (React 18 + Vite + TypeScript + ECharts) dan payload `dashboard/public/data/*`  
**Sifat audit:** Audit statis kode, payload JSON, dan rekonsiliasi angka terhadap `data/processed/poverty_clusters.csv`. Tidak dilakukan uji visual/interaksi di browser.

---

## 1. Ringkasan Eksekutif

**Verdict: data inti dashboard adalah data riil, bukan mockup acak.** Seluruh 514 kabupaten/kota, 34 provinsi, atribut sosial-ekonomi, klaster, kuadran kerentanan, koefisien OLS, dan tiga kasus batas 0,00% berasal dari pipeline Python dan payload JSON yang konsisten dengan `data/processed/poverty_clusters.csv`.

Namun, **lapisan presentasi dan narasi belum sepenuhnya data-driven**. Ada empat masalah yang membuat sebagian tampilan menyesatkan:

1. **Chart sebaran kepulauan hanya memplot 410 dari 514 daerah** karena nama region tidak cocok (`"Maluku & Papua"` vs `"Maluku-Papua"`).
2. **KPI “Kantong Akut di Kawasan Timur” menampilkan 0,0% (0 dari 61)**, padahal angka benar adalah **86,9% (53 dari 61)**, akibat bug yang sama pada exporter.
3. **Nilai pengeluaran per kapita salah 1.000×** di kartu klaster, tabel, dan CSV: `Rp14.596` (ribu Rp) ditampilkan sebagai **`Rp0,01 jt`**, bukan **`Rp14,60 jt`**.
4. **Narasi paradoks dan callout memakai angka hardcoded yang sudah basi**, sehingga pada layar yang sama chart dan narasi saling bertentangan (mis. OLS sanitasi `-0,19` di chart vs `-0,209` di callout).

**Kesimpulan praktis:** dashboard layak dipresentasikan sebagai sistem analitik riil, tetapi **belum layak diklaim sepenuhnya “semua angka live dari data”** sampai temuan Kritis (F-01 s.d. F-03) diperbaiki.

---

## 2. Ruang Lingkup dan Metode

Yang diperiksa:

- Seluruh halaman `dashboard/src/pages/01`–`05`.
- Seluruh komponen chart dan komponen umum.
- Hook data, filter store, formatter, CSV export, dan konstanta.
- Payload `dashboard/public/data/*.json` dan GeoJSON.
- Rekonsiliasi angka dengan `data/processed/poverty_clusters.csv`, `data/processed/poverty_cluster_summary.csv`, dan `data/raw/Klasifikasi Tingkat Kemiskinan di Indonesia.csv`.
- Kompilasi TypeScript (`npx tsc --noEmit`).

Yang **tidak** dilakukan:

- Uji render visual di browser, uji klik/zoom peta, uji responsivitas, dan uji aksesibilitas dengan alat khusus.
- Uji deploy produksi.
- Uji performa pada perangkat rendah.

---

## 3. Rantai Data dan Provenance

| Tahap | Artefak | Waktu | Status |
|---|---|---|---|
| Raw BPS/Kaggle | `data/raw/Klasifikasi Tingkat Kemiskinan di Indonesia.csv` | 28 Okt 2026 | Riil, 514 baris, 13 kolom, termasuk label biner |
| Interim | `data/interim/poverty_data_cleaned.csv` | 2 Nov 2026 21:18 | Riil, label biner sudah didrop |
| Processed | `data/processed/poverty_clusters.csv` | 2 Nov 2026 21:18 | Riil, 514 baris, 21 kolom, 26 anomali multivariat |
| Summary | `data/processed/poverty_cluster_summary.csv` | 2 Nov 2026 21:18 | Riil, 4 baris klaster |
| Policy matrix | `data/processed/policy_recommendations_matrix.csv` | **31 Okt 2026 10:32** | Kurasi manual, **tidak diregenerasi pipeline**, numeriknya basi |
| Payload frontend | `dashboard/public/data/*.json` | 2 Nov 2026 22:49 | Diekspor dari processed, kecuali policy matrix |
| Peta | `dashboard/public/data/indonesia-provinces.geojson` | 2 Nov 2026 23:07 | Riil, 34 fitur provinsi, join nama 34/34 |

Catatan penting: `policy_recommendations_matrix.csv` lebih tua dari hasil clustering terbaru. `src/poverty_radar/pipeline.py` hanya menulis `poverty_clusters.csv` dan `poverty_cluster_summary.csv`; tidak ada langkah yang menulis ulang policy matrix.

---

## 4. Matriks Keaslian per Komponen

| Halaman | Komponen | Sumber angka | Status |
|---|---|---|---|
| 1 | KPI median, rasio disparitas | `national_benchmarks.json` | Riil |
| 1 | KPI kantong akut Timur | `national_benchmarks.json` | **Riil tetapi salah nilai (0,0%)** |
| 1 | Histogram P0 | Komputasi dari 514 district | Riil, anotasi median statis |
| 1 | Strip plot 6 kepulauan | Komputasi dari district | **Riil, tetapi 104 daerah tidak ikut terplot** |
| 1 | Top 10 tertinggi/terendah | Komputasi dari district | Riil, caption statis |
| 1 | Tabel 514 daerah | `poverty_districts.json` | Riil, unit pengeluaran salah |
| 2 | Peta choropleth 34 provinsi | GeoJSON + agregasi district | Riil, join 34/34 |
| 2 | Ranking bar 34 provinsi | Komputasi dari district | Riil |
| 2 | The Great Dualism | Komputasi dari district | Riil |
| 2 | Working Poor scatter | Titik riil; garis tren **mock** | **Campuran** |
| 3 | Diagnostik Silhouette/DBI/ARI | Hardcoded dari eksperimen | Riil, tetapi tidak live |
| 3 | Kartu 4 persona klaster | `cluster_summary.json` gagal dibaca; fallback komputasi | **Kontrak data rusak** |
| 3 | Small multiples Z-score | Komputasi dari district | Riil dinamis, baseline berubah saat filter |
| 3 | Heatmap 28 sel | Komputasi dari district | Riil dinamis, label N statis |
| 4 | Matriks 2x2 | `poverty_districts.json` | Riil; garis median nasional statis |
| 4 | Pin Kutukan Tambang | Filter data riil | Riil, tetapi narasi 17 vs 29 daerah |
| 4 | Pin Disparitas Madura | Filter data riil | Riil, 5 daerah |
| 4 | Panel kebijakan kuadran | `policy_matrix.json` (kurasi) | Riil secara kualitatif, numerik basi |
| 5 | OLS coefficient bar | `ols_coefficients.json` | Riil |
| 5 | Callout OLS | `paradoxes.ts` hardcoded | **Basi/berbeda dari chart** |
| 5 | Dekonstruksi label Kaggle | Hardcoded 98,83% | Riil tetapi frozen; JSON tidak dipakai |
| 5 | Kasus batas 0,00% | `boundary_cases.json` | Riil, terverifikasi |
| 5 | Boxplot Tukey | Komputasi dari district | Riil (35 outlier P0) |
| Global | Filter pulau/provinsi/klaster/rentang P0 | Tidak ada UI | **Belum diimplementasikan** |
| Global | Pencarian + reset | Zustand store | Berfungsi |

---

## 5. Temuan Detail

### 5.1 Kritis

#### F-01 — Nama region tidak konsisten: 104 daerah hilang dari strip plot

**Dampak:** Chart “Sebaran Kemiskinan Moneter (P0) di 6 Kawasan Kepulauan Besar” mengklaim 514 titik, tetapi hanya memplot **410 titik**. Median dua kepulauan menjadi **0,0%**, dan dua kategori tampil kosong.

**Bukti:**

- Data memakai `"Maluku & Papua"` dan `"Bali & Nusa Tenggara"` (63 + 41 = 104 daerah).
- `ArchipelagoStripPlot.tsx` memakai `"Maluku-Papua"` dan `"Bali-Nusa Tenggara"` (baris 12–19), lalu `islands.indexOf(d.region_pulau)` (baris 39) mengembalikan `-1` untuk 104 daerah tersebut.
- Hasil simulasi join: `strip points plotted 410 of 514`; `Bali-Nusa Tenggara 0`; `Maluku-Papua 0`.
- Konstanta `ISLAND_REGIONS` di `constants/benchmarks.ts` (baris 23–31) juga memakai nama yang salah, sehingga filter pulau tersebut akan menghasilkan 0 daerah jika nanti diaktifkan.

**Lokasi:** `dashboard/src/components/charts/ArchipelagoStripPlot.tsx`, `dashboard/src/constants/benchmarks.ts`, `dashboard/src/hooks/useFilteredDistricts.ts`.

**Rekomendasi:** Gunakan satu sumber nama region kanonik (mis. enum `REGION_PULAU` yang sama dengan nilai CSV), atau normalisasi dengan mapping eksplisit. Tambahkan assertion bahwa jumlah titik terplot = jumlah district yang lolos filter.

---

#### F-02 — KPI kantong akut Timur menampilkan 0,0% karena bug exporter

**Dampak:** KPI utama halaman 1 menampilkan **“0,0% di Kawasan Timur”** dan **“0 dari 61”**, sementara narasi di halaman yang sama menulis **86,9% (53 dari 61)**. Ini kontradiksi langsung pada layar pertama.

**Bukti:**

- `scripts/export_dashboard_payload.py` baris 48–49 mendefinisikan `eastern_regions = ["Maluku-Papua", "Bali-Nusa Tenggara"]`, sedangkan data memakai `"Maluku & Papua"` dan `"Bali & Nusa Tenggara"`.
- `national_benchmarks.json` baris 14–17: `eastern_acute_count: 0`, `western_acute_count: 61`.
- Rekonsiliasi data: 61 daerah P0 ≥ 20%; 38 di `Maluku & Papua` + 15 di `Bali & Nusa Tenggara` = **53 Timur (86,9%)**; 5 Sumatera + 3 Jawa = **8 Barat (13,1%)**.
- Halaman 1 baris 26–28 memakai nilai JSON tersebut (`easternAcutePct = benchmarks?.eastern_acute_pct ?? 86.9`), sehingga fallback yang benar justru tidak terpakai.

**Lokasi:** `scripts/export_dashboard_payload.py`, `dashboard/public/data/national_benchmarks.json`, `dashboard/src/pages/01_PovertyLandscape.tsx`.

**Rekomendasi:** Perbaiki daftar nama region di exporter, regenerasi payload, dan tambahkan assertion `eastern_acute_count + western_acute_count == total_acute_pockets`. Jangan menyimpan dua definisi region yang berbeda.

---

#### F-03 — Unit pengeluaran per kapita salah 1.000×

**Dampak:** Pengeluaran per kapita ditampilkan sebagai **`Rp0,01 jt`**, padahal nilainya **`Rp14,60 jt/tahun`**. Ini terjadi di kartu klaster, tabel utama, dan CSV export. Pada peta/ranking, nilai `8925` ditampilkan sebagai `8925 Rp`, yang terbaca sebagai Rp8.925, bukan Rp8,9 juta.

**Bukti:**

- `data/README.md` dan `docs/data_contracts.md` menegaskan `expenditure_per_capita` bersatuan **Ribu Rupiah/orang/tahun**.
- `formatters.ts` baris 16–19 membagi dengan `1_000_000`, seolah input dalam Rupiah penuh. Untuk `14596` → `0,01 jt`.
- `03_RegionalProfiles.tsx` baris 106 dan `DataTable.tsx` baris 151 memakai formatter tersebut.
- `csvExport.ts` baris 21 memberi label `Pengeluaran_per_Kapita_Rp`, padahal nilai mentahnya ribuan Rupiah.
- `02_IndicatorMap.tsx` baris 25 memakai unit `' Rp'` untuk indikator pengeluaran, sehingga peta dan ranking menampilkan `8925 Rp`.

**Rekomendasi:** Ubah formatter menjadi `val / 1_000` untuk satuan ribu Rp, ganti nama parameter agar eksplisit (`valInThousandRupiah`), perbaiki unit indikator menjadi `' Rp ribu'` atau format khusus `Rp8,9 jt`, dan ubah header CSV menjadi `Pengeluaran_per_Kapita_Ribu_Rp`. Tambahkan unit test formatter.

---

### 5.2 Tinggi

#### F-04 — Kontrak `cluster_summary.json` tidak cocok dengan tipe dan halaman

**Dampak:** Kartu persona klaster tidak benar-benar membaca ringkasan klaster dari JSON. Nilai mean jatuh ke fallback komputasi dari district, sedangkan jumlah anggota (`N`) dan persentase tetap memakai konstanta. Saat filter aktif, kartu bisa menampilkan `N = 78` tetapi mean hanya dari 1–2 daerah.

**Bukti:**

- Tipe `ClusterSummary` (`types/index.ts` baris 25–48) mengharapkan `n_members`, `pct_share`, `mean_p0`, `mean_avg_school_years`, `mean_sanitation`, `mean_expenditure`, dst.
- `cluster_summary.json` justru memakai `total_regions`, `pct_of_national`, `poverty_rate_p0_mean`, `avg_school_years_mean`, `sanitation_access_pct_mean`, `expenditure_per_capita_mean`, dst.
- `03_RegionalProfiles.tsx` baris 68–73 melakukan `summary?.mean_p0 ?? fallback`; karena key tidak ada, fallback selalu dipakai.
- Baris 85 memakai `c.count` dari konstanta `CLUSTERS`, bukan `summary.total_regions`.

**Rekomendasi:** Pilih satu kontrak. Opsi terbaik: ubah tipe dan halaman agar memakai key CSV (`poverty_rate_p0_mean`, `total_regions`, dst.), lalu gunakan `summary` sebagai sumber utama. Untuk tampilan terfilter, tampilkan dua konteks terpisah: “nasional: 78 daerah” dan “subset terfilter: n daerah”, atau hitung ulang semuanya dari subset.

---

#### F-05 — Narasi “Kutukan Tambang” menyebut 17 daerah, filter sebenarnya 29

**Dampak:** Pin Kutukan Tambang mengisolasi 29 daerah, tetapi judul dan isi callout menyebut 17 daerah dan memakai angka P0 yang sudah tidak cocok.

**Bukti:**

- Filter: `grdp_constant_million_idr >= 25_000_000` dan `poverty_rate_p0 >= 10.46` → **29 daerah**.
- `paradoxes.ts` baris 33–36 menyebut 17 daerah.
- Contoh mismatch: Mimika `14,29` (narasi) vs `14,17` (data); Bojonegoro `12,28` vs `13,27`; Morowali `13,80` vs `13,75`; Teluk Bintuni `29,38` vs `29,79`.

**Rekomendasi:** Hitung jumlah dan daftar daerah langsung dari data saat pin aktif, atau regenerate `paradoxes.ts` dari skrip. Jangan menulis angka hasil filter sebagai teks statis.

---

#### F-06 — Callout OLS dan korelasi memakai angka basi

**Dampak:** Pada halaman 5, chart OLS menampilkan koefisien dari JSON, tetapi callout di bawahnya menampilkan koefisien berbeda. Hal yang sama terjadi pada callout layanan dasar di halaman 3.

**Bukti (chart/JSON vs narasi):**

| Variabel | JSON/chart | Narasi `paradoxes.ts` |
|---|---|---|
| Pengeluaran | -0,318 | -0,317 |
| Sanitasi | -0,190 | -0,209 |
| Log PDRB | -0,190 | -0,197 |
| TPAK | +0,179 | +0,183 |
| RLS | -0,113 | -0,118 |
| TPT | +0,100 | +0,093 |

Korelasi bivariat aktual: sanitasi `-0,562`, air `-0,373`, log PDRB `-0,527`, TPAK `+0,462`. Narasi `basicServices` menulis air `-0,42` dan log PDRB `-0,36`; `design.md` bahkan menulis log PDRB `-0,24`.

**Rekomendasi:** Jadikan `ols_coefficients.json` dan perhitungan korelasi sebagai satu-satunya sumber, lalu bangun teks callout secara dinamis. Jika narasi ingin tetap statis, tambahkan tes yang membandingkan angka narasi dengan payload.

---

#### F-07 — Garis tren Working Poor adalah garis mock, bukan regresi

**Dampak:** Scatter menampilkan garis putus-putus berlabel “Garis Tren Positif (r = +0,462)”, tetapi koordinatnya hardcoded `[60, 6]`–`[95, 30]` dan tidak dihitung dari data. Ini satu-satunya elemen visual yang benar-benar bersifat mockup, bukan sekadar angka statis.

**Bukti:** `WorkingPoorScatter.tsx` baris 87 dan 98–103. Korelasi `+0,462` sendiri benar terhadap data, tetapi garisnya bukan fitted line.

**Rekomendasi:** Hitung regresi linear (atau LOWESS) dari `labor_participation_tpak` vs `poverty_rate_p0` lalu gambar `markLine`/`line` dari koefisien tersebut. Hitung juga `r` secara dinamis agar tetap benar saat filter aktif.

---

#### F-08 — Label nasional statis bercampur dengan data terfilter

**Dampak:** Setelah pencarian atau pin aktif, beberapa elemen tetap menampilkan angka/label nasional, sehingga pembaca mengira angka tersebut milik subset.

Contoh:

- `SmallMultiplesZScore.tsx` baris 49–52: label `N=78/187/216/33` tetap, meskipun z-score dihitung dari subset terfilter.
- `VulnerabilityMatrix2x2.tsx` baris 112: series tetap bernama “Daerah 514”.
- `04_PriorityImplications.tsx` baris 57 dan 190: “Semua (514)”, “Kuadran I (162 daerah / 31,5%)”.
- `DistributionHistogram.tsx` baris 46: subtitle selalu “median nasional 10,46%”.
- `SpatialRankingBar.tsx` baris 49: judul selalu “34 Provinsi”.
- `01_PovertyLandscape.tsx` baris 108/138: caption Top 10 selalu “Seluruhnya di Papua dan Nusa Tenggara” / “Didominasi kota otonom”.

**Rekomendasi:** Bedakan secara eksplisit antara “benchmark nasional” dan “subset terfilter”. Untuk chart yang berubah mengikuti filter, hitung ulang label N, jumlah provinsi, dan baseline. Untuk chart yang sengaja mempertahankan garis median nasional, beri label “Median nasional (referensi tetap)”.

---

#### F-09 — Filter global yang dijanjikan desain belum ada

**Dampak:** `docs/design.md` menjanjikan filter `Wilayah Pulau`, `Provinsi`, `Klaster`, `Rentang P0`, dan klik-untuk-filter. Di UI saat ini hanya tersedia **pencarian nama** dan **case-study pin**. Store memiliki setter untuk semua filter, tetapi tidak ada komponen yang memanggilnya.

**Bukti:**

- `useFilterStore.ts` mendefinisikan `setSelectedIsland`, `setSelectedProvince`, `setSelectedCluster`, `setSelectedQuadrant`, `setP0Range`.
- Pencarian hanya setter yang dipakai di `TopBar.tsx`; `setActiveCasePin` dipakai di halaman 4.
- Tidak ada panel filter di `Sidebar.tsx`.
- `ArchipelagoStripPlot` menerima prop `onSelectDistrict` tetapi tidak memakainya; klik chart belum memfilter tabel.
- Peta hanya membuka inspector provinsi, tidak mengubah filter global.

**Rekomendasi:** Implementasikan panel filter yang dijanjikan atau turunkan klaim di desain/README. Jika diimplementasikan, gunakan nama region kanonik (lihat F-01) dan reset halaman tabel saat filter berubah.

---

### 5.3 Sedang

#### F-10 — Pagination tabel tidak reset saat filter berubah

**Dampak:** Jika pengguna berada di halaman 5 lalu mencari daerah yang hanya menghasilkan 1 halaman, tabel dapat menampilkan pesan “Tidak ada daerah yang memenuhi filter” padahal datanya ada, karena `page` tetap 5.

**Bukti:** `DataTable.tsx` baris 23–26 menyimpan `page`, baris 50–51 memotong data berdasarkan `page`, dan tidak ada `useEffect` yang mereset `page` ketika `districts` berubah.

**Rekomendasi:** Tambahkan `useEffect(() => setPage(1), [districts, pageSize])` atau reset di handler filter.

---

#### F-11 — Garis median histogram dipatok ke bin tertentu

**Dampak:** Label median dihitung dinamis (`nationalMedian`), tetapi `markLine` selalu digambar pada kategori `'9–12%'` (baris 114–115). Jika filter menggeser median ke luar bin itu, label dan posisi garis tidak sinkron.

**Rekomendasi:** Cari indeks bin yang memuat median, lalu gunakan label kategori tersebut; atau gunakan `xAxis` numerik dengan nilai median sebenarnya.

---

#### F-12 — Metrik Kaggle 98,83% frozen dan exporter memiliki bug threshold

**Dampak:** Angka 98,83% benar terhadap data mentah, tetapi tidak dihitung ulang oleh pipeline saat ini. `kaggle_rule_info.json` tidak pernah di-fetch oleh frontend; halaman 5 menulis 98,83% langsung di JSX.

**Bukti:**

- `05_MethodologyAudit.tsx` baris 106 dan 119–120 hardcoded `98.83%` dan `508 dari 514`.
- `export_dashboard_payload.py` baris 153–163 hanya menghitung ulang jika `poverty_class_target` ada di `poverty_data_cleaned.csv`. Kolom itu sudah didrop, sehingga selalu jatuh ke default hardcoded `98.83`.
- Threshold di script memakai `expenditure_per_capita <= 6250000`, padahal kolom bersatuan ribu Rp. Jika target tersedia, rule ini menghasilkan **93,39%**, bukan 98,83%. Threshold yang benar adalah `6250` (setara Rp6,25 juta).
- Verifikasi manual pada data mentah dengan threshold `6250`: **508/514 = 98,83%**.

**Rekomendasi:** Hitung metrik dari raw data (bukan interim yang sudah tanpa label), gunakan threshold `6250`, tulis `matched_regions` dari hasil hitung, dan fetch JSON di frontend. Tambahkan assertion bahwa `matched_regions / total_regions` konsisten dengan `accuracy_pct`.

---

#### F-13 — Policy matrix tidak disinkronkan dengan hasil clustering terbaru

**Dampak:** `policy_recommendations_matrix.csv` bertanggal 31 Okt, sedangkan cluster terbaru 2 Nov. Jumlah anggota klaster masih cocok (78/187/216/33), tetapi profil numerik di dalamnya sudah basi.

Contoh:

| Klaster | Policy matrix | Data 2 Nov |
|---|---|---|
| K1 median P0 | 4,96 | 5,54 |
| K1 sanitasi | 89,1 | 92,35 |
| K1 pengeluaran | Rp13,9 jt | Rp14,60 jt |
| K2 median P0 | 8,94 | 9,68 |
| K3 min P0 | 4,54 | 3,04 |
| K3 max P0 | 24,31 | 37,91 |
| K4 min P0 | 15,31 | 7,09 |

Field numerik ini tidak semuanya ditampilkan di panel kuadran, tetapi tetap menjadi risiko jika nanti dipakai.

**Rekomendasi:** Tambahkan langkah generasi policy matrix ke `pipeline.py`, atau tandai field numerik sebagai “snapshot tanggal X” dan regenerasi sebelum presentasi.

---

#### F-14 — README dan sebagian dokumen desain sudah tidak sinkron dengan dashboard

**Dampak:** Pembaca dokumentasi mendapat gambaran yang berbeda dari aplikasi.

Contoh:

- `dashboard/README.md` baris 85–88 menyebut klaster `248/133/74/59` dan nama persona yang berbeda; data aktual `78/187/216/33`.
- README baris 101 menyebut “36 pencilan multivariate”; data memiliki **26 anomali multivariat** dan **35 outlier Tukey P0**.
- README baris 107–112 memetakan warna klaster 0 = amber, 1 = biru; aplikasi memakai klaster 0 = biru, 1 = amber (sesuai `okabeItoPalette.ts`).
- README belum mencantumkan peta choropleth yang baru ditambahkan.
- `docs/design.md` masih menyebut 17 daerah resource curse dan koefisien OLS lama.

**Rekomendasi:** Regenerasi angka di README dari payload aktual, atau hapus angka duplikat dan rujuk ke file data.

---

#### F-15 — Label benchmark nasional memiliki format ganda

**Dampak:** `national_benchmarks.json` menulis `min_p0_region: "Kota Kota Sawah Lunto"` karena `tipe_wilayah` sudah mengandung “Kota” lalu ditambah lagi oleh exporter. Nilai ini tidak sedang ditampilkan, tetapi akan salah jika dipakai di KPI/tooltip.

**Rekomendasi:** Gunakan `kab_kota` apa adanya (sudah mengandung “Kota”/“Kabupaten”) atau bentuk label dengan aturan yang tidak menduplikasi prefix.

---

### 5.4 Rendah

#### F-16 — Diagnostik model hardcoded tetapi benar

Silhouette `0,2028`, DBI `1,4522`, dan ARI `0,9803` di `03_RegionalProfiles.tsx` baris 44–55 cocok dengan eksperimen/notebook. Namun nilainya tidak berasal dari payload, sehingga bisa basi jika model di-fit ulang. ARI juga berbeda dengan `experiments/clustering_benchmark_results.csv` (`0,9879` untuk 10 seed), jadi perlu dicatat provenance-nya (20 seed vs 10 seed).

**Rekomendasi:** Ekspor metrik model ke `model_diagnostics.json` dan tampilkan dari sana.

#### F-17 — Label “Fallback Geospasial” sudah usang

`SpatialRankingBar.tsx` baris 50 masih menyebut “Fallback Geospasial”, padahal peta choropleth sudah tersedia dan tab ranking adalah pilihan eksplisit pengguna.

#### F-18 — Tidak ada validasi skema runtime di frontend

`useDashboardData.ts` hanya memeriksa `districtsRes.ok`; payload lain langsung `.json()` tanpa validasi. Inilah sebab F-04 tidak terdeteksi: TypeScript lolos karena JSON tidak diperiksa saat runtime.

**Rekomendasi:** Tambahkan validator (Zod/manual) yang memeriksa jumlah baris, nama kolom, dan tipe untuk setiap payload. Gagal cepat dengan pesan yang jelas.

#### F-19 — Kepatuhan palette dan aksesibilitas sebagian

- Radar chart: tidak ada (patuh).
- Boxplot: hanya di halaman audit metodologi (patuh).
- Okabe-Ito: dipakai untuk sebagian besar encoding, tetapi heatmap memakai `#FDE047`/`#38BDF8` dan badge UI memakai Tailwind red/emerald/purple/amber di luar palette data.
- Beberapa teks `slate-400` di atas putih berpotensi di bawah kontras WCAG AA 4,5:1.

---

## 6. Tabel Rekonsiliasi Angka Utama

| Item | Yang tampil di dashboard | Nilai benar dari data | Status |
|---|---|---|---|
| Median P0 nasional | 10,46% | 10,455% → 10,46% | Cocok |
| Rasio disparitas | 17,50× | 41,66 / 2,38 = 17,50× | Cocok |
| Kantong akut P0 ≥ 20% | 61 | 61 | Cocok |
| Kantong akut Timur | **0,0% (0 dari 61)** | **86,9% (53 dari 61)** | **Salah** |
| Titik strip plot | diklaim 514 | **410 terplot** | **Salah** |
| Pengeluaran Klaster 1 | **Rp0,01 jt** | **Rp14,60 jt** | **Salah 1.000×** |
| Resource curse | 17 daerah | **29 daerah** | **Basi** |
| OLS sanitasi | -0,209 (narasi) | -0,190 (chart/JSON) | **Tidak konsisten** |
| Korelasi air | -0,42 (narasi) | -0,373 | **Basi** |
| Korelasi log PDRB | -0,36 / -0,24 | -0,527 | **Basi** |
| Pamekasan P0 | 14,60 (narasi) | 15,30 | **Basi** |
| Mimika P0 | 14,29 (narasi) | 14,17 | **Basi** |
| Bojonegoro P0 | 12,28 (narasi) | 13,27 | **Basi** |
| Teluk Bintuni P0 | 29,38 (narasi) | 29,79 | **Basi** |
| Klaster 4 min P0 | 15,31 (policy matrix) | 7,09 | **Basi** |
| Anomali multivariat | 26 | 26 | Cocok |
| Outlier Tukey P0 | dihitung dinamis | 35 | Cocok (README salah) |
| Join peta provinsi | 34 provinsi | 34/34 exact match | Cocok |
| Kaggle 98,83% | 98,83% (508/514) | 98,83% dengan threshold 6.250 | Cocok, tetapi frozen |

---

## 7. Daftar Mockup / Hardcoded / Placeholder

**Benar-benar mockup:**

- Garis tren di `WorkingPoorScatter.tsx` — koordinat hardcoded, bukan fitted regression.

**Hardcoded tetapi nilainya benar saat snapshot:**

- `NATIONAL_BENCHMARKS`, `CLUSTERS`, `QUADRANTS` di `constants/benchmarks.ts`.
- Silhouette/DBI/ARI di halaman 3.
- Angka 98,83% dan 508/514 di halaman 5.
- Median P0 `10,46` dan V_struc `0,2720` di matriks 2x2 dan histogram.
- Korelasi `+0,462` di judul Working Poor.
- Narasi 86,9% dan 13,1% di `paradoxes.ts`.

**Hardcoded dan sudah basi/tidak konsisten:**

- Resource curse 17 vs 29.
- Koefisien OLS di `paradoxes.ts`.
- Korelasi air dan log PDRB.
- Sebagian evidence Madura dan resource curse.
- Profil numerik policy matrix.
- Klaster dan outlier di `dashboard/README.md`.

**Placeholder / belum diimplementasikan:**

- Filter pulau/provinsi/klaster/kuadran/rentang P0: setter ada, UI tidak ada.
- Click-to-filter dari chart ke tabel.
- Peta sudah diimplementasikan (bukan placeholder lagi), tetapi baru pada level provinsi; poligon distrik belum dipakai.
- `indonesia-districts-simple.geojson` (502 fitur) dan `indonesia-34-provinces.geojson` belum dipakai; keduanya di-gitignore.

---

## 8. Kepatuhan terhadap AGENTS.md dan Design Guide

| Aturan | Status | Catatan |
|---|---|---|
| Tidak ada supervised classification | Patuh | Label biner tidak ada di processed/frontend |
| P0 tidak masuk fitur clustering | Patuh | `poverty_clusters.csv` tidak memuat P0 sebagai fitur model |
| Tidak drop anomali | Patuh | 26 anomali dipertahankan |
| Random seed 42 | Tidak diaudit ulang | Di luar cakupan dashboard |
| Larangan radar chart | Patuh | Tidak ditemukan radar chart |
| Larangan boxplot di layar utama | Patuh | Boxplot hanya di halaman 5 |
| Palette Okabe-Ito | Sebagian | Encoding utama patuh; heatmap dan badge UI memakai warna tambahan |
| Filter global konsisten | **Belum** | Hanya search + pin |
| Ekspor CSV terfilter | Berfungsi | Namun label unit pengeluaran salah |
| Bahasa Indonesia untuk UI | Patuh | Istilah teknis tetap Inggris |

---

## 9. Verifikasi yang Dilakukan

### 9.1 Kompilasi TypeScript

```powershell
cd dashboard
npx tsc --noEmit
```

**Hasil:** exit code 0, tanpa error. Perlu dicatat: lolosnya TypeScript tidak menjamin kontrak JSON benar (lihat F-04).

### 9.2 Rekonsiliasi data

```powershell
python -c "import pandas as pd; df=pd.read_csv('data/processed/poverty_clusters.csv'); print(df.shape)"
```

**Hasil:** `(514, 21)`.

```powershell
python -c "import pandas as pd; df=pd.read_csv('data/processed/poverty_clusters.csv'); print((df.poverty_rate_p0>=20).sum()); print(df[df.poverty_rate_p0>=20].region_pulau.value_counts())"
```

**Hasil:** `61`; `Maluku & Papua 38`, `Bali & Nusa Tenggara 15`, `Sumatera 5`, `Jawa 3`.

```powershell
python -c "import pandas as pd; df=pd.read_csv('data/processed/poverty_clusters.csv'); print(len(df[(df.grdp_constant_million_idr>=25000000)&(df.poverty_rate_p0>=10.46)]))"
```

**Hasil:** `29`.

```powershell
python -c "import json; j=json.load(open('dashboard/public/data/poverty_districts.json')); islands=['Jawa','Sumatera','Kalimantan','Sulawesi','Bali-Nusa Tenggara','Maluku-Papua']; print(len([d for d in j if d['region_pulau'] in islands]))"
```

**Hasil:** `410` dari `514`.

### 9.3 Verifikasi join peta

```powershell
python -c "import json,pandas as pd; j=json.load(open('dashboard/public/data/indonesia-provinces.geojson')); names=[f['properties'].get('name') for f in j['features']]; df=pd.read_csv('data/processed/poverty_clusters.csv'); print(len(set(names)&set(df.provinsi.unique())))"
```

**Hasil:** `34` dari 34 provinsi cocok exact.

### 9.4 Verifikasi formatter

```powershell
python -c "print(14596/1_000_000, 14596/1_000)"
```

**Hasil:** `0.014596` (menghasilkan `Rp0,01 jt`) vs `14.596` (seharusnya `Rp14,60 jt`).

### 9.5 Verifikasi label Kaggle

```powershell
python -c "import pandas as pd; df=pd.read_csv('data/raw/Klasifikasi Tingkat Kemiskinan di Indonesia.csv'); p0=df.iloc[:,2]; exp=df.iloc[:,4]; san=df.iloc[:,7]; y=df['Klasifikasi Kemiskinan']==1; r=(p0>20)|((exp<=6250)&(san<=56)); print((r==y).sum(), len(df))"
```

**Hasil:** `508 514` → 98,83% dengan threshold yang benar.

### 9.6 Status build

`dashboard/dist` terakhir dibangun 2 Nov 2026 23:11 dan sudah memuat `indonesia-provinces.geojson`. Namun audit ini tidak menjalankan `npm run build` ulang agar tidak menimpa artefak.

---

## 10. Rekomendasi Prioritas

### P0 — Perbaiki sebelum presentasi/demo

1. **Samakan nama region** di `ArchipelagoStripPlot`, `ISLAND_REGIONS`, `useFilteredDistricts`, dan exporter. Tambahkan tes jumlah titik = 514.
2. **Perbaiki exporter kantong akut Timur** dan regenerasi `national_benchmarks.json`; tambahkan assertion total Timur + Barat = 61.
3. **Perbaiki formatter pengeluaran** dan semua label unit terkait (kartu, tabel, CSV, peta, ranking).
4. **Selaraskan kontrak `cluster_summary.json`** dengan tipe/halaman, atau ubah halaman untuk memakai key JSON yang sebenarnya.

### P1 — Perbaiki konsistensi narasi

5. Ganti semua narasi statis dengan nilai yang dihitung dari payload: resource curse, OLS, korelasi, jumlah kuadran, jumlah klaster.
6. Ganti garis tren mock di Working Poor dengan regresi yang dihitung dari data.
7. Pisahkan label “nasional” dan “subset terfilter”; hitung ulang N, jumlah provinsi, dan baseline z-score.
8. Implementasikan panel filter global atau turunkan klaimnya di README/design.

### P2 — Perbaikan teknis dan dokumentasi

9. Reset pagination tabel saat filter berubah.
10. Fetch `kaggle_rule_info.json`; perbaiki threshold menjadi `6250`; hitung dari raw data.
11. Tambahkan langkah regenerasi policy matrix ke pipeline.
12. Tambahkan validasi skema runtime untuk semua payload.
13. Regenerasi README/design agar cocok dengan data dan fitur aktual.
14. Tambahkan unit test untuk region mapping, formatter, dan kontrak JSON; pertimbangkan smoke test Playwright untuk lima halaman.

---

## 11. Batasan Audit

- Tidak ada pengujian visual di browser; temuan layout/aksesibilitas bersifat statis.
- Angka “benar” mengacu pada `data/processed/poverty_clusters.csv` per 2 Nov 2026 21:18 dan payload per 22:49. Jika pipeline dijalankan ulang, angka dapat berubah.
- Peta choropleth baru ditambahkan pada commit `a0c0f77`; audit mencakup implementasinya, tetapi tidak menguji interaksi zoom/klik secara langsung.
- `policy_recommendations_matrix.csv` adalah konten kurasi; audit hanya memeriksa konsistensi numeriknya, bukan validitas normatif rekomendasi kebijakan.

---

## 12. Referensi File Utama

- `dashboard/src/hooks/useDashboardData.ts`
- `dashboard/src/hooks/useFilteredDistricts.ts`
- `dashboard/src/components/charts/ArchipelagoStripPlot.tsx`
- `dashboard/src/components/charts/WorkingPoorScatter.tsx`
- `dashboard/src/components/charts/IndonesiaChoroplethMap.tsx`
- `dashboard/src/components/charts/SpatialRankingBar.tsx`
- `dashboard/src/components/charts/DistributionHistogram.tsx`
- `dashboard/src/components/charts/VulnerabilityMatrix2x2.tsx`
- `dashboard/src/pages/01_PovertyLandscape.tsx`
- `dashboard/src/pages/02_IndicatorMap.tsx`
- `dashboard/src/pages/03_RegionalProfiles.tsx`
- `dashboard/src/pages/04_PriorityImplications.tsx`
- `dashboard/src/pages/05_MethodologyAudit.tsx`
- `dashboard/src/constants/benchmarks.ts`
- `dashboard/src/constants/paradoxes.ts`
- `dashboard/src/utils/formatters.ts`
- `dashboard/src/utils/csvExport.ts`
- `scripts/export_dashboard_payload.py`
- `dashboard/public/data/national_benchmarks.json`
- `dashboard/public/data/cluster_summary.json`
- `dashboard/public/data/poverty_districts.json`
- `data/processed/poverty_clusters.csv`
- `data/processed/policy_recommendations_matrix.csv`
