import { chromium, devices } from 'playwright';
import assert from 'node:assert/strict';
import { resolve, sep } from 'node:path';
import { stat } from 'node:fs/promises';

const origin = 'https://metsue.github.io/nandasayang/';
const root = resolve('build/pages');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ ...devices['Pixel 7'], reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];

try {
    await page.route(`${origin}**`, async route => {
        const pathname = new URL(route.request().url()).pathname.slice('/nandasayang/'.length) || 'index.html';
        const file = resolve(root, pathname);
        if (!file.startsWith(root + sep)) return route.abort();
        try {
            if (!(await stat(file)).isFile()) return route.abort();
            await route.fulfill({ path: file });
        } catch {
            errors.push(`Missing published file: ${pathname}`);
            await route.abort();
        }
    });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map(async image => {
            image.loading = 'eager';
            await image.decode().catch(() => {});
        }));
    });
    assert.match(await page.title(), /Nanda/);
    assert.equal(await page.locator('.memory-card').count(), 12);
    assert.notEqual(await page.locator('#time-days').textContent(), '—');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator('[data-filter="senja"]').tap();
    assert.equal(await page.locator('.memory-card:visible').count(), 2);
    await page.locator('.memory-card:visible').first().tap();
    assert.ok(await page.locator('#photo-dialog').evaluate(dialog => dialog.open));
    await page.locator('#photo-dialog [data-close]').tap();
    await page.locator('#open-letter').tap();
    assert.ok(await page.locator('#letter-dialog').evaluate(dialog => dialog.open));
    await page.locator('#letter-dialog [data-close]').tap();
    const broken = await page.locator('img').evaluateAll(images => images.filter(image => image.complete && !image.naturalWidth).map(image => image.src));
    assert.deepEqual(broken, []);
    assert.deepEqual(errors, []);
    console.log('PASS: GitHub Pages export loads its own CSS, JavaScript, fonts, and images; counter, gallery, photo viewer, and letter work on Android.');
} finally {
    await browser.close();
}
