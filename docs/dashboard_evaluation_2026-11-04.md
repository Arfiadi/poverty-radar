# Evaluasi Tampilan Dashboard PovertyRadar SDGs

**Tanggal evaluasi:** 4 November 2026  
**Cakupan:** 5 halaman dashboard + shell global (Sidebar, TopBar, footer, state management)  
**Basis evaluasi:** `docs/design.md` v4.1, `docs/ui_brief_mockup.md`, `AGENTS.md`, kode aktual di `dashboard/src/`, dan payload di `dashboard/public/data/`  
**Sifat evaluasi:** Audit baca-kode + verifikasi data. Tidak ada perubahan kode yang dilakukan.  
**Catatan penting:** Evaluasi dilakukan terhadap **working tree saat ini**, yang memuat perubahan belum di-commit pada hampir seluruh komponen dashboard. Temuan karena itu menggambarkan kondisi working tree, bukan `HEAD`.

---

## 1. Ringkasan Eksekutif

Dashboard ini secara **visual dan naratif sudah kuat**: alur 5 babak terbaca, pemilihan grafik utama sesuai kaidah (tanpa radar/pie chart), palet Okabe-Ito konsisten, dan klaim metodologis (nol target leakage, P0 sebagai benchmark eksternal) dijaga dengan baik. Build produksi juga lulus (`tsc && vite build`, 14,2 detik).

Namun, terhadap **spesifikasi desain dan Definition of Done**, kesiapan produk berada di sekitar **2,6 / 5,0**. Tiga kelas masalah paling berdampak:

1. **Konsistensi state filter antar-halaman belum utuh.** Filter kuadran global bertabrakan dengan state lokal Halaman 4, sehingga kombinasi normal (pilih Kuadran II di TopBar) menghasilkan tabel kosong dan matriks yang hampir seluruhnya diredupkan. Pin studi kasus juga diimplementasikan sebagai filter destruktif global, bukan penyorotan lokal, sehingga state `dimming 0.15` yang diwajibkan desain tidak pernah muncul untuk 2 dari 3 pin.
2. **Prinsip "zero hardcoded values" dilanggar sistematis.** Metrik inti Halaman 3 dan 5, badge Halaman 1, anotasi korelasi Halaman 2, dan median matriks Halaman 4 ditulis sebagai literal. Akibatnya beberapa angka berubah menjadi salah saat filter aktif — contoh paling jelas: badge "70% Kota Modern" tetap tampil padahal default Top 5 hanya 60% Kota, dan tetap "100% Papua" meski filter aktif bukan Papua.
3. **Aksesibilitas dan responsivitas belum memenuhi standar yang ditetapkan sendiri.** Di bawah breakpoint `lg` (1024 px) seluruh kontrol filter hilang tanpa alternatif drawer; sidebar tetap 232 px; header tabel tidak dapat diurutkan dengan keyboard; modal tidak memiliki focus trap; dan beberapa label grafik gagal kontras WCAG AA.

**Verdict:** layak untuk demo terpandu (guided demo) pada desktop, tetapi **belum memenuhi Definition of Done** untuk digunakan mandiri oleh audiens non-teknis, khususnya pada layar kecil dan saat eksplorasi filter.

### Skor ringkas

| Area | Skor berbobot (1–5) | Status |
| :--- | :---: | :--- |
| Shell global (navigasi, filter, footer) | **2,30** | Perlu perbaikan |
| Halaman 1 — Lanskap Makro | **2,85** | Cukup, perlu perbaikan |
| Halaman 2 — Peta & Indikator | **2,55** | Cukup, perlu perbaikan |
| Halaman 3 — Profil Klaster | **2,10** | Perlu perbaikan |
| Halaman 4 — Matriks & Prioritas | **2,50** | Cukup, perlu perbaikan |
| Halaman 5 — Metodologi & Data | **3,00** | Cukup baik |
| **Rata-rata 5 halaman** | **2,60** | **Belum memenuhi DoD** |

Skor menilai **kepatuhan terhadap spesifikasi**, bukan kualitas estetika. Polish visual (tipografi mikro, kartu, spacing) justru menjadi salah satu penyebab turunnya skor karena menyimpang dari skala tipografi yang ditetapkan.

---

## 2. Objektif dan Fungsi Setiap Halaman

### 2.1 Shell global

| Elemen | Fungsi yang dimaksud | Kondisi aktual |
| :--- | :--- | :--- |
| Sidebar | Navigasi 5 babak + status filter aktif | Navigasi babak berfungsi; tidak ada panel filter; lebar tetap 232 px / 68 px |
| TopBar | Filter global (pulau, provinsi, klaster, kuadran, P0, pencarian), reset, indikator cakupan | Pulau/klaster/kuadran/pencarian/reset ada; provinsi & P0 tidak ada; seluruhnya tersembunyi < 1024 px |
| Filter chips | Umpan balik filter aktif + hapus per-filter | Berfungsi untuk pulau/klaster/kuadran/pencarian/pin |
| Footer | Atribusi sumber data | Berfungsi |

### 2.2 Lima halaman

| Halaman | Pertanyaan inti | Fungsi dalam cerita | Visual primer | Aksi eksplorasi | Kriteria sukses halaman |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Poverty Landscape** | Seberapa parah jurang disparitas dan di mana konsentrasinya? | *The Hook* — menghentak dalam 3 detik | Jittered strip plot 6 kepulauan + leaderboard Top 5/10 | Buka modal 514 daerah, tab wawasan | Audiens langsung paham 17,50x, median 10,46%, dan konsentrasi timur |
| **2. Poverty & Indicator Map** | Di mana pola geografisnya, dan mengapa pengangguran tidak searah kemiskinan? | *The Geography* — dualisme & working poor | Choropleth 34 provinsi (7 indikator) / ranking bar | Ganti indikator, drill-down provinsi, ganti mode peta/ranking | Dualisme kabupaten–kota dan paradoks TPAK terbaca tanpa penjelasan lisan |
| **3. Regional Profiles** | Apa karakteristik tiap kelompok daerah? | *The Archetypes* — tipologi tanpa target leakage | Small multiples Z-score / heatmap 28 sel | Ganti tampilan small multiples ↔ heatmap | 4 arketipe terbedakan, metrik kualitas model jujur, P0 tetap eksternal |
| **4. Priority & Implications** | Wilayah mana yang layak dianalisis lebih lanjut? | *The Call to Action* — penapisan prioritas | Matriks 2x2 P0 × V_struc + case pins | Pilih kuadran, pin kasus, buka policy brief, ekspor CSV | Pengguna dapat mengisolasi kuadran/kasus dan membaca rekomendasi yang sesuai |
| **5. Methodology & Data** | Bagaimana temuan diperoleh dan apa yang tidak dapat disimpulkan? | *The Integrity* — transparansi | Tab OLS / Kaggle / boundary / prinsip | Pindah tab, baca kamus data | Auditor dapat mereproduksi klaim dan melihat batas data |

**Temuan struktural:** urutan babak dan pertanyaan inti sudah selaras dengan `design.md §1.4`. Masalahnya bukan pada konsep cerita, melainkan pada **eksekusi state dan konsistensi angka** yang membuat cerita bisa berubah makna saat difilter.

---

## 3. Kriteria Evaluasi (Ditetapkan Sebelum Penilaian)

Kriteria diturunkan dari `design.md §2.3`, `§2.5`, `§2.6`, `§5`, `§7`, `§13`, dan `ui_brief_mockup.md §4`. Setiap kriteria diberi bobot berdasarkan dampaknya terhadap kemampuan audiens memahami dan memercayai dashboard.

