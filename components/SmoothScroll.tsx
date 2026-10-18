'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

// Smooth wheel and trackpad scrolling (user, 2026-10-18). Lenis's defaults keep touch native. Under reduced motion
// it isn't started at all: its own respectReducedMotion only makes the wheel jump, still through Lenis.
// Anchors stay with the browser's own smooth scroll (base.css): Lenis's anchor handler doesn't cancel the
// browser's jump, so the two would race.
export default function SmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
