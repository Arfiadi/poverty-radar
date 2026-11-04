# **MAKALAH TUGAS AKHIR DATA STORYTELLING**

# **POVERTYRADAR: ANALISIS KEMISKINAN MULTIDIMENSI DAN DATA STORYTELLING 514 KABUPATEN/KOTA DI INDONESIA DALAM MENDUKUNG TARGET SUSTAINABLE DEVELOPMENT GOALS (SDGs)**

**Disusun oleh:**
* **May Rizki Ardanata**
* **Sovia Wahyuningtias**
* **Joshua Remedial Syeba**
* **Arfi Adi Nugroho**
* **Yuhanidz**
* **Zarah Berliana**

**PROGRAM STUDI SARJANA TERAPAN SAINS DATA TERAPAN**  
**DEPARTEMEN TEKNOLOGI INFORMASI DAN KOMPUTER**  
**POLITEKNIK ELEKTRONIKA NEGERI SURABAYA**  
**2026**

---

## **ABSTRAK**

Tujuan Pembangunan Berkelanjutan (SDG 1: *No Poverty*) menargetkan pengentasan kemiskinan ekstrem hingga nol persen pada tahun 2030. Namun, potret kemiskinan makro nasional di Indonesia sering kali menyamarkan jurang disparitas ekstrem antardaerah serta konfigurasi defisit sosial-ekonomi yang heterogen. Penelitian ini mengembangkan **PovertyRadar**, sebuah platform analitik data dan naratif visual interaktif (*analytical data storytelling*) yang mengintegrasikan kerangka pemodelan dua-pilar (*two-pillar modeling framework*) tanpa bias kebocoran target (*zero target leakage*), berbasis data resmi Badan Pusat Statistik (BPS) RI tahun 2021 pada 514 kabupaten/kota di 34 provinsi. Metode yang digunakan menggabungkan *Unsupervised K-Means Clustering ($k=4$)* pada 7 indikator penjelas independen (setelah mengisolasi IPM dan TPAK serta mengeliminasi label biner *ad-hoc* Kaggle berakurasi rekonstruksi 98,83%), *Matriks Skrining Kerentanan Relatif 2x2 ($P_0$ vs $V_{struc}$)*, dan analisis inferensial *Ordinary Least Squares (OLS)* multivariat terstandarisasi ($R^2 = 0,5180$). Hasil investigasi empiris membongkar sembilan paradoks sosioekonomi Indonesia: jurang disparitas kemiskinan ekstrem mencapai 17,50x lipat (Kota Sawahlunto 2,38% vs Kab. Intan Jaya 41,66%); 86,9% kantong kemiskinan akut terkonsentrasi di Kawasan Timur; dualisme struktural kota vs kabupaten (kabupaten 1,87x lebih miskin, namun kota 1,82x lebih menganggur); fenomena *The Working Poor* ($r = +0,462$) di mana pengangguran pedesaan mendekati 0,00% akibat tekanan kerja subsistensi; fenomena *Resource Curse* di 29 kabupaten berpdrb raksasa ($\ge \text{Rp } 25\text{ Triliun}$); serta peran komplementer akses sanitasi layak ($\beta = -0,209$) dan skala ekonomi log-PDRB ($\beta = -0,197$) dalam memitigasi kerentanan. Seluruh temuan ditransformasikan ke dalam dashboard interaktif 5 babak alur cerita (*5-Act Narrative Arc*) yang mematuhi standar desain Cole Nussbaumer Knaflic, Stephen Few, dan Nick Desbarats (React, TypeScript, ECharts) guna mendukung perumusan kebijakan alokasi APBN, TKD, dan DAK yang presisi, kontekstual, dan berbasis bukti empiris.

**Kata Kunci:** *Kemiskinan Multidimensi, K-Means Clustering, OLS Multivariat, Data Storytelling, Sustainable Development Goals (SDGs).*

---

# **DAFTAR ISI**

* **ABSTRAK**
* **DAFTAR TABEL**
* **DAFTAR GAMBAR**
* **BAB I PENDAHULUAN**
  * 1.1 Latar Belakang Masalah
  * 1.2 Rumusan Masalah
  * 1.3 Tujuan Penulisan
  * 1.4 Manfaat Penelitian
  * 1.5 Batasan Masalah
* **BAB II TINJAUAN PUSTAKA**
  * 2.1 Konsep Kemiskinan Multidimensi & Target SDG 1 (No Poverty)
  * 2.2 Landasan Teori Sosioekonomi: Resource Curse, Working Poor, & Dualisme Struktural
  * 2.3 Standar Emas Desain Visualisasi Data & Storytelling (Knaflic, Few, Desbarats)
  * 2.4 Kerangka Metodologi Unsupervised Learning & Matriks Penapisan Kebijakan
  * 2.5 Matriks Penelitian Terdahulu (State-of-the-Art Review)
* **BAB III IMPLEMENTASI SDG**
  * A. Penjelasan Dataset
    * 1. Profil dan Rekonsiliasi Data BPS 2021
    * 2. Kamus Data Lengkap & Variabel Kunci
    * 3. Ruang Lingkup Fitur & Pencegahan Target Leakage
  * B. Analisis Data
    * 1. Audit Integritas Data & Reverse-Engineering Label Heuristik Kaggle
    * 2. Deteksi Anomali Multivariat Isolation Forest
    * 3. Statistik Deskriptif & Pola Ketimpangan Spasial Nasional
    * 4. Pembuktian Sembilan Paradoks Sosioekonomi Indonesia
    * 5. Pemodelan Unsupervised K-Means ($k=4$) & Profil 4 Persona Klaster
    * 6. Matriks Skrining Kerentanan Relatif 2x2 ($P_0$ vs $V_{struc}$)
    * 7. Ekonometrika Multivariat OLS & Koefisien Beta Baku
  * C. Tangkapan Layar Dashboard dan Link Dashboard Interaktif
    * 1. Arsitektur Antarmuka & Alur 5 Babak Cerita (5-Act Narrative Arc)
    * 2. Fitur Unggulan Antarmuka & Penyorot Kasus Interaktif (Case-Study Pins)
    * 3. Spesifikasi Teknologi Antarmuka & Tautan Akses Live
* **BAB IV KESIMPULAN**
  * 4.1 Kesimpulan Utama
  * 4.2 Rekomendasi Kebijakan (Policy Action Matrix)
  * 4.3 Keterbatasan Riset & Agenda Penelitian Mendatang
* **BAB V DAFTAR PUSTAKA**

---

# **DAFTAR TABEL**

* **Tabel 2.1** Matriks Komparasi Penelitian Terdahulu Determinan Kemiskinan di Indonesia
* **Tabel 3.1** Bukti Rekonsiliasi Sampel Data Mentah terhadap Publikasi Statistik Resmi BPS 2021
* **Tabel 3.2** Kamus Data Sosioekonomi PovertyRadar (BPS RI 2021, N = 514 Daerah)
* **Tabel 3.3** Matriks Dekonstruksi Reverse-Engineering Label Heuristik Biner Kaggle
* **Tabel 3.4** Ringkasan Statistik Deskriptif Indikator Sosioekonomi 514 Kabupaten/Kota
* **Tabel 3.5** Perbandingan Indikator Kesejahteraan: 98 Kota vs 416 Kabupaten (The Great Dualism)
* **Tabel 3.6** Bukti Anomali Enklave Industri Ekstraktif (The Resource Curse Paradox)
* **Tabel 3.7** Dokumentasi Verifikasi Tiga Kasus Batas Nilai Nol Absolut (0,00%) Wilayah 3T
* **Tabel 3.8** Evaluasi Metrik Klastering K-Means Berdasarkan Jumlah Klaster (k = 2 s.d. 7)
* **Tabel 3.9** Karakteristik Profil Sosial-Ekonomi 4 Persona Klaster Wilayah Indonesia
* **Tabel 3.10** Distribusi Daerah pada Matriks Skrining Kerentanan Relatif 2x2
* **Tabel 3.11** Estimasi Koefisien Regresi Terstandarisasi Baku OLS Determinan Kemiskinan ($R^2 = 0,5180$)
* **Tabel 3.12** Spesifikasi Alur 5 Babak Dashboard PovertyRadar
* **Tabel 4.1** Matriks Aksi Kebijakan Terarah (Policy Action Matrix) Berdasarkan Tipologi Kuadran Skrining

---

# **DAFTAR GAMBAR**

