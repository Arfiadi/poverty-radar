# Evaluasi Halaman 5 — Methodology & Data Quality (The Integrity)

**Tanggal evaluasi:** 5 November 2026
**Cakupan:** `dashboard/src/pages/05_MethodologyAudit.tsx`, `dashboard/src/constants/methodology.ts`, komponen chart yang dirender (`OLSCoefficientsBar`, `TukeyBoxplot`), dan payload pendukung.
**Basis evaluasi:** `docs/design.md` v4.1 (§7 Halaman 5, §8.2–8.3, §13 DoD), `docs/clustering_protocol.md`, `docs/clustering_rationale_and_findings.md`, `docs/data_audit_and_understanding.md`, `AGENTS.md`, serta verifikasi ulang terhadap `data/processed/`, `data/interim/`, `experiments/`, dan `src/poverty_radar/`.
**Sifat evaluasi:** Audit baca-kode + verifikasi numerik ulang. Tidak ada perubahan kode yang dilakukan.
**Catatan:** Evaluasi dilakukan terhadap **working tree saat ini**. Halaman 5 sudah jauh lebih lengkap dibanding audit 4 November 2026 (kini memiliki stepper 4 tahap, kamus data interaktif, formula V_struc, dan diagnostik k=4). Skor di bawah menilai **kondisi terkini**, bukan kondisi saat audit sebelumnya.

---

## 1. Ringkasan Eksekutif

Halaman 5 kini adalah halaman yang **paling ambisius secara metodologis** di dashboard. Ia berhasil memindahkan hampir seluruh pipeline ke permukaan: ingestion, koreksi satuan PDRB, log1p, Isolation Forest, RobustScaler, dekonstruksi label Kaggle, isolasi P0/IPM/TPAK, K-Means k=4, formula V_struc, dan OLS dengan t/p-value. Untuk audiens dosen penguji, ini adalah lompatan besar dibanding versi sebelumnya yang hanya berisi 4 kartu KPI dan prosa.

Namun, terhadap **kriteria kesesuaian end-to-end dengan apa yang benar-benar dikerjakan proyek**, halaman ini masih gagal di tiga titik penting:

1. **Benchmark 160 model tidak pernah ditampilkan.** Halaman menyebut k=4 sebagai *"Empirical Optimum"*, padahal `experiments/clustering_benchmark_summary.json` menunjukkan model komposit terbaik justru **Agglomerative complete k=3** (silhouette 0.3129, DBI 1.0979) dengan satu klaster berisi 388 daerah. Pemilihan KMeans k=4 adalah keputusan **viabilitas kebijakan**, bukan pemenang benchmark — dan alasan itu tidak diungkap.
2. **Kamus data — inti janji "audit" — mengandung kesalahan skema.** Tiga dari 13 nama kolom teknis tidak cocok dengan `config.py` (`water_access_pct`, `labor_force_particip_tpak`, `grdp_constant_million_idr`), dan empat rentang empiris salah. Untuk halaman yang tugasnya membuktikan ketertelusuran, ini cacat paling serius.
3. **Pertanyaan kunci halaman tidak dijawab.** `design.md` menetapkan pertanyaan inti: *"Bagaimana temuan diperoleh dan apa yang tidak dapat disimpulkan?"* Halaman menjawab bagian pertama dengan baik, tetapi tidak memiliki blok limitasi eksplisit (cross-section, ecological fallacy, relativitas MinMax, 48,4% varians OLS yang tidak terjelaskan).

**Verdict:** **2,92 / 5,00 — Cukup, perlu perbaikan.** Isi sudah layak untuk dipresentasikan, tetapi belum layak disebut "audit yang dapat direproduksi" sampai kesalahan skema dan ketiadaan limitasi/benchmark diperbaiki.

### Skor ringkas

