import { expect, test } from 'vitest';
import { counts, visible } from './projects';
import { PROJECTS, FEATURED, ordered } from '@/content/projects';

const grid = PROJECTS;
const featured = new Set(FEATURED.map(f => f.title));

test('project order: listed first, unknown or repeated slugs skipped, unlisted projects last by title', () => {
  const items = [{ slug: 'c', title: 'C' }, { slug: 'a', title: 'A' }, { slug: 'b', title: 'B' }, { slug: 'd', title: 'D' }];
  expect(ordered(items, ['b', 'gone', 'b', 'c']).map(p => p.slug)).toEqual(['b', 'c', 'a', 'd']);
});

test('filter counts', () => {
  expect(counts(grid, featured)).toEqual({ all: 15, rag: 4, auto: 2, docs: 3, cv: 4, data: 5, apps: 5 });
});
test('All shows six non-flagship cards until Show all', () => {
  expect(visible(grid, featured, 'all', false).map(p => p.title)).toEqual(['EmailCraft-AI', 'AI Fitness Coach', 'Local OCR & Dynamic RAG', 'Brain Tumor Detection', 'Mango Ripeness Classification', 'Bangladeshi Landmarks Recognizer']);
  expect(visible(grid, featured, 'all', true)).toHaveLength(15);
});
test('a service filter leads with its flagships', () => {
  expect(visible(grid, featured, 'docs', false).map(p => p.title)).toEqual(['Crosscheck', 'Legal Document AI', 'Local OCR & Dynamic RAG']);
  expect(visible(grid, featured, 'cv', false)[0].title).toBe('Driver Distraction Detection');
});
