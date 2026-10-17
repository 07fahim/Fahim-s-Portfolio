'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

const CAP = 6;

// Toggles `hidden` on the server-rendered cards directly (no React state for the grid itself);
// `n` counts hits so far, used for the All filter's 6-card cap.
function applyDom(f: string, all: boolean) {
  let n = 0;
  document.querySelectorAll<HTMLElement>('#pgrid > .pcard').forEach(el => {
    const hit = f === 'all' ? !('feat' in el.dataset) : (el.dataset.c ?? '').split(' ').includes(f);
    el.hidden = !hit || (!all && f === 'all' && n >= CAP);
    n += hit ? 1 : 0;
  });
}

export default function ProjectFilters({ categories, counts, children }: { categories: [string, string][]; counts: Record<string, number>; children: ReactNode }) {
  const [f, setF] = useState('all');
  const [all, setAll] = useState(false);
  const [said, setSaid] = useState('');   // the live status speaks only after a visitor's action
  const allRef = useRef(all);
  useEffect(() => { allRef.current = all; }, [all]);

  // stable identity: reads `all` through the ref, so the subscription below never needs to reattach
  const pick = (k: string) => {
    setF(k);
    applyDom(k, allRef.current);
    const shown = k === 'all' && !allRef.current ? Math.min(counts[k] ?? 0, CAP) : (counts[k] ?? 0);
    setSaid(`${shown} projects shown`);
  };

  useEffect(() => {
    const on = (e: Event) => pick((e as CustomEvent<string>).detail);
    addEventListener('projects:filter', on);
    return () => removeEventListener('projects:filter', on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAll = () => {
    setAll(true);
    applyDom('all', true);
    setSaid(`${counts.all ?? 0} projects shown`);
    [...document.querySelectorAll<HTMLElement>('#pgrid > .pcard:not([hidden])')][CAP]?.querySelector('a')?.focus();
  };

  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects by service">
        {categories.map(([k, name]) => <button key={k} aria-pressed={f === k} onClick={() => pick(k)}>{name}<sup><span className="sr-only"> </span>{counts[k] ?? 0}</sup></button>)}
      </div>
      <p className="sr-only" role="status">{said}</p>
      {children}
      <div className="more" hidden={all || f !== 'all'}><button onClick={showAll}>Show all {counts.all ?? 0} projects</button></div>
    </>
  );
}