| Kode | Kriteria | Bobot | Skor | Kontribusi |
| :--- | :--- | :---: | :---: | :---: |
| C1 | **Kesesuaian end-to-end dengan pipeline proyek** | 25% | 3,0 | 0,750 |
| C2 | Akurasi & ketertelusuran angka | 15% | 2,5 | 0,375 |
| C3 | Kelengkapan bukti metodologis | 12% | 3,0 | 0,360 |
| C4 | Kejujuran ilmiah & limitasi | 10% | 2,5 | 0,250 |
| C5 | Kejelasan narasi & struktur informasi | 10% | 3,5 | 0,350 |
| C6 | Ketepatan grafik & encoding | 8% | 4,0 | 0,320 |
| C7 | Konsistensi state filter & baseline | 8% | 2,0 | 0,160 |
| C8 | Aksesibilitas | 6% | 3,0 | 0,180 |
| C9 | Kesesuaian `design.md` & DoD | 4% | 3,0 | 0,120 |
| C10 | Maintainability & reproduksibilitas | 2% | 2,5 | 0,050 |
| | **Total berbobot** | **100%** | | **2,915 ≈ 2,92** |

### Skala penilaian

| Rentang | Makna |
| :--- | :--- |
| 4,5–5,0 | Sangat baik — memenuhi DoD, siap audit eksternal |
| 3,5–4,4 | Baik — kekurangan minor |
| 2,5–3,4 | **Cukup — perlu perbaikan** |
| 1,5–2,4 | Perlu perbaikan besar |
| 1,0–1,4 | Kritis |

---

## 2. Kriteria Evaluasi (Ditetapkan Sebelum Penilaian)

Kriteria diturunkan dari `design.md` §7 (spesifikasi Halaman 5), §8.2 (disiplin statistik), §8.3 (matriks sumber data), §13 (DoD), `AGENTS.md` (integritas pemodelan), serta satu kriteria wajib yang diminta eksplisit: **kesesuaian dengan apa yang dilakukan proyek secara end-to-end**.

| Kode | Kriteria | Definisi operasional | Cara verifikasi |
| :--- | :--- | :--- | :--- |
| **C1** | **Kesesuaian end-to-end** | Setiap tahap pipeline nyata (ingestion → cleaning → transformasi → deteksi anomali → seleksi fitur → scaling → benchmark → klastering → validasi eksternal → V_struc → 2×2 → policy matrix → payload → tes) terwakili, berurutan, dan dapat ditelusuri ke artefak | Petakan 20 tahap pipeline ke elemen UI; cek ada/tidak dan benar/tidak |
| **C2** | Akurasi & ketertelusuran angka | Angka di UI sama dengan payload/CSV/kode; tidak ada literal yang tidak bersumber; nama kolom teknis cocok skema | Bandingkan setiap literal dengan `data/processed/`, `experiments/`, `config.py` |
| **C3** | Kelengkapan bukti metodologis | Klaim disertai formula, metrik, jumlah observasi, dan mekanisme pemilihan | Inspeksi formula, metrik, dan rasional di tiap tahap |
| **C4** | Kejujuran ilmiah & limitasi | Menjawab "apa yang tidak dapat disimpulkan"; tidak overclaim; menyebut batas desain | Cari blok limitasi, caveat, dan bahasa klaim |
| **C5** | Kejelasan narasi & struktur | Satu pertanyaan inti, action title, alur 3 detik → 30 detik → 3 menit, progressive disclosure | Baca hierarki heading, urutan tab, panjang blok |
| **C6** | Ketepatan grafik & encoding | Tanpa radar/pie; zero baseline; arah warna benar; boxplot hanya di halaman audit teknis | Inspeksi opsi ECharts dan palet |
| **C7** | Konsistensi state filter | Baseline angka seragam saat filter global aktif; tidak ada campuran nasional vs terfilter | Telusuri prop `districts` dan literal statis |
| **C8** | Aksesibilitas | ARIA tab, label input, kontras AA, ukuran teks, reduced motion, alternatif tabel | Inspeksi atribut dan kelas Tailwind |
| **C9** | Kesesuaian desain & DoD | Action title, urutan tab, tabel batas 0%, kamus interaktif, tombol unduh CSV | Bandingkan `design.md` §7 dan §13 |
| **C10** | Maintainability & reproduksibilitas | Angka tidak diduplikasi; payload dipakai; ada perintah/seeding yang dapat dijalankan auditor | Grep literal, cek hook data, cek tes |

---

## 3. Peta Kesesuaian End-to-End (C1) — Bukti Utama

Tabel ini adalah jawaban langsung atas kriteria wajib: **apa saja yang dilakukan proyek, dan apakah halaman 5 menampilkannya.**

