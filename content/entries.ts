import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Server only: a Keystatic collection is one JSON file per entry, named by its slug.
export function entries<T>(folder: string): ({ slug: string } & T)[] {
  const dir = join(process.cwd(), 'content', folder);
  return readdirSync(dir).filter(f => f.endsWith('.json')).map(f => ({ slug: f.slice(0, -5), ...(JSON.parse(readFileSync(join(dir, f), 'utf8')) as T) }));
}
