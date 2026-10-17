'use client';
import { Fragment, useEffect, useRef, type CSSProperties } from 'react';
import { FEATURED, FLOW } from '@/content';
import { SITE } from '@/content/site';
import { computePins } from '@/lib/pins';

export default function PinnedCards() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cs = [...root.current!.querySelectorAll<HTMLElement>('.pinc')];
    const fit = () => {
      cs.forEach(c => { c.style.minHeight = ''; });
      const p = computePins({ viewport: innerHeight, heights: cs.map(c => c.offsetHeight), wide: innerWidth > 800 });
      cs.forEach((c, k) => { c.style.minHeight = p.minHeight + 'px'; c.style.top = p.tops[k].toFixed(1) + 'px'; });
      cover();
    };
    // each card is cut at the top edge of the card sliding over it, so the glass never shows the card below
    const cover = () => cs.forEach((c, k) => { const n = cs[k + 1]; const o = n ? c.getBoundingClientRect().bottom - n.getBoundingClientRect().top : 0; c.style.clipPath = o > 0 ? `inset(-90px -40px ${o.toFixed(0)}px -40px)` : ''; });
    let raf = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); });   // rAF: resizing inside the callback raised a loop error
    cs.forEach(c => ro.observe(c));
    addEventListener('resize', fit); addEventListener('scroll', cover, { passive: true });
    fit();
    // the first fit() above can land before Inter has even started loading (document.fonts.ready can resolve
    // before that), so refit once the font load actually finishes, and once more as a guarded fallback
    let dead = false;
    document.fonts.addEventListener('loadingdone', fit);
    document.fonts.ready.then(() => { if (!dead) fit(); });
    return () => { dead = true; document.fonts.removeEventListener('loadingdone', fit); ro.disconnect(); cancelAnimationFrame(raf); removeEventListener('resize', fit); removeEventListener('scroll', cover); };
  }, []);
  return (
    <div className="pins" id="pins" ref={root}>
      {FEATURED.map((c, k) => (
        <article className="pinc" key={c.title} style={{ '--i': k } as CSSProperties}>
          <div>
            <div className="eyebrow" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{c.tags.map((x, j) => <span key={x} className={j === 0 && x.startsWith('Live') ? 'tag live' : 'tag'}>{x}</span>)}</div>
            <h3 className="silver">{c.title}</h3>
            <p className="lede" style={{ color: 'var(--bio)', lineHeight: 1.6 }}>{c.lede}</p>
            {c.number && <div className="big-n">{c.number.value}<small>{c.number.label}</small></div>}
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
    </div>
  );
}