| Kode | Kriteria | Definisi operasional | Cara verifikasi | Bobot |
| :--- | :--- | :--- | :--- | :---: |
| **C1** | Kejelasan narasi & kesesuaian objektif | Halaman menjawab satu pertanyaan inti; ada action title; pesan terbaca dalam 3 detik → 30 detik → 3 menit | Baca struktur heading, action title, callout, urutan visual | 15% |
| **C2** | Ketepatan pemilihan & encoding grafik | Tipe grafik sesuai `§3.1`; arah warna benar; zero baseline; garis referensi ada; tidak ada radar/pie | Inspeksi opsi ECharts, legenda, arah sumbu | 15% |
| **C3** | Integritas & dinamika data | Tidak ada snapshot hardcoded untuk metrik agregat; denominator konsisten; tidak ada fallback senyap yang menampilkan angka salah | Bandingkan literal di kode dengan payload JSON/CSV; uji logika filter | 20% |
| **C4** | Konsistensi interaksi & state | Filter global berlaku seragam; klik-ke-filter; pin menyorot bukan menghapus; reset aman; state bertahan antar-halaman | Telusuri store, hook filter, handler per halaman | 15% |
| **C5** | Hierarki visual & tipografi | Skala H1 28–32 px, action title 20–22 px, KPI 32–36 px, body 14–15 px, caption 11–12 px; top-left anchor | Bandingkan kelas Tailwind aktual dengan `§5.4` | 10% |
| **C6** | Aksesibilitas | Kontras WCAG AA; keyboard; ARIA; tidak bergantung warna; reduced motion | Inspeksi atribut, warna hex, handler keyboard | 10% |
| **C7** | Responsivitas | ≥1280, 1024–1279, 768–1023, <768 sesuai `§2.4`; filter tetap dapat diakses | Inspeksi breakpoint class & struktur layout | 5% |
| **C8** | Defensive states | Loading, empty, data unavailable, geo fallback, pin highlight, small sample | Inspeksi `DefensiveStates`, handler error, kondisi n=0/n<2 | 5% |
| **C9** | Performa & maintainability | Bundle wajar; payload tidak berlebihan; tidak ada dead code; ada uji regresi UI | `npm run build`; grep import; daftar tes | 5% |

### 3.1 Skala penilaian

| Nilai | Arti |
| :---: | :--- |
| **5** | Memenuhi seluruh spesifikasi; tidak ada temuan berarti |
| **4** | Memenuhi spesifikasi inti; hanya temuan kosmetik |
| **3** | Fungsi utama berjalan; ada penyimpangan yang terlihat tetapi tidak menyesatkan |
| **2** | Penyimpangan material; sebagian tugas pengguna terhambat atau angka berpotensi menyesatkan |
| **1** | Tidak memenuhi; tugas inti gagal atau data yang ditampilkan salah |

### 3.2 Tingkat keparahan temuan

| Level | Definisi |
| :--- | :--- |
| **Critical** | Menghasilkan UI kosong/salah pada penggunaan normal, atau melanggar constraint metodologis keras |
| **High** | Secara material menyesatkan atau menghambat tugas inti |
| **Medium** | Menurunkan pemahaman/akses, tetapi ada jalan pintas |
| **Low** | Polish, konsistensi, atau utang teknis |

---

## 4. Matriks Skor per Halaman

| Kriteria (bobot) | Global | H1 | H2 | H3 | H4 | H5 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| C1 Narasi (15%) | 3 | 4 | 4 | 3 | 4 | 4 |
| C2 Grafik (15%) | 3 | 3 | 3 | 2 | 4 | 4 |
| C3 Data (20%) | 2 | 2 | 2 | 1 | 2 | 2 |
| C4 Interaksi (15%) | 2 | 3 | 2 | 2 | 1 | 3 |
| C5 Tipografi (10%) | 2 | 2 | 2 | 2 | 2 | 2 |
| C6 Aksesibilitas (10%) | 2 | 3 | 3 | 3 | 2 | 3 |
| C7 Responsif (5%) | 1 | 2 | 2 | 2 | 2 | 3 |
| C8 Defensive (5%) | 3 | 4 | 2 | 2 | 3 | 3 |
| C9 Performa (5%) | 2 | 3 | 2 | 3 | 2 | 3 |
| **Total berbobot** | **2,30** | **2,85** | **2,55** | **2,10** | **2,50** | **3,00** |

---

## 5. Temuan per Area

### 5.0 Shell global

#### G-01 · Critical · Filter kuadran global vs state lokal Halaman 4 tidak sinkron

**Bukti**
- `dashboard/src/store/useFilterStore.ts:8,54` — `selectedQuadrant` global.
- `dashboard/src/components/layout/TopBar.tsx:173-190` — dropdown menulis `selectedQuadrant` global.
- `dashboard/src/pages/04_PriorityImplications.tsx:33` — Halaman 4 memakai state lokal `selectedQuadrantCode` dengan default `'Q1'`.
- `dashboard/src/pages/04_PriorityImplications.tsx:58-63,90-100` — pemilihan kuadran di halaman hanya mengubah state lokal; tabel memfilter ulang berdasarkan kode lokal.
- `dashboard/src/hooks/useFilteredDistricts.ts:46` — data sudah difilter global sebelum masuk halaman.

**Dampak:** Pengguna memilih "Q2 · Kerentanan Tersembunyi" di TopBar. Data yang diterima Halaman 4 hanya 95 daerah Q2, tetapi tabel tetap memfilter `Q1` → **0 baris**; matriks meredupkan semua titik Q2 (`opacity 0.15`) karena `activeQuadrantCode='Q1'`. Ini adalah kombinasi filter yang wajar, bukan kasus tepi.

**Perbaikan:** Jadikan `selectedQuadrant` global sebagai satu-satunya sumber kebenaran. Halaman 4 membaca/menulis store (`setSelectedQuadrant`), dan default-nya `'all'`. Jika ingin default fokus Q1, lakukan sebagai *initial state* yang juga menulis store, bukan state terpisah.

#### G-02 · High · Case-study pin berperilaku sebagai filter destruktif, bukan penyorotan

**Bukti**
- `dashboard/src/hooks/useFilteredDistricts.ts:20-28` — pin `resource_curse` dan `madura` **membuang** semua distrik non-target sebelum halaman dirender.
- `dashboard/src/components/charts/VulnerabilityMatrix2x2.tsx:58-71` — logika `opacity 0.15` untuk non-target ada, tetapi tidak pernah tercapai karena data non-target sudah hilang.
- Pin `barito_kuala` tidak difilter di hook (`useFilteredDistricts.ts:21-28` hanya menangani dua pin), sehingga hanya pin ini yang benar-benar memperlihatkan efek dimming.

**Dampak:** Melanggar `design.md §2.5 poin 5` dan `§7 Halaman 4` (titik target membesar, titik lain meredup). Pengguna juga kehilangan konteks 514 daerah saat pin aktif, dan pin ikut memfilter Halaman 1–3 serta 5 karena state-nya global.

**Perbaikan:** Pisahkan `activeCasePin` (lens/highlight) dari filter data. Hook filter tidak boleh membuang baris karena pin; matriks dan tabel menerima seluruh data lalu menyorot target. Jika pin dimaksudkan sebagai filter global, beri label eksplisit "Filter kasus" dan sediakan tombol kembali yang jelas.

#### G-03 · High · `Escape` mereset filter saat modal ditutup

**Bukti**
- `dashboard/src/components/layout/TopBar.tsx:40-56` — listener `window` mereset filter pada `Escape` bila `isFiltered`.
- `dashboard/src/components/modals/DistrictsDataModal.tsx:13-23`, `PlanningCycleModal.tsx:10-20`, `PolicyBriefModal.tsx:20-30` — listener `window` lain menutup modal pada `Escape`.
- Tidak ada `stopPropagation`, pengecekan `event.defaultPrevented`, atau penanda modal terbuka.

**Dampak:** Menutup modal dengan `Esc` juga menghapus seluruh filter yang sedang aktif. Pengguna kehilangan konteks kerja tanpa peringatan.

**Perbaikan:** Kelola `Escape` di satu tempat (mis. level App) dengan prioritas: tutup modal → blur search → reset filter. Atau hentikan propagasi di handler modal dan tambahkan guard `if (document.querySelector('[role="dialog"]')) return;`.

#### G-04 · High · Tidak ada akses filter di bawah 1024 px; sidebar tidak responsif

**Bukti**
- `dashboard/src/components/layout/TopBar.tsx:131` — seluruh grup filter (pulau, klaster, kuadran, pencarian, reset) dibungkus `hidden lg:flex`.
- `dashboard/src/components/layout/Sidebar.tsx:76-80` — `aside` selalu dirender dengan lebar 232 px atau 68 px; tidak ada drawer/overlay.
- Tidak ada tombol hamburger filter di mana pun.

**Dampak:** Pada tablet dan ponsel, pengguna **tidak dapat memfilter sama sekali**, padahal `design.md §2.4` mewajibkan drawer/hamburger dan filter tetap dapat diakses. Sidebar 232 px di layar 375 px menyisakan ~143 px untuk konten.

**Perbaikan:** Tambahkan drawer filter untuk `< lg` (tombol di TopBar), dan ubah sidebar menjadi off-canvas di `< md`. Pastikan filter chips tetap terlihat agar state aktif tidak "hilang".

#### G-05 · High · Prinsip zero hardcoded values dilanggar lintas halaman

