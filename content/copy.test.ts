import { describe, expect, test } from 'vitest';
import { PROJECTS, FEATURED } from './projects';
import { SERVICES, TIMELINE, COURSES } from './index';

describe('writing guideline (not a deploy gate): at most one comma per sentence', () => {
  test('copy rule: at most one comma per sentence', () => {
    const strings: string[] = [];
    const walk = (v: unknown) => { if (typeof v === 'string') strings.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
    walk([SERVICES, PROJECTS, FEATURED, TIMELINE, COURSES]);
    for (const s of strings) for (const sentence of s.split(/(?<=[.?!])\s+/)) expect((sentence.match(/, /g) ?? []).length, sentence).toBeLessThanOrEqual(1);
  });
});
