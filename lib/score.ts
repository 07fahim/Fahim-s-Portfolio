// HELLO WORLD game rules (user, 2026-10-19): the clear time, lives left and the personal best,
// kept only in the visitor's own browser.
export type Result = { time: number; lives: number };
const KEY = 'hw-best';

export const fmtTime = (s: number) => { const t = Math.max(0, Math.floor(s)); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`; };
export const livesText = (n: number) => `${n} ${n === 1 ? 'life' : 'lives'} left`;
export const better = (a: Result, b: Result | null) => !b || a.time < b.time || (a.time === b.time && a.lives > b.lives);
export const shareText = (r: Result) => `I cleared HELLO WORLD in ${fmtTime(r.time)} with ${livesText(r.lives)}. Can you beat it? https://fahimfaiyaz.dev/#game`;

export function loadBest(store?: Pick<Storage, 'getItem'>): Result | null {
  try {
    const v = JSON.parse((store ?? localStorage).getItem(KEY) ?? 'null');
    return v && Number.isFinite(v.time) && v.time >= 0 && Number.isInteger(v.lives) ? { time: v.time, lives: v.lives } : null;
  } catch { return null; }   // storage blocked or junk: no best
}
export function saveBest(r: Result, store?: Pick<Storage, 'setItem'>) {
  try { (store ?? localStorage).setItem(KEY, JSON.stringify(r)); } catch { /* storage blocked: the game still works */ }
}
