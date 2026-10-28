# PovertyRadar SDGs: Development & Engineering Guide

## PANDUAN PENGEMBANGAN TEKNIS, ENVIRONMENT, & WORKFLOW
**Versi:** 1.0  
**Tanggal:** 28 Oktober 2026  
**Mata Kuliah:** Presentasi Data dan Storytelling  
**Tujuan Dokumen:** Memberikan panduan praktis penyiapan lingkungan kerja (*environment*), standar penulisan kode, alur kerja verifikasi reproduksibilitas otomatis, serta konvensi version control (Git) untuk kolaborasi tim dan coding agent.

---

## 1. Toolchain & Lingkungan Komputasi

Repositori ini dikembangkan pada ekosistem Python modern berbasis manajemen paket `uv` dan virtual environment lokal.

### 1.1 Spesifikasi Runtime
* **Python Runtime:** Python 3.13 (kompatibel dengan Python $\ge 3.10$).
* **Package & Dependency Manager:** `uv` (versi $\ge 0.11$) atau `pip` terisolasi di dalam `.venv`.
* **Sistem Operasi:** Agnostik OS (Windows, Linux, macOS).
* **Batasan Komputasi:** Mengingat dataset hanya berskala 514 baris observasi, seluruh tahapan audit, komputasi Isolation Forest, dan K-Means clustering dijalankan secara efisien di lingkungan CPU lokal tanpa memerlukan akselerasi GPU.

---

## 2. Setup Lingkungan Lokal (Quickstart Environment Setup)

### Menggunakan `uv` (Direkomendasikan)
```powershell
# 1. Buat virtual environment
uv venv .venv

# 2. Aktifkan virtual environment (Windows PowerShell)
.venv\Scripts\Activate.ps1

# 3. Instal dependensi data science dan visualisasi
uv pip install pandas numpy scikit-learn matplotlib seaborn jupyter nbconvert nbformat
```

### Menggunakan `pip` Standar
```powershell
# 1. Buat virtual environment
python -m venv .venv

# 2. Aktifkan virtual environment
.venv\Scripts\activate

# 3. Instal dependensi
pip install pandas numpy scikit-learn matplotlib seaborn jupyter nbconvert nbformat
```

---

## 3. Alur Kerja Verifikasi & Reproduksibilitas (Execution Workflows)

Untuk mematuhi prinsip *Evidence-Based Verification* (membedakan status terverifikasi dari asumsi), setiap perubahan kode atau pipeline data harus dapat diverifikasi secara otomatis melalui baris perintah (*headless CLI*).

### 3.1 Menjalankan Eksekusi Notebook Nir-UI
Untuk memvalidasi bahwa seluruh analisis, pembersihan data, dan visualisasi notebook dapat dieksekusi tanpa error dari awal hingga akhir:

```powershell
# Eksekusi notebook audit data secara headless
jupyter nbconvert --to notebook --execute notebooks/01_data_audit_and_understanding.ipynb
```

> **Ekspektasi Kelulusan:** Perintah harus selesai dengan kode keluar 0 (`exit code 0`), menandakan seluruh sel notebook berhasil dieksekusi secara berurutan.

### 3.2 Menjalankan Uji Integritas Data Cepat (Smoke Test)
```powershell
# Verifikasi integritas baris dan ketiadaan nilai hilang pada data interim
python -c "import pandas as pd; df = pd.read_csv('data/interim/poverty_data_cleaned.csv'); assert len(df) == 514; assert df.isnull().sum().sum() == 0; print('Interim Data Check: PASS')"
```

---

## 4. Standar Penulisan Kode & Konvensi Rekayasa

1. **Bahasa Penulisan:**
   * Komunikasi/penjelasan hasil: **Bahasa Indonesia**.
   * Seluruh kode Python, nama fungsi, nama kelas, variabel, docstrings, komentar kode, dan pesan commit: **English**.
2. **Manajemen Jalur Berkas (Paths):**
   * Selalu gunakan modul `pathlib.Path` berbasis jalur relatif dari akar proyek.
   * **Dilarang keras** menggunakan jalur absolut spesifik mesin (misal: `D:\ARFI\...` atau `C:\Users\...`) di dalam skrip aplikasi atau notebook agar kode dapat dijalankan di komputer kolaborator lain.
3. **Integritas Reproduksibilitas:**
   * Seluruh proses komputasi yang melibatkan keacakan (*randomness*) wajib menetapkan *seed* deterministik: `random_state = 42`.
4. **Keamanan & Kualitas:**
   * Dilarang menggunakan fungsi berbahaya seperti `eval()` atau `exec()`.
   * Tangani perkecualian (*exceptions*) secara spesifik; jangan menelan error dengan `except Exception: pass`.
   * Gunakan `logging` atau print terstruktur dengan penanganan encoding UTF-8 di Windows (`sys.stdout.reconfigure(encoding='utf-8')`).

---

## 5. Konvensi Version Control (Git Workflow)

1. **Format Pesan Commit:**
   Seluruh pesan commit wajib mematuhi spesifikasi resmi **[Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)** yang ditulis dalam bahasa Inggris (*in English*). Gunakan format: `<type>[optional scope]: <description in English>`.
2. **Aturan Keamanan Berkas Git:**
   * Berkas mentah besar, model biner, dan environment `.venv/` tidak boleh di-commit ke repositori (gunakan `.gitignore`).
   * Dilarang melakukan force-push (`git push --force`) atau mereset histori commit tanpa kesepakatan bersama.

