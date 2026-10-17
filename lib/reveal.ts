// Fade-up: 24px + opacity-0 → settled, once, at 20% visible. Groups stagger 60ms apart in DOM
// order (transition-delay). Never hides anything already on screen at mount, so there's no flash
// and no LCP hit; CSS (base.css) guarantees everything is visible at once under reduced motion,
// so this still passes even if the observer hasn't fired yet (e.g. parity).
const SINGLES = '.label, h2, .about .card, .svc';
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

  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } });
  }, { threshold: 0.2 });

  const vh = innerHeight;
  all.forEach(el => {
    if (el.getBoundingClientRect().top < vh) return; // already on screen: leave as server-rendered
    el.classList.add('reveal');
    obs.observe(el);
  });

  ac.signal.addEventListener('abort', () => obs.disconnect());
  return () => ac.abort();
}
