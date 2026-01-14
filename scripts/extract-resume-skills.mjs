import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
const parsePdf = pdfParseModule?.default ?? pdfParseModule;

const resumePath = process.argv[2] ?? path.resolve('public', 'resume.pdf');

const raw = await fs.readFile(resumePath);
const data = await parsePdf(raw);
const text = data.text
  .replace(/\r/g, '\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const lines = text
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean);

const headings = new Set([
  'skills',
  'technical skills',
  'key skills',
  'core competencies',
  'tools',
  'technologies',
]);

let startIndex = -1;
for (let i = 0; i < lines.length; i++) {
  const normalized = lines[i].toLowerCase().replace(/\s+/g, ' ');
  if (headings.has(normalized)) {
    startIndex = i + 1;
    break;
  }
}

const stopWords = new Set([
  'experience',
  'education',
  'projects',
  'publications',
  'certifications',
  'achievements',
  'summary',
  'objective',
  'contact',
]);

let chunk = [];
if (startIndex !== -1) {
  for (let i = startIndex; i < lines.length; i++) {
    const normalized = lines[i].toLowerCase().replace(/\s+/g, ' ');
    if (stopWords.has(normalized)) break;
    if (headings.has(normalized)) continue;
    chunk.push(lines[i]);
    if (chunk.length > 40) break;
  }
} else {
  chunk = lines.slice(0, 200);
}

const blob = chunk
  .join(' | ')
  .replace(/•/g, '|')
  .replace(/\s{2,}/g, ' ')
  .replace(/\|{2,}/g, '|');

const rawItems = blob
  .split(/[|,;/]+/g)
  .map((s) => s.trim())
  .filter(Boolean)
  .filter((s) => s.length <= 40);

const cleaned = rawItems
  .map((s) => s.replace(/^[-–—]\s*/, ''))
  .map((s) => s.replace(/\s*\([^)]*\)\s*$/g, (m) => (m.length <= 12 ? m : '')))
  .map((s) => s.replace(/\s+/g, ' '))
  .filter(Boolean);

const seen = new Set();
const unique = [];
for (const item of cleaned) {
  const key = item.toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  unique.push(item);
}

console.log(JSON.stringify({ resumePath, skills: unique }, null, 2));
