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
      const p = computePins({ viewport: innerHeight, heights: cs.map(c => c.offsetHeight), wide: innerWidth > 800 });
      // a card taller than the screen pins with its top under the menu bar; where that would hide its text (not just its
      // padding), the cards scroll like normal content instead, so every line stays readable (user, 2026-10-19; short
      // phones such as 375x667 and narrow short windows)
      const unpin = p.tall && p.tops[0] + parseFloat(getComputedStyle(cs[0]).paddingTop) < (document.querySelector('header')?.offsetHeight ?? 0);
      cs.forEach((c, k) => { c.style.minHeight = p.minHeight + 'px'; c.style.top = p.tops[k].toFixed(1) + 'px'; c.style.position = unpin ? 'static' : ''; });
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
