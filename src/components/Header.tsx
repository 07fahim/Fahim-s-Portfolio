import { useState } from 'react';
import { Menu, X, Home, User, Folder, GraduationCap, Mail, Wrench, Award } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', icon: Home, section: 'hero' },
    { label: 'About', icon: User, section: 'about' },
    { label: 'Timeline', icon: GraduationCap, section: 'timeline' },
    { label: 'Skills', icon: Wrench, section: 'skills' },
    { label: 'Projects', icon: Folder, section: 'projects' },
    { label: 'Achievements', icon: Award, section: 'achievements' },
    { label: 'Contact', icon: Mail, section: 'contact' },
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => scrollTo('hero')}>
        <span className="logo-icon">⚡</span>
        <span>FAHIM</span>
      </div>

      <button className="hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`nav ${isOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <button key={item.section} onClick={() => scrollTo(item.section)}>
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
