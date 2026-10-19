import { expect, test } from 'vitest';
import { crack } from './game';

const b = (x: number, y: number, dead = 0) => ({ x, y, s: 7, line: 0, dead });

test('a hit breaks the brick and the live bricks touching it on each side, never a diagonal or a gap away', () => {
  const P = 10, hit = b(20, 20);
  const up = b(20, 10), down = b(20, 30), left = b(10, 20), right = b(30, 20), diag = b(30, 30), gap = b(40, 20), done = b(20, 10, 5);
  const all = [hit, up, down, left, right, diag, gap];
  crack(all, hit, P, 99);
  expect([hit, up, down, left, right].map(k => k.dead)).toEqual([99, 99, 99, 99, 99]);
  expect([diag.dead, gap.dead]).toEqual([0, 0]);
  crack([b(0, 0), done], b(20, 20), P, 7);
  expect(done.dead).toBe(5);   // an already broken brick keeps its own fade time
});
