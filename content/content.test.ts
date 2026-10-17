import { describe, expect, test } from 'vitest';
import { STACK, TOOLS, SERVICES, PROJECTS, GRID_ORDER, FEATURED, FLOW, CATEGORIES, TIMELINE, PAPERS, COURSES } from './index';

describe('content extracted from the prototype', () => {
  test('counts match the approved page', () => {
    expect(STACK.map(r => r.length)).toEqual([10, 13, 13, 10]);
    expect(SERVICES.map(s => s.title)).toEqual(['AI agents & RAG chatbots', 'Automation workflows', 'Document processing & OCR', 'Computer vision & ML']);
    expect(PROJECTS).toHaveLength(20);
    expect(FEATURED.map(f => f.title)).toEqual(['Crosscheck', 'BashaBook', 'Legal Document AI', 'AI social media automation', 'Driver Distraction Detection']);
    expect(GRID_ORDER.slice(0, 5)).toEqual(['Crosscheck', 'BashaBook', 'Legal Document AI', 'AI social media automation', 'Driver Distraction Detection']);
    expect(GRID_ORDER).toHaveLength(20);
    expect(CATEGORIES.map(c => c[0])).toEqual(['all', 'rag', 'auto', 'docs', 'cv', 'data', 'apps']);
    expect(TIMELINE).toHaveLength(5);
    expect(PAPERS).toHaveLength(6);
    expect(PAPERS.filter(p => p.author === 1)).toHaveLength(3);
    expect(COURSES).toHaveLength(2);
    expect(FLOW.steps.some(s => s.gate)).toBe(true);
  });
  test('every stack pill has a logo, icon or letters', () => {
    for (const name of STACK.flat()) expect(TOOLS[name.toLowerCase()], name).toBeDefined();
  });
  test('the social automation card makes no live-publishing claim', () => {
    const s = FEATURED.find(f => f.title === 'AI social media automation')!;
    expect(s.points).toContain('Publish step for Facebook and Instagram, tested on mock endpoints');
  });
  test('copy rule: at most one comma per sentence', () => {
    const strings: string[] = [];
    const walk = (v: unknown) => { if (typeof v === 'string') strings.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
    walk([SERVICES, PROJECTS, FEATURED, TIMELINE, COURSES]);
    for (const s of strings) for (const sentence of s.split(/(?<=[.?!])\s+/)) expect((sentence.match(/, /g) ?? []).length, sentence).toBeLessThanOrEqual(1);
  });
});
