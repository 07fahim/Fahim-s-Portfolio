'use client';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { visible } from '@/lib/projects';

const CAP = 6;

// Maps the pure `visible()` result onto the server-rendered cards via `data-title` (no re-parsing
// of filter logic against DOM strings — the same shown set that drives the status text here is
// what gets un-hidden).
function applyDom(shownTitles: Set<string>) {
  document.querySelectorAll<HTMLElement>('#pgrid > .pcard').forEach(el => {
    el.hidden = !shownTitles.has(el.dataset.title ?? '');
  });
}

type Item = { title: string; cats: string[] };

export default function ProjectFilters({ categories, counts, items, featuredTitles, children }: { categories: [string, string][]; counts: Record<string, number>; items: Item[]; featuredTitles: string[]; children: ReactNode }) {
  const featured = useMemo(() => new Set(featuredTitles), [featuredTitles]);
  const names = useMemo(() => new Map(categories), [categories]);
  const [f, setF] = useState('all');
  const [all, setAll] = useState(false);
  const [said, setSaid] = useState('');   // the live status speaks only after a visitor's action
  const allRef = useRef(all);
  useEffect(() => { allRef.current = all; }, [all]);

  // stable identity: reads `all` through the ref, so the subscription below never needs to reattach
  const pick = (k: string) => {
    setF(k);
    const hits = visible(items, featured, k, allRef.current, CAP);
    applyDom(new Set(hits.map(p => p.title)));
    setSaid(`${names.get(k)}: ${hits.length} projects shown`);   // the name too, so two filters with the same count still announce a change
  };

  useEffect(() => {
    const on = (e: Event) => pick((e as CustomEvent<string>).detail);
    addEventListener('projects:filter', on);
    return () => removeEventListener('projects:filter', on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAll = () => {
    setAll(true);
    const hits = visible(items, featured, 'all', true, CAP);
    applyDom(new Set(hits.map(p => p.title)));
    setSaid(`${names.get('all')}: ${hits.length} projects shown`);
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
