// One-off: reads the content arrays out of the approved prototype and writes content/*.json.
// Run again only if the prototype changes; the JSON files are the build's content from then on.
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const src = await readFile('docs/prototype/sections-mock.html', 'utf8');

// the literal that follows `const NAME =`, found by bracket matching that skips strings
function literal(name) {
  const at = src.indexOf(`const ${name} = `);
  if (at < 0) throw new Error(`const ${name} not found`);
  let i = at + `const ${name} = `.length;
  const open = src[i];
  if (open === '`') { const end = src.indexOf('`', i + 1); return src.slice(i, end + 1); }
  let depth = 0, quote = null;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (quote) { if (c === '\\') j++; else if (c === quote) quote = null; continue; }
    if (c === "'" || c === '"' || c === '`') quote = c;
    else if ('[{('.includes(c)) depth++;
    else if (']})'.includes(c) && --depth === 0) return src.slice(i, j + 1);
  }
  throw new Error(`unterminated ${name}`);
}
const evaluate = (expr, scope = {}) => new Function(...Object.keys(scope), `return (${expr});`)(...Object.values(scope));

const STACK = evaluate(literal('STACK'));
const SERVICES = evaluate(literal('SERVICES')).map(([title, items, desc]) => ({ title, items, desc }));
const T = (name, src, svc, dk) => ({ name, src, ...(dk ? { dk } : {}) });
const GROUPS = evaluate(literal('GROUPS'), { T });
const TOOLS = Object.fromEntries(GROUPS.flatMap(g => g[3]).map(t => [t.name.toLowerCase(), t]));
const CATS = evaluate(literal('CATS'));
const P = evaluate(literal('P'));
const TYPE = evaluate(literal('TYPE'));
const FLOW_HTML = evaluate(literal('FLOW'));
const CARDS = evaluate(literal('CARDS'), { P, FLOW: FLOW_HTML });
const TL = evaluate(literal('TL'));
const PAPERS = evaluate(literal('PAPERS'));
const COURSES = evaluate(literal('COURSES'));

const projects = P.map(([title, cats, status, , kpi, desc, stack, live, repo, img, stock]) => {   // result (index 3) belongs to the unused list design
  const [icon, type] = TYPE[title];
  return { title, cats, status, kpi, desc, stack, live, repo, img, stock, icon, type };
});
const featuredIdx = [19, 14, 0, 4, 5];   // the stacked cards' order (prototype line with GRID)
const gridOrder = [...featuredIdx.map(i => P[i][0]), ...P.filter((_, i) => !featuredIdx.includes(i)).map(p => p[0])];
const media = m => m === FLOW_HTML ? { kind: 'flow' } : { kind: 'img', src: '/' + /src="([^"]+)"/.exec(m)[1], alt: /alt="([^"]*)"/.exec(m)[1] };
const featured = CARDS.map(([title, tags, lede, num, points, m, live, repo, stack]) =>
  ({ title, tags, lede, number: num ? { value: num[0], label: num[1] } : null, points, media: media(m), live, repo, stack }));
const flow = { label: /<small>([^<]+)<\/small>/.exec(FLOW_HTML)[1], steps: [...FLOW_HTML.matchAll(/<span( class="gate")?>([^<]+)<\/span>/g)].map(m => ({ text: m[2], gate: !!m[1] })) };
const timeline = TL.map(e => { const { yr, ...rest } = e; void yr; return rest; });   // yr belonged to the unused T3 design
const papers = PAPERS.map(([title, venue, year, author, topic, doi]) => ({ title, venue, year, author, topic, doi }));
const courses = COURSES.map(([title, school, year, desc]) => ({ title, school, year, desc }));

await mkdir('content', { recursive: true });
const files = { stack: STACK, tools: TOOLS, services: SERVICES, projects, featured, flow, categories: CATS, timeline, papers, courses, grid: gridOrder };
for (const [name, data] of Object.entries(files)) await writeFile(`content/${name}.json`, JSON.stringify(data, null, 2) + '\n');
console.log('wrote', Object.keys(files).map(n => `content/${n}.json`).join(', '));
