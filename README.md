# Untuk Nanda Aula Selfiyana ♡

Album anniversary dua tahun **Indra & Nanda Aula Selfiyana**, sejak 15 November 2024.

Laravel 13 + Blade, CSS, dan JavaScript. Foto asli, album dengan filter dan lightbox, penghitung kebersamaan, puzzle foto, botol pesan cinta, surat dalam amplop, serta pemutar lagu **Sempurna** dari video resmi GP Records. Responsif dan mendukung reduced motion. Tidak membutuhkan database atau build frontend untuk hosting.

**Buka lokal:** http://localhost/nandasayang/

**Situs publik (GitHub Pages):** https://metsue.github.io/nandasayang/

Setiap perubahan yang diunggah ke branch `main` akan dirender menjadi halaman statis dan diterbitkan otomatis oleh [workflow GitHub Pages](.github/workflows/pages.yml). Fitur interaktif tetap berjalan di browser. GitHub Pages tidak menjalankan Laravel/PHP saat pengunjung membuka situs.

**Panduan instalasi, hosting, musik, personalisasi, dan pengujian:** [HOSTING.md](HOSTING.md).

```sh
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```

Pada PowerShell, gunakan `Copy-Item .env.example .env` sebagai pengganti `cp` jika diperlukan. Instalasi proyek ini sudah disiapkan di lingkungan kerja.