| # | Tahap pipeline nyata | Artefak sumber | Ditampilkan di Halaman 5? | Bukti | Status |
| :--: | :--- | :--- | :--- | :--- | :---: |
| 1 | Raw ingestion 514 daerah, 13 variabel | `data/raw/*.csv` | Ya — kartu cakupan 413/101, 34 provinsi | `05:316-321` | ✅ |
| 2 | Koreksi satuan PDRB (header "Rupiah" → juta) | `loader.py`, `data/README.md` | Ya — kartu "Skala Juta Rupiah" | `05:332-338` | ✅ |
| 3 | Pemeriksaan missing value / duplikat | `preprocessor.py` | Sebagian — klaim "0 NaN" di tag tahap | `methodology.ts:200` | ⚠️ |
| 4 | Feature engineering `log1p(PDRB)` | `preprocessor.py` | Ya — +5,85 → +0,23 | `05:484-497` | ✅ |
| 5 | Outlier univariat 1.5×IQR | `data_audit_and_understanding.md` | Ya — tetapi **35 vs 36** dan whisker 26,50 vs 26,47 | `05:499-539` | ⚠️ |
| 6 | Anomali multivariat Isolation Forest (26, tidak dibuang) | `preprocessor.py` | Ya — dua kutub 3T & megapolitan | `05:542-561` | ✅ |
| 7 | Eliminasi label biner | `config.py:43-48` | Ya — 98,83% formula + 4 pilar | `05:584-647` | ✅ |
| 8 | Isolasi P0, IPM, TPAK dari fitur | `config.py:43-48` | Ya — kartu multikolinearitas | `05:649-667` | ✅ |
| 9 | RobustScaler (median & IQR) | `preprocessor.py` | Ya — formula dan alasan | `05:563-579` | ✅ |
| 10 | **Benchmark 160 model / 123 valid** | `experiments/clustering_benchmark_summary.json` | **Tidak** — hanya narasi k=3 vs k=4 | — | ❌ |
| 11 | Pemilihan k (elbow + silhouette) | `plots.py`, benchmark | Sebagian — silhouette/DBI k=4, k=3 | `05:716-758` | ⚠️ |
| 12 | K-Means k=4 + re-index persona | `clustering.py` | Sebagian — metrik ada, mekanisme re-index tidak | `05:712-759` | ⚠️ |
| 13 | Uji stabilitas 20 multi-seed (ARI) | `plots.py:194-210` | Ya — tetapi angka 0,9803 tidak persis tereproduksi | `05:110-117`, `744` | ⚠️ |
| 14 | Validasi eksternal P0 (ANOVA) | `test_clustering.py`, summary | Ya — F=155,94, η²=0,478 | `05:119-127`, `748-752` | ✅ |
| 15 | Konstruksi V_struc (4 defisit, MinMax, bobot 25%) | `vulnerability.py:48-62` | Ya — formula lengkap + ambang 0,2720 | `05:762-799` | ✅ |
| 16 | Penetapan kuadran 2×2 (median P0 & V) | `vulnerability.py:65-93` | Sebagian — sumbu & median ada, aturan `≥` dan jumlah kuadran tidak | `05:786-799` | ⚠️ |
| 17 | **Policy recommendation matrix** | `data/processed/policy_recommendations_matrix.csv` | **Tidak** | — | ❌ |
| 18 | **Payload dashboard** (JSON) | `dashboard/public/data/*` | **Tidak** — tidak ada lineage data | — | ❌ |
| 19 | **Validasi otomatis / pytest** | `tests/test_*.py` | **Tidak** | — | ❌ |
| 20 | **Perintah reproduksi & seeding** | `docs/development.md`, `config.py:29` | **Tidak** | — | ❌ |

**Rekap:** 9 tahap penuh (✅), 6 sebagian (⚠️), 5 tidak ada (❌). Artinya halaman 5 baru memetakan **±60% pipeline**, dan yang hilang justru bagian yang paling menentukan kredibilitas audit: benchmark, lineage, dan reproduksibilitas.

---

## 4. Penilaian per Kriteria

### C1 — Kesesuaian end-to-end (25%) — **3,0 / 5**

