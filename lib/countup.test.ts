import { expect, test } from 'vitest';
import { countValue } from './countup';

test('a range counts both ends together, from 0 to the final value', () => {
  expect(countValue('91–94%', 0)).toBe('0–0%');
  expect(countValue('91–94%', 1)).toBe('91–94%');
  expect(countValue('91–94%', 0.5)).toBe('46–47%');
});
test('a decimal final value keeps its decimal place throughout', () => {
  expect(countValue('98.1%', 0)).toBe('0.0%');
  expect(countValue('98.1%', 1)).toBe('98.1%');
  expect(countValue('98.1%', 0.5)).toBe('49.0%');
});
test('progress is clamped to 0–1', () => {
  expect(countValue('98.1%', -1)).toBe('0.0%');
  expect(countValue('98.1%', 2)).toBe('98.1%');
});
test('a value with no % or range is returned unchanged if it does not match the pattern', () => {
  expect(countValue('n/a', 0.5)).toBe('n/a');
});
