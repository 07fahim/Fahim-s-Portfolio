import { expect, test } from 'vitest';
import { splitWords } from './words';

test('splits into words and the spaces between them, losing nothing', () => {
  const t = 'Hey, I’m  Fahim.';
  expect(splitWords(t)).toEqual(['Hey,', ' ', 'I’m', '  ', 'Fahim.']);
  expect(splitWords(t).join('')).toBe(t);
});
test('keeps a leading space and a non-breaking hyphen word', () => {
  expect(splitWords(' real‑world use')).toEqual([' ', 'real‑world', ' ', 'use']);
});
