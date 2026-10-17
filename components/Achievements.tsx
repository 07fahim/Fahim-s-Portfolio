import { COURSES, PAPERS } from '@/content';

const ord = (n: number) => ['1st', '2nd', '3rd'][n - 1] + ' author';

export default function Achievements() {
  return (
    <section className="ach" id="achievements">
      <div className="label">Papers &amp; courses</div>
      <h2 className="silver">ACHIEVEMENTS</h2>
      <div>
        <div className="grp">
          <div className="gh"><span><b>6 IEEE papers</b> · 3 as first author</span><span>2024 — 2025</span></div>
          <ul className="cards">
            {PAPERS.map(p => (
              <li key={p.doi}>
                <div className="top"><span>{p.venue}</span><span className={p.author === 1 ? 'au first' : 'au'}>{ord(p.author)}</span></div>
                <h3>{p.title}</h3>
                <div className="foot"><span className="topic">{p.topic}</span><a className="doi" href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener" aria-label={`Read on IEEE: ${p.title}`}>Read on IEEE&nbsp;<span aria-hidden="true">↗</span></a></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="grp">
          <div className="gh"><span><b>Courses</b></span></div>
          <ul className="cards small">
            {COURSES.map(c => (
              <li key={c.title}><div className="top"><span>{c.school}</span><span>{c.year}</span></div><h3>{c.title}</h3><p className="desc" style={{ margin: 0 }}>{c.desc}</p></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
