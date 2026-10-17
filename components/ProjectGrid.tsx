'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES, FEATURED, GRID_ORDER, PROJECTS, type Project } from '@/content';
import { SITE } from '@/content/site';
import { counts, inFilter, visible } from '@/lib/projects';
import { Github, LUCIDE } from './icons';

const CAP = 6;
const Ext = LUCIDE['external-link'];
const grid = GRID_ORDER.map(t => PROJECTS.find(p => p.title === t)!);
const featured = new Set(FEATURED.map(f => f.title));
const NAME = Object.fromEntries(CATEGORIES);

function Media({ p }: { p: Project }) {
  if (p.img) return <img src={`/pimg/${p.img}.jpg`} alt={`${p.title} screenshot`} loading="lazy" />;
  if (p.stock) return <div className="duo"><img src={p.stock} alt="" loading="lazy" /></div>;
  return <div className="type"><small>{NAME[p.cats[0]]}</small><b>{p.kpi || p.title}</b></div>;
}

export default function ProjectGrid() {
  const [f, setF] = useState('all');
  const [all, setAll] = useState(false);
  const [said, setSaid] = useState('');   // the live status speaks only after a visitor's action
  const gridRef = useRef<HTMLDivElement>(null), focusNext = useRef(false);
  const allRef = useRef(all);
  useEffect(() => { allRef.current = all; }, [all]);
  const n = useMemo(() => counts(grid, featured), []);
  // stable identity: reads `all` through the ref, so the subscription below never needs to reattach
  const pick = useCallback((k: string) => {
    setF(k);
    const shown = grid.filter(p => inFilter(p, k, featured)).length;
    setSaid(`${k === 'all' && !allRef.current ? Math.min(shown, CAP) : shown} projects shown`);
  }, []);
  useEffect(() => {
    const on = (e: Event) => pick((e as CustomEvent<string>).detail);
    addEventListener('projects:filter', on);
    return () => removeEventListener('projects:filter', on);
  }, [pick]);
  useEffect(() => { if (!focusNext.current) return; focusNext.current = false; [...gridRef.current!.querySelectorAll<HTMLElement>('.pcard:not([hidden])')][CAP]?.querySelector('a')?.focus(); }, [all]);
  const shownTitles = useMemo(() => new Set(visible(grid, featured, f, all, CAP).map(p => p.title)), [f, all]);
  return (
    <>
      <div className="label" role="heading" aria-level={3} id="all-projects" style={{ marginTop: '12vh', scrollMarginTop: 90 }}>More projects</div>
      <div className="filters" role="group" aria-label="Filter projects by service">
        {CATEGORIES.map(([k, name]) => <button key={k} aria-pressed={f === k} onClick={() => pick(k)}>{name}<sup><span className="sr-only"> </span>{n[k]}</sup></button>)}
      </div>
      <p className="sr-only" role="status">{said}</p>
      <div className="pgrid" ref={gridRef}>
        {grid.map(p => {
          const hide = !shownTitles.has(p.title);
          const Icon = LUCIDE[p.icon];
          return (
            <article className="pcard" key={p.title} hidden={hide}>
              <div className="media"><Media p={p} />
                <div className="ov"><h5 aria-hidden="true">{p.title}</h5><p>{p.desc}</p>
                  <div className="lk">
                    <a href={SITE.githubBase + p.repo} target="_blank" rel="noopener" aria-label={`Code for ${p.title}`}><Github />Code</a>
                    {p.live && <a href={p.live} target="_blank" rel="noopener" aria-label={`Live demo of ${p.title}`}><Ext />Live demo</a>}
                  </div>
                </div>
              </div>
              <div className="txt"><span className="ptype"><Icon />{p.type}</span><h4>{p.title}</h4><div className="tech">{p.stack.slice(0, 4).map(t => <span key={t}>{t}</span>)}</div></div>
            </article>
          );
        })}
      </div>
      <div className="more" hidden={all || f !== 'all'}><button onClick={() => { focusNext.current = true; setAll(true); setSaid(`${n.all} projects shown`); }}>Show all {n.all} projects</button></div>
    </>
  );
}
