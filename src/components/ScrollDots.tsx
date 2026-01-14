import { useState, useEffect } from 'react';

const SECTIONS = ['hero', 'about', 'timeline', 'skills', 'projects', 'achievements', 'contact'];

const ScrollDots = () => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.main-scroll');
      if (!scrollContainer) return;

      const windowHeight = window.innerHeight;

      SECTIONS.forEach((section, index) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            setActiveSection(index);
          }
        }
      });
    };

    const scrollContainer = document.querySelector('.main-scroll');
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="scroll-dots">
      {SECTIONS.map((section, index) => (
        <button
          key={section}
          className={`scroll-dot ${activeSection === index ? 'active' : ''}`}
          onClick={() => scrollToSection(section)}
          aria-label={`Go to ${section} section`}
        />
      ))}
    </div>
  );
};

export default ScrollDots;
