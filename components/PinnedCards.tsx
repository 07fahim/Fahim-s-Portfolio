import { Fragment, type CSSProperties } from 'react';
import { FEATURED, FLOW } from '@/content';
import { SITE } from '@/content/site';
import PinnedCardsEffects from './PinnedCardsEffects';

export default function PinnedCards() {
  return (
    <div className="pins" id="pins">
      {FEATURED.map((c, k) => (
        <article className="pinc" key={c.title} style={{ '--i': k } as CSSProperties}>
          <div>
            <div className="eyebrow" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{c.tags.map((x, j) => <span key={x} className={j === 0 && x.startsWith('Live') ? 'tag live' : 'tag'}>{x}</span>)}</div>
            <h3 className="silver">{c.title}</h3>
            <p className="lede" style={{ color: 'var(--bio)', lineHeight: 1.6 }}>{c.lede}</p>
            {c.number && (
              <div className="big-n">
                <span className="cnt" aria-hidden="true" data-final={c.number.value}>{c.number.value}</span>
                <span className="sr-only">{c.number.value}</span>
                <small>{c.number.label}</small>
              </div>
            )}
            <ul>{c.points.map(x => <li key={x}>{x}</li>)}</ul>
            <div className="links" style={{ marginTop: 26 }}>
              {c.live && <a className="btn solid" href={c.live} target="_blank" rel="noopener">Live&nbsp;<span aria-hidden="true">↗</span></a>}
              <a className="btn" href={SITE.githubBase + c.repo} target="_blank" rel="noopener">GitHub&nbsp;<span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="smedia">
            {c.media.kind === 'img' ? <img src={c.media.src} alt={c.media.alt} loading="lazy" /> : (
              <div className="flow"><small>{FLOW.label}</small>{FLOW.steps.map((s, j) => <Fragment key={j}>{j > 0 && <i>→</i>}<span className={s.gate ? 'gate' : undefined}>{s.text}</span></Fragment>)}</div>
            )}
            <div className="sov"><small>Built with</small><div>{c.stack.map((x, j) => <span key={x} style={{ '--k': j } as CSSProperties}>{x}</span>)}</div></div>
          </div>
        </article>
      ))}
      <PinnedCardsEffects />
    </div>
  );
}
