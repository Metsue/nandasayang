import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const url = process.env.TEST_URL || 'http://localhost/nandasayang/public/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir('test-results', { recursive: true });
const errors = [];
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => {
    if (response.url().startsWith(url) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
});
try {
    const response = await page.goto(url, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.match(await page.title(), /Nanda/);
    assert.match(await page.locator('.site-header .brand').textContent(), /Untuk Nanda Aula Selfiyana/);
    assert.match(await page.locator('.site-footer .brand').textContent(), /Untuk Nanda Aula Selfiyana/);
    assert.equal(await page.locator('#time-days').textContent() === '—', false);
    const widthCheck = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
    assert.ok(await widthCheck(), 'Desktop has no horizontal overflow');
    await page.screenshot({ path: 'test-results/desktop-hero.png' });
    assert.equal(await page.locator('.memory-card:visible').count(), 6);
    await page.locator('#gallery-more').click();
    assert.equal(await page.locator('.memory-card:visible').count(), 12);
    await page.locator('[data-filter="senja"]').click();
    assert.equal(await page.locator('.memory-card:visible').count(), 2);
    await page.locator('.memory-card:visible').first().click();
    assert.ok(await page.locator('#photo-dialog').evaluate(el => el.open));
    assert.equal(await page.locator('#lightbox-count').textContent(), '01 / 02');
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#lightbox-count').textContent(), '02 / 02');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#photo-dialog').evaluate(el => el.open), false);
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('memory-card')), true);
    await page.locator('[data-filter="all"]').click();

    const notes = new Set();
    for (let i = 0; i < 12; i++) {
        await page.locator('#love-jar').click();
        notes.add(await page.locator('#love-note').textContent());
    }
    assert.equal(notes.size, 12, 'All twelve notes appear without repetition');
    await page.locator('#puzzle-peek').click();
    assert.equal(await page.locator('#puzzle-reference').isVisible(), true);
    await page.locator('#puzzle-reset').click();
    assert.equal(await page.locator('#puzzle-reference').isVisible(), false);
    for (let position = 0; position < 9; position++) {
        const pieces = await page.locator('.puzzle-tile').evaluateAll(els => els.map(el => Number(el.dataset.piece)));
        if (pieces[position] !== position) {
            await page.locator('.puzzle-tile').nth(position).click();
            await page.locator('.puzzle-tile').nth(pieces.indexOf(position)).click();
        }
    }
    assert.match(await page.locator('#puzzle-status').textContent(), /Lengkap!/);
    assert.ok(await page.locator('#puzzle-board').evaluate(el => el.classList.contains('solved')));
    await page.locator('#open-letter').click();
    await page.waitForFunction(() => document.querySelector('#letter-dialog').open);
    assert.match(await page.locator('#letter-dialog').textContent(), /Indra/);
    await page.screenshot({ path: 'test-results/letter-desktop.png' });
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'open-letter');
    await page.locator('#send-hug').click();
    assert.match(await page.locator('#hug-response').textContent(), /Peluk erat dari Indra/);

    // The gift must still work when YouTube is unavailable.
    await page.route('https://www.youtube.com/iframe_api', route => route.abort());
    await page.locator('#music-toggle').click();
    await page.locator('#music-play').click();
    await page.waitForFunction(() => document.querySelector('#music-status').textContent.includes('belum bisa terhubung'));
    assert.equal(await page.locator('#music-fallback').getAttribute('href'), 'https://www.youtube.com/watch?v=jStNaVCW838');
    await page.locator('#music-close').click();
    await page.evaluate(async () => {
        const images = [...document.querySelectorAll('img')];
        images.forEach(img => img.loading = 'eager');
        await Promise.all(images.map(img => img.decode().catch(() => {})));
    });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: 'test-results/desktop-full.png', fullPage: true });

    for (const width of [390, 768, 320]) {
        await page.setViewportSize({ width, height: 844 });
        await page.evaluate(() => scrollTo(0, 0));
        assert.ok(await widthCheck(), `No horizontal overflow at ${width}px`);
        if (width === 390) {
            await page.screenshot({ path: 'test-results/mobile-hero.png' });
            await page.screenshot({ path: 'test-results/mobile-full.png', fullPage: true });
            await page.locator('#open-letter').click();
            await page.waitForFunction(() => document.querySelector('#letter-dialog').open);
            await page.screenshot({ path: 'test-results/letter-mobile.png' });
            await page.keyboard.press('Escape');
        }
    }
    const broken = await page.locator('img').evaluateAll(els => els.filter(img => img.complete && img.naturalWidth === 0).map(img => img.src));
    assert.deepEqual(broken, [], 'No broken images');
    assert.deepEqual(errors, [], 'No JavaScript errors or failed local assets');
    if (url.endsWith('/public/')) {
        const localEntry = await page.goto(url.slice(0, -7), { waitUntil: 'networkidle' });
        assert.equal(localEntry.status(), 200, 'XAMPP entry redirects to the working application');
        assert.match(await page.title(), /Nanda/);
    }
    const audioContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const audioPage = await audioContext.newPage();
    await audioPage.route(url, async route => {
        const response = await route.fetch();
        const body = (await response.text()).replace(/"musicPath":(?:null|"[^"]*")/, '"musicPath":"/audio/lagu-kita.mp3"');
        await route.fulfill({ response, body });
    });
    await audioPage.addInitScript(() => {
        window.Audio = class extends EventTarget {
            play() { this.dispatchEvent(new Event('play')); return Promise.resolve(); }
            pause() { this.dispatchEvent(new Event('pause')); }
        };
    });
    await audioPage.goto(url);
    await audioPage.locator('#music-toggle').click();
    await audioPage.locator('#music-play').click();
    assert.equal(await audioPage.locator('#music-toggle').evaluate(el => el.classList.contains('playing')), true);
    await audioPage.locator('#music-minimize').click();
    assert.equal(await audioPage.locator('#music-panel').evaluate(el => el.classList.contains('minimized')), true);
    assert.equal(await audioPage.locator('#music-toggle').evaluate(el => el.classList.contains('playing')), true, 'Minimizing local audio keeps playing');
    await audioPage.locator('#music-maximize').click();
    assert.equal(await audioPage.locator('#music-toggle').evaluate(el => el.classList.contains('playing')), true);
    await audioPage.locator('#music-close').click();
    assert.equal(await audioPage.locator('#music-panel').isVisible(), false, 'Local audio hides the full player');
    assert.equal(await audioPage.locator('#music-toggle').evaluate(el => el.classList.contains('playing')), false, 'Closing stops local audio');
    await audioPage.locator('#music-toggle').click();
    await audioPage.locator('#music-play').click();
    assert.equal(await audioPage.locator('#music-toggle').evaluate(el => el.classList.contains('playing')), true, 'Local audio can play again');
    await audioPage.locator('#music-toggle').click();
    assert.equal(await audioPage.locator('#music-panel').isVisible(), false, 'Header toggle also closes the panel');
    assert.equal(await audioPage.locator('#music-toggle').evaluate(el => el.classList.contains('playing')), false);
    await audioContext.close();
    const ytContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const ytPage = await ytContext.newPage();
    await ytPage.addInitScript(() => {
        window.__ytStats = { played: 0, stopped: 0, destroyed: 0 };
        window.YT = { Player: class {
            constructor(id, options) {
                this.options = options;
                this.iframe = document.createElement('iframe');
                this.iframe.id = id;
                document.getElementById(id).replaceWith(this.iframe);
                setTimeout(() => options.events.onReady({ target: this }), 0);
            }
            setVolume() {}
            getIframe() { return this.iframe; }
            playVideo() { window.__ytStats.played++; this.options.events.onStateChange({ data: 1 }); }
            pauseVideo() { this.options.events.onStateChange({ data: 2 }); }
            stopVideo() { window.__ytStats.stopped++; this.options.events.onStateChange({ data: 0 }); }
            destroy() { window.__ytStats.destroyed++; this.iframe.remove(); }
        } };
    });
    await ytPage.goto(url);
    await ytPage.locator('#music-toggle').click();
    await ytPage.locator('#music-play').click();
    await ytPage.waitForFunction(() => document.querySelector('#music-toggle').classList.contains('playing'));
    await ytPage.locator('#music-minimize').click();
    assert.equal(await ytPage.locator('#music-panel').evaluate(el => el.classList.contains('minimized')), true);
    assert.equal(await ytPage.locator('#youtube-container iframe').count(), 1, 'Minimizing keeps the same YouTube iframe');
    assert.deepEqual(await ytPage.evaluate(() => window.__ytStats), { played: 1, stopped: 0, destroyed: 0 });
    const videoSize = await ytPage.locator('#youtube-container iframe').boundingBox();
    assert.ok(videoSize.width >= 200 && videoSize.height >= 200, 'The minimized YouTube video remains visible at its minimum size');
    const beforeDrag = await ytPage.locator('#music-panel').boundingBox();
    const handle = await ytPage.locator('#music-drag').boundingBox();
    await ytPage.mouse.move(handle.x + 18, handle.y + 20);
    await ytPage.mouse.down();
    await ytPage.mouse.move(handle.x - 62, handle.y - 80, { steps: 6 });
    await ytPage.mouse.up();
    const afterDrag = await ytPage.locator('#music-panel').boundingBox();
    assert.ok(afterDrag.x < beforeDrag.x - 30 && afterDrag.y < beforeDrag.y - 30, 'The minimized player can be dragged');
    assert.deepEqual(await ytPage.evaluate(() => window.__ytStats), { played: 1, stopped: 0, destroyed: 0 }, 'Dragging does not interrupt playback');
    await ytPage.locator('#music-maximize').click();
    assert.equal(await ytPage.locator('#music-panel').evaluate(el => el.classList.contains('minimized')), false);
    assert.deepEqual(await ytPage.evaluate(() => window.__ytStats), { played: 1, stopped: 0, destroyed: 0 }, 'Maximizing does not interrupt playback');
    await ytPage.locator('#music-minimize').click();
    await ytPage.locator('#music-mini-close').click();
    assert.equal(await ytPage.locator('#music-panel').isVisible(), false, 'YouTube panel fully closes');
    assert.equal(await ytPage.locator('#music-toggle').evaluate(el => el.classList.contains('playing')), false, 'YouTube stops when closed');
    assert.deepEqual(await ytPage.evaluate(() => window.__ytStats), { played: 1, stopped: 1, destroyed: 1 });
    assert.equal(await ytPage.locator('#youtube-container iframe').count(), 0, 'Stopped YouTube iframe is removed');
    await ytPage.locator('#music-toggle').click();
    await ytPage.locator('#music-play').click();
    await ytPage.waitForFunction(() => document.querySelector('#music-toggle').classList.contains('playing'));
    await ytPage.locator('#music-toggle').click();
    assert.equal(await ytPage.locator('#music-panel').isVisible(), false);
    assert.deepEqual(await ytPage.evaluate(() => window.__ytStats), { played: 2, stopped: 2, destroyed: 2 });
    await ytContext.close();
    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const staticPage = await noJS.newPage();
    await staticPage.goto(url);
    assert.equal(await staticPage.locator('.memory-card:visible').count(), 12);
    assert.ok(await staticPage.locator('#hero-title').isVisible());
    await noJS.close();
    console.log('PASS: page, images, counter, gallery, lightbox, 12 notes, complete puzzle, letter, focus, hug, music minimize/drag/maximize/close/replay, fallback, 4 screen sizes, reduced motion, no-JS content.');
} finally {
    await browser.close();
}
