'use client';
import { useEffect } from 'react';
import { mountHero } from '@/lib/hero/scene';
import { SITE } from '@/content/site';

export default function Hero() {
  useEffect(() => mountHero(), []);
  return (
    <div className="hero-wrap" id="home">
      <section className="hero">
        <canvas aria-hidden="true" />
        <figure className="ph"><img src="/office-real.webp" alt="Portrait of Fahim Faiyaz" /></figure>
        <div className="scrim" />
        <h1 className="big silver">FAHIM FAIYAZ</h1>
        <div className="row">
          <div className="title ui d2">AI/ML <i>Engineer</i></div>
          <div className="btns ui d3">
            <a className="btn" href={SITE.upwork} target="_blank" rel="noopener">Upwork&nbsp;<span aria-hidden="true">↗</span></a>
            <a className="btn" href={SITE.fiverr} target="_blank" rel="noopener">Fiverr&nbsp;<span aria-hidden="true">↗</span></a>
            <a className="btn solid" href={SITE.whatsapp} target="_blank" rel="noopener">Message on WhatsApp<span className="wa" aria-hidden="true" /></a>
          </div>
        </div>
        <div className="skip" aria-hidden="true">CLICK TO SKIP</div>
      </section>
    </div>
  );
}
