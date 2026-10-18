import { existsSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { PROJECTS, FEATURED } from './projects';
import { SERVICES, FLOW, CATEGORIES } from './index';
import { TOOLS } from './tools';
import { SITE } from './site';
import stack from './stack.json';

describe('content the site can render (checked before every deploy)', () => {
  test('every project picture exists', () => {
    for (const p of PROJECTS) if (p.image) expect(existsSync('public' + p.image), `${p.title}: picture ${p.image} is missing from public/`).toBe(true);
  });
  test('every stack row points to a tool, and every logo file exists', () => {
    for (const s of stack.rows.flatMap(r => r.tools)) expect(TOOLS.has(s), `Stack row entry "${s}" has no matching tool. Open Stack rows and pick the tool again, or change the tool's Address back.`).toBe(true);
    for (const [name, t] of TOOLS) if (t.logo) expect(existsSync('public' + t.logo), `Tool "${name}": logo ${t.logo} is missing from public/`).toBe(true);
  });
  test('every filter a project or service uses is on the Project filters page', () => {
    const keys = new Set(CATEGORIES.map(c => c[0]));
    for (const p of PROJECTS) for (const c of p.cats) expect(keys.has(c), `Project "${p.title}" uses the filter "${c}", which is not on the Project filters page. Add the filter back or remove it from the project.`).toBe(true);
    for (const s of SERVICES) expect(keys.has(s.filter), `Service "${s.title}" uses the filter "${s.filter}", which is not on the Project filters page. Add the filter back or remove it from the service.`).toBe(true);
  });
  test('every big card has an intro and a picture or the n8n diagram', () => {
    for (const f of FEATURED) {
      expect(f.lede.length > 0 && (f.media.kind === 'flow' || !!f.media.src), `Big card "${f.title}" needs an intro and a picture (or the n8n diagram ticked).`).toBe(true);
      if (f.media.kind === 'img') expect(f.media.alt.length > 0, `Big card "${f.title}" needs a picture description for screen readers.`).toBe(true);
    }
  });
  test('the CV is a PDF that exists', () => {
    expect(/\.pdf$/i.test(SITE.cv) && existsSync('public' + SITE.cv), `The CV must be a PDF file (now ${SITE.cv}). Upload a PDF under Contact links and CV.`).toBe(true);
  });
  test('the n8n diagram has an approval step', () => {
    expect(FLOW.steps.some(s => s.gate)).toBe(true);
  });
});