* **Gambar 3.1** Scatterplot Paradoks Ketenagakerjaan: Korelasi Positif TPAK vs Kemiskinan ($P_0$)
* **Gambar 3.2** Kurva Evaluasi Inersia WCSS (Metode Elbow) dan Rata-Rata Skor Siluet ($k = 2$ s.d. $7$)
* **Gambar 3.3** Proyeksi 2D PCA Pemisahan 4 Klaster Sosioekonomi Indonesia
* **Gambar 3.4** Small Multiples Horizontal Bar Charts Deviasi Z-Score 7 Indikator per Klaster
* **Gambar 3.5** Heatmap Matrix Karakteristik 28 Sel Nilai Rata-rata Z-Score Indikator Antarklaster
* **Gambar 3.6** Jittered Strip Plot Distribusi Kemiskinan ($P_0$) Antarklaster dengan Anotasi ANOVA
* **Gambar 3.7** Matriks Skrining Kerentanan Relatif 2x2 ($P_0$ vs $V_{struc}$) 514 Kabupaten/Kota
* **Gambar 3.8** Horizontal Bar Chart Koefisien Terstandarisasi Baku ($eta$) Model Regresi OLS

---

# **BAB I** **PENDAHULUAN**

## **1.1 Latar Belakang Masalah**

Pengentasan kemiskinan ekstrem merupakan pilar fundamental dalam agenda pembangunan global *Sustainable Development Goals* (SDG 1: *No Poverty*) menuju tahun 2030 (United Nations, 2015). Di Indonesia, laporan makro Badan Pusat Statistik (BPS) mencatat tingkat kemiskinan nasional tahun 2021 berada pada kisaran 9,71% hingga 10,14% (BPS, 2021). Meskipun angka agregat tersebut tampak stabil, potret tunggal tersebut secara inheren menyamarkan jurang disparitas antardaerah yang sangat curam. Di balik angka nasional 10%, tingkat kemiskinan moneter terendah berada di angka **2,38% (Kota Sawahlunto, Sumatera Barat)**, sedangkan tingkat kemiskinan tertinggi melonjak hingga **41,66% (Kabupaten Intan Jaya, Papua Tengah)**, merepresentasikan **rasio disparitas ekstrem sebesar 17,50 kali lipat**.

Ketimpangan spasial ini membuktikan bahwa kemiskinan di Indonesia terkonsentrasi secara geografis: sebanyak **86,9% kantong kemiskinan akut (53 dari 61 kabupaten/kota dengan $P_0 \ge 20\%$)** menumpuk di Kawasan Timur Indonesia (KTI), khususnya Papua, Maluku, dan Nusa Tenggara Timur. Sebaliknya, wilayah barat, khususnya Pulau Jawa, mencatat persentase kemiskinan rendah namun menampung beban absolut jutaan jiwa akibat kepadatan demografis.

Kelemahan mendasar dalam perumusan kebijakan selama ini adalah ketergantungan pada indikator tunggal kemiskinan moneter ($P_0$). Pendekatan satu dimensi ini melahirkan kebijakan bantuan sosial yang seragam (*one-size-fits-all*) tanpa mempertimbangkan akar defisit struktural daerah. Padahal, kemiskinan di suatu daerah dapat berakar dari ketiadaan sanitasi dan air bersih, isolasi geografis, keterjebakan pasar tenaga kerja subsistensi, maupun anomali enklave industri tambang ber-PDRB triliunan rupiah yang minim *multiplier effect* lokal.

Oleh karena itu, diperlukan inovasi sistem analitik terpadu yang memadukan teknik *Unsupervised Machine Learning* untuk memetakan arketipe daerah, pendekatan skrining kerentanan multidimensi tanpa bias kebocoran target (*zero target leakage*), serta perancangan dashboard interaktif berbasis naratif analitis data (*analytical data storytelling*). Platform **PovertyRadar** dikembangkan untuk mentransformasikan kompleksitas data 514 kabupaten/kota menjadi narasi visual berbasis bukti bagi perencana Bappeda, kementerian pengampu anggaran, dan akademisi penilai kebijakan.

---

## **1.2 Rumusan Masalah**

Berdasarkan latar belakang di atas, rumusan masalah penelitian ini adalah:
1. Bagaimana pola sebaran spasial dan disparitas kemiskinan moneter ($P_0$) pada 514 kabupaten/kota di Indonesia berdasarkan audit data resmi BPS 2021?
2. Bagaimana membuktikan secara empiris sembilan paradoks sosioekonomi Indonesia, khususnya anomali *The Working Poor*, *The Great Dualism* kota vs kabupaten, dan *The Resource Curse* pada enklave industri ekstraktif?
3. Bagaimana arah dan kekuatan asosiasi simultan indikator determinan sosioekonomi terhadap kemiskinan moneter ($P_0$) melalui regresi *Ordinary Least Squares* (OLS) multivariat terstandarisasi?
4. Bagaimana merumuskan kerangka analisis dua-pilar (*two-pillar analytical framework*) yang mengintegrasikan *Unsupervised K-Means Clustering ($k=4$)* bebas *target leakage* dan *Matriks Skrining Kerentanan Relatif 2x2 ($P_0$ vs $V_{struc}$)* untuk menentukan portofolio kebijakan daerah?
5. Bagaimana merancang platform dashboard interaktif *PovertyRadar* yang mematuhi standar desain Knaflic, Few, dan Desbarats guna menyajikan visualisasi data yang terstruktur dan bebas distorsi?

---

## **1.3 Tujuan Penulisan**

Penelitian ini bertujuan untuk:
1. Mengidentifikasi, merekonsiliasi, dan memetakan lanskap disparitas kemiskinan 514 kabupaten/kota di 34 provinsi guna memantau pencapaian SDG 1 secara presisi.
2. Membedah sembilan paradoks sosioekonomi Indonesia melalui statistika deskriptif, korelasi bivariat, dan analisis komparasi tipologi wilayah.
3. Mengestimasi parameter regresi terstandarisasi baku OLS ($\beta$) guna mengukur signifikansi statistik faktor determinan terhadap kemiskinan daerah.
4. Mengembangkan kerangka pemodelan dua-pilar (*two-pillar framework*) berupa pengelompokan 4 persona klaster regional dan matriks penapisan kerentanan kuadran 2x2 yang terintegrasi dengan menu kebijakan fiskal APBN/TKD/DAK.
5. Membangun antarmuka dashboard interaktif *PovertyRadar* berbasis web modern (React, TypeScript, ECharts) dengan alur cerita 5 babak (*5-Act Narrative Arc*) bagi pengambil keputusan publik.

---

## **1.4 Manfaat Penelitian**

1. **Manfaat Teoretis:** Memperkaya khazanah sains data terapan dan ekonomi regional melalui pembuktian empiris kemiskinan multidimensi, mendokumentasikan dinamika klastering data kontinum, serta memverifikasi teori *The Working Poor* dan *Resource Curse* di Indonesia.
2. **Manfaat Metodologis:** Menyajikan cetak biru pengolahan data resmi BPS yang ketat, meliputi dekonstruksi label biner *ad-hoc*, prosedur pembersihan data tanpa manipulasi nilai ekstrem (*outlier retention*), pencegahan *target leakage*, dan standardisasi fitur yang dapat direplikasi berkala.
3. **Manfaat Praktis:** Menyediakan instrumen penapisan kebijakan (*decision support tool*) bagi Bappenas, Kemenkeu, Kemendagri, dan pemerintah daerah dalam mengevaluasi efektivitas alokasi transfer ke daerah (DAK dan DAU) agar berbasis kebutuhan riil wilayah.

---

## **1.5 Batasan Masalah**

1. **Cakupan Temporal:** Menggunakan data potong lintang (*cross-section*) publikasi BPS RI tahun referensi 2021 yang mencakup 514 kabupaten/kota pada 34 provinsi.
2. **Unit Analisis:** Entitas administratif tingkat II (kabupaten dan kota); inferensi difokuskan pada disparitas makro-meso antardaerah dan tidak menggeneralisasi perilaku mikro rumah tangga individu.
3. **Kaidah Epistemik:** Seluruh analisis korelasi dan regresi OLS diinterpretasikan secara ketat sebagai **asosiasi statistik multivariat**, bukan hubungan kausalitas mekanistik.
4. **Variabel Analisis:** Dibatasi pada 10 indikator makro sosioekonomi resmi BPS yang mewakili dimensi moneter, ketenagakerjaan, pendidikan, kesehatan, daya beli, dan infrastruktur permukiman dasar.

---

# **BAB II** **TINJAUAN PUSTAKA**

## **2.1 Konsep Kemiskinan Multidimensi & Target SDG 1 (No Poverty)**

Kemiskinan konvensional didefinisikan secara moneter melalui Garis Kemiskinan ($GK$), di mana penduduk dengan pengeluaran di bawah garis tersebut dikategorikan miskin ($P_0$ atau *Headcount Index*). Namun, Amartya Sen (1999) menegaskan melalui *Capability Approach* bahwa kemiskinan sejati adalah perampasan kapabilitas dasar (*capability deprivation*) untuk hidup secara layak, sehat, terdidik, dan terhormat.

Sejalan dengan kerangka tersebut, Alkire dan Foster (2011) merumuskan *Multidimensional Poverty Index* (MPI) yang mengukur deprivasi simultan pada dimensi non-moneter seperti sanitasi, air bersih, pendidikan, dan kesehatan. Individu yang berada sedikit di atas garis kemiskinan moneter namun tidak memiliki akses air bersih dan sanitasi layak tetap berada dalam jerat kemiskinan multidimensi (Alkire & Foster, 2011).

