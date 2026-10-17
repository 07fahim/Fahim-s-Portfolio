import data from './bio.json';

export type Segment = string | { b: string };
// The admin marks bold words with **double stars**; the odd pieces of a split on ** are the bold ones.
export const segments = (text: string): Segment[] => text.split('**').map((s, i) => (i % 2 ? { b: s } : s)).filter(s => s !== '');
export const BIO: Segment[][] = data.paragraphs.map(segments);
