import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
const routes = [
  "",
  "about",
  "contact",
  "workflows/insurance",
  "workflows/distribution",
  "workflows/property",
  "workflows/freight",
];
for (const route of routes) {
  const path = `out/${route ? route + "/" : ""}index.html`;
  const html = readFileSync(path, "utf8");
  assert.equal(
    (html.match(/<h1\b/g) ?? []).length,
    1,
    `${route}: one semantic H1`,
  );
  assert.match(html, /<meta name="description" content="[^"]+/);
  assert.match(html, /<link rel="canonical" href="https:\/\/[^\"]+/);
  assert.match(html, /WAYLINE/);
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    if (href.startsWith("/_next/")) continue;
    const assetPath = href.endsWith("/")
      ? `out${href}index.html`
      : `out${href}`;
    assert(existsSync(assetPath), `${route}: missing local link ${href}`);
  }
}
assert.match(readFileSync("out/index.html", "utf8"), /operational last mile/);
assert.match(readFileSync("out/sitemap.xml", "utf8"), /workflows\/freight/);
assert.match(readFileSync("out/robots.txt", "utf8"), /Sitemap:/);
console.log(
  "Verified: 7 HTML routes, H1s, descriptions, canonical URLs, internal links, sitemap, robots, and pre-rendered copy.",
);
