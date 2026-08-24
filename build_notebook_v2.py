import nbformat as nbf

nb = nbf.v4.new_notebook()
cells = []

def md(text):
    cells.append(nbf.v4.new_markdown_cell(text))

def code(text=""):
    cells.append(nbf.v4.new_code_cell(text))

def hint(text):
    """Bikin blok hint yang bisa di-collapse (klik untuk buka)."""
    md(f"<details>\n<summary>💡 <b>Hint & Penjelasan</b> (klik untuk buka)</summary>\n\n{text}\n\n</details>")

# ================= JUDUL =================
md("""# Short Course: NumPy + Pandas + Matplotlib
### Format: 100% Hands-on Jupyter Notebook

Kerjakan notebook ini berurutan dari atas ke bawah.

Struktur tiap Latihan:
1. **Soal** — instruksi yang harus kamu kerjakan
2. **💡 Hint & Penjelasan** — klik untuk buka. Isinya teori singkat, syntax yang dipakai, dan alternatif cara lain
3. **Sel kode kosong** — tempat kamu menulis jawaban sendiri

Jangan buka hint dulu sebelum mencoba sendiri minimal 1x. Struggle sedikit itu bagian dari belajar 😉

**Dataset:** `data/sales.csv`""")

code("""import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

%matplotlib inline
pd.set_option("display.max_columns", None)""")

# ================= STEP 1 =================
md("## STEP 1 — Mengenal Dataset")

md("### Latihan 1\nLoad dataset `sales.csv` ke dalam DataFrame bernama `df`.")
hint("""**Teori:** DataFrame adalah struktur data utama di Pandas, bentuknya seperti tabel (baris & kolom), mirip spreadsheet Excel. Untuk membaca file `.csv` menjadi DataFrame, kita pakai `pd.read_csv()`.

**Cara:**
```python
df = pd.read_csv("data/sales.csv")
```

**Alternatif lain:**
- `pd.read_excel("file.xlsx")` → kalau sumbernya file Excel
- `pd.read_json("file.json")` → kalau sumbernya JSON
- `pd.read_csv("data/sales.csv", sep=";")` → kalau delimiter-nya bukan koma (misal titik koma)
- `pd.read_csv("data/sales.csv", parse_dates=["date"])` → bisa langsung mengubah kolom tanggal jadi datetime saat loading (nanti kita coba manual di Latihan 20 biar paham konsepnya dulu)

**Kapan penting:** Ini langkah paling pertama di hampir semua project data — kalau loading-nya salah (delimiter salah, encoding salah), semua analisis selanjutnya ikut salah.""")
code("df = pd.read_csv(\"data/sales.csv\")\n")

md("### Latihan 2\nTampilkan 5 data pertama.")
hint("""**Teori:** Setelah load data, kebiasaan pertama yang harus dilakukan adalah "mengintip" isinya — bukan langsung analisis. Ini disebut *initial inspection*.

**Cara:**
```python
df.head()
```
Secara default `head()` menampilkan 5 baris teratas.

**Alternatif lain:**
- `df.head(10)` → tampilkan 10 baris pertama (bisa diisi angka berapa saja)
- `df.sample(5)` → tampilkan 5 baris **acak**, berguna untuk cek variasi data (kadang 5 baris teratas tidak representatif)
- `df.iloc[:5]` → cara manual pakai indexing, hasilnya sama dengan `head()`

**Kapan pakai yang mana:** `head()` untuk cek struktur cepat, `sample()` kalau mau lihat variasi/keacakan data, `iloc` kalau butuh kontrol index lebih presisi.""")
code()

md("### Latihan 3\nTampilkan 5 data terakhir.")
hint("""**Teori:** Melihat data paling akhir berguna untuk memastikan tidak ada baris aneh/rusak di ujung file (misalnya baris kosong, total/summary yang ikut ke-load, dll).

**Cara:**
```python
df.tail()
```

**Alternatif lain:**
- `df.tail(10)` → 10 baris terakhir
- `df.iloc[-5:]` → cara manual pakai negative indexing

**Tips:** Kalau `head()` dan `tail()` polanya beda jauh (misal kolom acak-acakan di akhir), itu tanda file csv-nya bermasalah.""")
code()

md("### Latihan 4\nCari tahu jumlah baris dan kolom.")
hint("""**Teori:** `.shape` adalah **atribut** (bukan method, jadi tanpa tanda kurung `()`), mengembalikan tuple `(jumlah_baris, jumlah_kolom)`.

**Cara:**
```python
df.shape
```

**Alternatif lain:**
- `len(df)` → hanya jumlah baris
- `len(df.columns)` → hanya jumlah kolom
- `df.shape[0]` → ambil jumlah baris saja dari tuple
- `df.shape[1]` → ambil jumlah kolom saja

**Kapan penting:** Selalu cek `.shape` setelah loading data DAN setelah setiap proses cleaning (drop duplicate, hapus missing value, dll) — untuk memastikan kamu tahu persis berapa data yang hilang/berubah di tiap langkah.""")
code()

md("### Latihan 5\nLihat nama seluruh kolom.")
hint("""**Teori:** `.columns` mengembalikan objek `Index` berisi nama-nama kolom. Berguna untuk copy-paste nama kolom yang benar (menghindari typo saat menulis `df["nama_kolom"]`).

**Cara:**
```python
df.columns
```

**Alternatif lain:**
- `df.columns.tolist()` → ubah jadi list Python biasa, lebih gampang dibaca/dipakai untuk looping
- `list(df.columns)` → sama seperti di atas, cara lain
- `df.info()` → menampilkan nama kolom **sekaligus** tipe data dan jumlah non-null (lihat Latihan 14)

**Kapan pakai yang mana:** `.columns` cukup untuk cek cepat, `.columns.tolist()` kalau nama kolomnya mau dipakai lagi di kode (misal untuk loop atau validasi).""")
code()

