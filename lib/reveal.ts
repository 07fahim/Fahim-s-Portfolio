// Fade-up: 24px + opacity-0 → settled, once, at 20% visible. Cards in a group stagger 60ms apart,
// counted within each batch the observer reveals together (so "Show all" or a late scroll never
// queues a card behind ones revealed long ago). Visibility is decided from the observer's own first
// report, never a one-off getBoundingClientRect at mount, so a restored scroll position or a #hash
// load can't measure the wrong thing and flash an on-screen element. Once the fade ends the classes
// and delay are removed, so each card's own hover transitions apply again. Reduced motion: nothing
// is hidden at all (base.css also shows .reveal at once, as a guard). #all-projects carries .label
// too but is out of the approved scope, so it's excluded.
const SINGLES = '.label:not(#all-projects), h2, .about .card, .svc';
const GROUPS = '.pcard, .tl-list > li, .ct .c4 > *, .ach .cards > li';

export function mountReveal(): () => void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const grouped = new Set(document.querySelectorAll<HTMLElement>(GROUPS));
  const all = [...document.querySelectorAll<HTMLElement>(SINGLES), ...grouped];

  const settle = (e: Event) => {
    const el = e.currentTarget as HTMLElement;
    if (e.target !== el || (e as TransitionEvent).pseudoElement) return;   // either property ending (or cancelling: hidden by a filter mid-fade) settles it; a ::before transition (the timeline dot on hover) is not the fade
    el.classList.remove('reveal', 'in'); el.style.transitionDelay = '';
    el.removeEventListener('transitionend', settle); el.removeEventListener('transitioncancel', settle);
  };

  // first report per element decides visibility (intersecting = already on screen, never animate;
  // not intersecting = below the fold, hide and wait); every later report at the same 0.2
  // threshold is the real reveal.
  const seen = new WeakSet<Element>();
  const obs = new IntersectionObserver((entries, o) => {
    let k = 0;
    entries.forEach(e => {
      const el = e.target as HTMLElement;
      if (!seen.has(el)) {
        seen.add(el);
        if (e.isIntersecting) { o.unobserve(el); return; }
        el.classList.add('reveal');
        return;
      }
      if (!e.isIntersecting) return;
      if (grouped.has(el)) el.style.transitionDelay = `${k++ * 60}ms`;
      el.addEventListener('transitionend', settle); el.addEventListener('transitioncancel', settle);
      el.classList.add('in'); o.unobserve(el);
    });
  }, { threshold: 0.2 });

  all.forEach(el => obs.observe(el));
  return () => {
    obs.disconnect();
    all.forEach(el => { el.removeEventListener('transitionend', settle); el.removeEventListener('transitioncancel', settle); el.classList.remove('reveal', 'in'); el.style.transitionDelay = ''; });
  };
}
