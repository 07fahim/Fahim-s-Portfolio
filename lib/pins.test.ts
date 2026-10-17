import { expect, test } from 'vitest';
import { computePins } from './pins';

const five = (h: number) => Array(5).fill(h);
test('desktop 1280×800: offsets step 24 px from 96', () => {
  expect(computePins({ viewport: 800, heights: five(592), wide: true })).toEqual({ tops: [96, 120, 144, 168, 192], minHeight: 592, tall: false });
});
test('phone 390×844: tight steps from 70', () => {
  const p = computePins({ viewport: 844, heights: five(742), wide: false });
  expect(p.tall).toBe(false);
  expect(p.tops.map(t => +t.toFixed(1))).toEqual([70, 74, 78, 82, 86]);
});
test('phone 360×740: a card taller than the screen holds with its bottom 16 px up', () => {
  expect(computePins({ viewport: 740, heights: five(780), wide: false })).toEqual({ tops: [-56, -56, -56, -56, -56], minHeight: 780, tall: true });
});
test('the tallest card sets the height', () => {
  expect(computePins({ viewport: 800, heights: [500, 604, 550, 520, 580], wide: true }).minHeight).toBe(604);
});
