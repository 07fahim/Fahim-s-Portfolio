import { css } from '@/lib/css';

// PORT P1267–1364: the HELLO WORLD brick-breaker. Changes from the prototype are the brief's 1–5:
// DOM lookups scoped to `sec` (header stays document-level), css() imported, the --bx/--bt writes
// dropped (nothing reads them; --pt is kept), listeners collected under an AbortController plus a
// modechange regrade, and a named IntersectionObserver (`io`) disconnected on cleanup.
type Brick = { x: number; y: number; s: number; line: number; dead: number };
type Pad = { w: number; h: number; x: number; y: number };
type Ball = { r: number; x: number; y: number; vx: number; vy: number };

const GLYPH: Record<string, string[]> = {   // 5×7 pixel letters
  H: ['X...X', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
  E: ['XXXXX', 'X....', 'X....', 'XXXX.', 'X....', 'X....', 'XXXXX'],
  L: ['X....', 'X....', 'X....', 'X....', 'X....', 'X....', 'XXXXX'],
  O: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
  W: ['X...X', 'X...X', 'X...X', 'X.X.X', 'X.X.X', 'XX.XX', 'X...X'],
  R: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X.X..', 'X..X.', 'X...X'],
  D: ['XXXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'XXXX.'],
};

export function mountGame(sec: HTMLElement): () => void {
  const cv = sec.querySelector<HTMLCanvasElement>('#bricks')!, g = cv.getContext('2d')!, btn = sec.querySelector<HTMLButtonElement>('#play')!;
  const ac = new AbortController(), on = { signal: ac.signal };
  let W: number, H: number, P: number, ceil: number, bricks: Brick[], fills: CanvasGradient[], pad: Pad, ball: Ball, speed: number, tx: number, keys = 0, playing = false, raf = 0, last = 0;

  function layout() {
    const dpr = devicePixelRatio || 1; W = sec.clientWidth; H = sec.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    P = Math.min((W < 800 ? .88 : .35) * W / 29, .40 * H / 17);   // on short screens the height limits the bricks, leaving room for the caption and Play          // brick pitch: 29 columns wide, 17 rows tall
    const x0 = (W - 29 * P) / 2, y0 = H * .44 - 17 * P / 2;   // a little above centre, so the caption and Play fit before the ball on short screens
    bricks = []; fills = [];
    ['HELLO', 'WORLD'].forEach((word, line) => {
      const top = y0 + line * 10 * P, f = g.createLinearGradient(0, top, 0, top + 7 * P);
      f.addColorStop(.3, css('--g1')); f.addColorStop(1, css('--g2')); fills.push(f);   // same per-line grade as the headings
      [...word].forEach((ch, i) => GLYPH[ch].forEach((row, r) => [...row].forEach((c, k) => {
        if (c === 'X') bricks.push({ x: x0 + (i * 6 + k) * P, y: top + r * P, s: P * .72, line, dead: 0 });
      })));
    });
    pad = { w: Math.max(W * .135, 110), h: Math.max(8, P * .55), x: W / 2, y: H * .92 }; tx = pad.x;
    ceil = document.querySelector('header')!.offsetHeight;   // the ball bounces off the nav bar, not under it
    speed = H * .8; playing = false; btn.hidden = false;
    const bb = y0 + 17 * P, waitY = H * .92 - H * .08;   // bottom of WORLD, and where the ball waits
    sec.style.setProperty('--pt', ((bb + waitY) / 2) + 'px');   // the caption and Play follow the bricks at every size
    ball = { r: Math.max(5, P * .5), x: pad.x, y: 0, vx: 0, vy: 0 }; rest();
  }
  const rest = () => { ball.x = pad.x; ball.y = pad.y - H * .08; };

  function step(dt: number, now: number) {
    pad.x += (tx - pad.x) * Math.min(1, dt * 20);
    pad.x = Math.min(W - pad.w / 2, Math.max(pad.w / 2, pad.x));
    if (bricks.every(k => k.dead && now - k.dead > 600)) { bricks.forEach(k => k.dead = 0); playing = false; btn.hidden = false; }   // cleared: rebuild, even if the ball was missed meanwhile
    if (!playing) return rest();
    const n = Math.ceil(speed * dt / ball.r), b = ball;                  // sub-steps so a fast ball can't skip a brick
    for (let i = 0; i < n; i++) {
      b.x += b.vx * dt / n; b.y += b.vy * dt / n;
      if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx); }
      if (b.x > W - b.r) { b.x = W - b.r; b.vx = -Math.abs(b.vx); }
      if (b.y < ceil + b.r) { b.y = ceil + b.r; b.vy = Math.abs(b.vy); }
      if (b.vy > 0 && b.y + b.r >= pad.y - pad.h / 2 && b.y - b.r <= pad.y + pad.h / 2 && Math.abs(b.x - pad.x) <= pad.w / 2 + b.r) {
        const a = Math.max(-1, Math.min(1, (b.x - pad.x) / (pad.w / 2))) * Math.PI / 3;   // where it lands on the paddle sets the angle
        b.vx = speed * Math.sin(a); b.vy = -speed * Math.cos(a); b.y = pad.y - pad.h / 2 - b.r;
      }
      for (const k of bricks) {
        if (k.dead) continue;
        const dx = b.x - Math.max(k.x, Math.min(b.x, k.x + k.s)), dy = b.y - Math.max(k.y, Math.min(b.y, k.y + k.s));
        if (dx * dx + dy * dy >= b.r * b.r) continue;
        k.dead = now;
        if (Math.abs(dx) > Math.abs(dy)) b.vx = Math.sign(dx) * Math.abs(b.vx); else b.vy = (Math.sign(dy) || -Math.sign(b.vy)) * Math.abs(b.vy);
        break;
      }
    }
    if (b.y - b.r > H) { playing = false; btn.hidden = false; }            // missed: the ball goes back on the paddle
  }

  function draw(now: number) {
    g.clearRect(0, 0, W, H);
    for (const k of bricks) {
      const a = k.dead ? 1 - (now - k.dead) / 450 : 1;                    // hit bricks fade out
      if (a <= 0) continue;
      g.globalAlpha = a; g.fillStyle = fills[k.line]; g.fillRect(k.x, k.y, k.s, k.s);
    }
    g.globalAlpha = 1;
    const pf = g.createLinearGradient(0, pad.y - pad.h / 2, 0, pad.y + pad.h / 2);
    pf.addColorStop(0, css('--g1')); pf.addColorStop(1, css('--g2'));
    g.fillStyle = pf; g.beginPath(); g.roundRect(pad.x - pad.w / 2, pad.y - pad.h / 2, pad.w, pad.h, pad.h / 2); g.fill();
    g.fillStyle = css('--fg-strong'); g.beginPath(); g.arc(ball.x, ball.y, ball.r, 0, 7); g.fill();
  }

  function tick(t: number) {
    const dt = Math.min((t - last) / 1000, 1 / 30); last = t;              // a paused tab doesn't fling the ball
    tx = Math.min(W - pad.w / 2, Math.max(pad.w / 2, tx + keys * W * 1.2 * dt));   // held past the edge, the target stops there, so reversing is instant
    step(dt, t); draw(t); raf = requestAnimationFrame(tick);
  }

  btn.onclick = () => {
    const a = (Math.random() - .5) * Math.PI / 4.5;
    Object.assign(ball, { vx: speed * Math.sin(a), vy: -speed * Math.cos(a) });
    playing = true; btn.hidden = true; sec.focus({ preventScroll: true });   // keep arrow keys working once the button is gone
  };
  cv.addEventListener('pointermove', e => tx = e.clientX - cv.getBoundingClientRect().left, on);
  const held = new Set<string>(), steer = () => keys = Number(held.has('ArrowRight')) - Number(held.has('ArrowLeft'));   // both keys tracked: letting go of one keeps the other working
  addEventListener('keydown', e => { if ((e.target as HTMLElement).closest?.('input, textarea, select')) return; if (raf && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { held.add(e.key); steer(); if (playing) e.preventDefault(); } }, on);
  addEventListener('keyup', e => { if (held.delete(e.key)) steer(); }, on);
  const io = new IntersectionObserver(([e]) => {                                       // only runs while the section is on screen
    if (e.isIntersecting && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    if (!e.isIntersecting) { cancelAnimationFrame(raf); raf = 0; }
  });
  io.observe(sec);
  layout();
  addEventListener('resize', () => { if (sec.clientWidth !== W || sec.clientHeight !== H) layout(); }, on);   // a phone's address bar showing/hiding doesn't reset the game
  addEventListener('modechange', () => layout(), on);   // regrade the bricks and paddle on a mode switch

  return () => { ac.abort(); cancelAnimationFrame(raf); io.disconnect(); };
}
