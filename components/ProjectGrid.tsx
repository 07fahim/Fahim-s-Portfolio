import { CATEGORIES, type Project } from '@/content';
import { FEATURED, PROJECTS } from '@/content/projects';
import { counts, visible } from '@/lib/projects';
import { Github, LUCIDE } from './icons';
import ProjectFilters from './ProjectFilters';

const CAP = 6;
const Ext = LUCIDE['external-link'];
const grid = PROJECTS;
const featured = new Set(FEATURED.map(f => f.title));
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
            const Icon = LUCIDE[p.icon];
            return (
              <article className="pcard" key={p.title} data-title={p.title} hidden={hide}>
                <div className="media"><Media p={p} />
                  <div className="ov"><h5 aria-hidden="true">{p.title}</h5><p>{p.desc}</p>
                    <div className="lk">
                      <a href={p.repo} target="_blank" rel="noopener" aria-label={`Code for ${p.title}`}><Github />Code</a>
                      {p.live && <a href={p.live} target="_blank" rel="noopener" aria-label={`Live demo of ${p.title}`}><Ext />Live demo</a>}
                    </div>
                  </div>
                </div>
                <div className="txt"><span className="ptype"><Icon />{p.type}</span><h4>{p.title}</h4><div className="tech">{p.stack.slice(0, 4).map(t => <span key={t}>{t}</span>)}</div></div>
              </article>
            );
          })}
        </div>
      </ProjectFilters>
    </>
  );
}
