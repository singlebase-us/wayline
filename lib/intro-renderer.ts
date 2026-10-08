// Source-informed opening geometry. See docs/entrance-animation.md for provenance
// and the intentional adaptation from the reference's persistent Three scene.
const vertexSource = `
precision mediump float;
attribute vec2 aUv;
attribute vec2 aEnd;
uniform vec2 uViewport;
uniform float uIndex;
uniform float uCount;
uniform float uProgress;
uniform float uUnfold;
uniform float uHandoff;
varying vec2 vUv;
void main() {
  vUv = aUv;
  float f = 1.0 / tan(radians(7.5));
  float height = 2.0 * 5.8 / f;
  float width = height * uViewport.x / uViewport.y;
  float cardWidth = width * .46;
  float cardHeight = cardWidth * 844.0 / 1366.0;
  float step = cardHeight * 1.15;
  float queue = (step * uCount - cardHeight * .15 + height)
    * (1.0 - clamp((uProgress - .2) / .8, 0.0, 1.0));
  float bend = .021 * uUnfold;
  vec3 p = vec3((aUv.x - .5) * cardWidth, (aUv.y - .5) * cardHeight, 0.0);
  p.y -= bend * (1.0 - sin(aUv.x * 3.14159265359));
  p.x += bend * (aUv.y * 2.0 - 1.0) * (aUv.x * 2.0 - 1.0) * .5;
  p.y += queue - step * uIndex;
  float rx = mix(-.9, -.41, uUnfold);
  float ry = -.87 * uUnfold;
  float rz = .06 * uUnfold;
  p.yz = mat2(cos(rx), sin(rx), -sin(rx), cos(rx)) * p.yz;
  p.xz = mat2(cos(ry), -sin(ry), sin(ry), cos(ry)) * p.xz;
  p.xy = mat2(cos(rz), sin(rz), -sin(rz), cos(rz)) * p.xy;
  p += vec3(mix(.6, width * .16, uUnfold), 0.0, mix(-.5, .3, uUnfold));
  vec2 projected = vec2(f * p.x / (uViewport.x / uViewport.y), f * p.y) / (5.8 - p.z);
  gl_Position = vec4(mix(projected, aEnd, uHandoff), 0.0, 1.0);
}`;

const fragmentSource = `
precision mediump float;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uProgress;
uniform float uUnfold;
uniform float uHandoff;
uniform float uOpacity;
uniform vec3 uBaseColor;
varying vec2 vUv;
void main() {
  // Source screen-space reveal: every card shares the same rising mask.
  float reveal = smoothstep(uProgress - .32, uProgress + .05, gl_FragCoord.y / uResolution.y);
  float scale = mix(.85, 1.0, uProgress);
  vec2 uv = (vUv - .5) * scale + .5;
  vec4 photo = texture2D(uTexture, uv);
  vec3 color = mix(photo.rgb, uBaseColor, reveal * (1.0 - uUnfold));
  float alpha = mix(1.0, uOpacity, uHandoff);
  gl_FragColor = vec4(color, alpha);
}`;

export type IntroRenderer = {
  render: (progress: number, unfold: number, handoff: number) => void;
  dispose: () => void;
};

