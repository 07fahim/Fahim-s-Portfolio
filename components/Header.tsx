'use client';
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { currentMode, syncTheme, setSetting, type Mode } from '@/lib/mode';
import { SITE } from '@/content/site';

const LINKS = [['home', 'Home'], ['about', 'About'], ['services', 'Services'], ['work', 'Work'], ['contact', 'Contact']] as const;
const ALIAS: Record<string, string> = { timeline: 'about', achievements: 'about', game: 'contact' };   // no section lights nothing
// module-level so identity is stable across renders (useSyncExternalStore re-subscribes on identity change)
const subscribeMode = (cb: () => void) => { addEventListener('modechange', cb); return () => removeEventListener('modechange', cb); };

export default function Header() {
  const shown = useSyncExternalStore(subscribeMode, currentMode, () => 'light' as Mode);
  useEffect(syncTheme, []);   // follow the device while System is chosen, and a theme picked in another tab
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState('home');
  const btn = useRef<HTMLButtonElement>(null), menu = useRef<HTMLDivElement>(null), bar = useRef<HTMLDivElement>(null), wasOpen = useRef(false);

  // section highlight and progress line (prototype P979–994; the bio's lighting lives in Bio). Build (user, 2026-10-19):
  // the section tops are measured only when the page changes size, never on scroll, and the line grows with a transform,
  // because a layout read or a width write on every scroll step forced a full layout each frame (laggy in Work).
  useEffect(() => {
    let tops: [string, number][] = [], room = 1, last = '';
    const run = () => {
      const y = scrollY, mid = y + innerHeight * 0.5;
      let c = 'home';
      for (const [id, top] of tops) if (top < mid) c = id;
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, y / room)})`;
      const v = ALIAS[c] ?? c;
      if (v !== last) { last = v; setCur(v); }
    };
    const measure = () => {
      const y = scrollY;
      tops = [...document.querySelectorAll('section[id]')].map(s => [s.id, s.getBoundingClientRect().top + y]);
      room = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      run();
    };
    const ro = new ResizeObserver(measure); ro.observe(document.body);
    addEventListener('scroll', run, { passive: true }); addEventListener('resize', measure);
    measure();
    return () => { ro.disconnect(); removeEventListener('scroll', run); removeEventListener('resize', measure); };
  }, []);

  // phone menu (prototype P1178–1185): the page behind can't scroll or take focus; Escape, a link or a wider window closes it
  useEffect(() => {
    const behind = ['main', 'footer', '#intro', '#bg'].map(s => document.querySelector<HTMLElement>(s)).filter((e): e is HTMLElement => !!e);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    behind.forEach(el => { el.inert = open; });
    if (open) menu.current?.querySelector('a')?.focus({ preventScroll: true });
    else if (wasOpen.current) btn.current?.focus({ preventScroll: true });
    wasOpen.current = open;
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const wide = () => { if (innerWidth > 800) setOpen(false); };
    addEventListener('keydown', key); addEventListener('resize', wide);
    return () => { removeEventListener('keydown', key); removeEventListener('resize', wide); };
  }, [open]);

  // two states, and the button names what you get (user, 2026-10-19): DARK on a light page, LIGHT on a dark one.
  // A saved System setting still follows the device until the first click.
  const other: Mode = shown === 'light' ? 'dark' : 'light';
  const flip = () => setSetting(other);
  const themeLabel = `Switch to ${other} mode`;
  const link = (id: string) => ({ href: `#${id}`, className: cur === id ? 'on' : undefined, 'aria-current': cur === id ? ('location' as const) : undefined });

  return (
    <>
      <header>
        {/* the hero engine owns inert and .show on this element (lib/hero/scene.ts); keep them static props here */}
        <a className="logo" href="#home" inert>FAHIM FAIYAZ</a>
        <nav>
          {LINKS.map(([id, n]) => <a key={id} {...link(id)}>{n.toUpperCase()}</a>)}
          <button className="mode" type="button" onClick={flip} aria-label={themeLabel}>{other.toUpperCase()}</button>
        </nav>
        <button ref={btn} className="menu-btn" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(o => !o)}>{open ? 'CLOSE' : 'MENU'}</button>
        <div className="progress" ref={bar} />
      </header>
      <div ref={menu} className={open ? 'menu open' : 'menu'} id="menu" data-lenis-prevent role="dialog" aria-label="Menu" onClick={e => { if ((e.target as Element).closest('a')) setOpen(false); }}>
        <nav className="menu-links" aria-label="Sections">
          {LINKS.map(([id, n], k) => <a key={id} {...link(id)} style={{ '--k': k } as CSSProperties}>{n}</a>)}
        </nav>
        <div className="menu-foot">
          <a className="btn solid" href={SITE.whatsapp} target="_blank" rel="noopener" data-umami-event="whatsapp_click">Message on WhatsApp<span className="wa" aria-hidden="true" /></a>
          <a className="btn" href={SITE.cv} download="Fahim-Faiyaz-CV.pdf" target="_blank" rel="noopener" data-umami-event="resume_click">Download CV&nbsp;<span aria-hidden="true">↓</span></a>
          <button className="btn" type="button" onClick={flip} aria-label={themeLabel}>{other === 'dark' ? 'Dark' : 'Light'} mode</button>
        </div>
      </div>
    </>
  );
}
