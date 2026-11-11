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
    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const staticPage = await noJS.newPage();
    await staticPage.goto(url);
    assert.equal(await staticPage.locator('.memory-card:visible').count(), 12);
    assert.ok(await staticPage.locator('#hero-title').isVisible());
    await noJS.close();
    console.log('PASS: page, images, counter, gallery, lightbox, 12 notes, complete puzzle, letter, focus, hug, music fallback, 4 screen sizes, reduced motion, no-JS content.');
} finally {
    await browser.close();
}