export function createIntroRenderer(
  canvas: HTMLCanvasElement,
  cards: HTMLElement[],
  images: HTMLImageElement[],
): IntroRenderer | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    depth: false,
  });
  if (!gl) return null;
  const shaders: WebGLShader[] = [];
  const buffers: WebGLBuffer[] = [];
  const textures: WebGLTexture[] = [];
  let program: WebGLProgram | null = null;
  const dispose = () => {
    buffers.forEach((buffer) => gl.deleteBuffer(buffer));
    textures.forEach((texture) => gl.deleteTexture(texture));
    shaders.forEach((shader) => gl.deleteShader(shader));
    if (program) gl.deleteProgram(program);
  };
  try {
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Unable to allocate an entrance shader");
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(
          gl.getShaderInfoLog(shader) || "Entrance shader compilation failed",
        );
      return shader;
    };
    program = gl.createProgram();
    if (!program) throw new Error("Unable to allocate the entrance program");
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(
        gl.getProgramInfoLog(program) || "Entrance shader link failed",
      );
    gl.useProgram(program);
    const width = innerWidth,
      height = innerHeight;
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const names = [
      "uViewport",
      "uResolution",
      "uIndex",
      "uCount",
      "uProgress",
      "uUnfold",
      "uHandoff",
      "uTexture",
      "uOpacity",
      "uBaseColor",
    ] as const;
    const uniforms = Object.fromEntries(
      names.map((name) => [name, gl.getUniformLocation(program!, name)]),
    );
    gl.uniform2f(uniforms.uViewport, width, height);
    gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.uCount, cards.length);
    gl.uniform1i(uniforms.uTexture, 0);
    // Source loaderUIColor: interpolate the #0d0d0d loader 10% toward white.
    gl.uniform3f(uniforms.uBaseColor, 0.146, 0.146, 0.146);
    const uvLocation = gl.getAttribLocation(program, "aUv");
    const endLocation = gl.getAttribLocation(program, "aEnd");
    // Match the live CSS card's perspective at the end, so no detached canvas
    // remains over the interactive, server-rendered content.
    const entries = cards.map((card, index) => {
      const style = getComputedStyle(card);
      const matrix = new DOMMatrix(style.transform);
      const w = card.offsetWidth,
        h = card.offsetHeight;
      const cx = card.offsetLeft + w / 2,
        cy = card.offsetTop + h / 2;
      const vertices: number[] = [];
      const point = (x: number, y: number) => {
        // The reference bends geometry; the existing DOM frame clips its edges.
        // Interpolate that boundary only during the final handoff.
        const top = [0.05, 0.023, 0.007, 0, 0.003, 0.013];
        const bottom = [0, 0.015, 0.024, 0.026, 0.017, 0];
        const section = Math.min(4, Math.floor(x * 5));
        const t = x * 5 - section;
        const upper = top[section] * (1 - t) + top[section + 1] * t;
        const lower = bottom[section] * (1 - t) + bottom[section + 1] * t;
        const clippedY = lower + y * (1 - upper - lower);
        const p = matrix.transformPoint(
          new DOMPoint((x - 0.5) * w, (0.5 - clippedY) * h),
        );
        vertices.push(
          x,
          y,
          ((cx + p.x / p.w) / width) * 2 - 1,
          1 - ((cy + p.y / p.w) / height) * 2,
        );
      };
      for (let x = 0; x < 50; x++)
        for (let y = 0; y < 2; y++) {
          point(x / 50, y / 2);
          point((x + 1) / 50, y / 2);
          point(x / 50, (y + 1) / 2);
          point(x / 50, (y + 1) / 2);
          point((x + 1) / 50, y / 2);
          point((x + 1) / 50, (y + 1) / 2);
        }
      const buffer = gl.createBuffer();
      const texture = gl.createTexture();
      if (!buffer || !texture)
        throw new Error("Unable to allocate entrance resources");
      buffers.push(buffer);
      textures.push(texture);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW,
      );
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        images[index],
      );
      return {
        buffer,
        texture,
        count: vertices.length / 4,
        opacity: index === 0 ? 1 : 0.28,
      };
    });
    return {
      render(progress, unfold, handoff) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uniforms.uProgress, progress);
        gl.uniform1f(uniforms.uUnfold, unfold);
        gl.uniform1f(uniforms.uHandoff, handoff);
        entries.forEach((entry, index) => {
          gl.bindBuffer(gl.ARRAY_BUFFER, entry.buffer);
          gl.enableVertexAttribArray(uvLocation);
          gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 16, 0);
          gl.enableVertexAttribArray(endLocation);
          gl.vertexAttribPointer(endLocation, 2, gl.FLOAT, false, 16, 8);
          gl.bindTexture(gl.TEXTURE_2D, entry.texture);
          gl.uniform1f(uniforms.uIndex, index);
          gl.uniform1f(uniforms.uOpacity, entry.opacity);
          gl.drawArrays(gl.TRIANGLES, 0, entry.count);
        });
      },
      dispose,
    };
  } catch (error) {
    dispose();
    console.warn(
      "Entrance animation unavailable; continuing to the page.",
      error,
    );
    return null;
  }
}