md("### Latihan 6\nPeriksa tipe data.")
hint("""**Teori:** Tiap kolom di Pandas punya tipe data (`dtype`), misalnya `int64` (angka bulat), `float64` (angka desimal), `object` (biasanya teks/string), `datetime64` (tanggal). Tipe data yang salah bisa bikin error di analisis — misalnya kolom tanggal yang masih `object` tidak bisa di-sort secara kronologis dengan benar.

**Cara:**
```python
df.dtypes
```

**Alternatif lain:**
- `df.info()` → lebih lengkap, sekaligus menunjukkan jumlah non-null tiap kolom (mendeteksi missing value juga)
- `df["price"].dtype` → cek tipe data satu kolom saja

**Kapan penting:** Ini jadi dasar untuk Latihan 20 (convert kolom `date` ke datetime) dan Latihan 19 (kolom numerik yang ada missing value biasanya otomatis jadi `float64`, bukan `int64`, karena `NaN` hanya bisa direpresentasikan sebagai float).""")
code()

md("""**Challenge:** Menurutmu, kolom mana yang kemungkinan perlu diubah tipe datanya? Tulis jawabanmu di sel di bawah ini.

<details>
<summary>💡 Bocoran arah jawaban (klik kalau sudah coba mikir sendiri)</summary>

Perhatikan kolom `date` — biasanya saat di-load dari CSV, Pandas membacanya sebagai `object` (string), padahal isinya tanggal. Ini akan kita perbaiki di **Latihan 20** dengan `pd.to_datetime()`.

</details>""")
code("# tulis jawaban / observasi kamu di sini (boleh komentar, boleh cek dengan kode)\n")

# ================= STEP 2 =================
md("## STEP 2 — NumPy Basic")

md("""### Latihan 7 — Membuat Array
```python
prices = np.array([10000, 15000, 20000, 25000, 30000])
prices
```""")
hint("""**Teori:** `numpy.array` adalah struktur data inti NumPy, mirip list Python tapi jauh lebih cepat untuk operasi numerik karena disimpan dan diproses secara vektor (semua elemen diproses sekaligus, bukan satu-satu lewat loop).

**Bedanya dengan list Python:**
```python
list_biasa = [10000, 15000, 20000]
list_biasa * 2        # -> [10000, 15000, 20000, 10000, 15000, 20000]  (list-nya diulang 2x)

arr = np.array([10000, 15000, 20000])
arr * 2                # -> [20000 30000 40000]  (tiap elemen dikali 2)
```
Ini yang membuat NumPy powerful untuk operasi matematis pada data dalam jumlah besar.

**Alternatif membuat array:**
- `np.zeros(5)` → array isi 0 sebanyak 5 elemen
- `np.arange(10000, 35000, 5000)` → array dengan pola rentang tertentu
- `np.array(df["price"].tolist())` → ubah kolom DataFrame jadi array (dipakai di Latihan 11)""")
code("prices = np.array([10000, 15000, 20000, 25000, 30000])\nprices")

md("### Latihan 8 — Operasi Array\nHitung seluruh harga setelah mendapatkan diskon 10%.")
hint("""**Teori:** Ini disebut *vectorized operation* — operasi matematika langsung diterapkan ke semua elemen array sekaligus, tanpa perlu loop manual.

**Cara:**
```python
discounted_prices = prices * 0.9
discounted_prices
```
(diskon 10% artinya harga akhir = 90% dari harga awal, makanya dikali `0.9`)

**Alternatif lain:**
- `prices - (prices * 0.1)` → cara lain menghitung hal yang sama (harga dikurangi nilai diskonnya)
- `prices * (1 - 0.10)` → lebih fleksibel kalau diskonnya jadi variabel, misal `diskon = 0.10`

**Bandingkan dengan cara manual (tanpa NumPy):**
```python
discounted_prices = [p * 0.9 for p in prices]   # list comprehension, jalan tapi lebih lambat untuk data besar
```
NumPy jauh lebih efisien karena operasinya di-*compile* ke level C di belakang layar.""")
code()

md("""### Latihan 9 — Statistik
Hitung harga tertinggi, harga terendah, dan harga rata-rata.
Gunakan `np.max()`, `np.min()`, `np.mean()`.""")
hint("""**Teori:** NumPy punya banyak fungsi statistik dasar yang langsung bisa dipakai ke array.

**Cara:**
```python
np.max(prices)     # harga tertinggi
np.min(prices)      # harga terendah
np.mean(prices)     # harga rata-rata
```

**Alternatif lain (method langsung di object array):**
```python
prices.max()
prices.min()
prices.mean()
```
Hasilnya sama persis — ini cuma beda gaya penulisan (function-style vs method-style).

**Statistik tambahan yang sering dipakai:**
- `np.median(prices)` → nilai tengah (lebih tahan terhadap outlier dibanding mean)
- `np.std(prices)` → standar deviasi (seberapa tersebar datanya)
- `np.sum(prices)` → total keseluruhan

**Kapan pakai median vs mean:** Kalau ada harga yang jauh lebih mahal/murah dari yang lain (outlier), `mean` bisa "tertarik" ke arah outlier itu, sedangkan `median` lebih stabil.""")
code()

