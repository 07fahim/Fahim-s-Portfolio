import services from './services.json';
import projects from './projects.json';
import featured from './featured.json';
import flow from './flow.json';
import categories from './categories.json';
import timeline from './timeline.json';
import achievements from './achievements.json';
import grid from './grid.json';

export type Service = { title: string; items: string[]; desc: string; filter: string };
export type Project = { title: string; cats: string[]; status: string; kpi: string; desc: string; stack: string[]; live: string; repo: string; img: string; stock: string; icon: string; type: string };
export type Media = { kind: 'img'; src: string; alt: string } | { kind: 'flow' };
export type Featured = { title: string; tags: string[]; lede: string; number: { value: string; label: string } | null; points: string[]; media: Media; live: string; repo: string; stack: string[] };
export type Flow = { label: string; steps: { text: string; gate: boolean }[] };
export type Entry = { now: boolean; date: string; role: string; org: string; where?: string; text: string; tags: string[]; more?: string };
export type Paper = { title: string; venue: string; year: number; author: number; topic: string; doi: string };
export type Course = { title: string; school: string; year: number; desc: string };

export const SERVICES = services.items as Service[];
export const PROJECTS = projects as Project[];
export const GRID_ORDER = grid as string[];
export const FEATURED = featured as Featured[];
export const FLOW = flow as Flow;
export const CATEGORIES: [string, string][] = [['all', 'All'], ...categories.items.map(c => [c.key, c.label] as [string, string])];
export const TIMELINE = timeline.entries as Entry[];
export const PAPERS = achievements.papers as Paper[];
export const COURSES = achievements.courses as Course[];
