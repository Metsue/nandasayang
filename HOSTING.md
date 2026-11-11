# Menayangkan website Untuk Nanda Aula Selfiyana

Website anniversary Indra & Nanda, 15 November 2024–15 November 2026. Dibangun dengan Laravel 13, Blade, CSS, dan JavaScript. Tidak memerlukan database, Vite, atau build Node.js untuk ditayangkan.

## Membuka di komputer ini

Aktifkan Apache di XAMPP, lalu buka **http://localhost/nandasayang/**. Alamat tersebut mengarahkan ke folder `public`.

Alternatif dari folder proyek:

```sh
php artisan serve
```

Buka URL yang ditampilkan, biasanya `http://127.0.0.1:8000`.

## Hosting Laravel / cPanel

1. Pilih PHP **8.3 atau lebih baru**, dengan ekstensi standar Laravel: Ctype, cURL, DOM, Fileinfo, Filter, Hash, Mbstring, OpenSSL, PCRE, PDO, Session, Tokenizer, dan XML. [Persyaratan resmi Laravel](https://laravel.com/framework/docs/13.x/deployment).
2. Unggah proyek. Abaikan `.work`, `node_modules`, `tests`, `test-results`, `.git`, serta `.env` lokal. Folder `.work` menyimpan cadangan halaman lama dan bahan referensi lokal; folder tersebut tidak diperlukan untuk hosting.
3. Arahkan **document root domain ke folder `public`** proyek. Contoh: `/home/akun/nandasayang/public`. Jangan jadikan direktori utama Laravel sebagai document root produksi.
4. Jalankan `composer install --no-dev --prefer-dist --optimize-autoloader` melalui terminal hosting. Jika hosting tanpa Composer, jalankan perintah itu pada salinan proyek lokal dan unggah folder `vendor` yang dihasilkan bersama proyek.
5. Salin `.env.example` menjadi `.env`, kemudian sesuaikan:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://domain-anda.com
SESSION_SECURE_COOKIE=true
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
ANNIVERSARY_START_DATE=2024-11-15
ANNIVERSARY_TIMEZONE=Asia/Jakarta
ANNIVERSARY_SENDER="Indra"
```

6. Jalankan:

```sh
php artisan key:generate
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

7. Pastikan akun proses PHP dapat menulis ke `storage` dan `bootstrap/cache`, lalu aktifkan HTTPS. Tidak perlu menjalankan migrasi database.
8. Uji halaman utama, foto, surat, dan tombol musik di ponsel. Rute `/up` tersedia untuk pemeriksaan aplikasi.

Jika panel hosting mengunci domain ke `public_html`, taruh aplikasi Laravel di luar `public_html`, salin **isi** direktori `public` ke `public_html`, lalu sesuaikan tiga jalur dalam `public_html/index.php` (maintenance, `vendor/autoload.php`, `bootstrap/app.php`) agar menunjuk ke lokasi aplikasi. Pilihan document root ke `public` tetap lebih sederhana.

## Personalisasi

- `config/anniversary.php`: nama, 12 pesan dalam botol, foto dan caption, tautan musik.
- `resources/views/anniversary.blade.php`: surat, judul, alur cerita, dan tanggal yang tertulis dalam teks.
- `public/css/anniversary.css`: warna, tipografi, komposisi, animasi, serta tata letak responsif.
- `public/js/anniversary.js`: puzzle, galeri, surat, musik, dan penghitung waktu.
- `.env`: tanggal awal penghitung, zona waktu, dan nama pengirim surat. Zona waktu awal adalah WIB karena jam jadian tidak diberikan. Penghitung dimulai pukul 00.00 WIB tanggal 15 November 2024.

Setelah mengubah konfigurasi di hosting, jalankan `php artisan config:cache`; setelah mengubah Blade, jalankan `php artisan view:cache`. Untuk memperbarui CSS/JS yang sudah di-cache browser, naikkan nilai `?v=1` pada tautan aset di Blade.

## Lagu Sempurna

Tombol **Lagu kita → Putar lagu kita** memuat [video musik resmi GP Records](https://www.youtube.com/watch?v=jStNaVCW838) lewat pemutar YouTube. Tidak ada audio yang diputar otomatis saat halaman pertama dibuka. Menutup panel besar mengecilkan video ke pemutar kecil dan lagu tetap berjalan; buka kembali lewat tombol di pemutar kecil atau tombol **Lagu kita**. [Aturan YouTube](https://developers.google.com/youtube/terms/developer-policies) tidak mengizinkan video diputar di latar ketika pemutarnya tidak ditampilkan. Pemutar membutuhkan koneksi internet dan izin pemutaran dari browser/YouTube. Tautan langsung YouTube tetap tersedia jika embed dibatasi.

Untuk menyembunyikan panel **sepenuhnya** sambil lagu terus berjalan, gunakan file audio yang boleh Anda pakai. Letakkan file tersebut dengan nama `public/audio/lagu-kita.mp3`. Website akan memilihnya secara otomatis saat halaman dimuat. Pada mode audio lokal, menutup panel tidak menghentikan lagu; buka kembali melalui tombol **Lagu kita** untuk mengatur putar/jeda. Tidak perlu mengubah `.env` bila memakai nama file tersebut.

Jika memilih nama atau lokasi file yang berbeda, atur:

```dotenv
ANNIVERSARY_MUSIC_PATH=audio/lagu-kita.mp3
```

Pemutar akan memakai audio lokal tersebut, tanpa memuat YouTube. File MP3 tidak disertakan dalam proyek.

## Foto dan privasi

14 foto dipilih dari ZIP yang diberikan, diubah menjadi WebP besar/kecil, tanpa mengubah isi foto. Galeri berisi 12 foto; foto lain digunakan untuk cerita. Aset foto sekitar 3,4 MB total. Foto asli tetap ada dalam ZIP sumber; salinan kerja ada di `.work/photos`.

Halaman menggunakan `noindex, nofollow` dan robots untuk mengurangi pengindeksan, tetapi **bukan halaman dengan kata sandi**. Siapa pun yang memiliki URL hosting dapat mengakses halaman dan foto. Tidak ada formulir, akun, analitik, ataupun pengiriman data pelukan ke server.

Font dihosting lokal dan menggunakan SIL Open Font License. Lisensi disertakan di `public/fonts/*-OFL.txt`.

## Pemeriksaan

```sh
composer install
php artisan test
npm install
npm run check
npm run test:browser
```

Pemeriksaan browser menggunakan Google Chrome lokal melalui Playwright dan secara default mengakses XAMPP di `http://localhost/nandasayang/public/`. Atur variabel `TEST_URL` jika menggunakan alamat lain. Hasil screenshot tersedia dalam `test-results` setelah pengujian.