**Bukti (contoh utama)**
- `dashboard/src/pages/03_RegionalProfiles.tsx:63-69` — Silhouette 0.2028, DBI 1.4522, ARI 0.9803.
- `dashboard/src/pages/05_MethodologyAudit.tsx:57-58,66,75` — 98.83%, 508/514, ARI, R² 51.64%.
- `dashboard/src/pages/01_PovertyLandscape.tsx:287,322,357,364,369` — "100% Papua", "70% Kota Modern", 86.9%, 391, 17.50x.
- `dashboard/src/components/charts/VulnerabilityMatrix2x2.tsx:20-21` — median P0 10.46 dan V_struc 0.2720.
- `dashboard/src/components/charts/WorkingPoorScatter.tsx:25` — `r = 0.462` sebagai default.
- `dashboard/src/components/charts/ArchipelagoStripPlot.tsx:74` — median nasional 10.46.

**Dampak:** Melanggar `design.md §2.3 poin 8` dan DoD butir 2. Beberapa nilai tetap benar secara nasional, tetapi menjadi **salah begitu filter aktif** (lihat P1-01/P1-02). Nilai lain (R²) tidak memiliki payload sama sekali sehingga tidak dapat diverifikasi ulang.

**Perbaikan:** Tambahkan field yang hilang ke payload (`r_squared`, `silhouette`, `dbi`, `ari`, `kaggle_rule`) dan hitung semua turunan dari `districts`/`benchmarks` saat runtime. Literal hanya boleh untuk konstanta kebijakan (mis. ambang RPJMN 7,0%), bukan untuk hasil observasi.

#### G-06 · Medium · Filter provinsi dan rentang P0 tidak memiliki kontrol UI

**Bukti**
- `dashboard/src/store/useFilterStore.ts:56,62,66` — `selectedProvince` dan `p0Range` ada beserta setter.
- `dashboard/src/hooks/useFilteredDistricts.ts:36-38,51-53` — keduanya dipakai untuk memfilter.
- Pencarian `setSelectedProvince|setP0Range` di `dashboard/src` hanya menemukan definisi store; tidak ada pemanggil di komponen.

**Dampak:** Dua dari tujuh parameter filter global di `design.md §8.3` tidak dapat digunakan. `p0Range` juga tidak punya representasi chip, sehingga `hasActiveFilters` bisa bernilai true tanpa cara mengubahnya.

**Perbaikan:** Tambahkan select provinsi hierarkis (mengikuti pulau) dan slider/dual-input rentang P0 di panel filter, plus chip-nya.

#### G-07 · Medium · Empty state level App menyembunyikan Halaman 5

**Bukti**
- `dashboard/src/App.tsx:73-75` — jika `filteredDistricts.length === 0`, seluruh konten diganti `EmptyResultState`, termasuk Halaman 5 (metodologi).
- `design.md §13` — "Halaman Data & Method dapat diakses dengan mudah dari seluruh layar dashboard."

**Dampak:** Auditor tidak dapat membuka metodologi saat filter menghasilkan 0 baris — justru situasi ketika penjelasan metodologi paling dibutuhkan.

**Perbaikan:** Terapkan empty state per-halaman analitis (1–4), tetapi biarkan Halaman 5 tetap render dengan banner "tidak ada subset data; menampilkan metadata global".

#### G-08 · Medium · Pemuatan data all-or-nothing dan validasi response tidak merata

**Bukti**
- `dashboard/src/hooks/useDashboardData.ts:117-131` — enam `fetch` dijalankan paralel; hanya `districtsRes.ok` yang diperiksa.
- Jika salah satu payload sekunder 404/HTML, `.json()` melempar error dan **seluruh dashboard** masuk state error (`useDashboardData.ts:165-167`).
- `validateDataContracts` hanya memberi `console.warn`, tidak menurunkan UI ke state "data unavailable".

**Dampak:** Satu file JSON opsional (mis. `boundary_cases.json`) dapat mematikan seluruh dashboard. `design.md §2.5 poin 3` meminta state "data unavailable" per indikator, bukan kegagalan total.

**Perbaikan:** Periksa `res.ok` untuk semua response; gunakan `Promise.allSettled`; render halaman yang datanya tersedia dan tampilkan state parsial untuk yang gagal.

#### G-09 · Medium · Tidak ada error boundary untuk lazy chunk

**Bukti**
- `dashboard/src/App.tsx:10-14,111-114` — `React.lazy` + `Suspense` tanpa `ErrorBoundary`.

**Dampak:** Kegagalan memuat chunk halaman (jaringan lambat, deploy baru) menghasilkan layar putih, bukan pesan pemulihan.

**Perbaikan:** Bungkus `Suspense` dengan error boundary yang menampilkan tombol "Muat ulang bagian ini".

#### G-10 · Low · URL hanya menyimpan babak, bukan filter

**Bukti**
- `dashboard/src/store/useFilterStore.ts:68-75` — hanya `act` yang ditulis ke query string.

**Dampak:** Tautan yang dibagikan tidak mereproduksi tampilan terfilter; menyulitkan kolaborasi dan QA.

**Perbaikan:** Sinkronkan filter utama (pulau, klaster, kuadran, pencarian) ke query string.

#### G-11 · Low · Sejumlah kelas Tailwind v4 tidak menghasilkan CSS di Tailwind v3.4

**Bukti**
- `dashboard/package.json` — `tailwindcss ^3.4.14`.
- Contoh kelas yang tidak ada di v3: `shadow-2xs` (`KpiCard.tsx:52`, `TopBar.tsx:103`, dst.), `shadow-xs`, `focus:outline-hidden` (`TopBar.tsx:141,159,178,203`), `backdrop-blur-xs` (`TopBar.tsx:233`, modal), `animate-in fade-in zoom-in-95` (`DistrictsDataModal.tsx:32,37`, `PlanningCycleModal.tsx:69`, `PolicyBriefModal.tsx:141`), `py-0.2` (`01_PovertyLandscape.tsx:286,295,321,330`).

**Dampak:** Shadow, animasi masuk modal, dan blur yang dirancang tidak pernah tampil. `py-0.2` membuat padding vertikal nol. Tidak merusak data, tetapi mengurangi kesan kualitas dan konsistensi dengan mockup.

**Perbaikan:** Ganti ke utilitas v3 (`shadow-sm`, `outline-none`, `backdrop-blur-sm`) atau pasang `tailwindcss-animate`; ganti `py-0.2` dengan `py-0.5`.

#### G-12 · Low · Tidak menghormati `prefers-reduced-motion`

**Bukti**
- Tidak ada `useReducedMotion`/media query di `dashboard/src`; `framer-motion` dipakai di semua halaman (`initial/animate/transition`).

**Dampak:** Pengguna dengan sensitivitas gerak tetap mendapat transisi.

**Perbaikan:** Gunakan `useReducedMotion()` dari framer-motion dan matikan transisi bila aktif.

---

### 5.1 Halaman 1 — Poverty Landscape

**Fungsi:** hook makro; berhasil. KPI utama adaptif terhadap filter (`01_PovertyLandscape.tsx:95-174`), strip plot menjadi visual primer yang tepat, dan leaderboard memberi konteks ekstrem.

#### P1-01 · High · Badge "70% Kota Modern" hardcoded dan salah pada default

**Bukti**
- `dashboard/src/pages/01_PovertyLandscape.tsx:22` — default `leaderboardScope = 'top5'`.
- `dashboard/src/pages/01_PovertyLandscape.tsx:322` — badge literal `70% Kota Modern`, tidak bergantung pada `leaderboardScope` maupun `districts`.

**Verifikasi data:** Dari `data/processed/poverty_clusters.csv`, 5 daerah termiskin terendah berisi 3 Kota (Sawah Lunto, Tangerang Selatan, Depok) = **60%**, bukan 70%. Top 10 berisi 7 Kota = 70%. Jadi badge benar hanya untuk Top 10, tetapi default halaman adalah Top 5.

**Dampak:** Klaim kecil namun terlihat; bertentangan dengan daftar tepat di bawahnya. Saat filter aktif (mis. Jawa), badge tetap 70% meski komposisi berubah total.

**Perbaikan:** Hitung `displayedLowest.filter(d => d.tipe_wilayah === 'Kota').length / displayedLowest.length` dan tampilkan persentasenya; begitu pula badge "100% Papua" (`:287`) yang harus dihitung dari `displayedHighest`.

#### P1-02 · High · Narasi dan rentang hardcoded tidak mengikuti filter

