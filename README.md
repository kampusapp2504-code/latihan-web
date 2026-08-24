# Short Course: NumPy + Pandas + Matplotlib (Hands-on Jupyter Notebook)

## Isi paket ini

```
course/
├── Latihan_NumPy_Pandas_Matplotlib.ipynb   <- notebook utama (kerjakan ini)
├── data/
│   ├── sales.csv                           <- dataset utama (dipakai Step 1–8)
│   └── ecommerce_sales.csv                 <- dataset Final Challenge (Step 9, jangan dibuka dulu!)
├── requirements.txt
└── README.md
```

Dataset **sengaja dibuat "kotor"** (ada missing value, baris duplikat, kolom tanggal berupa teks) supaya latihan Data Cleaning di Step 5 benar-benar terpakai — bukan cuma formalitas.

## Setup Environment

### Opsi A — pakai `venv` (disarankan)

```bash
# 1. Buat virtual environment


# 2. Aktifkan
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Jalankan Jupyter Notebook
jupyter notebook
```

Setelah Jupyter terbuka di browser, klik `Latihan_NumPy_Pandas_Matplotlib.ipynb`.

### Opsi B — pakai Anaconda / Miniconda

```bash
conda create -n course-numpy-pandas python=3.11 -y
conda activate course-numpy-pandas
pip install -r requirements.txt
jupyter notebook
```

### Opsi C — pakai Google Colab (tanpa install apa pun)

1. Buka https://colab.research.google.com
2. Upload `Latihan_NumPy_Pandas_Matplotlib.ipynb`
3. Upload juga folder `data/` (atau upload `sales.csv` & `ecommerce_sales.csv` ke root Colab, lalu ubah path di notebook menjadi `"sales.csv"` tanpa prefix `data/`)

## Cara Mengerjakan

1. Buka notebook, jalankan sel **Setup** paling atas dulu (import numpy, pandas, matplotlib).
2. Kerjakan setiap **Latihan** secara berurutan — sel kode di bawah tiap instruksi sengaja dikosongkan, isi sendiri.
3. Jangan lompat ke Step 9 (Final Challenge) sebelum menyelesaikan Step 1–8. Step 9 pakai dataset baru (`ecommerce_sales.csv`) yang polanya mirip tapi tidak identik dengan `sales.csv`, supaya benar-benar menguji pemahaman, bukan hafalan.
4. Notebook ini akan berkembang jadi satu portfolio project utuh: Data Loading → Cleaning → Processing → Analysis → Statistical Analysis → Visualization → Business Insights.

Selamat belajar! 🚀

## CRUD dashboard Google Sheets

Untuk mengaktifkan Create, Update, dan Delete tanpa Service Account:

1. Buka spreadsheet, pilih **Extensions → Apps Script**.
2. Salin isi `apps-script/Code.gs` ke editor Apps Script.
3. Sesuaikan `SHEET_NAME` jika nama tab bukan `Sheet1`.
4. Pilih **Deploy → New deployment → Web app**.
5. Jalankan sebagai pemilik spreadsheet dan beri akses **Anyone**.
6. Salin URL Web App ke `.env.local`:

```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

Restart server Next.js. Dashboard akan memakai Apps Script untuk CRUD dan tetap memakai Google Sheets gviz untuk membaca data.