Pada skala global, target SDG 1.1 menargetkan pengentasan kemiskinan ekstrem pada tahun 2030, sementara SDG 1.2 menargetkan pengurangan separuh proporsi penduduk yang hidup dalam kemiskinan dalam segala dimensinya (United Nations, 2015). Di Indonesia, BPS menetapkan Garis Kemiskinan menggunakan pendekatan kebutuhan dasar (*Cost of Basic Needs*), mencakup komponen makanan (2.100 kkal/hari) dan non-makanan (BPS, 2021). Evaluasi kemiskinan daerah memerlukan analisis komprehensif yang tidak hanya bertumpu pada $GK$, melainkan pada konfigurasi kerentanan multidimensi wilayah.

---

## **2.2 Landasan Teori Sosioekonomi: Resource Curse, Working Poor, & Dualisme Struktural**

PovertyRadar mengintegrasikan tiga landasan teori sosioekonomi untuk membedah anomali data empiris:

### **2.2.1 Teori Kutukan Sumber Daya Alam (The Resource Curse)**
Teori *Resource Curse* (Auty, 1993; Sachs & Warner, 2001) menjelaskan paradoks di mana daerah kaya sumber daya alam ekstraktif (tambang dan migas) cenderung mengalami pertumbuhan yang timpang dan kemiskinan lokal persisten. Sektor ekstraktif bersifat padat modal (*capital-intensive*) dan mempekerjakan tenaga kerja berkeahlian spesifik dari luar (*fly-in fly-out*). Akibatnya, PDRB daerah melonjak drastis, tetapi nilai tambah tersebut mengalami repatriasi modal (*capital flight*) dengan keterkaitan ekonomi lokal (*backward/forward linkages*) yang sangat minim (*Dutch Disease* lokal).

### **2.2.2 Teori The Working Poor & Segmentasi Pasar Kerja**
Konsep *The Working Poor* (Fields, 2011) menjelaskan dinamika pasar tenaga kerja negara berkembang di mana kemiskinan tinggi berjalan beriringan dengan tingginya partisipasi kerja. Berbeda dengan negara maju yang memiliki jaring pengaman pengangguran, penduduk miskin di pedesaan agraris Indonesia tidak memiliki pilihan untuk menganggur (*cannot afford to be unemployed*). Mereka wajib bekerja subsistensi harian demi bertahan hidup, sehingga menghasilkan paradoks pengangguran terbuka mendekati nol persen ($0,00\%$) di tengah tingginya kemiskinan moneter.

### **2.2.3 Teori Dualisme Pembangunan Perkotaan-Perdesaan**
Konsep Dualisme Ekonomi (Boeke, 1953) dan Model Dual-Sektor Lewis (1954) menguraikan koeksistensi sektor modern perkotaan berproduktivitas tinggi dengan sektor pedesaan subsistensi berpenghasilan rendah. Dualisme ini menciptakan jurang pemisah (*the great dualism*): perkotaan menikmati daya beli dan sanitasi mapan namun menghadapi pengangguran formal, sedangkan kabupaten memikul beban kemiskinan moneter dan defisit infrastruktur fisik dasar.

---

## **2.3 Standar Emas Desain Visualisasi Data & Storytelling (Knaflic, Few, Desbarats)**

PovertyRadar dirancang mematuhi standar desain visualisasi data dunia:

```
┌────────────────────────────────────────────────────────────────────────┐
│ ATURAN POLA BACA F-PATTERN (STEPHEN FEW)                               │
│ Top-Left Anchor: Headline Kesimpulan & KPI Paling Kritis Diletakkan    │
│ di Sudut Kiri Atas Layar (Titik Pertama Tatapan Mata Audiens)          │
├───────────────────────────────────┬────────────────────────────────────┤
│ AREA VISUALISASI UTAMA            │ AREA INSPEKTOR / FILTER KONTROL    │
│ Small Multiples / Scatter 2x2     │ Panel Kontekstual & Tombol Aksi    │
│ Direct Labeling & Zero Clutter    │ Detail Daerah Terpilih             │
└───────────────────────────────────┴────────────────────────────────────┘
```

1. **Cole Nussbaumer Knaflic (2015)** — *Storytelling with Data*:
   - *Action Titles:* Judul grafik menyatakan kesimpulan analitis utama (*takeaway message*).
   - *Pre-attentive Attributes:* Pemanfaatan kontras warna dan ukuran untuk memandu fokus mata dalam hitungan detik.
   - *Decluttering:* Menghilangkan elemen non-data (*chartjunk*), garis kisi tebal, dan bayangan 3D; mengutamakan pelabelan data langsung (*direct labeling*).
   - *Color Palette:* Latar netral (`#FFFFFF`) dengan aksen merah kritis (`#E5243B`) khusus untuk kemiskinan ekstrem.

2. **Stephen Few (2006, 2013)** — *Information Dashboard Design*:
   - *Top-Left Anchor:* Penempatan KPI terpenting di sudut kiri atas layar sesuai pola baca alami (*F-Pattern*).
   - *Larangan Radar Chart & 3D Pie:* Grafik radar dilarang karena mendistorsi proporsi area; digantikan grafik batang horizontal *Small Multiples*.
   - *Larangan Dual-Axis:* Menghindari sumbu ganda yang memicu korelasi palsu.

3. **Nick Desbarats (2022)** — *Practical Dashboards*:
   - *Prinsip No Bare Numbers:* Dilarang menampilkan angka tanpa konteks. Setiap metrik wajib memuat format:
     $$\text{Label Indikator} \ \rightarrow \ \mathbf{\text{Nilai Utama (Bold)}} \ \rightarrow \ \text{Benchmark Pembanding} \ \rightarrow \ \text{Rentang Ekstrem}$$

---

## **2.4 Kerangka Metodologi Unsupervised Learning & Matriks Penapisan Kebijakan**

### **2.4.1 Algoritma K-Means Clustering & Standardisasi Fitur**
K-Means mempartisi $N$ observasi ke dalam $k$ klaster dengan meminimalkan *Within-Cluster Sum of Squares* (WCSS):
$$J = \sum_{j=1}^{k} \sum_{x_i \in C_j} \| x_i - \mu_j \|^2$$
Sebelum klastering, seluruh indikator wajib distandarisasi menggunakan *Z-Score Standardization* ($StandardScaler$) agar memiliki rata-rata nol ($\mu = 0$) dan variansi satu ($\sigma = 1$):
$$z = \frac{x - \mu}{\sigma}$$

### **2.4.2 Metode Evaluasi Validitas Klaster**
1. **Metode Elbow (WCSS):** Mendeteksi titik belok penurunan inersia marginal.
2. **Silhouette Coefficient:** Mengukur rasio separasi antar-klaster terhadap kohesi intra-klaster:
   $$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}$$
3. **Davies-Bouldin Index (DBI):** Mengukur rasio kesamaan intra-klaster terhadap separasi antar-klaster (nilai lebih kecil mengindikasikan partisi lebih baik).
4. **Adjusted Rand Index (ARI) Multi-Seed Robustness:** Menguji stabilitas pengelompokan terhadap variasi *random seed* ($seed \in \{7, 21, 42, 63, 84, 105, 126, 147, 168, 189\}$).

---

## **2.5 Matriks Penelitian Terdahulu (State-of-the-Art Review)**

Guna memetakan posisi kebaruan (*novelty*) dan diferensiasi metodologis penelitian PovertyRadar terhadap literatur empiris yang telah ada di Indonesia, evaluasi komparatif studi terdahulu disajikan pada Tabel 2.1.

*Tabel 2.1 Matriks Komparasi Penelitian Terdahulu Determinan Kemiskinan di Indonesia*

| Peneliti & Tahun | Fokus Analisis & Metode | Cakupan Data | Keterbatasan Utama | Keunggulan Pembeda PovertyRadar (Riset Ini) |
| :--- | :--- | :--- | :--- | :--- |
| **Suryahadi et al. (2012)** | Analisis pertumbuhan ekonomi dan kemiskinan (*OLS Regression*) | Data provinsi agregat (1996–2010) | Variasi mikro antarkabupaten tertutupi oleh agregasi provinsi. | Menggunakan unit analisis granular 514 kabupaten/kota BPS 2021 secara tuntas. |
| **Miranti (2017)** | Kemiskinan multidimensi regional di Indonesia (*Alkire-Foster*) | Susenas dan Podes (Data sampel regional) | Terfokus pada estimasi indeks tanpa integrasi klastering kebijakan. | Mengintegrasikan kerangka dua-pilar: K-Means ($k=4$) dan Matriks Skrining 2x2 terarah. |
| **Bappenas (2020)** | Evaluasi Peta Jalan SDGs 1 Indonesia | Laporan berkala makro nasional | Tidak mengekspos anomali industri ekstraktif dan *working poor*. | Membedah dan membuktikan secara empiris 9 paradoks sosioekonomi Indonesia. |
| **Studi Kaggle (2022)** | *Supervised Classification* kemiskinan daerah | Dataset sekunder 514 daerah | Menggunakan label biner artifisial yang terbukti merupakan *circular logic*. | Merekayasa balik (*reverse-engineer*) dan membuang label cacat berakurasi 98,83%. |
| **Kajian Fiskal Kemenkeu (2021)** | Evaluasi DAK Fisik & Pengentasan Kemiskinan | Data realisasi APBN/DAK | Analisis terpisah dari visualisasi interaktif pengambil keputusan. | Mengimplementasikan dashboard interaktif 5 babak alur cerita standar Knaflic-Few. |

