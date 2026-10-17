import { entries } from './entries';
import type { Featured, Project } from './index';
import work from './work.json';

type Card = { tags: string[]; lede?: string; number: { value?: string; label?: string }; points: string[]; stack: string[]; diagram: boolean; alt?: string };
type File = Omit<Project, 'slug' | 'live' | 'image' | 'kpi'> & { live?: string; image?: string; kpi?: string; featured: boolean; card: Card };

// Order from the admin's Project order list: a slug it doesn't know (or a repeat) is skipped, and a project missing from it goes last by title, so a forgotten list never hides work.
export function ordered<T extends { slug: string; title: string }>(items: T[], order: string[]): T[] {
  const bySlug = new Map(items.map(p => [p.slug, p]));
  const listed = [...new Set(order)].flatMap(s => bySlug.get(s) ?? []);
  return [...listed, ...items.filter(p => !listed.includes(p)).sort((a, b) => a.title.localeCompare(b.title))];
}

// Server only: read at build time, one file per project (the admin writes them).
const files = ordered(entries<File>('projects'), (work as { order: string[] }).order);

export const PROJECTS: Project[] = files.map(p => ({
  slug: p.slug, title: p.title, type: p.type, cats: p.cats, desc: p.desc, stack: p.stack, repo: p.repo,
  live: p.live ?? '', image: p.image ?? '', stock: p.stock, kpi: p.kpi ?? '', icon: p.icon,
}));
export const FEATURED: Featured[] = files.filter(p => p.featured).map(({ card: c, ...p }) => ({
  title: p.title, tags: c.tags, lede: c.lede ?? '', points: c.points, stack: c.stack,
  number: c.number.value ? { value: c.number.value, label: c.number.label ?? '' } : null,
  live: p.live ?? '', repo: p.repo,
  media: c.diagram ? { kind: 'flow' as const } : { kind: 'img' as const, src: p.image ?? '', alt: c.alt ?? '' },
}));