md("### Latihan 10 — Filtering\nCari harga yang lebih besar dari Rp20.000.")
hint("""**Teori:** Ini disebut *boolean indexing* — salah satu fitur paling powerful di NumPy/Pandas. Kamu bisa "menyaring" array pakai kondisi logika langsung di dalam `[ ]`.

**Cara:**
```python
prices[prices > 20000]
```
Cara kerjanya 2 langkah:
1. `prices > 20000` menghasilkan array boolean, misal `[False, False, True, True, True]`
2. `prices[...]` memakai array boolean itu untuk memilih hanya elemen yang `True`

**Alternatif lain:**
- `prices[(prices > 15000) & (prices < 30000)]` → kombinasi beberapa kondisi (pakai `&` untuk AND, `|` untuk OR — bukan `and`/`or` biasa!)
- `np.where(prices > 20000, prices, 0)` → ganti nilai yang tidak memenuhi syarat jadi 0, bukan menghapusnya

**Kenapa penting:** Konsep filtering ini nanti dipakai lagi dengan Pandas DataFrame (misal `df[df["price"] > 100000]`), jadi kalau paham di sini, konsep di Pandas akan terasa familiar.""")
code()

# ================= STEP 3 =================
md("""## STEP 3 — NumPy + Dataset

Sekarang NumPy mulai dipakai bersama Pandas. Dataset punya kolom `price` dan `quantity`.""")

md("### Latihan 11\nAmbil kolom `price` dari `df` dan ubah menjadi NumPy array.")
hint("""**Teori:** Setiap kolom di Pandas DataFrame sebenarnya adalah objek `Series`, yang di belakang layar disimpan berbasis NumPy array. Jadi konversi antara keduanya sangat mudah.

**Cara:**
```python
price_array = df["price"].to_numpy()
```

**Alternatif lain:**
- `np.array(df["price"])` → cara lain, hasilnya sama
- `df["price"].values` → cara lama (masih jalan, tapi `.to_numpy()` lebih direkomendasikan resmi oleh dokumentasi Pandas)

**Kapan perlu convert ke NumPy array:** Sebenarnya banyak operasi NumPy (`np.mean()`, `np.max()`, dst) juga bisa langsung dipakai ke Pandas Series tanpa convert dulu — tapi kadang untuk operasi array murni (misal dikombinasikan dengan array lain di luar DataFrame) kamu perlu bentuk array NumPy murni.""")
code()

md("### Latihan 12\nHitung total transaksi tiap baris menggunakan `price × quantity`.")
hint("""**Teori:** Karena `df["price"]` dan `df["quantity"]` sama-sama Series (berbasis array), perkalian antar kolom otomatis dilakukan *element-wise* (baris demi baris, otomatis dipasangkan berdasarkan index yang sama) — tidak perlu loop manual.

**Cara:**
```python
total_transaksi = df["price"] * df["quantity"]
total_transaksi
```

**Alternatif lain (lebih lambat, sebagai perbandingan):**
```python
total_transaksi = [p * q for p, q in zip(df["price"], df["quantity"])]
```
Jalan, tapi ini pola lama pra-NumPy — untuk data besar jauh lebih lambat dibanding operasi vektor langsung.

**Catatan penting:** Kalau ada nilai `NaN` (missing value) di `price` atau `quantity`, hasil perkaliannya juga akan `NaN`. Ini normal untuk saat ini — akan kita tangani di Latihan 19 (Data Cleaning).""")
code()

md("### Latihan 13\nMasukkan hasil Latihan 12 kembali ke DataFrame sebagai kolom baru bernama `revenue`.")
hint("""**Teori:** Menambah kolom baru ke DataFrame dilakukan dengan assignment biasa: `df["nama_kolom_baru"] = ...`. Kalau nama kolomnya belum ada, Pandas otomatis membuat kolom baru.

**Cara:**
```python
df["revenue"] = df["price"] * df["quantity"]
```

**Alternatif lain:**
- `df.insert(loc, "revenue", df["price"] * df["quantity"])` → kalau mau kolom baru diletakkan di posisi tertentu (bukan di paling akhir)
- `df = df.assign(revenue=df["price"] * df["quantity"])` → gaya "method chaining", populer kalau kamu suka menulis banyak operasi Pandas berantai dalam satu baris

**Cek hasil:** Setelah ini, jalankan `df.head()` lagi untuk memastikan kolom `revenue` sudah muncul dan nilainya masuk akal.""")
code()

md("🎯 Di sini kamu mulai melihat hubungan NumPy dan Pandas: operasi vektor NumPy (perkalian antar array) bisa langsung jadi kolom baru di DataFrame Pandas.")

# ================= STEP 4 =================
md("## STEP 4 — Pandas Data Exploration")

md("### Latihan 14\nGunakan `df.info()`.")
hint("""**Teori:** `.info()` adalah ringkasan paling lengkap tentang struktur DataFrame: jumlah baris, nama kolom, jumlah nilai non-null per kolom, tipe data, dan estimasi penggunaan memori — semua dalam satu perintah.

**Cara:**
```python
df.info()
```

**Cara membaca outputnya:**
- Kolom `Non-Null Count` yang angkanya lebih kecil dari total baris → berarti kolom itu punya missing value
- Kolom `Dtype` → cek apakah tipe datanya sudah sesuai (misal `date` masih `object`, harusnya `datetime64`)

**Alternatif/pelengkap:**
- `df.dtypes` → cuma tipe data (tanpa info non-null & memori)
- `df.isnull().sum()` → fokus khusus untuk hitung missing value per kolom (lihat Latihan 16)""")
code()