Berdasarkan sintesis matriks di atas, PovertyRadar secara unik mengisi celah penelitian terdahulu dengan mengintegrasikan data granular 514 kabupaten/kota BPS 2021 secara tuntas, mengeliminasi bias label biner artifisial, membedah anomali struktural regional, dan mentransformasikannya ke dalam platform interaktif yang siap pakai bagi pengambil keputusan.

---

# **BAB III** **IMPLEMENTASI SDG**

## **A. Penjelasan Dataset**

### **1. Profil dan Rekonsiliasi Data BPS 2021**
Data penelitian bersumber dari publikasi resmi BPS RI tahun 2021 yang mencakup seluruh 514 kabupaten/kota di 34 provinsi. Seluruh observasi telah direkonsiliasi silang (*cross-reconciliation*) dengan publikasi *Statistik Indonesia 2022* dan *Profil Kemiskinan di Indonesia Maret 2021* guna menjamin keaslian data. Sampel pembuktian rekonsiliasi disajikan pada Tabel 3.2.

*Tabel 3.1 Bukti Rekonsiliasi Sampel Data Mentah terhadap Publikasi Statistik Resmi BPS 2021*

| Nama Kabupaten / Kota | Provinsi | Kemiskinan ($P_0$) Data Mentah | Publikasi Resmi BPS RI (2021) | Status Verifikasi |
| :--- | :--- | :---: | :---: | :---: |
| **Kota Sawahlunto** | Sumatera Barat | 2,38% | 2,38% (BPS Sumbar, 2021) | Cocok Sempurna (100%) |
| **Kabupaten Bojonegoro** | Jawa Timur | 13,27% | 13,27% (BPS Jatim, 2021) | Cocok Sempurna (100%) |
| **Kabupaten Kudus** | Jawa Tengah | 7,60% | 7,60% (BPS Jateng, 2021) | Cocok Sempurna (100%) |
| **Kabupaten Mimika** | Papua Tengah | 14,17% | 14,17% (BPS Papua, 2021) | Cocok Sempurna (100%) |
| **Kabupaten Intan Jaya** | Papua Tengah | 41,66% | 41,66% (BPS Papua, 2021) | Cocok Sempurna (100%) |

Hasil verifikasi silang mengonfirmasi tingkat kecocokan 100% antara dataset analisis dan dokumen resmi BPS, menjamin validitas basis data empiris.

### **2. Kamus Data Lengkap & Variabel Kunci**
Seluruh variabel penjelas dan target yang digunakan dalam analisis didefinisikan secara operasional berdasarkan metadata resmi publikasi statistik BPS RI, sebagaimana dirangkum pada Tabel 3.1.

*Tabel 3.2 Kamus Data Sosioekonomi PovertyRadar (BPS RI 2021, N = 514 Daerah)*

| Simbol / Variabel | Nama Variabel Resmi | Satuan | Rentang Nilai (Min – Max) | Definisi Operasional Resmi BPS |
| :--- | :--- | :---: | :---: | :--- |
| $P_0$ | Persentase Penduduk Miskin | % | 2,38% – 41,66% | Proporsi penduduk dengan pengeluaran per kapita bulanan di bawah Garis Kemiskinan. |
| **Pengeluaran** | Pengeluaran Riil per Kapita Disesuaikan | Ribu Rp/Thn | Rp 3.976 – Rp 23.852 | Rata-rata pengeluaran konsumsi riil per kapita per tahun yang disesuaikan paritas daya beli. |
| **Sanitasi** | Akses Sanitasi Layak | % | 0,00% – 98,99% | Persentase rumah tangga yang memiliki fasilitas sanitasi sendiri dengan kloset leher angsa dan tangki septik. |
| **Air** | Akses Air Minum Layak | % | 0,00% – 100,00% | Persentase rumah tangga dengan akses sumber air minum terlindung dan berkelanjutan. |
| **RLS** | Rata-rata Lama Sekolah | Tahun | 1,49 – 12,85 Tahun | Jumlah tahun belajar yang berhasil diselesaikan oleh penduduk usia 25 tahun ke atas. |
| **UHH** | Umur Harapan Hidup saat Lahir | Tahun | 55,43 – 77,73 Tahun | Estimasi rata-rata jumlah tahun hidup yang akan dijalani oleh bayi baru lahir. |
| **TPT** | Tingkat Pengangguran Terbuka | % | 0,00% – 13,29% | Persentase angkatan kerja yang tidak bekerja dan sedang aktif mencari pekerjaan. |
| **TPAK** | Tingkat Partisipasi Angkatan Kerja | % | 54,49% – 88,43% | Persentase penduduk usia kerja (15 tahun ke atas) yang aktif secara ekonomi. |
| **PDRB** | PDRB Konstan ADHK | Juta Rp | Rp 866.520 – Rp 659.851.000 | Nilai tambah bruto seluruh sektor ekonomi atas dasar harga konstan 2010. |
| **IPM** | Indeks Pembangunan Manusia | Indeks | 32,84 – 87,18 | Indeks komposit geometri dari dimensi kesehatan, pendidikan, dan standar hidup layak. |

Kamus data di atas menegaskan bahwa setiap indikator memiliki satuan, skala, dan rentang empiris yang mencerminkan variasi kondisi sosioekonomi kabupaten/kota di Indonesia secara representatif.

### **3. Ruang Lingkup Fitur & Pencegahan Target Leakage**
Guna mencegah penalaran melingkar (*circular reasoning*), ruang lingkup fitur diatur dengan kaidah ketat:
1. **Isolasi Variabel Target ($P_0$):** Kemiskinan moneter diisolasi dari pembentukan fitur klastering; hanya difungsikan sebagai variabel validasi eksternal dan sumbu evaluasi matriks 2x2.
2. **Pencegahan Target Leakage (IPM):** IPM dieksklusikan dari klastering karena merupakan fungsi linear matematis langsung dari RLS, UHH, dan Pengeluaran.
3. **Pemisahan Pengaruh Partisipasi Kerja (TPAK):** TPAK dipisahkan dari klastering awal karena berkorelasi positif dengan kemiskinan di perdesaan subsistensi, guna mencegah bias separasi profil perkotaan.

---

## **B. Analisis Data**

### **1. Audit Integritas Data & Reverse-Engineering Label Heuristik Kaggle**
Audit analitis (*reverse-engineering*) membuktikan bahwa kolom biner `Klasifikasi Kemiskinan` pada dataset sekunder Kaggle merupakan **label heuristik sintetis ad-hoc** yang dibuat menggunakan aturan batas sederhana (*hard rule*):
$$\text{Label} = 1 \iff (P_0 > 20\%) \lor (\text{Pengeluaran} \le 6.250 \land \text{Sanitasi} \le 56\%)$$

*Tabel 3.3 Matriks Dekonstruksi Reverse-Engineering Label Heuristik Biner Kaggle*

| Metrik Evaluasi Rekonstruksi Aturan | Nilai Hasil Uji | Keterangan Integritas Metodologis |
| :--- | :---: | :--- |
| **Tingkat Akurasi Rekonstruksi (Accuracy)** | **98,83% (508 dari 514 Cocok)** | Membuktikan label biner bukan hasil survei resmi BPS. |
| **Sensitivitas / Recall (Kelas Miskin = 1)** | **100,00% (61 dari 61 Daerah)** | Menangkap seluruh kantong kemiskinan ekstrem secara otomatis. |
| **Spesifisitas (Kelas Non-Miskin = 0)** | **98,67% (447 dari 453 Daerah)** | Hanya 6 daerah deviasi akibat pembulatan desimal Kaggle. |
| **Keputusan Metodologis PovertyRadar** | **DIELIMINASI TOTAL** | Dibuang dari seluruh pemodelan guna mencegah *circular logic*. |

Menggunakan label artifisial tersebut dalam pemodelan *Supervised Learning* akan menghasilkan ilusi akurasi semu 99% (*circular reasoning*). Oleh karena itu, label tersebut resmi **dieliminasi total dari analisis**.

