import type { CSSProperties } from 'react';
import { STACK, type Tool } from '@/content/tools';
import { LUCIDE } from './icons';
import StackPause from './StackPause';

function Logo({ t }: { t: Tool }) {
  if (t.logo) return <img className={t.dark ? 'ic dk' : 'ic'} src={t.logo} alt="" loading="lazy" />;
  const Icon = t.icon ? LUCIDE[t.icon] : undefined;
  if (Icon) return <Icon className="ic" aria-hidden="true" />;
  return <b className="ic mono" aria-hidden="true">{t.letters || t.name.slice(0, 2)}</b>;
}

export default function Stack() {
  return (
    <div className="stack">
      <div className="label stack-head">The stack <StackPause /></div>
      <div id="rows">
        {STACK.map((row, i) => (
          <div className="marquee" key={i}><div className="track" style={{ '--d': `${36 + i * 7}s` } as CSSProperties}>
            {[...row, ...row].map((t, j) => <span className="pill" key={j} aria-hidden={j < row.length ? undefined : true}><Logo t={t} />{t.name}</span>)}
          </div></div>
        ))}
      </div>
    </div>
  );
}
