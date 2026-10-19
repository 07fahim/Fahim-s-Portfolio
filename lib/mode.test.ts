import { expect, test, afterEach, vi } from 'vitest';
import { settingFrom, resolve, setSetting, currentSetting, syncTheme, MODE_SCRIPT } from './mode';

test('a saved setting wins; nothing saved or a corrupt value opens light (user, 2026-10-18)', () => {
  expect(settingFrom('dark')).toBe('dark');
  expect(settingFrom('system')).toBe('system');
  expect(settingFrom('light')).toBe('light');
  expect(settingFrom(null)).toBe('light');
  expect(settingFrom('blue')).toBe('light');
});
test('system follows the device; light and dark ignore it', () => {
  expect(resolve('system', true)).toBe('light');
  expect(resolve('system', false)).toBe('dark');
  expect(resolve('light', false)).toBe('light');
  expect(resolve('dark', true)).toBe('dark');
});

// MODE_SCRIPT is a duplicated string injected as a pre-paint <script>; production never calls
// settingFrom()/resolve() before paint. Run it directly against stubs so the code that actually executes is covered.
function runModeScript(opts: { saved?: string | null; throws?: boolean; systemLight: boolean }) {
  const dataset: Record<string, string> = {};
  const metas = [{ content: '' }, { content: '' }];
  const localStorage = {
    getItem: () => {
      if (opts.throws) throw new Error('blocked');
      return opts.saved ?? null;
    },
  };
  const matchMedia = (q: string) => ({ matches: q.includes('light') ? opts.systemLight : false });
  const document = {
    documentElement: { dataset },
    querySelectorAll: () => metas.map(m => ({ setAttribute: (_: string, v: string) => { m.content = v; } })),
  };
  const fn = new Function('localStorage', 'matchMedia', 'document', MODE_SCRIPT);
  fn(localStorage, matchMedia, document);
  return { dataset, metaColor: metas[0].content };
}

test('MODE_SCRIPT: nothing saved opens light, even on a dark device', () => {
  const { dataset, metaColor } = runModeScript({ saved: null, systemLight: false });
  expect(dataset.mode).toBe('light');
  expect(metaColor).toBe('#F3F4F4');
});
test('MODE_SCRIPT: saved dark stays dark on a light device', () => {
  const { dataset, metaColor } = runModeScript({ saved: 'dark', systemLight: true });
  expect(dataset.mode).toBeUndefined();
  expect(metaColor).toBe('#141617');
});
test('MODE_SCRIPT: saved system follows the device', () => {
  expect(runModeScript({ saved: 'system', systemLight: false }).dataset.mode).toBeUndefined();
  expect(runModeScript({ saved: 'system', systemLight: true }).dataset.mode).toBe('light');
});
test('MODE_SCRIPT: a corrupt value or blocked storage opens light', () => {
  expect(runModeScript({ saved: 'blue', systemLight: false }).dataset.mode).toBe('light');
  expect(runModeScript({ throws: true, systemLight: false }).dataset.mode).toBe('light');
});

// setSetting is DOM-side-effect code; there's no jsdom here (vitest env is node), so stub just
// enough of document/window/localStorage/matchMedia to observe what it does.
afterEach(() => {
  for (const k of ['document', 'window', 'localStorage', 'CustomEvent', 'matchMedia', 'addEventListener', 'removeEventListener']) delete (globalThis as Record<string, unknown>)[k];
});

function stubDom(systemLight: boolean) {
  const dataset: Record<string, string> = { mode: 'light' };   // a first visit: MODE_SCRIPT opened light
  const metas = [{ content: '' }];
  const saved: string[] = [];
  const events: string[] = [];
  const g = globalThis as Record<string, unknown>;
  g.document = {
    documentElement: { dataset },
    querySelectorAll: () => ({ forEach: (cb: (m: { setAttribute: (k: string, v: string) => void }) => void) => metas.forEach(m => cb({ setAttribute: (_: string, v: string) => { m.content = v; } })) }),
  };
  g.localStorage = { setItem: (_: string, v: string) => saved.push(v), getItem: () => null };
  g.matchMedia = (q: string) => ({ matches: q.includes('light') ? systemLight : false });
  g.CustomEvent = class { constructor(public type: string, public init?: unknown) {} };
  g.window = { dispatchEvent: (e: { type: string }) => events.push(e.type) };
  return { dataset, metas, saved, events };
}

test('setSetting applies the mode, saves the setting and only announces a real mode change', () => {
  const { dataset, metas, saved, events } = stubDom(false);
  setSetting('dark');
  expect(dataset.mode).toBeUndefined();
  expect(metas[0].content).toBe('#141617');
  setSetting('system');   // dark device: still dark, so the engines needn't regrade
  expect(currentSetting()).toBe('system');
  expect(saved).toEqual(['dark', 'system']);
  expect(events.filter(e => e === 'modechange')).toHaveLength(1);
  expect(events.filter(e => e === 'themesetting')).toHaveLength(2);
  setSetting('light');
  expect(dataset.mode).toBe('light');
  expect(metas[0].content).toBe('#F3F4F4');
  expect(events.filter(e => e === 'modechange')).toHaveLength(2);
});

test('a saved setting is read back on first use; blocked storage opens light', async () => {
  const g = globalThis as Record<string, unknown>;
  vi.resetModules();
  g.localStorage = { getItem: () => 'system' };
  expect((await import('./mode')).currentSetting()).toBe('system');
  vi.resetModules();
  g.localStorage = { getItem: () => { throw new Error('blocked'); } };
  expect((await import('./mode')).currentSetting()).toBe('light');
});

function stubListeners() {
  const on: Record<string, (e: { key: string | null; newValue: string | null }) => void> = {};
  const removed: string[] = [];
  const g = globalThis as Record<string, unknown>;
  g.addEventListener = (type: string, cb: (e: { key: string | null; newValue: string | null }) => void) => { on[type] = cb; };
  g.removeEventListener = (type: string) => removed.push(type);
  return { on, removed };
}

test('a theme picked in another tab is applied here too; a cleared storage means light', () => {
  const { dataset, events } = stubDom(false);
  const { on, removed } = stubListeners();
  (globalThis as Record<string, unknown>).matchMedia = () => ({ matches: false, addEventListener: () => {}, removeEventListener: (t: string) => removed.push('media ' + t) });
  setSetting('light');
  const stop = syncTheme();
  const before = events.filter(e => e === 'modechange').length;
  on.storage({ key: 'mode', newValue: 'dark' });
  expect(currentSetting()).toBe('dark');
  expect(dataset.mode).toBeUndefined();
  expect(events.filter(e => e === 'modechange')).toHaveLength(before + 1);   // the engines regrade
  expect(events.at(-1)).toBe('themesetting');
  on.storage({ key: 'other', newValue: 'light' });   // other keys are ignored
  expect(currentSetting()).toBe('dark');
  on.storage({ key: null, newValue: null });   // localStorage.clear() in another tab
  expect(currentSetting()).toBe('light');
  stop();
  expect(removed.sort()).toEqual(['media change', 'storage']);
});

test('a theme changed before this tab finished loading is applied when the switch mounts', async () => {
  vi.resetModules();
  const { dataset } = stubDom(false);   // the pre-paint script showed light
  stubListeners();
  const g = globalThis as Record<string, unknown>;
  g.localStorage = { getItem: () => 'dark', setItem: () => {} };   // another tab saved dark before we hydrated
  g.matchMedia = () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} });
  const m = await import('./mode');
  m.syncTheme();
  expect(m.currentSetting()).toBe('dark');
  expect(dataset.mode).toBeUndefined();
});
