const DURATION = 1200;

// Pure: given the final text ("91–94%" or "98.1%") and progress 0–1, returns the in-between text.
// Keeps the "–" range (both ends count together) and the "%" suffix, and preserves the final
// value's decimal places so "98.1%" never shows more or fewer digits mid-count.
export function countValue(final: string, t: number): string {
  const m = final.match(/^(\d+(?:\.\d+)?)(?:–(\d+(?:\.\d+)?))?(%?)$/);
  if (!m) return final;
  const c = Math.min(1, Math.max(0, t));
  const decimals = (s: string) => (s.includes('.') ? s.split('.')[1].length : 0);
  const part = (s: string) => (+s * c).toFixed(decimals(s));
  return m[2] ? `${part(m[1])}–${part(m[2])}${m[3]}` : `${part(m[1])}${m[3]}`;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// Counts up every `.big-n .cnt` under `root` from 0 to its `data-final` value, once, the first
// time it's visible. The digits live in an aria-hidden span; an adjacent .sr-only span (rendered
// by the caller) keeps the accessible name at the final value throughout.
export function mountCountUp(root: HTMLElement): () => void {
  const ac = new AbortController();
  const els = [...root.querySelectorAll<HTMLElement>('.big-n .cnt')];
  if (!els.length) return () => ac.abort();

  const run = (el: HTMLElement) => {
    const final = el.dataset.final || el.textContent || '';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = final; return; }
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / DURATION);
      el.textContent = countValue(final, easeOut(t));
      if (t < 1 && !ac.signal.aborted) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target as HTMLElement); o.unobserve(e.target); } });
  }, { threshold: 0 });
  els.forEach(el => obs.observe(el));
  ac.signal.addEventListener('abort', () => obs.disconnect());
  return () => ac.abort();
}