**Bukti**
- `dashboard/src/pages/01_PovertyLandscape.tsx:106` — "Rentang: 2.38% (Sawahlunto) – 41.66% (Intan Jaya)".
- `:159` — "Kawasan barat menyumbang 13.1% (8 kantong 3T)".
- `:357` — "86.9% kantong akut berada di Timur ... Nias Barat (26.4%) dan Mentawai (14.8%)".
- `:364` — "391 daerah (76.1%) masih tertinggal ... 17.50x lipat".
- `:369` — "Intan Jaya (41.66%) vs Kota Sawahlunto (2.38%) = 17.50x Lipat".

**Dampak:** Saat pengguna memfilter "Jawa", panel tetap mengklaim 86.9% kantong akut di Timur dan 391 daerah tertinggal. Ini bukan sekadar snapshot: **narasi menjadi kontradiktif dengan KPI di atasnya** yang sudah dinamis.

**Perbaikan:** Turunkan seluruh kalimat dari `districts`/`benchmarks` (mis. `easternAcuteCount`, `targetRpjmnCount`, `dynamicDisparityRatio`). Untuk teks yang sengaja nasional, beri label eksplisit "Konteks nasional (tidak terfilter)".

#### P1-03 · Medium · Histogram distribusi P0 tidak ditampilkan

**Bukti**
- `dashboard/src/components/charts/DistributionHistogram.tsx` ada dan lengkap (termasuk tabel screen-reader), tetapi tidak diimpor di halaman mana pun (pencarian `DistributionHistogram` hanya menemukan definisinya).
- `design.md §10 A.2` dan `§7 Halaman 1` mewajibkan histogram sebaran P0.

**Dampak:** Bentuk distribusi (menceng kanan, ekor Intan Jaya) tidak terlihat; audiens hanya melihat titik dan Top 5/10. Ini melemahkan argumen "median menutupi ekor".

**Perbaikan:** Tempatkan histogram sebagai visual sekunder (atau tab pada panel kanan) dan hubungkan sorotan bin ke tabel/filter.

#### P1-04 · Medium · "Top 10" tersembunyi di dalam nested scroll 85 px

**Bukti**
- `dashboard/src/pages/01_PovertyLandscape.tsx:291,326` — daftar diberi `max-h-[85px] overflow-y-auto` saat `leaderboardScope === 'top10'`.
- Tinggi satu baris ±14 px (teks 10,5 px + `py-0.2`), sehingga hanya ±5 baris terlihat sekaligus.

**Dampak:** Menekan tombol "Top 10" tidak benar-benar memperlihatkan 10 daerah; pengguna harus menggulir area kecil di dalam panel. Ini menciptakan scroll bersarang (nested scroll) yang mudah terlewat, terutama pada trackpad/proyektor. Tujuan toggle — memperluas konteks — tidak tercapai dalam satu pandangan.

**Perbaikan:** Hilangkan batas tinggi (biarkan panel tumbuh) atau tampilkan 10 baris ringkas tanpa scroll; jika ruang terbatas, gunakan modal/daftar terpisah, bukan nested scroll.

#### P1-05 · Medium · Tipografi jauh di bawah skala yang ditetapkan

**Bukti**
- `dashboard/src/pages/01_PovertyLandscape.tsx:83` — heading halaman `text-sm` = 14 px (spesifikasi H1 28–32 px).
- `dashboard/src/components/common/KpiCard.tsx:80` — nilai KPI `text-xl sm:text-[22px]` = 20–22 px (spesifikasi 32–36 px).
- `KpiCard.tsx:67` — label 10–10,5 px (spesifikasi 13 px).
- `KpiCard.tsx:93-102` — benchmark/context 9,5–10,5 px (spesifikasi 12–13 px).
- Halaman 1 memakai `space-y-1.5`, `py-1.5`, `text-[9.5px]` secara agresif untuk "zero-scroll".

**Dampak:** Audiens lansia/non-teknis harus mengecilkan jarak baca; hierarki "3 detik" melemah karena angka utama tidak mendominasi. Ini penyimpangan paling terlihat dari mockup.

**Perbaikan:** Naikkan H1 ke `text-2xl`/`text-3xl`, KPI ke `text-3xl`/`text-4xl`, body ke `text-sm`/`text-base`, dan izinkan scroll vertikal (desain memang fluid, bukan poster).

#### P1-06 · Low · Label outlier hardcoded dapat menunjuk daerah yang tidak ada

**Bukti**
- `dashboard/src/components/charts/ArchipelagoStripPlot.tsx:119-125` — label Sawahlunto, Sampang, Nias Barat, Intan Jaya selalu dipasang, tanpa cek keberadaan di `districts`.

**Dampak:** Saat filter aktif dan daerah tersebut tidak ada, label dapat menempel pada posisi yang salah atau tidak muncul sama sekali, sementara teks tetap diklaim.

**Perbaikan:** Filter `OUTLIER_CONFIG` berdasarkan `districts.some(...)` dan sesuaikan label dengan nilai aktual.

---

### 5.2 Halaman 2 — Peta & Indikator

**Fungsi:** geography; berhasil secara konsep. Peta 34 provinsi dengan drill-down, toggle peta/ranking, 7 indikator dengan ambang kebijakan yang wajar (`02_IndicatorMap.tsx:55-135`), dan dua grafik paradoks sudah ada.

#### P2-01 · High · TPAK diwarnai sebagai indikator "baik" (biru) padahal tinggi = beban subsistensi

**Bukti**
- `dashboard/src/components/charts/IndonesiaChoroplethMap.tsx:195-197` — `isNegativeMetric` hanya `poverty_rate_p0` dan `unemployment_rate_tpt`.
- `:199-204` — TPAK masuk skala "positif": nilai tinggi → `#0072B2` (biru, "unggul"), nilai rendah → `#D55E00`.
- `:348-357` — `visualMap` hanya memberi label "Tinggi/Rendah"; warna tinggi mengikuti `colorScale`, yang untuk TPAK berakhir di `#0072B2` (biru "baik").

**Dampak:** Peta akan mewarnai Nduga/Lanny Jaya (TPAK >95%, P0 >37%) sebagai "biru unggul", bertentangan langsung dengan narasi *Working Poor* di halaman yang sama. Ini mis-encoding semantik yang serius untuk audiens yang membaca peta tanpa tooltip.

**Perbaikan:** Masukkan `labor_participation_tpak` ke metrik negatif dalam konteks ini, atau gunakan skala netral/diverging dengan legenda eksplisit "tinggi TPAK = tekanan kerja subsistensi".

#### P2-02 · Medium · Korelasi `r = +0.462` hardcoded pada judul dan anotasi

**Bukti**
- `dashboard/src/components/charts/WorkingPoorScatter.tsx:25` — `let r = 0.462` sebagai nilai awal.
- `:180` — teks "Korelasi positif (r = +0.462)" literal.
- `dashboard/src/pages/02_IndicatorMap.tsx:290-291` — callout juga literal 1.87x/1.82x dan r = +0.462.

**Dampak:** Scatter plot menghitung regresi dari subset (`:23-60`), tetapi judul tetap menampilkan korelasi nasional. Jika subset < 2 titik, `r` tetap 0.462 — angka fiktif.

**Perbaikan:** Hitung `r` aktual dan tampilkan `N/A` bila `n < 3`; gunakan nilai yang sama di judul, callout, dan tooltip.

#### P2-03 · Medium · Rasio dualisme jatuh ke angka nasional secara senyap

**Bukti**
- `dashboard/src/components/charts/TheGreatDualismBar.tsx:27-28` — `p0Ratio = kotaP0 > 0 ? ... : '1.87'`, `tptRatio = ... : '1.82'`.

**Dampak:** Jika filter menghapus semua Kota (atau semua Kabupaten), grafik menampilkan batang 0 tetapi rasio "1.87x/1.82x" dari konstanta. Pengguna membaca kesimpulan yang tidak berasal dari data yang ditampilkan.

**Perbaikan:** Tampilkan "N/A — tidak ada wilayah pembanding" dan state data-unavailable; jangan fallback ke angka nasional tanpa label.

#### P2-04 · Medium · Click-to-filter tidak benar-benar global

**Bukti**
- `dashboard/src/components/charts/IndonesiaChoroplethMap.tsx:84` — `selectedProvince` adalah state lokal peta.
- `:241,269,274` — klik provinsi hanya mengubah state lokal/drill-down.
- `design.md §2.6` — klik elemen harus memfilter tabel wilayah dan memperbarui kartu detail.

**Dampak:** Mengklik provinsi di peta tidak memfilter tabel/halaman lain, dan tidak muncul sebagai chip filter. Eksplorasi terasa terputus: peta punya "dunia" sendiri.

