import { expect, test } from 'vitest';
import { bigFirst, counts, visible } from './projects';
import { ordered } from '@/content/projects';

test('project order: listed first, unknown or repeated slugs skipped, unlisted projects last by title', () => {
  const items = [{ slug: 'c', title: 'C' }, { slug: 'a', title: 'A' }, { slug: 'b', title: 'B' }, { slug: 'd', title: 'D' }];
  expect(ordered(items, ['b', 'gone', 'b', 'c']).map(p => p.slug)).toEqual(['b', 'c', 'a', 'd']);
});

const grid = [
  { title: 'Big docs', cats: ['docs'] },
  { title: 'Big cv', cats: ['cv'] },
  { title: 'One', cats: ['docs', 'rag'] },
  { title: 'Two', cats: ['cv'] },
  { title: 'Three', cats: ['rag'] },
];
const featured = new Set(['Big docs', 'Big cv']);

test('filter counts: All leaves out the big cards, each filter counts them', () => {
  expect(counts(grid, featured)).toEqual({ all: 3, docs: 2, cv: 2, rag: 2 });
});
test('All shows the first cards up to the cap until Show all, without the big cards', () => {
  expect(visible(grid, featured, 'all', false, 2).map(p => p.title)).toEqual(['One', 'Two']);
  expect(visible(grid, featured, 'all', true, 2).map(p => p.title)).toEqual(['One', 'Two', 'Three']);
});
test('visible() keeps the order it is given (ProjectGrid puts big cards first)', () => {
  expect(visible(grid, featured, 'docs', false).map(p => p.title)).toEqual(['Big docs', 'One']);
  expect(visible([grid[2], grid[0]], featured, 'docs', false).map(p => p.title)).toEqual(['One', 'Big docs']);   // it does not reorder
});

test('big cards lead every filter wherever they sit in Project order (user, 2026-10-18)', () => {
  const order = [{ title: 'One', cats: ['docs'] }, { title: 'Big', cats: ['docs'] }, { title: 'Two', cats: ['cv'] }];
  expect(bigFirst(order, new Set(['Big'])).map(p => p.title)).toEqual(['Big', 'One', 'Two']);
});