md("### Latihan 15\nGunakan `df.describe()`.")
hint("""**Teori:** `.describe()` menghasilkan ringkasan statistik untuk kolom-kolom numerik: `count`, `mean`, `std` (standar deviasi), `min`, `25%`/`50%`/`75%` (kuartil), `max`.

**Cara:**
```python
df.describe()
```

**Alternatif lain:**
- `df.describe(include="all")` → sertakan juga kolom non-numerik (teks/kategori), akan muncul info tambahan seperti `unique`, `top`, `freq`
- `df["price"].describe()` → statistik untuk satu kolom saja
- `df.describe(percentiles=[0.1, 0.5, 0.9])` → kustomisasi persentil yang ditampilkan

**Kegunaan:** Cepat mendeteksi anomali — misalnya kalau `min` harga negatif, atau `max` quantity mencurigakan besar (misal 9999), itu tanda ada data yang perlu dicek ulang.""")
code()

md("### Latihan 16\nCari missing values.")
hint("""**Teori:** `.isnull()` (atau `.isna()`, sama persis fungsinya) mengubah tiap sel jadi `True`/`False` tergantung apakah nilainya kosong (`NaN`). Digabung dengan `.sum()`, `True` dihitung sebagai `1` sehingga hasilnya total missing value per kolom.

**Cara:**
```python
df.isnull().sum()
```

**Alternatif lain:**
- `df.isna().sum()` → sama persis dengan `isnull()`, cuma beda nama fungsi
- `df.isnull().sum().sum()` → total keseluruhan missing value di seluruh DataFrame (satu angka)
- `df[df["price"].isnull()]` → tampilkan baris-baris yang kolom `price`-nya kosong (berguna untuk investigasi manual)
- `df.isnull().mean() * 100` → persentase missing value per kolom, kadang lebih informatif daripada jumlah absolut""")
code()

md("### Latihan 17\nCari data duplikat.")
hint("""**Teori:** `.duplicated()` mengecek tiap baris apakah kombinasi nilainya sama persis dengan baris lain sebelumnya. Baris pertama dianggap "asli" (`False`), baris berikutnya yang sama dianggap duplikat (`True`).

**Cara:**
```python
df.duplicated().sum()
```

**Alternatif lain:**
- `df[df.duplicated()]` → tampilkan baris-baris yang terdeteksi duplikat (bukan cuma jumlahnya)
- `df.duplicated(subset=["order_id"])` → cek duplikat hanya berdasarkan kolom tertentu (misal `order_id` saja, bukan semua kolom)
- `df.duplicated(keep=False)` → tandai SEMUA baris yang punya kembaran sebagai `True` (termasuk baris pertamanya), bukan cuma yang belakangan

**Kenapa penting dicek sebelum dihapus:** Kadang "duplikat" itu valid (misal pelanggan yang sama beli barang sama 2x di hari berbeda) — makanya penting cek dulu isinya sebelum langsung `drop_duplicates()`.""")
code()

# ================= STEP 5 =================
md("""## STEP 5 — Data Cleaning

Dataset ini **sengaja dibuat kotor**: ada missing values, ada baris duplikat, dan kolom tanggal masih berupa teks. Bersihkan sebelum lanjut ke analisis.""")

md("### Latihan 18\nHapus data duplikat.")
hint("""**Teori:** Setelah tahu ada duplikat (Latihan 17), langkah selanjutnya adalah menghapusnya supaya tidak menggelembungkan angka analisis (misal total revenue jadi lebih besar dari yang sebenarnya).

**Cara:**
```python
df = df.drop_duplicates()
```
Perhatikan: hasilnya harus disimpan ulang ke `df` (atau variabel baru), karena `drop_duplicates()` secara default **tidak mengubah** DataFrame aslinya, hanya mengembalikan versi baru.

**Alternatif lain:**
- `df.drop_duplicates(inplace=True)` → langsung ubah `df` tanpa perlu assignment ulang (tapi banyak praktisi Pandas modern menyarankan hindari `inplace=True` karena kadang bikin bug tersembunyi)
- `df.drop_duplicates(subset=["order_id"], keep="first")` → hapus duplikat berdasarkan kolom tertentu saja, simpan kemunculan pertama

**Cek hasil:** Jalankan `df.shape` sebelum & sesudah untuk lihat berapa baris yang hilang.""")
code()

md("""### Latihan 19
Tangani missing values.
- Untuk kolom numerik (`price`, `quantity`), isi nilai kosong dengan median kolom tersebut.
- Untuk kolom `city`, isi nilai kosong dengan `"Unknown"`.""")
hint("""**Teori:** Ada beberapa strategi umum menangani missing value:
1. **Hapus barisnya** (`dropna()`) — cocok kalau missing value sedikit dan tidak sistematis
2. **Isi dengan nilai statistik** (*imputation*) — median/mean untuk data numerik, modus atau label khusus (`"Unknown"`) untuk data kategori
3. **Isi dengan nilai domain-specific** — misal isi 0 kalau memang secara bisnis "kosong = tidak ada transaksi"

Kita pakai **median** (bukan mean) untuk `price`/`quantity` karena median lebih tahan terhadap outlier (lihat penjelasan di Latihan 9).

**Cara:**
```python
df["price"] = df["price"].fillna(df["price"].median())
df["quantity"] = df["quantity"].fillna(df["quantity"].median())
df["city"] = df["city"].fillna("Unknown")
```

**Alternatif lain:**
- `df["price"].fillna(df["price"].mean(), inplace=True)` → pakai mean, kalau datanya diyakini tidak banyak outlier
- `df.dropna(subset=["price"])` → alih-alih isi, langsung buang baris yang `price`-nya kosong
- `df.fillna({"price": df["price"].median(), "quantity": df["quantity"].median(), "city": "Unknown"})` → isi banyak kolom sekaligus dalam satu baris kode pakai dictionary
- `df["price"].interpolate()` → khusus data time-series, isi missing value berdasarkan interpolasi nilai sekitarnya (tidak dipakai di sini, tapi baik untuk tahu)

**Kapan pilih hapus vs isi:** Kalau missing value < 5% dari data dan tersebar acak, aman dihapus. Kalau lebih banyak atau data berharga (seperti di sini), lebih baik diisi supaya tidak kehilangan banyak baris.""")
code()

