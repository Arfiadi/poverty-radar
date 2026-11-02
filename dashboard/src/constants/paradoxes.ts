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
    insightCallout: "Angka pengangguran terbuka (TPT) yang sangat rendah di wilayah 3T (~0.00%) bukan tanda kemakmuran, melainkan cerminan keharusan mutlak warga bekerja subsistensi harian demi bertahan hidup (korelasi r = +0.462 antara P0 dan TPAK). Sebaliknya, pengangguran perkotaan didominasi pencari kerja terdidik (search unemployment).",
    evidence: "TPT Nduga 0.00% (TPAK 97.93%, P0 37.18%) vs Kota Depok TPT 9.76% (P0 2.58%).",
    caseDistricts: ["Nduga", "Lanny Jaya", "Puncak", "Kota Depok"]
  },
  greatDualism: {
    id: "paradox-2",
    name: "The Great Dualism",
    page: "02_IndicatorMap",
    actionTitle: "The Great Dualism: Kabupaten ~1.9x Lebih Miskin, Namun Kota ~1.8x Lebih Menganggur",
    insightCallout: "Kabupaten mencatatkan tingkat kemiskinan rata-rata 13.51% (hampir 2x lipat kota 7.22%), namun kota mencatat tingkat pengangguran terbuka 7.92% (1.8x lipat kabupaten 4.36%). Polarisasi ini menuntut pemisahan strategi intervensi: perluasan lapangan kerja formal di perkotaan vs penguatan produktivitas agraris & sarana dasar di perdesaan.",
    evidence: "Rasio kemiskinan Kabupaten:Kota = 1.87x; Rasio pengangguran Kota:Kabupaten = 1.82x."
  },
  resourceCurse: {
    id: "paradox-3",
    name: "The Resource Curse",
    page: "04_PriorityImplications",
    actionTitle: "Kutukan Sumber Daya: 29 Daerah Lumbung Tambang Jumbo Terjebak Kemiskinan di Atas Median",
    insightCallout: "Sebanyak 29 daerah dengan PDRB raksasa (≥ Rp 25 Triliun) tetap mencatatkan persentase kemiskinan di atas median nasional 10.46%. Ini menandakan terjadinya distorsi enclave economy ekstraktif di mana nilai tambah komoditas diserap ke luar daerah tanpa penyerapan tenaga kerja lokal yang memadai.",
    evidence: "Kab. Mimika (PDRB Rp69.6T, P0 14.17%), Bojonegoro (Rp65.8T, P0 13.27%), Morowali (Rp54.9T, P0 13.75%), Musi Banyuasin (Rp46.1T, P0 15.84%), Teluk Bintuni (Rp25.1T, P0 29.79%).",
    caseDistricts: ["Mimika", "Bojonegoro", "Morowali", "Musi Banyuasin", "Teluk Bintuni"]
  },
  basicServices: {
    id: "paradox-4",
    name: "Sanitasi & Air Dasar vs PDRB",
    page: "03_RegionalProfiles",
    actionTitle: "Faktor Layanan Dasar: Akses Sanitasi & Air Beriringan Sangat Kuat dengan Disparitas Kemiskinan",
    insightCallout: "Pada analisis bivariat, akses sanitasi layak (r = -0.562) dan air bersih (r = -0.374) beriringan jauh lebih konsisten dengan penurunan kemiskinan dibanding skala nominal PDRB (r = -0.240). Pada ekonometrika multivariat OLS, sanitasi (β = -0.190) dan log PDRB (β = -0.190) keduanya berkontribusi komplementer.",
    evidence: "Korelasi Pearson: Sanitasi r = -0.562, Air r = -0.374, Log PDRB r = -0.527."
  },
  maduraDisparity: {
    id: "paradox-5",
    name: "Disparitas Madura",
    page: "04_PriorityImplications",
    actionTitle: "Disparitas Madura: Jembatan Fisik Suramadu (5.4 km) Belum Mampu Memutus Jurang Kemiskinan",
    insightCallout: "Hanya berjarak 5.4 km melalui Jembatan Suramadu, Kota Surabaya mencatat kemiskinan 5.23% (RLS 10.51 tahun), sementara Kab. Sampang mencatat kemiskinan 23.76% (RLS 4.86 tahun). Bukti empiris bahwa infrastruktur konektivitas fisik semata tidak memadai tanpa pemenuhan modal manusia dan sarana permukiman.",
    evidence: "Surabaya (P0 5.23%, RLS 10.51) vs Sampang (P0 23.76%, RLS 4.86), Bangkalan (P0 21.57%), Pamekasan (P0 15.30%), Sumenep (P0 20.51%).",
    caseDistricts: ["Sampang", "Bangkalan", "Pamekasan", "Sumenep", "Kota Surabaya"]
  },
  westernAnomaly: {
    id: "paradox-6",
    name: "3T di Kawasan Barat",
    page: "01_PovertyLandscape",
    actionTitle: "Anomali Barat: Kepulauan Terisolir Menyerupai Profil Deprivasi Akut Kawasan Timur",
    insightCallout: "Meskipun 86.9% kantong kemiskinan akut (P0 ≥ 20%) berada di Kawasan Timur, kawasan barat menyumbang 13.1% (8 daerah terisolir seperti Kepulauan Nias dan Mentawai) yang memiliki akses sanitasi kritis (38.9%) dan RLS rendah (6.4 tahun).",
    evidence: "Nias Barat (P0 26.42%), Nias Selatan (P0 16.92%), Kepulauan Mentawai (P0 14.84%).",
    caseDistricts: ["Nias", "Nias Selatan", "Nias Barat", "Nias Utara", "Kepulauan Mentawai"]
  },
  educatedPoor: {
    id: "paradox-7",
    name: "The Educated Poor",
    page: "03_RegionalProfiles",
    actionTitle: "The Educated Poor: RLS Tinggi di Kepulauan Terpencil Namun Kemiskinan Tetap Kritis",
    insightCallout: "Kabupaten kepulauan terpencil di Papua mencatatkan RLS setara SMP/SMA (8.2 - 9.2 tahun), namun persentase kemiskinan tetap ekstrem di atas 27% hingga 38%. Menunjukkan bahwa peningkatan lama sekolah tanpa penyerapan pasar kerja produktif bernilai tambah lokal tidak mampu mengentaskan kemiskinan.",
    evidence: "Kab. Supiori (RLS 8.87 thn, P0 37.91%), Kab. Waropen (RLS 9.21 thn, P0 29.85%), Kab. Teluk Bintuni (RLS 8.22 thn, P0 29.79%).",
    caseDistricts: ["Supiori", "Waropen", "Teluk Bintuni"]
  },
  kaggleDeconstruction: {
    id: "paradox-8",
    name: "Dekonstruksi Label Kaggle",
    page: "05_MethodologyAudit",
    actionTitle: "Dekonstruksi Label Kaggle: Pembuktian Ilmiah 98.8% Akurasi Rekonstruksi Aturan Biner",
    insightCallout: "Label biner bawaan Kaggle berhasil dibongkar secara matematis sebagai aturan deterministik sederhana: Class 1 <=> (P0 > 20%) OR (Pengeluaran <= 6.25 Juta AND Sanitasi <= 56%), dengan kecocokan 98.8% (508 dari 514 daerah). Membuktikan bahwa label tersebut bukan ground truth BPS dan wajib ditolak demi mencegah target leakage.",
    evidence: "508 dari 514 daerah cocok sempurna (98.83% akurasi rekonstruksi)."
  },
  olsStandardizedBeta: {
    id: "paradox-9",
    name: "Koefisien Terstandarisasi OLS",
    page: "05_MethodologyAudit",
    actionTitle: "Ekonometrika OLS: Pengeluaran Riil (β = -0.318) & Sanitasi (β = -0.190) Mendominasi Variasi",
    insightCallout: "Hasil estimasi multivariat OLS terstandarisasi membuktikan bahwa daya beli warga (β = -0.318, p < 0.0001) dan sanitasi fisik (β = -0.190, p < 0.0001) memegang koefisien terstandarisasi negatif terkuat, diikuti log PDRB (β = -0.190), sementara TPAK justru berkoefisien positif signifikan (β = +0.179, p < 0.0001).",
    evidence: "Koefisien baku: Pengeluaran (-0.318) > Sanitasi (-0.190) = Log PDRB (-0.190) > TPAK (+0.179) > RLS (-0.113) > TPT (+0.100)."
  }
};
