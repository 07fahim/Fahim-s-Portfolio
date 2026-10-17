import type { CSSProperties } from 'react';
import { STACK, TOOLS } from '@/content';
import { LUCIDE } from './icons';
import StackPause from './StackPause';

function Logo({ name }: { name: string }) {
  const t = TOOLS[name.toLowerCase()];
  if (t.src.startsWith('i:')) { const Icon = LUCIDE[t.src.slice(2)]; return <Icon className="ic" aria-hidden="true" />; }
  if (t.src.startsWith('t:')) return <b className="ic mono" aria-hidden="true">{t.src.slice(2)}</b>;
  return <img className={t.dk ? 'ic dk' : 'ic'} src={`/logos/${t.src}.svg`} alt="" loading="lazy" />;
}

export default function Stack() {
  return (
    <div className="stack">
      <div className="label stack-head">The stack <StackPause /></div>
      <div id="rows">
        {STACK.map((row, i) => (
          <div className="marquee" key={i}><div className="track" style={{ '--d': `${36 + i * 7}s` } as CSSProperties}>
            {[...row, ...row].map((s, j) => <span className="pill" key={j} aria-hidden={j < row.length ? undefined : true}><Logo name={s} />{s}</span>)}
          </div></div>
        ))}
      </div>
    </div>
  );
}
