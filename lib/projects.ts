import type { Project } from '@/content';

export const inFilter = (p: Project, f: string, featured: Set<string>) => f === 'all' ? !featured.has(p.title) : p.cats.includes(f);

export function counts(grid: Project[], featured: Set<string>): Record<string, number> {
  const out: Record<string, number> = { all: 0 };
  for (const p of grid) { if (!featured.has(p.title)) out.all++; for (const c of p.cats) out[c] = (out[c] ?? 0) + 1; }
  return out;
}

export function visible(grid: Project[], featured: Set<string>, f: string, showAll: boolean, cap = 6): Project[] {
  const hits = grid.filter(p => inFilter(p, f, featured));
  return f === 'all' && !showAll ? hits.slice(0, cap) : hits;
}
