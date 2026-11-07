"use client";

import { useEffect, useRef } from "react";

/**
 * Pixel-art scene: the WAYLINE server feeds power underground into the
 * foundations of different industries, which grow and then hold steady.
 * Rendered at 160×120 and scaled up with crisp pixels; ~10 fps, slow motion.
 */
const W = 160;
const H = 120;
const GROUND = 84;
const BUS = 97;
const PORT_X = 34;

const hex = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  // ImageData is little-endian RGBA → 0xAABBGGRR
  return (
    (255 << 24) | ((n & 0xff) << 16) | (((n >> 8) & 0xff) << 8) | (n >> 16)
  ) >>> 0;
};
const C = {
  sky0: hex("#110a1c"),
  sky1: hex("#170f27"),
  sky2: hex("#1f1535"),
  sky3: hex("#281b44"),
  star: hex("#6d5aa0"),
  starHi: hex("#b9a3f0"),
  ground: hex("#4a3878"),
  soil: hex("#150d22"),
  speck: hex("#22173a"),
  cable: hex("#3a2b62"),
  flow: hex("#6b52b0"),
  pulse: hex("#f3e9ff"),
  trail1: hex("#c4a6ff"),
  trail2: hex("#8a6ad8"),
  srvBody: hex("#33255a"),
  srvEdge: hex("#6a52a8"),
  srvUnit: hex("#20163a"),
  srvVent: hex("#3d2d68"),
  ledOn: hex("#d9c4ff"),
  ledAlt: hex("#9be7d2"),
  ledOff: hex("#45346f"),
  halo: hex("#21173b"),
  text: hex("#cdb6ff"),
  b1: hex("#2e2250"),
  b2: hex("#382a62"),
  b3: hex("#2a1f49"),
  bEdge: hex("#4b3a80"),
  bShade: hex("#22183c"),
  winOff: hex("#1d1533"),
  winOn: hex("#c9b2ff"),
  winWarm: hex("#f0c9ff"),
  found: hex("#2b1f47"),
  foundHi: hex("#a688f0"),
  accent: hex("#ff9fd8"),
  smoke: hex("#4e3d7d"),
  smoke2: hex("#3a2d5f"),
};

const GLYPHS: Record<string, string[]> = {
  W: ["10001", "10001", "10101", "10101", "01010"],
  A: ["0110", "1001", "1111", "1001", "1001"],
  Y: ["10001", "01010", "00100", "00100", "00100"],
  L: ["100", "100", "100", "100", "111"],
  I: ["111", "010", "010", "010", "111"],
  N: ["1001", "1101", "1011", "1001", "1001"],
  E: ["111", "100", "110", "100", "111"],
};

type Kind = "factory" | "health" | "tower" | "shop" | "lab" | "farm";
type Building = {
  kind: Kind;
  x: number;
  w: number;
  min: number;
  max: number;
  body: number;
  growth: number;
  charge: number;
};

