// Refresh the six decorative GPU textures after changing Visual or its desktop CSS.
// Run against a local server: npm run capture:intro -- http://localhost:3000
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || "chrome",
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  await page.goto(process.argv[2] || "http://localhost:3000");
  await page.locator('.experience[data-intro="complete"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  const output = fileURLToPath(new URL("../public/intro/", import.meta.url));
  await mkdir(output, { recursive: true });
  for (let i = 0; i < 6; i++) {
    // Isolate the card from gallery stacking, transforms, and inert scenes.
    await page.evaluate(async (i) => {
      document.querySelector("#texture-capture")?.remove();
      const frame = document.querySelectorAll(".visual-frame")[i].cloneNode(true);
      frame.id = "texture-capture";
      frame.style.cssText = "position:fixed;inset:0 auto auto 0;width:519px;height:440px;clip-path:none;transform:none;z-index:2147483647";
      document.body.append(frame);
      await Promise.all(Array.from(frame.querySelectorAll("img"), img => img.decode()));
    }, i);
    await page
      .locator("#texture-capture")
      .screenshot({
        path: `${output}desktop-${i}.jpg`,
        type: "jpeg",
        quality: 92,
      });
  }
} finally {
  await browser.close();
}