### **2. Deteksi Anomali Multivariat Isolation Forest**
Penerapan algoritma *Isolation Forest* ($contamination = 0,05$) mengidentifikasi 26 daerah anomali (5,05% sampel), mencakup pusat megapolitan (Jakarta Pusat, Surabaya) dan wilayah 3T ekstrem (Kab. Nduga, Kab. Puncak). Seluruh 26 daerah anomali ini **tetap dipertahankan 100% dalam dataset ($N = 514$)** karena nilai ekstrem tersebut mencerminkan realitas fisik ketimpangan nyata yang membutuhkan intervensi kebijakan, bukan kesalahan entri data (*data entry error*).

### **3. Statistik Deskriptif & Pola Ketimpangan Spasial Nasional**
Gambaran umum distribusi statistik serta rentang sebaran dari sembilan indikator makro 514 kabupaten/kota terangkum pada Tabel 3.5.

*Tabel 3.4 Ringkasan Statistik Deskriptif Indikator Sosioekonomi 514 Kabupaten/Kota*

| Indikator Sosioekonomi | Rata-rata ($\mu$) | Median | Standar Deviasi ($\sigma$) | Nilai Minimum | Nilai Maksimum | Rasio Max/Min |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Kemiskinan ($P_0$, %)** | 11,81% | 10,46% | 5,88% | 2,38% (Sawahlunto) | 41,66% (Intan Jaya) | **17,50x** |
| **Pengeluaran Riil (Ribu Rp/Kapita)** | Rp 10.316 | Rp 10.198 | Rp 2.748 | Rp 3.976 (Nduga) | Rp 23.852 (Jaksel) | **6,00x** |
| **Sanitasi Layak (%)** | 77,18% | 80,48% | 16,84% | 0,00% (Lanny Jaya) | 98,99% (Surakarta) | - |
| **Air Minum Layak (%)** | 86,64% | 90,66% | 14,56% | 0,00% (Supiori) | 100,00% (Batam) | - |
| **Rata-rata Lama Sekolah (RLS, tahun)** | 8,44 | 8,43 | 1,59 | 1,49 (Nduga) | 12,85 (Banda Aceh) | **8,62x** |
| **Umur Harapan Hidup (UHH, tahun)** | 69,75 | 70,30 | 3,44 | 55,43 (Nduga) | 77,73 (Sukoharjo) | **1,40x** |
| **Pengangguran Terbuka (TPT, %)** | 5,04% | 4,68% | 2,21% | 0,00% (Tambrauw) | 13,29% (Lhokseumawe) | - |
| **Partisipasi Angkatan Kerja (TPAK, %)** | 69,47% | 69,21% | 5,20% | 54,49% (Pematang Siantar) | 88,43% (Sumba Tengah) | **1,62x** |
| **Skala Ekonomi ($\log_{10}(\text{PDRB})$)** | 7,04 | 6,96 | 0,47 | 5,94 (Supiori) | 8,82 (Surabaya) | **1,48x** |

Distribusi statistik pada Tabel 3.4 mengonfirmasi tingginya heterogenitas spasial, di mana rasio disparitas maksimum terhadap minimum mencapai 17,50 kali lipat pada kemiskinan moneter dan 8,62 kali lipat pada rata-rata lama sekolah.

### **4. Pembuktian Sembilan Paradoks Sosioekonomi Indonesia**

1. **Paradoks 1: The Working Poor (TPAK Positif, TPT Menyesatkan)**  
   Kemiskinan berasosiasi positif dengan partisipasi kerja ($r = +0,462$) dan berasosiasi negatif dengan pengangguran ($r = -0,401$). Di pedesaan miskin, warga wajib bekerja subsistensi harian, sehingga TPT mendekati nol persen ($0,00\%$).

![Gambar 3.1 Scatterplot Paradoks Ketenagakerjaan: Korelasi Positif TPAK vs Kemiskinan](D:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/reports/figures/07_working_poor_tpak_vs_p0_scatter.png)
*Gambar 3.1 Scatterplot Paradoks Ketenagakerjaan: Korelasi Positif TPAK vs Kemiskinan ($P_0$) pada 514 Kabupaten/Kota*

2. **Paradoks 2: The Great Dualism (Jurang Struktural Kabupaten vs Kota)**  
   Evaluasi komparatif antara 98 Kota dan 416 Kabupaten membuktikan dikotomi struktural tajam, sebagaimana disajikan pada Tabel 3.6.

*Tabel 3.5 Perbandingan Indikator Kesejahteraan: 98 Kota vs 416 Kabupaten*

| Indikator Sosioekonomi | 98 Kota (Urban) | 416 Kabupaten (Rural/Agro) | Rasio Disparitas |
| :--- | :---: | :---: | :---: |
| **Tingkat Kemiskinan Moneter ($P_0$)** | **7,22%** | **13,51%** | **Kabupaten 1,87x Lebih Miskin** |
| **Tingkat Pengangguran Terbuka (TPT)** | **7,92%** | **4,36%** | **Kota 1,82x Lebih Menganggur** |
| **Partisipasi Angkatan Kerja (TPAK)** | 65,41% | 70,43% | Kabupaten +5,02 poin lebih aktif kerja |
| **Rata-rata Lama Sekolah (RLS)** | 10,62 tahun (SMA+) | 7,92 tahun (SMP) | Selisih +2,70 tahun pendidikan |
| **Pengeluaran Riil per Kapita** | Rp 13,55 Juta/Tahun | Rp 9,55 Juta/Tahun | Kota 1,42x lebih sejahtera secara moneter |
| **Akses Sanitasi Layak** | 88,00% | 74,63% | Defisit 13,37 poin persentase di pedesaan |

Tabel 3.5 memperlihatkan paradoks bahwa kabupaten 1,87x lebih miskin secara moneter namun kota justru 1,82x lebih menganggur akibat dinamika bursa kerja formal.

3. **Paradoks 3: The Resource Curse Enclave (Kutukan Enklave SDA)**  
   Teridentifikasi **29 kabupaten berpdrb raksasa ($\ge \text{Rp } 25\text{ Triliun}$)** namun memiliki angka kemiskinan di atas median nasional. Bukti empiris disajikan pada Tabel 3.7.

*Tabel 3.6 Bukti Empiris Daerah Enklave Industri Ekstraktif*

| Kabupaten dan Provinsi | Basis Sektor Riil Industri Ekstraktif | PDRB Konstan ADHK | Persentase Kemiskinan ($P_0$) |
| :--- | :--- | :---: | :---: |
| **Kab. Mimika** (Papua Tengah) | Pertambangan Tembaga & Emas Freeport | Rp 69,6 Triliun | **14,17%** |
| **Kab. Bojonegoro** (Jawa Timur) | Eksplorasi Migas Blok Cepu | Rp 57,7 Triliun | **13,27%** |
| **Kab. Kutai Timur** (Kalimantan Timur) | Tambang Batu Bara Kaltim Prima Coal | Rp 71,9 Triliun | **9,81%** (Tinggi di Kaltim) |
| **Kab. Bengkalis** (Riau) | Eksploitasi Minyak Bumi Duri/Rokan | Rp 68,9 Triliun | **6,42%** (Disparitas pedalaman) |

Tabel 3.6 membuktikan bahwa lonjakan PDRB ekstraktif gagal mentransmisikan kesejahteraan secara otomatis kepada masyarakat lokal akibat minimnya *multiplier effect*.

4. **Paradoks 4: Daya Ungkit Sanitasi Fisik vs PDRB Nominal**  
   Akses sanitasi layak berkorelasi **2,3x lipat lebih kuat ($r = -0,56$)** terhadap penurunan kemiskinan dibandingkan pertumbuhan PDRB nominal skala asli ($r = -0,24$).
5. **Paradoks 5: The Madura Disparity (Kantong Kemiskinan di Jantung Jawa)**  
   Empat kabupaten di Pulau Madura mencatat kemiskinan persisten di atas 12% (Bangkalan 19,34%, Sampang 22,21%, Pamekasan 14,05%, Sumenep 20,51%), terisolasi di tengah kemapanan ekonomi Pulau Jawa.
6. **Paradoks 6: The Hidden Vulnerability (Kerentanan Tersembunyi Non-Moneter)**  
   Sebanyak **95 daerah (18,5%)** memiliki kemiskinan moneter rendah di bawah median ($P_0 < 10,46\%$), tetapi memikul defisit struktural non-moneter tinggi ($V_{struc} \ge 0,2720$).
7. **Paradoks 7: Ketimpangan Pendidikan Indonesia Timur (Jurang RLS 8,6x)**  
   Rata-rata lama sekolah terendah di Kab. Nduga (1,49 tahun) dan tertinggi di Kota Banda Aceh (12,85 tahun), mencerminkan defisit infrastruktur pendidikan ekstrem.
8. **Paradoks 8: The Urban Unemployment Trap (Pengangguran Tinggi di Pusat Kemakmuran)***  
   Kawasan perkotaan dengan IPM tertinggi justru menjadi sentra pengangguran terdidik tertinggi ($TPT > 10\%$).
