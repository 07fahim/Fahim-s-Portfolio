import { currentMode } from './mode';
import { css } from './css';

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// PORT P1189, P1193–1194, P1196, P1199–1205: one drifting blob (jade in dark, petrol in light). Geometry + colour
// both live here so a mode switch (tint()) rewrites the full entry, not just the colour.
const BLOBS = {
  jade: { c: 'rgba(29,205,159,.1)', w: 80, h: 60, l: 30, t: 20, r0: 0, r1: 0, x: '-10vw', y: '8vh', d: 40 },
  petrol: { c: 'rgba(95,149,152,.14)', w: 90, h: 60, l: 20, t: 10, r0: 0, r1: 0, x: '-12vw', y: '8vh', d: 44 },
} as const;

export function mountSilk(host: HTMLElement): () => void {
  const ac = new AbortController(), on = { signal: ac.signal };
  let raf = 0;

  // the prototype creates the blob even with no WebGL2, so it's created and tinted, and the modechange
  // listener for tinting is wired, before the WebGL early return.
  const blob = document.createElement('i');
  const tint = () => {
    const b = BLOBS[currentMode() === 'light' ? 'petrol' : 'jade'];
    Object.assign(blob.style, { width: b.w + 'vmax', height: b.h + 'vmax', left: b.l + 'vw', top: b.t + 'vh', background: `radial-gradient(closest-side, ${b.c}, transparent)` });
    Object.entries({ '--r0': b.r0 + 'deg', '--r1': b.r1 + 'deg', '--x': b.x, '--y': b.y, '--t': b.d + 's' }).forEach(([k, val]) => blob.style.setProperty(k, val));
  };
  host.prepend(blob);
  tint();
  addEventListener('modechange', tint, on);

  const cv = host.querySelector('canvas')!;
  // PORT P1002–1023: the gpuBackground setup and size(). Keep the Silk dpr rule (min(devicePixelRatio, 1.5) * .5).
  const gl = cv.getContext('webgl2', { antialias: true, premultipliedAlpha: true });
  if (!gl) return () => { ac.abort(); blob.remove(); };

  const program = (vs: string, fs: string) => {
    const p = gl.createProgram()!;
    for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
      const x = gl.createShader(type)!; gl.shaderSource(x, src); gl.compileShader(x);
      if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(x));
      gl.attachShader(p, x);
    }
    gl.linkProgram(p); return p;
  };
  const uni = (p: WebGLProgram, names: string[]) => Object.fromEntries(names.map(k => [k, gl.getUniformLocation(p, k)]));
  const vao = (p: WebGLProgram, name: string, data: Float32Array, n: number) => {
    const v = gl.createVertexArray()!; gl.bindVertexArray(v);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const l = gl.getAttribLocation(p, name); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, n, gl.FLOAT, false, 0, 0);
    return v;
  };

  let w = 0, h = 0, dpr = 1;
  const size = () => { dpr = Math.min(devicePixelRatio, 1.5) * .5; w = innerWidth; h = innerHeight; cv.width = w * dpr; cv.height = h * dpr; gl.viewport(0, 0, cv.width, cv.height); };

  // PORT P1026–1028, P1120–1145: blend mode, the Silk shaders, VAO and uniforms.
  gl.enable(gl.BLEND); gl.clearColor(0, 0, 0, 0);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const p = program(`#version 300 es
in vec2 a; void main() { gl_Position = vec4(a, 0, 1); }`, `#version 300 es
precision highp float;
uniform vec2 res; uniform float t, light; uniform vec3 acc, str; out vec4 o;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p) { float v = 0., a = .5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= .5; } return v; }
void main() {
  vec2 p = gl_FragCoord.xy / res.y * 2.; float T = t * .03;
  vec2 q = vec2(fbm(p + T), fbm(p + vec2(5.2, 1.3) - T));
  float f = fbm(p + 2.2 * q + vec2(T * .6, -T * .4));
  float ridge = pow(.5 + .5 * sin(f * 16. + T * 4.), 10.);
  float body = .5 + .5 * sin(f * 16. + T * 4. - .9);
  vec3 c = light > .5 ? mix(str, acc, .45) : mix(vec3(.86, .9, .92), acc, .4);
  float al = light > .5 ? body * .03 + ridge * .06 : body * .045 + ridge * .1;
  o = vec4(c * al, al);
}`);
  const vaoHandle = vao(p, 'a', new Float32Array([-1, -1, 3, -1, -1, 3]), 2), U = uni(p, ['res', 't', 'light', 'acc', 'str']);

  let acc: number[] = [], str: number[] = [];
  const colours = () => { acc = css('--net').split(',').map(v => +v / 255); str = css('--strand').split(',').map(v => +v / 255); };

  const frame = (t: number) => {
    gl.useProgram(p); gl.bindVertexArray(vaoHandle);
    gl.uniform2f(U.res, cv.width, cv.height); gl.uniform1f(U.t, t); gl.uniform1f(U.light, currentMode() === 'light' ? 1 : 0);
    gl.uniform3fv(U.acc, acc); gl.uniform3fv(U.str, str);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  // PORT P1170–1172: tick().
  // 30 fps (user, 2026-10-17): the folds drift slowly, so every other frame looks the same and halves the GPU work,
  // including the glass cards re-blurring the canvas behind them. A skipped frame keeps the last drawn image.
  let last = -1e9;
  const tick = (now: number) => {
    if (!reduce()) { raf = requestAnimationFrame(tick); if (now - last < 30) return; }
    last = now; gl.clear(gl.COLOR_BUFFER_BIT); frame(now / 1000);
  };
  colours();
  size();
  raf = requestAnimationFrame(tick);
  addEventListener('resize', () => { size(); if (reduce()) raf = requestAnimationFrame(tick); }, on);
  addEventListener('modechange', () => { colours(); if (reduce()) raf = requestAnimationFrame(tick); }, on);
  return () => { ac.abort(); cancelAnimationFrame(raf); blob.remove(); gl.getExtension('WEBGL_lose_context')?.loseContext(); };
}
