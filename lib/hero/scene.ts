import { currentMode } from '../mode';

type Theme = { stops: string[]; tints: number[][]; speck: number[]; light?: boolean };
type Part = { tx: number; ty: number; v: number; a: number; tint: number; x: number; y: number; vx: number; vy: number; shine: number; delay: number; dx: number; dy: number; sx?: number; sy?: number; on?: number };

// PORT P735–977, wrapped so the page can mount and clean it up. Changes from the prototype are the brief's 1–8, plus the timers list and the unmount guards on promise callbacks that keep the opening in step with the mount lifecycle.
export function mountHero(): () => void {
const ac = new AbortController(), on = { signal: ac.signal };
let raf = 0;

/* ---------- hero: tiles gather into a particle portrait, then hand over to the real photo ---------- */
let GAP: number, TILE: number;   // tile pitch scales with screen height so every screen gets ~4-5k tiles and the same look
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const T_SPECK = 7.2, T_FLY = 7.8, FLY = 1.2, SETTLED = T_FLY + FLY + 0.5, T_UI = 8.7;
const HOLD = reduce ? 0 : 1;   // seconds the finished particle portrait holds before it dissolves into the photo
const FINAL = SETTLED + HOLD + 1.2;   // the photo is fully in
const img = document.querySelector<HTMLImageElement>('.ph img')!;   // the particles are sampled from the same photo they turn into
const canvas = document.querySelector<HTMLCanvasElement>('.hero canvas')!;
// WebGL2: every tile is one square point, all drawn in a single call
const gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: true });
const STRIDE = 7;   // x, y, size, r, g, b, a
let U: Record<string, WebGLUniformLocation | null>;
if (gl) {   // no WebGL2: no particles, the photo still fades in
const sh = (type: number, src: string) => { const x = gl.createShader(type)!; gl.shaderSource(x, src); gl.compileShader(x); return x; };
const prog = gl.createProgram()!;
gl.attachShader(prog, sh(gl.VERTEX_SHADER, `#version 300 es
in vec3 a; in vec4 c; uniform vec2 res; uniform float dpr; out vec4 vc;
void main() { vec2 q = (a.xy + a.z * .5) / res * 2. - 1.; gl_Position = vec4(q.x, -q.y, 0, 1); gl_PointSize = a.z * dpr; vc = c; }`));
gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, `#version 300 es
precision mediump float; in vec4 vc; uniform float alpha; out vec4 o;
void main() { float k = vc.a * alpha; o = vec4(vc.rgb * k, k); }`));
gl.linkProgram(prog); gl.useProgram(prog);
const vbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
for (const [name, n, off] of [['a', 3, 0], ['c', 4, 3]] as const) { const l = gl.getAttribLocation(prog, name); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, n, gl.FLOAT, false, STRIDE * 4, off * 4); }
U = Object.fromEntries(['res', 'dpr', 'alpha'].map(n => [n, gl.getUniformLocation(prog, n)]));
gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
}
let buf: Float32Array;
const mouse: { x: number; y: number; fine?: boolean } = { x: -1e4, y: -1e4 };
addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.fine = e.pointerType === 'mouse'; }, on);
document.addEventListener('pointerleave', () => { mouse.x = mouse.y = -1e4; }, on);
for (const ev of ['pointerup', 'pointercancel'] as const) addEventListener(ev, e => { if (e.pointerType !== 'mouse') mouse.x = mouse.y = -1e4; }, on);   // a lifted finger leaves no hole in the portrait

