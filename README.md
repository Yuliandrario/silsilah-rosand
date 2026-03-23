🌳 Silsilah Keluarga Rosandf

Aplikasi pohon keluarga interaktif yang dibangun menggunakan React, Tailwind CSS, dan Lucide Icons. Data dikelola secara dinamis melalui Google Sheets via Sheety API, memungkinkan pembaruan data tanpa harus mengubah kode.

🌟 Fitur Utama

Visualisasi Pohon: Tampilan silsilah yang dapat dikembangkan (expandable).

Pencarian Cepat: Mencari anggota keluarga berdasarkan nama atau pekerjaan.

Profil Detail: Informasi lengkap mengenai tanggal lahir, tempat lahir, dan biografi singkat.

Responsif: Tampilan yang nyaman diakses melalui HP, Tablet, maupun Komputer.

Sinkronisasi Cloud: Data terhubung langsung dengan Google Sheets.

🚀 Cara Menjalankan Secara Lokal

Clone repositori ini:

git clone [https://github.com/username/silsilah-rosandf.git](https://github.com/username/silsilah-rosandf.git)


Masuk ke direktori proyek:

cd silsilah-rosandf


Instal dependensi:

npm install


Jalankan server pengembangan:

npm run dev


🌐 Deployment di Vercel

Proyek ini dirancang untuk bekerja sempurna dengan Vercel:

Hubungkan akun GitHub Anda ke Vercel.

Pilih repositori silsilah-rosandf.

Vercel akan mendeteksi konfigurasi Vite secara otomatis.

Klik Deploy.

Situs Anda akan aktif dalam hitungan detik!

📊 Pengelolaan Data

Aplikasi ini menggunakan Sheety API sebagai jembatan ke Google Sheets.

Lokasi API: URL API dikonfigurasi di dalam file src/App.jsx pada variabel SHEETY_PROJECT_API.

Kolom Spreadsheet: Pastikan spreadsheet Anda memiliki kolom minimal: id, name, gender, birthDate, birthPlace, occupation, bio, generation, dan parentId.

🛠️ Teknologi yang Digunakan

React.js - Library UI.

Vite - Build tool generasi baru.

Tailwind CSS - Framework CSS untuk desain modern.

Lucide React - Ikon vektor yang cantik.

Dibuat untuk menjaga warisan dan sejarah keluarga Rosandf tetap hidup di era digital.
