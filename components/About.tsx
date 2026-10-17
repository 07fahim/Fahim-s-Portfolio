import Bio from './Bio';
import Stack from './Stack';
import { SITE } from '@/content/site';

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about-top">
        <div><div className="label">About me</div><h2 className="silver">Intro</h2></div>
        <div className="card">
          <Bio />
          <dl className="facts">
            <div><dt>Now</dt><dd>Machine Learning Engineer, Masharah Advisory</dd></div>
            <div><dt>Research</dt><dd>6 IEEE papers, 3 as first author</dd></div>
          </dl>
          <a className="cv" href={SITE.cv} download="Fahim-Faiyaz-CV.pdf">
            <span className="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg></span>
            <span><b>Download CV</b><small>PDF · 2 pages</small></span>
          </a>
        </div>
      </div>
      <Stack />
    </section>
  );
}