**Perbaikan:** Panggil `setSelectedProvince` global saat provinsi dipilih (dengan opsi "drill-down saja" terpisah), sehingga chip dan halaman lain ikut bereaksi.

#### P2-05 · Medium · GeoJSON fallback tidak otomatis

**Bukti**
- `dashboard/src/components/charts/IndonesiaChoroplethMap.tsx:690-696` — saat `loadError`, UI hanya menampilkan pesan "Gunakan tab 'Peringkat Batang 34 Provinsi' di atas".
- `design.md §2.5 poin 4` — fallback harus **otomatis** menampilkan ranking bar dengan label cakupan.

**Dampak:** Pengguna harus tahu ada tab lain; jika tidak, mereka melihat kotak kosong dan menyimpulkan data hilang.

**Perbaikan:** Render `SpatialRankingBar` langsung di dalam state error, dengan banner "Peta tidak tersedia — menampilkan peringkat 34 provinsi".

#### P2-06 · Low · Rasio "X lipat" untuk indikator non-P0 lemah secara statistik

**Bukti**
- `dashboard/src/pages/02_IndicatorMap.tsx:52,248` — `maxVal / minVal` ditampilkan sebagai "Disparitas X Lipat" untuk semua indikator, termasuk RLS dan TPT.

**Dampak:** Rasio dua persentase/indeks tidak bermakna sama dengan rasio P0; mis. "RLS 2,3x" menyesatkan. Untuk indikator dengan nilai minimum 0, hasilnya `null` dan jatuh ke rentang absolut — inconsistent.

**Perbaikan:** Batasi rasio pada P0; untuk indikator lain gunakan selisih absolut/poin persentase atau koefisien variasi.

#### P2-07 · Low · Preload 2,1 MB GeoJSON kabupaten saat halaman dibuka

**Bukti**
- `dashboard/src/components/charts/IndonesiaChoroplethMap.tsx:118-131` — `indonesia-districts-simple.geojson` (2,1 MB) di-fetch di background setiap kali peta mount, padahal drill-down mungkin tidak dipakai.
- `:103` — `indonesia-provinces.geojson` (478 KB) juga di-fetch.

**Dampak:** ~2,6 MB transfer tambahan pada koneksi lambat; memperlambat interaksi pertama di Halaman 2.

**Perbaikan:** Muat GeoJSON kabupaten saat pengguna pertama kali melakukan drill-down, bukan saat mount; gunakan cache `sessionStorage`/HTTP cache.

---

### 5.3 Halaman 3 — Profil Klaster

**Fungsi:** archetypes; konsepnya kuat (small multiples + heatmap, tanpa radar). Namun halaman ini memiliki **inkonsistensi data paling serius** setelah Halaman 4.

#### P3-01 · High · Kartu persona menampilkan angka nasional meski filter aktif

**Bukti**
- `dashboard/src/pages/03_RegionalProfiles.tsx:77-84` — `summary` berasal dari `clusterSummary` nasional (App melewatkan payload penuh, `App.tsx:86-92`).
- `:79-80` — `totalRegions` dan `pctNational` memakai `summary` (78/187/216/33), bukan `cDistricts.length`.
- `:81-84` — `meanP0/meanSan/meanRls/meanExp` memakai `summary.*_mean` bila tersedia, sehingga **tidak berubah** saat filter.

**Dampak:** Pengguna memfilter "Jawa"; grafik di bawah berubah, tetapi kartu di atas tetap mengklaim N=33 dan P0 29,5% untuk Klaster 4 — padahal mungkin tidak ada Klaster 4 di Jawa. Dua bagian halaman membicarakan populasi berbeda tanpa penjelasan.

**Perbaikan:** Hitung N dan mean dari `cDistricts` (subset terfilter) untuk kartu, atau beri label tegas "Profil nasional (tidak terfilter)" dan sediakan toggle "bandingkan dengan nasional".

#### P3-02 · High · Klaster kosong ditampilkan sebagai z = 0 (rata-rata nasional)

**Bukti**
- `dashboard/src/components/charts/ClusterHeatmap.tsx:46-48` — bila `cVals.length === 0`, `cMean` jatuh ke `s[f.key].mean`, sehingga `z = 0`.
- `dashboard/src/components/charts/SmallMultiplesZScore.tsx:43-44` — logika identik.
- `:59-60` — nama klaster tetap ditampilkan dengan N=0.

**Dampak:** Filter yang menghapus satu klaster membuat klaster itu tampil "persis rata-rata nasional" di semua 7 indikator. Itu klaim palsu, bukan state kosong. Melanggar `design.md §2.5 poin 3`.

**Perbaikan:** Untuk `cDistricts.length === 0`, kirim `null`/`'-'` dan render sel "Tidak ada data pada subset ini" (heatmap abu-abu, bar kosong), bukan 0.

#### P3-03 · High · Delta membandingkan **mean klaster** dengan **median nasional**

**Bukti**
- `dashboard/src/pages/03_RegionalProfiles.tsx:33-36` — baseline memakai `getMedian` (median).
- `:81-89` — nilai klaster memakai `summary.*_mean` (mean).
- `:111-113,120-122` — label "+X% vs Nas".

**Dampak:** Selisih mean − median bukan ukuran deviasi yang valid; arah dan besarnya bisa menyesatkan pada distribusi menceng (P0 skew +5.85). Contoh: Klaster 1 mean 6,59% vs median nasional 10,46% → tampak "-3,9% vs Nas", padahal perbandingan yang benar adalah mean vs mean atau median vs median.

**Perbaikan:** Gunakan mean nasional sebagai pembanding untuk mean klaster (atau median vs median). Cantumkan jenis statistik di label ("Δ mean vs mean nasional").

#### P3-04 · Medium · Metrik diagnostik hardcoded dan caveat silhouette hilang

**Bukti**
- `dashboard/src/pages/03_RegionalProfiles.tsx:63-69` — Silhouette 0.2028, DBI 1.4522, ARI 0.9803 literal.
- Tidak ada catatan bahwa 0.2028 = struktur moderat-rendah, padahal `design.md §7 Halaman 3 poin 2` mewajibkannya secara eksplisit.

**Dampak:** Halaman kehilangan bagian "kejujuran ilmiah" yang justru menjadi pembeda proyek ini. Angka juga tidak dapat diperbarui tanpa mengedit kode.

**Perbaikan:** Tambahkan payload `model_diagnostics.json` dan render paragraf caveat Kaufman & Rousseeuw di bawah badge.

#### P3-05 · Medium · Arah warna heatmap salah untuk TPT

**Bukti**
- `dashboard/src/components/charts/ClusterHeatmap.tsx:19` — TPT sebagai fitur.
- `:47-48` — z-score dihitung tanpa inversi arah.
- `:102` — skala `['#D55E00', ..., '#0072B2']` (rendah = vermillion, tinggi = biru).
- `:152` — legenda: "Biru = Unggul ... Vermillion = Defisit kritis".

**Dampak:** Klaster dengan TPT **tinggi** (lebih buruk) diwarnai biru "unggul"; klaster dengan TPT rendah diwarnai vermillion "defisit". Ini kebalikan makna.

**Perbaikan:** Inversikan tanda z untuk TPT (dan metrik lain yang "tinggi = buruk"), atau gunakan skala warna terpisah dengan legenda per-indikator.

#### P3-06 · Medium · Anotasi "The Educated Poor" dan strip plot ANOVA tidak ada

**Bukti**
- `dashboard/src/pages/03_RegionalProfiles.tsx` tidak memuat anotasi Supiori/Waropen/Bintuni maupun hasil ANOVA.
- `dashboard/src/constants/paradoxes.ts:73-82` menyediakan `educatedPoor`, tetapi tidak diimpor/dipakai (pencarian `educatedPoor` hanya menemukan definisi).
- `design.md §7 Halaman 3 poin 4-5` mewajibkan keduanya.

**Dampak:** Salah satu dari 9 paradoks andalan hilang dari UI; klaim "signifikansi pemisahan klaster" tidak punya bukti visual.

**Perbaikan:** Tambahkan callout `PARADOXES.educatedPoor` dan strip plot P0 per klaster dengan anotasi F/p.

#### P3-07 · Low · Narasi callout hardcoded

**Bukti**
- `dashboard/src/pages/03_RegionalProfiles.tsx:186` — "Klaster 4 (Sanitasi 31.2%, RLS 5.26 thn, P0 29.5%) ...".