// cool silver grade, measured from the reference frames, dark to light
const THEMES: Record<'jade' | 'petrol-light', Theme> = {   // tile grade dark to light, per-tile tint multipliers, background speck colour
  jade:   { stops: ['#0E1213','#161E22','#485064','#7C808B','#B2BACD','#DCE8F6','#F4F7FB'], tints: [[1, 1, 1], [.8, 1.12, 1.02], [1.05, 1.04, 1.03]], speck: [.6, .95, .82] },
  'petrol-light': { stops: ['#061E29','#0E3445','#1D546D','#3F6E7A','#7FA3AA','#BFD3D5','#E4ECED'], tints: [[1, 1, 1], [.9, 1.05, 1.12], [1, 1, 1]], speck: [.1, .3, .4], light: true },
};
// dark uses jade, light the petrol halftone; recomputed on every light/dark switch
let TH: Theme, STOPS: [number, number[]][], grade: (v: number) => number[], TINTS: number[][], PAL: number[][];
const B = 32;
function palette() {
  TH = currentMode() === 'light' ? THEMES['petrol-light'] : THEMES.jade;
  STOPS = TH.stops.map((h, i) => [[0, .22, .42, .6, .78, .9, 1][i], [1, 3, 5].map(k => parseInt(h.slice(k, k + 2), 16))]);
  grade = v => { for (let i = 1; i < STOPS.length; i++) if (v <= STOPS[i][0]) { const [p0, c0] = STOPS[i - 1], [p1, c1] = STOPS[i], t = (v - p0) / (p1 - p0); return c0.map((c, k) => c + (c1[k] - c) * t); } return STOPS.at(-1)![1]; };
  TINTS = TH.tints;
  PAL = TINTS.flatMap(m => Array.from({ length: B }, (_, i) => grade(i / (B - 1)).map((c, k) => Math.min(255, c * m[k]) / 255)));
}
palette();
let W: number, H: number, parts: Part[] = [], stars: { x: number; y: number; ph: number }[] = [], t0: number | undefined, realA = 0, lens = 0, LR = 0;

function build() {
  W = canvas.clientWidth; H = canvas.clientHeight;   // the hero's 100vh box, the same units the photo is sized in (innerHeight is shorter on phones while the URL bar shows)
  GAP = Math.max(4, Math.round(H / 180)); TILE = GAP - 1;
  const dpr = Math.min(devicePixelRatio, 2);
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  if (gl) { gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(U.res, W, H); gl.uniform1f(U.dpr, dpr); }
  // targets on a square grid laid exactly over the photo (.ph: top 11vh, 96vh tall, centred)
  parts = [];
  const top = H * .11, dispH = H * .96, dispW = dispH * img.naturalWidth / img.naturalHeight, left = (W - dispW) / 2;
  const cols = Math.floor(dispW / GAP), rows = Math.floor(dispH / GAP), nw = img.naturalWidth, nh = img.naturalHeight;
  const o = gl && cols > 0 && new OffscreenCanvas(cols, rows).getContext('2d', { willReadFrequently: true });
  if (o) o.drawImage(img, 0, 0, nw * cols * GAP / dispW, nh * rows * GAP / dispH, 0, 0, cols, rows);   // sample exactly the area the GAP grid covers, so tiles don't drift off the photo at the right and bottom
  const d: ArrayLike<number> = o ? o.getImageData(0, 0, cols, rows).data : [];
  if (o) for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const i = (y * cols + x) * 4, ty = top + y * GAP;
    const fy = y / rows; if (d[i + 3] < 120 || ty > H || fy > .86) continue;   // same fade as the photo's mask: solid to 48% of its height, gone at 86%
    const l = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
    const b = clamp((l - 0.1) / 0.62) ** 1.15;                        // hard contrast: hair and shadows near black, skin bright
    // light mode: full particles on the face too; mid-tones lifted (power .6) so the skin reads light and the eyes, brows and beard stay dark
    const v = TH.light ? clamp(.04 + .9 * b ** .6 + (Math.random() - .5) * .1 * b) : clamp(b + (Math.random() - .5) * 0.5 * b);   // per-tile sparkle, strongest in the light areas
    if (!TH.light && v < 0.05) continue;                              // dark mode: tiles that would vanish into the black are skipped
    parts.push({ tx: left + x * GAP, ty, v, a: 1 - clamp((fy - .48) / .38), tint: Math.random() < .55 ? 0 : Math.random() < .6 ? 1 : 2,
      x: 0, y: 0, vx: 0, vy: 0, shine: Math.random() * 6.28, delay: Math.random() * 0.5,
      dx: (Math.random() - .5) * 2.4, dy: (Math.random() - .5) * 2.4 });
  }
  const past = t0 !== undefined && performance.now() - t0 > SETTLED * 1000;   // rebuilt after the gather (resize, late photo): tiles start home, no replay
  parts.forEach(p => { p.sx = Math.random() * W; p.sy = Math.random() * H; p.x = past ? p.tx : p.sx; p.y = past ? p.ty : p.sy; p.on = T_SPECK + Math.random() * 0.5; });
  stars = Array.from({ length: 260 }, () => ({ x: Math.random() * W, y: Math.random() * H, ph: Math.random() * 6.28 }));
  buf = new Float32Array((parts.length + stars.length) * STRIDE);
  if (gl) gl.bufferData(gl.ARRAY_BUFFER, buf.byteLength, gl.DYNAMIC_DRAW);   // allocate once, update in place each frame
}

