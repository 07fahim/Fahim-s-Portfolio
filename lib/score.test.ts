import { expect, test } from 'vitest';
import { better, fmtTime, livesText, loadBest, saveBest, shareText } from './score';

test('times show as m:ss, floored, never negative', () => {
  expect(fmtTime(7.9)).toBe('0:07');
  expect(fmtTime(102)).toBe('1:42');
  expect(fmtTime(725)).toBe('12:05');
  expect(fmtTime(-3)).toBe('0:00');
});
test('lives left reads naturally', () => {
  expect(livesText(1)).toBe('1 life left');
  expect(livesText(3)).toBe('3 lives left');
});
test('a faster time wins, a tie goes to more lives, anything beats no best', () => {
  expect(better({ time: 90, lives: 1 }, { time: 100, lives: 3 })).toBe(true);
  expect(better({ time: 100, lives: 3 }, { time: 100, lives: 2 })).toBe(true);
  expect(better({ time: 100, lives: 2 }, { time: 100, lives: 2 })).toBe(false);
  expect(better({ time: 101, lives: 3 }, { time: 100, lives: 1 })).toBe(false);
  expect(better({ time: 300, lives: 1 }, null)).toBe(true);
});
test('the share line has the time, the lives and the link, with no comma', () => {
  const s = shareText({ time: 102, lives: 2 });
  expect(s).toBe('I cleared HELLO WORLD in 1:42 with 2 lives left. Can you beat it? https://fahimfaiyaz.dev/#game');
  expect(s.includes(',')).toBe(false);
});
test('the best round-trips through storage; bad or blocked storage gives no best', () => {
  const m = new Map<string, string>();
  const store = { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
  expect(loadBest(store)).toBe(null);
  saveBest({ time: 102, lives: 2 }, store);
  expect(loadBest(store)).toEqual({ time: 102, lives: 2 });
  m.set('hw-best', '{"time":"x","lives":2}'); expect(loadBest(store)).toBe(null);
  m.set('hw-best', 'not json'); expect(loadBest(store)).toBe(null);
  const blocked = { getItem: (): string | null => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
  expect(loadBest(blocked)).toBe(null);
  expect(() => saveBest({ time: 1, lives: 1 }, blocked)).not.toThrow();
});
