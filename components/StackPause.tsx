'use client';
import { useRef, useState } from 'react';

export default function StackPause() {
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const toggle = () => {
    const next = !paused;
    setPaused(next);
    ref.current?.closest('.stack')?.classList.toggle('paused', next);
  };
  return (
    <button ref={ref} className="halt" type="button" aria-label={`${paused ? 'Play' : 'Pause'} the sliding rows`} onClick={toggle}>
      <span aria-hidden="true">{paused ? '▶' : '❚❚'}</span>{paused ? 'Play' : 'Pause'}
    </button>
  );
}
