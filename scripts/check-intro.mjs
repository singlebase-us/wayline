import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseURL = process.argv[2] || "http://localhost:3000";
const output = process.env.INTRO_QA_DIR || "/tmp/wayline-intro-qa";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "chrome",
  headless: true,
});
const results = [];
let previousCheck = Promise.resolve();
const ready = (page) =>
  page.locator('.experience[data-intro="complete"]').waitFor({ timeout: 8000 });
const active = (page) => page.locator(".scene.is-active").getAttribute("id");
async function check(name, options, test) {
  // Opening deliberately exits on visibilitychange. Concurrent browser pages
  // can background each other and throttle hydration, so serialize scenarios.
  const waitForPrevious = previousCheck;
  let release;
  previousCheck = new Promise((resolve) => {
    release = resolve;
  });
  await waitForPrevious;
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    ...options,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    await test(page);
    assert.deepEqual(errors, [], `${name}: browser exceptions`);
    results.push({ name, result: "passed", errors });
    console.log(`PASS ${name}`);
  } finally {
    await context.close();
    release();
  }
}
try {
  await check(
    "desktop GPU opening and gallery navigation",
    {},
    async (page) => {
      await page.addInitScript(() => {
        window.__entranceDraws = 0;
        const draw = WebGLRenderingContext.prototype.drawArrays;
        WebGLRenderingContext.prototype.drawArrays = function (...args) {
          window.__entranceDraws++;
          return draw.apply(this, args);
        };
      });
      await page.goto(baseURL);
      await page.locator('[data-intro-renderer="webgl"]').waitFor();
      await page.keyboard.press("ArrowDown");
      assert.equal(
        await active(page),
        "overview",
        "gallery must be locked during intro",
      );
      for (let i = 0; i < 7; i++) {
        await page.waitForTimeout(430);
        await page.screenshot({ path: `${output}/desktop-${i}.png` });
      }
      await ready(page);
      assert.ok(
        await page.evaluate(() => window.__entranceDraws > 12),
        "GPU must draw multiple frames",
      );
      const draws = await page.evaluate(() => window.__entranceDraws);
      await page.waitForTimeout(120);
      assert.equal(
        await page.evaluate(() => window.__entranceDraws),
        draws,
        "GPU loop must stop after intro",
      );
      assert.equal(
        await page.locator(".scene-stage").evaluate((e) => e.inert),
        false,
      );
      await page.mouse.move(800, 500);
      await page.mouse.wheel(0, 130);
      await page.waitForFunction(
        () => document.querySelector(".scene.is-active")?.id === "insurance",
      );
      await page.keyboard.press("ArrowDown");
      assert.equal(await active(page), "distribution");
      await page.locator(".gallery-map button").first().click();
      await page.waitForTimeout(1000);
      await page.locator(".scene.is-active .visual-link").click();
      await page.waitForURL("**/about/");
      assert.equal(await page.locator("h1").count(), 1);
    },
  );
  await check(
    "mobile DOM opening and swipe",
    { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    async (page) => {
      await page.goto(baseURL);
      await page.locator('[data-intro-renderer="dom"]').waitFor();
      await page.waitForTimeout(320);
      await page.screenshot({ path: `${output}/mobile-loading.png` });
      await ready(page);
      await page.screenshot({ path: `${output}/mobile-complete.png` });
      await page.locator(".experience").dispatchEvent("pointerdown", {
        pointerId: 1,
        pointerType: "touch",
        button: 0,
        clientX: 320,
        clientY: 510,
      });
      await page.locator(".experience").dispatchEvent("pointerup", {
        pointerId: 1,
        pointerType: "touch",
        button: 0,
        clientX: 100,
        clientY: 510,
      });
      assert.equal(await active(page), "insurance");
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
    },
  );
  await Promise.all([
    check("reduced motion", { reducedMotion: "reduce" }, async (page) => {
      let textureRequests = 0;
      page.on("request", (r) => {
        if (r.url().includes("/intro/")) textureRequests++;
      });
      await page.goto(baseURL);
      await ready(page);
      assert.equal(textureRequests, 0);
      await page.keyboard.press("ArrowDown");
      assert.equal(await active(page), "insurance");
    }),
    check("WebGL unavailable", {}, async (page) => {
      await page.addInitScript(() => {
        const get = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          return type.includes("webgl") ? null : get.call(this, type, ...args);
        };
      });
      await page.goto(baseURL);
      await ready(page);
      assert.equal(
        await page.locator(".scene-stage").evaluate((e) => e.inert),
        false,
      );
    }),
    check("failed decorative texture", {}, async (page) => {
      await page.route("**/intro/**", (route) => route.abort());
      await page.goto(baseURL);
      await ready(page);
      assert.equal(await page.locator(".entrance").isVisible(), false);
    }),
    check("slow decorative texture", {}, async (page) => {
      await page.route("**/intro/**", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2600));
        await route.abort().catch(() => {});
      });
      await page.goto(baseURL);
      await ready(page);
      assert.equal(await page.locator(".entrance").isVisible(), false);
    }),
  ]);
  await Promise.all([
    check("context loss", {}, async (page) => {
      await page.goto(baseURL);
      await page.locator('[data-intro-renderer="webgl"]').waitFor();
      await page
        .locator(".entrance canvas")
        .evaluate((e) =>
          e
            .getContext("webgl")
            .getExtension("WEBGL_lose_context")
            .loseContext(),
        );
      await ready(page);
      assert.equal(
        await page.locator(".scene-stage").evaluate((e) => e.inert),
        false,
      );
    }),
    check("resize during loading", {}, async (page) => {
      await page.goto(baseURL);
      await page.locator('[data-intro="loading"]').waitFor();
      await page.setViewportSize({ width: 1100, height: 750 });
      await ready(page);
      assert.equal(await page.locator(".entrance").isVisible(), false);
    }),
    check("Escape and keyboard skip", {}, async (page) => {
      await page.goto(baseURL);
      await page.locator('[data-intro="loading"]').waitFor();
      await page.keyboard.press("Escape");
      await ready(page);
      await page.reload();
      await page.locator('[data-intro="loading"]').waitFor();
      await page.locator(".entrance-skip").focus();
      await page.keyboard.press("Enter");
      await ready(page);
    }),
    check("direct scene link", {}, async (page) => {
      await page.goto(`${baseURL}/#insurance`);
      await ready(page);
      assert.equal(await active(page), "insurance");
    }),
    check(
      "no JavaScript content and navigation",
      { javaScriptEnabled: false },
      async (page) => {
        await page.goto(baseURL);
        assert.equal(await page.locator(".scene").count(), 6);
        assert.equal(await page.locator("h1").isVisible(), true);
        assert.equal(await page.locator(".entrance").isVisible(), false);
        await page.locator(".scene").first().locator(".text-link").click();
        await page.waitForURL("**/about/");
      },
    ),
  ]);
} finally {
  await writeFile(
    `${output}/results.json`,
    JSON.stringify(
      {
        baseURL,
        viewport: "1440x1000 desktop / 390x844 mobile, DPR1",
        backend: "Chrome",
        results,
      },
      null,
      2,
    ),
  );
  await browser.close();
}
