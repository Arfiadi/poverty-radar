export interface ParadoxItem {
  id: string;
  name: string;
  actionTitle: string;
  page: string;
  insightCallout: string;
  evidence: string;
  caseDistricts?: string[];
  disclaimer?: string;
}

export const EPISTEMIC_DISCLAIMER = "Pola sebaran menunjukkan kecenderungan data empiris pada 514 kabupaten/kota.";

export const PARADOXES: Record<string, ParadoxItem> = {
  workingPoor: {
    id: "paradox-1",
    name: "The Working Poor",
    page: "02_IndicatorMap",
    actionTitle: "The Working Poor: Tingginya Partisipasi Kerja Berbanding Lurus dengan Kemiskinan Daerah",
    insightCallout: "Tingkat pengangguran rendah di wilayah 3T beriringan dengan tingginya tekanan kerja subsistensi bertahan hidup (r = +0.462), sementara pengangguran kota didominasi oleh pencari kerja terdidik.",
    evidence: "TPT Nduga 0.00% (TPAK 97.93%, P0 37.18%) vs Kota Depok TPT 9.76% (P0 2.58%).",
    caseDistricts: ["Nduga", "Lanny Jaya", "Puncak", "Kota Depok"]
  },
  greatDualism: {
    id: "paradox-2",
    name: "The Great Dualism",
    page: "02_IndicatorMap",
    actionTitle: "The Great Dualism: Kabupaten ~1.9x Lebih Miskin, Namun Kota ~1.8x Lebih Menganggur",
    insightCallout: "Kabupaten menanggung tingkat kemiskinan 1.9x lebih tinggi dari kota, namun kota menanggung pengangguran 1.8x lebih tinggi. Temuan ini menuntut diferensiasi fokus: penyerapan tenaga kerja formal perkotaan versus pemenuhan sarana dasar perdesaan.",
    evidence: "Rasio kemiskinan Kabupaten:Kota = 1.87x; Rasio pengangguran Kota:Kabupaten = 1.82x."
  },
  resourceCurse: {
    id: "paradox-3",
    name: "The Resource Curse",
    page: "04_PriorityImplications",
    actionTitle: "Kutukan Sumber Daya: Enklave Tambang & Migas Skala Besar Berada di Atas Median Kemiskinan Nasional",
    insightCallout: "Sentra pertambangan dan migas utama (seperti Mimika, Morowali, Teluk Bintuni, Bojonegoro, dan Muara Enim) memiliki tingkat kemiskinan di atas median nasional, sejalan dengan keterbatasan penyerapan tenaga kerja lokal pada sektor industri ekstraktif modal padat.",
    evidence: "Kab. Mimika (PDRB Rp69.6T, P0 14.17%), Bojonegoro (Rp65.8T, P0 13.27%), Morowali (Rp54.9T, P0 13.75%), Musi Banyuasin (Rp46.1T, P0 15.84%), Teluk Bintuni (Rp25.1T, P0 29.79%).",
    caseDistricts: ["Mimika", "Bojonegoro", "Morowali", "Musi Banyuasin", "Teluk Bintuni", "Muara Enim", "Tanjung Jabung Barat", "Tuban", "Sumbawa Barat"]
  },
  basicServices: {
    id: "paradox-4",
    name: "Sanitasi & Air Dasar vs PDRB",
    page: "03_RegionalProfiles",
    actionTitle: "Faktor Layanan Dasar: Akses Sanitasi & Air Beriringan Kuat dengan Variasi Kemiskinan",
    insightCallout: "Akses sanitasi layak (r = -0.562) dan air bersih (r = -0.374) menunjukkan korelasi negatif yang lebih konsisten terhadap tingkat kemiskinan dibandingkan skala PDRB daerah (r = -0.240).",
    evidence: "Korelasi Pearson terhadap P0: Sanitasi r = -0.562, Air r = -0.374, Log PDRB r = -0.527."
  },
  maduraDisparity: {
    id: "paradox-5",
    name: "Disparitas Madura",
    page: "04_PriorityImplications",
    actionTitle: "Disparitas Madura: Jembatan Fisik Suramadu (5.4 km) Belum Mengikis Jurang Kemiskinan Regional",
    insightCallout: "Hanya terpisah jembatan 5.4 km Suramadu, Kota Surabaya tergolong mapan (P0 5.2%), sementara Kabupaten Sampang mencatatkan kemiskinan 23.8%. Ketersediaan infrastruktur penghubung fisik beriringan dengan bertahannya jurang modal manusia dan sanitasi dasar.",
    evidence: "Surabaya (P0 5.23%, RLS 10.51) vs Sampang (P0 23.76%, RLS 4.86), Bangkalan (P0 21.57%), Pamekasan (P0 15.30%), Sumenep (P0 20.51%).",
    caseDistricts: ["Sampang", "Bangkalan", "Pamekasan", "Sumenep", "Kota Surabaya"]
  },
  westernAnomaly: {
    id: "paradox-6",
    name: "3T di Kawasan Barat",
    page: "01_PovertyLandscape",
    actionTitle: "Anomali Barat: Kepulauan Terisolir Menyerupai Profil Deprivasi Akut Kawasan Timur",
    insightCallout: "Sebanyak 86.9% wilayah kemiskinan kritis (P0 ≥ 20%) terkonsentrasi di Kawasan Timur, namun pola deprivasi serupa juga dijumpai pada kantong kepulauan terisolir di barat seperti Nias dan Mentawai.",
    evidence: "Nias Barat (P0 26.42%), Nias Selatan (P0 16.92%), Kepulauan Mentawai (P0 14.84%).",
    caseDistricts: ["Nias", "Nias Selatan", "Nias Barat", "Nias Utara", "Kepulauan Mentawai"]
  },
  educatedPoor: {
    id: "paradox-7",
    name: "The Educated Poor",
    page: "03_RegionalProfiles",
    actionTitle: "The Educated Poor: Rata-rata Lama Sekolah Tinggi di Kepulauan Terpencil Namun Kemiskinan Tetap Kritis",
    insightCallout: "Kabupaten kepulauan Papua mencatatkan rata-rata lama sekolah setara SMP/SMA (8.2–9.2 tahun), namun kemiskinan bertahan di atas 29%. Capaian pendidikan formal belum diimbangi oleh penyerapan kerja produktif di perekonomian lokal.",
    evidence: "Kab. Supiori (RLS 8.87 thn, P0 37.91%), Kab. Waropen (RLS 9.21 thn, P0 29.85%), Kab. Teluk Bintuni (RLS 8.22 thn, P0 29.79%).",
    caseDistricts: ["Supiori", "Waropen", "Teluk Bintuni"]
  },
  kaggleDeconstruction: {
    id: "paradox-8",
    name: "Dekonstruksi Label Kaggle",
    page: "05_MethodologyAudit",
    actionTitle: "Dekonstruksi Label Kaggle: Pembuktian Ilmiah 98.8% Akurasi Rekonstruksi Aturan Biner",
    insightCallout: "Label biner bawaan Kaggle dibongkar sebagai aturan heuristik deterministik sederhana dengan kecocokan 98.83% (508 daerah), menunjukkan label tersebut merupakan artefak komputasi dan wajib dieliminasi demi mencegah kebocoran target.",
    evidence: "508 dari 514 daerah cocok sempurna (98.83% akurasi rekonstruksi)."
  },
  olsStandardizedBeta: {
    id: "paradox-9",
    name: "Koefisien Terstandarisasi OLS",
    page: "05_MethodologyAudit",
    actionTitle: "Ekonometrika OLS: Pengeluaran Riil (β = -0.318) & Sanitasi (β = -0.190) Memiliki Asosiasi Terkuat",
    insightCallout: "Estimasi model multivariat OLS menunjukkan kapasitas daya beli riil (β = -0.318) dan sarana sanitasi (β = -0.190) memiliki bobot asosiasi negatif terkuat terhadap variasi kemiskinan, sedangkan partisipasi kerja (TPAK) beriringan positif (β = +0.179).",
    evidence: "Koefisien baku terstandarisasi: Pengeluaran (-0.318) > Sanitasi (-0.190) = Log PDRB (-0.190) > TPAK (+0.179) > RLS (-0.113) > TPT (+0.100)."
  },
  baritoKuala: {
    id: "paradox-10",
    name: "Kerentanan Tersembunyi Barito Kuala",
    page: "04_PriorityImplications",
    actionTitle: "Kerentanan Tersembunyi: Kemiskinan Moneter Rendah (5.11%) Menyimpan Krisis Sanitasi Laten (55.29%)",
    insightCallout: "Kemiskinan konsumsi yang rendah di Barito Kuala (P0 5.11%) menyamarkan defisit fasilitas fisik (44.7% warga belum memiliki sanitasi layak). Prioritas intervensi bertumpu pada belanja modal sanitasi lahan pasang surut, melengkapi bantuan sosial konsumsi.",
    evidence: "Barito Kuala (P0 5.11%, Sanitasi 55.29%, Air 65.15%, UHH 66.86 thn, V_struc 0.4475). Intervensi terverifikasi: 4.500 unit tangki biofilter lahan basah.",
    caseDistricts: ["Barito Kuala", "Tanah Datar", "Mandailing Natal", "Lebak"]
  }
};