Kekuatan:
- Empat tahap stepper (`methodology.ts:193-250`) memetakan siklus data science dengan urutan yang benar: ingestion → preprocessing → integrity → validation.
- Setiap tahap memakai pola **Masalah → Metode → Output Tervalidasi** (`05:267-298`), yang secara struktural adalah representasi pipeline yang baik.
- Formula V_struc (`05:777-783`) **persis** cocok dengan implementasi `vulnerability.py:48-62`, termasuk definisi defisit dan normalisasi MinMax.
- Rasional k=3 vs k=4 (`05:756-757`) menyebut disparitas sanitasi 12,38 pp dan UHH 3,72 tahun — keduanya **terverifikasi benar** dari `poverty_cluster_summary.csv`.

Kelemahan penentu:
- **Benchmark 160 model dihilangkan** (F-P5-09). Ini bukan detail: seluruh argumen "k=4 optimal" dibangun di atas benchmark yang tidak diperlihatkan, dan benchmark itu mengatakan hal lain.
- **Tidak ada lineage** dari `data/raw` → `data/interim` → `data/processed` → `dashboard/public/data`. Auditor tidak bisa melacak asal angka.
- **Tidak ada perintah reproduksi, seed, atau tautan tes.** `config.py:29` menetapkan `SEED = 42`, tetapi halaman tidak menyebutnya.
- Policy matrix dan kuadran 2×2 (162/95/95/162) tidak disebut, sehingga rantai cerita ke Halaman 4 terputus.
- PCA dan 9 figure output tidak disebut sama sekali.

### C2 — Akurasi & ketertelusuran angka (15%) — **2,5 / 5**

Terverifikasi benar: 514 daerah, 413/101, 98,83% (508/514), silhouette 0,2028, DBI 1,4522, F=155,94, η²=0,478, R²=51,64%, adjusted R²=51,07%, median P0 10,46%, median V 0,2720, Δ sanitasi 12,38, Δ UHH 3,72, k=3 silhouette 0,2863 dan blob 322 daerah.

Terverifikasi **salah atau tidak dapat dipertanggungjawabkan**: lihat F-P5-01 s.d. F-P5-08. Tiga nama kolom teknis salah, empat rentang salah, satu rentang P0 fiktif, satu hitungan outlier salah, satu median ganda, dan satu aritmetika k=3→k=4 yang mustahil.

### C3 — Kelengkapan bukti metodologis (12%) — **3,0 / 5**

Kekuatan: formula Kaggle, formula V_struc, koefisien OLS dengan t/p, ambang median, dan rasional k. Ini sudah di atas rata-rata dashboard akademik.
Kelemahan: tidak ada tabel benchmark, tidak ada VIF/residual diagnostics untuk OLS, tidak ada jumlah observasi/derajat bebas OLS, tidak ada mekanisme re-index klaster, dan tidak ada validasi gates.

### C4 — Kejujuran ilmiah & limitasi (10%) — **2,5 / 5**

Kekuatan: bahasa "bukan ground truth", "bukan hubungan sebab-akibat" (`OLSCoefficientsBar:31`), dan "kontinum gradasi alami" untuk silhouette rendah (`05:735`) sudah tepat.
Kelemahan: **tidak ada bagian limitasi**, padahal itu pertanyaan kunci halaman (`design.md:369`). Label "Ekonometrika Solid" untuk R² 51,64% (`05:135`) overclaim. "0% Kebocoran" (`05:102`) adalah klaim absolut tanpa definisi operasional. Tidak disebut bahwa MinMax membuat V_struc **relatif terhadap sampel**, sehingga tidak dapat dibandingkan antar-tahun atau antar-dataset.

### C5 — Kejelasan narasi & struktur (10%) — **3,5 / 5**

Stepper dan progressive disclosure bekerja baik. Namun halaman dibuka pada tahap `ingestion` yang langsung menampilkan tabel 13 baris (`05:51`), bukan pada temuan. Empat KPI di atas stepper tidak terhubung ke tahap mana pun. Terjadi **judul ganda**: halaman merender H3 boxplot (`05:503`) lalu komponen merender H3 serupa (`TukeyBoxplot:134`); hal yang sama terjadi pada OLS. Istilah "dual-engine" (`05:92`) tidak konsisten dengan 4 tahap dan 3 artefak model.

