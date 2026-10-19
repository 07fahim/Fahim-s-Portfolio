import services from './services.json';
import flow from './flow.json';
import categories from './categories.json';
import timeline from './timeline.json';
import achievements from './achievements.json';

export type Service = { title: string; items: string[]; desc: string; filter: string };
export type Project = { slug: string; title: string; type: string; cats: string[]; desc: string; stack: string[]; repo: string; live: string; image: string; stock: boolean; kpi: string };
export type Media = { kind: 'img'; src: string; alt: string } | { kind: 'flow' };
export type Featured = { title: string; tags: string[]; lede: string; number: { value: string; label: string } | null; points: string[]; media: Media; live: string; repo: string; stack: string[] };
export type Flow = { label: string; steps: { text: string; gate: boolean }[] };
export type Entry = { now: boolean; date: string; role: string; org: string; where?: string; text: string; tags: string[]; more?: string };
export type Paper = { title: string; venue: string; year: number; author: number; topic: string; doi: string };
export type Course = { title: string; school: string; year: number; desc: string };

export const SERVICES = services.items as Service[];
export const FLOW = flow as Flow;
export const CATEGORIES: [string, string][] = [['all', 'All'], ...(categories as { items: { key: string; label: string }[] }).items.map(c => [c.key, c.label] as [string, string])];
export const TIMELINE = timeline.entries as Entry[];
export const PAPERS = achievements.papers as Paper[];
export const COURSES = achievements.courses as Course[];
