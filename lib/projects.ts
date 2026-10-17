// Generic over anything shaped like a project's title+cats, so the client filter island can pass
// a slim serialisable slice instead of the full Project (desc, stack, media, ...).
type Catted = { title: string; cats: string[] };

export const inFilter = <T extends Catted>(p: T, f: string, featured: Set<string>) => f === 'all' ? !featured.has(p.title) : p.cats.includes(f);

export function counts<T extends Catted>(grid: T[], featured: Set<string>): Record<string, number> {
  const out: Record<string, number> = { all: 0 };
  for (const p of grid) { if (!featured.has(p.title)) out.all++; for (const c of p.cats) out[c] = (out[c] ?? 0) + 1; }
  return out;
}

export function visible<T extends Catted>(grid: T[], featured: Set<string>, f: string, showAll: boolean, cap = 6): T[] {
  const hits = grid.filter(p => inFilter(p, f, featured));
  return f === 'all' && !showAll ? hits.slice(0, cap) : hits;
}
