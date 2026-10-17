'use client';
import { useEffect, useRef, useState } from 'react';
import Words from './Words';
import { SERVICES } from '@/content';

const FILTER = ['rag', 'auto', 'docs', 'cv'];   // rows are in the same order as these filters

export default function Services() {
  const [open, setOpen] = useState(-1);
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {   // prototype P718–720: the opened row's description lights word by word, just behind the opening
    if (open < 0) return;
    const ws = [...list.current!.children[open].querySelectorAll<HTMLElement>('.inner p span')];
    const fast = matchMedia('(prefers-reduced-motion: reduce)').matches;
    ws.forEach((w, i) => { w.classList.remove('lit'); w.style.transitionDelay = fast ? '0ms' : (180 + i * 22) + 'ms'; });
    let b = 0;
    const a = requestAnimationFrame(() => { b = requestAnimationFrame(() => ws.forEach(w => w.classList.add('lit'))); });
    return () => { cancelAnimationFrame(a); cancelAnimationFrame(b); };
  }, [open]);
  return (
    <section className="services" id="services">
      <h2 className="silver">WHAT I<br />BUILD</h2>
      <ol className="svc" ref={list}>
        {SERVICES.map((s, i) => (
          <li key={s.title} className={open === i ? 'open' : undefined}>
            <button aria-expanded={open === i} onClick={() => setOpen(o => o === i ? -1 : i)}>
              <span className="n">0{i + 1}</span><span className="t">{s.title}</span><span className="arr" aria-hidden="true">↘</span>
            </button>
            <div className="body" inert={open !== i}><div><div className="inner">
              <ul>{s.items.map(x => <li key={x}>{x}</li>)}</ul>
              <div><p><Words text={s.desc} /></p>
                <a className="view" href="#all-projects" onClick={() => window.dispatchEvent(new CustomEvent('projects:filter', { detail: FILTER[i] }))}>VIEW PROJECTS</a></div>
            </div></div></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