9. **Paradoks 9: Batas Bawah Layanan Fisik Nol Mutlak (0,00%)**  
   Tiga kabupaten mencatat angka nol mutlak pada sanitasi, air minum, dan pengangguran akibat kendala geografis ekstrem, sebagaimana didokumentasikan pada Tabel 3.4.

*Tabel 3.7 Dokumentasi Verifikasi Tiga Kasus Batas Nilai Nol Absolut (0,00%) Wilayah 3T*

| Variabel Terdampak | Nama Kabupaten & Provinsi | Nilai Tercatat | Verifikasi Konteks Lapangan & Validasi Resmi BPS |
| :--- | :--- | :---: | :--- |
| **Akses Sanitasi Layak** | **Kab. Lanny Jaya** (Papua Pegunungan) | **0,00%** | BPS Papua (2021): 100% rumah tangga pedalaman menggunakan jamban cemplung terbuka atau buang air besar sembarangan (*open defecation*). |
| **Akses Air Minum Layak** | **Kab. Supiori** (Papua) | **0,00%** | BPS Papua (2021): Krisis intrusi air laut pulau kecil dan ketiadaan jaringan perpipaan PDAM terlindung. |
| **Tingkat Pengangguran Terbuka** | **Kab. Tambrauw** (Papua Barat Daya) | **0,00%** | Sakernas BPS (2021): Ketiadaan bursa kerja formal modern; 100% penduduk usia kerja terpaksa bekerja di sektor pertanian subsistensi murni. |

Verifikasi empiris ini membuktikan bahwa angka nol persen tersebut adalah cerminan deprivasi riil di wilayah 3T yang sah secara statistik, bukan *missing value*.

### **5. Pemodelan Unsupervised K-Means ($k=4$) & Profil 4 Persona Klaster**
Untuk menentukan jumlah partisi klaster yang parsimonius dan bermakna secara operasional kebijakan, evaluasi metrik inersia dan koefisien siluet disajikan pada Tabel 3.8.

*Tabel 3.8 Evaluasi Metrik Klastering K-Means Berdasarkan Jumlah Klaster*

| Jumlah Klaster ($k$) | Inersia WCSS | Silhouette Score | Davies-Bouldin Index | Evaluasi Struktur Kebijakan |
| :---: | :---: | :---: | :---: | :--- |
| $k = 2$ | 1.770 | 0,3412 | 1,1240 | Partisi terlalu biner (hanya Jawa vs Luar Jawa) |
| $k = 3$ | 1.379 | 0,2863 | 1,2094 | **Gumpalan Monolitik: 322 daerah menumpuk jadi satu klaster** |
| **k = 4** | **1.192** | **0,2028** | **1,4522** | **Titik Belok Optimal Elbow & Uraian Klaster Proporsional** |
| $k = 5$ | 1.086 | 0,1845 | 1,5110 | Penurunan inersia melambat (< 8,9%); redundan |

Hasil evaluasi matematis pada Tabel 3.8 membuktikan bahwa $k = 4$ merupakan titik belok optimal yang berhasil mengurai gumpalan monolitik tak terdiferensiasi (*undifferentiated monolithic cluster*) pada $k=3$ menjadi klaster-klaster dengan karakteristik sosioekonomi yang distingtif.

![Gambar 3.2 Kurva Evaluasi Inersia WCSS (Metode Elbow) dan Rata-Rata Skor Siluet](D:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/reports/figures/08_pemilihan_jumlah_klaster_elbow.png)
*Gambar 3.2 Kurva Evaluasi Inersia WCSS (Metode Elbow) dan Rata-Rata Skor Siluet ($k = 2$ s.d. $7$)*

Model $k = 4$ menguraikan heterogenitas wilayah menjadi empat arketipe yang berbeda nyata secara statistik, sebagaimana divisualisasikan pada proyeksi PCA Gambar 3.3 dan dirangkum pada Tabel 3.9.

![Gambar 3.3 Proyeksi 2D PCA Pemisahan 4 Klaster Sosioekonomi Indonesia](D:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/reports/figures/03_pca_cluster_projection_2d.png)
*Gambar 3.3 Proyeksi 2D PCA Pemisahan 4 Klaster Sosioekonomi Indonesia*

*Tabel 3.9 Karakteristik Profil Sosial-Ekonomi 4 Persona Klaster Wilayah Indonesia*

| Karakteristik Profil | Klaster 1: Perkotaan Modern & Formal | Klaster 2: Kabupaten Penyangga Mapan | Klaster 3: Perdesaan Agraris Rentan | Klaster 4: Wilayah 3T Deprivasi Akut |
| :--- | :---: | :---: | :---: | :---: |
| **Jumlah Anggota ($N$)** | **78 daerah (15,2%)** | **187 daerah (36,4%)** | **216 daerah (42,0%)** | **33 daerah (6,4%)** |
| **Komposisi Wilayah** | 68 Kota, 10 Kab. Metropolitan | 158 Kabupaten, 29 Kota | 212 Kabupaten, 4 Kota | 33 Kabupaten (100% 3T) |
| **Kemiskinan Moneter ($P_0$)** | **5,54%** | **9,68%** | **13,13%** | **31,39%** |
| **Akses Sanitasi Layak (%)** | 90,82% | 84,67% | 72,29% | 34,71% |
| **Akses Air Minum Layak (%)** | 95,84% | 91,48% | 84,28% | 65,30% |
| **Rata-rata Lama Sekolah** | 10,95 tahun (SMA+) | 8,34 tahun (SMP) | 8,13 tahun (SMP) | 5,23 tahun (Tidak Tamat SD) |
| **Pengeluaran Riil/Kapita** | Rp 14,60 Juta/Tahun | Rp 10,90 Juta/Tahun | Rp 8,94 Juta/Tahun | Rp 6,43 Juta/Tahun |
| **Pengangguran Terbuka (TPT)**| 8,01% | 4,92% | 4,37% | 3,36% |
| **Partisipasi Kerja (TPAK)** | 65,49% | 68,52% | 70,89% | 74,42% |
| **Umur Harapan Hidup (UHH)**| 72,74 tahun | 71,39 tahun | 67,67 tahun | 65,11 tahun |

![Gambar 3.4 Small Multiples Horizontal Bar Charts Deviasi Z-Score 7 Indikator per Klaster](D:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/reports/figures/04_cluster_profiles_small_multiples.png)
*Gambar 3.4 Small Multiples Horizontal Bar Charts Deviasi Z-Score 7 Indikator per Klaster*

![Gambar 3.5 Heatmap Matrix Karakteristik 28 Sel Nilai Rata-rata Z-Score Indikator Antarklaster](D:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/reports/figures/04_cluster_characteristics_heatmap.png)
*Gambar 3.5 Heatmap Matrix Karakteristik 28 Sel Nilai Rata-rata Z-Score Indikator Antarklaster*

*Catatan Refleksi Epistemik:* Nilai siluet $0,2028$ mencerminkan bahwa profil sosioekonomi kabupaten/kota di Indonesia membentuk suatu gradasi kontinum alami (Kaufman & Rousseeuw, 1990). Partisi klaster memiliki stabilitas tinggi (*Multi-seed ARI = 0,9803*). Keabsahan pemisahan profil kemiskinan divalidasi secara inferensial melalui uji beda rata-rata **ANOVA ($F = 155,94, p < 0,001$)** dan **Kruskal-Wallis ($H = 167,52, p < 0,001$)**, sebagaimana divisualisasikan pada Gambar 3.6.

![Gambar 3.6 Jittered Strip Plot Distribusi Kemiskinan (P0) Antarklaster dengan Anotasi ANOVA](D:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/reports/figures/05_poverty_distribution_stripplot.png)
*Gambar 3.6 Jittered Strip Plot Distribusi Kemiskinan ($P_0$) Antarklaster dengan Anotasi ANOVA ($F = 155,94, p < 0,001$)*

### **6. Matriks Skrining Kerentanan Relatif 2x2 ($P_0$ vs $V_{struc}$)**
Untuk menyediakan instrumen penapisan kebijakan yang bebas dari *target leakage*, dirumuskan indeks komposit kerentanan nonmoneter ($V_{struc}$):
$$V_{\text{struc}} = 0,25 \times (1 - \text{Sanitasi}) + 0,25 \times (1 - \text{Air}) + 0,25 \times \text{Defisit RLS} + 0,25 \times \text{Defisit UHH}$$
Dua garis referensi median nasional ($P_0 = 10,46\%$ dan $V_{struc} = 0,2720$) membagi 514 daerah ke dalam 4 kuadran kebijakan, sebagaimana dirangkum pada Tabel 3.10.

*Tabel 3.10 Distribusi Daerah pada Matriks Skrining Kerentanan Relatif 2x2*