md("""### Latihan 20
Pastikan kolom `date` menjadi tipe datetime.
```python
df["date"] = pd.to_datetime(df["date"])
```""")
hint("""**Teori:** Selama kolom `date` masih bertipe `object` (string), Pandas memperlakukannya sebagai teks biasa — tidak bisa di-sort kronologis dengan benar, tidak bisa diambil bulan/tahunnya, dan tidak bisa dipakai untuk operasi tanggal (selisih hari, dsb). `pd.to_datetime()` mengubahnya jadi tipe `datetime64` yang punya kemampuan itu semua.

**Cara:**
```python
df["date"] = pd.to_datetime(df["date"])
```

**Alternatif lain:**
- `pd.to_datetime(df["date"], format="%Y-%m-%d")` → tentukan format tanggal secara eksplisit, lebih cepat & aman kalau formatnya konsisten
- `pd.read_csv("data/sales.csv", parse_dates=["date"])` → convert langsung sejak awal loading data (alternatif dari Latihan 1)
- `df["date"].dt.year`, `df["date"].dt.month`, `df["date"].dt.day_name()` → setelah jadi datetime, ada banyak fitur `.dt` accessor untuk ekstrak bagian tanggal (dipakai di Latihan 21)

**Kalau ada error saat convert:** Bisa tambahkan `errors="coerce"` — baris yang formatnya tidak valid akan jadi `NaT` (Not a Time, versi `NaN` untuk tanggal) alih-alih bikin program error.""")
code("df[\"date\"] = pd.to_datetime(df[\"date\"])\ndf.dtypes")

md("### Latihan 21\nBuat kolom `month` dan `year` berdasarkan kolom `date`.")
hint("""**Teori:** Setelah kolom `date` jadi tipe datetime (Latihan 20), Pandas menyediakan `.dt` accessor untuk mengambil komponen tanggal (tahun, bulan, hari, nama hari, dst) dari seluruh kolom sekaligus.

**Cara:**
```python
df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month
```

**Alternatif lain:**
- `df["date"].dt.month_name()` → nama bulan dalam teks (`"January"`, dst) alih-alih angka — lebih enak dibaca untuk grafik nanti
- `df["date"].dt.to_period("M")` → gabungan tahun+bulan sebagai satu nilai (`2024-09`), sering dipakai untuk `groupby()` tren bulanan supaya urutannya otomatis benar
- `df["date"].dt.day_name()` → nama hari (`"Monday"`, dst), berguna kalau mau analisis "hari apa penjualan paling ramai"

**Kapan pakai `to_period` vs kolom `year`+`month` terpisah:** Kolom terpisah lebih fleksibel untuk filter (`df[df["year"]==2024]`), sedangkan `to_period` lebih rapi untuk langsung dipakai sebagai sumbu waktu di grafik tren (Latihan 27, 29).""")
code()

md("""**Catatan:** karena kamu mengisi ulang `price`/`quantity` yang kosong di Latihan 19, jangan lupa hitung ulang kolom `revenue` (`price × quantity`) supaya konsisten sebelum lanjut ke STEP 6.""")
hint("""Kolom `revenue` yang kamu buat di Latihan 13 dihitung SEBELUM missing value di `price`/`quantity` diisi (Latihan 19). Baris yang tadinya kosong sekarang punya nilai baru, tapi `revenue`-nya masih `NaN` (warisan dari perhitungan lama) — makanya perlu dihitung ulang.

```python
df["revenue"] = df["price"] * df["quantity"]
```

Ini contoh nyata kenapa **urutan proses cleaning itu penting** — kalau lupa recalculate, hasil analisis di STEP 6 nanti jadi tidak akurat meski kelihatannya "sudah dibersihkan".""")
code()

# ================= STEP 6 =================
md("## STEP 6 — Data Analysis\n\nSekarang mulai menjawab pertanyaan bisnis menggunakan `groupby()`, `sum()`, `mean()`, `count()`, `sort_values()`.")

md("### Latihan 22\nBerapa total revenue?")
hint("""**Teori:** Untuk menjumlahkan seluruh nilai di satu kolom, pakai `.sum()`.

**Cara:**
```python
total_revenue = df["revenue"].sum()
total_revenue
```

**Alternatif lain:**
- `np.sum(df["revenue"])` → versi NumPy, hasilnya sama
- `df["revenue"].sum(skipna=True)` → default-nya memang `NaN` otomatis diabaikan, ini cuma eksplisit menegaskannya

**Tips presentasi:** Kalau mau ditampilkan lebih enak dibaca, bisa format jadi rupiah:
```python
print(f"Total Revenue: Rp{total_revenue:,.0f}")
```""")
code()

md("### Latihan 23\nBerapa rata-rata nilai transaksi (revenue per order)?")
hint("""**Teori:** "Rata-rata nilai transaksi" berbeda dengan "rata-rata harga produk" — ini rata-rata dari kolom `revenue` (yang sudah memperhitungkan quantity), per baris transaksi.

**Cara:**
```python
avg_transaction = df["revenue"].mean()
avg_transaction
```

**Alternatif lain:**
- `df["revenue"].median()` → kalau distribusi revenue-nya condong (banyak transaksi kecil, sedikit transaksi sangat besar), median memberi gambaran "transaksi tipikal" yang lebih representatif dibanding mean
- `total_revenue / len(df)` → cara manual, hasilnya sama dengan `.mean()` kalau tidak ada NaN

Coba bandingkan hasil `mean()` dan `median()` — kalau beda jauh, itu tanda ada beberapa transaksi besar yang menarik rata-rata ke atas.""")
code()

