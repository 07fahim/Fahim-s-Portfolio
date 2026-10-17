export type Mode = 'dark' | 'light';
const KEY = 'mode';
const THEME_COLOR = { light: '#F3F4F4', dark: '#141617' } as const;

export function initialMode(saved: string | null, prefersLight: boolean): Mode {
  return saved === 'light' || saved === 'dark' ? saved : prefersLight ? 'light' : 'dark';
}

// runs before first paint so the page never flashes the other mode; storage can be blocked.
// Also sets the theme-color meta tags for a saved choice, so a saved light mode on a dark
// system gets the light bar before paint.
export const MODE_SCRIPT = `(function(){var s=null;try{s=localStorage.getItem('${KEY}')}catch(e){}var m=s==='light'||s==='dark'?s:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');if(m==='light')document.documentElement.dataset.mode='light';var c=m==='light'?'${THEME_COLOR.light}':'${THEME_COLOR.dark}';var ms=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<ms.length;i++)ms[i].setAttribute('content',c)})()`;

export function currentMode(): Mode {
  return document.documentElement.dataset.mode === 'light' ? 'light' : 'dark';
}

export function setMode(m: Mode): void {
  const d = document.documentElement;
  if (m === 'light') d.dataset.mode = 'light'; else delete d.dataset.mode;
  try { localStorage.setItem(KEY, m); } catch { /* storage blocked: the switch still works for this visit */ }
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => meta.setAttribute('content', THEME_COLOR[m]));
  window.dispatchEvent(new CustomEvent<Mode>('modechange', { detail: m }));
}
