export interface ParadoxItem {
  id: string;
  name: string;
  actionTitle: string;
  page: string;
  insightCallout: string;
  evidence: string;
  caseDistricts?: string[];
}

export const PARADOXES: Record<string, ParadoxItem> = {
  workingPoor: {
    id: "paradox-1",
    name: "The Working Poor",
    page: "02_IndicatorMap",
    actionTitle: "The Working Poor: Tekanan Kerja Subsistensi Menekan Angka Pengangguran di Daerah Miskin",
    insightCallout: "Angka pengangguran rendah di wilayah 3T mencerminkan tekanan kerja subsistensi bertahan hidup (r = +0.462), bukan tingginya kemakmuran, sementara pengangguran kota didominasi pencari kerja terdidik.",
    evidence: "TPT Nduga 0.00% (TPAK 97.93%, P0 37.18%) vs Kota Depok TPT 9.76% (P0 2.58%).",
    caseDistricts: ["Nduga", "Lanny Jaya", "Puncak", "Kota Depok"]
  },
  greatDualism: {
    id: "paradox-2",
    name: "The Great Dualism",
    page: "02_IndicatorMap",
    actionTitle: "The Great Dualism: Kabupaten ~1.9x Lebih Miskin, Namun Kota ~1.8x Lebih Menganggur",
    insightCallout: "Kabupaten menanggung kemiskinan 1.9x lebih tinggi dari kota, namun kota menanggung pengangguran 1.8x lebih tinggi, menuntut pemisahan intervensi: kerja formal perkotaan vs sarana dasar perdesaan.",
    evidence: "Rasio kemiskinan Kabupaten:Kota = 1.87x; Rasio pengangguran Kota:Kabupaten = 1.82x."
  },
  resourceCurse: {
    id: "paradox-3",
    name: "The Resource Curse",
    page: "04_PriorityImplications",
    actionTitle: "Kutukan Sumber Daya: 29 Daerah Lumbung Tambang Jumbo Terjebak Kemiskinan di Atas Median",
    insightCallout: "Sebanyak 29 daerah lumbung tambang (PDRB ≥ Rp 25 Triliun) terjebak kemiskinan di atas median nasional akibat distorsi enclave economy ekstraktif yang minim menyerap tenaga kerja lokal.",
    evidence: "Kab. Mimika (PDRB Rp69.6T, P0 14.17%), Bojonegoro (Rp65.8T, P0 13.27%), Morowali (Rp54.9T, P0 13.75%), Musi Banyuasin (Rp46.1T, P0 15.84%), Teluk Bintuni (Rp25.1T, P0 29.79%).",
    caseDistricts: ["Mimika", "Bojonegoro", "Morowali", "Musi Banyuasin", "Teluk Bintuni"]
  },
  basicServices: {
    id: "paradox-4",
    name: "Sanitasi & Air Dasar vs PDRB",
    page: "03_RegionalProfiles",
    actionTitle: "Faktor Layanan Dasar: Akses Sanitasi & Air Beriringan Sangat Kuat dengan Disparitas Kemiskinan",
    insightCallout: "Sanitasi layak (r = -0.562) dan air bersih (r = -0.374) beriringan jauh lebih konsisten dengan penurunan kemiskinan dibanding skala PDRB nominal (r = -0.240), membuktikan esensialnya layanan dasar permukiman.",
    evidence: "Korelasi Pearson: Sanitasi r = -0.562, Air r = -0.374, Log PDRB r = -0.527."
  },
  maduraDisparity: {
    id: "paradox-5",
    name: "Disparitas Madura",
    page: "04_PriorityImplications",
    actionTitle: "Disparitas Madura: Jembatan Fisik Suramadu (5.4 km) Belum Mampu Memutus Jurang Kemiskinan",
    insightCallout: "Hanya berjarak 5.4 km Suramadu, Kota Surabaya maju dan mapan sementara Kabupaten Sampang terjebak kemiskinan 23.8%, membuktikan infrastruktur fisik semata tidak memadai tanpa pemenuhan modal manusia.",
    evidence: "Surabaya (P0 5.23%, RLS 10.51) vs Sampang (P0 23.76%, RLS 4.86), Bangkalan (P0 21.57%), Pamekasan (P0 15.30%), Sumenep (P0 20.51%).",
    caseDistricts: ["Sampang", "Bangkalan", "Pamekasan", "Sumenep", "Kota Surabaya"]
  },
  westernAnomaly: {
    id: "paradox-6",
    name: "3T di Kawasan Barat",
    page: "01_PovertyLandscape",
    actionTitle: "Anomali Barat: Kepulauan Terisolir Menyerupai Profil Deprivasi Akut Kawasan Timur",
    insightCallout: "86.9% kantong kemiskinan akut terkonsentrasi di Kawasan Timur, namun profil deprivasi serupa juga muncul di kantong kepulauan terisolir barat seperti Nias dan Mentawai.",
    evidence: "Nias Barat (P0 26.42%), Nias Selatan (P0 16.92%), Kepulauan Mentawai (P0 14.84%).",
    caseDistricts: ["Nias", "Nias Selatan", "Nias Barat", "Nias Utara", "Kepulauan Mentawai"]
  },
  educatedPoor: {
    id: "paradox-7",
    name: "The Educated Poor",
    page: "03_RegionalProfiles",
    actionTitle: "The Educated Poor: RLS Tinggi di Kepulauan Terpencil Namun Kemiskinan Tetap Kritis",
    insightCallout: "Kabupaten kepulauan terpencil Papua mencatatkan RLS setara SMP/SMA (8.2–9.2 tahun) namun kemiskinan tetap di atas 29%, menunjukkan pendidikan tanpa penyerapan industri produktif lokal belum mampu memutus kemiskinan.",
    evidence: "Kab. Supiori (RLS 8.87 thn, P0 37.91%), Kab. Waropen (RLS 9.21 thn, P0 29.85%), Kab. Teluk Bintuni (RLS 8.22 thn, P0 29.79%).",
    caseDistricts: ["Supiori", "Waropen", "Teluk Bintuni"]
  },
  kaggleDeconstruction: {
    id: "paradox-8",
    name: "Dekonstruksi Label Kaggle",
    page: "05_MethodologyAudit",
    actionTitle: "Dekonstruksi Label Kaggle: Pembuktian Ilmiah 98.8% Akurasi Rekonstruksi Aturan Biner",
    insightCallout: "Label biner bawaan Kaggle dibongkar sebagai aturan deterministik sederhana dengan kecocokan 98.83% (508 daerah), membuktikan label tersebut bukan ground truth BPS dan wajib ditolak demi mencegah target leakage.",
    evidence: "508 dari 514 daerah cocok sempurna (98.83% akurasi rekonstruksi)."
  },
  olsStandardizedBeta: {
    id: "paradox-9",
    name: "Koefisien Terstandarisasi OLS",
    page: "05_MethodologyAudit",
    actionTitle: "Ekonometrika OLS: Pengeluaran Riil (β = -0.318) & Sanitasi (β = -0.190) Mendominasi Variasi",
    insightCallout: "Hasil multivariat OLS membuktikan daya beli warga (β = -0.318) dan sanitasi fisik (β = -0.190) memegang pengaruh negatif terkuat pada kemiskinan, sementara TPAK justru berkoefisien positif signifikan (β = +0.179).",
    evidence: "Koefisien baku: Pengeluaran (-0.318) > Sanitasi (-0.190) = Log PDRB (-0.190) > TPAK (+0.179) > RLS (-0.113) > TPT (+0.100)."
  }
};