| Kuadran Skrining | Kondisi Tipologi Wilayah | Jumlah Daerah (%) | Arah Rekomendasi Kebijakan Utama |
| :--- | :--- | :---: | :--- |
| **Kuadran I (Vermillion `#D55E00`)** | **Prioritas Utama (Beban Ganda):** $P_0 \ge 10,46\%$ dan $V_{\text{struc}} \ge 0,2720$ | **162 daerah (31,5%)** | Intervensi ganda: DAK Fisik Sanitasi/WASH afirmatif + Bantuan Sosial Tunai terintegrasi. |
| **Kuadran II (Warm Amber `#E69F00`)** | **Kerentanan Tersembunyi:** $P_0 < 10,46\%$ dan $V_{\text{struc}} \ge 0,2720$ | **95 daerah (18,5%)** | Intervensi preventif infrastruktur dasar sebelum daerah jatuh ke dalam kemiskinan moneter. |
| **Kuadran III (Reddish Purple `#CC79A7`)**| **Kantong Daya Beli:** $P_0 \ge 10,46\%$ dan $V_{\text{struc}} < 0,2720$ | **95 daerah (18,5%)** | Stimulus ekonomi lokal, kredit usaha produktif, dan *Local Content Requirement* industri enklave. |
| **Kuadran IV (Navy Blue `#0072B2`)** | **Wilayah Terbina / Mapan:** $P_0 < 10,46\%$ dan $V_{\text{struc}} < 0,2720$ | **162 daerah (31,5%)** | Pemeliharaan standar pelayanan minimal, inovasi fiskal daerah mandiri, dan transfer keahlian. |

![Gambar 3.7 Matriks Skrining Kerentanan Relatif 2x2 (P0 vs V_struc) 514 Kabupaten/Kota](D:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/reports/figures/06_relative_vulnerability_matrix_2x2.png)
*Gambar 3.7 Matriks Skrining Kerentanan Relatif 2x2 ($P_0$ vs $V_{struc}$) 514 Kabupaten/Kota*

### **7. Ekonometrika Multivariat OLS & Koefisien Beta Baku**
Estimasi parameter regresi terstandarisasi baku OLS beserta tingkat signifikansinya disajikan pada Tabel 3.11.

*Tabel 3.11 Estimasi Koefisien Regresi Terstandarisasi Baku OLS Determinan Kemiskinan ($R^2 = 0,5180$)*

| Variabel Penjelas | Koefisien Baku ($\beta$) | Standar Error | $t$-statistik | Nilai $p$ ($p$-value) | Signifikansi |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Konstanta / Intercept** | 0,0000 | 0,0307 | 0,000 | 1,0000 | ns |
| **Pengeluaran Riil (Daya Beli)** | **-0,3167** | 0,0544 | **-5,821** | **< 0,0001** | Signifikan (p < 0,0001) |
| **Akses Sanitasi Layak** | **-0,2090** | 0,0448 | **-4,664** | **< 0,0001** | Signifikan (p < 0,0001) |
| $\log_{10}(\text{PDRB})$ **Riil** | **-0,1970** | 0,0458 | **-4,302** | **< 0,0001** | Signifikan (p < 0,0001) |
| **Partisipasi Kerja (TPAK)** | **+0,1826** | 0,0411 | **+4,443** | **< 0,0001** | Signifikan (p < 0,0001) |
| **Lama Sekolah (RLS)** | **-0,1182** | 0,0501 | **-2,359** | **0,0186** | Signifikan (p = 0,0186) |
| **Pengangguran Terbuka (TPT)** | +0,0928 | 0,0454 | +2,044 | 0,0415 | Signifikan Lemah (p = 0,0415) |
| **Akses Air Minum Layak** | +0,0507 | 0,0391 | +1,298 | 0,1949 | ns (Tidak Signifikan) |

Hasil estimasi model OLS pada Tabel 3.11 menunjukkan bahwa pengeluaran riil ($\beta = -0,3167$), akses sanitasi layak ($\beta = -0,2090$), dan skala ekonomi $\log_{10}(\text{PDRB})$ ($\beta = -0,1970$) merupakan tiga determinan pereduksi kemiskinan dengan koefisien terstandarisasi terbesar dan signifikan secara statistik ($p < 0,0001$). Sebaliknya, TPAK berkoefisien positif baku ($\beta = +0,1826$) memperkuat temuan empiris paradoks *The Working Poor* di daerah perdesaan subsistensi.

![Gambar 3.8 Horizontal Bar Chart Koefisien Terstandarisasi Baku Beta Model Regresi OLS](D:/ARFI/Kuliah/Project/project-semester5/PovertyRadar/reports/figures/10_ols_standardized_beta_bar.png)
*Gambar 3.8 Horizontal Bar Chart Koefisien Terstandarisasi Baku ($\beta$) Model Regresi OLS ($R^2 = 0,5180$)*

---

## **C. Tangkapan Layar Dashboard dan Link Dashboard Interaktif**

### **1. Arsitektur Antarmuka & Alur 5 Babak Cerita (5-Act Narrative Arc)**
Struktur pembagian babak narasi dashboard beserta tujuan analitis dan komponen visualisasinya dirangkum pada Tabel 3.12.

*Tabel 3.12 Spesifikasi Alur 5 Babak Dashboard PovertyRadar*

| Babak / Halaman | Komponen Rancang Bangun | Pertanyaan Kebijakan Kunci | Format Visual Utama (Standar Few & Knaflic) |
| :--- | :--- | :--- | :--- |
| **Babak 1** | `01. Poverty Landscape` (The Hook) | Seberapa lebar jurang kemiskinan antardaerah di Indonesia? | Kartu KPI Rasio 17,50x, Scatterplot Log-PDRB vs $P_0$, Bar Disparitas Wilayah Barat vs Timur. |
| **Babak 2** | `02. Poverty & Indicator Map` (The Geography) | Di mana lokasi kantong kemiskinan dan bagaimana ketimpangannya? | Peta Choropleth Nasional 514 Daerah, Kartu Dualisme Kota-Kabupaten (The Great Dualism). |
| **Babak 3** | `03. Regional Profiles` (The Archetypes) | Apa konfigurasi defisit pembeda antarkelompok wilayah? | Header Diagnostik ($k=4$, ARI 0,9803), Small Multiples Z-Score Bar, Heatmap 28 Sel, Validasi ANOVA. |
| **Babak 4** | `04. Priority & Implications` (Call to Action) | Daerah mana yang mendesak diintervensi dan apa rekomendasi programnya? | Matriks Kuadran 2x2 ($P_0$ vs $V_{struc}$), Case Pins (Kutukan Tambang & Madura), Lookup Kebijakan APBN/TKD. |
| **Babak 5** | `05. Methodology & Data Quality` (The Integrity) | Bagaimana temuan diperoleh dan apa batasan interpretasinya? | Rekonsiliasi BPS 2021, Bukti Dekonstruksi Kaggle 98,83%, Tabel Kasus Batas 0,00%, Koefisien Baku OLS ($\beta$). |

Arsitektur 5 babak di atas memastikan bahwa alur eksplorasi pengguna bergerak secara logis dari penggugah kesadaran makro (*The Hook*), pemetaan spasial (*The Geography*), diferensiasi kelompok (*The Archetypes*), hingga rekomendasi alokasi fiskal interaktif (*Call to Action*).

### **2. Fitur Unggulan Antarmuka & Penyorot Kasus Interaktif (Case-Study Pins)**
Antarmuka dilengkapi tombol penyorot studi kasus interaktif (*Interactive Case-Study Pins*) pada Halaman 4:
* **Pin Kutukan Sumber Daya:** Mengisolasi 29 kabupaten berpdrb jumbo ($\ge \text{Rp } 25\text{ Triliun}$) yang memiliki kemiskinan di atas median nasional.
* **Pin Disparitas Madura:** Mengisolasi 4 kabupaten di Pulau Madura yang terdeprivasi di tengah Pulau Jawa.
Saat pin diklik, titik-titik target membesar sementara titik lainnya meredup (*opacity 0.15*), dan panel samping menyajikan analisis kebijakan spesifik.

### **3. Spesifikasi Teknologi Antarmuka & Tautan Akses Live**
* **Teknologi Frontend:** React 19, TypeScript, Vite bundler, Apache ECharts, dan Tailwind CSS.
* **Pipeline Backend & Data:** Python 3.10/3.13, Pandas, Scikit-Learn, PyArrow (`src/poverty_radar/`).
* **Repositori Kode Sumber:** `https://github.com/Arfiadi/PovertyRadar-SDGs`

---

# **BAB IV** **KESIMPULAN**

## **4.1 Kesimpulan Utama**

