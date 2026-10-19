'use client';
import { useEffect, useRef, type CSSProperties } from 'react';
import { mountGame } from '@/lib/game';

// PORT P674–678: the HELLO WORLD section markup. Build (user, 2026-10-19): the lives, clock and best
// (.hud), and the win / out-of-lives card (.gcard); lib/game.ts fills and shows them.
export default function Game() {
  const sec = useRef<HTMLElement>(null);
  useEffect(() => mountGame(sec.current!), []);
  const k = (n: number) => ({ '--k': n }) as CSSProperties;
  return (
    <section className="game" id="game" tabIndex={-1} ref={sec}>
      <div className="hud" aria-hidden="true"><span className="tag lives"><i /><i /><i /></span><span className="tag clock">0:00</span><span className="tag best" hidden /></div>
      <p className="cap">Break it if you can. I’ll retrain it.</p>
      <canvas id="bricks" role="img" aria-label="HELLO WORLD written in bricks. Press Play for a brick-breaker game with 3 lives; move the paddle with the mouse, a finger or the arrow keys." />
      <button className="play" id="play">PLAY</button>
      <div className="gcard" hidden>
        <h3 className="silver" style={k(0)} />
        <div className="num" style={k(1)}><span aria-hidden="true" /><small /></div>
        <div className="pills" style={k(2)}><span className="tag left" /><span className="tag live nb">New best</span></div>
        <div className="links" style={k(3)}><button className="btn solid share" type="button">Share my time</button><button className="btn again" type="button">Play again</button></div>
        <a className="more" href="#contact" style={k(4)}>Cleared it? Book a free 20-min call&nbsp;<span aria-hidden="true">↓</span></a>
      </div>
      <p className="sr-only" role="status" />
    </section>
  );
}
