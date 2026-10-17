import PinnedCards from './PinnedCards';
import ProjectGrid from './ProjectGrid';

export default function Work() {
  return (
    <section className="work" id="work">
      <div className="label">Selected work</div>
      <h2 className="silver">WORK</h2>
      <PinnedCards />
      <ProjectGrid />
    </section>
  );
}