**Dampak:** Angka tidak berubah saat filter aktif; berisiko basi bila pipeline diperbarui.

**Perbaikan:** Turunkan dari `clusterSummary`/subset atau tandai sebagai "profil nasional".

---

### 5.4 Halaman 4 — Matriks & Prioritas

**Fungsi:** call to action; secara visual dan konten ini halaman terkuat (matriks 1:1, zona kuadran, policy panel, modal, tabel, ekspor). Masalahnya terkonsentrasi pada state dan konsistensi.

#### P4-01 · High · Default lokal Q1 membuat halaman tidak pernah menampilkan "Semua Daerah"

**Bukti**
- `dashboard/src/pages/04_PriorityImplications.tsx:33` — `useState('Q1')`.
- `:90-100` — tabel langsung difilter Q1.
- `:208-213` — kartu Q1 ditandai "Aktif Terpilih" saat halaman dibuka.
- `:539-541` — judul tabel "Q1 · 162 Daerah".

**Dampak:** Berbeda dari `design.md §7 Halaman 4` yang mendefinisikan default "Semua Daerah (514)". Pengguna baru melihat 162 baris dan matriks yang meredupkan 352 titik, tanpa menyadari bahwa mereka sedang melihat subset. Digabung dengan G-01, ini menciptakan kebingungan ganda.

**Perbaikan:** Default `'ALL'`; jika ingin menyorot Q1 sebagai "prioritas utama", gunakan sorotan visual tanpa memfilter tabel.

#### P4-02 · High · Median matriks hardcoded

**Bukti**
- `dashboard/src/components/charts/VulnerabilityMatrix2x2.tsx:20-21` — `medianP0 = 10.46`, `medianVStruc = 0.2720`.
- `:28` — ambang resource curse juga memakai 10.46 literal.

**Dampak:** Garis kuadran dan keanggotaan kuadran tidak dihitung dari data aktif. Jika dataset diperbarui (mis. BPS 2022), matriks tetap membagi pada median lama — kesalahan sistematis yang sulit terlihat. Juga melanggar DoD zero hardcoded.

**Perbaikan:** Hitung median dari `allDistricts` (payload penuh) dan lewatkan sebagai prop; gunakan nilai yang sama untuk klasifikasi kuadran dan label garis.

#### P4-03 · Medium · Narasi Q2 mencampur "akses sanitasi 55%" dengan "krisis sanitasi 55%"

**Bukti**
- `dashboard/src/pages/04_PriorityImplications.tsx:329` — "daerah menyimpan 'bom waktu' krisis sanitasi (55%)".
- `dashboard/src/constants/paradoxes.ts:105-106` — Barito Kuala: sanitasi **55,29%** (akses), defisit **44,7%**.

**Dampak:** Pembaca dapat menyimpulkan 55% warga tanpa sanitasi, padahal 55% **memiliki** akses. Arah angka terbalik.

**Perbaikan:** Tulis "akses sanitasi hanya 55,3% (defisit 44,7%)" atau "44,7% warga belum bersanitasi layak".

#### P4-04 · Medium · Label kuadran gagal kontras WCAG AA

**Bukti**
- `dashboard/src/components/charts/VulnerabilityMatrix2x2.tsx:198,216` — `color: '#94A3B8'`, `fontSize: 9.5`.
- `:234` — `color: 'rgba(100, 116, 139, 0.45)'`, `fontSize: 9.5`.

**Dampak:** Rasio kontras ~2,56:1 (dan ~1,83:1 untuk yang transparan) jauh di bawah 4,5:1. Label kuadran praktis tidak terbaca di proyektor atau layar redup — padahal label ini yang menjelaskan makna zona.

**Perbaikan:** Gunakan `#475569` (5,9:1) minimal 11 px, atau tempatkan label di kartu legenda di luar kanvas.

#### P4-05 · Medium · Pin "Barito Kuala" menargetkan empat daerah, label menyesatkan

**Bukti**
- `dashboard/src/components/charts/VulnerabilityMatrix2x2.tsx:34-37` — target: Barito Kuala, Tanah Datar, Mandailing Natal, Lebak.
- `dashboard/src/pages/04_PriorityImplications.tsx:184-193` — tombol berlabel "Barito Kuala".
- `dashboard/src/components/layout/TopBar.tsx:308` — chip "Barito Kuala".

**Dampak:** Pengguna mengira sedang melihat satu kasus, padahal empat kabupaten di empat provinsi. Perbandingan antar-kasus menjadi kabur.

**Perbaikan:** Ganti label menjadi "Kerentanan Tersembunyi (4 daerah)" atau tampilkan daftar target di tooltip.

#### P4-06 · Low · Statistik kuadran memakai denominator subset

**Bukti**
- `dashboard/src/pages/04_PriorityImplications.tsx:102-110` — `total = districts.length || 514`; persentase dihitung dari subset terfilter.

**Dampak:** Saat filter aktif, persentase kuadran berubah makna (persentase dari subset, bukan dari 514) tanpa label. Bisa dibenarkan, tetapi perlu penjelasan.

**Perbaikan:** Label "dari N daerah terfilter" atau sediakan toggle "pangsa nasional vs pangsa subset".

---

### 5.5 Halaman 5 — Metodologi & Data

**Fungsi:** integrity; konten paling matang. Tab OLS/Kaggle/boundary/prinsip jelas, disclaimer epistemik konsisten, dan tidak ada target leakage. Dua masalah utama: satu kesalahan satuan yang merusak reproduksibilitas, dan snapshot metrik.

#### P5-01 · High · Formula Kaggle memakai satuan rupiah penuh, bukan ribu rupiah

**Bukti**
- `dashboard/src/pages/05_MethodologyAudit.tsx:154` — `expenditure_per_capita <= 6,250,000`.
- Data `expenditure_per_capita` berada dalam **ribu Rp** (mis. mean 14.596 = Rp14,6 juta; lihat `cluster_summary.json`).
- `dashboard/public/data/kaggle_rule_info.json` — formula yang benar: `Pengeluaran <= Rp6.25 Juta`.
- `design.md §7 Halaman 5 poin 3` — `Pengeluaran ≤ 6.25 Juta`.

**Dampak:** Auditor yang mencoba mereproduksi aturan dengan `<= 6.250.000` akan mendapatkan **0 daerah** cocok, bukan 508. Ini bertentangan langsung dengan klaim 98,83% di kartu sebelah.

**Perbaikan:** Tulis `expenditure_per_capita <= 6,250` (ribu Rp) dan tambahkan catatan satuan; atau gunakan `expenditure_per_capita_juta <= 6.25`.

#### P5-02 · Medium · Metrik inti hardcoded; payload Kaggle tidak dipakai

**Bukti**
- `dashboard/src/pages/05_MethodologyAudit.tsx:57-58,66,75` — 98,83%, 508/514, ARI 0.9803, R² 51,64%.
- `dashboard/src/hooks/useDashboardData.ts:119-124` — `kaggle_rule_info.json` **tidak pernah** di-fetch, padahal payload tersedia.
- `ols_coefficients.json` tidak memuat `r_squared`.

**Dampak:** Klaim utama halaman tidak dapat diverifikasi ulang dari payload; jika pipeline berubah, UI tidak ikut. Melanggar DoD butir 2.

**Perbaikan:** Fetch `kaggle_rule_info.json`, tambahkan `r_squared`/`adj_r_squared` ke payload OLS, dan render semuanya dari data.

#### P5-03 · Medium · Tidak ada unduhan CSV dan kamus data hanya prosa

**Bukti**
- `dashboard/src/pages/05_MethodologyAudit.tsx:276-293` — `<details>` berisi dua paragraf, bukan tabel kamus data.
- Tidak ada tautan unduh `poverty_data_cleaned.csv` di seluruh `dashboard/src` (pencarian `download|unduh` hanya menemukan ekspor CSV tabel dan PNG).
- `design.md §7 Halaman 5 poin 5` mewajibkan tabel kamus data interaktif + tombol unduh.

**Dampak:** Klaim transparansi melemah: audiens tidak dapat mengambil dataset bersih atau melihat definisi kolom/satuan. Ini juga menyulitkan replikasi.

**Perbaikan:** Tambahkan tabel kamus (kolom, tipe, satuan, rentang, catatan anomali) dan tombol unduh ke `data/interim/poverty_data_cleaned.csv`.

#### P5-04 · Low · Nilai beta di dokumen desain tidak sinkron dengan payload

