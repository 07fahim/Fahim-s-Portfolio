export type Mode = 'dark' | 'light';
export type Setting = Mode | 'system';
const KEY = 'mode';
const THEME_COLOR = { light: '#F3F4F4', dark: '#141617' } as const;
const LIGHT_QUERY = '(prefers-color-scheme: light)';

// A first visit opens light; "system" follows the device (user, 2026-10-18).
export const settingFrom = (saved: string | null): Setting => (saved === 'dark' || saved === 'system' ? saved : 'light');
export const resolve = (s: Setting, prefersLight: boolean): Mode => (s === 'system' ? (prefersLight ? 'light' : 'dark') : s);
export const NEXT: Record<Setting, Setting> = { light: 'dark', dark: 'system', system: 'light' };

// runs before first paint so the page never flashes the other mode; storage can be blocked.
// Also sets the theme-color meta tags, so the browser bar matches before paint.
export const MODE_SCRIPT = `(function(){var s=null;try{s=localStorage.getItem('${KEY}')}catch(e){}var m=s==='dark'?'dark':s==='system'?(matchMedia('${LIGHT_QUERY}').matches?'light':'dark'):'light';if(m==='light')document.documentElement.dataset.mode='light';var c=m==='light'?'${THEME_COLOR.light}':'${THEME_COLOR.dark}';var ms=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<ms.length;i++)ms[i].setAttribute('content',c)})()`;

export function currentMode(): Mode {
  return document.documentElement.dataset.mode === 'light' ? 'light' : 'dark';
}

// The chosen setting lives here as well as in storage, so the switch still cycles when storage is blocked.
let setting: Setting | null = null;
export function currentSetting(): Setting {
  if (!setting) { let saved = null; try { saved = localStorage.getItem(KEY); } catch { /* blocked */ } setting = settingFrom(saved); }
  return setting;
}

function apply(): void {
  const m = resolve(currentSetting(), matchMedia(LIGHT_QUERY).matches);
  const changed = m !== currentMode();
  const d = document.documentElement;
  if (m === 'light') d.dataset.mode = 'light'; else delete d.dataset.mode;
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => meta.setAttribute('content', THEME_COLOR[m]));
  if (changed) window.dispatchEvent(new CustomEvent<Mode>('modechange', { detail: m }));   // the engines regrade only on a real change
}

export function setSetting(s: Setting): void {
  setting = s;
  try { localStorage.setItem(KEY, s); } catch { /* storage blocked: the switch still works for this visit */ }
  apply();
  window.dispatchEvent(new CustomEvent<Setting>('themesetting', { detail: s }));
}

// While "system" is chosen, follow the device when it switches (e.g. at sunset). Returns the cleanup.
export function followSystem(): () => void {
  const q = matchMedia(LIGHT_QUERY);
  const on = () => { if (currentSetting() === 'system') apply(); };
  q.addEventListener('change', on);
  return () => q.removeEventListener('change', on);
}
