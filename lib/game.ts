import { css } from '@/lib/css';
import { better, fmtTime, livesText, loadBest, saveBest, shareText, type Result } from '@/lib/score';

// PORT P1267–1364: the HELLO WORLD brick-breaker. Changes from the prototype are the brief's 1–5:
// DOM lookups scoped to `sec` (header stays document-level), css() imported, the --bx/--bt writes
// dropped (nothing reads them; --pt is kept), listeners collected under an AbortController plus a
// modechange regrade, and a named IntersectionObserver (`io`) disconnected on cleanup.
type Brick = { x: number; y: number; s: number; line: number; dead: number };
type Pad = { w: number; h: number; x: number; y: number };
type Ball = { r: number; x: number; y: number; vx: number; vy: number };
type Bit = { x: number; y: number; vx: number; vy: number; s: number; line: number };   // a burst piece

const GLYPH: Record<string, string[]> = {   // 5×7 pixel letters
  H: ['X...X', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
  E: ['XXXXX', 'X....', 'X....', 'XXXX.', 'X....', 'X....', 'XXXXX'],
  L: ['X....', 'X....', 'X....', 'X....', 'X....', 'X....', 'XXXXX'],
  O: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
  W: ['X...X', 'X...X', 'X...X', 'X.X.X', 'X.X.X', 'XX.XX', 'X...X'],
  R: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X.X..', 'X..X.', 'X...X'],
  D: ['XXXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'XXXX.'],
};

// A hit cracks a chunk (user, 2026-10-19): the brick and the live bricks touching it on each side, so clearing
// HELLO WORLD takes about a third of the hits. Letters are a column apart, so a chunk never jumps between them.
export function crack(bricks: Brick[], hit: Brick, pitch: number, now: number) {
  hit.dead = now;
  for (const k of bricks) if (!k.dead && Math.abs(k.x - hit.x) + Math.abs(k.y - hit.y) < pitch * 1.01) k.dead = now;
}

export function mountGame(sec: HTMLElement): () => void {
  const cv = sec.querySelector<HTMLCanvasElement>('#bricks')!, g = cv.getContext('2d')!, btn = sec.querySelector<HTMLButtonElement>('#play')!;
  const ac = new AbortController(), on = { signal: ac.signal };
  let W: number, H: number, P: number, ceil: number, bricks: Brick[] | undefined, fills: CanvasGradient[], pad: Pad, ball: Ball, speed: number, tx: number, keys = 0, playing = false, raf = 0, last = 0;
  // build (user, 2026-10-19): 3 lives, a clock that runs only while the ball is in play, the personal best, and the cards
  const $ = <T extends Element>(q: string) => sec.querySelector<T>(q)!;
  const hud = $<HTMLElement>('.hud'), dots = [...sec.querySelectorAll<HTMLElement>('.hud .lives i')], livesEl = $<HTMLElement>('.hud .lives'), clockEl = $<HTMLElement>('.hud .clock'), bestEl = $<HTMLElement>('.hud .best');
  const card = $<HTMLElement>('.gcard'), title = $<HTMLElement>('.gcard h3'), num = $<HTMLElement>('.gcard .num span'), sub = $<HTMLElement>('.gcard .num small'), pills = $<HTMLElement>('.gcard .pills'), left = $<HTMLElement>('.gcard .left'), nb = $<HTMLElement>('.gcard .nb');
  const share = $<HTMLButtonElement>('.gcard .share'), again = $<HTMLButtonElement>('.gcard .again'), more = $<HTMLElement>('.gcard .more'), status = $<HTMLElement>('[role=status]'), cap = $<HTMLElement>('.cap');
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lives = 3, clock = 0, started = false, best = loadBest(), result: Result | null = null, bits: Bit[] = [], boom = 0, craf = 0, later = 0, copied = 0;

  function layout() {
    const dpr = devicePixelRatio || 1; W = sec.clientWidth; H = sec.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    P = Math.min((W < 800 ? .88 : .35) * W / 29, .40 * H / 17);   // on short screens the height limits the bricks, leaving room for the caption and Play          // brick pitch: 29 columns wide, 17 rows tall
    const x0 = (W - 29 * P) / 2, y0 = H * .44 - 17 * P / 2;   // a little above centre, so the caption and Play fit before the ball on short screens
    const was = bricks?.map(k => k.dead);   // a resize or theme switch mid-game keeps the broken bricks broken
    const bs: Brick[] = []; fills = [];
    ['HELLO', 'WORLD'].forEach((word, line) => {
      const top = y0 + line * 10 * P, f = g.createLinearGradient(0, top, 0, top + 7 * P);
      f.addColorStop(.3, css('--g1')); f.addColorStop(1, css('--g2')); fills.push(f);   // same per-line grade as the headings
      [...word].forEach((ch, i) => GLYPH[ch].forEach((row, r) => [...row].forEach((c, k) => {
        if (c === 'X') bs.push({ x: x0 + (i * 6 + k) * P, y: top + r * P, s: P * .72, line, dead: 0 });
      })));
    });
    bricks = bs; bs.forEach((k, i) => k.dead = was?.[i] ?? 0);
    pad = { w: Math.max(W * .135, 110), h: Math.max(8, P * .55), x: W / 2, y: H * .92 }; tx = pad.x;
    ceil = document.querySelector('header')!.offsetHeight;   // the ball bounces off the nav bar, not under it
    sec.style.setProperty('--ceil', ceil + 'px');   // the lives and clock sit just under it
    speed = H * .8; playing = false; btn.hidden = !card.hidden || bs.every(k => k.dead);   // cleared, card on its way: no Play
    const bb = y0 + 17 * P, waitY = H * .92 - H * .08;   // bottom of WORLD, and where the ball waits
    sec.style.setProperty('--pt', ((bb + waitY) / 2) + 'px');   // the caption and Play follow the bricks at every size
    ball = { r: Math.max(5, P * .5), x: pad.x, y: 0, vx: 0, vy: 0 }; rest();
  }
  const rest = () => { ball.x = pad.x; ball.y = pad.y - H * .08; };

  function step(dt: number, now: number) {
    pad.x += (tx - pad.x) * Math.min(1, dt * 20);
    pad.x = Math.min(W - pad.w / 2, Math.max(pad.w / 2, pad.x));
    if (!playing) return rest();
    const s0 = Math.floor(clock); clock += dt; if (Math.floor(clock) !== s0) clockEl.textContent = fmtTime(clock);
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
      for (const k of bricks!) {
        if (k.dead) continue;
        const dx = b.x - Math.max(k.x, Math.min(b.x, k.x + k.s)), dy = b.y - Math.max(k.y, Math.min(b.y, k.y + k.s));
        if (dx * dx + dy * dy >= b.r * b.r) continue;
        crack(bricks!, k, P, now);
        if (Math.abs(dx) > Math.abs(dy)) b.vx = Math.sign(dx) * Math.abs(b.vx); else b.vy = (Math.sign(dy) || -Math.sign(b.vy)) * Math.abs(b.vy);
        break;
      }
    }
    if (bricks!.every(k => k.dead)) return win();
    if (b.y - b.r > H) miss();
  }

  function draw(now: number) {
    g.clearRect(0, 0, W, H);
    const dim = card.hidden ? 1 : .12;
    for (const k of bricks!) {
      const a = (k.dead ? 1 - (now - k.dead) / 450 : 1) * dim;   // hit bricks fade out; the rest go faint behind an open card
      if (a <= 0) continue;
      g.globalAlpha = a; g.fillStyle = fills[k.line]; g.fillRect(k.x, k.y, k.s, k.s);
    }
    const ba = 1 - (now - boom) / 900;                                   // the burst: every brick flies out and fades
    if (bits.length && ba > 0) { g.globalAlpha = ba; for (const p of bits) { g.fillStyle = fills[p.line]; g.fillRect(p.x, p.y, p.s, p.s); } } else bits = [];
    g.globalAlpha = 1;
    const pf = g.createLinearGradient(0, pad.y - pad.h / 2, 0, pad.y + pad.h / 2);
    pf.addColorStop(0, css('--g1')); pf.addColorStop(1, css('--g2'));
    g.fillStyle = pf; g.beginPath(); g.roundRect(pad.x - pad.w / 2, pad.y - pad.h / 2, pad.w, pad.h, pad.h / 2); g.fill();
    g.fillStyle = css('--fg-strong'); g.beginPath(); g.arc(ball.x, ball.y, ball.r, 0, 7); g.fill();
  }

  function tick(t: number) {
    const dt = Math.min((t - last) / 1000, 1 / 30); last = t;              // a paused tab doesn't fling the ball
    tx = Math.min(W - pad.w / 2, Math.max(pad.w / 2, tx + keys * W * 1.2 * dt));   // held past the edge, the target stops there, so reversing is instant
    for (const p of bits) { p.vy += H * 2.2 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
    step(dt, t); draw(t); raf = requestAnimationFrame(tick);
  }

  function launch() {
    const a = (Math.random() - .5) * Math.PI / 4.5;
    Object.assign(ball, { vx: speed * Math.sin(a), vy: -speed * Math.cos(a) });
    playing = true; started = true; btn.hidden = true; sync(); sec.focus({ preventScroll: true });   // keep arrow keys working once the button is gone
  }
  btn.onclick = launch;

  const say = (t: string) => { status.textContent = t; };
  function sync() {                                                      // the lives, clock and best pills
    dots.forEach((d, i) => d.classList.toggle('lost', i >= lives));
    clockEl.textContent = fmtTime(clock);
    bestEl.hidden = !best; bestEl.textContent = best ? 'Best ' + fmtTime(best.time) : '';
    hud.classList.toggle('on', started || !!best);
  }
  function miss() {                                                      // the ball goes back on the paddle; Play launches the next one
    playing = false; lives--; sync();
    livesEl.classList.remove('ping'); void livesEl.offsetWidth; livesEl.classList.add('ping');
    if (lives > 0) { btn.hidden = false; btn.focus({ preventScroll: true }); say(livesText(lives)); } else over();
  }
  function count(to: number, f: (v: number) => string) {                // as the service cards' big numbers: 1.2 s, ease-out
    cancelAnimationFrame(craf);
    if (reduce()) { num.textContent = f(to); return; }
    const t0 = performance.now();
    const run = (t: number) => { const p = Math.min(1, (t - t0) / 1200); num.textContent = f(to * (1 - Math.pow(1 - p, 3))); if (p < 1) craf = requestAnimationFrame(run); };
    num.textContent = f(0); craf = requestAnimationFrame(run);
  }
  function open(head: string, win: boolean) {
    title.textContent = head; pills.hidden = share.hidden = more.hidden = !win;
    card.hidden = false; cap.hidden = btn.hidden = true;   // the caption would peek out under the card
    (win ? share : again).focus({ preventScroll: true });
  }
  function win() {
    playing = false;
    const r: Result = { time: Math.floor(clock), lives }, nbest = better(r, best);
    result = r; if (nbest) { best = r; saveBest(r); }
    if (!reduce()) { boom = performance.now(); bits = bricks!.map(k => ({ x: k.x, y: k.y, s: k.s, line: k.line, vx: (Math.random() - .5) * W * .6, vy: -(.3 + Math.random() * .6) * H })); }
    later = window.setTimeout(() => {
      sub.hidden = true; left.textContent = livesText(r.lives); nb.textContent = nbest ? 'New best' : 'Best ' + fmtTime(best!.time); nb.classList.toggle('live', nbest); share.textContent = 'Share my time';   // not a new best: the time to beat
      open('YOU BROKE IT', true); count(r.time, fmtTime); sync();
    }, reduce() ? 0 : 700);
    say(`You broke it in ${fmtTime(r.time)} with ${livesText(r.lives)}.` + (nbest ? ' New best.' : ''));
  }
  function over() {
    const n = bricks!.filter(k => k.dead).length;
    sub.hidden = false; sub.textContent = `of ${bricks!.length} bricks broken`;
    open('OUT OF LIVES', false); count(n, v => String(Math.round(v)));
    say(`Out of lives. You broke ${n} of ${bricks!.length} bricks.`);
  }
  again.onclick = () => {
    bricks!.forEach(k => k.dead = 0); lives = 3; clock = 0; bits = [];
    card.hidden = true; cap.hidden = false; launch();
  };
  share.onclick = async () => {
    if (!result) return;
    const text = shareText(result);
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); share.textContent = 'Copied'; clearTimeout(copied); copied = window.setTimeout(() => share.textContent = 'Share my time', 2000); }
    } catch { /* cancelled or blocked: nothing to do */ }
  };
  sync();
  cv.addEventListener('pointermove', e => tx = e.clientX - cv.getBoundingClientRect().left, on);
  const held = new Set<string>(), steer = () => keys = Number(held.has('ArrowRight')) - Number(held.has('ArrowLeft'));   // both keys tracked: letting go of one keeps the other working
  addEventListener('keydown', e => { if ((e.target as HTMLElement).closest?.('input, textarea, select')) return; if (raf && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { held.add(e.key); steer(); if (playing) e.preventDefault(); } }, on);
  addEventListener('keyup', e => { if (held.delete(e.key)) steer(); }, on);
  const io = new IntersectionObserver(es => {                                          // only runs while the section is on screen
    const e = es[es.length - 1];                                                         // a #game load can batch [leaving, entering]: the newest one counts
    if (e.isIntersecting && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    if (!e.isIntersecting) { cancelAnimationFrame(raf); raf = 0; }
  });
  io.observe(sec);
  layout();
  addEventListener('resize', () => { if (sec.clientWidth !== W || sec.clientHeight !== H) layout(); }, on);   // a phone's address bar showing/hiding doesn't reset the game
  addEventListener('modechange', () => layout(), on);   // regrade the bricks and paddle on a mode switch

  return () => { ac.abort(); cancelAnimationFrame(raf); cancelAnimationFrame(craf); clearTimeout(later); clearTimeout(copied); io.disconnect(); };
}