**Bukti**
- `dashboard/public/data/ols_coefficients.json` — sanitasi −0,190; log PDRB −0,190; TPAK +0,179; RLS −0,113; TPT +0,100.
- `docs/design.md §7 Halaman 5` — sanitasi −0,209; log PDRB −0,197; TPAK +0,183; RLS −0,118; TPT +0,093.
- `tests/test_dashboard_payload.py:59-71` mengunci nilai payload (benar).

**Dampak:** Dokumen acuan dan UI tidak lagi cocok; reviewer yang membandingkan akan mengira ada regresi.

**Perbaikan:** Perbarui `design.md` agar selaras dengan payload, atau sebaliknya; tambahkan catatan versi model.

#### P5-05 · Low · Tab default OLS menyembunyikan bukti utama (98,8%)

**Bukti**
- `dashboard/src/pages/05_MethodologyAudit.tsx:22` — default `'ols'`.
- `:103` — tab Kaggle diberi label "(98.8%)", tetapi baru terlihat setelah diklik.

**Dampak:** Audiens yang hanya melihat sekilas melewatkan dekonstruksi label — argumen metodologis paling kuat proyek.

**Perbaikan:** Pertimbangkan default `'kaggle'` atau ringkas hasil Kaggle di KPI strip (sudah ada) dengan tautan "lihat bukti".

---

## 6. Aksesibilitas (Lintas Halaman)

#### A-01 · High · Tabel tidak dapat diurutkan dengan keyboard

**Bukti**
- `dashboard/src/components/common/DataTable.tsx:95-127` — `<th onClick={...}>` tanpa `tabIndex`, `role="button"`, `onKeyDown`, atau `aria-sort`.
- `:146` — `<tr onClick={...}>` tanpa `tabIndex`/keyboard handler.

**Dampak:** Pengguna keyboard/screen reader tidak dapat mengurutkan atau membuka detail baris. Melanggar WCAG 2.1 (2.1.1 Keyboard, 4.1.2 Name/Role/Value).

**Perbaikan:** Gunakan `<button>` di dalam `<th>` dengan `aria-sort`, dan jadikan baris fokusable (`tabIndex=0`, `onKeyDown Enter/Space`, `role="row"` + `aria-selected`).

#### A-02 · High · Modal tanpa focus trap dan initial focus

**Bukti**
- `dashboard/src/components/modals/DistrictsDataModal.tsx:32-37`, `PlanningCycleModal.tsx:69-71`, `PolicyBriefModal.tsx:141-143` — `role="dialog"`, `aria-modal="true"`, tetapi tidak ada `autoFocus`, focus trap, atau pengembalian fokus.

**Dampak:** Fokus keyboard tetap berada di belakang modal; pengguna screen reader dapat "keluar" dari dialog. Melanggar WCAG 2.4.3.

**Perbaikan:** Gunakan `focus-trap-react` atau implementasi manual: simpan `document.activeElement`, fokuskan elemen pertama, tangkap `Tab`, kembalikan fokus saat close, dan kunci scroll body.

#### A-03 · Medium · Kontras teks kecil gagal AA

**Bukti**
- `VulnerabilityMatrix2x2.tsx:198,216,234` — `#94A3B8` dan `rgba(100,116,139,0.45)` pada 9,5 px.
- `ArchipelagoStripPlot.tsx:114` — label median `#D55E00` pada 10 px (kontras 3,88:1; `design.md §5.1` hanya mengizinkan ≥24 px bold).
- Beberapa badge memakai `text-[9.5px]` dengan warna aksen.

**Dampak:** Label penting tidak terbaca pada proyektor, layar redup, atau pengguna low-vision.

**Perbaikan:** Naikkan ukuran minimal 11 px dan gunakan `#475569`/`#9E3A00` untuk teks; simpan `#D55E00` untuk titik/garis.

#### A-04 · Medium · Empat grafik tidak memiliki tabel ringkasan screen reader

**Bukti**
- Sudah punya `sr-only` table: `SmallMultiplesZScore.tsx:222-224`, `ArchipelagoStripPlot.tsx:392-394`, `OLSCoefficientsBar.tsx:138-140`, `SpatialRankingBar.tsx:164-166`, `TukeyBoxplot.tsx:162-164`, `VulnerabilityMatrix2x2.tsx:344-346`, `DistributionHistogram.tsx:194-196`.
- Belum punya: `ClusterHeatmap.tsx:167` (hanya `role="img"`), `WorkingPoorScatter.tsx:198-199`, `TheGreatDualismBar.tsx:139`, `IndonesiaChoroplethMap.tsx:676-677`.

**Dampak:** Pengguna screen reader hanya mendengar satu kalimat deskripsi, tanpa nilai data.

**Perbaikan:** Tambahkan tabel `sr-only` berisi nilai per kategori/indikator, seperti pola yang sudah dipakai grafik lain.

#### A-05 · Low · Konteks KPI hanya tersedia lewat `title`

**Bukti**
- `dashboard/src/components/common/KpiCard.tsx:46,51` — tooltip `title` berisi label + benchmark + context.

**Dampak:** Di perangkat sentuh, `title` tidak muncul; konteks hilang.

**Perbaikan:** Tampilkan benchmark/context sebagai teks yang selalu terlihat (sudah ada di kartu) dan pastikan `aria-label` memuat konteks, bukan hanya nilai.

---

## 7. Performa dan Maintainability

| ID | Level | Temuan | Bukti | Dampak | Perbaikan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| F-01 | Medium | Bundle ECharts besar | `npm run build`: `vendor-echarts` 1.052,17 kB (349,73 kB gzip) | First load Halaman 2–5 berat di jaringan lambat | Gunakan `echarts/core` + modul terpilih, atau dynamic import per chart |
| F-02 | Low | Dead code | `DistributionHistogram.tsx` tidak diimpor; `PARADOXES` diimpor tetapi tidak dipakai di Halaman 1–3 (`01:8`, `02:10`, `03:8`) | Membingungkan maintainer; indikasi integrasi cerita belum selesai | Hapus import atau integrasikan; pakai histogram |
| F-03 | Medium | Tidak ada uji regresi UI | `tests/` hanya berisi uji payload Python; tidak ada Vitest/Playwright | Bug state (G-01, G-03, P3-01) tidak tertangkap | Tambahkan uji komponen untuk store/filter dan smoke test Playwright untuk 5 halaman |

---

## 8. Checklist Definition of Done (`design.md §13`)

| # | Butir DoD | Status | Catatan |
| :---: | :--- | :---: | :--- |
| 1 | 10–15 detik paham tujuan & P0 | ✅ | Hero + subheadline jelas |
| 2 | Zero hardcoded values | ❌ | G-05, P1-01/02, P3-04, P4-02, P5-02 |
| 3 | Sumber BPS 2021 tercantum | ✅ | Hero, footer, metodologi |
| 4 | Cari, filter provinsi, detail indikator | ⚠️ | Cari & detail ada; filter provinsi tidak ada (G-06) |
| 5 | Action title di setiap grafik utama | ✅ | Konsisten di 5 halaman |
| 6 | Peta + status coverage + alternatif | ⚠️ | Fallback manual (P2-05); status coverage tidak eksplisit |
| 7 | Profil klaster: fitur, N, deviasi, metrik | ⚠️ | Ada, tetapi statis terhadap filter & mean vs median (P3-01/03) |
| 8 | P0 sebagai benchmark eksternal | ✅ | Tidak ada P0 di fitur klaster; label tegas |
| 9 | Matriks median + case pins mulus | ⚠️ | Median hardcoded; pin memfilter bukan menyorot (G-02, P4-02) |
| 10 | Transparansi 0,00% & Kaggle 98,8% | ⚠️ | Konten ada; satuan formula salah (P5-01) |
| 11 | Label klasifikasi tidak dipakai | ✅ | Tidak ada field target di UI |
| 12 | Tanpa klaim kausal/prediktif | ✅ | Disclaimer epistemik konsisten |
| 13 | Filter lintas halaman, reset, ekspor konsisten | ❌ | G-01, G-02, G-03 |
| 14 | Nyaman di 1366×768 & 1440×900 | ⚠️ | Layout muat, tetapi tipografi sangat kecil (P1-05) |
| 15 | Colorblind-friendly | ⚠️ | Palet benar; arah TPT salah & kontras gagal (P2-01, P3-05, A-03) |
| 16 | Metodologi mudah diakses dari semua layar | ⚠️ | Navigasi ada; hilang saat empty state (G-07) |

**Hasil: 6 ✅ · 8 ⚠️ · 2 ❌.** Dashboard belum memenuhi ambang "layak demo tanpa pendamping".

---

## 9. Roadmap Perbaikan

