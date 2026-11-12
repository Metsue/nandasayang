import { chromium, devices } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const url = process.env.TEST_URL || 'http://localhost/nandasayang/public/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir('test-results', { recursive: true });
const errors = [];

async function assertFits(locator, label) {
    const bounds = await locator.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return { left: rect.left, right: rect.right, viewport: innerWidth, scroll: el.scrollWidth, width: el.clientWidth };
    });
    assert.ok(bounds.left >= -1 && bounds.right <= bounds.viewport + 1, `${label} stays inside the screen: ${JSON.stringify(bounds)}`);
    assert.ok(bounds.scroll <= bounds.width + 1, `${label} does not clip its content`);
}

async function assertReachable(locator, label) {
    const visible = await locator.evaluate(el => {
        const rect = el.getBoundingClientRect();
        const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        return rect.top >= 0 && rect.bottom <= innerHeight && rect.width >= 44 && rect.height >= 44 && (hit === el || el.contains(hit));
    });
    assert.ok(visible, `${label} has a visible, unobstructed touch target`);
}

try {
    const context = await browser.newContext({ ...devices['Pixel 7'], reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
        if (response.url().startsWith(url) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(() => matchMedia('(pointer: coarse)').matches), true);

    for (const [width, height] of [[320, 740], [360, 800], [390, 844], [412, 915], [480, 800], [600, 960], [768, 1024], [915, 412], [740, 320]]) {
        await page.setViewportSize({ width, height });
        await page.evaluate(() => scrollTo(0, 0));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No page overflow at ${width} x ${height}`);
        for (const selector of ['.site-header', '.site-header .brand', '.site-header nav', '.hero h1', '.hero-actions', '.hero-photo-main', '.hero-photo-small', '.time-counter', '.gallery-filters', '.puzzle-wrap', '.envelope']) {
            await assertFits(page.locator(selector), `${selector} at ${width}px`);
        }
        await assertReachable(page.locator('#music-toggle'), `Music toggle at ${width}px`);
        assert.ok(await page.locator('.site-header nav').isVisible(), `Navigation remains available at ${width}px`);

        await page.locator('.site-header nav a[href="#kenangan"]').tap();
        assert.equal(new URL(page.url()).hash, '#kenangan');
        await page.locator('[data-filter="senja"]').tap();
        assert.equal(await page.locator('.memory-card:visible').count(), 2);
        await page.locator('.memory-card:visible').first().tap();
        assert.ok(await page.locator('#photo-dialog').evaluate(el => el.open));
        await assertFits(page.locator('#photo-dialog'), `Photo dialog at ${width}px`);
        await assertReachable(page.locator('#photo-dialog [data-close]'), 'Close photo');
        await assertReachable(page.locator('#photo-next'), 'Next photo');
        await page.locator('#photo-next').tap();
        assert.equal(await page.locator('#lightbox-count').textContent(), '02 / 02');
        if (height === 320) await page.screenshot({ path: 'test-results/android-landscape-photo.png' });
        await page.locator('#photo-dialog [data-close]').tap();
        await page.locator('[data-filter="all"]').tap();

        await page.locator('#open-letter').tap();
        await page.waitForFunction(() => document.querySelector('#letter-dialog').open);
        await assertReachable(page.locator('#letter-dialog [data-close]'), 'Close letter at start');
        await page.locator('#letter-dialog').evaluate(el => { el.scrollTop = el.scrollHeight; });
        await assertReachable(page.locator('#letter-dialog [data-close]'), 'Close letter after reading');
        await page.locator('#letter-dialog [data-close]').tap();
        await page.waitForFunction(() => !document.body.classList.contains('modal-open'));
        assert.equal(await page.evaluate(() => document.body.classList.contains('modal-open')), false);
        await page.locator('#music-toggle').tap();
        await assertFits(page.locator('#music-panel'), `Music panel at ${width}px`);
        await assertReachable(page.locator('#music-close'), 'Close music');
        await page.locator('#music-close').tap();
    }

    // Exercise real Chromium touch input, including a vertical gesture with sideways drift.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.memory-card:visible').first().tap();
    const cdp = await context.newCDPSession(page);
    const rect = await page.locator('#lightbox-image').boundingBox();
    async function swipe(dx, dy, cancel = false) {
        const x = rect.x + rect.width * .75;
        const y = rect.y + rect.height * .65;
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
        for (let step = 1; step <= 6; step++) {
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * step / 6, y: y + dy * step / 6 }] });
        }
        await cdp.send('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] });
    }
    await swipe(-120, 0);
    await page.waitForFunction(() => document.querySelector('#lightbox-count').textContent === '02 / 12');
    await swipe(-70, -180);
    assert.equal(await page.locator('#lightbox-count').textContent(), '02 / 12', 'Vertical gestures do not change photos');
    await swipe(-120, 0, true);
    assert.equal(await page.locator('#lightbox-count').textContent(), '02 / 12', 'Cancelled gestures do not change photos');
    await page.locator('#photo-dialog [data-close]').tap();

    await page.locator('#puzzle-peek').tap();
    assert.equal(await page.locator('#puzzle-reference').isVisible(), true);
    await page.locator('#puzzle-reset').tap();
    const before = await page.locator('.puzzle-tile').evaluateAll(els => els.map(el => el.dataset.piece));
    await page.locator('.puzzle-tile').nth(0).tap();
    await page.locator('.puzzle-tile').nth(1).tap();
    const after = await page.locator('.puzzle-tile').evaluateAll(els => els.map(el => el.dataset.piece));
    assert.deepEqual(after.slice(0, 2), [before[1], before[0]], 'Puzzle swaps with touch input');

    const musicContext = await browser.newContext({ ...devices['Pixel 7'], reducedMotion: 'reduce' });
    const musicPage = await musicContext.newPage();
    await musicPage.route(url, async route => {
        const response = await route.fetch();
        const body = (await response.text()).replace(/"musicPath":(?:null|"[^"]*")/, '"musicPath":"/audio/lagu-kita.mp3"');
        await route.fulfill({ response, body });
    });
    await musicPage.addInitScript(() => {
        window.Audio = class extends EventTarget {
            play() { this.dispatchEvent(new Event('play')); return Promise.resolve(); }
            pause() { this.dispatchEvent(new Event('pause')); }
        };
    });
    await musicPage.goto(url);
    await musicPage.locator('#music-toggle').tap();
    await musicPage.locator('#music-play').tap();
    await musicPage.locator('#music-minimize').tap();
    const miniBefore = await musicPage.locator('#music-panel').boundingBox();
    const grip = await musicPage.locator('#music-drag').boundingBox();
    const x = grip.x + grip.width / 2;
    const y = grip.y + grip.height / 2;
    const musicCdp = await musicContext.newCDPSession(musicPage);
    await musicCdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 6; step++) {
        await musicCdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - step * 12, y: y - step * 18 }] });
    }
    await musicCdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    const miniAfter = await musicPage.locator('#music-panel').boundingBox();
    assert.ok(miniAfter.x < miniBefore.x - 40 && miniAfter.y < miniBefore.y - 60, 'A finger can move the mini player');
    assert.equal(await musicPage.locator('#music-toggle').evaluate(el => el.classList.contains('playing')), true, 'Touch drag keeps music playing');
    await musicPage.locator('#music-mini-close').tap();
    await musicPage.waitForFunction(() => document.querySelector('#music-panel').hidden);
    assert.equal(await musicPage.locator('#music-panel').isVisible(), false);
    assert.equal(await musicPage.locator('#music-toggle').evaluate(el => el.classList.contains('playing')), false);
    await musicContext.close();

    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: 'test-results/android-hero.png' });
    await page.locator('#kenangan').screenshot({ path: 'test-results/android-gallery.png' });

    // Normal motion still reveals content on a touch device.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('#cerita .section-heading').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#cerita .reveal').classList.contains('visible'));
    assert.deepEqual(errors, [], 'No JavaScript errors or missing local assets');
    console.log('PASS: Android touch emulation, 9 portrait/landscape sizes, readable layouts, navigation, photo swipe, vertical/cancelled gestures, letter scrolling, draggable mini music player, puzzle taps, normal/reduced motion.');
} finally {
    await browser.close();
}
