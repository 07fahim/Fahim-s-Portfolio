import { TIMELINE } from '@/content';

export default function Timeline() {
  return (
    <section className="tl" id="timeline">
      <div className="label">Experience &amp; education</div>
      <h2 className="silver">TIMELINE</h2>
      <ol className="tl-list">
        {TIMELINE.map(e => (
          <li key={e.role}>
            <div><div className="tl-date">{e.now ? <><span className="now">Now</span><br /></> : null}{e.date}</div></div>
            <div>
              <h3>{e.role}<small>{e.org}</small></h3>
              <div className="where">{e.where}</div>
              <p>{e.text}</p>
              <div className="tags">{e.tags.map(t => <span key={t}>{t}</span>)}</div>
              {e.more && <a className="more" href="#achievements">{e.more}&nbsp;<span aria-hidden="true">↓</span></a>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
