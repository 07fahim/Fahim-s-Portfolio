'use client';
import { useEffect, useRef } from 'react';
import Words from './Words';
import { BIO } from '@/content/bio';

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default function Bio() {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {   // prototype P985–989: words light as the card scrolls in
    // build (user, 2026-10-19): the card is measured when the page changes size, not on scroll, and words change only
    // when the count does, so scrolling elsewhere forces no layout
    const ws = [...el.current!.querySelectorAll('span')];
    let top = 0, h = 0, lit = -1;
    const run = () => {
      const vh = innerHeight, n = Math.ceil(clamp((vh * 0.9 - (top - scrollY)) / Math.max(h, vh * 0.35)) * ws.length);
      if (n !== lit) { lit = n; ws.forEach((w, i) => w.classList.toggle('lit', i < n)); }
    };
    const measure = () => { const r = el.current!.getBoundingClientRect(); top = r.top + scrollY; h = r.height; run(); };
    const ro = new ResizeObserver(measure); ro.observe(document.body);
    addEventListener('scroll', run, { passive: true }); addEventListener('resize', measure);
    measure();
    return () => { ro.disconnect(); removeEventListener('scroll', run); removeEventListener('resize', measure); };
  }, []);
  return (
    <div id="bio" className="hl" ref={el}>
      {BIO.map((para, i) => <p key={i}>{para.map((s, j) => typeof s === 'string' ? <Words key={j} text={s} /> : <b key={j}><Words text={s.b} /></b>)}</p>)}
    </div>
  );
}
