'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

// Smooth wheel and trackpad scrolling (user, 2026-10-18). Lenis's defaults keep touch native. Under reduced motion
// it isn't started at all: its own respectReducedMotion only makes the wheel jump, still through Lenis.
// Anchors stay with the browser's own smooth scroll (base.css): Lenis's anchor handler doesn't cancel the
// browser's jump, so the two would race.
// - allowNestedScroll: a trackpad swipe over a sideways row (the n8n diagram, the filters) scrolls that row.
// - autoToggle: Lenis stops while the phone menu sets overflow:hidden on <html>.
// - A press ends a glide at once, or it would override the browser's scroll for a link, End or Page Down.
export default function SmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: true, allowNestedScroll: true, autoToggle: true });
    const halt = () => { if (lenis.isScrolling === 'smooth') lenis.scrollTo(lenis.actualScroll, { immediate: true }); };
    addEventListener('pointerdown', halt, true);
    addEventListener('keydown', halt, true);
    return () => { removeEventListener('pointerdown', halt, true); removeEventListener('keydown', halt, true); lenis.destroy(); };
  }, []);
  return null;
}
