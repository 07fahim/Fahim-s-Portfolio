// Compares the build with the approved prototype: element boxes (±2 px) and colours, per section,
// at 1280×800 and 375×812, dark and light, with reduced motion (no opening, still rows, static cards).
// Usage: npm run build && npm start   (in another terminal)   then   npm run parity -- about
import { chromium } from '@playwright/test';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = 'docs/prototype', PORT = 4173, BUILD = process.env.BUILD_URL || 'http://localhost:3000', TOL = 2;
const TYPES = { '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.pdf': 'application/pdf' };
const SECTIONS = {
  base: ['body'],
  header: ['header', 'header .logo', 'header nav a', '.mode', '.menu-btn'],
  hero: ['.hero', '.big', '.row', '.title', '.btns .btn', '.skip'],
  about: ['#about', '.about h2', '.about .card', '#bio p', '.facts > div', '.card .cv', '.stack-head', '.halt', '.marquee'],
  services: ['#services', '.services h2', '.svc > li', '.svc .t', '.svc .n'],
  work: ['#work', '.work h2', '.pinc', '.pinc h3', '.smedia', '#all-projects', '.filters button', '.pcard:not([hidden])', '.more button'],
  timeline: ['#timeline', '.tl h2', '.tl-list > li', '.tl h3', '.tl .tags span'],
  achievements: ['#achievements', '.ach h2', '.ach .gh', '.ach .cards > li', '.ach .doi'],
  contact: ['#contact', '.ct h2', '.ct .glass', '.ct .info li', '.ct label.f', '.ct .send', '.ct .quick .btn'],
  game: ['#game', '.cap', '.play'],
  footer: ['footer', '.ft .name', '.ft .line', '.ft .icons a', '.ft .bar'],
};
const want = process.argv[2] || 'all';
const sels = want === 'all' ? Object.values(SECTIONS).flat() : SECTIONS[want];
if (!sels) { console.error(`unknown section ${want}; one of ${Object.keys(SECTIONS).join(', ')}, all`); process.exit(2); }

const server = http.createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^[/\\]+/, '') || 'sections-mock.html';
  try { const body = await readFile(join(ROOT, p)); res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' }); res.end(body); }
  catch { res.writeHead(404); res.end(); }
});
server.listen(PORT);
const browser = await chromium.launch();

async function measure(url, vp, scheme) {
  const mobile = vp.width < 800;
  const ctx = await browser.newContext({ viewport: vp, colorScheme: scheme, reducedMotion: 'reduce', isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  // prototype transitions run up to .8s (header: opacity .8s, background .4s); killing them lands every
  // measurement on the end state instead of risking a mid-transition read (same rule for both sides)
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
  await page.evaluate(() => document.fonts.ready);
  // the prototype measures its stacked cards before its web font arrives and only refits on resize, so it
  // needs this dispatch to reach its font-loaded size; the build refits on its own font-load callback, so
  // dispatching here too would mask a build that fails to refit itself
  if (url !== BUILD) await page.evaluate(() => dispatchEvent(new Event('resize')));
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += vp.height) await page.evaluate(y => scrollTo(0, y), y);   // lazy images and scroll state settle
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(300);
  const data = await page.evaluate(sels => Object.fromEntries(sels.map(s => [s, [...document.querySelectorAll(s)].filter(e => e.getClientRects().length).map(e => {
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height, color: cs.color, bg: cs.backgroundColor, fs: cs.fontSize, fw: cs.fontWeight };
  })])), sels);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await ctx.close();
  return { data, over };
}

const fails = [];
for (const vp of [{ width: 1280, height: 800 }, { width: 375, height: 812 }]) for (const scheme of ['dark', 'light']) {
  const tag = `${vp.width} ${scheme}`;
  const [a, b] = [await measure(`http://localhost:${PORT}/sections-mock.html`, vp, scheme), await measure(BUILD, vp, scheme)];
  if (b.over > 0) fails.push(`${tag}: page scrolls sideways by ${b.over}px`);
  for (const s of sels) {
    const [pa, pb] = [a.data[s], b.data[s]];
    if (pa.length !== pb.length) { fails.push(`${tag} ${s}: ${pa.length} in prototype, ${pb.length} in build`); continue; }
    pa.forEach((ea, i) => {
      const eb = pb[i];
      // the build's `<main />` placeholder (Step 7) has nowhere near the prototype's body height until every
      // section exists, so box geometry for `body` is only checked once every section is in (section === 'all').
      if (s !== 'body' || want === 'all') for (const k of ['x', 'y', 'w', 'h']) if (Math.abs(ea[k] - eb[k]) > TOL) fails.push(`${tag} ${s}[${i}].${k}: ${ea[k].toFixed(1)} → ${eb[k].toFixed(1)}`);
      for (const k of ['color', 'bg', 'fs', 'fw']) {
        // the prototype loads no 700 face, so 700 draws as 800; compare it as what it renders, not what it asked for
        const va = k === 'fw' && ea[k] === '700' ? '800' : ea[k];
        // font sizes fitted from measured glyph widths (the hero name) differ by thousandths between the two Inter files
        const same = k === 'fs' ? Math.abs(parseFloat(va) - parseFloat(eb[k])) <= 0.1 : va === eb[k];
        if (!same) fails.push(`${tag} ${s}[${i}].${k}: ${ea[k]} → ${eb[k]}`);
      }
    });
  }
}
await browser.close(); server.close();
if (fails.length) { console.log(fails.slice(0, 60).join('\n') + (fails.length > 60 ? `\n… ${fails.length - 60} more` : '')); process.exit(1); }
console.log(`parity ok: ${want}`);