1. **Disparitas Spasial Ekstrem 17,50x:** Kesenjangan kemiskinan moneter sangat curam, dari 2,38% (Sawahlunto) hingga 41,66% (Intan Jaya), dengan 86,9% kantong kemiskinan akut terkonsentrasi di Kawasan Timur.
2. **Dekonstruksi Mitos Pengangguran Terbuka:** TPT terbukti menyesatkan jika dijadikan parameter tunggal kemiskinan. Di pedesaan, kemiskinan beriringan dengan tingginya partisipasi kerja subsistensi (*The Working Poor Paradox*, $r = +0,462$).
3. **Kutukan Enklave Industri Ekstraktif (The Resource Curse):** PDRB raksasa gagal menyejahterakan warga lokal secara otomatis; 29 kabupaten dengan PDRB $\ge \text{Rp } 25\text{ Triliun}$ tetap memiliki kemiskinan di atas median nasional akibat minimnya *multiplier effect*.
4. **Daya Ungkit Vital Sanitasi Dasar:** Akses sanitasi berkorelasi bivariat 2,3x lipat lebih kuat ($r = -0,56$) terhadap kemiskinan dibanding PDRB nominal ($r = -0,24$), serta menjadi determinan signifikan pada model multivariat OLS ($\beta = -0,2090$).
5. **Efektivitas Kerangka Dua-Pilar & Storytelling:** Integrasi K-Means $k = 4$ dan Matriks Skrining 2x2 terbukti efektif menguraikan heterogenitas wilayah tanpa bias *target leakage*, didukung antarmuka 5 babak yang terstruktur bagi pengambil keputusan.

---

## **4.2 Rekomendasi Kebijakan (Policy Action Matrix)**

Berdasarkan sintesis profil kuadran kerentanan, rekomendasi intervensi program dan skema alokasi fiskal terarah dirumuskan pada Tabel 4.1.

*Tabel 4.1 Matriks Aksi Kebijakan Terarah (Policy Action Matrix) Berdasarkan Tipologi Kuadran Skrining*

| Kuadran Skrining | Status Prioritas Daerah | Instrumen Alokasi Fiskal APBN / TKD | Paket Intervensi Program Spesifik | Indikator Keberhasilan Target |
| :--- | :--- | :--- | :--- | :--- |
| **Kuadran I** ($P_0 \ge 10,46\%, V_{\text{struc}} \ge 0,2720$) | **Prioritas Kritis (Beban Ganda)** — 162 Daerah | **DAK Fisik Penugasan Afirmatif (Air Minum, Sanitasi, & Jalan) + Dana Insentif Fiskal Kemiskinan Ekstrem.** | 1. Pembangunan sanitasi komunal dan tangki septik individual.<br>2. Sambungan air minum perpipaan desa (SPAM Perdesaan).<br>3. Integrasi Bansos Tunai (PKH & Sembako) dengan verifikasi berkala. | Penurunan $P_0$ minimal 2,0% per tahun dan peningkatan sanitasi layak $\ge 15\%$. |
| **Kuadran II** ($P_0 < 10,46\%, V_{\text{struc}} \ge 0,2720$) | **Kerentanan Tersembunyi (Non-Moneter)** — 95 Daerah | **DAK Fisik Infrastruktur Dasar Lingkungan + Dana Desa Bidang Air Bersih & Sanitasi.** | 1. Program sanitasi total berbasis masyarakat (STBM).<br>2. Perbaikan sarana sanitasi sekolah dasar dan puskesmas pembantu.<br>3. Peningkatan kualitas rumah tidak layak huni (BSPS). | Eliminasi defisit $V_{struc}$ hingga $< 0,272$ sebelum terjadi transmisi ke kemiskinan moneter. |
| **Kuadran III** ($P_0 \ge 10,46\%, V_{\text{struc}} < 0,2720$) | **Kantong Keterbatasan Daya Beli** — 95 Daerah | **Dana Bagi Hasil (DBH) Sumber Daya Alam + Kredit Usaha Rakyat (KUR) Klaster Terpadu.** | 1. Regulasi *Local Content Requirement* (LCR) tenaga kerja lokal pada industri ekstraktif.<br>2. Hilirisasi produk pertanian dan perikanan melalui koperasi desa.<br>3. Pelatihan vokasi terakreditasi berbasis kebutuhan industri daerah. | Pertumbuhan pendapatan riil pekerja lokal dan penurunan $P_0$ menuju median nasional. |
| **Kuadran IV** ($P_0 < 10,46\%, V_{\text{struc}} < 0,2720$) | **Wilayah Terbina & Mapan** — 162 Daerah | **Dana Alokasi Umum (DAU) Berbasis Kinerja + Skema KPBU.** | 1. Pemeliharaan dan optimalisasi Standar Pelayanan Minimal (SPM).<br>2. Inovasi digital layanan publik dan iklim investasi berkelanjutan.<br>3. Skema transfer keahlian (*sister-city mentoring* ke Kuadran I). | Pertumbuhan ekonomi inklusif dan nol persen kemiskinan ekstrem (*Zero Extreme Poverty*). |

Matriks aksi kebijakan pada Tabel 4.1 memberikan panduan operasional bagi kementerian pengampu anggaran agar penyaluran DAK Fisik, Dana Desa, dan Dana Transfer Umum dialokasikan secara asimetris berbasis defisit riil wilayah, bukan berdasarkan formula populis yang seragam.

---

## **4.3 Keterbatasan Riset & Agenda Penelitian Mendatang**

1. **Sifat Data Cross-Sectional:** Menggunakan data potong lintang tahun 2021 sehingga koefisien OLS merefleksikan asosiasi multivariat antarwilayah pada satu titik waktu. Riset lanjutan disarankan menerapkan model data panel (*Fixed Effect / Random Effect*) atau *Spatial Durbin Model* untuk menguji efek lag waktu transfer fiskal.
2. **Efek Limpahan Spasial (Spatial Spillovers):** Model belum menginkorporasikan matriks bobot spasial ($W$). Pengembangan lanjutan dapat menerapkan *Spatial Autoregressive* (SAR) atau *Spatial Error Model* (SEM) guna mengukur eksternalitas geografis antardaerah.
3. **Penyempurnaan Integrasi Mikro-Makro:** Menggabungkan data agregat kabupaten/kota dengan mikro rumah tangga (Susenas mentah) melalui teknik *Small Area Estimation* (SAE) untuk mendekomposisi kemiskinan hingga tingkat kecamatan dan desa.

---

# **BAB V** **DAFTAR PUSTAKA**

Alkire, S., & Foster, J. (2011). Counting and multidimensional poverty measurement. *Journal of Public Economics*, 95(7–8), 476–487. https://doi.org/10.1016/j.jpubeco.2010.11.006

Auty, R. M. (1993). *Sustaining Development in Mineral Economies: The Resource Curse Thesis*. Routledge.

Badan Pusat Statistik. (2021). *Profil Kemiskinan di Indonesia Maret 2021* (Berita Resmi Statistik No. 56/07/Th. XXIV). Badan Pusat Statistik Republik Indonesia.

Badan Pusat Statistik. (2021). *Indikator Kesejahteraan Rakyat 2021*. BPS-Statistics Indonesia.

Badan Pusat Statistik. (2022). *Statistik Indonesia 2022*. BPS-Statistics Indonesia.

Bappenas. (2020). *Peta Jalan TPB/SDGs Indonesia Menuju 2030*. Kementerian Perencanaan Pembangunan Nasional / Bappenas Republik Indonesia.

Boeke, J. H. (1953). *Economics and Economic Policy of Dual Societies as Exemplified by Indonesia*. Institute of Pacific Relations.

Desbarats, N. (2022). *Practical Dashboards: Design Scenarios for Effective Action*. Practical Reporting Inc.

Few, S. (2006). *Information Dashboard Design: The Effective Visual Communication of Data*. O'Reilly Media.

Few, S. (2013). *Information Dashboard Design: Displaying Data for At-a-Glance Monitoring* (2nd ed.). Analytics Press.

Fields, G. S. (2011). *Working Hard, Working Poor: A Global Journey*. Oxford University Press.

Kaufman, L., & Rousseeuw, P. J. (1990). *Finding Groups in Data: An Introduction to Cluster Analysis*. John Wiley & Sons. https://doi.org/10.1002/9780470316801

Knaflic, C. N. (2015). *Storytelling with Data: A Data Visualization Guide for Business Professionals*. John Wiley & Sons.

Lewis, W. A. (1954). Economic development with unlimited supplies of labour. *The Manchester School*, 22(2), 139–191. https://doi.org/10.1111/j.1467-9957.1954.tb00021.x

Miranti, R. (2017). The multidimensionality of poverty in Indonesia: A regional perspective. *Bulletin of Indonesian Economic Studies*, 53(2), 173–198. https://doi.org/10.1080/00074918.2017.1324795

Sachs, J. D., & Warner, A. M. (2001). The curse of natural resources. *European Economic Review*, 45(4–6), 827–838. https://doi.org/10.1016/S0014-2921(01)00125-8

Sen, A. (1999). *Development as Freedom*. Oxford University Press.

Suryahadi, A., Hadiwidjaja, G., & Sumarto, S. (2012). Economic growth and poverty reduction in Indonesia before and after the Asian financial crisis. *Bulletin of Indonesian Economic Studies*, 48(2), 209–227. https://doi.org/10.1080/00074918.2012.694155

United Nations. (2015). *Transforming Our World: The 2030 Agenda for Sustainable Development* (A/RES/70/1). United Nations General Assembly.

[image1]: <data:image/png;base64,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>
