import type { CSSProperties } from 'react';
import { CATEGORIES, type Project } from '@/content';
import { FEATURED, PROJECTS } from '@/content/projects';
import { bigFirst, counts, visible } from '@/lib/projects';
import ProjectFilters from './ProjectFilters';

const CAP = 6;
const featured = new Set(FEATURED.map(f => f.title));
const grid = bigFirst(PROJECTS, featured);
const NAME = Object.fromEntries(CATEGORIES);

function Media({ p }: { p: Project }) {
  if (p.image && !p.stock) return <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" />;
  if (p.image) return <div className="duo"><img src={p.image} alt="" loading="lazy" /></div>;
  return <div className="type"><small>{NAME[p.cats[0]]}</small><b>{p.kpi || p.title}</b></div>;
}

const items = grid.map(p => ({ title: p.title, cats: p.cats }));
const featuredTitles = [...featured];

export default function ProjectGrid() {
  const n = counts(grid, featured);
  const shown = new Set(visible(grid, featured, 'all', false, CAP).map(p => p.title));
  return (
    <>
      <div className="label" role="heading" aria-level={3} id="all-projects" style={{ marginTop: '12vh', scrollMarginTop: 90 }}>More projects</div>
      <ProjectFilters categories={CATEGORIES} counts={n} items={items} featuredTitles={featuredTitles}>
        <div className="pgrid" id="pgrid">
          {grid.map(p => {
            const hide = !shown.has(p.title);
            return (
              <article className="pcard" key={p.title} data-title={p.title} hidden={hide}>
                <div className="smedia"><Media p={p} />
                  <div className="sov"><small>Built with</small><div>{p.stack.map((x, j) => <span key={x} style={{ '--k': j } as CSSProperties}>{x}</span>)}</div></div>
                </div>
                <div className="eyebrow">{p.live && <span className="tag live">Live</span>}{p.cats[0] && <span className="tag">{NAME[p.cats[0]]}</span>}</div>
                <h4 className="silver">{p.title}</h4>
                <p className="lede">{p.desc}</p>
                <div className="links">
                  {p.live && <a className="btn solid" href={p.live} target="_blank" rel="noopener" aria-label={`Live demo of ${p.title}`}>Live&nbsp;<span aria-hidden="true">↗</span></a>}
                  <a className="btn" href={p.repo} target="_blank" rel="noopener" aria-label={`${p.title} on GitHub`}>GitHub&nbsp;<span aria-hidden="true">↗</span></a>
                </div>
              </article>
            );
          })}
        </div>
      </ProjectFilters>
    </>
  );
}
