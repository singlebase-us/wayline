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
  await page.addStyleTag({
    content:
      ".entrance{display:none!important}.experience .visual-link{position:fixed!important;top:0!important;left:0!important;transform:none!important;opacity:1!important;transition:none!important;visibility:visible!important;z-index:100!important}.visual-frame{clip-path:none!important;transform:none!important}",
  });
  const output = fileURLToPath(new URL("../public/intro/", import.meta.url));
  await mkdir(output, { recursive: true });
  for (let i = 0; i < 6; i++) {
    await page.evaluate(
      (i) =>
        document
          .querySelectorAll(".visual-link")
          .forEach((e, j) =>
            e.style.setProperty(
              "display",
              i === j ? "block" : "none",
              "important",
            ),
          ),
      i,
    );
    await page
      .locator(".visual-link")
      .nth(i)
      .screenshot({
        path: `${output}desktop-${i}.jpg`,
        type: "jpeg",
        quality: 92,
      });
  }
} finally {
  await browser.close();
}
