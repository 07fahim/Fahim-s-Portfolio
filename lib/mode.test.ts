import { expect, test } from 'vitest';
import { initialMode } from './mode';

test('a saved choice wins over the system setting', () => {
  expect(initialMode('light', false)).toBe('light');
  expect(initialMode('dark', true)).toBe('dark');
});
test('no saved choice follows the system setting', () => {
  expect(initialMode(null, true)).toBe('light');
  expect(initialMode(null, false)).toBe('dark');
});
test('a corrupt saved value is ignored', () => expect(initialMode('blue', true)).toBe('light'));
