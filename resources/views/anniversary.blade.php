<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#fff8f5">
    <meta name="description" content="Dua tahun, ribuan cerita, dan satu orang yang selalu kupilih. Sebuah album cinta untuk Nanda Aula Selfiyana, dari Indra.">
    <meta name="robots" content="noindex, nofollow">
    <title>Untuk Nanda Aula Selfiyana ♡ — Happy 2nd Anniversary</title>
    <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml">
    <link rel="preload" href="{{ asset('fonts/cormorant.woff2') }}" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="{{ asset('fonts/dm-sans.woff2') }}" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="{{ asset('css/anniversary.css') }}?v=5">
    <script src="{{ asset('js/anniversary.js') }}?v=5" defer></script>
</head>
<body>
    <a class="skip-link" href="#main">Langsung ke cerita kita</a>
    <div class="scroll-progress" aria-hidden="true"></div>
    <div id="confetti" class="confetti" aria-hidden="true"></div>
    <header class="site-header">
        <a href="#home" class="brand" aria-label="Untuk Nanda Aula Selfiyana, kembali ke awal"><span class="brand-heart">♡</span><span class="brand-name">Untuk Nanda Aula Selfiyana<span class="brand-dot">.</span></span></a>
        <nav aria-label="Navigasi utama">
            <a href="#cerita">Cerita kita</a>
            <a href="#kenangan">Kenangan</a>
            <a href="#surat">Surat cinta <span aria-hidden="true">↗</span></a>
        </nav>
        <button class="music-toggle" id="music-toggle" aria-expanded="false" aria-controls="music-panel"><x-icon name="music"/><span>Lagu kita</span><span class="music-indicator" aria-hidden="true"></span></button>
    </header>

    <main id="main">
        <section class="hero section-shell" id="home" aria-labelledby="hero-title">
            <span class="hero-spark sparkle-one" aria-hidden="true">✧</span>
            <span class="hero-spark sparkle-two" aria-hidden="true">✦</span>
            <div class="hero-copy">
                <p class="eyebrow"><span class="tiny-heart" aria-hidden="true">♥</span> HAPPY 2ND ANNIVERSARY</p>
                <h1 id="hero-title">Dua tahun,<br>ribuan cerita.<br><em>Tetap kamu.</em><svg class="title-underline" viewBox="0 0 340 20" aria-hidden="true"><path d="M3 12Q160-5 335 8M15 19Q170 7 310 14"/></svg></h1>
                <div class="hero-dedication"><span class="short-line"></span><p>Untuk <strong>{{ $anniversary['partner'] }}</strong></p></div>
                <p class="hero-description">Di antara banyak hal indah yang datang dan pergi,<br class="desktop-break"> kamu adalah yang selalu ingin aku jaga.<br class="desktop-break"> Ini cerita kecil tentang kita. Tentang aku yang sayang kamu.</p>
                <div class="hero-actions">
                    <a class="button button-primary" href="#cerita">Buka cerita kita <x-icon name="arrow"/></a>
                    <a class="text-link" href="#surat"><x-icon name="mail"/> Ada surat untukmu</a>
                </div>
                <p class="handwritten hero-footnote">dibuat dengan sepenuh hati, oleh Indra <span aria-hidden="true">♡</span></p>
            </div>
            <div class="hero-art" aria-label="Potongan kenangan kita">
                <div class="hero-orbit" aria-hidden="true"></div>
                <span class="handwritten art-annotation">my favorite person</span>
                <svg class="doodle-arrow" viewBox="0 0 100 80" aria-hidden="true"><path d="M8 7C70 0 90 41 59 63M59 49l-2 17 18-1"/></svg>
                <figure class="polaroid hero-photo-main">
                    <span class="tape" aria-hidden="true"></span>
                    <img src="{{ asset('images/senyum-berdua.webp') }}" alt="Indra dan Nanda tersenyum bersama di tepi danau" width="1200" height="1600" fetchpriority="high">
                    <figcaption>you & me, always.</figcaption>
                </figure>
                <figure class="polaroid hero-photo-small">
                    <span class="tape tape-pink" aria-hidden="true"></span>
                    <img src="{{ asset('images/senja-kita-small.webp') }}" alt="Kita berdua menikmati senja di tepi pantai" width="640" height="360">
                    <figcaption>our kind of happiness ♡</figcaption>
                </figure>
                <div class="anniversary-stamp" aria-label="2 years of us"><span>CELEBRATING</span><strong>2</strong><span>YEARS OF US</span><i aria-hidden="true">✧</i></div>
                <x-flower class="flower hero-flower"/>
                <span class="doodle-heart" aria-hidden="true">♡</span>
                <span class="photo-corner-note handwritten">masih & selalu, kamu.</span>
            </div>
            <a class="scroll-cue" href="#waktu"><span>PELAN-PELAN, ADA BANYAK CINTA DI BAWAH</span><x-icon name="down"/></a>
        </section>

        <section class="time-section" id="waktu" aria-labelledby="time-title">
            <div class="section-shell time-inner reveal">
                <div class="time-intro"><span class="eyebrow">SETIAP DETIK BERARTI</span><h2 id="time-title">Waktu berjalan.<br><em>Sayangnya tetap.</em></h2></div>
                @if($start)
                <div class="time-counter" data-start="{{ $start }}" role="timer" aria-label="Waktu kebersamaan sejak 15 November 2024">
                    <div><strong id="time-days">—</strong><span>HARI</span></div><i>:</i><div><strong id="time-hours">—</strong><span>JAM</span></div><i>:</i><div><strong id="time-minutes">—</strong><span>MENIT</span></div><i>:</i><div><strong id="time-seconds">—</strong><span>DETIK</span></div>
                    <p>sejak 15 November 2024 <span aria-hidden="true">♡</span> dan masih terus berjalan</p>
                </div>
                @else
                <div class="time-counter time-keepsakes"><div><strong>02</strong><span>TAHUN CERITA</span></div><i>✧</i><div><strong>24</strong><span>BULAN KENANGAN</span></div><i>✧</i><div><strong>∞</strong><span>ALASAN MENYAYANGIMU</span></div><p>Masih banyak halaman indah yang ingin kutulis bersamamu.</p></div>
                @endif
            </div>
        </section>

        <section class="story-section section-shell section-space" id="cerita" aria-labelledby="story-title">
            <div class="section-heading reveal"><p class="eyebrow">01 / CERITA KITA</p><h2 id="story-title">Cerita favoritku,<br><em>selalu ada kamunya.</em></h2><p>Dari momen sederhana, tumbuh rasa yang luar biasa.</p></div>
            <div class="story-grid">
                <article class="story-chapter reveal"><div class="chapter-photo"><img src="{{ asset('images/galeri-berdua-small.webp') }}" alt="Indra dan Nanda melihat karya seni bersama" width="480" height="640" loading="lazy"><span class="chapter-year">2024</span><span class="chapter-number">01</span></div><div class="chapter-content"><span class="eyebrow">SEBUAH AWAL</span><h3>Ketika ada “kita”</h3><p>15 November. Tanggal yang akan selalu punya tempat sendiri di hatiku. Awal dari cerita yang sampai sekarang masih ingin aku lanjutkan.</p></div></article>
                <article class="story-chapter reveal"><div class="chapter-photo"><img src="{{ asset('images/di-tepi-air-small.webp') }}" alt="Indra dan Nanda berdampingan di tepi danau" width="480" height="640" loading="lazy"><span class="chapter-year">2025</span><span class="chapter-number">02</span></div><div class="chapter-content"><span class="eyebrow">BERTUMBUH BERSAMA</span><h3>Makin mengenal, makin sayang</h3><p>Mengumpulkan perjalanan, tawa, dan hal-hal kecil yang cuma kita mengerti. Bersamamu, hari biasa pun punya cara untuk terasa istimewa.</p></div></article>
                <article class="story-chapter reveal"><div class="chapter-photo"><img src="{{ asset('images/piknik-kecil-small.webp') }}" alt="Indra dan Nanda berswafoto ceria saat piknik" width="640" height="640" loading="lazy"><span class="chapter-year">2026</span><span class="chapter-number">03</span></div><div class="chapter-content"><span class="eyebrow">DAN MASIH BERLANJUT</span><h3>Aku tetap memilihmu</h3><p>Untuk semua yang sudah kita lewati, dan semua yang belum kita temui. Semoga kita terus berjalan beriringan, sambil saling menggenggam.</p></div></article>
            </div>
            <p class="story-afterword handwritten reveal">Bukan tentang perjalanan yang sempurna, tapi tentang menjalaninya bersamamu. <span>♡</span></p>
        </section>

        <div class="love-ribbon" aria-hidden="true"><div><span>you are my favorite chapter</span> ✧ <span>masih & selalu, kamu</span> ♡ <span>two years of us</span> ✧ <span>you are my favorite chapter</span> ♡ <span>masih & selalu, kamu</span> ✧ <span>two years of us</span> ♡ </div></div>

        <section class="gallery-section section-space" id="kenangan" aria-labelledby="gallery-title">
            <div class="section-shell">
                <div class="gallery-heading reveal"><div><p class="eyebrow">02 / POTONGAN BAHAGIA</p><h2 id="gallery-title">Kalau rindu,<br><em>kita buka ini lagi.</em></h2></div><p>Sebagian kecil dari banyak kenangan.<br>Semuanya, ingin kusimpan lama-lama.<span class="handwritten">klik fotonya, ya ↙</span></p><x-flower class="flower gallery-flower"/></div>
                <div class="gallery-filters" role="group" aria-label="Pilih kategori kenangan"><button class="filter-button active" data-filter="all" aria-pressed="true">Semua kenangan <span>12</span></button><button class="filter-button" data-filter="jalan" aria-pressed="false">Jalan berdua</button><button class="filter-button" data-filter="kecil" aria-pressed="false">Hal-hal kecil</button><button class="filter-button" data-filter="senja" aria-pressed="false">Senja kita</button></div>
                <div class="gallery-grid" id="gallery-grid">
                    @foreach($anniversary['photos'] as $index => $photo)
                    <button class="memory-card reveal" data-category="{{ $photo['category'] }}" data-photo="{{ $index }}" data-full="{{ asset('images/'.$photo['file'].'.webp') }}" data-caption="{{ $photo['title'] }}" aria-label="Lihat foto: {{ $photo['title'] }}">
                        <span class="memory-image"><img src="{{ asset('images/'.$photo['file'].'-small.webp') }}" alt="{{ $photo['alt'] }}" width="640" height="640" loading="lazy"><span class="photo-expand"><x-icon name="expand"/></span></span>
                        <span class="memory-caption">{{ $photo['title'] }}</span><span class="memory-meta"><span>{{ $photo['label'] }}</span><span aria-hidden="true">♡ {{ str_pad($index + 1, 2, '0', STR_PAD_LEFT) }}</span></span>
                    </button>
                    @endforeach
                </div>
                <p class="gallery-status sr-only" aria-live="polite" id="gallery-status">12 kenangan ditampilkan</p>
                <button class="button button-outline gallery-more" id="gallery-more" hidden>Lihat kenangan lainnya <x-icon name="down"/></button>
            </div>
        </section>

        <section class="little-things section-shell section-space" id="kejutan" aria-labelledby="surprise-title">
            <div class="section-heading reveal"><p class="eyebrow">03 / SEDIKIT KEJUTAN UNTUKMU</p><h2 id="surprise-title">Hal kecil.<br><em>Sayang yang besar.</em></h2><p>Karena membuatmu tersenyum selalu jadi hal favoritku.</p></div>
            <div class="surprise-grid">
                <article class="jar-card reveal"><span class="card-kicker">A LITTLE JAR OF LOVE</span><h3>Ambil satu rasa sayang</h3><p>Untuk hari yang indah, atau saat kamu butuh peluk.</p>
                    <button class="love-jar" id="love-jar" aria-label="Ambil satu pesan cinta dari Indra"><span class="jar-lid"></span><span class="jar-neck"></span><span class="jar-glass"><span class="jar-shine"></span><span class="jar-hearts" aria-hidden="true">@for($i = 0; $i < 13; $i++)<i style="--i:{{ $i }};--x:{{ 9 + ($i * 29) % 70 }}%;--y:{{ 3 + ($i * 17) % 69 }}%">♥</i>@endfor</span><span class="jar-label handwritten">little things<br>i love about us ♡</span></span></button>
                    <p class="jar-note handwritten">psst... klik botolnya!</p>
                    <div class="note-result" aria-live="polite" aria-atomic="true"><span aria-hidden="true">“</span><p id="love-note">Ada banyak rasa sayang yang belum sempat aku ucapkan. Satu di antaranya menunggumu di sini.</p><small id="note-count">DARI INDRA, UNTUK KAMU</small></div>
                    <button class="text-link" id="another-note">Satu pesan lagi <x-icon name="refresh"/></button>
                </article>
                <article class="puzzle-card reveal"><span class="card-kicker">WE FIT TOGETHER</span><h3>Lengkapi kenangan kita</h3><p>Pilih dua potongan untuk menukar tempatnya.</p><div class="puzzle-wrap"><div class="puzzle-board" id="puzzle-board" aria-label="Puzzle foto senja, sembilan potongan" data-image="{{ asset('images/senja-kita.webp') }}"></div><img class="puzzle-reference" id="puzzle-reference" src="{{ asset('images/senja-kita-small.webp') }}" alt="Contoh susunan puzzle: kita duduk berdua menikmati senja" width="640" height="640" loading="lazy" hidden></div><div class="puzzle-controls"><button class="text-link" id="puzzle-peek" aria-pressed="false">Lihat petunjuk <x-icon name="expand"/></button><button class="icon-button" id="puzzle-reset" aria-label="Acak ulang puzzle"><x-icon name="refresh"/></button></div><p class="puzzle-status" id="puzzle-status" aria-live="polite">Seperti kita, setiap potongan punya tempatnya. ♡</p><noscript><p>Aktifkan JavaScript untuk memainkan puzzle dan membuka pesan cinta.</p></noscript></article>
            </div>
        </section>

        <section class="letter-section section-space" id="surat" aria-labelledby="letter-title">
            <div class="letter-decoration" aria-hidden="true">love, always</div><x-flower class="flower letter-flower"/>
            <div class="section-shell letter-layout"><div class="letter-intro reveal"><p class="eyebrow">04 / DARI HATI, UNTUK HATI</p><h2 id="letter-title">Ada yang ingin<br><em>aku sampaikan.</em></h2><p>Mungkin aku nggak selalu pandai merangkai kata.<br>Tapi untukmu, aku ingin mencoba.</p><span class="handwritten">khusus untuk Nanda, dari Indra ♡</span><svg class="letter-arrow" viewBox="0 0 100 80" aria-hidden="true"><path d="M8 7C70 0 90 41 59 63M59 49l-2 17 18-1"/></svg></div>
                <div class="envelope-area reveal"><button class="envelope" id="open-letter" aria-haspopup="dialog" aria-controls="letter-dialog"><span class="envelope-back"></span><span class="envelope-paper"><span class="handwritten">Dear Nanda,</span><span>ada kamu di setiap doaku...</span></span><span class="envelope-front"></span><span class="envelope-flap"></span><span class="wax-seal">♡</span><span class="envelope-recipient">To: my favorite person</span></button><p class="envelope-hint">Klik amplopnya. Bacanya pelan-pelan, ya. <span>♡</span></p></div>
            </div>
        </section>

        <section class="forever-section section-shell section-space" aria-labelledby="forever-title"><div class="forever-art reveal"><div class="forever-photo"><img src="{{ asset('images/senja-berdua.webp') }}" alt="Indra dan Nanda saling menoleh di tepi pantai saat matahari terbenam" width="1600" height="900" loading="lazy"><span class="forever-photo-overlay"></span><span class="handwritten">let's make more memories.</span></div></div><div class="forever-copy reveal"><p class="eyebrow">HALAMAN BERIKUTNYA?</p><h2 id="forever-title">Masih ingin bersamamu.<br><em>Besok, dan besoknya lagi.</em></h2><p>Selamat dua tahun untuk kita, sayang.<br>Terima kasih sudah menjadi bagian paling hangat dari ceritaku.<br>Semoga ada banyak “kita” di tahun-tahun berikutnya.</p><button class="button button-primary" id="send-hug">Satu peluk untukmu <x-icon name="heart"/></button><p class="hug-response handwritten" id="hug-response" aria-live="polite"></p></div><span class="forever-doodle" aria-hidden="true">♡</span></section>
    </main>

    <footer class="site-footer section-shell"><a class="brand" href="#home">Untuk Nanda Aula Selfiyana<span class="brand-dot">.</span></a><p>Dibuat oleh Indra, dengan cinta yang nggak habis-habis. <span aria-hidden="true">♡</span></p><a href="#home" class="footer-top">Ke awal cerita <span aria-hidden="true">↑</span></a></footer>

    <aside class="music-panel" id="music-panel" hidden aria-label="Pemutar lagu kita"><div class="music-panel-heading"><span class="eyebrow">OUR LITTLE SOUNDTRACK</span><div class="music-panel-actions"><button class="icon-button" id="music-minimize" aria-label="Kecilkan pemutar, lagu tetap berjalan"><x-icon name="minimize"/></button><button class="icon-button" id="music-close" aria-label="Tutup musik dan hentikan lagu"><x-icon name="close"/></button></div></div><div class="mini-controls"><button class="music-drag" id="music-drag" aria-label="Geser pemutar kecil dengan sentuhan atau tombol panah"><x-icon name="grip"/><span>Sempurna</span></button><button class="icon-button" id="music-maximize" aria-label="Besarkan pemutar musik"><x-icon name="expand"/></button><button class="icon-button" id="music-mini-close" aria-label="Tutup musik dan hentikan lagu"><x-icon name="close"/></button></div><div class="track-info"><span class="record" aria-hidden="true"><span>♡</span></span><div><h3>Sempurna</h3><p>Andra and The Backbone</p><span class="handwritten">lagu kita, rasa kita.</span></div></div><div id="youtube-container" class="youtube-player" hidden><div id="youtube-player"></div></div><button class="button button-primary music-play" id="music-play"><x-icon name="play"/><span>Putar lagu kita</span></button><p class="music-status" id="music-status" aria-live="polite">Musik mulai setelah kamu menekan putar.</p><a id="music-fallback" class="text-link" href="{{ $anniversary['music_url'] }}" target="_blank" rel="noopener noreferrer">Dengarkan di YouTube ↗</a></aside>

    <dialog class="lightbox" id="photo-dialog" aria-label="Album kenangan"><button class="dialog-close icon-button" data-close aria-label="Tutup foto"><x-icon name="close"/></button><div class="lightbox-image-wrap"><img id="lightbox-image" src="{{ asset('images/galeri-seni.webp') }}" alt=""><button class="lightbox-prev icon-button" id="photo-prev" aria-label="Foto sebelumnya">←</button><button class="lightbox-next icon-button" id="photo-next" aria-label="Foto berikutnya">→</button></div><div class="lightbox-caption"><p id="lightbox-caption" class="handwritten"></p><span id="lightbox-count"></span></div></dialog>

    <dialog class="letter-dialog" id="letter-dialog" aria-labelledby="letter-dialog-title"><button class="dialog-close icon-button" data-close aria-label="Tutup surat"><x-icon name="close"/></button><div class="letter-paper"><span class="eyebrow">SEBUAH SURAT CINTA · 15 NOVEMBER 2026</span><h2 id="letter-dialog-title" class="handwritten">Nanda, sayangku...</h2><p>Selamat dua tahun untuk kita. Rasanya ada begitu banyak hal yang ingin aku bilang, tapi yang paling pertama adalah: <strong>terima kasih sudah hadir dan berjalan sejauh ini bersamaku.</strong></p><p>Kalau melihat foto-foto kita, aku sadar bahwa yang paling aku rindukan bukan cuma tempatnya. Tapi kamu di sebelahku. Cara kita tertawa, duduk berdua, dan membuat hari yang sederhana terasa begitu berharga.</p><p>Aku tahu, kita bukan dua orang yang sempurna. Ada saatnya aku belum bisa memahami kamu dengan baik, atau belum pandai menunjukkan betapa aku peduli. Untuk itu, aku ingin terus belajar. Mendengarkanmu lebih sungguh-sungguh, menjaga perasaanmu, dan menyayangimu lewat hal-hal yang nyata.</p><p>Nanda, semoga kamu selalu merasa cukup dan dicintai saat bersamaku. Kamu nggak harus selalu kuat, nggak harus selalu ceria. Di hari yang berantakan sekalipun, aku tetap ingin ada. Mendengar ceritamu, menemanimu, atau sekadar duduk diam di dekatmu.</p><p>Untuk tahun-tahun yang akan datang, aku nggak meminta semuanya berjalan sempurna. Aku cuma berharap kita terus punya kemauan untuk saling mengerti, saling menjaga, dan memilih satu sama lain lagi.</p><p><strong>Aku sayang kamu. Dengan segala hal kecil tentangmu, dan dengan banyak cara yang masih ingin aku tunjukkan.</strong></p><p class="letter-signoff">Masih kamu. Selalu kamu.<span class="handwritten">Dengan seluruh sayangku,<br>{{ $anniversary['sender'] }} ♡</span></p><div class="letter-bottom-heart" aria-hidden="true">♡</div></div></dialog>
    <script type="application/json" id="anniversary-data">{!! json_encode(['notes' => $anniversary['notes'], 'videoId' => $anniversary['music_video_id'], 'musicPath' => $anniversary['music_path'] ? asset($anniversary['music_path']) : null], JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE) !!}</script>
</body>
</html>
