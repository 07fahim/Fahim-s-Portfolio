'use client';
import { useEffect } from 'react';
import { mountCountUp } from '@/lib/countup';
import { computePins } from '@/lib/pins';

export default function PinnedCardsEffects() {
  useEffect(() => {
    const root = document.getElementById('pins')!;
    const cs = [...root.querySelectorAll<HTMLElement>('.pinc')];
    // a #hash link aims before fit() runs, and fit() can still grow the page (every card is raised to the tallest one):
    // re-aim at the hash's section whenever it does. Only for a followed link (not a reload or back/forward, which restore
    // the visitor's own place), never once the visitor has scrolled (data-moved, set pre-paint by MOVED_SCRIPT), and only for 5 s.
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    let aim = nav?.type === 'navigate' && location.hash ? document.getElementById(location.hash.slice(1)) : null;
    const aimTimer = setTimeout(() => { aim = null; }, 5000);
    const fit = () => {
      const was = document.documentElement.scrollHeight;
      cs.forEach(c => { c.style.minHeight = ''; });
      const p = computePins({ viewport: innerHeight, heights: cs.map(c => c.offsetHeight), wide: !matchMedia('(max-width:800px)').matches, header: document.querySelector('header')?.offsetHeight ?? 0, pad: cs[0] ? parseFloat(getComputedStyle(cs[0]).paddingTop) : 0 });
      // unpinned (phones, and desktop windows too short for a card's text): normal scroll; phones also get the settle effect (work.css)
      root.classList.toggle('flat', p.unpin);
      // --lift: each card's gap grows by how far its stop sits above the last card's, so the deck leaves together once the last card lands;
      // --back: the next card takes the same space back, so the lift itself never grows the page
      const lift = (j: number) => (p.tops[cs.length - 1] - p.tops[j]).toFixed(1) + 'px';
      cs.forEach((c, k) => { c.style.minHeight = p.unpin ? '' : p.minHeight + 'px'; c.style.top = p.tops[k].toFixed(1) + 'px'; c.style.position = p.unpin ? 'static' : ''; c.style.setProperty('--lift', p.unpin ? '' : lift(k)); c.style.setProperty('--back', p.unpin || !k ? '' : lift(k - 1)); });
      cover();
      if (aim && !document.documentElement.hasAttribute('data-moved') && document.documentElement.scrollHeight !== was) aim.scrollIntoView();
    };
    // each card is cut at the top edge of the card sliding over it, so the glass never shows the card below
    // all reads first, then only the clips that changed (a read after each write forced a layout per card, user 2026-10-19)
    const clips: string[] = [];
    const cover = () => { const r = cs.map(c => c.getBoundingClientRect()); cs.forEach((c, k) => { const o = r[k + 1] ? r[k].bottom - r[k + 1].top : 0, v = o > 0 ? `inset(-90px -40px ${o.toFixed(0)}px -40px)` : ''; if (v !== clips[k]) { clips[k] = v; c.style.clipPath = v; } }); };
    let raf = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); });   // rAF: resizing inside the callback raised a loop error
    cs.forEach(c => ro.observe(c));
    addEventListener('resize', fit); addEventListener('scroll', cover, { passive: true });
    fit();
    // the first fit() above can land before Inter has even started loading (document.fonts.ready can resolve
    // before that), so refit once the font load actually finishes, and once more as a guarded fallback
    let dead = false;
    document.fonts.addEventListener('loadingdone', fit);
    document.fonts.ready.then(() => { if (!dead) fit(); });
    const stopCount = mountCountUp(root);
    return () => { dead = true; clearTimeout(aimTimer); document.fonts.removeEventListener('loadingdone', fit); ro.disconnect(); cancelAnimationFrame(raf); removeEventListener('resize', fit); removeEventListener('scroll', cover); stopCount(); };
  }, []);
  return null;
}
