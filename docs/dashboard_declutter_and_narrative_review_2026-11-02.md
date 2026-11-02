# Review Declutter dan Efektivitas Narasi Dashboard PovertyRadar

**Tanggal:** 2 November 2026  
**Snapshot:** commit `a0c0f77`  
**Ruang lingkup:** `dashboard/src` (5 halaman, komponen chart, callout, konstanta narasi)  
**Sifat review:** Audit statis kode dan inventaris teks. Tidak dilakukan uji visual di browser.  
**Dokumen terkait:** [`dashboard_audit_2026-11-02.md`](./dashboard_audit_2026-11-02.md)

---

## 1. Putusan

**Ya, dashboard masih terlalu ramai dan perlu declutter.** Namun akar masalahnya bukan jumlah chart atau jumlah halaman, melainkan:

1. **Repetisi angka dan caveat** yang sama di banyak tempat.
2. **Meta-komentar metodologi** yang masuk ke layar storytelling.
3. **Narasi statis panjang** yang bersaing dengan chart, bukan memperkuat chart.
4. **Tidak ada hierarki informasi** antara pesan utama, bukti, dan detail metodologis.

Dashboard saat ini sudah **information-rich**, tetapi belum **insight-rich**. Pembaca melihat banyak angka dan penjelasan, tetapi tidak selalu langsung menangkap satu pesan utama per halaman.

---

## 2. Diagnosis: Tiga Pola Clutter

### 2.1 Repetisi angka dan label

Angka dan label yang sama muncul berkali-kali dalam satu layar:

- **“514”** muncul 18× di source.
- **Median “10,46”** muncul 11×.
- **“BPS 2021”** muncul 6×.
- **“Nasional/nasional”** muncul 12×.
- **“86,9%”** muncul 3×.
- **“17,5×”** muncul 4×.

Contoh di halaman 1: median 10,46% muncul di headline, KPI card, subtitle histogram, garis median, dan callout. Pembaca menerima pesan yang sama 3–5 kali.

### 2.2 Meta-komentar metodologi di layar utama

Ada 9 kemunculan kata **“Radar”** dan 4 kemunculan **“leakage”** di source. Sebagian berupa pembelaan desain, bukan insight tentang kemiskinan:

- “Strictly No Radar Chart”
- “Bebas dari distorsi Radar Chart”
- “Fallback Geospasial”
- “Zero Target Leakage”

Informasi ini penting untuk audit metodologi, tetapi **tidak perlu muncul di setiap halaman storytelling**.

### 2.3 Kepadatan teks dan label kecil

| Indikator | Jumlah di source |
|---|---:|
| Komponen `NarrativeCallout` | 6 |
| `subtext:` pada chart | 11 |
| `text-xs` | 68 |
| Label `text-[10px]` | 22 |
| Label `text-[11px]` | 26 |

Banyak label 10–11px dipakai untuk metadata, badge, caption, dan tooltip. Di layar presentasi, ukuran ini sulit dibaca dan menambah kesan “penuh”.

### 2.4 Narasi panjang dalam satu blok

Callout sering memuat 2–3 gagasan sekaligus. Contoh dari halaman 1:

> “Angka rata-rata nasional kerap menyesatkan kebijakan jika diasumsikan mewakili seluruh daerah. Sebanyak 86,9% kantong kemiskinan ekstrem menumpuk di Maluku, Papua, dan NTT. Namun demikian, kemiskinan bukan semata batas bujur timur-barat: wilayah terisolir seperti Kepulauan Nias dan Mentawai di Sumatera memperlihatkan profil kerentanan yang menyerupai kawasan timur.”

Satu paragraf ini berisi tiga klaim: rata-rata menyesatkan, konsentrasi di Timur, dan anomali di Barat. Untuk layar utama, ini terlalu padat.

---

## 3. Yang Sudah Kuat dan Harus Dipertahankan

Declutter **bukan** berarti menghapus insight. Elemen berikut justru perlu dipertahankan:

1. **Chart utama:** strip plot, histogram, small multiples, heatmap, matriks 2x2, peta choropleth, OLS.
2. **Banner integritas metodologi:** alasan label Kaggle ditolak.
3. **Kasus batas 0,00%:** bukti keterisolasian 3T.
4. **Peta choropleth 34 provinsi:** sudah riil, join 34/34, dan memberi konteks spasial yang kuat.
5. **Diagnostik model:** Silhouette, DBI, ARI—tetapi cukup di halaman metodologi.
6. **Catatan Kaufman & Rousseeuw:** penting untuk kejujuran ilmiah, tetapi bisa dilipat.

Yang perlu **dipindahkan**, bukan dihapus:

- definisi metode → halaman 5 atau accordion “Metodologi”;
- caveat target leakage → satu kali di halaman 5;
- penjelasan “kenapa tidak pakai radar chart” → hapus dari layar utama;
- angka pembanding nasional → satu label referensi yang konsisten.

---

## 4. Prinsip Declutter yang Diusulkan

### 4.1 Satu halaman, satu pekerjaan

Setiap halaman harus punya:

1. **Satu headline** yang menyatakan insight, bukan label topik.
2. **Satu chart utama** yang membuktikan headline.
3. **Satu takeaway** yang menjelaskan implikasi.
4. **Detail** yang bisa dibuka (accordion/tooltip/footnote).

### 4.2 Aturan teks

- Callout maksimal **35 kata**: 1 angka + 1 implikasi.
- Subtitle chart maksimal **15 kata**, hanya “so what”, bukan metodologi.
- Hapus subtitle yang mengulang judul chart.
- Maksimal **satu** penyebutan “514” per layar; sumber data cukup di footer.
- Maksimal **satu** label “BPS 2021” per halaman.
- Body text minimal **12px**; label 10px hanya untuk metadata sekunder.
- Hindari kalimat yang menjelaskan pilihan chart (“tanpa radar chart”, “bebas distorsi”) di halaman storytelling.

### 4.3 Pola naratif: What → So what → Now what

- **What:** fakta utama.
- **So what:** mengapa itu penting.
- **Now what:** implikasi kebijakan atau pertanyaan lanjutan.

Contoh rewrite halaman 1:

**Sebelum:**

> “Angka rata-rata nasional kerap menyesatkan kebijakan jika diasumsikan mewakili seluruh daerah. Sebanyak 86,9% kantong kemiskinan ekstrem menumpuk di Maluku, Papua, dan NTT. Namun demikian, kemiskinan bukan semata batas bujur timur-barat: wilayah terisolir seperti Kepulauan Nias dan Mentawai di Sumatera memperlihatkan profil kerentanan yang menyerupai kawasan timur.”

**Sesudah:**

> “86,9% kantong kemiskinan akut ada di Timur—tetapi Nias dan Mentawai menunjukkan pola serupa di Barat.”
>
> *Definisi “akut” dan daftar daerah ada di tooltip/footnote.*

### 4.4 Pisahkan “benchmark nasional” dan “subset terfilter”

Saat filter aktif, jangan campur angka nasional dengan angka subset. Gunakan label eksplisit:

- “Nasional: 10,46%” untuk garis referensi.
- “Subset terfilter: 8,12%” untuk nilai yang berubah.
- “N = 78 nasional / 12 terfilter” untuk kartu klaster.

---

## 5. Audit Declutter per Halaman

### Halaman 1 — Lanskap Makro

**Masalah:**
- Headline, KPI, histogram subtitle, dan callout mengulang median 10,46% dan rasio 17,5×.
- KPI “Kantong Akut” menampilkan 0,0% karena bug data (lihat audit F-02), sementara callout menulis 86,9%.
- Caption Top 10 selalu “Seluruhnya di Papua dan Nusa Tenggara” meskipun filter aktif.
- Ada 3 lapis teks di setiap KPI card: label, benchmark, context, badge.

**Yang dipertahankan:**
- Headline besar.
- 3 KPI card.
- Strip plot dan histogram.
- Tabel detail.

**Yang dipotong/dipindah:**
- Subtitle histogram yang mengulang median.
- Caption Top 10 yang statis.
- Kalimat pembuka callout yang normatif (“Angka rata-rata nasional kerap menyesatkan…”).
- Context text KPI yang mengulang “514 Kabupaten/Kota · 34 Provinsi BPS 2021”.