### P0 — Wajib sebelum demo mandiri (estimasi 1–2 hari)

1. **Satukan state kuadran** (G-01, P4-01): Halaman 4 membaca/menulis `selectedQuadrant` global; default `'all'`; hapus `selectedQuadrantCode`.
2. **Pisahkan pin dari filter** (G-02): hook tidak membuang baris; matriks/tabel menyorot target; chip pin tetap ada.
3. **Perbaiki `Escape`** (G-03): satu handler berprioritas, atau guard modal.
4. **Hitung badge & narasi Halaman 1** (P1-01/02): hapus literal 70%/100%/391/86.9 dari teks yang bergantung filter.
5. **Perbaiki satuan formula Kaggle** (P5-01): `<= 6,250` ribu Rp + catatan.
6. **Hentikan kartu Halaman 3 memakai angka nasional saat filter aktif** (P3-01), dan tampilkan `N/A` untuk klaster kosong (P3-02).

### P1 — Kualitas analitis & aksesibilitas (estimasi 3–5 hari)

7. **Hitung ulang delta klaster** mean vs mean (P3-03) dan tambahkan caveat silhouette (P3-04).
8. **Perbaiki arah warna TPT** di heatmap dan peta TPAK (P3-05, P2-01).
9. **Tambahkan filter drawer < lg + sidebar off-canvas** (G-04).
10. **Aksesibilitas tabel & modal** (A-01, A-02, A-03): keyboard sort, focus trap, kontras.
11. **Tambahkan histogram** (P1-03) dan **fallback peta otomatis** (P2-05).
12. **Hitung `r` dinamis** dan tangani `n<3` (P2-02); hapus fallback rasio senyap (P2-03).
13. **Tambahkan unduhan CSV + tabel kamus data** (P5-03).

### P2 — Polish & ketahanan (estimasi 1 minggu)

14. Naikkan skala tipografi ke `§5.4` (P1-05).
15. Perbaiki kelas Tailwind v4 → v3 (G-11) dan hormati reduced motion (G-12).
16. Tambahkan filter provinsi & rentang P0 (G-06), empty state per-halaman (G-07).
17. Perbaiki pemuatan data parsial + error boundary (G-08, G-09).
18. Optimalkan ECharts & GeoJSON (F-01, P2-07); hapus dead code (F-02).
19. Tambahkan uji UI (F-03).

---

## 10. Checklist Verifikasi Ulang

Setelah perbaikan, jalankan minimal:

```powershell
# 1. Build & typecheck
cd dashboard
npm run build

# 2. Integritas payload & data
cd ..
python -m pytest tests/test_dashboard_payload.py -q

# 3. Audit sisa snapshot agregat (tinjau tiap match: konstanta kebijakan boleh, snapshot hasil tidak)
rg "10\.46|17\.50|86\.9|391|0\.2028|1\.4522|0\.9803|51\.64|98\.83|508" dashboard/src

# 4. Cek filter global dipakai di semua halaman
rg "useFilterStore|useFilteredDistricts" dashboard/src/pages

# 5. Cek aksesibilitas dasar
rg "aria-sort|focus-trap|onKeyDown" dashboard/src/components
```

**Uji manual wajib (belum dapat diotomasi di lingkungan ini):**

- [ ] Pilih Kuadran II di TopBar → Halaman 4 menampilkan 95 baris dan menyorot Q2, bukan kosong.
- [ ] Aktifkan pin "Kutukan Tambang" → titik non-target meredup 0,15 dan tetap terlihat; Halaman 1–3 tidak kehilangan konteks.
- [ ] Buka modal lalu tekan `Esc` → modal tertutup, filter **tidak** berubah.
- [ ] Filter "Jawa" → badge/narasi Halaman 1 tidak lagi mengklaim 86,9% timur atau 100% Papua.
- [ ] Filter "Jawa" → kartu Klaster 3/4 Halaman 3 menampilkan N subset atau label "nasional".
- [ ] Pilih pulau yang menghapus satu klaster → heatmap menampilkan "tidak ada data", bukan 0.
- [ ] Buka Halaman 5 → formula Kaggle `<= 6,250` dapat direproduksi menjadi 508/514.
- [ ] Lepas filter hingga 0 baris → Halaman 5 tetap dapat dibuka.
- [ ] Viewport 375 px → filter dapat diakses lewat drawer; sidebar tidak menutupi konten.
- [ ] Navigasi keyboard: sort tabel, buka modal, tutup modal, fokus kembali ke pemicu.

---

## 11. Batasan Evaluasi

1. **Tidak ada verifikasi visual/browser.** Playwright/Puppeteer tidak terpasang; temuan layout, kontras, dan responsivitas didasarkan pada kelas CSS dan struktur komponen, bukan tangkapan layar. Rasio kontras dihitung dari nilai hex, bukan diukur di perangkat.
2. **Tidak ada uji screen reader.** Temuan ARIA bersifat statis (atribut ada/tidak), bukan hasil uji NVDA/VoiceOver.
3. **Working tree belum bersih.** Evaluasi mencerminkan kondisi saat ini; `git diff` terhadap `HEAD` besar, sehingga sebagian temuan mungkin sudah diperbaiki/diubah di commit lain.
4. **Skor bersifat expert judgment.** Bobot dan nilai 1–5 adalah penilaian terstruktur, bukan metrik objektif; bobot dapat disesuaikan bila prioritas proyek berubah.
5. **Fakta data diverifikasi** dari `data/processed/poverty_clusters.csv` dan `dashboard/public/data/*.json` (514 baris; 123 daerah ≤7,0%; Top 5 terendah 3 Kota; Top 10 terendah 7 Kota; kuadran 162/95/95/162; 29 daerah resource curse).

---

## Lampiran A — Fakta Data yang Diverifikasi

| Fakta | Nilai | Sumber |
| :--- | :--- | :--- |
| Jumlah daerah | 514 | `poverty_clusters.csv` |
| Median P0 | 10,46% | `national_benchmarks.json` |
| Rata-rata P0 | 12,27% | `national_benchmarks.json` |
| Minimum / maksimum | 2,38% (Kota Sawah Lunto) / 41,66% (Intan Jaya) | `national_benchmarks.json` |
| Rasio disparitas | 17,50x | `national_benchmarks.json` |
| Kantong akut (P0 ≥ 20%) | 61 (53 timur / 8 barat) | `national_benchmarks.json` |
| Daerah ≤ 7,0% | 123 (23,9%) → 391 (76,1%) di atas target | `poverty_clusters.csv` |
| Kuadran I/II/III/IV | 162 / 95 / 95 / 162 | `poverty_clusters.csv` |
| Klaster 1/2/3/4 | 78 / 187 / 216 / 33 | `cluster_summary.json` |
| Top 5 terendah: Kota | 3 dari 5 (60%) | `poverty_clusters.csv` |
| Top 10 terendah: Kota | 7 dari 10 (70%) | `poverty_clusters.csv` |
| Top 5 & Top 10 tertinggi: Papua | 5/5 dan 10/10 (100%) | `poverty_clusters.csv` |
| Resource curse (PDRB ≥ Rp25T & P0 ≥ 10,46%) | 29 daerah | `tests/test_dashboard_payload.py` |
| OLS β (payload) | −0,318 / −0,190 / −0,190 / +0,179 / −0,113 / +0,100 | `ols_coefficients.json` |

## Lampiran B — Perintah Verifikasi yang Dijalankan

```powershell
cd dashboard
npm run build
# ✓ 2549 modules transformed; built in 14.21s
# vendor-echarts 1,052.17 kB │ gzip: 349.73 kB

python -c "import pandas as pd; df=pd.read_csv('data/processed/poverty_clusters.csv'); print(len(df), (df.poverty_rate_p0<=7.0).sum())"
# 514 123

python -c "import pandas as pd; df=pd.read_csv('data/processed/poverty_clusters.csv'); print((df.nsmallest(5,'poverty_rate_p0').tipe_wilayah=='Kota').sum(), (df.nsmallest(10,'poverty_rate_p0').tipe_wilayah=='Kota').sum())"
# 3 7

python -c "import pandas as pd; df=pd.read_csv('data/processed/poverty_clusters.csv'); print(df.vulnerability_quadrant.value_counts().to_dict())"
# {'Kuadran I (Prioritas Utama)': 162, 'Kuadran IV (Wilayah Terbina/Mapan)': 162, 'Kuadran III (Kantong Kemiskinan Daya Beli)': 95, 'Kuadran II (Kerentanan Tersembunyi)': 95}
```
