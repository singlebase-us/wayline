import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'chrome' });
const base = process.env.TEST_BASE_URL || 'http://localhost:4173';
const errors = [];
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  await page.locator('.experience[data-intro="complete"]').waitFor();
  const locales = ['zh-CN', 'zh-TW', 'ja', 'ru', 'en'];
  const titles = ['快速构建。', '快速打造。', 'すばやく形に。', 'Создавайте быстро.', 'Build fast.'];
  for (let i = 0; i < locales.length; i++) {
    await page.locator('.language-trigger').click();
    assert.equal(await page.locator('.nav-group').evaluate(el => el.inert), true);
    await page.locator(`.language-options [lang="${locales[i]}"]`).click();
    assert.equal(await page.locator('html').getAttribute('lang'), locales[i]);
    assert.ok((await page.locator('h1').innerText()).includes(titles[i]));
    assert.equal(await page.locator('.language-trigger').getAttribute('aria-expanded'), 'false');
  }
  await page.locator('.language-trigger').click();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.evaluate(() => document.activeElement.lang), 'zh-CN');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.language-trigger').evaluate(el => document.activeElement === el), true);
  await page.locator('.language-trigger').click();
  await page.locator('.language-options [lang="ru"]').click();
  await page.reload();
  await page.waitForFunction(() => document.documentElement.lang === 'ru');
  for (const path of ['/services/', '/about/', '/contact/', '/workflows/insurance/']) {
    await page.goto(base + path);
    await page.waitForFunction(() => document.documentElement.lang === 'ru');
    assert.match(await page.locator('h1').innerText(), /[А-Яа-я]/);
  }
  for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({width, height: 850});
    await page.goto(base);
    await page.locator('.experience[data-intro="complete"]').waitFor();
    await page.locator('.language-trigger').click();
    const bounds = await page.locator('.language-options button').evaluateAll(elements => elements.map(el => {
      const b = el.getBoundingClientRect(); return {left:b.left, right:b.right};
    }));
    assert.ok(bounds.every(b => b.left >= 0 && b.right <= width), `Language overflow at ${width}: ${JSON.stringify(bounds)}`);
    assert.equal(await page.locator('.language-trigger').evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0)');
    if (width === 375) await page.screenshot({path:'/tmp/wayline-language-mobile.png'});
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(base);
  await page.locator('.experience[data-intro="complete"]').waitFor();
  await page.locator('.language-trigger').click();
  await page.waitForTimeout(500);
  assert.equal(await page.locator('.nav-group').evaluate(el => getComputedStyle(el).opacity), '0');
  assert.equal(await page.locator('.language-options').evaluate(el => getComputedStyle(el).opacity), '1');
  await page.screenshot({path:'/tmp/wayline-language-desktop.png'});
  await page.locator('h1').click();
  assert.equal(await page.locator('.language-trigger').getAttribute('aria-expanded'), 'false');
  assert.deepEqual(errors, []);
  console.log('Passed: five locales, persistence, navigation, keyboard, mobile bounds, transparent globe, no runtime errors.');
} finally { await browser.close(); }
