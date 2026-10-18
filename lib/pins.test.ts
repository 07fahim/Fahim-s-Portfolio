import { expect, test } from 'vitest';
import { computePins } from './pins';

const five = (h: number) => Array(5).fill(h);
test('desktop 1280×800: offsets step 24 px from 96', () => {
  expect(computePins({ viewport: 800, heights: five(592), wide: true })).toEqual({ tops: [96, 120, 144, 168, 192], minHeight: 592, tall: false, unpin: false });
});
test('phone 390×844: tight steps from 70', () => {
  const p = computePins({ viewport: 844, heights: five(742), wide: false });
  expect(p.tall).toBe(false);
  expect(p.tops.map(t => +t.toFixed(1))).toEqual([70, 74, 78, 82, 86]);
});
test('phone 360×740: a card taller than the screen holds with its bottom 16 px up', () => {
  expect(computePins({ viewport: 740, heights: five(780), wide: false })).toEqual({ tops: [-56, -56, -56, -56, -56], minHeight: 780, tall: true, unpin: true });
});
test('the tallest card sets the height', () => {
  expect(computePins({ viewport: 800, heights: [500, 604, 550, 520, 580], wide: true }).minHeight).toBe(604);
});
// unpin (user, 2026-10-19): phones never pin (a toolbar resize must not flip the mode mid-scroll, and a card is
// taller than most phone browsers' page, e.g. 390x664 on an iPhone 13); desktop unpins only when a tall card's text
// would sit under the 62 px menu bar
const at = (viewport: number, H: number, wide: boolean, pad: number) => computePins({ viewport, heights: five(H), wide, header: 62, pad });
test('phones never pin, even when the card fits', () => {
  expect(at(915, 600, false, 18).unpin).toBe(true);
  expect(at(664, 742, false, 18).unpin).toBe(true);
});
test('desktop pins when the card fits, and when a tall card only tucks its padding under the bar', () => {
  expect(at(800, 592, true, 45).unpin).toBe(false);
  expect(at(657, 473, true, 24).unpin).toBe(false);   // a 1366x768 laptop with the short-window card
  expect(at(730, 629, true, 54).unpin).toBe(false);   // tall, pinned at 85: text clear
});
test('desktop unpins when a tall card would hide its text under the bar', () => {
  expect(at(600, 567, true, 32).unpin).toBe(true);    // 900x600: pinned at 17 + 32 padding = 49 < 62
});
