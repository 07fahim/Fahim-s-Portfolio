// One-off: screenshot the real hero (final state) for the OG/Twitter share image.
// Needs the production build running: npm run build && npm start, then npm run og.
// MODE=dark|light (default light, what a first visit sees); OUT overrides public/og.jpg.
import { chromium } from '@playwright/test';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const URL_ = process.env.BUILD_URL || 'http://localhost:3000/';
const SIZE = { width: 1200, height: 630 };
const MODE = process.env.MODE || 'light';
const OUT = process.env.OUT || 'public/og.jpg';

async function launch(args) {
  const browser = await chromium.launch({ args });
  const ctx = await browser.newContext({ viewport: SIZE, colorScheme: MODE, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  await page.addInitScript(m => { sessionStorage.setItem('opened', '1'); localStorage.setItem('mode', m); }, MODE);   // skip the opening; hero jumps to its final state
  await page.goto(URL_, { waitUntil: 'networkidle' });
  const gl = await page.evaluate(() => !!document.createElement('canvas').getContext('webgl2'));
  if (!gl) { await browser.close(); return null; }
  await page.waitForFunction(() => document.body.classList.contains('ready'));
  await page.waitForFunction(() => {
    const ph = document.querySelector('.ph');
    return ph && parseFloat(getComputedStyle(ph).opacity) > 0.99;
  });
  await page.waitForTimeout(1500);   // let Silk and the particles settle
  return { browser, page };
}

let session = await launch(['--use-angle=d3d11']);
let gpuNote = '--use-angle=d3d11';
if (!session) {
  console.log('WebGL2 failed under d3d11, falling back to swiftshader');
  session = await launch(['--use-angle=swiftshader', '--enable-unsafe-swiftshader']);
  gpuNote = '--use-angle=swiftshader --enable-unsafe-swiftshader';
  if (!session) throw new Error('WebGL2 unavailable even under swiftshader');
}
const { browser, page } = session;

// JPEG: the PNG capture is ~770 KB, the JPEG ~80 KB at no visible loss
const png = await page.screenshot();
await browser.close();
await sharp(png).jpeg({ quality: 90 }).toFile(OUT);
console.log(`${OUT} ${Math.round((await stat(OUT)).size / 1024)} KB (gpu: ${gpuNote})`);