md("### Latihan 24\nProduk apa yang paling banyak terjual (berdasarkan total quantity)?")
hint("""**Teori:** `groupby()` adalah fitur inti Pandas untuk analisis agregat — mengelompokkan baris berdasarkan nilai kolom tertentu (di sini: `product`), lalu menerapkan fungsi agregasi (di sini: `sum()` pada `quantity`) ke tiap kelompok. Konsepnya sama seperti PivotTable di Excel.

**Cara:**
```python
produk_terlaris = df.groupby("product")["quantity"].sum().sort_values(ascending=False)
produk_terlaris.head()
```
Langkah-langkahnya:
1. `df.groupby("product")` → kelompokkan baris berdasarkan nama produk
2. `["quantity"].sum()` → jumlahkan quantity di tiap kelompok
3. `.sort_values(ascending=False)` → urutkan dari terbesar ke terkecil

**Alternatif lain:**
- `.sort_values(ascending=False).head(1)` → ambil hanya produk teratas
- `.idxmax()` → langsung ambil nama produk dengan quantity terbesar tanpa perlu sort, contoh: `df.groupby("product")["quantity"].sum().idxmax()`
- `df.groupby("product").agg({"quantity": "sum"})` → gaya penulisan alternatif, lebih fleksibel kalau mau agregasi banyak kolom sekaligus dengan fungsi berbeda-beda""")
code()

md("### Latihan 25\nProduk mana yang menghasilkan revenue terbesar?")
hint("""**Teori:** Pola yang sama seperti Latihan 24, tapi sekarang mengelompokkan berdasarkan `revenue`, bukan `quantity`. Produk yang paling banyak terjual belum tentu produk dengan revenue terbesar (produk murah bisa laku banyak tapi revenue-nya kecil, produk mahal bisa laku sedikit tapi revenue-nya besar).

**Cara:**
```python
produk_revenue = df.groupby("product")["revenue"].sum().sort_values(ascending=False)
produk_revenue.head()
```

**Alternatif lain:**
- `df.groupby("product")["revenue"].sum().idxmax()` → langsung nama produk revenue terbesar
- `df.groupby("product").agg(total_revenue=("revenue","sum"), total_qty=("quantity","sum")).sort_values("total_revenue", ascending=False)` → bandingkan revenue dan quantity sekaligus dalam satu tabel — cara ini lebih insightful karena kamu bisa lihat langsung produk mana yang "sedikit laku tapi mahal" vs "banyak laku tapi murah"

**Insight yang bisa digali:** Bandingkan hasil Latihan 24 dan 25 — kalau urutannya beda, itu temuan bisnis yang menarik untuk dibahas di STEP 8/9.""")
code()

md("### Latihan 26\nKota mana yang memiliki revenue terbesar?")
hint("""**Teori:** Pola `groupby()` yang sama, sekarang dimensinya diganti jadi `city`. Ini contoh bagaimana satu pola kode bisa dipakai ulang untuk pertanyaan bisnis yang berbeda-beda, tinggal ganti kolom yang di-groupby.

**Cara:**
```python
revenue_per_kota = df.groupby("city")["revenue"].sum().sort_values(ascending=False)
revenue_per_kota
```

**Alternatif lain:**
- `revenue_per_kota.plot(kind="bar")` → Pandas punya built-in plotting yang manggil Matplotlib di belakang layar, cara cepat untuk quick-check visual sebelum bikin chart "resmi" di STEP 7
- `df.pivot_table(index="city", values="revenue", aggfunc="sum")` → `pivot_table` adalah alternatif `groupby()` dengan gaya penulisan mirip pivot table Excel, hasilnya serupa

**Ingat:** kota `"Unknown"` (hasil isian missing value di Latihan 19) juga akan muncul di sini — itu wajar, tandanya proses cleaning tadi konsisten sampai ke analisis.""")
code()

md("### Latihan 27\nBerapa revenue setiap bulan? (gunakan kolom `month`/`year` dari Latihan 21)")
hint("""**Teori:** Untuk tren waktu, biasanya kita groupby berdasarkan kombinasi `year` dan `month` (bukan `month` saja) — supaya September 2024 tidak tercampur dengan September tahun lain (kalau datanya lintas tahun).

**Cara:**
```python
revenue_bulanan = df.groupby(["year", "month"])["revenue"].sum()
revenue_bulanan
```

**Alternatif lain:**
- `df.groupby(df["date"].dt.to_period("M"))["revenue"].sum()` → pakai `to_period("M")` (lihat penjelasan di Latihan 21), hasilnya otomatis terurut kronologis dan lebih gampang langsung dipakai untuk line chart tren di Latihan 29
- `df.set_index("date").resample("M")["revenue"].sum()` → teknik *resampling* khusus data time-series, sangat umum dipakai untuk agregasi berbasis periode waktu (harian/mingguan/bulanan) secara otomatis

**Kapan pakai resample vs groupby biasa:** `resample()` lebih powerful kalau datamu benar-benar time-series (index-nya tanggal) dan butuh mengisi bulan yang datanya kosong (misal tidak ada transaksi di bulan tertentu) — `resample()` akan tetap menampilkan bulan itu dengan nilai 0, sedangkan `groupby()` biasa akan melewatkannya begitu saja.""")
code()

# ================= STEP 7 =================
md("## STEP 7 — Matplotlib\n\nSekarang hasil analisis mulai divisualisasikan.")