const ease = (t: number) => { t = Math.min(1, Math.max(0, t)); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ph = document.querySelector<HTMLElement>('.ph')!, big = document.querySelector<HTMLElement>('.big')!, logo = document.querySelector<HTMLElement>('header .logo')!;

let idle = false;
function frame(now: number) {
  const t = (now - t0!) / 1000;
  if (t > T_UI && !document.body.classList.contains('ready')) document.body.classList.add('ready');
  const s = clamp(scrollY / (H * 0.5));                   // 0..1 as the hero scrolls away
  if (idle && s === 1) { raf = requestAnimationFrame(frame); return; }   // hero off screen and settled: nothing to write
  big.style.transform = reduce ? '' : `translateY(${-s * 22}vh)`;
  const away = s > 0.55;
  if (logo.inert === away) { logo.inert = !away; logo.classList.toggle('show', away); document.body.classList.toggle('scrolled', away); }   // the logo is only focusable once it is visible
  realA = clamp((t - (gl ? SETTLED + HOLD : T_UI)) / 1.2) * (1 - clamp(s * 2.5));   // particles settle, then dissolve into the photo; scrolling hands back to the particles
  ph.style.opacity = String(realA); ph.style.transform = reduce ? '' : `translateY(${-s * 12}vh)`;
  // particle lens: over the finished photo, a circle around a mouse cursor turns back into particles
  if (realA > .9 || lens > 0) {   // skipped once the hero has scrolled away, so no layout reads or repaints elsewhere on the page
    const r = img.getBoundingClientRect(), over = gl && !reduce && mouse.fine && realA > .9 && mouse.x > r.left && mouse.x < r.right && mouse.y > r.top && mouse.y < r.top + r.height * .8;
    lens += ((over ? 1 : 0) - lens) * .12; if (lens < .01 && !over) lens = 0; LR = H * .11 * lens;
    const v = `${LR.toFixed(1)}px ${(mouse.x - r.left).toFixed(0)}px ${(mouse.y - r.top).toFixed(0)}px`;
    if (v !== img.dataset.lens) { img.dataset.lens = v; const [a, b, c] = v.split(' '); img.style.setProperty('--lr', a); img.style.setProperty('--lx', b); img.style.setProperty('--ly', c); }
  }
  if (s < 1 && gl) draw(t, s);
  idle = s === 1 && lens === 0 && document.body.classList.contains('ready');
  raf = requestAnimationFrame(frame);
}

function draw(t: number, s: number) {
  let n = 0;
  const put = (x: number, y: number, size: number, rgb: number[], a: number) => { const o = n++ * STRIDE; buf[o] = x; buf[o + 1] = y; buf[o + 2] = size; buf[o + 3] = rgb[0]; buf[o + 4] = rgb[1]; buf[o + 5] = rgb[2]; buf[o + 6] = a; };
  // ambient specks
  if (t > T_SPECK) for (const st of stars) if (reduce || Math.sin(t * 1.5 + st.ph) > -0.3) put(st.x, st.y, GAP * .2, TH.speck, .28);
  const R = H / 6;
  const tileA = reduce ? 0 : clamp((1 - realA) * 3);   // reduced motion: the photo just fades on scroll, no scattering tiles   // the photo sits above the canvas, so full tiles under a fading-in photo is a true crossfade
  if (tileA > 0 || lens > .01) for (const p of parts) {
    if (t < p.on!) continue;
    const la = lens > .01 ? lens * clamp(1 - (Math.hypot(p.x - mouse.x, p.y - mouse.y) - LR * .55) / (LR * .45)) : 0;   // tiles inside the lens show through the photo's hole
    const alpha = Math.max(tileA, la); if (alpha <= 0) { p.vx = p.vy = 0; continue; }
    const g = ease((t - T_FLY - p.delay) / FLY);
    const hx = p.tx + p.dx * s * W * 0.7, hy = p.ty + p.dy * s * H * 0.7;
    if (g < 1) { p.x = p.sx! + (hx - p.sx!) * g; p.y = p.sy! + (hy - p.sy!) * g; }
    else {
      const ddx = p.x - mouse.x, ddy = p.y - mouse.y, dist = Math.hypot(ddx, ddy);
      if (!reduce && dist < R && dist > 0) { const f = (1 - dist / R) ** 2 * (3.4 - 2.9 * realA); p.vx += ddx / dist * f; p.vy += ddy / dist * f; }
      p.vx += (hx - p.x) * .08; p.vy += (hy - p.y) * .08; p.vx *= .78; p.vy *= .78; p.x += p.vx; p.y += p.vy;
    }
    const sv = 0.55, ss = GAP * .35;
    const shimmer = g >= 1 && !reduce ? 0.1 * Math.sin(t * 2.4 + p.shine) : 0;
    const v = clamp(sv + (p.v - sv) * g + shimmer);
    put(p.x, p.y, ss + (TILE - ss) * g, PAL[p.tint * B + Math.round(v * (B - 1))], p.a * alpha);
  }
  gl!.clear(gl!.COLOR_BUFFER_BIT);
  gl!.uniform1f(U.alpha, 1 - s * 0.7);
  gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, buf, 0, n * STRIDE);
  gl!.drawArrays(gl!.POINTS, 0, n);
}

