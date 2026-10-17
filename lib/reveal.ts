// Fade-up: 24px + opacity-0 → settled, once, at 20% visible. Groups stagger 60ms apart in DOM
// order (transition-delay). Visibility is decided from the observer's own first report, never a
// one-off getBoundingClientRect at mount, so a restored scroll position or a #hash load can't
// measure the wrong thing and flash an on-screen element. CSS (base.css) guarantees everything is
// visible at once under reduced motion, so this still passes even if the observer hasn't fired yet
// (e.g. parity). #all-projects carries .label too but is out of the approved scope, so it's excluded.
const SINGLES = '.label:not(#all-projects), h2, .about .card, .svc';
const GROUPS = ['.pcard', '.tl-list > li', '.ct .c4 > *'];
const GROUP_LISTS = '.ach .cards'; // each list (papers, courses) staggers on its own

function stagger(els: HTMLElement[]) {
  els.forEach((el, i) => { el.style.transitionDelay = `${i * 60}ms`; });
}

export function mountReveal(): () => void {
  const ac = new AbortController();

  const groups: HTMLElement[][] = [
    ...GROUPS.map(s => [...document.querySelectorAll<HTMLElement>(s)]),
    ...[...document.querySelectorAll<HTMLElement>(GROUP_LISTS)].map(ul => [...ul.children] as HTMLElement[]),
  ].filter(g => g.length);
  groups.forEach(stagger);

  const singles = [...document.querySelectorAll<HTMLElement>(SINGLES)];
  const all = [...singles, ...groups.flat()];

  // first report per element decides visibility (intersecting = already on screen, never animate;
  // not intersecting = below the fold, hide and wait); every later report at the same 0.2
  // threshold is the real reveal.
  const seen = new WeakSet<Element>();
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      const el = e.target;
      if (!seen.has(el)) {
        seen.add(el);
        if (e.isIntersecting) { o.unobserve(el); return; }
        el.classList.add('reveal');
        return;
      }
      if (e.isIntersecting) { el.classList.add('in'); o.unobserve(el); }
    });
  }, { threshold: 0.2 });

  all.forEach(el => obs.observe(el));

  ac.signal.addEventListener('abort', () => obs.disconnect());
  return () => ac.abort();
}