### C6 — Ketepatan grafik & encoding (8%) — **4,0 / 5**

Tidak ada radar/pie. Bar horizontal OLS memakai zero line, warna berdasarkan tanda (Okabe-Ito), dan label signifikansi. Boxplot hanya muncul di halaman audit teknis — sesuai pengecualian `AGENTS.md`. Kekurangan: judul grafik deskriptif, bukan action title; boxplot tidak menampilkan titik individual (padahal aturan proyek lebih menyukai strip plot dengan median); tidak ada anotasi pada titik ekstrem.

### C7 — Konsistensi state filter (8%) — **2,0 / 5**

`App.tsx:105-109` mengirim `filteredDistricts` ke halaman 5. Akibatnya boxplot berubah saat filter aktif, tetapi seluruh angka di sekitarnya tetap nasional: "36 Pencilan", kuartil, median, 514 daerah, dan 26 anomali. Tidak ada indikator bahwa grafik sedang terfilter. Ini menciptakan **dua baseline dalam satu panel**.

### C8 — Aksesibilitas (6%) — **3,0 / 5**

Baik: `aria-current` pada stepper, `aria-expanded` pada toggle, `role="img"` + `aria-label` pada chart, dan tabel `sr-only` untuk pembaca layar.
Kurang: stepper adalah `<nav>` berisi `<button>`, bukan `role="tablist"/"tab"/"tabpanel"` dengan `aria-controls`; input pencarian tidak berlabel (`05:357-363`); tabel kamus tanpa `<caption>`; banyak teks 9,5–10 px dengan `text-slate-400` (risiko kontras < 4,5:1); animasi Framer Motion tanpa `prefers-reduced-motion`.

### C9 — Kesesuaian desain & DoD (4%) — **3,0 / 5**

Kamus data interaktif dan audit 0,00% sudah sesuai desain. Namun action title berbeda dari `design.md:372`, urutan 3 tab desain diganti 4 tahap tanpa pembaruan dokumen, dan **tombol unduh CSV tidak ada** meski diwajibkan `design.md:391` dan DoD `design.md:528`.

### C10 — Maintainability & reproduksibilitas (2%) — **2,5 / 5**

Kamus data terpusat di `constants/methodology.ts` (baik), tetapi metrik diduplikasi sebagai literal: ARI 0,9803 muncul di `05:112`, `05:744`, `methodology.ts:242`, dan `methodology.ts:247`; R² di `05:132-133` dan `OLSCoefficientsBar:114`. `kaggle_rule_info.json` tidak pernah di-fetch (`useDashboardData.ts:119-124`), dan payload OLS tidak memuat R² sehingga tidak mungkin dihindari tanpa mengubah payload.

---

## 5. Temuan Rinci

Severity: **P0** = memblokir klaim audit · **P1** = menyesatkan/mengurangi kredibilitas · **P2** = kualitas & konsistensi.

### P0 — Wajib diperbaiki sebelum halaman disebut "audit"

| ID | Temuan | Bukti | Dampak |
| :--- | :--- | :--- | :--- |
| **F-P5-01** | Tiga nama kolom teknis di kamus data tidak cocok dengan skema model: `water_access_pct` (seharusnya `clean_water_access_pct`), `labor_force_particip_tpak` (seharusnya `labor_participation_tpak`), dan `grdp_constant_million_idr` sebagai "fitur" padahal fitur model adalah `log_pdrb`. | `methodology.ts:108,132,144` vs `config.py:32-40` | Auditor yang menyalin nama kolom akan gagal; janji ketertelusuran halaman gugur. |
| **F-P5-02** | Rentang TPT ditulis `0.25% — 13.06%`, padahal data `0.00% — 13.37%`. Halaman yang sama menampilkan kasus batas Nduga TPT `0.00%`. | `methodology.ts:126` vs `boundary_cases.json`; `05:459-468` | Kontradiksi internal dalam satu layar. |
| **F-P5-03** | Nilai air minum `0.00%` diatribusikan ke **Intan Jaya**, padahal kartu batas dan data menunjukkan **Mamberamo Tengah**. | `methodology.ts:117` vs `05:459`; `data/processed/poverty_clusters.csv` | Salah atribusi fakta pada bagian yang justru mengklaim verifikasi lapangan. |
| **F-P5-04** | Rentang PDRB ditulis `Rp147.6 Rb — Rp460.1 Jt`. Nilai riil adalah 147.485–460.081.046 **juta rupiah** (Rp147,5 miliar – Rp460,1 triliun). Salah 1.000× dan urutan besaran terbalik. | `methodology.ts:150` vs data; `05:336` menulis "Rp460 Triliun" dengan benar | Dua pernyataan yang saling bertentangan di halaman yang sama. |