**Target:**
- 1 headline, 3 KPI, 2 chart, 1 callout singkat.
- Median hanya muncul di KPI dan satu garis referensi.

---

### Halaman 2 — Peta dan Indikator

**Masalah:**
- Setelah peta choropleth ditambahkan, teks “Fallback Geospasial” pada ranking bar sudah usang.
- Header + subtitle peta + subtitle ranking + subtitle dualism + subtitle working poor + callout = terlalu banyak lapis teks.
- Callout menggabungkan dua paradoks (dualism dan working poor) dalam satu blok panjang.
- Korelasi `r = +0,462` muncul di subtitle chart dan callout.

**Yang dipertahankan:**
- Peta choropleth dan toggle ranking.
- The Great Dualism.
- Working Poor scatter.

**Yang dipotong/dipindah:**
- Label “Fallback Geospasial”.
- Subtitle ranking yang menjelaskan mekanisme fallback.
- Salah satu dari dua penyebutan `r = +0,462`.
- Penggabungan dua paradoks dalam satu callout; pilih satu pesan utama.

**Target:**
- Peta menjadi bintang halaman.
- Dualism dan Working Poor masing-masing punya satu kalimat takeaway.
- Tidak ada teks “fallback” kecuali saat GeoJSON gagal dimuat.

---

### Halaman 3 — Profil Klaster

**Masalah:**
- Header + 4 diagnostic pills + paragraf “Refleksi Kaufman & Rousseeuw” + 4 kartu persona + switch chart + subtitle chart + legend + callout dua paradoks.
- Kartu persona memiliki 4 baris angka; saat filter aktif, label N tetap nasional.
- Small multiples dan heatmap sama-sama menampilkan 7 indikator yang sama; keduanya bisa membuat bingung jika tidak ada panduan kapan memakai yang mana.
- Callout menggabungkan `basicServices` dan `educatedPoor`.

**Yang dipertahankan:**
- 4 kartu persona.
- Small multiples sebagai tampilan default.
- Heatmap sebagai tampilan alternatif.
- Refleksi Kaufman, tetapi dilipat.

**Yang dipotong/dipindah:**
- Paragraf refleksi metodologi → accordion “Catatan Metodologi”.
- Diagnostic pills → pindah ke halaman 5 atau satu baris kecil.
- Salah satu paradoks dari callout; tampilkan yang paling relevan dengan klaster.
- Label N statis → ganti dengan N dinamis atau label “nasional”.

**Target:**
- 1 headline, 4 kartu ringkas, 1 chart, 1 takeaway.
- Metodologi tersedia, tetapi tidak mendominasi.

---

### Halaman 4 — Matriks dan Prioritas

**Masalah:**
- Header + 2 tombol pin + matriks + panel kebijakan + detail daerah terpilih + callout + tabel.
- Panel kebijakan memuat nama, hipotesis, jalur intervensi, instrumen fiskal, OPD, dan detail daerah.
- Callout Kuadran I mengulang “162 daerah / 31,5%” yang sudah ada di konstanta dan tabel.
- Pin resource curse menyebut 17 daerah, padahal filter menghasilkan 29 (lihat audit F-05).

**Yang dipertahankan:**
- Matriks 2x2.
- Panel kebijakan kuadran.
- Pin studi kasus.
- Tabel skrining.

**Yang dipotong/dipindah:**
- Detail OPD/instrumen ke accordion “Detail kebijakan”.
- Pengulangan jumlah kuadran di callout.
- Narasi resource curse yang statis; hitung dari data.
- Detail daerah terpilih cukup berupa tooltip atau drawer.

**Target:**
- Matriks + panel kebijakan + tabel.
- Panel kebijakan cukup 3 baris ringkas; detail dibuka jika diperlukan.

---

### Halaman 5 — Metodologi dan Audit

**Masalah:**
- Banner integritas + 3 tab + isi tab + callout OLS + boxplot + kamus data.
- Halaman ini memang boleh tekstual, tetapi saat ini semua informasi terbuka sekaligus.
- Callout OLS memakai angka yang berbeda dari chart (lihat audit F-06).
- Angka 98,83% ditulis dua kali di JSX, bukan dari payload.