md("### Latihan 28 — Bar Chart\nVisualisasikan revenue berdasarkan produk.")
hint("""**Teori:** Bar chart cocok untuk membandingkan nilai antar kategori (di sini: antar produk). Sumbu X biasanya kategori, sumbu Y nilainya.

**Cara:**
```python
produk_revenue = df.groupby("product")["revenue"].sum().sort_values(ascending=False)

plt.figure(figsize=(10, 5))
plt.bar(produk_revenue.index, produk_revenue.values)
plt.xticks(rotation=75)
plt.xlabel("Produk")
plt.ylabel("Revenue")
plt.title("Revenue per Produk")
plt.tight_layout()
plt.show()
```
`plt.xticks(rotation=75)` penting di sini karena nama produk cukup panjang — tanpa rotasi label akan saling tumpuk.

**Alternatif lain:**
- `plt.barh(...)` → bar chart horizontal, sering lebih enak dibaca kalau label kategorinya panjang (tidak perlu rotasi)
- `produk_revenue.plot(kind="bar")` → cara pintas pakai Pandas (otomatis manggil Matplotlib), lebih ringkas tapi kontrolnya lebih terbatas
- `plt.bar(produk_revenue.index[:5], produk_revenue.values[:5])` → tampilkan hanya top 5 produk saja kalau kategorinya terlalu banyak untuk 1 chart""")
code("""# plt.bar(...)
# plt.show()
""")

md("### Latihan 29 — Line Chart\nVisualisasikan revenue berdasarkan bulan.")
hint("""**Teori:** Line chart cocok untuk menunjukkan tren/perubahan sepanjang waktu — di sini urutan waktu (bulan) penting, tidak seperti bar chart kategori yang urutannya bebas.

**Cara:**
```python
tren_bulanan = df.groupby(df["date"].dt.to_period("M"))["revenue"].sum()

plt.figure(figsize=(10, 5))
plt.plot(tren_bulanan.index.astype(str), tren_bulanan.values, marker="o")
plt.xticks(rotation=45)
plt.xlabel("Bulan")
plt.ylabel("Revenue")
plt.title("Tren Revenue per Bulan")
plt.tight_layout()
plt.show()
```
`.index.astype(str)` dipakai supaya sumbu X (yang tadinya objek `Period`) bisa ditampilkan sebagai teks biasa oleh Matplotlib.

**Alternatif lain:**
- `plt.plot(..., marker="o", linestyle="--")` → kustomisasi gaya garis (putus-putus, dsb)
- Menampilkan beberapa garis sekaligus (misal per kategori produk) dengan memanggil `plt.plot()` beberapa kali sebelum `plt.show()`, ditambah `plt.legend()` supaya tiap garis punya label
- `tren_bulanan.plot()` → versi pintas Pandas, otomatis jadi line chart untuk data time-series

**Kapan pakai line vs bar:** Line untuk tren berkelanjutan (waktu), bar untuk perbandingan antar kategori yang tidak berurutan secara alami.""")
code("""# plt.plot(...)
# plt.show()
""")

md("### Latihan 30 — Scatter Plot\nCari hubungan antara `price` dan `quantity`, lalu visualisasikan dengan scatter plot.")
hint("""**Teori:** Scatter plot dipakai untuk melihat hubungan (korelasi) antara dua variabel numerik — tiap titik mewakili satu baris data. Kalau titik-titiknya membentuk pola naik/turun, kemungkinan ada korelasi.

**Cara:**
```python
plt.figure(figsize=(8, 5))
plt.scatter(df["price"], df["quantity"], alpha=0.5)
plt.xlabel("Price")
plt.ylabel("Quantity")
plt.title("Hubungan Price vs Quantity")
plt.show()
```
`alpha=0.5` membuat titik jadi transparan — berguna kalau banyak titik saling menumpuk, jadi kelihatan mana area yang "padat".

**Alternatif lain:**
- `df["price"].corr(df["quantity"])` → hitung angka korelasi (Pearson) secara eksplisit, range -1 sampai 1. Mendekati 0 = tidak ada hubungan linear, mendekati 1/-1 = hubungan kuat positif/negatif
- `plt.scatter(df["price"], df["quantity"], c=df["revenue"], cmap="viridis")` → tambahkan warna berdasarkan variabel ketiga (di sini revenue), jadi scatter plot bisa menunjukkan 3 dimensi sekaligus
- `sns.scatterplot(...)` (kalau install `seaborn`) → versi lebih estetik dengan fitur tambahan seperti garis tren otomatis (`sns.regplot`)

**Insight yang biasa dicari di sini:** Apakah barang yang lebih mahal cenderung dibeli dalam jumlah lebih sedikit (korelasi negatif)? Ini pertanyaan bisnis klasik terkait elastisitas harga.""")
code()

md("### Latihan 31 — Histogram\nVisualisasikan distribusi harga (`price`) produk.")
hint("""**Teori:** Histogram menunjukkan *distribusi* satu variabel numerik — data dikelompokkan ke dalam beberapa "bin" (rentang nilai), lalu dihitung berapa banyak data yang jatuh di tiap bin. Berbeda dengan bar chart (yang membandingkan kategori), histogram membandingkan rentang angka.

**Cara:**
```python
plt.figure(figsize=(8, 5))
plt.hist(df["price"], bins=20, edgecolor="black")
plt.xlabel("Price")
plt.ylabel("Frekuensi")
plt.title("Distribusi Harga Produk")
plt.show()
```
`bins=20` menentukan berapa banyak kelompok rentang harga yang dipakai — semakin banyak bins, semakin detail (tapi juga semakin "berisik").

**Alternatif lain:**
- `df["price"].plot(kind="hist", bins=20)` → versi pintas Pandas
- `df["price"].hist(bins=20)` → cara lain lagi, method langsung di Series
- Coba ganti `bins=10` vs `bins=50` untuk lihat bagaimana jumlah bin memengaruhi interpretasi bentuk distribusi

**Cara membaca:** Kalau bentuknya menceng ke kanan (banyak data di harga rendah, sedikit di harga tinggi), itu disebut *right-skewed* — pola umum untuk data harga di dunia nyata.""")
code()

