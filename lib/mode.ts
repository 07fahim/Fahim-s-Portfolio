export type Mode = 'dark' | 'light';
const KEY = 'mode';

export function initialMode(saved: string | null, prefersLight: boolean): Mode {
  return saved === 'light' || saved === 'dark' ? saved : prefersLight ? 'light' : 'dark';
}

// runs before first paint so the page never flashes the other mode; storage can be blocked
export const MODE_SCRIPT = `(function(){var s=null;try{s=localStorage.getItem('${KEY}')}catch(e){}var m=s==='light'||s==='dark'?s:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');if(m==='light')document.documentElement.dataset.mode='light'})()`;

export function currentMode(): Mode {
  return document.documentElement.dataset.mode === 'light' ? 'light' : 'dark';
}

export function setMode(m: Mode): void {
  const d = document.documentElement;
  if (m === 'light') d.dataset.mode = 'light'; else delete d.dataset.mode;
  try { localStorage.setItem(KEY, m); } catch { /* storage blocked: the switch still works for this visit */ }
  window.dispatchEvent(new CustomEvent<Mode>('modechange', { detail: m }));
}
