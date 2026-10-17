'use client';
import { useEffect, useRef } from 'react';
import Words from './Words';
import { BIO } from '@/content/bio';

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default function Bio() {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {   // prototype P985–989: words light as the card scrolls in
    const ws = [...el.current!.querySelectorAll('span')];
    const run = () => {
      const r = el.current!.getBoundingClientRect(), vh = innerHeight;
      const p = clamp((vh * 0.9 - r.top) / Math.max(r.height, vh * 0.35));
      ws.forEach((w, i) => w.classList.toggle('lit', i < p * ws.length));
    };
    addEventListener('scroll', run, { passive: true }); run();
    return () => removeEventListener('scroll', run);
  }, []);
  return (
    <div id="bio" className="hl" ref={el}>
      {BIO.map((para, i) => <p key={i}>{para.map((s, j) => typeof s === 'string' ? <Words key={j} text={s} /> : <b key={j}><Words text={s.b} /></b>)}</p>)}
    </div>
  );
}
