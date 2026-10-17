import { expect, test, afterEach } from 'vitest';
import { initialMode, setMode, MODE_SCRIPT } from './mode';

test('a saved choice wins over the system setting', () => {
  expect(initialMode('light', false)).toBe('light');
  expect(initialMode('dark', true)).toBe('dark');
});
test('no saved choice follows the system setting', () => {
  expect(initialMode(null, true)).toBe('light');
  expect(initialMode(null, false)).toBe('dark');
});
test('a corrupt saved value is ignored', () => expect(initialMode('blue', true)).toBe('light'));

// MODE_SCRIPT is a duplicated string injected as a pre-paint <script>; production never calls
// initialMode(). Run it directly against stubs so the code that actually executes is covered.
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

test('MODE_SCRIPT: saved light gives light', () => {
  const { dataset, metaColor } = runModeScript({ saved: 'light', systemLight: false });
  expect(dataset.mode).toBe('light');
  expect(metaColor).toBe('#F3F4F4');
});
test('MODE_SCRIPT: saved dark with system light gives dark', () => {
  const { dataset, metaColor } = runModeScript({ saved: 'dark', systemLight: true });
  expect(dataset.mode).toBeUndefined();
  expect(metaColor).toBe('#141617');
});
test('MODE_SCRIPT: nothing saved with system light gives light', () => {
  const { dataset, metaColor } = runModeScript({ saved: null, systemLight: true });
  expect(dataset.mode).toBe('light');
  expect(metaColor).toBe('#F3F4F4');
});
test('MODE_SCRIPT: corrupt value with system dark gives dark', () => {
  const { dataset, metaColor } = runModeScript({ saved: 'blue', systemLight: false });
  expect(dataset.mode).toBeUndefined();
  expect(metaColor).toBe('#141617');
});
test('MODE_SCRIPT: storage that throws falls back to the system setting', () => {
  const { dataset, metaColor } = runModeScript({ throws: true, systemLight: true });
  expect(dataset.mode).toBe('light');
  expect(metaColor).toBe('#F3F4F4');
});

// setMode is pure DOM-side-effect code; there's no jsdom here (vitest env is node), so stub just
// enough of document/window/localStorage to observe the meta-tag update.
afterEach(() => {
  delete (globalThis as Record<string, unknown>).document;
  delete (globalThis as Record<string, unknown>).window;
  delete (globalThis as Record<string, unknown>).localStorage;
  delete (globalThis as Record<string, unknown>).CustomEvent;
});

test('setMode sets theme-color meta content for the chosen mode', () => {
  const dataset: Record<string, string> = {};
  const metas = [{ content: '' }];
  (globalThis as Record<string, unknown>).document = {
    documentElement: { dataset },
    querySelectorAll: () => ({ forEach: (cb: (m: { setAttribute: (k: string, v: string) => void }) => void) => metas.forEach(m => cb({ setAttribute: (_: string, v: string) => { m.content = v; } })) }),
  };
  (globalThis as Record<string, unknown>).localStorage = { setItem: () => {} };
  (globalThis as Record<string, unknown>).CustomEvent = class { constructor(public type: string, public init?: unknown) {} };
  (globalThis as Record<string, unknown>).window = { dispatchEvent: () => {} };

  setMode('light');
  expect(metas[0].content).toBe('#F3F4F4');

  setMode('dark');
  expect(metas[0].content).toBe('#141617');
});
