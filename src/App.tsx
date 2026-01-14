import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/sections/AboutSection';
import EducationSection from './components/sections/EducationSection';
import SkillsSection from './components/sections/SkillsSection';
import ProjectsSection from './components/sections/ProjectsSection';
import AchievementsSection from './components/sections/AchievementsSection';
import ContactSection from './components/sections/ContactSection';
import Footer from './components/FooterNew';
import ScrollDots from './components/ScrollDots';

function App() {
  return (
    <>
      {/* Floating Background */}
      <div className="floating-bg">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-orb orb-4"></div>
        <div className="floating-orb orb-5"></div>
      </div>

      <Header />
      <ScrollDots />
      <div className="main-scroll">
        <main>
          <Hero />
          <AboutSection />
          <EducationSection />
          <SkillsSection />
          <ProjectsSection />
          <AchievementsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
