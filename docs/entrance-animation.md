# Entrance animation

The original implementation was a 1.5-second CSS title and curtain. The new opening follows the reference's DOM loader plus WebGL card queue, then hands control to the existing server-rendered gallery.

Reference: https://robin-noguier.com/. Inspected using the [Web Shader Extractor skill](https://github.com/lixiaolin94/skills/tree/main/web-shader-extractor), linked by the user. Its workflow was source attribution → shader/timeline capture → independent baseline → Next.js integration → browser verification.

## Confirmed reference behavior

- Outlined name fills from bottom to top. Name, subtitle, and bottom note enter with an 80ms initial delay and 200ms stagger; a left progress bar follows the same loading progress.
- Desktop WebGL planes use a 15° camera at z=5.8, width 46% of world viewport width, a 1366:844 aspect ratio, and a 15% vertical gap. The queue offset falls with normalized progress from 0.2 to 1.
- Loading pose: X rotation −0.9, X position 0.6, Z position −0.5. Rest pose: rotations (−0.41, −0.87, 0.06), Z position 0.3, bend 0.021.
- The fragment shader reveals textures using a screen-space `smoothstep(progress - .32, progress + .05, screenY)` mask. Placeholder color is the dark loader background interpolated 10% toward white.
- Loading uses a sine-out curve and 2225ms desktop / 750ms mobile durations. Exit uses 370ms ease-out; card unfolding uses 820ms and cubic-bezier(.4, 0, .3, 1).
- The reference explicitly mounts its WebGL scene only on desktop. Mobile retains the DOM loader and curtain.

## Deliberate adaptations and limits

This is a source-informed behavior reconstruction, **not a pixel-exact replay**. WAYLINE's type, six cards, copy, and final responsive layout replace the reference's identity and projects. A small native WebGL renderer replaces its Three.js / React Spring scene. Resource readiness is bounded so decorative assets cannot block the page. Texture scaling is simplified; the final 600ms morph / 200ms crossfade hands off to the existing CSS gallery, whereas the reference keeps its gallery in WebGL. Perpetual reference scrolling and pointer lighting are outside this entrance correction.

The card snapshots contain WAYLINE content only. After editing `components/visual.tsx` or its desktop CSS, run `npm run capture:intro` with the local dev server running. Chrome is used by default; set `BROWSER_CHANNEL` for another installed Playwright channel.

## Lifecycle and accessibility

The loader is progressive enhancement: HTML headings, copy and links remain in the static export. Intro is skipped for reduced motion, short viewports, and noninitial scene hashes. Escape or the keyboard-accessible skip button exits it. Slow or failed textures, unavailable WebGL, context loss, resize, and leaving the tab also complete immediately. Gallery input is locked only while the overlay is active; buffers, textures, shaders, frame callbacks and listeners are cleaned up.

Run `npm run typecheck`, `npm run build`, `node scripts/check-export.mjs`, then `npm run check:intro -- http://localhost:3000` for browser verification. The browser check covers rendered frames, navigation, mobile, reduced motion, unavailable WebGL, context loss, slow assets, resize and no JavaScript.