# ================= STEP 8 =================
md("""## STEP 8 — Integrasi 3 Library

Di tahap ini kamu **tidak diberi instruksi syntax lengkap**.

**Pertanyaan:** *"Bagaimana performa penjualan perusahaan selama periode tersebut?"*

Gunakan:
- **Pandas** → mengambil dan mengelompokkan data
- **NumPy** → melakukan perhitungan statistik
- **Matplotlib** → membuat visualisasi

Kemudian tulis kesimpulan dalam beberapa kalimat di sel teks paling bawah.""")
hint("""**Ini bukan latihan syntax baru** — semua tools yang kamu butuhkan sudah kamu pakai di STEP 1–7. Tantangannya adalah **memilih kombinasi yang tepat** untuk menjawab pertanyaan terbuka.

**Kerangka berpikir yang bisa dipakai:**
1. **Angka besar dulu (headline numbers):** total revenue, total transaksi, rata-rata transaksi — pakai `.sum()`, `len()`, `.mean()` (STEP 6)
2. **Breakdown per dimensi:** produk mana, kota mana, bulan mana yang paling berkontribusi — pakai `groupby()` + `sort_values()` (Latihan 24–27)
3. **Cek sebaran/statistik:** apakah revenue terdistribusi merata atau ada beberapa transaksi "raksasa" — bandingkan `mean()` vs `median()`, atau `np.std()`
4. **Visualisasikan minimal 2 chart:** biasanya 1 untuk komposisi (bar chart produk/kota) + 1 untuk tren (line chart bulanan)
5. **Baru simpulkan:** dari angka & chart di atas, tulis 3-5 kalimat kesimpulan performa penjualan

Tidak ada satu jawaban "benar" di sini — yang penting alur berpikirnya: **explore → agregasi → visualisasi → insight**.""")
code("# eksplorasi & analisis kamu di sini\n")
code("# visualisasi kamu di sini\n")
md("**Kesimpulan:**\n\n_(tulis kesimpulanmu di sini)_")

# ================= STEP 9 =================
md("""## STEP 9 — Final Challenge

Dataset baru yang belum pernah kamu pakai: `data/ecommerce_sales.csv`.

Tidak ada kode yang diberikan. Kamu bebas memilih kombinasi NumPy + Pandas + Matplotlib untuk menjawab 10 pertanyaan berikut:

1. Berapa total transaksi?
2. Berapa total revenue?
3. Produk paling laris?
4. Produk dengan revenue terbesar?
5. Kota dengan revenue terbesar?
6. Berapa rata-rata nilai transaksi?
7. Bagaimana tren revenue setiap bulan?
8. Produk mana yang memiliki performa paling buruk?
9. Apakah ada hubungan antara harga dan jumlah pembelian?
10. Apa 5 business insights yang bisa kamu simpulkan?

**Output akhir notebook ini harus mencakup:**
1. Data Loading
2. Data Cleaning
3. Data Processing
4. Data Analysis
5. Statistical Analysis
6. Data Visualization
7. Business Insights""")

hint("""Final Challenge sengaja **tidak dikasih hint per soal** — anggap ini simulasi kerja nyata: kamu dikasih data mentah + pertanyaan bisnis, sisanya tugasmu menentukan caranya.

Tapi ini **peta jalan (bukan jawaban)** yang bisa kamu ikuti, berdasarkan pola yang sudah kamu pelajari di STEP 1–8:

| Tahap | Pola yang sudah kamu pelajari | Dipakai untuk soal nomor |
|---|---|---|
| Data Loading | `pd.read_csv()` (Latihan 1) | - |
| Data Cleaning | `.duplicated()`, `.drop_duplicates()`, `.fillna()`, `pd.to_datetime()` (Latihan 16–21) | - |
| Data Processing | bikin kolom `revenue`, `month`, `year` (Latihan 13, 21) | - |
| Data Analysis | `groupby()` + `.sum()`/`.count()` + `sort_values()` (Latihan 22–27) | 1, 2, 3, 4, 5, 7 |
| Statistical Analysis | `.mean()`, `.median()`, `.corr()` (Latihan 9, 23, 30) | 6, 9 |
| Data Visualization | `plt.bar()`, `plt.plot()`, `plt.scatter()` (Latihan 28–30) | 7, 9 |
| Business Insights | gabungkan semua temuan jadi narasi (STEP 8) | 8, 10 |

Untuk soal nomor 8 (**produk performa paling buruk**) — coba pikirkan: "buruk" bisa berarti revenue terkecil, quantity terjual paling sedikit, atau kombinasi keduanya. Silakan tentukan definisimu sendiri, lalu jelaskan alasannya di kesimpulan — di dunia kerja nyata, mendefinisikan metrik sendiri dengan alasan yang jelas itu skill penting.""")

code("# 1. Data Loading\ndf2 = pd.read_csv(\"data/ecommerce_sales.csv\")\ndf2.head()")
code("# 2. Data Cleaning\n")
code("# 3. Data Processing\n")
code("# 4. Data Analysis\n")
code("# 5. Statistical Analysis\n")
code("# 6. Data Visualization\n")
md("""### 7. Business Insights

_(tulis 5 business insights kamu di sini)_

1.
2.
3.
4.
5.
""")

nb["cells"] = cells
nbf.write(nb, "/home/claude/course/Latihan_NumPy_Pandas_Matplotlib.ipynb")
print("notebook v2 dibuat, jumlah sel:", len(cells))
