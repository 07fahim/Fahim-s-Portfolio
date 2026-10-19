'use client';
import { useEffect } from 'react';
import { mountCountUp } from '@/lib/countup';
import { computePins } from '@/lib/pins';

export default function PinnedCardsEffects() {
  useEffect(() => {
    const root = document.getElementById('pins')!;
    const cs = [...root.querySelectorAll<HTMLElement>('.pinc')];
    const fit = () => {
      cs.forEach(c => { c.style.minHeight = ''; });
      const p = computePins({ viewport: innerHeight, heights: cs.map(c => c.offsetHeight), wide: !matchMedia('(max-width:800px)').matches, header: document.querySelector('header')?.offsetHeight ?? 0, pad: cs[0] ? parseFloat(getComputedStyle(cs[0]).paddingTop) : 0 });
      // unpinned (phones, and desktop windows too short for a card's text): normal scroll; phones also get the settle effect (work.css)
      root.classList.toggle('flat', p.unpin);
      // --lift: each card's gap grows by how far its stop sits above the last card's, so the deck leaves together once the last card lands;
      // --back: the next card takes the same space back, so the page keeps its height (a #game link computed before this still lands right)
      cs.forEach((c, k) => { c.style.minHeight = p.unpin ? '' : p.minHeight + 'px'; c.style.top = p.tops[k].toFixed(1) + 'px'; c.style.position = p.unpin ? 'static' : ''; const lift = (j: number) => (p.tops[cs.length - 1] - p.tops[j]).toFixed(1) + 'px'; c.style.setProperty('--lift', p.unpin ? '' : lift(k)); c.style.setProperty('--back', p.unpin || !k ? '' : lift(k - 1)); });
      cover();
    };
    // each card is cut at the top edge of the card sliding over it, so the glass never shows the card below
    const cover = () => cs.forEach((c, k) => { const next = cs[k + 1]; const o = next ? c.getBoundingClientRect().bottom - next.getBoundingClientRect().top : 0; c.style.clipPath = o > 0 ? `inset(-90px -40px ${o.toFixed(0)}px -40px)` : ''; });
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
    return () => { dead = true; document.fonts.removeEventListener('loadingdone', fit); ro.disconnect(); cancelAnimationFrame(raf); removeEventListener('resize', fit); removeEventListener('scroll', cover); stopCount(); };
  }, []);
  return null;
}
