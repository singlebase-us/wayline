# WAYLINE

Next.js App Router landing page for WAYLINE operational workflow systems. Content is adapted from the supplied _Operational Workflow Systems_ PDF; the visual reference is https://robin-noguier.com/.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run typecheck
npm run build
```

The build produces static, pre-rendered HTML in `out/`. No backend or third-party service is required. `next.config.ts` can be adjusted for a Node.js hosting environment if server features are added later.

## Content and behavior

- `lib/content.ts`: scene copy, workflow descriptions, contact email, and delivery capabilities.
- `components/experience.tsx`: wheel, drag, keyboard, scene navigation, and motion.
- `app/globals.css`: typography, layout, color, transitions, responsive and reduced-motion rules.
- `app/about/`, `app/contact/`, `app/workflows/[slug]/`: fully pre-rendered information pages.
- Home content remains readable when JavaScript is disabled.
- Contact links open a pre-addressed email. No request is sent to a server by the website.

## SEO and publishing

Metadata, canonical links, sitemap, robots, semantic headings, and organization/service structured data are included. `NEXT_PUBLIC_SITE_URL` can override the default origin when connecting a public domain; rebuild after changing it. A private preview is intended for review; search engines require a publicly accessible production site to index these pages.

## Assets

The workflow diagrams are interface illustrations created for this site. Photography:

- Warehouse: Jacques Dillies, https://unsplash.com/photos/warehouse-shelving-with-cardboard-boxes-jcav1COVvOc — Unsplash License.
- Property: Ricardo Gomez Angel, https://unsplash.com/photos/geometric-architecture-featuring-many-windows-and-sunlight-YYuCxwu93l8 — Unsplash License.

Fonts: DM Sans and Playfair Display, locally served; Google Fonts / SIL Open Font License.

The reference site's personal name, client testimonials, project images, and proprietary source have not been included. The gallery is independently implemented using CSS perspective and GSAP, with WAYLINE-specific workflow visuals.
