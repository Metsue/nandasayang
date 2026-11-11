(() => {
    'use strict';
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
    const data = JSON.parse($('#anniversary-data').textContent);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Content remains visible if JavaScript is disabled or IntersectionObserver is unavailable.
    if ('IntersectionObserver' in window) {
        document.documentElement.classList.add('js-ready');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        $$('.reveal').forEach(el => observer.observe(el));
    }

    let scrollScheduled = false;
    const updateScroll = () => {
        const total = document.documentElement.scrollHeight - innerHeight;
        $('.scroll-progress').style.transform = `scaleX(${total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0})`;
        scrollScheduled = false;
    };
    addEventListener('scroll', () => {
        if (!scrollScheduled) {
            scrollScheduled = true;
            requestAnimationFrame(updateScroll);
        }
    }, { passive: true });
    addEventListener('resize', updateScroll);
    updateScroll();

    const counter = $('[data-start]');
    if (counter) {
        const start = Date.parse(counter.dataset.start);
        const tick = () => {
            const elapsed = Math.max(0, Math.floor((Date.now() - start) / 1000));
            $('#time-days').textContent = Math.floor(elapsed / 86400).toLocaleString('id-ID');
            $('#time-hours').textContent = String(Math.floor(elapsed / 3600) % 24).padStart(2, '0');
            $('#time-minutes').textContent = String(Math.floor(elapsed / 60) % 60).padStart(2, '0');
            $('#time-seconds').textContent = String(elapsed % 60).padStart(2, '0');
        };
        if (Number.isFinite(start)) {
            tick();
            setInterval(tick, 1000);
        }
    }

    function confetti(amount = 42) {
        if (reducedMotion.matches) return;
        const host = $('#confetti');
        if (host.childElementCount > 90) return;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < amount; i++) {
            const piece = document.createElement('span');
            piece.className = 'confetti-piece';
            piece.textContent = ['♥', '✧', '♡', '✿'][i % 4];
            piece.style.cssText = `--x:${Math.random() * 100}%;--size:${10 + Math.random() * 17}px;--color:${['#bd7893', '#b09ac9', '#e3a8b7', '#d8b679'][i % 4]};--duration:${3 + Math.random() * 2}s;--delay:${Math.random() * 0.8}s;--drift:${Math.random() * 150 - 75}px`;
            piece.addEventListener('animationend', () => piece.remove(), { once: true });
            fragment.append(piece);
        }
        host.append(fragment);
    }

    // Native dialogs provide keyboard focus containment and Escape support.
    function showDialog(dialog) {
        dialog.showModal();
        document.body.classList.add('modal-open');
    }
    $$('dialog').forEach(dialog => {
        $('[data-close]', dialog).addEventListener('click', () => dialog.close());
        dialog.addEventListener('click', event => {
            const bounds = dialog.getBoundingClientRect();
            if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
        });
        dialog.addEventListener('close', () => {
            if (!$('dialog[open]')) document.body.classList.remove('modal-open');
        });
    });

    const cards = $$('.memory-card');
    const more = $('#gallery-more');
    let category = 'all';
    let expanded = false;
    let album = cards;
    let photoIndex = 0;
    const applyGallery = () => {
        album = cards.filter(card => category === 'all' || card.dataset.category === category);
        cards.forEach(card => { card.hidden = true; });
        album.slice(0, expanded ? album.length : 6).forEach(card => { card.hidden = false; });
        more.hidden = expanded || album.length <= 6;
        $('#gallery-status').textContent = `${Math.min(album.length, expanded ? album.length : 6)} kenangan ditampilkan`;
        requestAnimationFrame(updateScroll);
    };
    $$('.filter-button').forEach(button => button.addEventListener('click', () => {
        category = button.dataset.filter;
        expanded = false;
        $$('.filter-button').forEach(item => {
            item.classList.toggle('active', item === button);
            item.setAttribute('aria-pressed', String(item === button));
        });
        applyGallery();
    }));
    more.addEventListener('click', () => {
        expanded = true;
        applyGallery();
        album[6]?.focus({ preventScroll: true });
    });
    applyGallery();
    const photoDialog = $('#photo-dialog');
    const renderPhoto = () => {
        const card = album[photoIndex];
        $('#lightbox-image').src = card.dataset.full;
        $('#lightbox-image').alt = $('img', card).alt;
        $('#lightbox-caption').textContent = card.dataset.caption;
        $('#lightbox-count').textContent = `${String(photoIndex + 1).padStart(2, '0')} / ${String(album.length).padStart(2, '0')}`;
    };
    cards.forEach(card => card.addEventListener('click', () => {
        photoIndex = album.indexOf(card);
        renderPhoto();
        showDialog(photoDialog);
    }));
    const changePhoto = direction => {
        photoIndex = (photoIndex + direction + album.length) % album.length;
        renderPhoto();
    };
    $('#photo-prev').addEventListener('click', () => changePhoto(-1));
    $('#photo-next').addEventListener('click', () => changePhoto(1));
    photoDialog.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            changePhoto(event.key === 'ArrowRight' ? 1 : -1);
        }
    });
    let touchX = null;
    $('#lightbox-image').addEventListener('touchstart', event => { touchX = event.changedTouches[0].screenX; }, { passive: true });
    $('#lightbox-image').addEventListener('touchend', event => {
        const delta = touchX === null ? 0 : event.changedTouches[0].screenX - touchX;
        if (Math.abs(delta) > 55) changePhoto(delta < 0 ? 1 : -1);
        touchX = null;
    }, { passive: true });

    function shuffle(items) {
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        return items;
    }
    let noteQueue = [];
    let lastNote = -1;
    let notesRead = 0;
    function drawNote() {
        if (!data.notes.length) return;
        if (!noteQueue.length) {
            noteQueue = shuffle(data.notes.map((_, index) => index));
            if (noteQueue.length > 1 && noteQueue[0] === lastNote) [noteQueue[0], noteQueue[1]] = [noteQueue[1], noteQueue[0]];
            notesRead = 0;
        }
        lastNote = noteQueue.shift();
        notesRead++;
        $('#love-note').textContent = data.notes[lastNote];
        $('#note-count').textContent = `${String(notesRead).padStart(2, '0')} / ${data.notes.length} PESAN SAYANG DARI INDRA`;
        const note = $('.note-result');
        note.classList.remove('note-enter');
        void note.offsetWidth;
        note.classList.add('note-enter');
        $('#love-jar').classList.remove('shake');
        void $('#love-jar').offsetWidth;
        $('#love-jar').classList.add('shake');
        if (notesRead === 1) confetti(12);
    }
    $('#love-jar').addEventListener('click', drawNote);
    $('#another-note').addEventListener('click', drawNote);

    const board = $('#puzzle-board');
    let tiles = [];
    let selected = null;
    let moves = 0;
    let solved = false;
    function renderPuzzle() {
        board.replaceChildren();
        tiles.forEach((piece, position) => {
            const tile = document.createElement('button');
            tile.className = 'puzzle-tile';
            tile.dataset.piece = String(piece);
            tile.dataset.position = String(position);
            const picture = document.createElement('span');
            picture.className = 'puzzle-picture';
            picture.style.backgroundImage = `url("${board.dataset.image}")`;
            picture.style.left = `${piece % 3 * -100}%`;
            picture.style.top = `${Math.floor(piece / 3) * -100}%`;
            picture.setAttribute('aria-hidden', 'true');
            tile.setAttribute('aria-label', `Potongan ${piece + 1}, baris ${Math.floor(position / 3) + 1}, kolom ${position % 3 + 1}`);
            tile.setAttribute('aria-pressed', 'false');
            const number = document.createElement('span');
            number.className = 'piece-number';
            number.textContent = String(piece + 1);
            number.setAttribute('aria-hidden', 'true');
            tile.append(picture, number);
            tile.addEventListener('click', () => selectTile(position));
            board.append(tile);
        });
        board.classList.toggle('solved', solved);
    }
    function selectTile(position) {
        if (solved) return;
        if (selected === null) {
            selected = position;
            board.children[position].classList.add('selected');
            board.children[position].setAttribute('aria-pressed', 'true');
            $('#puzzle-status').textContent = 'Sekarang pilih potongan lain untuk ditukar.';
        } else if (selected === position) {
            board.children[position].classList.remove('selected');
            board.children[position].setAttribute('aria-pressed', 'false');
            selected = null;
            $('#puzzle-status').textContent = 'Pilih dua potongan untuk menukar tempatnya. ♡';
        } else {
            [tiles[selected], tiles[position]] = [tiles[position], tiles[selected]];
            selected = null;
            moves++;
            solved = tiles.every((piece, index) => piece === index);
            renderPuzzle();
            board.children[position].focus({ preventScroll: true });
            $('#puzzle-status').textContent = solved ? `Lengkap! Sama seperti hariku kalau ada kamu. ♡ (${moves} langkah)` : `${moves} langkah. Pelan-pelan, kita lengkapi bersama. ♡`;
            if (solved) confetti();
        }
    }
    function resetPuzzle() {
        do { tiles = shuffle(Array.from({ length: 9 }, (_, i) => i)); } while (tiles.every((piece, index) => piece === index));
        selected = null;
        moves = 0;
        solved = false;
        $('#puzzle-reference').hidden = true;
        $('#puzzle-peek').setAttribute('aria-pressed', 'false');
        $('#puzzle-status').textContent = 'Seperti kita, setiap potongan punya tempatnya. ♡';
        renderPuzzle();
    }
    $('#puzzle-reset').addEventListener('click', resetPuzzle);
    $('#puzzle-peek').addEventListener('click', () => {
        const reference = $('#puzzle-reference');
        reference.hidden = !reference.hidden;
        $('#puzzle-peek').setAttribute('aria-pressed', String(!reference.hidden));
        board.inert = !reference.hidden;
    });
    $('#puzzle-reset').addEventListener('click', () => { board.inert = false; });
    resetPuzzle();

    const envelope = $('#open-letter');
    let letterOpening = false;
    envelope.addEventListener('click', () => {
        if (letterOpening) return;
        letterOpening = true;
        envelope.classList.add('opened');
        setTimeout(() => {
            showDialog($('#letter-dialog'));
            $('#letter-dialog').scrollTop = 0;
            letterOpening = false;
        }, reducedMotion.matches ? 0 : 650);
    });
    $('#letter-dialog').addEventListener('close', () => envelope.classList.remove('opened'));
    $('#send-hug').addEventListener('click', () => {
        confetti(60);
        $('#hug-response').textContent = 'Peluk erat dari Indra. Kamu disayang, selalu. ♡';
    });

    const panel = $('#music-panel');
    const toggle = $('#music-toggle');
    const playButton = $('#music-play');
    const miniExpand = $('#music-expand-mini');
    const musicStatus = $('#music-status');
    let player = null;
    let localAudio = null;
    let playing = false;
    let ready = false;
    let loadTimer;
    function setPlaying(value) {
        playing = value;
        toggle.classList.toggle('playing', value);
        panel.classList.toggle('is-playing', value);
        $('span', playButton).textContent = value ? 'Jeda lagu' : 'Putar lagu kita';
        playButton.setAttribute('aria-label', value ? 'Jeda lagu Sempurna' : 'Putar lagu Sempurna');
    }
    function closeMusic() {
        const keepVideoVisible = !data.musicPath && (!$('#youtube-container').hidden || playButton.disabled);
        panel.hidden = !keepVideoVisible;
        panel.classList.toggle('compact', keepVideoVisible);
        miniExpand.hidden = !keepVideoVisible;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus({ preventScroll: true });
    }
    function expandMusic() {
        panel.hidden = false;
        panel.classList.remove('compact');
        miniExpand.hidden = true;
        toggle.setAttribute('aria-expanded', 'true');
    }
    toggle.addEventListener('click', () => {
        if (!panel.hidden && !panel.classList.contains('compact')) return closeMusic();
        expandMusic();
    });
    miniExpand.addEventListener('click', expandMusic);
    $('#music-close').addEventListener('click', closeMusic);
    panel.addEventListener('keydown', event => { if (event.key === 'Escape') closeMusic(); });
    function musicError() {
        clearTimeout(loadTimer);
        playButton.disabled = false;
        setPlaying(false);
        musicStatus.textContent = 'Pemutar belum bisa terhubung. Kamu tetap bisa mendengarkan lagu kita lewat tautan YouTube di bawah.';
        if (panel.classList.contains('compact')) {
            panel.hidden = true;
            panel.classList.remove('compact');
            miniExpand.hidden = true;
        }
    }
    function createPlayer() {
        $('#youtube-container').hidden = false;
        player = new window.YT.Player('youtube-player', {
            host: 'https://www.youtube-nocookie.com',
            videoId: data.videoId,
            width: '100%', height: '200',
            playerVars: { playsinline: 1, rel: 0, origin: location.origin },
            events: {
                onReady(event) {
                    clearTimeout(loadTimer);
                    ready = true;
                    playButton.disabled = false;
                    event.target.setVolume(45);
                    const iframe = event.target.getIframe();
                    iframe.title = 'Sempurna — Andra and The Backbone, video musik resmi';
                    musicStatus.textContent = 'Tekan putar jika lagunya belum mulai. Selamat menikmati cerita kita. ♡';
                    if (!panel.hidden) event.target.playVideo();
                },
                onStateChange(event) {
                    setPlaying(event.data === 1);
                    if (event.data === 1) {
                        musicStatus.textContent = 'Sempurna — menemani cerita kecil kita. ♡';
                    }
                    if (event.data === 2) musicStatus.textContent = 'Lagu dijeda. Lanjutkan kapan pun kamu mau.';
                    if (event.data === 0) musicStatus.textContent = 'Lagunya selesai. Rasa sayangnya belum. ♡';
                },
                onError: musicError,
            },
        });
    }
    playButton.addEventListener('click', async () => {
        if (data.musicPath) {
            if (!localAudio) {
                localAudio = new Audio(data.musicPath);
                localAudio.loop = true;
                localAudio.volume = 0.45;
                localAudio.addEventListener('error', musicError);
                localAudio.addEventListener('pause', () => setPlaying(false));
                localAudio.addEventListener('play', () => setPlaying(true));
            }
            try {
                if (playing) { localAudio.pause(); musicStatus.textContent = 'Lagu dijeda.'; }
                else { await localAudio.play(); musicStatus.textContent = 'Sempurna — menemani cerita kecil kita. ♡'; }
            } catch { musicError(); }
            return;
        }
        if (ready) {
            if (playing) player.pauseVideo();
            else player.playVideo();
            return;
        }
        playButton.disabled = true;
        musicStatus.textContent = 'Menghubungkan lagu kita…';
        loadTimer = setTimeout(musicError, 15000);
        if (window.YT?.Player) {
            player?.destroy();
            createPlayer();
        } else if (!$('#youtube-api')) {
            window.onYouTubeIframeAPIReady = createPlayer;
            const script = document.createElement('script');
            script.id = 'youtube-api';
            script.src = 'https://www.youtube.com/iframe_api';
            script.onerror = () => { script.remove(); musicError(); };
            document.head.append(script);
        }
    });
})();