### P1 — Menyesatkan atau mengurangi kredibilitas

| ID | Temuan | Bukti |
| :--- | :--- | :--- |
| **F-P5-05** | Klaim "gradasi moneter 5.48% s.d. 31.85%" tidak ditemukan di artefak mana pun. Rata-rata P0 per klaster adalah 6,59 / 10,01 / 13,66 / 29,47. | `05:124`, `05:751` vs `poverty_cluster_summary.csv` |
| **F-P5-06** | "36 Pencilan Atas (> 26.47%)" salah: jumlah aktual 35 dan whisker aktual 26,50. `aria-label` boxplot bahkan menulis 26 pencilan. | `05:511,537`; `TukeyBoxplot:154` |
| **F-P5-07** | Median ganda: kartu statis 10,46% (interpolasi) vs header chart 10,50% (floor-index). | `05:529` vs `TukeyBoxplot:15-17,138` |
| **F-P5-08** | Aritmetika mustahil: blob 322 daerah k=3 diklaim "terurai menjadi Klaster 2 (187) dan Klaster 3 (216)" — jumlahnya 403, bukan 322. | `05:757` |
| **F-P5-09** | Benchmark 160 model tidak diungkap; k=4 dilabeli "Empirical Optimum" padahal pemenang komposit adalah Agglomerative complete k=3 (silhouette 0,3129; DBI 1,0979; klaster terbesar 388 daerah). | `05:720-728` vs `experiments/clustering_benchmark_summary.json` |
| **F-P5-10** | Tidak ada blok "apa yang tidak dapat disimpulkan": cross-section tunggal, ecological fallacy, relativitas MinMax V_struc, 48,4% varians OLS tak terjelaskan, dan batas ANOVA. | Tidak ditemukan di `05`; `design.md:369,402-406` |
| **F-P5-11** | Tidak ada perintah reproduksi, seed, tautan notebook/tes, atau lineage data. | `05` (tidak ada); `config.py:29`; `tests/` |
| **F-P5-12** | Tombol unduh `poverty_data_cleaned.csv` tidak ada. | `design.md:391,528`; `05` (tidak ada) |
| **F-P5-13** | OLS memakai 6 fitur termasuk TPAK & TPT, sementara klastering memakai 7 fitur tanpa TPAK. Perbedaan ini tidak dijelaskan; kamus bahkan melabeli TPAK "Atribut Kontekstual" padahal OLS memakainya. | `ols_coefficients.json`; `methodology.ts:132-141`; `05:802-810` |
| **F-P5-14** | Boxplot memakai data terfilter, sedangkan seluruh statistik di sekitarnya tetap nasional, tanpa penanda filter. | `App.tsx:105-109`; `05:516` |

### P2 — Kualitas, konsistensi, dan pemeliharaan

