"use client";

/*
 * Decayed card edge.
 * Adapted from React Bits Decay Card (https://reactbits.dev/components/decay-card),
 * MIT License © David Haz. Instead of distorting an image, this draws the card's own
 * surface (fill + border) with turbulence-eroded edges behind the parent's content.
 *
 * Drop it in as the first child of a `position: relative` element; the parent's own
 * background and border should be removed so this layer replaces them.
 */

import { useEffect, useRef } from "react";

/** How far (CSS px) the canvas extends past the card so displaced edges aren't clipped. */
const BLEED = 48;

const VERTEX = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = vec2(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uCanvas;   // canvas size, CSS px
uniform vec2 uCard;     // card size, CSS px
uniform float uBleed;
uniform float uPixel;   // 1 CSS px in device px (for AA)
uniform float uScale;   // pointer-driven displacement, px
uniform float uIdle;    // ambient displacement, px
uniform float uRim;     // width of the band that decays, px
uniform float uFrequency;
uniform float uSeed;
uniform float uTime;
uniform vec4 uFill;     // straight alpha
uniform vec4 uStroke;   // straight alpha
uniform float uStrokeWidth;
in vec2 vUv;
out vec4 fragColor;

vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n = 1.0 / 7.0;
  vec3 ns = n * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float turbulence(vec2 p, float z) {
  float sum = 0.0;
  float amp = 1.0;
  for (int i = 0; i < 5; i++) {
    sum += abs(snoise(vec3(p, z))) * amp;
    p = p * 2.0 + 19.19;
    amp *= 0.5;
  }
  return clamp(sum * 0.45 + 0.231, 0.0, 1.0);
}

float box(vec2 p, vec2 extent) {
  vec2 q = abs(p) - extent;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
}

void main() {
  // Position in card space (0,0 = card's top-left corner), CSS px.
  vec2 view = vUv * uCanvas - uBleed;
  float inside = min(min(view.x, uCard.x - view.x), min(view.y, uCard.y - view.y));
  float rim = 1.0 - smoothstep(0.0, uRim, inside);

  float drift = snoise(vec3(view * 0.004 + uSeed * 0.37, uTime * 0.12)) * 0.5 + 0.5;
  float idle = uIdle * rim * (0.25 + 0.75 * smoothstep(0.3, 0.8, drift));
  float scale = uScale * mix(0.2, 1.0, rim) + idle;

  vec2 offset = vec2(0.0);
  if (scale > 0.01) {
    vec2 p = view * uFrequency + vec2(uSeed * 17.31, uSeed * 9.17);
    float z = uTime * 0.25 + uSeed * 3.1;
    offset = scale * (vec2(turbulence(p, z), turbulence(p + vec2(31.7, 47.3), z + 5.3)) - 0.5);
  }

  vec2 source = view + offset;
  float d = box(source - uCard * 0.5, uCard * 0.5);
  float aa = 0.75 / uPixel;
  float fill = 1.0 - smoothstep(-aa, aa, d);
  float stroke = uStrokeWidth > 0.0
    ? 1.0 - smoothstep(uStrokeWidth * 0.5 - aa, uStrokeWidth * 0.5 + aa, abs(d + uStrokeWidth * 0.5))
    : 0.0;

  // "Over" composite of stroke on fill, premultiplied output.
  float fa = uFill.a * fill;
  float sa = uStroke.a * stroke;
  vec3 color = uStroke.rgb * sa + uFill.rgb * fa * (1.0 - sa);
  float alpha = sa + fa * (1.0 - sa);
  fragColor = vec4(color, alpha);
}`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

/** Parses #rgb, #rrggbb or #rrggbbaa into straight-alpha RGBA 0–1. */
function parseColor(hex: string | undefined): [number, number, number, number] {
  if (!hex) return [0, 0, 0, 0];
  let v = hex.replace("#", "");
  if (v.length === 3) v = v.replace(/./g, (c) => c + c);
  if (v.length === 6) v += "ff";
  const n = parseInt(v, 16) >>> 0;
  return [((n >>> 24) & 255) / 255, ((n >>> 16) & 255) / 255, ((n >>> 8) & 255) / 255, (n & 255) / 255];
}

export type DecayEdgeProps = {
  /** Surface color, hex (#rrggbb or #rrggbbaa). */
  fill?: string;
  /** Border color, hex (#rrggbb or #rrggbbaa). */
  stroke?: string;
  strokeWidth?: number;
  /** Max pointer-driven edge displacement, CSS px. */
  intensity?: number;
  /** Ambient edge displacement, CSS px. */
  idle?: number;
  /** Width of the band along the edge that decays, CSS px. */
  rim?: number;
  /** Noise frequency; higher = finer, grainier edge. */
  grain?: number;
  /** Baseline decay while the pointer is over the card (0–1). */
  hoverDecay?: number;
  /** Seconds to settle back after the pointer stops. */
  recovery?: number;
  /** Changes the noise pattern so sibling cards don't look identical. */
  pattern?: number;
};

export function DecayEdge({
  fill,
  stroke,
  strokeWidth = 1,
  intensity = 70,
  idle = 18,
  rim = 70,
  grain = 0.012,
  hoverDecay = 0.15,
  recovery = 0.6,
  pattern = 4,
}: DecayEdgeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef({ fill, stroke, strokeWidth, intensity, idle, rim, grain, hoverDecay, recovery, pattern });
  settingsRef.current = { fill, stroke, strokeWidth, intensity, idle, rim, grain, hoverDecay, recovery, pattern };

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = canvas?.parentElement;
    const gl = canvas?.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!canvas || !card || !gl) return;
    // WebGL is available: hand the surface over from the CSS fallback.
    card.dataset.decayEdge = "on";

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      delete card.dataset.decayEdge;
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.bindAttribLocation(program, 0, "position");
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      delete card.dataset.decayEdge;
      return;
    }
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uniforms = {
      canvas: u("uCanvas"),
      card: u("uCard"),
      bleed: u("uBleed"),
      pixel: u("uPixel"),
      scale: u("uScale"),
      idle: u("uIdle"),
      rim: u("uRim"),
      frequency: u("uFrequency"),
      seed: u("uSeed"),
      time: u("uTime"),
      fill: u("uFill"),
      stroke: u("uStroke"),
      strokeWidth: u("uStrokeWidth"),
    };

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const state = {
      level: 0,
      time: settingsRef.current.pattern * 7.3,
      cursorX: 0,
      cursorY: 0,
      lastX: 0,
      lastY: 0,
      hovered: false,
      visible: true,
      ratio: 1,
    };
    let raf = 0;
    let last = 0;
    let tick = 0;

    const draw = () => {
      const s = settingsRef.current;
      if (!canvas.width || !canvas.height) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(uniforms.canvas, canvas.clientWidth, canvas.clientHeight);
      gl.uniform2f(uniforms.card, card.clientWidth, card.clientHeight);
      gl.uniform1f(uniforms.bleed, BLEED);
      gl.uniform1f(uniforms.pixel, state.ratio);
      gl.uniform1f(uniforms.scale, state.level * s.intensity);
      gl.uniform1f(uniforms.idle, s.idle);
      gl.uniform1f(uniforms.rim, s.rim);
      gl.uniform1f(uniforms.frequency, s.grain);
      gl.uniform1f(uniforms.seed, s.pattern);
      gl.uniform1f(uniforms.time, state.time);
      gl.uniform4fv(uniforms.fill, parseColor(s.fill));
      gl.uniform4fv(uniforms.stroke, parseColor(s.stroke));
      gl.uniform1f(uniforms.strokeWidth, s.stroke ? s.strokeWidth : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!state.visible || document.hidden) return;
      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, Math.max(0.001, (now - last) / 1000)) : 1 / 60;
      last = now;
      state.time += dt;

      const speed = Math.hypot(state.cursorX - state.lastX, state.cursorY - state.lastY) / dt;
      state.lastX = state.cursorX;
      state.lastY = state.cursorY;

      let wanted = state.hovered ? clamp(speed / 1300, 0, 1) ** 2 : 0;
      if (state.hovered) wanted = Math.max(wanted, s.hoverDecay);
      const tau = wanted > state.level ? 0.08 : Math.max(0.05, s.recovery);
      state.level += (wanted - state.level) * (1 - Math.exp(-dt / tau));

      const settling = Math.abs(wanted - state.level) > 0.002 || speed > 1;
      // Ambient drift only needs ~30fps; pointer response gets every frame.
      tick = (tick + 1) % 2;
      if (settling || tick === 0) draw();
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (reduce) return draw();
      if (raf || !state.visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      state.ratio = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * state.ratio));
      const h = Math.max(1, Math.round(canvas.clientHeight * state.ratio));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      draw();
    };

    const onMove = (event: PointerEvent) => {
      state.cursorX = event.clientX;
      state.cursorY = event.clientY;
    };
    const onEnter = (event: PointerEvent) => {
      state.hovered = true;
      state.cursorX = state.lastX = event.clientX;
      state.cursorY = state.lastY = event.clientY;
    };
    const onLeave = () => {
      state.hovered = false;
    };
    const onVisibility = () => wake();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(card);
    const intersection = new IntersectionObserver((entries) => {
      state.visible = entries.some((entry) => entry.isIntersecting);
      if (state.visible) wake();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    intersection.observe(card);
    card.addEventListener("pointermove", onMove, { passive: true });
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    wake();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      delete card.dataset.decayEdge;
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="decay-edge"
      aria-hidden="true"
      style={{
        top: -BLEED,
        left: -BLEED,
        width: `calc(100% + ${BLEED * 2}px)`,
        height: `calc(100% + ${BLEED * 2}px)`,
      }}
    />
  );
}
