import { expect, test } from 'vitest';
import { computePins } from './pins';

const five = (h: number) => Array(5).fill(h);
test('desktop 1280×800: offsets step 21 px from 96', () => {
  expect(computePins({ viewport: 800, heights: five(604), wide: true })).toEqual({ tops: [96, 117, 138, 159, 180], minHeight: 604, tall: false });
});
test('phone 390×844: tight steps from 70', () => {
  const p = computePins({ viewport: 844, heights: five(737), wide: false });
  expect(p.tall).toBe(false);
  expect(p.tops.map(t => +t.toFixed(1))).toEqual([70, 75.3, 80.5, 85.8, 91]);
});
test('phone 360×740: a card taller than the screen holds with its bottom 16 px up', () => {
  expect(computePins({ viewport: 740, heights: five(774), wide: false })).toEqual({ tops: [-50, -50, -50, -50, -50], minHeight: 774, tall: true });
});
test('the tallest card sets the height', () => {
  expect(computePins({ viewport: 800, heights: [500, 604, 550, 520, 580], wide: true }).minHeight).toBe(604);
});