| ID | Temuan | Bukti |
| :--- | :--- | :--- |
| **F-P5-15** | ARI 0,9803 tidak persis tereproduksi: dengan `n_init=25` rata-rata 0,9821 (seed 1–20) / 0,9858 (42–61); dengan `n_init=10` 0,9777. Presisi 4 desimal tidak didukung artefak. | `05:112,744`; `plots.py:194-210` |
| **F-P5-16** | R² 51,64/51,07 dan Kaggle 98,83/508 adalah literal; `kaggle_rule_info.json` tidak di-fetch dan payload OLS tidak memuat R². | `useDashboardData.ts:119-124`; `OLSCoefficientsBar:114`; `05:132-133,595` |
| **F-P5-17** | Judul dan statistik ganda antara halaman dan komponen chart. | `05:503` vs `TukeyBoxplot:134`; `05:504` vs `OLSCoefficientsBar:111` |
| **F-P5-18** | Semantik badge salah: validasi eksternal yang **lulus** diberi badge `critical`; R² 51,64% diberi badge "Ekonometrika Solid". | `05:125,135` |
| **F-P5-19** | Semantik tab tidak lengkap (`tablist`/`tab`/`tabpanel`/`aria-controls`); input pencarian tanpa label; tabel tanpa caption. | `05:148-204,357-363,397` |
| **F-P5-20** | Tipografi mikro 9,5–10 px dan `text-slate-400` berulang; di bawah skala `design.md` §5.4. | `05:193,400,733-740` |
| **F-P5-21** | Drift desain: action title berbeda, 3 tab menjadi 4 tahap, urutan berubah, tanpa pembaruan `design.md`. | `design.md:372-391` vs `methodology.ts:193-250` |
| **F-P5-22** | Istilah "dual-engine" tidak sesuai dengan 4 tahap dan 3 artefak (K-Means, V_struc, OLS). | `05:92` |
| **F-P5-23** | Format angka campur (desimal titik vs koma) dan rentang pengeluaran "Rp3,976" ambigu antara 3.976 rupiah dan 3.976 juta. | `05:132`; `methodology.ts:66` |
| **F-P5-24** | Kuadran 2×2 (162/95/95/162) dan policy matrix tidak disebut, memutus handoff dari Halaman 4. | `05:786-799` |
| **F-P5-25** | PCA, 9 figure output, dan artefak laporan tidak disebut, sehingga "end-to-end" berhenti di metrik model. | `pipeline.py:90-117`; `reports/figures/` |

---

## 6. Checklist DoD Halaman 5

| Butir DoD | Sumber | Status | Catatan |
| :--- | :--- | :---: | :--- |
| Action title menyatakan temuan inti | `design.md:520` | ❌ | Judul masih tematik, bukan temuan |
| Transparansi nilai batas 0,00% | `design.md:525` | ⚠️ | Konten ada, atribusi air salah (F-P5-03) |
| Dekonstruksi label Kaggle 98,8% | `design.md:525` | ✅ | Formula & angka benar |
| `Klasifikasi Kemiskinan` bukan ground truth | `design.md:526` | ✅ | Dinyatakan eksplisit |
| Tanpa klaim kausalitas/ramalan/bantuan otomatis | `design.md:527` | ✅ | Caveat OLS ada |
| P0 sebagai pembanding eksternal | `design.md:523` | ✅ | Dinyatakan di dua tempat |
| Kamus data interaktif | `design.md:391` | ✅ | Tabel + pencarian + filter peran |
| Tombol unduh CSV bersih | `design.md:391,528` | ❌ | Tidak ada |
| Filter lintas halaman konsisten | `design.md:528` | ❌ | Baseline campuran (F-P5-14) |
| Dapat dipakai pada 1366×768 | `design.md:529` | ⚠️ | Tidak diverifikasi visual; kepadatan tinggi |
| Tidak bergantung warna saja | `design.md:530` | ✅ | Label teks + badge |
| Halaman mudah diakses dari semua layar | `design.md:531` | ✅ | Sidebar |
| Auditor dapat mereproduksi klaim | `design.md:58` (peran penguji) | ❌ | Tidak ada perintah/seed/tes (F-P5-11) |

**Rekap DoD:** 7 ✅ · 3 ⚠️ · 4 ❌.

---

## 7. Roadmap Perbaikan (Berurutan)

### P0 — Sebelum demo ke dosen penguji
1. **Perbaiki 3 nama kolom dan 4 rentang** di `methodology.ts` agar identik dengan `config.py` dan data (F-P5-01 s.d. F-P5-04).
2. **Hapus atau ganti** klaim "5.48%–31.85%" dengan 6,59–29,47 (F-P5-05).
3. **Samakan** hitungan outlier: 35 dan whisker 26,50; perbaiki `aria-label` dinamis (F-P5-06).
4. **Perbaiki aritmetika k=3→k=4** atau hapus klaim pemetaan 322→403 (F-P5-08).

