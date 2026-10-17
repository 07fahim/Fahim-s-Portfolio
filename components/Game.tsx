'use client';
import { useEffect, useRef } from 'react';
import { mountGame } from '@/lib/game';

// PORT P674–678: the HELLO WORLD section markup.
export default function Game() {
  const sec = useRef<HTMLElement>(null);
  useEffect(() => mountGame(sec.current!), []);
  return (
    <section className="game" id="game" tabIndex={-1} ref={sec}>
      <p className="cap">Break it if you can. I’ll retrain it.</p>
      <canvas id="bricks" role="img" aria-label="HELLO WORLD written in bricks. Press Play for a brick-breaker game; move the paddle with the mouse, a finger or the arrow keys." />
      <button className="play" id="play">PLAY</button>
    </section>
  );
}
