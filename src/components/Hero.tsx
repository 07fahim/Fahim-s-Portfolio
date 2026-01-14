import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';

const ROLES = [
  'AI/ML Engineer',
  'Data Scientist',
  'Computer Vision Expert',
  'Deep Learning Researcher',
  'NLP Specialist',
  'Flutter Developer',
];

const Hero = () => {
  const [currentRole, setCurrentRole] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const currentFullRole = ROLES[roleIndex];
    const typeSpeed = isDeleting ? 50 : 100;

    let pauseTimeout: ReturnType<typeof setTimeout> | undefined;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentRole.length < currentFullRole.length) {
          setCurrentRole(currentFullRole.substring(0, currentRole.length + 1));
        } else {
          pauseTimeout = setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentRole.length > 0) {
          setCurrentRole(currentRole.substring(0, currentRole.length - 1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }
      }
    }, typeSpeed);

    return () => {
      clearTimeout(timeout);
      if (pauseTimeout) clearTimeout(pauseTimeout);
    };
  }, [currentRole, isDeleting, roleIndex]);

  return (
    <section id="hero" className="hero-wrap">
      {/* Background Layer */}
      <div className="bg-layer">
        <span className="bg-text">FAHIM</span>
        <span className="stars stars1"></span>
        <span className="stars stars2"></span>
        <span className="stars stars3"></span>
        <div className="blob b1"></div>
        <div className="blob b2"></div>
        <div className="blob b3"></div>
      </div>

      <div className="hero-inner">
        {/* Left Side */}
        <div className="hero-left">
          <h1 className="hero-title inter">Building AI<br />Solutions</h1>
          <p className="hero-desc doto">
            AI/ML Engineer & Data Scientist building Generative AI systems, AI agents, and Computer Vision solutions with Explainable AI.
          </p>
        </div>

        {/* Center - Photo */}
        <div className="hero-center">
          <div className="photo-wrapper">
            <img
              src="https://avatars.githubusercontent.com/u/137498587?v=4"
              alt="Fahim Faiyaz"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/initials/svg?seed=FF&backgroundColor=C2B280';
              }}
            />
            <div className="fade-mask"></div>
          </div>
          <h2 className="hero-name" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Gazi Mohammad Fahim Faiyaz</h2>
          <p className="hero-alias doto">
            {currentRole}<span className="typewriter-cursor">|</span>
          </p>
        </div>

        {/* Right Side */}
        <div className="hero-right">
          <h1 className="hero-title inter">Research &<br />Innovation</h1>
          <p className="hero-desc doto">
            Actively conducting research and experimentation in AI/ML, Computer Vision, Generative AI, and Explainable AI.
          </p>
        </div>
      </div>

      <p className="hero-sub doto">
        AI/ML Engineer and Data Scientist specializing in Deep Learning, Computer Vision, NLP, and Generative AI, with a strong focus on building scalable, real-world AI systems. Actively engaged in applied AI research, model experimentation, and deployment, with peer-reviewed research contributions presented at IEEE-recognized international conferences (2024-2025).
      </p>

      <div className="hero-ctas">
        <a href="#contact" className="btn" onClick={(e) => {
          e.preventDefault();
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          <Mail size={16} style={{ marginRight: '8px', display: 'inline' }} />
          Get In Touch
        </a>
        <a
          href="https://github.com/07fahim"
          target="_blank"
          rel="noopener noreferrer"
          className="btn ghost"
        >
          <Github size={16} style={{ marginRight: '8px', display: 'inline' }} />
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/fahim-faiyaz"
          target="_blank"
          rel="noopener noreferrer"
          className="btn ghost"
        >
          <Linkedin size={16} style={{ marginRight: '8px', display: 'inline' }} />
          LinkedIn
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          className="btn ghost"
        >
          <FileText size={16} style={{ marginRight: '8px', display: 'inline' }} />
          Resume
        </a>
      </div>
    </section>
  );
};

export default Hero;