const hash = (a: number, b: number, c = 0) => {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export function PixelPower({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const img = ctx.createImageData(W, H);
    const px = new Uint32Array(img.data.buffer);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const set = (x: number, y: number, c: number) => {
      x |= 0;
      y |= 0;
      if (x >= 0 && y >= 0 && x < W && y < H) px[y * W + x] = c;
    };
    const rect = (x: number, y: number, w: number, h: number, c: number) => {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c);
    };
    const text = (s: string, x: number, y: number, c: number) => {
      for (const ch of s) {
        const g = GLYPHS[ch];
        g.forEach((row, j) =>
          [...row].forEach((bit, i) => bit === "1" && set(x + i, y + j, c)),
        );
        x += g[0].length + 1;
      }
    };

    const buildings: Building[] = [
      { kind: "factory", x: 46, w: 20, min: 12, max: 22, body: C.b2, growth: 0, charge: 0 },
      { kind: "health", x: 70, w: 15, min: 16, max: 30, body: C.b1, growth: 0, charge: 0 },
      { kind: "tower", x: 89, w: 13, min: 24, max: 48, body: C.b3, growth: 0, charge: 0 },
      { kind: "shop", x: 106, w: 17, min: 10, max: 18, body: C.b2, growth: 0, charge: 0 },
      { kind: "lab", x: 127, w: 15, min: 14, max: 28, body: C.b1, growth: 0, charge: 0 },
      { kind: "farm", x: 146, w: 11, min: 6, max: 16, body: C.b3, growth: 0, charge: 0 },
    ];
    buildings.forEach((b, i) => (b.growth = reduced ? 1 : 0.25 + 0.1 * (i % 3)));

    const stars = Array.from({ length: 34 }, (_, i) => ({
      x: hash(i, 1) * W,
      y: hash(i, 2) * (GROUND - 30),
      v: 0.03 + hash(i, 3) * 0.06,
      hi: hash(i, 4) > 0.8,
    }));
    const smoke: { x: number; y: number; life: number }[] = [];
    let pulses: { b: number; d: number }[] = [];
    let frame = 0;
    let nextTarget = 0;

    const riser = (b: Building) => b.x + (b.w >> 1);
    const pathLen = (b: Building) => riser(b) - PORT_X + (BUS - (GROUND + 3));
    const pathAt = (b: Building, d: number): [number, number] => {
      const horiz = riser(b) - PORT_X;
      return d < horiz ? [PORT_X + d, BUS] : [riser(b), BUS - (d - horiz)];
    };

    // The sky is transparent so the scene sits directly on the page;
    // only a dithered purple glow rises from the horizon.
    const drawSky = () => {
      px.fill(0, 0, GROUND * W);
      const glowTop = GROUND - 34;
      for (let y = glowTop; y < GROUND; y++) {
        const t = (y - glowTop) / (GROUND - glowTop); // 0 → 1 toward horizon
        for (let x = 0; x < W; x++) {
          const edge = Math.min(x, W - 1 - x) / 30; // fade at the sides too
          const density = t * t * Math.min(1, edge);
          if (hash(x, y, 3) < density)
            px[y * W + x] = t > 0.75 ? C.sky3 : t > 0.45 ? C.sky2 : C.sky1;
        }
      }
      for (const s of stars) set(s.x, s.y, s.hi && (frame + (s.x | 0)) % 30 < 20 ? C.starHi : C.star);
    };

    const drawGround = () => {
      // Ground and soil dissolve into the page: dithered at the sides and
      // below the power bus.
      px.fill(0, GROUND * W);
      for (let y = GROUND; y < H; y++)
        for (let x = 0; x < W; x++) {
          const side = Math.min(1, Math.min(x, W - 1 - x) / 22);
          const depth = y <= BUS + 3 ? 1 : 1 - (y - BUS - 3) / (H - BUS - 3);
          if (hash(x, y, 5) > side * depth) continue;
          set(x, y, y === GROUND ? C.ground : hash(x, y, 7) > 0.94 ? C.speck : C.soil);
        }
      // power bus and risers, with a slow travelling shimmer
      rect(PORT_X, BUS, buildings.length ? riser(buildings[buildings.length - 1]) - PORT_X + 1 : 0, 1, C.cable);
      for (const b of buildings) rect(riser(b), GROUND + 3, 1, BUS - GROUND - 3, C.cable);
      for (let x = PORT_X; x <= riser(buildings[buildings.length - 1]); x++)
        if ((x - Math.floor(frame / 2)) % 7 === 0) set(x, BUS, C.flow);
    };

    const drawServer = () => {
      const x = 8, top = 42, w = 25;
      // soft dithered halo
      const r = 4 + (Math.sin(frame / 14) > 0 ? 1 : 0);
      for (let y = top - r; y < GROUND; y++)
        for (let i = x - r; i < x + w + r; i++)
          if ((i + y) % 2 === 0 && (i < x || i >= x + w || y < top)) set(i, y, C.halo);
      rect(x, top, w, GROUND - top, C.srvBody);
      rect(x, top, w, 1, C.srvEdge);
      rect(x, top, 1, GROUND - top, C.srvEdge);
      rect(x + w - 1, top, 1, GROUND - top, C.bShade);
      // power core bar on top
      const core = Math.floor(((Math.sin(frame / 9) + 1) / 2) * (w - 6));
      rect(x + 3, top + 2, w - 6, 1, C.srvUnit);
      rect(x + 3, top + 2, core + 2, 1, C.trail1);
      for (let u = 0; u < 6; u++) {
        const uy = top + 5 + u * 6;
        rect(x + 2, uy, w - 4, 4, C.srvUnit);
        for (let l = 0; l < 3; l++) {
          const on = hash(u, l, Math.floor(frame / (4 + l * 3))) > 0.45;
          set(x + 4 + l * 2, uy + 1, on ? (l === 2 ? C.ledAlt : C.ledOn) : C.ledOff);
        }
        for (let v = x + 12; v < x + w - 4; v += 2) {
          set(v, uy + 1, C.srvVent);
          set(v, uy + 2, C.srvVent);
        }
      }
      // feed cable down into the ground
      rect(x + w + 1, GROUND - 6, 1, BUS - GROUND + 6, C.cable);
      rect(x + w - 1, GROUND - 6, 2, 1, C.cable);
      text("WAYLINE", x + Math.floor(w / 2) - 16, top - 9, C.text);
    };

    const drawBuilding = (b: Building, i: number) => {
      const h = Math.round(b.min + (b.max - b.min) * b.growth);
      const top = GROUND - h;
      // foundation (underground), glows when charged
      const fc = b.charge > 0.5 ? C.foundHi : b.charge > 0.15 ? C.trail2 : C.found;
      rect(b.x - 1, GROUND + 1, b.w + 2, 2, fc);
      if (b.charge > 0.15) rect(riser(b), GROUND + 3, 1, BUS - GROUND - 3, C.trail2);
      // body
      rect(b.x, top, b.w, h, b.body);
      rect(b.x, top, 1, h, C.bEdge);
      rect(b.x + b.w - 1, top, 1, h, C.bShade);
      // windows
      const lit = 0.3 + 0.55 * b.charge + 0.15 * b.growth;
      for (let wy = top + 3, r = 0; wy < GROUND - 3; wy += 4, r++)
        for (let wx = b.x + 2, c = 0; wx < b.x + b.w - 3; wx += 3, c++) {
          const on = hash(i * 31 + r, c, Math.floor(frame / 45)) < lit;
          const col = on ? (hash(i, r, c) > 0.8 ? C.winWarm : C.winOn) : C.winOff;
          rect(wx, wy, 2, 2, col);
        }
      // industry details
      switch (b.kind) {
        case "factory": {
          for (let t = 0; t < b.w; t += 5)
            for (let k = 0; k < 4; k++) rect(b.x + t + k, top - k - 1, 1, k + 1, b.body);
          const cx = b.x + b.w - 4;
          rect(cx, top - 9, 3, 9, C.b3);
          rect(cx, top - 9, 3, 1, C.bEdge);
          if (!reduced && frame % 6 === 0) smoke.push({ x: cx + 1, y: top - 10, life: 0 });
          break;
        }
        case "health":
          rect(b.x + (b.w >> 1) - 2, top - 6, 5, 1, C.accent);
          rect(b.x + (b.w >> 1), top - 8, 1, 5, C.accent);
          break;
        case "tower": {
          rect(b.x + (b.w >> 1), top - 7, 1, 7, C.bEdge);
          if (frame % 20 < 4) set(b.x + (b.w >> 1), top - 8, C.accent);
          rect(b.x + 2, top - 2, b.w - 4, 2, b.body);
          break;
        }
        case "shop":
          // striped awning over the storefront
          for (let s = 0; s < b.w + 2; s++)
            rect(b.x - 1 + s, top - 3, 1, 3, (s >> 1) % 2 ? C.trail2 : C.b1);
          rect(b.x - 1, top - 4, b.w + 2, 1, C.bEdge);
          break;
        case "lab": {
          const r = (b.w >> 1) - 1;
          for (let y = 0; y <= r; y++) {
            const span = Math.round(Math.sqrt(r * r - y * y));
            rect(b.x + (b.w >> 1) - span, top - y, span * 2 + 1, 1, y === r ? C.bEdge : C.b2);
          }
          set(b.x + (b.w >> 1), top - r - 1, frame % 16 < 8 ? C.ledAlt : C.ledOff);
          break;
        }
        case "farm": {
          // a tree that grows with the plot
          const trunk = Math.max(3, Math.round(h * 0.45));
          rect(b.x + (b.w >> 1), top - trunk, 1, trunk, C.bEdge);
          const cr = 2 + Math.round(b.growth * 3);
          for (let y = -cr; y <= cr; y++)
            for (let x = -cr; x <= cr; x++)
              if (x * x + y * y <= cr * cr && hash(x, y, i) > 0.15)
                set(b.x + (b.w >> 1) + x, top - trunk - cr + y, (x + y) & 1 ? C.ledAlt : C.flow);
          break;
        }
      }
    };

    const drawPulses = () => {
      for (const p of pulses) {
        const b = buildings[p.b];
        for (let t = 3; t >= 0; t--) {
          const [x, y] = pathAt(b, Math.max(0, p.d - t * 1.5));
          set(x, y, t === 0 ? C.pulse : t === 1 ? C.trail1 : C.trail2);
        }
      }
    };

    const drawSmoke = () => {
      for (const s of smoke) set(s.x, s.y, s.life < 20 ? C.smoke : C.smoke2);
    };

    const step = () => {
      frame++;
      for (const s of stars) {
        s.x += s.v;
        if (s.x > W) s.x = 0;
      }
      for (const s of smoke) {
        s.life++;
        s.y -= 0.35;
        s.x -= hash(s.life, s.x | 0) > 0.6 ? 0.4 : 0.1;
      }
      while (smoke.length && smoke[0].life > 34) smoke.shift();
      if (frame % 13 === 0) {
        pulses.push({ b: nextTarget, d: 0 });
        nextTarget = (nextTarget + 1 + (hash(frame, 9) > 0.7 ? 1 : 0)) % buildings.length;
      }
      pulses = pulses.filter((p) => {
        p.d += 1.4;
        const b = buildings[p.b];
        if (p.d >= pathLen(b)) {
          b.charge = 1;
          b.growth = Math.min(1, b.growth + 0.08);
          return false;
        }
        return true;
      });
      for (const b of buildings) b.charge = Math.max(0, b.charge - 0.045);
    };

    const draw = () => {
      drawSky();
      drawGround();
      drawServer();
      buildings.forEach(drawBuilding);
      drawSmoke();
      drawPulses();
      ctx.putImageData(img, 0, 0);
    };

    if (reduced) {
      draw();
      return;
    }

    let raf = 0;
    let last = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 100) return;
      last = now;
      step();
      draw();
    };
    draw();
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      className={className}
      role="img"
      aria-label="Pixel illustration: the WAYLINE server powering the foundations of different industries"
    />
  );
}