**Yang dipertahankan:**
- Banner integritas.
- Tab OLS, Kaggle, boundary cases.
- Boxplot Tukey.
- Kamus data.

**Yang dipotong/dipindah:**
- Detail formula dan penjelasan panjang → di dalam tab/accordion.
- Angka OLS di callout → ambil dari `ols_coefficients.json`.
- Angka Kaggle → ambil dari `kaggle_rule_info.json`.
- Kamus data → accordion di bagian bawah.

**Target:**
- Halaman audit tetap lengkap, tetapi default view hanya menampilkan ringkasan dan tab.
- Tidak ada duplikasi angka antara chart dan callout.

---

## 6. Target Metrik Declutter

| Metrik | Kondisi sekarang | Target |
|---|---:|---:|
| Penyebutan “514” per layar | hingga 5× | maksimal 1× |
| Penyebutan median 10,46 | hingga 5× | maksimal 2× (KPI + garis referensi) |
| Callout per halaman | 1–2 blok panjang | 1 blok ≤ 35 kata |
| Subtitle chart | 11 total, banyak normatif | 1 per chart, ≤ 15 kata |
| Label 10–11px | 48 kemunculan | hanya metadata sekunder |
| Teks metodologi di halaman 1–4 | tersebar | terpusat di halaman 5 |
| Visible text di layar utama | baseline | turun 40–50% |

---

## 7. Rencana Eksekusi

### P0 — Sebelum declutter

Perbaiki dulu kontradiksi data, karena declutter tidak berguna jika angkanya salah:

1. KPI kantong akut Timur: 0,0% → 86,9%.
2. Pengeluaran per kapita: `Rp0,01 jt` → `Rp14,60 jt`.
3. Resource curse: 17 → 29 daerah.
4. OLS callout: samakan dengan `ols_coefficients.json`.

### P1 — Declutter halaman 1 dan 3

Kedua halaman ini paling menentukan kesan pertama dan kedalaman cerita.

- Halaman 1: hapus subtitle berulang, pendekkan callout, hapus caption statis.
- Halaman 3: lipat refleksi metodologi, ringkas kartu persona, pilih satu paradoks.

### P2 — Declutter halaman 2, 4, dan 5

- Halaman 2: hapus bahasa “fallback”, satukan takeaway dualism/working poor.
- Halaman 4: ringkas panel kebijakan, pindahkan detail ke accordion.
- Halaman 5: ubah menjadi tab + accordion, ambil angka dari payload.

### P3 — Polish

- Naikkan ukuran font minimum.
- Perbaiki kontras teks.
- Kurangi badge dan label sekunder.
- Pastikan satu istilah untuk satu konsep (mis. “kantong akut” vs “kantong kemiskinan ekstrem”).

---

## 8. Checklist Implementasi

- [ ] Satu headline insight per halaman.
- [ ] Satu chart utama per halaman.
- [ ] Satu callout ≤ 35 kata per halaman.
- [ ] Tidak ada subtitle yang mengulang judul chart.
- [ ] Tidak ada teks “radar chart” di halaman 1–4.
- [ ] Tidak ada “BPS 2021” lebih dari sekali per halaman.
- [ ] Tidak ada “514” lebih dari sekali per layar.
- [ ] Angka narasi diambil dari payload, bukan hardcoded.
- [ ] Label N dan jumlah provinsi mengikuti filter.
- [ ] Benchmark nasional dan subset terfilter diberi label berbeda.
- [ ] Metodologi panjang dipindahkan ke halaman 5/accordion.
- [ ] Body text minimal 12px.
- [ ] Semua chart memiliki satu takeaway yang bisa dibaca tanpa tooltip.

---

## 9. Batasan

- Review ini berbasis statis kode dan inventaris teks, bukan pengujian visual.
- Jumlah kemunculan frasa dihitung dari source, bukan dari jumlah elemen yang benar-benar terlihat di layar.
- Rekomendasi declutter bergantung pada perbaikan data di `dashboard_audit_2026-11-02.md`; tanpa perbaikan itu, tampilan yang lebih ringkas tetap bisa menyesatkan.