### P1 — Sebelum halaman disebut "audit lengkap"
5. Tambahkan **blok benchmark ringkas**: 160 dievaluasi / 123 valid, pemenang komposit Agglomerative k=3, dan alasan eksplisit memilih KMeans k=4 (viabilitas kebijakan + stabilitas + interpretabilitas), bukan "optimum" (F-P5-09).
6. Tambahkan **blok limitasi** yang menjawab pertanyaan kunci halaman (F-P5-10).
7. Tambahkan **blok reproduksibilitas**: `SEED=42`, perintah pipeline, tautan notebook & `pytest` (F-P5-11).
8. Tambahkan **tombol unduh CSV** (F-P5-12).
9. Jelaskan **perbedaan fitur OLS vs klastering** dan ubah label peran TPAK (F-P5-13).
10. Tegakkan **satu baseline**: jika filter aktif, tampilkan badge "terfilter (n=…)" atau bekukan boxplot ke nasional (F-P5-14).

### P2 — Kualitas
11. Pindahkan R², ARI, dan metrik Kaggle ke payload; fetch `kaggle_rule_info.json` (F-P5-15, F-P5-16).
12. Hapus heading/statistik ganda; satu sumber kebenaran per metrik (F-P5-17).
13. Perbaiki semantik tab, label input, caption tabel, dan tipografi ≥11 px (F-P5-18 s.d. F-P5-20).
14. Sinkronkan `design.md` dengan struktur 4 tahap yang baru (F-P5-21).
15. Tambahkan ringkasan kuadran 2×2 dan tautan ke policy matrix (F-P5-24).

---

## 8. Verifikasi yang Dilakukan

| Pemeriksaan | Perintah / metode | Hasil |
| :--- | :--- | :--- |
| Rentang 11 variabel | `pandas` min/max pada `poverty_clusters.csv` | 4 rentang kamus salah; 7 benar |
| Outlier Tukey | Q1/Q3 + 1,5×IQR pada 514 baris | 35 pencilan, whisker 26,50 |
| K-Means k=2..5 | `RobustScaler` + `KMeans(n_init=25, random_state=42)` | k=3 sil 0,2863 (blob 322); k=4 sil 0,2028, DBI 1,4522 |
| ARI multi-seed | 20 seed, `n_init` 10 & 25 | 0,9777–0,9858; 0,9803 tidak persis muncul |
| ANOVA P0 | `scipy.stats.f_oneway` | F=155,94; p≈1,03e-71; η²=0,4784 |
| OLS standar | `lstsq` pada 6 fitur terstandardisasi | R²=0,516377; adj=0,510654; β cocok payload |
| Formula Kaggle | threshold 6.250 ribu & sanitasi ≤56 | 508/514 cocok |
| Boundary cases | filter nilai 0,00% | Deiyai (sanitasi), Mamberamo Tengah (air), Nduga & Lanny Jaya (TPT) |
| Benchmark | `experiments/clustering_benchmark_summary.json` | 160 dievaluasi / 123 valid; pemenang Agglomerative k=3 |
| Skema fitur | `config.py:32-40` vs `methodology.ts` | 3 ketidakcocokan nama kolom |

**Tidak diverifikasi:** render visual, kontras terukur, pembaca layar, dan perilaku responsif pada 1366×768 (tidak ada browser/screenshot tooling pada sesi ini). Temuan C8 dan C9 karena itu berbasis kode, bukan observasi visual.

---

## 9. Kesimpulan

Halaman 5 sudah bergerak dari "poster metodologi" menjadi "dokumen audit" — dan itu pencapaian nyata. Namun audit dinilai dari **ketepatan**, bukan kelengkapan. Saat ini halaman memuat tiga nama kolom yang tidak ada di skema, empat rentang yang salah, satu rentang P0 yang tidak bersumber, satu hitungan outlier yang keliru, dan satu aritmetika yang mustahil — semuanya di halaman yang tugasnya membuktikan bahwa angka proyek dapat dipercaya.

Perbaikan P0 (butir 1–4) bersifat editorial dan dapat diselesaikan dalam satu iterasi. Perbaikan P1 (butir 5–10) akan menaikkan skor dari **2,92** ke sekitar **4,1–4,3**, karena halaman ini sudah memiliki struktur yang tepat — yang hilang adalah kejujuran tentang benchmark, batas inferensi, dan jalur reproduksi.