/* ---------- opening: a dot drops, the I lands above it and flings the other letters into place, then the name turns into PORTFOLIO ---------- */
const intro = document.getElementById('intro')!, spot = intro.querySelector<HTMLElement>('.spot')!, dot = intro.querySelector<HTMLElement>('.dot')!,
  letters = [...intro.querySelectorAll<HTMLElement>('.name span')], I = intro.querySelector<HTMLElement>('.i')!, word = intro.querySelector<HTMLElement>('.word')!;
// the word the opening ends on, also the hero headline; '\n' starts a new line
const NAME = 'FAHIM', TARGET = 'FAHIM FAIYAZ', timers: ReturnType<typeof setTimeout>[] = [];
// shrink the headline only if it would be wider than 90% of the screen
// the name spans exactly the content column, so its edges line up with "AI Engineer" and the buttons below it
function fitBig() {
  const row = document.querySelector('.row')!.getBoundingClientRect();
  big.style.fontSize = '100px'; big.style.fontSize = 100 * row.width / textRect(big).width + 'px';
  const hero = big.parentElement!.getBoundingClientRect();
  big.style.bottom = hero.bottom - row.top + Math.max(12, hero.height * 0.02) + 'px';   // sits just above the row, whatever its height, measured in the hero's own 100vh box
}
// timers count from t0, which moves to the animations' real start once the first frame is drawn; a timer that fires early waits out the rest
const at = (sec: number, fn: () => void) => timers.push(setTimeout(function run() { const wait = sec * 1000 - (performance.now() - t0!); if (wait > 4) timers.push(setTimeout(run, wait)); else fn(); }, sec * 1000));
const textRect = (el: Element) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect(); };
let introDone = false;
function finishIntro() {
  if (introDone) return; introDone = true;
  timers.forEach(clearTimeout); intro.hidden = true; document.body.classList.add('landed');   // hidden, not removed: React owns #intro
}
function playIntro() {
  I.style.translate = '0 0';                                  // measure the I in its resting slot; the animation below holds it off-screen until it drops
  const r = I.getBoundingClientRect(), fs = parseFloat(getComputedStyle(I).fontSize), d = fs * 0.19;
  Object.assign(dot.style, { width: d + 'px', height: d + 'px', left: r.left + r.width / 2 - d / 2 + 'px', top: r.bottom + fs * 0.02 + 'px' });
  const o = { fill: 'both' } as const;
  spot.animate([{ opacity: 0 }, { opacity: 1, offset: .15 }, { opacity: 1, offset: .85 }, { opacity: 0 }], { ...o, duration: 7500 });
  // the dot drops and bounces
  dot.animate([
    { translate: '0 -60vh', easing: 'cubic-bezier(.55,0,1,.45)' },
    { translate: '0 0', offset: .55, easing: 'cubic-bezier(0,.55,.45,1)' },
    { translate: `0 ${-fs * .35}px`, offset: .75, easing: 'cubic-bezier(.55,0,1,.45)' },
    { translate: '0 0' }], { ...o, delay: 250, duration: 1300 });
  dot.animate([{ opacity: 1, scale: 1 }, { opacity: 0, scale: 0 }], { ...o, delay: 4950, duration: 200 });
  // the I falls in above the dot, tilts left then right to fling the letters out, then stands up
  const T0 = 1500, TD = 2600, k = (ms: number) => (ms - T0) / TD;
  I.animate([
    { translate: '0 -70vh', rotate: '0deg', scale: '1 1', easing: 'cubic-bezier(.55,0,1,.45)' },
    { translate: '0 0', scale: '1 1', offset: k(1950) },
    { scale: '1.05 .88', offset: k(2050) },
    { scale: '1 1', rotate: '0deg', offset: k(2180) },
    { rotate: '-48deg', offset: k(2420) },
    { rotate: '-48deg', offset: k(3000) },
    { rotate: '44deg', offset: k(3300) },
    { rotate: '44deg', offset: k(3620), easing: 'cubic-bezier(.3,1.6,.5,1)' },
    { translate: '0 0', rotate: '0deg', scale: '1 1' }], { ...o, delay: T0, duration: TD });
  // letters leave from the tip of the tilted I, nearest first, and tumble into their slots
  const iIdx = letters.indexOf(I), base = { x: r.left + r.width / 2, y: r.bottom - fs * .14 }, L = fs * .72;
  const fling = (span: HTMLElement, when: number, deg: number) => {
    const b = span.getBoundingClientRect(), a = deg * Math.PI / 180, dir = Math.sign(deg);
    const dx = base.x + L * Math.sin(a) - (b.left + b.width / 2), dy = base.y - L * Math.cos(a) - (b.top + b.height / 2);
    span.animate([
      { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(.25) rotate(${dir * 160}deg)` },
      { opacity: 1, offset: .12 },
      { transform: `translate(${dx * .4}px, ${dy - fs * .9}px) scale(.95) rotate(${dir * 50}deg) rotateX(50deg)`, offset: .5 },
      { opacity: 1, transform: 'none' }], { fill: 'both', delay: when, duration: 700, easing: 'cubic-bezier(.25,.6,.3,1)' });
  };
  letters.slice(0, iIdx).reverse().forEach((sp, n) => fling(sp, 2380 + n * 150, -48));
  letters.slice(iIdx + 1).forEach((sp, n) => fling(sp, 3260 + n * 150, 44));
  // the name rolls over, letter by letter, into PORTFOLIO
  at(5.0, () => { intro.querySelector<HTMLElement>('.name')!.style.visibility = 'hidden'; word.style.visibility = 'visible'; });
  // roll one word into another, left to right: the first n letters are new, the rest are still the old word
  const roll = (from: string, to: string, start: number, dur: number, stride = 1) => {
    const ns: number[] = []; for (let n = 1; n < to.length; n += stride) ns.push(n); ns.push(to.length);
    ns.forEach((n, k) => at(start + (k + 1) * dur / ns.length, () => word.textContent = to.slice(0, n) + from.slice(n)));
  };
  roll(NAME, 'PORTFOLIO', 5.0, 0.9);                    // FAHIM -> PORTFOLIO, as in the template
  roll('PORTFOLIO', TARGET, 6.3, 0.9, 2);               // hold, then PORTFOLIO -> the name; odd steps skip the "FARTFOLIO" frame
  // then it moves down into its place in the hero while the specks appear
  at(7.3, () => {
    const a = textRect(word), b = textRect(document.querySelector('.big')!), sc = b.width / a.width;
    word.animate([{ transform: 'none' }, { transform: `translate(${b.left - a.left}px, ${b.top + b.height / 2 - (a.top + sc * a.height / 2)}px) scale(${sc})` }],
      { fill: 'both', duration: 900, easing: 'cubic-bezier(.7,0,.2,1)' }).onfinish = finishIntro;
  });
}

function jumpToEnd() {   // straight to the final hero: photo in, tiles home
  if (t0 === undefined || performance.now() - t0 >= FINAL * 1000) return;
  t0 = performance.now() - FINAL * 1000;
  for (const p of parts) { p.x = p.tx; p.y = p.ty; p.vx = p.vy = 0; }
}
const skip = () => { if (t0 === undefined) return; finishIntro(); jumpToEnd(); };   // nothing to skip before the opening starts
addEventListener('pointerdown', skip, on); addEventListener('keydown', skip, on); addEventListener('wheel', skip, { passive: true, ...on });
const away = () => scrollY > 8;   // a link to a section, or a reload anywhere below the top: the opening would play over the page
const SESSION_KEY = 'opened';   // spec: the opening plays once per browser session
const openedBefore = () => { try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; } };   // storage blocked: behaves as not-yet-opened, so it plays as it does today
const markOpened = () => { try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {} };
addEventListener('scroll', () => { if (!introDone && away()) skip(); }, { passive: true, ...on });
addEventListener('modechange', () => { palette(); build(); }, on);   // regrade the portrait; the next frame redraws

// the opening waits only for the font, and starts on the first animation frame (never in a background tab)
// next/font renames the family, so the font to wait for is read from the page
const fam = getComputedStyle(document.body).fontFamily.split(',')[0];
Promise.race([document.fonts.load(`800 100px ${fam}`), new Promise(r => timers.push(setTimeout(r, 3000)))]).catch(() => {}).then(() => { if (!ac.signal.aborted) raf = requestAnimationFrame(() => {   // a stalled font file never holds the page hidden
  fitBig(); build(); t0 = performance.now(); document.fonts.ready.then(() => { if (!ac.signal.aborted) fitBig(); });   // refit if Inter arrived after the timeout
  if (reduce || away() || openedBefore()) skip();
  else { markOpened(); playIntro(); spot.getAnimations()[0].ready.then(a => { if (!ac.signal.aborted && !introDone) t0 = a.startTime as number; }, () => {}); }   // one clock: the word timers and the particles follow the animations, which only start on the first drawn frame (up to ~0.4 s late on a slow load)
  raf = requestAnimationFrame(frame);
  img.decode().then(() => { if (!ac.signal.aborted) build(); }, () => { if (!ac.signal.aborted) ph.hidden = true; });   // no photo: the hero still works, just without the portrait
}); });
let cw = canvas.clientWidth, ch = canvas.clientHeight;
addEventListener('resize', () => { if (t0 === undefined || (canvas.clientWidth === cw && canvas.clientHeight === ch)) return; cw = canvas.clientWidth; ch = canvas.clientHeight; fitBig(); build(); skip(); }, on);   // a phone's address bar doesn't reshuffle the portrait

return () => {
  ac.abort(); cancelAnimationFrame(raf); timers.forEach(clearTimeout);
  intro.getAnimations({ subtree: true }).forEach(a => a.cancel());
  gl?.getExtension('WEBGL_lose_context')?.loseContext();
  document.body.classList.remove('ready', 'landed', 'scrolled');
};
}
