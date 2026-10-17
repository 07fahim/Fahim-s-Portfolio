import { readFileSync } from 'node:fs';
import { createReader } from '@keystatic/core/reader';
import { expect, test } from 'vitest';
import config from '@/keystatic.config';
import { prune } from '@/lib/prune';
import { segments } from './bio';

const reader = createReader(process.cwd(), config);
const raw = (file: string) => JSON.parse(readFileSync(file, 'utf8'));

// The reader parses each file through the admin's schema and throws on a key the schema lacks (a key a save would drop).
test('every singleton file opens in the admin without losing a key', async () => {
  const singletons = reader.singletons as Record<string, { readOrThrow(): Promise<unknown> }>;
  for (const [key, s] of Object.entries(config.singletons ?? {})) expect(prune(await singletons[key].readOrThrow()), key).toEqual(prune(raw(`${s.path}.json`)));
});
test('every collection file opens in the admin without losing a key', async () => {
  const collections = reader.collections as Record<string, { all(): Promise<{ slug: string; entry: unknown }[]> }>;
  for (const [key, c] of Object.entries(config.collections ?? {}))
    for (const { slug, entry } of await collections[key].all()) expect(prune(entry), `${key}/${slug}`).toEqual(prune(raw(`${c.path!.replace('*', slug)}.json`)));
});
test('**double stars** mark the bold words', () => {
  expect(segments('Hey, I’m **Fahim**. A **B** c')).toEqual(['Hey, I’m ', { b: 'Fahim' }, '. A ', { b: 'B' }, ' c']);
  expect(segments('**Bold** start')).toEqual([{ b: 'Bold' }, ' start']);
});
