import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'chrome' });
const base = process.env.TEST_BASE_URL || 'http://localhost:4173';
const errors = [];
try {
  // Regression: localized HTML must be correct before any JavaScript runs.
  const staticPage = await browser.newPage({ javaScriptEnabled: false });
  const headings = {
    en: ['Build fast.', 'A whole team.', 'Your team.', 'Show us the work', 'Less chasing. More renewing.'],
    'zh-CN': ['快速构建。', '完整的团队。', '你的团队。', '告诉我们哪些工作', '减少催办，专注续保。'],
    'zh-TW': ['快速打造。', '完整的團隊。', '你的團隊。', '告訴我們哪些工作', '減少催辦，專注續保。'],
    ja: ['すばやく形に。', 'チーム全員で。', 'あなたのチーム。', '本来の仕事を', '催促を減らし、更新を増やす。'],
    ru: ['Создавайте быстро.', 'Целая команда.', 'Ваша команда.', 'Покажите работу,', 'Меньше напоминаний. Больше продлений.'],
  };
  const paths = ['/', '/services/', '/about/', '/contact/', '/workflows/insurance/'];
  for (const [locale, expected] of Object.entries(headings)) {
    for (let i = 0; i < paths.length; i++) {
      const response = await staticPage.goto(`${base}/${locale}${paths[i]}`);
      assert.equal(response.status(), 200);
      assert.equal(await staticPage.locator('html').getAttribute('lang'), locale);
      assert.ok((await staticPage.locator('h1').innerText()).includes(expected[i]), `${locale}${paths[i]} must be localized without hydration`);
      assert.equal(await staticPage.locator('link[rel="canonical"]').getAttribute('href').then(url => new URL(url).pathname), `/${locale}${paths[i]}`);
    }
  }
  await staticPage.close();
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
    await page.waitForFunction(locale => document.documentElement.lang === locale, locales[i]);
    await page.locator(".wl-global-loading").waitFor({ state: "detached" });
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
  await page.waitForFunction(() => document.documentElement.lang === 'ru');
  await page.locator('.wl-global-loading').waitFor({ state: 'detached' });
  assert.ok(new URL(page.url()).pathname.startsWith('/ru/'));
  assert.equal(await page.locator('.nav-group a').first().getAttribute('href'), '/ru/services/');
  await page.locator('.nav-group a').first().click();
  await page.waitForURL('**/ru/services/');
  assert.match(await page.locator('h1').innerText(), /Целая команда/);
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
  // Explicit URLs override stale saved preferences, including after reload.
  await page.goto(`${base}/ja/services/?source=test#pricing`);
  await page.waitForFunction(() => localStorage.getItem('wayline.locale.v1') === 'ja');
  assert.ok((await page.locator('h1').innerText()).includes('チーム全員で。'));
  await page.locator('.language-trigger').click();
  await page.locator('.language-options [lang="zh-CN"]').click();
  await page.waitForFunction(() => document.documentElement.lang === 'zh-CN');
  await page.locator('.wl-global-loading').waitFor({ state: 'detached' });
  assert.equal(new URL(page.url()).pathname, '/zh-CN/services/');
  assert.equal(new URL(page.url()).search, '?source=test');
  assert.equal(new URL(page.url()).hash, '#pricing');
  await page.reload();
  assert.ok((await page.locator('h1').innerText()).includes('完整的团队。'));
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
  // The admin-style loader must stay up for real readiness, not just a timer.
  await page.goto(`${base}/en/services/`);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => {
    const ready = new Promise(resolve => { window.releaseLocaleFonts = resolve; });
    Object.defineProperty(document.fonts, 'ready', { configurable: true, get: () => ready });
  });
  await page.locator('.language-trigger').click();
  await page.locator('.language-options [lang="ja"]').click();
  await page.locator('.wl-global-loading[data-phase="loading"]').waitFor();
  await page.waitForTimeout(1600);
  assert.equal(await page.locator('.wl-global-loading').getAttribute('data-phase'), 'loading');
  assert.equal(await page.locator('.wl-global-loading').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(18, 101, 138)');
  assert.equal(await page.locator('.wl-global-loading').evaluate(el => el.matches(':modal')), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.wl-global-loading').count(), 1);
  await page.screenshot({ path: '/tmp/wayline-global-language-loading.png' });
  await page.evaluate(() => window.releaseLocaleFonts());
  await page.locator('.wl-global-loading[data-phase="complete"]').waitFor();
  assert.ok((await page.locator('h1').innerText()).includes('チーム全員で。'));
  await page.locator('.wl-global-loading').waitFor({ state: 'detached' });
  // A failure must never be represented as success; retry actually reruns it.
  await page.evaluate(() => {
    const original = history.replaceState.bind(history);
    history.replaceState = (...args) => {
      history.replaceState = original;
      throw new Error('Simulated language navigation failure');
    };
  });
  await page.locator('.language-trigger').click();
  await page.locator('.language-options [lang="zh-CN"]').click();
  await page.locator('.wl-global-loading[data-phase="error"]').waitFor();
  assert.equal(await page.locator('html').getAttribute('lang'), 'ja');
  await page.locator('.wl-global-loading__error button').first().click();
  await page.locator('.wl-global-loading').waitFor({ state: 'detached' });
  assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
  assert.deepEqual(errors, []);
  console.log('Passed: loader waits for readiness, modal interaction blocking, failure and retry, localized HTML without JavaScript, locale URLs and links, explicit URL precedence, query/hash preservation, five locales, persistence, navigation, keyboard, mobile bounds, transparent globe, no runtime errors.');
} finally { await browser.close(); }
